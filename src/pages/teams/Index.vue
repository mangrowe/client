<template>
  <q-page padding>
    <h3>
      Times
      <q-btn push color="orange-9" to="teams/create">
        Novo
      </q-btn>
    </h3>
    <q-table 
      title="Times"
      :columns="columns"
      :data="teams"
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
      teams: [],
      pagination: {
        rowsPerPage: 15
      }
    }
  },
  mounted() {
    this.$axios.get(this.$mangrowe.url +'/teams?organization_id='+ this.$mangrowe.organization_id, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
        this.teams = response.data;
    });
  },
  methods: {
    edit(team) {
      this.$router.push('teams/edit/'+ team.id);
    },
    paginate(start, end, total) {
      return start + ' até ' + end + ' de ' + total;
    }
  }
}
</script>

<style>
</style>
