<template>
  <q-page padding>
    <h3>
      Objetivos {{ progress }}%
      <q-btn-group push class="print-hide">
        <q-btn push color="orange-9" to="/objectives/create">
          Criar
        </q-btn>
        <q-btn push color="secondary" @click="showCard()">
          Filtrar
        </q-btn>
        <q-btn push color="blue-grey" to="/objectives">
          Tabela
        </q-btn>
        <q-btn push color="light-blue" @click="printer()" icon="print" />
      </q-btn-group>
    </h3>
    <q-card :hidden="searchForm">
      <div class="row">
        <div class="col-6">
          <q-field
          class="q-pa-sm"
          icon="donut_large">
            <q-select v-model="cycle_id" :options="cycles" float-label="Ciclo" color="orange-9" />
          </q-field>
        </div>
        <div class="col-6">
          <q-field
          class="q-pa-sm"
          icon="account_balance">
            <q-select v-model="department_id" :options="departments" float-label="Unidade organizacional" color="orange-9" />
          </q-field>
        </div>
      </div>
      <div class="row print-hide">
        <div class="col-12">
          <q-btn push color="secondary" @click="clearForm()" class="q-pa-sm q-ma-sm" icon="clear_all" label="Limpar" />
          <q-btn push color="orange-9" @click="searchQuery()" class="q-pa-sm q-ma-sm float-right" icon="search" label="Buscar" />
        </div>
      </div>
    </q-card>
    <div class="row">
      <div class="col-12">
        <q-card v-bind:key="index" v-for="(objective, index) in objectives" class="q-my-sm">
          <q-item class="bg-grey-2">
            <q-knob readonly :value="parseInt(objective.total)" size="50px" :min="0" :max="100" v-bind:id="index" :style="setting(objective.total)" />
            <q-item-main>
              <q-item-tile label class="q-pl-sm">{{ objective.title }}</q-item-tile>
              <q-item-tile sublabel class="q-pl-sm">{{ objective.user.name }} / {{ objective.team.title }}</q-item-tile>
            </q-item-main>
          </q-item>
          <q-card-separator />
          <q-item v-bind:key="i" v-for="(keyResult, i) in objective.key_results">            
            <q-item-main class="key-result" @click.native="checkIn(keyResult.id)">
              <q-item-tile label>{{ keyResult.title }}</q-item-tile>
              <q-item-tile sublabel class="dated">Última atualização em {{ keyResult.updated_at | dated }}</q-item-tile>
             {{ parseInt(keyResult.total) }}% <q-progress :percentage="keyResult.total" :style="setting(keyResult.total)" stripe animate height="10px" />
            </q-item-main>
          </q-item>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      objectives: [],
      cycles: [],
      cycle_id: null,
      departments: [],
      department_id: null,
      searchForm: true,
      progress: null
    }
  },
  methods: {
    setting(total) {
      let color = 'color: ';
      for(var i = 0; i < this.$mangrowe.settings.length; i++) {
        if(this.$mangrowe.settings[i].code == 'ruler') {
          if(total <= this.$mangrowe.settings[i].info) {
            color += this.$mangrowe.settings[i].additional;
            break;
          }
        }
      }
      return color + '!important;';
    },
    checkIn(id) {
      this.$router.push('/keyResults/edit/'+ id +'/checkIns/create');
    },
    searchQuery() {
      this.$axios.get(this.$mangrowe.url +'/objectives/dashboard', 
      {
        params: {
          quest: true,
          organization_id: this.$mangrowe.organization_id,
          cycle_id: this.cycle_id,
          department_id: this.department_id
        },
        headers: {'Authorization': 'Bearer '+ this.$mangrowe.token}      
      }).then((response) => {
          this.objectives = response.data.objectives;
          this.progress = this.calculateProgress(this.objectives);
      }).catch((err) => {
          this.message.color = 'red';
          this.message.text = response.data.message;
      });
    },
    clearForm() {
      this.cycle_id = null;
      this.department_id = null;
    },
    showCard() {
      this.searchForm = !this.searchForm;
    },
    calculateProgress(objectives) {
      let total = 0;
      for(let i = 0; i < objectives.length; i++) {
        total += objectives[i].total;
      }
      return parseInt(total / objectives.length);
    },
    printer() {
      let aside = document.querySelector('aside').style.width;
      let header = document.querySelector('header').style.left;
      let page = document.querySelector('.q-layout-page-container').style.paddingLeft;

      document.querySelector('aside').style.width="0px";
      document.querySelector('header').style.left="0px";
      document.querySelector('.q-layout-page-container').style.paddingLeft="0px";
      
      window.print();
      document.querySelector('aside').style.width= aside;
      document.querySelector('header').style.left= header;
      document.querySelector('.q-layout-page-container').style.paddingLeft = page;
    }
  },
  filters: {
    dated(value) {
      const hour = value.substr(11);
      const created = value.substring(0, 10);
      return created.substr(5, 2) +'/'+ created.substr(8, 2) +'/'+ created.substr(0, 4) +' '+ hour;
    }
  },
  mounted() {
    this.$axios.get(this.$mangrowe.url +'/objectives/dashboard?organization_id=' + this.$mangrowe.organization_id, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
        this.objectives = response.data.objectives;
        this.progress = this.calculateProgress(this.objectives);
        for(let i = 0; i < response.data.cycles.length; i++) {
          this.cycles.push({
            label: response.data.cycles[i].title,
            value: response.data.cycles[i].id,
          });
        }
        for(let i = 0; i < response.data.departments.length; i++) {
          this.departments.push({
            label: response.data.departments[i].title,
            value: response.data.departments[i].id,
          });
        }
    });
  }
}
</script>

<style scoped>
.dated {
  font-size: 12px;
}
.key-result {
  cursor: pointer;
}
</style>
