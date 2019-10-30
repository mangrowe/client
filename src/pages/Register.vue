<template>
  <q-page padding>
    <div class="row">
      <div class="col-12 col-md-6 offset-md-3">
        <div v-if="message.text != ''">
          <q-alert :color="message.color">{{ message.text }}</q-alert>
        </div>
        <q-card>
          <q-card-title>Cadastro de Usuário</q-card-title>
          <q-card-separator />
          <q-card-main>
            <q-field
              class="q-pa-sm"
              icon="person"
              :error="error_name"
              error-label="Este campo é obrigatório."
            >
              <q-input float-label="Nome" color="orange-9" v-model="name" />
            </q-field>
            <q-field
              class="q-pa-sm"
              icon="email"
              :error="error_email"
              error-label="Este campo é obrigatório."
            >
              <q-input type="email" float-label="E-mail" color="orange-9" v-model="email" />
            </q-field>
            <q-field
              class="q-pa-sm"
              icon="location_city"
              :error="error_organization"
              error-label="Este campo é obrigatório."
            >
              <q-input float-label="Empresa" color="orange-9" v-model="organization" />
            </q-field>
            <q-field
              class="q-pa-sm"
              icon="lock"
              :error="error_password"
              error-label="Este campo é obrigatório."
            >
              <q-input type="password" float-label="Senha" color="orange-9" v-model="password" />
            </q-field>
            <q-btn-group push class="float-right">
              <q-btn push color="tertiary" to="/login" class="q-pa-sm" icon="keyboard_backspace" label="Voltar" />
              <q-btn
                push
                class="q-pa-sm float-right"
                icon="exit_to_app"
                label="Cadastrar"
                color="orange-9"
                @click="register()"
              />
            </q-btn-group>
            <div class="clearfix"></div>
          </q-card-main>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { Loading } from "quasar";

export default {
  data() {
    return {
      name: "",
      email: "",
      organization: "",
      password: "",
      error_name: false,
      error_email: false,
      error_organization: false,
      error_password: false,
      errors: [],
      message: { color: "", text: "" }
    };
  },
  methods: {
    register() {
      if (this.validates()) {
        return;
      }
      Loading.show({ message: "Carregando..." });
      this.$axios
        .post(this.$mangrowe.url + "/register", {
          title: this.organization,
          name: this.name,
          email: this.email,
          password: this.password
        })
        .then(response => {
          this.message.color = "green";
          this.message.text = response.data.message;
          this.clearInput();
          Loading.hide();
        })
        .catch(err => {
          this.message.color = "red";
          this.message.text = err.response.data.message;
          Loading.hide();
        });
    },
    clearInput(){
      this.organization = '',
      this.name = '',
      this.email = '',
      this.password = ''
    },
    validates() {
      this.errors = [];
      this.error_name = false;
      this.error_email = false;
      this.error_password = false;
      this.error_organization = false;
      let emailRE = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

      if (this.name.length < 1) {
        this.error_name = true;
        this.errors.push(this.error_name);
      }
      if (this.email.length < 1) {
        this.error_email = true;
        this.errors.push(this.error_email);
      }
      if (!emailRE.test(this.email)) {
        this.error_email = true;
        this.errors.push(this.error_email);
      }
      if (this.password.length < 6) {
        this.error_password = true;
        this.errors.push(this.error_password);
      }
      if (this.organization.length < 1) {
        this.error_organization = true;
        this.errors.push(this.error_organization);
      }
      return this.errors.length;
    }
  }
};
</script>

<style>
</style>
