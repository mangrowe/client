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
      ]
    }
  },
  computed: {
    teams() {
      return this.$store.state.teams.all;
    }
  },
  mounted() {
    this.$store.dispatch('teams/index', {
      url: this.$mangrowe.url,
      token: this.$mangrowe.token
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
