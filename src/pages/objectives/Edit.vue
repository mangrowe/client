<template>
  <q-page padding>
    <h3>Editar objetivo</h3>
    <div v-if="message.text != ''">
      <q-alert :color="message.color">
        {{ message.text }}
      </q-alert>
    </div>
    <q-card-main>
      <form action="">
        <q-field
        class="q-pa-sm"
        icon="title" :error="error_title" error-label="Este campo é obrigatório.">
          <q-input type="text" v-model="title" float-label="Titulo do objetivo" color="orange-9" />
        </q-field>
        <div class="row">
          <div class="col-12 col-sm-6">
            <q-field
            class="q-pa-sm"
            icon="donut_large" :error="error_cycle_id" error-label="Este campo é obrigatório.">
              <q-select v-model="cycle_id" :options="cycles" float-label="Ciclo" color="orange-9" />
            </q-field>
          </div>
          <div class="col-12 col-sm-6">
            <q-field
            class="q-pa-sm"
            icon="account_balance" :error="error_department_id" error-label="Este campo é obrigatório.">
              <q-select v-model="department_id" :options="departments" float-label="Unidade organizacional" color="orange-9" />
            </q-field>
          </div>
        </div>
        <q-field
        class="q-pa-sm"
        icon="description" :error="error_description" error-label="Este campo é obrigatório.">
          <q-editor v-model="description" float-label="Descrição do objetivo" color="orange-9" />
        </q-field>

        <div class="row">
          <div class="col-12 col-md-6">
            <q-field
            class="q-pa-sm"
            icon="assignment">
              <q-select v-model="parent_id" :options="objectives" float-label="Objetivo vinculado" color="orange-9" />
            </q-field>
          </div>
          <div class="col-12 col-md-6">
            <q-field
            class="q-pa-sm"
            icon="group" :error="error_team_id" error-label="Este campo é obrigatório.">
              <q-select v-model="team_id" :options="teams" float-label="Time" color="orange-9" />
            </q-field>
          </div>
          <div class="col-12 col-md-6">
            <q-field
            class="q-pa-sm"
            icon="assignment_ind" :error="error_user_id" error-label="Este campo é obrigatório.">
              <q-select v-model="user_id" :options="users" float-label="Responsável" color="orange-9" />
            </q-field>
          </div>
          <div class="col-12 col-md-6">
            <q-field
            class="q-pa-sm"
            icon="drag_handle" :error="error_level" error-label="Este campo é obrigatório.">
              <q-select v-model="level" :options="levels" float-label="Nível" color="orange-9" />
            </q-field>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <q-field
              class="q-pa-sm"
              icon="bookmarks"
            >
              <q-chips-input v-model="tags" float-label="Tags" color="orange-9" />
            </q-field>
          </div>
        </div>
        <q-btn-group push class="float-right">
          <q-btn push color="green-9" @click="keyResultsList()" class="q-pa-sm" icon="vpn_key" label="Resultados chave" />
          <q-btn push color="red-9" @click="destroy()" class="q-pa-sm" icon="delete" label="Remover" />
          <q-btn push color="orange-9" @click="update()" class="q-pa-sm" icon="save" label="Atualizar" />
        </q-btn-group>
      </form>
    </q-card-main>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      title: '',
      description: '',
      parent_id: null,
      objectives: [],
      team_id: '',
      teams: [],
      members: [],
      user_id: '',
      users: [],
      cycle_id: '',
      cycles: [],
      department_id: '',
      departments: [],
      tags: [],
      level: '',
      levels: [
        {
          label: 'Estratégico',
          value: 'strategic'
        },
        {
          label: 'Tático',
          value: 'tactical'
        },
        {
          label: 'Operacional',
          value: 'operational'
        }
      ],
      error_title: false,
      error_description: false,
      error_team_id: false,
      error_user_id: false,
      error_cycle_id: false,
      error_department_id: false,
      error_level: false,
      errors: [],
      message: { color: '', text: '' }
    }
  },
  mounted() {
    this.$axios.get(this.$mangrowe.url +'/objectives/'+ this.$route.params.id +'/edit?organization_id='+ this.$mangrowe.organization_id, { headers: 
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
        for(let i = 0; i < response.data.teams.length; i++) {
          this.teams.push({
              label: response.data.teams[i].title,
              value: response.data.teams[i].id
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
        for(let i = 0; i < response.data.tags.length; i++) {
          this.tags.push(response.data.tags[i].title);
        }
        this.parent_id = parseInt(response.data.objective.parent_id);
        this.cycle_id = parseInt(response.data.objective.cycle_id);
        this.user_id = parseInt(response.data.objective.user_id);
        this.team_id = parseInt(response.data.objective.team_id);
        this.department_id = parseInt(response.data.objective.department_id);
        this.title = response.data.objective.title;
        this.description = response.data.objective.description;
        this.level = response.data.objective.level;
    });
  },
  methods: {
    update() {
      if(this.validates()) {
        return;
      }
      this.$axios.put(this.$mangrowe.url +'/objectives/'+ this.$route.params.id, {
        organization_id: this.$mangrowe.organization_id,
        parent_id: this.parent_id,
        cycle_id: this.cycle_id,
        department_id: this.department_id,
        user_id: this.user_id,
        team_id: this.team_id,
        level: this.level,
        title: this.title,
        description: this.description,
        tags: this.tags
      }, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
      }).then((response) => {
          this.message.color = 'green';
          this.message.text = response.data.message;
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
        this.$axios.delete(this.$mangrowe.url +'/objectives/'+ this.$route.params.id, { headers: 
          {'Authorization': 'Bearer '+ this.$mangrowe.token}
        }).then((response) => {
            this.message.color = 'green';
            this.message.text = response.data.message;
            setTimeout(() => {
              this.$router.push('/objectives');
            }, 2000);
        }).catch((err) => {
            this.message.color = 'red';
            this.message.text = response.data.message;
        });
      }).catch(() => {
        this.$q.notify('Operação não realizada.');
      });
    },
    keyResultsList() {
      this.$router.push('/objectives/'+ this.$route.params.id);
    },
    validates() {
      this.errors = [];
      this.error_title = false;
      this.error_description = false;
      this.error_team_id = false;
      this.error_user_id = false;
      this.error_cycle_id = false;
      this.error_department_id = false;
      this.error_level = false;
      if(this.title.length < 1) {
        this.error_title = true;
        this.errors.push(this.error_title);
      }
      if(this.description.length < 1) {
        this.error_description = true;
        this.errors.push(this.error_description);
      }
      if(this.team_id.length < 1) {
        this.error_team_id = true;
        this.errors.push(this.error_team_id);
      }
      if(this.user_id.length < 1) {
        this.error_user_id = true;
        this.errors.push(this.error_user_id);
      }
      if(this.cycle_id.length < 1) {
        this.error_cycle_id = true;
        this.errors.push(this.error_cycle_id);
      }
      if(this.department_id.length < 1) {
        this.error_department_id = true;
        this.errors.push(this.error_department_id);
      }
      if(this.level.length < 1) {
        this.error_level = true;
        this.errors.push(this.error_level);
      }
      return this.errors.length;
    }
  }
}
</script>

<style>
</style>
