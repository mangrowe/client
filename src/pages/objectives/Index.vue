<template>
  <q-page padding>
    <h3>
      Objetivos
      <q-btn push color="orange-9" to="objectives/create">
        Criar
      </q-btn>
    </h3>
    <q-table 
      title="Times"
      :columns="columns"
      :data="objectives"
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
          name: 'cycle',
          field: 'cycle',
          align: 'left',
          label: 'Ciclo',
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
          name: 'level',
          field: 'level',
          align: 'left',
          label: 'Nível',
          sortable: true
        }
      ],
      objectives: []
    }
  },
  mounted() {
    this.$axios.get(this.$mangrowe.url +'/objectives?organization_id='+ this.$mangrowe.organization_id, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
        for(let i = 0; i < response.data.length; i++) {
          this.objectives.push({
            id: response.data[i].id,
            cycle: response.data[i].cycle.title,
            title: response.data[i].title,
            level: response.data[i].level
          });
        }
    });
  },
  methods: {
    edit(objective) {
      this.$router.push('objectives/edit/'+ objective.id);
    },
    paginate(start, end, total) {
      return start + ' até ' + end + ' de ' + total;
    }
  }
}

</script>

<style>
</style>
