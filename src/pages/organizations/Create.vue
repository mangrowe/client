<template>
  <q-page padding>
    <h3>Nova organização</h3>
    <div v-if="message.text != ''">
      <q-alert :color="message.color">
        {{ message.text }}
      </q-alert>
    </div>
    <q-card-main>
      <form action="">
        <div class="row">
          <div class="col-12 col-md-12">
            <q-field
            class="q-pa-sm"
            icon="title" :error="error_title" error-label="Este campo é obrigatório.">
              <q-input type="text" float-label="Título" color="orange-9" v-model="title" />
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
      title: '',
      error_title: false,
      message: { color: '', text: '' }
    }
  },
  methods: {
    store() {
      if(this.title.length < 1) {
        this.error_title = true;
        return;
      }
      this.$axios.post(this.$mangrowe.url +'/organizations', {
        title: this.title
      }, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
      }).then((response) => {
          this.message.color = 'green';
          this.message.text = response.data.message;
          setTimeout(() => {
            this.$router.push('/organizations');
          }, 2000);
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
