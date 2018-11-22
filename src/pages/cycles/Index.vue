<template>
  <q-page padding>
    <h3>
      <a href="https://docs.mangrowe.com/pt-br/administration/#criando-um-ciclo" target="_blank"  style="text-decoration: none">
        <q-icon name="help_outline" size="xs" class="text-grey-5 q-headline" />
      </a>
      Ciclos
      <q-btn push color="orange-9" to="cycles/create">
        Criar
      </q-btn>
    </h3>
    <q-table 
      title="Ciclos"
      :columns="columns"
      :data="cycles"
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
import { date } from 'quasar';

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
          name: 'start_at',
          field: 'start_at',
          align: 'left',
          label: 'Início',
          sortable: true
        },
        {
          name: 'end_at',
          field: 'end_at',
          align: 'left',
          label: 'Fim',
          sortable: true
        }
      ],
      cycles: [],
      pagination: {
        rowsPerPage: 15
      }
    }
  },
  mounted() {
    this.$axios.get(this.$mangrowe.url +'/cycles?organization_id='+ this.$mangrowe.organization_id, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
      for(let i = 0; i < response.data.length; i++) {
        this.cycles.push({
          id: response.data[i].id,
          title: response.data[i].title,
          start_at: this.$mangrowe.dateHuman(response.data[i].start_at),
          end_at: this.$mangrowe.dateHuman(response.data[i].end_at)
        })
      }
    });
  },
  methods: {
    edit(cycle) {
      this.$router.push('cycles/edit/'+ cycle.id);
    },
    paginate(start, end, total) {
      return start + ' até ' + end + ' de ' + total;
    }
  }
}

</script>

<style>
</style>
