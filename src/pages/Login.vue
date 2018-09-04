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
              icon="email">
                <q-input type="email" float-label="E-mail" color="orange-9" v-model="email" />
              </q-field>
            <q-field
              class="q-pa-sm"
              icon="lock">
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
              <q-btn push color="secondary" to="/recover" class="q-pa-sm" icon="lock_open" label="Recuperação de senha" />
              <q-btn push class="q-pa-sm float-right" icon="exit_to_app" label="Entrar" color="orange-9" @click="signin()" />
            </q-btn-group>
            <div class="clearfix"></div>
          </q-card-main>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { LocalStorage } from 'quasar';

export default {
  data () {
    return {
      email: '',
      password: '',
      organization_id: null,
      organizations: [],
      message: { color: '', text: '' }
    }
  },
  methods: {
    signin() {
      this.$axios.post(this.$mangrowe.url +'/login', {
        email: this.email,
        password: this.password
      }).then((response) => {
          LocalStorage.set('token', response.data.user.api_token);
          this.$mangrowe.token = response.data.user.api_token;
          for(let i = 0; i < response.data.organizations.length; i++) {
            this.organizations.push({
                label: response.data.organizations[i].title,
                value: response.data.organizations[i].id
            });
          }
          this.message.color = 'green';
          this.message.text = response.data.message;
      }).catch((err) => {
          this.message.color = 'red';
          this.message.text = response.data.message;
      });
    },
    dashboard() {
      LocalStorage.set('organization_id', this.organization_id);
      this.$mangrowe.organization_id = this.organization_id;
      this.$router.push('/dashboard');
    }
  }
}
</script>

<style>
.clearfix {
  clear: both;
}
</style>
