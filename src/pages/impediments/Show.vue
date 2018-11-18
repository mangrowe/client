<template>
  <q-page padding>
    <h3>
      Impedimento
      <q-btn-group push>
        <q-btn icon="note_add" push color="orange-9" @click="answer()">
          Responder
        </q-btn>
        <q-btn push color="secondary" @click="showKeyResult()">
          Resultado chave
        </q-btn>
      </q-btn-group>
    </h3>
    <q-list>
      <q-collapsible opened icon="notification_important" label="Detalhes">
        <div>
          <p><b><q-icon name="assignment" /> Objetivo </b><br> {{ objective }}</p>
          <p><b><q-icon name="vpn_key" /> Resultado chave </b><br> {{ keyResult }}</p>
          <p><b><q-icon name="notification_important" /> Impedimento </b><br><span v-html="impediment.description"></span></p>
        </div>
      </q-collapsible>
    </q-list>
    <q-table 
      :columns="columns"
      :data="impediments"
      no-data-label="Sem registros disponíveis"
      rows-per-page-label="Linhas por páginas"
      :pagination-label="paginate"
      :pagination.sync="pagination"
    >
      <q-tr slot="body" slot-scope="props" :props="props">
        <q-td key="created_at" :props="props">{{ props.row.created_at }}</q-td>
        <q-td key="user" :props="props">{{ props.row.user }}</q-td>
        <q-td key="receiver" :props="props">{{ props.row.receiver }}</q-td>
        <q-td key="description" :props="props" @click.native="show(props.row)" class="pointer"><span v-html="props.row.description.substring(0, 20)"></span>...</q-td>
        <q-td key="status" :props="props">{{ props.row.status }}</q-td>
        <q-td key="archive" :props="props">
          <q-btn v-if="props.row.archive" icon="cloud_download" @click="urlDownload(props.row.archive)" size="sm"/>
        </q-td>
      </q-tr>
    </q-table>
    <q-modal v-model="opened" content-css="padding: 0px 20px 30px 20px; margin: 30px;">
      <h4>Descrição</h4>
      <p v-html="theDescription"></p>
      <q-btn
        color="orange-9"
        @click="opened = false"
        label="Fechar"
        push
        class="float-right"
      />
    </q-modal>
  </q-page>
</template>

<script>
import { openURL, LocalStorage } from 'quasar';

export default {
  data() {
    return {
      objective: '',
      keyResult: '',
      description: '',
      impediment: {},
      impediments: [],
      user_id: null,
      users: [],
      errors: [],
      error_description: false,
      columns: [
        {
          name: 'created_at',
          field: 'created_at',
          align: 'left',
          label: 'Data/Hora',
          sortable: true
        },
        {
          name: 'user',
          field: 'user',
          align: 'left',
          label: 'Solicitante',
          sortable: true
        },
        {
          name: 'receiver',
          field: 'receiver',
          align: 'left',
          label: 'Solicitado',
          sortable: true
        },
        {
          name: 'description',
          field: 'description',
          align: 'left',
          label: 'Descrição',
          sortable: true
        },
        {
          name: 'status',
          field: 'status',
          align: 'left',
          label: 'Situação',
          sortable: true
        },
        {
          name: 'archive',
          field: 'archive',
          align: 'left',
          label: 'Arquivo',
          sortable: true
        }
      ],
      opened: false,
      theDescription: '',
      pagination: {
        rowsPerPage: 15
      }
    }
  },
  methods: {
    paginate(start, end, total) {
      return start + ' até ' + end + ' de ' + total;
    },
    answer() {
      this.$router.push('/impediments/create?key_result_id=' + this.impediment.key_result_id + '&parent_id=' + this.$route.params.id);
    },
    showKeyResult() {
      this.$router.push('/keyResults/' + this.impediment.key_result_id);
    },
    urlDownload(archive) {
      openURL(this.$mangrowe.url.replace('/api/v1', '') + '/uploads/' + archive);
    },
    show(impediment) {
      this.theDescription = impediment.description;
      this.opened = true;
    }
  },
  mounted() {
    this.$axios.get(this.$mangrowe.url +'/impediments/'+ this.$route.params.id, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
      this.objective = response.data.objective;
      this.keyResult = response.data.keyResult;
      this.impediment = response.data.impediment;
      this.impediments.push({
          created_at: this.$mangrowe.dated(this.impediment.created_at),
          user: this.impediment.user.name,
          receiver: this.impediment.receiver ? this.impediment.receiver.name : null,
          description: this.impediment.description,
          status: this.impediment.status_name,
          archive: this.impediment.archive
      });
      for(let i = 0; i < response.data.impediments.length; i++) {
        this.impediments.push({
          created_at: this.$mangrowe.dated(response.data.impediments[i].created_at),
          user: response.data.impediments[i].user.name,
          receiver: response.data.impediments[i].receiver ? response.data.impediments[i].receiver.name : null,
          description: response.data.impediments[i].description,
          status: response.data.impediments[i].status_name,
          archive: response.data.impediments[i].archive
        });
      }
      for(let i = 0; i < response.data.users.length; i++) {
        this.users.push({
            label: response.data.users[i].name,
            value: response.data.users[i].id
        });
      }
    }).catch((err) => {
      if(err.response == undefined) {
        LocalStorage.clear();
        this.$router.push('/login');
      }
    });
  }
}
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
</style>
