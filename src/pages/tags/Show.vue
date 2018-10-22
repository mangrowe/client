<template>
  <q-page padding>
    <h3>
      Objetivos por tag
    </h3>
    <div v-if="message.text != ''">
      <q-alert :color="message.color">
        {{ message.text }}
      </q-alert>
    </div>
    <q-table 
      title="Objetivos"
      :columns="columns"
      :data="objectives"
      no-data-label="Sem registros disponíveis"
      rows-per-page-label="Linhas por páginas"
      :pagination-label="paginate"
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
export default {
  data() {
    return {
      objectives: [],
      title: null,
      cycles: [],
      cycle_id: null,
      departments: [],
      department_id: null,
      users: [],
      user_id: null,
      description: null,
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
      message: { color: '', text: '' }
    }
  },
  mounted() {
    this.$axios.get(this.$mangrowe.url +'/tags/'+ this.$route.params.id, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
        for(let i = 0; i < response.data.objectives.length; i++) {
          this.objectives.push({
            id: response.data.objectives[i].id,
            cycle: response.data.objectives[i].cycle.title,
            title: response.data.objectives[i].title,
            level: response.data.objectives[i].level
          });
        }
    });
  },
  methods: {
    show(objective) {
      this.$router.push('/objectives/'+ objective.id);
    },
    paginate(start, end, total) {
      return start + ' até ' + end + ' de ' + total;
    }
  }
}

</script>

<style>
</style>
