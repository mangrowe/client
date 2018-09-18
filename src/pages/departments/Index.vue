<template>
  <q-page padding>
    <h3>
      Unidades organizacionais
      <q-btn-group push class="float-right">
        <q-btn push color="orange-9" to="departments/create">
          Novo
        </q-btn>
        <q-btn push color="secondary" to="departments/show">
          Organograma
        </q-btn>
      </q-btn-group>
    </h3>
    <q-table 
      title="Times"
      :columns="columns"
      :data="departments"
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
      ],
      departments: []
    }
  },
  mounted() {
    this.$axios.get(this.$mangrowe.url +'/departments?organization_id='+ this.$mangrowe.organization_id, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
        this.departments = response.data;
    });
  },
  methods: {
    edit(team) {
      this.$router.push('departments/edit/'+ team.id);
    },
    paginate(start, end, total) {
      return start + ' até ' + end + ' de ' + total;
    }
  }
}
</script>

<style>
</style>
