<template>
  <q-page padding>
    <div class="row">
      <div class="col-12 col-md-6 offset-md-3">
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
            <q-btn class="q-pa-sm float-right" icon="exit_to_app" label="Entrar" color="orange-9" />
            <div class="clearfix"></div>
          </q-card-main>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  // name: 'PageName',
  data () {
    return {
      email: '',
      password: ''
    }
  }
}
</script>

<style>
.clearfix {
  clear: both;
}
</style>
