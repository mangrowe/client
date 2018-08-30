<template>
  <q-page padding>
    <h3>Novo check-in</h3>
    <div v-if="message.text != ''">
      <q-alert :color="message.color">
        {{ message.text }}
      </q-alert>
    </div>
    <q-card-main>
      <form action="">
        <div class="row">
          <div class="col-12 col-md-4">
            <q-field
            class="q-pa-sm"
            icon="filter_1">
              <q-input type="number" v-model="previous" :disable="true" float-label="Atual" color="orange-9" />
            </q-field>
          </div>
          <div class="col-12 col-md-4">
            <q-field
            class="q-pa-sm"
            icon="filter_2">
              <q-input type="number" v-model="current" float-label="Novo" color="orange-9" />
            </q-field>
          </div>
          <div class="col-12 col-md-4">
            <q-field
            class="q-pa-sm"
            icon="filter_3">
              <q-input type="number" v-model="target" :disable="true" float-label="Alvo" color="orange-9" />
            </q-field>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <q-field
            class="q-pa-sm"
            icon="description">
              <q-editor v-model="description" float-label="Descrição" color="orange-9" />
            </q-field>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <q-field
              icon="rate_review"
              helper="Qual o nível de confiança?"
            >
              <q-rating size="2rem" v-model="confidance" color="orange-9" :max="3" icon="thumb_up_alt" />
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
  data() {
    return {
      previous: '',
      current: '',
      confidance: 0,
      target: '',
      description: '',
      message: { color: '', text: '' }
    }
  },
  mounted() {
    this.$axios.get(this.$mangrowe.url +'/checkIns/create?key_result_id='+ this.$route.params.id, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
        this.previous = response.data.current;
        this.target = response.data.target;
    });
  },
  methods: {
    store() {
      this.$axios.post(this.$mangrowe.url +'/checkIns', {
        key_result_id: this.$route.params.id,
        previous: this.previous,
        current: this.current,
        confidance: this.confidance,
        description: this.description
      }, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
      }).then((response) => {
          this.message.color = 'green';
          this.message.text = response.data.message;
          setTimeout(() => {
            this.$router.push('/keyResults/edit/'+ this.$route.params.id +'/checkIns');
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
