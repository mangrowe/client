<template>
  <q-page padding>
    <h3>
      <a href="https://docs.mangrowe.com/pt-br/administration/#criando-usuario" target="_blank"  style="text-decoration: none">
        <q-icon name="help_outline" size="xs" class="text-grey-5 q-headline" />
      </a>
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
    Loading.show({message: 'Carregando...'});
    this.$axios.get(this.$mangrowe.url +'/users?organization_id='+ this.$mangrowe.organization_id, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
        this.users = response.data;
        Loading.hide();
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
