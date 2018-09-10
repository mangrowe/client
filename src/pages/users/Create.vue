<template>
  <q-page padding>
    <h3>Novo usuário</h3>
    <div v-if="message.text != ''">
      <q-alert :color="message.color">
        {{ message.text }}
      </q-alert>
    </div>
    <q-card-main>
      <form action="">
        <q-field
        class="q-pa-sm"
        icon="person" :error="error_name" error-label="Este campo é obrigatório.">
          <q-input type="text" v-model="name" float-label="Nome completo" color="orange-9" />
        </q-field>

        <div class="row">
          <div class="col-12 col-md-6">
            <q-field
            class="q-pa-sm"
            icon="alternate_email" :error="error_email" error-label="Este campo é obrigatório.">
              <q-input type="text" v-model="email" float-label="Email" color="orange-9" />
            </q-field>
          </div>

          <div class="col-12 col-md-6">
            <q-field
            class="q-pa-sm"
            icon="lock" :error="error_password" error-label="Este campo deve conter no mínimo 6 caracteres.">
              <q-input type="password" v-model="password" float-label="Senha" color="orange-9" />
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
  data () {
    return {
      name: '',
      email: '',
      password: '',
      error_name: false,
      error_email: false,
      error_password: false,
      errors: [],
      message: { color: '', text: '' }
    }
  },
  methods: {
    store() {
      if(this.validates()) {
        return;
      }
      this.$axios.post(this.$mangrowe.url +'/users', {
        organization_id: this.$mangrowe.organization_id,
        name: this.name,
        email: this.email,
        password: this.password
      }, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
      }).then((response) => {
          this.message.color = 'green';
          this.message.text = response.data.message;
          setTimeout(() => {
            this.$router.push('/users');
          }, 2000);
      }).catch((err) => {
          this.message.color = 'red';
          this.message.text = response.data.message;
      });
    },
    validates() {
      this.errors = [];
      this.error_name = false;
      this.error_email = false;
      this.error_password = false;
      if(this.name.length < 1) {
        this.error_name = true;
        this.errors.push(this.error_name);
      }
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
</style>
