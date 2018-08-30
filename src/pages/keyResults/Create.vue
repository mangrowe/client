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
            icon="title">
              <q-input type="text" v-model="title" float-label="Título" color="orange-9" />
            </q-field>
          </div>
        </div>

        <q-field
        class="q-pa-sm"
        icon="description">
          <q-editor v-model="description" float-label="Descrição" color="orange-9" />
        </q-field>

        <div class="row">
          <div class="col-12 col-md-12">
            <q-field
            class="q-pa-sm"
            icon="assignment">
              <q-select v-model="objective_id" :options="objectives" float-label="Objetivo" color="orange-9" />
            </q-field>
          </div>
        </div>

        <div class="row">
          <div class="col-12 col-md-6">
            <q-field
            class="q-pa-sm"
            icon="person">
              <q-select v-model="user_id" :options="users" float-label="Responsável" color="orange-9" />
            </q-field>
          </div>
          <div class="col-12 col-md-6">
            <q-field
            class="q-pa-sm"
            icon="assignment">
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
            icon="timeline">
              <q-select v-model="criteria" :options="criterias" float-label="Critérios" color="orange-9" />
            </q-field>
          </div>
          <div class="col-12 col-md-6">
            <q-field
            class="q-pa-sm"
            icon="tab_unselected">
              <q-select v-model="format" :options="formats" float-label="Formato" color="orange-9" />
            </q-field>
          </div>
          <div class="col-12 col-md-6">
            <q-field
            class="q-pa-sm"
            icon="filter_1">
              <q-input type="number" v-model="initial" float-label="Inicial" color="orange-9" />
            </q-field>
          </div>
          <div class="col-12 col-md-6">
            <q-field
            class="q-pa-sm"
            icon="filter_2">
              <q-input type="number" v-model="target" float-label="Alvo" color="orange-9" />
            </q-field>
          </div>
        </div>

        <q-btn push color="orange-9" @click="store()" class="q-pa-sm float-right" icon="save" label="Salvar" />
      </form>
    </q-card-main>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      objective_id: '',
      user_id: '',
      title: '',
      description: '',
      type: '',
      criteria: '',
      initial: 0,
      current: 0,
      target: 0,
      format: '',
      objectives: [],
      users: [],
      message: { color: '', text: '' },
      type: '',
      types: [
        {
          label: 'Boleano',
          value: 'boolean'
        },
        {
          label: 'Númerico',
          value: 'number'
        }
      ],
      criteria: '',
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
      ]
    }
  },
  mounted() {
    this.$axios.get(this.$mangrowe.url +'/keyResults/create', { headers: 
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
    });
  },
  methods: {
    store() {
      this.$axios.post(this.$mangrowe.url +'/keyResults', {
        objective_id: this.objective_id,
        user_id: this.user_id,
        title: this.title,
        description: this.description,
        type: this.type,
        criteria: this.criteria,
        initial: this.initial,
        current: this.current,
        target: this.target,
        format: this.format
      }, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
      }).then((response) => {
          this.message.color = 'green';
          this.message.text = response.data.message;
          setTimeout(() => {
            this.$router.push('/keyResults');
          }, 2000);
      }).catch((err) => {
          this.message.color = 'red';
          this.message.text = response.data.message;
      });
    }
  }
}
</script>

<style>
</style>
