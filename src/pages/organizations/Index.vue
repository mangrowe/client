<template>
  <q-page padding>
    <h3>
      <a href="https://docs.mangrowe.com/pt-br/administration/#criando-uma-organizacao" target="_blank"  style="text-decoration: none">
        <q-icon name="help_outline" size="xs" class="text-grey-5 q-headline" />
      </a>
      Organizações
      <q-btn push color="orange-9" to="organizations/create">
        Criar
      </q-btn>
    </h3>
    <q-table 
      title="Organizações"
      :columns="columns"
      :data="organizations"
      no-data-label="Sem registros disponíveis"
      rows-per-page-label="Linhas por páginas"
      :pagination-label="paginate"
      :pagination.sync="pagination"
    >
      <q-tr slot="body" slot-scope="props" :props="props" @click.native="edit(props.row)" class="cursor-pointer">
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
        }
      ],
      organizations: [],
      pagination: {
        rowsPerPage: 15
      }
    }
  },
  mounted() {
    Loading.show({message: 'Carregando...'});
    this.$axios.get(this.$mangrowe.url +'/organizations', { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
        this.organizations = response.data;
        Loading.hide();
    });
  },
  methods: {
    edit(organization) {
      this.$router.push('organizations/edit/'+ organization.id);
    },
    paginate(start, end, total) {
      return start + ' até ' + end + ' de ' + total;
    }
  }
}

</script>

<style>
</style>
