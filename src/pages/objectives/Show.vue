<template>
  <q-page padding>
    <h3>
      {{ title }}
    </h3>
    <div class="row">
      <div class="col-8">
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
      </div>
      <div class="col-4 text-center">
        <q-knob
          id="progress"
          v-model="progress"
          size="12rem"
          readonly
        >
          {{ progress }}%
        </q-knob>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      progress: 0,
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
      keyResults: [],
      objectiveProgress: []
    }
  },
  mounted() {
    this.$axios.get(this.$mangrowe.url +'/objectives/'+ this.$route.params.id, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
        this.title = response.data.title;
        this.keyResults = response.data.key_results;
        this.progressBar();
    });
  },
  methods: {
    edit(keyResult) {
      this.$router.push('/keyResults/edit/'+ keyResult.id);
    },
    paginate(start, end, total) {
      return start + ' até ' + end + ' de ' + total;
    },
    progressBar() {
      for(var i = 0; i < this.keyResults.length; i++) {
        if(this.keyResults[i].type == 'boolean') {
          this.objectiveProgress.push(Math.round(Math.abs(this.keyResults[i].current / this.keyResults[i].target) * 100));
        }else {
          if(this.keyResults[i].criteria == 'gte') {
            this.objectiveProgress.push(Math.round(Math.abs((this.keyResults[i].current - this.keyResults[i].initial) / (this.keyResults[i].target - this.keyResults[i].initial)) * 100));
          }else {
            this.objectiveProgress.push(Math.round(Math.abs((this.keyResults[i].initial - this.keyResults[i].current) / (this.keyResults[i].initial - this.keyResults[i].target)) * 100));
          }
        }
      }
      if(this.objectiveProgress.length) {
        let total = this.objectiveProgress.reduce((a, i) => a + i);
        let current = total / this.keyResults.length;
        this.progress = parseFloat(current.toFixed(1));
        for(var i = 0; i < this.$mangrowe.settings.length; i++) {
          if(this.$mangrowe.settings[i].code == 'ruler') {
            if(this.progress <= this.$mangrowe.settings[i].info) {
              document.getElementById('progress').style.color = this.$mangrowe.settings[i].additional;
              break;
            }
          }
        }
      }
    },
  }
}
</script>

<style>
#progress {
  font-size: 3rem;
}
</style>
