<template>
  <q-page padding>
    <h3>
      Impedimentos
      <q-btn-group push>
        <q-btn push color="orange-9" @click="open()">
          Criar
        </q-btn>
        <q-btn push color="secondary" @click="showKeyResult()">
          Resultado chave
        </q-btn>
      </q-btn-group>
    </h3>
    <q-table 
      :columns="columns"
      :data="impediments"
      no-data-label="Sem registros disponíveis"
      rows-per-page-label="Linhas por páginas"
      :pagination-label="paginate"
      :pagination.sync="pagination"
    >
      <q-tr slot="body" slot-scope="props" :props="props" @click.native="show(props.row)" class="cursor-pointer">
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.value }}
        </q-td>
      </q-tr>
    </q-table>
  </q-page>
</template>

<script>
import { Loading } from 'quasar'; 

export default {
  data() {
    return {
      impediments: [],
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
          name: 'status_name',
          field: 'status_name',
          align: 'left',
          label: 'Situação',
          sortable: true
        }
      ],
      pagination: {
        rowsPerPage: 15
      }
    }
  },
  methods: {
    show(impediment) {
      this.$router.push('/impediments/'+ impediment.id);
    },
    paginate(start, end, total) {
      return start + ' até ' + end + ' de ' + total;
    },
    open() {
      this.$router.push('/impediments/create?key_result_id=' + this.$route.query.key_result_id);
    },
    showKeyResult() {
      this.$router.push('/keyResults/' + this.$route.query.key_result_id);
    }
  },
  mounted() {
    Loading.show({message: 'Carregando...'});
    this.$axios.get(this.$mangrowe.url +'/impediments?key_result_id='+ this.$route.query.key_result_id, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
      for(let i = 0; i < response.data.impediments.length; i++) {
        let status = response.data.impediments[i].children.length ? response.data.impediments[i].children[response.data.impediments[i].children.length - 1].status_name : response.data.impediments[i].status_name;
        this.impediments.push({
          id: response.data.impediments[i].id,
          created_at: this.$mangrowe.dated(response.data.impediments[i].created_at),
          user: response.data.impediments[i].user.name,
          status_name: status 
        });  
      }
      Loading.hide();
    });
  }
}
</script>

<style>
</style>
