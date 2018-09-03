<template>
  <q-page padding>
    <h3>
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
      keyResults: []
    }
  },
  mounted() {
    this.$axios.get(this.$mangrowe.url +'/keyResults?organization_id='+ this.$mangrowe.organization_id, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
        this.keyResults = response.data;
    });
  },
  methods: {
    edit(keyResult) {
      this.$router.push('keyResults/edit/'+ keyResult.id);
    },
    paginate(start, end, total) {
      return start + ' até ' + end + ' de ' + total;
    }
  }
}
</script>

<style>
</style>
