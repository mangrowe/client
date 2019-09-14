<template>
  <q-page padding>
    <h3>
      <a href="https://docs.mangrowe.com/pt-br/administration/#criando-objetivo-resultado-chave-e-check-in" target="_blank"  style="text-decoration: none">
        <q-icon name="help_outline" size="xs" class="text-grey-5 q-headline" />
      </a>
      Objetivos
      <q-btn-group push>
        <q-btn push color="orange-9" to="objectives/create">
          Criar
        </q-btn>
        <q-btn push color="secondary" @click="showCard()">
          Pesquisar
        </q-btn>
        <q-btn push color="primary" to="tags">
          Tags
        </q-btn>
        <q-btn push color="blue-grey" to="objectives/dashboard">
          Cartão
        </q-btn>
      </q-btn-group>
      <q-spinner id="spinner" class="hidden" color="orange-9" size="40px" />
    </h3>
    <div v-if="message.text != ''">
      <q-alert :color="message.color">
        {{ message.text }}
      </q-alert>
    </div>
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
          icon="title">
            <q-input type="text" v-model="title" float-label="Titulo do objetivo" color="orange-9" />
          </q-field>
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <q-field
            class="q-pa-sm"
            icon="account_balance">
              <q-select v-model="department_id" :options="departments" float-label="Unidade organizacional" color="orange-9" />
            </q-field>
        </div>
        <div class="col-6">
          <q-field
            class="q-pa-sm"
            icon="assignment_ind">
              <q-select v-model="user_id" :options="users" float-label="Responsável" color="orange-9" />
            </q-field>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <q-field
          class="q-pa-sm"
          icon="description">
            <q-input type="text" v-model="description" float-label="Descrição do objetivo" color="orange-9" />
          </q-field>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <q-btn push color="secondary" @click="clearForm()" class="q-pa-sm q-ma-sm" icon="clear_all" label="Limpar" />
          <q-btn push color="orange-9" @click="searchQuery()" class="q-pa-sm q-ma-sm float-right" icon="search" label="Buscar" />
        </div>
      </div>
    </q-card>
    <q-table 
      title="Objetivos"
      :columns="columns"
      :data="objectives"
      no-data-label="Sem registros disponíveis"
      rows-per-page-label="Linhas por páginas"
      :pagination-label="paginate"
      :pagination.sync="pagination"
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
import { Loading } from 'quasar';

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
      searchForm: true,
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
      message: { color: '', text: '' },
      pagination: {
        rowsPerPage: 15
      }
    }
  },
  mounted() {
    Loading.show({message: 'Carregando...'});
    this.$axios.get(this.$mangrowe.url +'/objectives?organization_id='+ this.$mangrowe.organization_id, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
        for(let i = 0; i < response.data.length; i++) {
          this.objectives.push({
            id: response.data[i].id,
            cycle: response.data[i].cycle.title.length > 25 ? response.data[i].cycle.title.substring(0, 25) + '...' : response.data[i].cycle.title,
            title: response.data[i].title.length > 25 ? response.data[i].title.substring(0, 25) + '...' : response.data[i].title,
            level: this.$mangrowe.levels(response.data[i].level)
          });
        }
        Loading.hide();
    });
  },
  methods: {
    show(objective) {
      this.$router.push('/objectives/'+ objective.id);
    },
    searchLoad() {
      this.$axios.get(this.$mangrowe.url +'/objectives/create?organization_id='+ this.$mangrowe.organization_id, { headers: 
          {'Authorization': 'Bearer '+ this.$mangrowe.token}
      }).then((response) => {
          this.users = [];
          this.cycles = [];
          this.departments = [];
          for(let i = 0; i < response.data.users.length; i++) {
            this.users.push({
                label: response.data.users[i].name,
                value: response.data.users[i].id
            });
          }
          for(let i = 0; i < response.data.cycles.length; i++) {
            this.cycles.push({
                label: response.data.cycles[i].title,
                value: response.data.cycles[i].id
            });
          }
          for(let i = 0; i < response.data.departments.length; i++) {
            this.departments.push({
                label: response.data.departments[i].title,
                value: response.data.departments[i].id
            });
          }
          document.getElementById('spinner').classList.add('hidden');
      });
    },
    searchQuery() {
      this.$axios.get(this.$mangrowe.url +'/objectives', 
      {
        params: {
          quest: true,
          organization_id: this.$mangrowe.organization_id,
          cycle_id: this.cycle_id,
          user_id: this.user_id,
          department_id: this.department_id,
          title: this.title,
          description: this.description
        },
        headers: {'Authorization': 'Bearer '+ this.$mangrowe.token}      
      }).then((response) => {
          this.objectives = [];
          for(let i = 0; i < response.data.length; i++) {
            this.objectives.push({
              id: response.data[i].id,
              cycle: response.data[i].cycle.title,
              title: response.data[i].title,
              level: response.data[i].level
            });
          }
      }).catch((err) => {
          this.message.color = 'red';
          this.message.text = response.data.message;
      });
    },
    paginate(start, end, total) {
      return start + ' até ' + end + ' de ' + total;
    },
    showCard() {
      this.searchForm = !this.searchForm;
      if(!this.searchForm) {
        document.getElementById('spinner').classList.remove('hidden');
        this.searchLoad();
      }
    },
    clearForm() {
      this.title = '';
      this.cycle_id = null;
      this.department_id = null;
      this.user_id = null;
      this.description = '';
    }
  }
}

</script>

<style>
</style>
