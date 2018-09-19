<template>
  <q-page padding>
    <h3>
      Check-ins
      <q-btn-group push>
        <q-btn push color="orange-9" to="checkIns/create">
          Novo
        </q-btn>
        <q-btn push color="secondary" @click="keyResult()">
          Resultado chave
        </q-btn>
      </q-btn-group>
    </h3>
    <q-table 
      title="Check-ins"
      :columns="columns"
      :data="checkIns"
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
          name: 'user',
          field: 'user',
          align: 'left',
          label: 'Colaborador',
          sortable: true
        },
        {
          name: 'previous',
          field: 'previous',
          align: 'left',
          label: 'Anterior',
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
          name: 'confidance',
          field: 'confidance',
          align: 'left',
          label: 'Confiança',
          sortable: true
        }
      ],
      checkIns: []
    }
  },
  mounted() {
    this.$axios.get(this.$mangrowe.url +'/checkIns?key_result_id='+ this.$route.params.id, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
        for(let i = 0; i < response.data.length; i++) {
          this.checkIns.push({
            id: response.data[i].id,
            user: response.data[i].user.name,
            previous: response.data[i].previous,
            current: response.data[i].current,
            confidance: response.data[i].confidance
          });
        }
    });
  },
  methods: {
    edit(checkIn) {
      this.$router.push('/checkIns/edit/'+ checkIn.id);
    },
    paginate(start, end, total) {
      return start + ' até ' + end + ' de ' + total;
    },
    keyResult() {
      this.$router.push('/keyResults/edit/'+ this.$route.params.id);
    }
  }
}
</script>

<style>
</style>
