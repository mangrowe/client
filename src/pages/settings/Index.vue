<template>
  <q-page padding>
    <h3>
      Configurações
      <q-btn push color="orange-9" to="settings/create">
        Criar
      </q-btn>
    </h3>
    <div v-if="message.text != ''">
      <q-alert :color="message.color">
        {{ message.text }}
      </q-alert>
    </div>
    <div>
    <q-tabs v-model="selected" color="orange-9">
      <q-tab default slot="title" name="tab-1" label="Régua" icon="color_lens" />
      <q-tab slot="title" name="tab-2" label="Backups" icon="storage" />

      <q-tab-pane name="tab-1">
        <q-table 
          title="Régua"
          :columns="columns"
          :data="settings"
          no-data-label="Sem registros disponíveis"
          rows-per-page-label="Linhas por páginas"
          :pagination-label="paginate"
        >
          <q-tr slot="body" slot-scope="props" :props="props" @click.native="edit(props.row)" class="cursor-pointer">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.value }}
            </q-td>
          </q-tr>
        </q-table>
      </q-tab-pane>
      <q-tab-pane name="tab-2">
        <q-btn push color="orange-9" @click="createBackup()">
          Criar backup
        </q-btn>
        <a :href="downloadUrl" v-show="downloadUrl" download>Baixe aqui o arquivo</a>
        <q-list class="q-my-sm">
          <q-item v-bind:key="backup" v-for="backup in backups">
            <q-item-main :label="backup" />
            <q-item-side right color="primary" icon="settings_backup_restore" @click.native="doRestore(backup)" title="Restaurar" />
            <q-item-side right color="tertiary" icon="cloud_download" @click.native="doDownload(backup)" title="Download" />
          </q-item>  
        </q-list>
      </q-tab-pane>
    </q-tabs>
    </div>
  </q-page>
</template>

<script>
import { Loading, QSpinnerGears } from 'quasar';

export default {
  data() {
    return {
      settings: [],
      backups: [],
      downloadUrl: '',
      columns: [
        {
          name: 'id',
          field: 'id',
          align: 'left',
          label: '#',
          sortable: true
        },
        {
          name: 'title',
          field: 'title',
          align: 'left',
          label: 'Título',
          sortable: true
        },
        {
          name: 'code',
          field: 'code',
          align: 'left',
          label: 'Código',
          sortable: true
        },
        {
          name: 'info',
          field: 'info',
          align: 'left',
          label: 'Valor',
          sortable: true
        }
      ],
      selected: 'tab-1',
      message: { color: '', text: '' }
    }
  },
  mounted() {
    this.$axios.get(this.$mangrowe.url +'/settings?organization_id='+ this.$mangrowe.organization_id, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
        this.settings = response.data.settings;
        this.backups = response.data.backups.reverse();
    });
  },
  methods: {
    edit(setting) {
      this.$router.push('settings/edit/'+ setting.id);
    },
    paginate(start, end, total) {
      return start + ' até ' + end + ' de ' + total;
    },
    selectTab(i) {
      this.selected = 'tab-' + i
    },
    createBackup() {
      this.$q.dialog({
        title: 'Atenção',
        message: 'Deseja realmente realizar o backup?',
        ok: 'Sim',
        cancel: 'Não'
      }).then(() => {
        Loading.show({spinner: QSpinnerGears, message: 'Realizando backup do banco de dados, aguarde.'});
        this.$axios.post(this.$mangrowe.url +'/settings/backups', {}, { headers: 
          {'Authorization': 'Bearer '+ this.$mangrowe.token}
        }).then((response) => {
            this.backups.unshift(response.data.backup);
            this.message.color = 'green';
            this.message.text = response.data.message;
            window.scrollTo(0, 0);
            Loading.hide();
        }).catch((err) => {
            Loading.hide();
            this.message.color = 'red';
            this.message.text = err.response.data.message;
        });
      }).catch((err) => {
        this.$q.notify('Operação não realizada.');
      });
    },
    doRestore(backup) {
      console.log('Restore', backup);
    },
    doDownload(backup) {
      Loading.show({spinner: QSpinnerGears, message: 'Solicitando arquivo para download, aguarde.'});
      this.$axios.post(this.$mangrowe.url +'/settings/downloader', {
        backup: backup
      }, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
      }).then((response) => {
          this.downloadUrl = response.data.url;
          this.message.color = 'green';
          this.message.text = response.data.message;
          window.scrollTo(0, 0);
          Loading.hide();
      }).catch((err) => {
          Loading.hide();
          this.message.color = 'red';
          this.message.text = err.response.data.message;
      });
    }
  }
}
</script>

<style scoped>
a {
  margin: 0 10px;
  color: #ef6c00;
}
</style>
