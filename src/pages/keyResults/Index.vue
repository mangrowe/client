<template>
  <q-page padding>
    <h3>
      <a href="https://docs.mangrowe.com/pt-br/administration/#criando-objetivo-resultado-chave-e-check-in" target="_blank"  style="text-decoration: none">
        <q-icon name="help_outline" size="xs" class="text-grey-5 q-headline" />
      </a>
      Resultados chave
      <q-btn push color="orange-9" to="keyResults/create">
        Novo
      </q-btn>
    </h3>
    <q-table 
      title="Resultados chave"
      :columns="columns"
      :data="keyResults"
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
          name: 'initial',
          field: 'initial',
          align: 'left',
          label: 'Início',
          sortable: true
        },
        {
          name: 'current',
          field: 'current',
          align: 'left',
          label: 'Atual',
          sortable: true
        },
        {
          name: 'target',
          field: 'target',
          align: 'left',
          label: 'Alvo',
          sortable: true
        }
      ],
      keyResults: [],
      pagination: {
        rowsPerPage: 15
      }
    }
  },
  mounted() {
    Loading.show({message: 'Carregando...'});
    this.$axios.get(this.$mangrowe.url +'/keyResults?organization_id='+ this.$mangrowe.organization_id, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
      for(let i = 0; i < response.data.length; i++) {
        this.keyResults.push({
          id: response.data[i].id,
          title: response.data[i].title.length > 25 ? response.data[i].title.substring(0, 25) + '...' : response.data[i].title,
          initial: this.$mangrowe.format(response.data[i].initial, response.data[i].format),
          current: this.$mangrowe.format(response.data[i].current, response.data[i].format),
          target: this.$mangrowe.format(response.data[i].target, response.data[i].format),
        });
      }
      Loading.hide();
    });
  },
  methods: {
    show(keyResult) {
      this.$router.push('keyResults/'+ keyResult.id);
    },
    paginate(start, end, total) {
      return start + ' até ' + end + ' de ' + total;
    }
  }
}
</script>

<style>
</style>
