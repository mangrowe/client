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
    <div id="chart"></div>
    <q-table 
      title="Check-ins"
      :columns="columns"
      :data="checkIns"
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
import ApexCharts from 'apexcharts';

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
      checkIns: [],
      options: {
        chart: {
          height: 300,
          type: 'line',
          zoom: {
              enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight'
        },
        title: {
          text: 'Evolução de check-ins',
          align: 'left'
        },
        series: [{
          name: 'Check Ins',
          data: []
        }],
        xaxis: {
          categories: []
        }
      },
      pagination: {
        rowsPerPage: 15
      }
    }
  },
  mounted() {
    this.$axios.get(this.$mangrowe.url +'/checkIns?key_result_id='+ this.$route.params.id, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
      let data = [];
      this.options.xaxis.categories.push(0);
      for(let i = 0; i < response.data.checkIns.length; i++) {
        this.checkIns.push({
          id: response.data.checkIns[i].id,
          user: response.data.checkIns[i].user.name,
          previous: this.$mangrowe.format(response.data.checkIns[i].previous, response.data.keyResults.format),
          current: this.$mangrowe.format(response.data.checkIns[i].current, response.data.keyResults.format),
          confidance: response.data.checkIns[i].confidance
        });
        data.push(parseInt(response.data.checkIns[i].current));
        this.options.xaxis.categories.push(i + 1);
      }
      data.push(parseInt(response.data.keyResults.initial));
      this.options.series[0].data = data.reverse();
      const chart = new ApexCharts(
          document.querySelector("#chart"),
          this.options
      );
      chart.render();
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
