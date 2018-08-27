<template>
  <q-page padding>
    <h3>Cadastrar Usuário</h3>
    <q-card-main>
      <form action="">
        <q-field
        class="q-pa-sm"
        icon="person">
          <q-input type="text" float-label="Nome completo" color="orange-9" v-model="user_name" />
        </q-field>

        <div class="row">
          <div class="col-12 col-md-6">
            <q-field
            class="q-pa-sm"
            icon="alternate_email">
              <q-input type="text" float-label="Email" color="orange-9" v-model="user_mail" />
            </q-field>
          </div>

          <div class="col-12 col-md-6">
            <q-field
            class="q-pa-sm"
            icon="alternate_email">
              <q-input type="text" float-label="Confirme o E-mail" color="orange-9" v-model="user_mail_confirm" />
            </q-field>
          </div>

          <div class="col-12 col-md-6">
            <q-field
            class="q-pa-sm"
            icon="lock">
              <q-input type="password" float-label="Senha" color="orange-9" v-model="user_password" />
            </q-field>
          </div>

          <div class="col-12 col-md-6">
            <q-field
            class="q-pa-sm"
            icon="lock">
              <q-input type="password" float-label="Confirme a senha" color="orange-9" v-model="user_password_confirm" />
            </q-field>
          </div>
        </div>
          <q-btn push color="orange-9" class="q-my-xl q-mx-sm float-right" icon="person_add" label="Cadastrar Usuário" />
      </form>
    </q-card-main>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      user_name: '',
      user_email: '',
      user_email_confirm: '',
      user_password: '',
      user_password_confim: ''
    }
  },
}
</script>

<style>
</style>
