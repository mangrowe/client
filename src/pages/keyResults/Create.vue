<template>
  <q-page padding>
    <h3>Novo resultado chave</h3>
    <div v-if="message.text != ''">
      <q-alert :color="message.color">
        {{ message.text }}
      </q-alert>
    </div>
    <q-card-main>
      <form action="">
        <div class="row">
          <div class="col-12 col-md-12">
            <q-field
            class="q-pa-sm"
            icon="title" :error="error_title" error-label="Este campo é obrigatório.">
              <q-input type="text" v-model="title" float-label="Título" color="orange-9" />
            </q-field>
          </div>
        </div>

        <q-field class="q-pa-sm" icon="description" :error="error_description" label="Descrição" label-width="12" />
        <q-editor v-model="description" color="orange-9" />
        <q-field class="q-pa-sm" :error="error_description" error-label="Este campo é obrigatório." label-width="12" />

        <div class="row">
          <div class="col-12 col-md-12">
            <q-field
            class="q-pa-sm"
            icon="assignment" :error="error_objective_id" error-label="Este campo é obrigatório.">
              <q-select v-model="objective_id" :options="objectives" float-label="Objetivo" color="orange-9" />
            </q-field>
          </div>
        </div>

        <div class="row">
          <div class="col-12 col-md-6">
            <q-field
            class="q-pa-sm"
            icon="person" :error="error_user_id" error-label="Este campo é obrigatório.">
              <q-select v-model="user_id" :options="users" float-label="Responsável" color="orange-9" />
            </q-field>
          </div>
          <div class="col-12 col-md-6">
            <q-field
            class="q-pa-sm"
            icon="assignment" :error="error_type" error-label="Este campo é obrigatório.">
              <q-select v-model="type" :options="types" float-label="Tipo de resultado" color="orange-9" />
            </q-field>
          </div>
        </div>

        <div class="row justify-center" v-if="type == 'boolean'">
          <div class="q-pa-sm">
            <q-radio v-model="current" val="0" label="A fazer" color="orange-9" class="q-pa-sm" />
            <q-radio v-model="current" val="100" label="Feito" color="orange-9" class="q-pa-sm" />
          </div>
        </div>

        <div class="row" v-if="type == 'number'">
          <div class="col-12 col-md-6">
            <q-field
            class="q-pa-sm"
            icon="timeline" :error="error_criteria" error-label="Este campo é obrigatório.">
              <q-select v-model="criteria" :options="criterias" float-label="Critérios" color="orange-9" />
            </q-field>
          </div>
          <div class="col-12 col-md-6">
            <q-field
            class="q-pa-sm"
            icon="tab_unselected" :error="error_format" error-label="Este campo é obrigatório.">
              <q-select v-model="format" :options="formats" @input="formatSelected()" float-label="Formato" color="orange-9" />
            </q-field>
          </div>
          <div class="col-12 col-md-6">
            <q-field
            class="q-pa-sm"
            icon="filter_1" :error="error_initial" error-label="Este campo é obrigatório.">
              <q-input v-model.lazy="initial" v-money="numberMask" float-label="Inicial" color="orange-9" />
            </q-field>
          </div>
          <div class="col-12 col-md-6">
            <q-field
            class="q-pa-sm"
            icon="filter_2" :error="error_target" error-label="Este campo é obrigatório.">
              <q-input v-model.lazy="target" v-money="numberMask" float-label="Alvo" color="orange-9" />
            </q-field>
          </div>
        </div>

        <q-btn push color="orange-9" @click="store()" class="q-pa-sm float-right" icon="save" label="Salvar" />
      </form>
    </q-card-main>
  </q-page>
</template>

<script>
import {VMoney} from 'v-money';

