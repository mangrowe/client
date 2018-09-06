<template>
  <q-page padding>
    <h3>Editar resultado chave {{ progress }}%</h3>
    <div v-if="message.text != ''">
      <q-alert :color="message.color">
        {{ message.text }}
      </q-alert>
    </div>
    <q-progress :percentage="progress" color="green-9" />
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

        <q-field
        class="q-pa-sm"
        icon="description" :error="error_description" error-label="Este campo é obrigatório.">
          <q-editor v-model="description" float-label="Descrição" color="orange-9" />
        </q-field>

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
            <q-radio v-model="current" :val="0" label="A fazer" color="orange-9" class="q-pa-sm" />
            <q-radio v-model="current" :val="100" label="Feito" color="orange-9" class="q-pa-sm" />
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
          <div class="col-12 col-md-4">
            <q-field
            class="q-pa-sm"
            icon="filter_1" :error="error_initial" error-label="Este campo é obrigatório.">
              <q-input type="number" v-model="initial" float-label="Inicial" color="orange-9" />
            </q-field>
          </div>
          <div class="col-12 col-md-4">
            <q-field
            class="q-pa-sm"
            icon="filter_2">
              <q-input type="number" v-model="current" float-label="Atual" color="orange-9" />
            </q-field>
          </div>
          <div class="col-12 col-md-4">
            <q-field
            class="q-pa-sm"
            icon="filter_3" :error="error_target" error-label="Este campo é obrigatório.">
              <q-input type="number" v-model="target" float-label="Alvo" color="orange-9" />
            </q-field>
          </div>
        </div>
        <q-btn-group push class="float-right">
          <q-btn push color="green-9" @click="checkIn()" class="q-pa-sm" icon="add_location" label="Check In" />
          <q-btn push color="red-9" @click="destroy()" class="q-pa-sm" icon="delete" label="Remover" />
          <q-btn push color="orange-9" @click="update()" class="q-pa-sm" icon="save" label="Atualizar" />
        </q-btn-group>
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
      criteria: '',
      initial: 0,
      current: 0,
      target: 0,
      format: '',
      objectives: [],
      users: [],
      progress: 0,
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
      message: { color: '', text: '' },
      error_objective_id: false,
      error_user_id: false,
      error_title: false,
      error_description: false,
      error_type: false,
      error_initial: false,
      error_target: false,
      errors: []
    }
  },
  mounted() {
    this.$axios.get(this.$mangrowe.url +'/keyResults/'+ this.$route.params.id +'/edit?organization_id='+ this.$mangrowe.organization_id, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
        this.objective_id = response.data.keyResults.objective_id;
        this.user_id = response.data.keyResults.user_id;
        this.title = response.data.keyResults.title;
        this.description = response.data.keyResults.description;
        this.type = response.data.keyResults.type;
        this.criteria = response.data.keyResults.criteria;
        this.initial = response.data.keyResults.initial;
        this.current = response.data.keyResults.current;
        this.target = response.data.keyResults.target;
        this.format = response.data.keyResults.format;
        this.progressBar();        
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
    update() {
      if(this.validates()) {
        return;
      }
      this.$axios.put(this.$mangrowe.url +'/keyResults/'+ this.$route.params.id, {
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
          this.progressBar();
          window.scrollTo(0, 0);
      }).catch((err) => {
          this.message.color = 'red';
          this.message.text = response.data.message;
      });
    },
    destroy() {
      this.$q.dialog({
        title: 'Atenção',
        message: 'Deseja realmente remover?',
        ok: 'Sim',
        cancel: 'Não'
      }).then(() => {
        this.$axios.delete(this.$mangrowe.url +'/keyResults/'+ this.$route.params.id, { headers: 
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
      }).catch(() => {
        this.$q.notify('Operação não realizada.');
      });
    },
    checkIn() {
      this.$router.push('/keyResults/edit/'+ this.$route.params.id +'/checkIns');
    },
    progressBar() {
      if(this.type == 'boolean') {
        this.progress = Math.round(Math.abs(this.current / this.target) * 100);
      }else {
        if(this.criteria == 'gte') {
          this.progress = Math.round(Math.abs((this.current - this.initial) / (this.target - this.initial)) * 100); 
        }else {
          this.progress = Math.round(Math.abs((this.initial - this.current) / (this.initial - this.target)) * 100);
        }
      }
    },
    validates() {
      this.error_objective_id = false;
      this.error_user_id = false;
      this.error_title = false;
      this.error_description = false;
      this.error_type = false;
      this.error_initial = false;
      this.error_target = false;
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
      return this.errors.length;
    }
  }
}
</script>

<style>
</style>
