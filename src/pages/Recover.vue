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
            Recuperação de senha
          </q-card-title>
          <q-card-separator />
          <q-card-main>
            <q-field
              class="q-pa-sm"
              icon="email">
              <q-input type="email" float-label="E-mail" color="orange-9" v-model="email" />
            </q-field>
            <q-btn-group push class="float-right">
              <q-btn push color="orange-9" to="/login" class="q-pa-sm" icon="exit_to_app" label="Login" />
              <q-btn push color="secondary" class="q-pa-sm float-right" icon="send" label="Recuperar" @click="recover()"/>
            </q-btn-group>
            <div class="clearfix"></div>
          </q-card-main>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      email: '',
      message: { color: '', text: '' }
    }
  },
  methods: {
    recover() {
      this.$axios.post(this.$mangrowe.url +'/reset', {
        email: this.email
      }).then((response) => {
          this.message.color = 'green';
          this.message.text = response.data.message;
      }).catch((err) => {
          this.message.color = 'red';
          this.message.text = response.data.message;
      });
    }
  }
}
</script>

<style>
</style>
