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
        <div class="row">
          <div class="col-12 col-sm-6">
            <q-field
            class="q-pa-sm"
            icon="title">
              <q-input type="text" v-model="title" float-label="Titulo do objetivo" color="orange-9" />
            </q-field>
          </div>
          <div class="col-12 col-sm-6">
            <q-field
            class="q-pa-sm"
            icon="autorenew">
              <q-select v-model="cycle_id" :options="cycles" float-label="Ciclo" color="orange-9" />
            </q-field>
          </div>
        </div>
        <q-field
        class="q-pa-sm"
        icon="description">
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
            icon="group">
              <q-select v-model="team_id" :options="teams" float-label="Time" color="orange-9" />
            </q-field>
          </div>
          <div class="col-12 col-md-6">
            <q-field
            class="q-pa-sm"
            icon="assignment_ind">
              <q-select v-model="user_id" :options="users" float-label="Responsável" color="orange-9" />
            </q-field>
          </div>
          <div class="col-12 col-md-6">
            <q-field
            class="q-pa-sm"
            icon="drag_handle">
              <q-select v-model="level" :options="levels" float-label="Nível" color="orange-9" />
            </q-field>
          </div>
        </div>
        <q-btn-group push class="float-right">
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
      message: { color: '', text: '' }
    }
  },
  mounted() {
    this.$axios.get(this.$mangrowe.url +'/objectives/'+ this.$route.params.id +'/edit', { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
        this.parent_id = response.data.objective.parent_id;
        this.cycle_id = response.data.objective.cycle_id;
        this.user_id = response.data.objective.user_id;
        this.team_id = response.data.objective.team_id;
        this.title = response.data.objective.title;
        this.description = response.data.objective.description;
        this.level = response.data.objective.level;
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
    });
  },
  methods: {
    update() {
      this.$axios.put(this.$mangrowe.url +'/objectives/'+ this.$route.params.id, {
        parent_id: this.parent_id,
        cycle_id: this.cycle_id,
        user_id: this.user_id,
        team_id: this.team_id,
        level: this.level,
        title: this.title,
        description: this.description
      }, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
      }).then((response) => {
          this.message.color = 'green';
          this.message.text = response.data.message;
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
    }
  }
}
</script>

<style>
</style>
