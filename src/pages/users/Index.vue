<template>
  <q-page padding>
    <h3>
      Usuários
      <q-btn push color="orange-9" to="users/create">
        Criar
      </q-btn>
    </h3>
    <q-table 
      title="Usuários"
      :columns="columns"
      :data="users"
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
          name: 'name',
          field: 'name',
          align: 'left',
          label: 'Nome',
          sortable: true
        },
        {
          name: 'email',
          field: 'email',
          align: 'left',
          label: 'E-mail',
          sortable: true
        }
      ],
      users: [],
      pagination: {
        rowsPerPage: 15
      }
    }
  },
  mounted() {
    this.$axios.get(this.$mangrowe.url +'/users', { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
        this.users = response.data;
    });
  },
  methods: {
    edit(user) {
      this.$router.push('users/edit/'+ user.id);
    },
    paginate(start, end, total) {
      return start + ' até ' + end + ' de ' + total;
    }
  }
}

</script>

<style>
</style>
