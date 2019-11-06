<template>
  <q-page padding>
    <div class="row">
      <div class="col-12 col-md-6 offset-md-3">
        <div v-if="message.text != ''">
          <q-alert :color="message.color">
            {{ message.text }}
          </q-alert>
        </div>
        <q-card>
          <q-card-title>
            Acessar MOKR
          </q-card-title>
          <q-card-separator />
          <q-card-main>
            <q-field
              class="q-pa-sm"
              icon="email" :error="error_email" error-label="Este campo é obrigatório.">
                <q-input type="email" float-label="E-mail" color="orange-9" v-model="email" />
              </q-field>
            <q-field
              class="q-pa-sm"
              icon="lock" :error="error_password" error-label="Este campo é obrigatório.">
                <q-input type="password" float-label="Senha" color="orange-9" v-model="password" />
              </q-field>
            <div v-if="organizations.length > 0">
              <q-field
              class="q-pa-sm"
              icon="business_center">
                <q-select v-model="organization_id" :options="organizations" float-label="Organização" color="orange-9" @input="dashboard()" />
              </q-field>
            </div>
            <q-btn-group push class="float-right">
              <q-btn push color="tertiary" to="/register" class="q-pa-sm" icon="add" label="Cadastrar" id="register" />
              <q-btn push color="secondary" to="/recover" class="q-pa-sm" icon="lock_open" label="Recuperação de senha" id="recover" />
              <q-btn push class="q-pa-sm float-right" icon="exit_to_app" label="Entrar" color="orange-9" @click="signin()" id="signin" />
            </q-btn-group>
            <div class="clearfix"></div>
          </q-card-main>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { LocalStorage, Loading } from 'quasar';

export default {
  data () {
    return {
      email: '',
      password: '',
      organization_id: null,
      organizations: [],
      error_email: false,
      error_password: false,
      errors: [],
      message: { color: '', text: '' }
    }
  },
  methods: {
    signin() {
      if(this.validates()) {
        return;
      }
      Loading.show({message: 'Carregando...'});
      this.$axios.post(this.$mangrowe.url +'/login', {
        email: this.email,
        password: this.password
      }).then((response) => {
          LocalStorage.set('token', response.data.user.api_token);
          this.$mangrowe.token = response.data.user.api_token;
          if(response.data.organizations.length == 1) {
            this.organization_id = response.data.organizations[0].id;
            this.dashboard();
          }
          for(let i = 0; i < response.data.organizations.length; i++) {
            this.organizations.push({
                label: response.data.organizations[i].title,
                value: response.data.organizations[i].id
            });
          }
          this.message.color = 'green';
          this.message.text = response.data.message;
          Loading.hide();
      }).catch((err) => {
          this.message.color = 'red';
          this.message.text = 'Dados inválidos, por favor verifique e tente novamente.';
          Loading.hide();
      });
    },
    dashboard() {
      for(let i = 0; i < this.organizations.length; i++) {
        if(this.organization_id == this.organizations[i].value) {
          LocalStorage.set('organization_title', this.organizations[i].label);
          this.$mangrowe.organization_title = this.organizations[i].label;
          break;
        }
      }
      LocalStorage.set('organization_id', this.organization_id);
      this.$mangrowe.organization_id = this.organization_id;
      this.$router.push('/dashboard');
    },
    validates() {
      this.errors = [];
      this.error_email = false;
      this.error_password = false;
      if(this.email.length < 1) {
        this.error_email = true;
        this.errors.push(this.error_email);
      }
      if(this.password.length < 6) {
        this.error_password = true;
        this.errors.push(this.error_password);
      }
      return this.errors.length;
    }
  }
}
</script>

<style>
.clearfix {
  clear: both;
}
</style>
