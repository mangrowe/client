<template>
  <q-page padding>
    <h3>
      Configurações
      <q-btn push color="orange-9" to="settings/create">
        Criar
      </q-btn>
    </h3>
    <q-table 
      title="Configurações"
      :columns="columns"
      :data="settings"
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
      settings: [],
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
          name: 'code',
          field: 'code',
          align: 'left',
          label: 'Código',
          sortable: true
        },
        {
          name: 'info',
          field: 'info',
          align: 'left',
          label: 'Valor',
          sortable: true
        }
      ]
    }
  },
  mounted() {
    this.$axios.get(this.$mangrowe.url +'/settings?organization_id='+ this.$mangrowe.organization_id, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
        this.settings = response.data;
    });
  },
  methods: {
    edit(setting) {
      this.$router.push('settings/edit/'+ setting.id);
    },
    paginate(start, end, total) {
      return start + ' até ' + end + ' de ' + total;
    }
  }
}
</script>

<style>
</style>
