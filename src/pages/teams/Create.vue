<template>
  <q-page padding>
    <h3>Novo time</h3>
    <div v-if="message.text != ''">
      <q-alert :color="message.color">
        {{ message.text }}
      </q-alert>
    </div>
    <q-card-main>
      <form action="">
        <q-field
        class="q-pa-sm"
        icon="book" :error="error_title" error-label="Este campo é obrigatório.">
          <q-input type="text" float-label="Título" color="orange-9" v-model="title" />
        </q-field>
        <q-field
        class="q-pa-sm"
        icon="person" :error="error_user" error-label="Este campo é obrigatório.">
          <q-select
            v-model="user_id"
            :options="users"
            float-label="Responsável"
            color="orange-9"
          />
        </q-field>
        <q-field
        class="q-pa-sm"
        icon="people" :error="error_members" error-label="Este campo é obrigatório.">
          <q-select
            v-model="members"
            :options="users"
            float-label="Colaboradores"
            multiple
            color="orange-9"
          />
        </q-field>
        <q-btn push color="orange-9" @click="store()" class="q-pa-sm float-right" icon="save" label="Salvar" />
      </form>
    </q-card-main>
  </q-page>
</template>

<script>
import { Loading } from 'quasar';

export default {
  data () {
    return {
      title: '',
      user_id: '',
      members: [],
      users: [],
      error_title: false,
      error_user: false,
      error_members: false,
      errors: [],
      message: { color: '', text: '' },
    }
  },
  mounted() {
    Loading.show({message: 'Carregando...'});
    this.$axios.get(this.$mangrowe.url +'/teams/create?organization_id='+ this.$mangrowe.organization_id, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
        let result = response.data.users || [];
        for(let i = 0; i < result.length; i++) {
            this.users.push({
                label: result[i].name,
                value: result[i].id
            });
        }
        Loading.hide();
    });
  },
  methods: {
    store() {
      if(this.validates()) {
        return;
      }
      Loading.show({message: 'Carregando...'});
      this.$axios.post(this.$mangrowe.url +'/teams', {
        organization_id: this.$mangrowe.organization_id,
        user_id: this.user_id,
        title: this.title,
        users: this.members
      }, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
      }).then((response) => {
          this.message.color = 'green';
          this.message.text = response.data.message;
          Loading.hide();
          window.scrollTo(0, 0);
          setTimeout(() => {
            this.$router.push('/teams');
          }, 2000);
      }).catch((err) => {
          this.message.color = 'red';
          this.message.text = response.data.message;
          Loading.hide();
      });
    },
    validates() {
      this.errors = [];
      this.error_title = false;
      this.error_user = false;
      this.error_members = false;
      if(this.title.length < 1) {
        this.error_title = true;
        this.errors.push(this.error_title);
      }
      if(this.user_id.length < 1) {
        this.error_user = true;
        this.errors.push(this.error_user);
      }
      if(this.members.length < 1) {
        this.error_members = true;
        this.errors.push(this.error_members);
      }
      return this.errors.length;
    }
  }
}
</script>

<style>
</style>
