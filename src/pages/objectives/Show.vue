<template>
  <q-page padding>
    <h3>
      {{ title }}
    </h3>
    <div class="row">
      <div class="col-12">
        <q-breadcrumbs active-color="tertiary" color="tertiary">
          <q-icon name="arrow_forward" slot="separator" slot-scope="props" />
          <q-breadcrumbs-el label="Objetivo" icon="assignment" />
          <q-breadcrumbs-el label="Resultados chave" icon="vpn_key" />
        </q-breadcrumbs>
      </div>
    </div>
    <q-list>
      <q-collapsible group="somegroup" :opened="true" icon="vpn_key" label="Resultados chave">
        <div>
          <div class="row">
            <div class="col-12 col-md-4 text-center desktop-hide">
              <q-knob
                class="progress"
                v-model="progress"
                size="12rem"
                readonly
              >
                {{ progress }}%
              </q-knob>
            </div>
            <div class="col-12 col-md-8">
              <div>
                <q-btn push color="orange-9" @click="keyResultCreate()">
                  <q-icon name="note_add" /> adicionar
                </q-btn>
              </div><br>
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
            <div class="col-12 col-md-4 text-center mobile-hide">
              <q-knob
                class="progress"
                v-model="progress"
                size="12rem"
                readonly
              >
                {{ progress }}%
              </q-knob>
            </div>
          </div>
        </div>
      </q-collapsible>
      <q-collapsible group="somegroup" icon="assignment" label="Informações do objetivo">
        <div>
          <div class="row">
            <div class="col-12">
              <p><b><q-icon name="title" /> Título </b><br> {{ title }}</p>
              <p><b><q-icon name="donut_large" /> Ciclo </b><br> {{ cycle }}</p>
              <p><b><q-icon name="account_balance" /> Unidade organizacional </b><br> {{ department }}</p>
              <p><b><q-icon name="description" /> Descrição </b><br> <span v-html="description"></span></p>
            </div>
          </div>
          <div class="row">
            <div class="col-6">
              <p><b><q-icon name="assignment" /> Objetivo vinculado </b><br> {{ parent }}</p>
            </div>
            <div class="col-6">
              <p><b><q-icon name="group" /> Time </b><br> {{ team }}</p>
            </div>
          </div>
          <div class="row">
            <div class="col-6">
              <p><b><q-icon name="person" />Responsável </b><br> {{ user }}</p>
            </div>
            <div class="col-6">
              <p><b><q-icon name="drag_handle" /> Nível </b><br> {{ level }}</p>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <p><b><q-icon name="bookmarks" />Tags </b><br> 
                <q-chip color="orange-9" v-bind:key="index" v-for="(tag, index) in tags">
                  {{ tag.title }}
                </q-chip>
              </p>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <q-btn-group push class="float-right">
                <q-btn push color="orange-9" @click="editObjective()" class="q-pa-sm" icon="edit" label="Editar" />
              </q-btn-group>
            </div>
          </div>
        </div>
      </q-collapsible>
    </q-list>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      id: null,
      title: '',
      cycle: '',
      department: '',
      description: '',
      parent: '',
      team: '',
      user: '',
      level: '',
      tags: [],
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
        this.id = response.data.id;
        this.title = response.data.title;
        this.cycle = response.data.cycle.title;
        this.department = response.data.department.title;
        this.description = response.data.description;
        if(response.data.parent != undefined) {
          this.parent = response.data.parent.title;
        }else {
          this.parent = 'Nenhum';
        }
        this.team = response.data.team.title;
        this.user = response.data.user.name;
        if(response.data.level == 'strategic') {
          this.level = 'Estratégico';
        }else if(response.data.level == 'tactical') {
          this.level = 'Tático';
        }else {
          this.level = 'Operacional';
        }
        for(let i = 0; i < response.data.key_results.length; i++) {
          this.keyResults.push({
            id: response.data.key_results[i].id,
            title: response.data.key_results[i].title,
            initial: this.$mangrowe.format(response.data.key_results[i].initial, response.data.key_results[i].format),
            current: this.$mangrowe.format(response.data.key_results[i].current, response.data.key_results[i].format),
            target: this.$mangrowe.format(response.data.key_results[i].target, response.data.key_results[i].format),
          });
        }
        if(response.data.tags != undefined) {
          this.tags = response.data.tags;
        }
        this.progressBar();
    });
  },
  methods: {
    edit(keyResult) {
      this.$router.push('/keyResults/'+ keyResult.id);
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
            this.objectiveProgress.push(Math.round(Math.abs((this.$mangrowe.deformat(this.keyResults[i].current) - this.$mangrowe.deformat(this.keyResults[i].initial)) / (this.$mangrowe.deformat(this.keyResults[i].target) - this.$mangrowe.deformat(this.keyResults[i].initial))) * 100));
          }else {
            this.objectiveProgress.push(Math.round(Math.abs((this.$mangrowe.deformat(this.keyResults[i].initial) - this.$mangrowe.deformat(this.keyResults[i].current)) / (this.$mangrowe.deformat(this.keyResults[i].initial) - this.$mangrowe.deformat(this.keyResults[i].target))) * 100));
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
              document.querySelectorAll('.progress')[0].style.color = this.$mangrowe.settings[i].additional;
              document.querySelectorAll('.progress')[1].style.color = this.$mangrowe.settings[i].additional;
              break;
            }
          }
        }
      }
    },
    keyResultCreate() {
      this.$router.push('/keyResults/create?objective_id='+ this.id);
    },
    editObjective() {
      this.$router.push('/objectives/edit/' + this.id);
    }
  }
}
</script>

<style>
.progress {
  font-size: 3rem;
}
p {
  border-bottom: 1px solid #d2d2d2;
}
</style>