export default {
  directives: {money: VMoney},
  data() {
    return {
      objective_id: '',
      user_id: '',
      title: '',
      description: '',
      criteria: '',
      initial: 0.0,
      current: 0.0,
      target: 0.0,
      format: '',
      objectives: [],
      users: [],
      message: { color: '', text: '' },
      type: '',
      types: [
        {
          label: 'Booleano',
          value: 'boolean'
        },
        {
          label: 'Númerico',
          value: 'number'
        }
      ],
      criterias: [
        {
          label: 'Maior ou igual',
          value: 'gte'
        },
        {
          label: 'Menor ou igual',
          value: 'lte'
        }
      ],
      formats: [
        {
          label: 'Número',
          value: 'number'
        },
        {
          label: 'Moeda',
          value: 'currency'
        },
        {
          label: 'Porcentagem',
          value: 'percentage'
        }
      ],
      error_objective_id: false,
      error_user_id: false,
      error_title: false,
      error_description: false,
      error_type: false,
      error_initial: false,
      error_target: false,
      error_criteria: false,
      error_format: false,
      errors: [],
      numberMask: {
        decimal: ',',
        thousands: '.',
        prefix: 'R$ ',
        suffix: '',
        precision: 2
      }
    }
  },
  mounted() {
    this.$axios.get(this.$mangrowe.url +'/keyResults/create?organization_id='+ this.$mangrowe.organization_id, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
        for(let i = 0; i < response.data.objectives.length; i++) {
          this.objectives.push({
              label: response.data.objectives[i].title,
              value: response.data.objectives[i].id
          });
        }
        for(let i = 0; i < response.data.users.length; i++) {
          this.users.push({
              label: response.data.users[i].name,
              value: response.data.users[i].id
          });
        }
        if(this.$route.query.objective_id != undefined) {
          this.objective_id = parseInt(this.$route.query.objective_id);
        }
    });
  },
  methods: {
    store() {
      if(this.validates()) {
        return;
      }
      this.$axios.post(this.$mangrowe.url +'/keyResults', {
        organization_id: this.$mangrowe.organization_id,
        objective_id: this.objective_id,
        user_id: this.user_id,
        title: this.title,
        description: this.description,
        type: this.type,
        criteria: this.criteria,
        initial: this.$mangrowe.deformat(this.initial),
        current: this.$mangrowe.deformat(this.initial),
        target: this.$mangrowe.deformat(this.target),
        format: this.format
      }, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
      }).then((response) => {
          this.message.color = 'green';
          this.message.text = response.data.message;
          window.scrollTo(0, 0);
          setTimeout(() => {
            this.$router.push('/objectives/'+ this.objective_id);
          }, 2000);
      }).catch((err) => {
          this.message.color = 'red';
          this.message.text = response.data.message;
      });
    },
    validates() {
      this.errors = [];
      this.error_objective_id = false;
      this.error_user_id = false;
      this.error_title = false;
      this.error_description = false;
      this.error_type = false;
      this.error_initial = false;
      this.error_target = false;
      this.error_criteria = false;
      this.error_format = false;
      if(this.objective_id.length < 1) {
        this.error_objective_id = true;
        this.errors.push(this.error_objective_id);
      }
      if(this.user_id.length < 1) {
        this.error_user_id = true;
        this.errors.push(this.error_user_id);
      }
      if(this.title.length < 1) {
        this.error_title = true;
        this.errors.push(this.error_title);
      }
      if(this.description.length < 1) {
        this.error_description = true;
        this.errors.push(this.error_description);
      }
      if(this.type.length < 1) {
        this.error_type = true;
        this.errors.push(this.error_type);
      }
      if(this.initial.length < 1) {
        this.error_initial = true;
        this.errors.push(this.error_initial);
      }
      if(this.target.length < 1) {
        this.error_target = true;
        this.errors.push(this.error_target);
      }
      if(this.type.length > 0) {
        if(this.type == 'number') {
          if(this.criteria.length < 1) {
            this.error_criteria = true;
            this.errors.push(this.error_criteria);
          }
          if(this.format.length < 1) {
            this.error_format = true;
            this.errors.push(this.error_format);
          }
        }
      }
      return this.errors.length;
    },
    formatSelected() {
      if(this.format == 'currency') {
        this.numberMask.prefix = 'R$ ';
        this.numberMask.suffix = '';
      }else if(this.format == 'number') {
        this.numberMask.prefix = '';
        this.numberMask.suffix = '';
      }else if(this.format == 'percentage') {
        this.numberMask.prefix = '';
        this.numberMask.suffix = '%';
      }
      this.current = this.$mangrowe.format(this.current, this.format);
    }
  }
}
</script>

<style>
</style>
