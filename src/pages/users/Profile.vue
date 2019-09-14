<template>
  <q-page padding>
    <h3>Minha conta</h3>
    <div v-if="message.text != ''">
      <q-alert :color="message.color">
        {{ message.text }}
      </q-alert>
    </div>
    <q-card-main>
      <form action="">
        <q-field
        class="q-pa-sm"
        icon="person">
          <q-input type="text" v-model="name" float-label="Nome completo" color="orange-9" />
        </q-field>

        <div class="row">
          <div class="col-12 col-md-6">
            <q-field
            class="q-pa-sm"
            icon="alternate_email">
              <q-input type="text" v-model="email" float-label="Email" color="orange-9" />
            </q-field>
          </div>

          <div class="col-12 col-md-6">
            <q-field
            class="q-pa-sm"
            icon="lock">
              <q-input type="password" v-model="password" float-label="Senha" color="orange-9" />
            </q-field>
          </div>
        </div>
        <q-btn-group push class="float-right">
          <q-btn push color="orange-9" @click="update()" class="q-pa-sm" icon="save" label="Atualizar" />
        </q-btn-group>
      </form>
    </q-card-main>
  </q-page>
</template>

<script>
import { Loading } from 'quasar';

export default {
  data () {
    return {
      id: 0,
      name: '',
      email: '',
      password: '',
      error_name: false,
      error_email: false,
      errors: [],
      message: { color: '', text: '' }
    }
  },
  mounted() {
    Loading.show({message: 'Carregando...'});
    this.$axios.get(this.$mangrowe.url +'/users/profile', { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
        this.id = response.data.user.id;
        this.name = response.data.user.name;
        this.email = response.data.user.email;
        Loading.hide();
    });
  },
  methods: {
    update() {
      if(this.validates()) {
        return;
      }
      Loading.show({message: 'Carregando...'});
      this.$axios.put(this.$mangrowe.url +'/users/'+ this.id, {
        name: this.name,
        email: this.email,
        password: this.password
      }, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
      }).then((response) => {
          this.message.color = 'green';
          this.message.text = response.data.message;
          Loading.hide();
      }).catch((err) => {
          let errors = err.response.data.errors;
          this.message.color = 'red';
          this.message.text = '';

          if(errors.name != undefined) {
            this.message.text += errors.name.join() + ' ';
          }

          if(errors.email != undefined) {
            this.message.text += errors.email.join();
          }

          if(errors.password != undefined) {
            this.message.text += errors.password.join();
          }
          window.scrollTo(0, 0);
          Loading.hide();
      });
    },
    validates() {
      this.errors = [];
      this.error_name = false;
      this.error_email = false;
      if(this.name.length < 1) {
        this.error_name = true;
        this.errors.push(this.error_name);
      }
      if(this.email.length < 1) {
        this.error_email = true;
        this.errors.push(this.error_email);
      }
      return this.errors.length;
    }
  }
}
</script>

<style>
</style>
