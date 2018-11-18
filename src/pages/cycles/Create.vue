<template>
  <q-page padding>
    <h3>Novo ciclo</h3>
    <div v-if="message.text != ''">
      <q-alert :color="message.color">
        {{ message.text }}
      </q-alert>
    </div>
    <q-card-main>
      <form action="">
        <div class="row">
          <div class="col-12 col-md-6">
            <q-field
            class="q-pa-sm"
            icon="title" :error="error_title" error-label="Este campo é obrigatório.">
              <q-input type="text" v-model="title" float-label="Título" color="orange-9" />
            </q-field>
          </div>
          <div class="col-12 col-md-6">
            <q-field
            class="q-pa-sm"
            icon="donut_large">
              <q-select v-model="parent_id" :options="cycles" float-label="Ciclo" color="orange-9" />
            </q-field>
          </div>
        </div>

        <q-field class="q-pa-sm" icon="description" :error="error_description" label="Descrição" label-width="12" />
        <q-editor v-model="description" color="orange-9" />
        <q-field class="q-pa-sm" :error="error_description" error-label="Este campo é obrigatório." label-width="12" />

        <div class="row">
          <div class="col-12 col-md-6">
            <q-field
              class="q-pa-sm"
              icon="date_range" :error="error_start_at" error-label="Este campo é obrigatório.">
              <q-datetime v-model="start_at" type="date" color="orange-9" float-label="Data de início" format="DD/MM/YYYY" />
            </q-field>
          </div>

          <div class="col-12 col-md-6">
            <q-field
              class="q-pa-sm"
              icon="date_range" :error="error_end_at" error-label="Este campo é obrigatório.">
              <q-datetime v-model="end_at" type="date" color="orange-9" float-label="Data de término" format="DD/MM/YYYY" />
            </q-field>
          </div>
        </div>
        <q-btn push color="orange-9" @click="store()" class="q-pa-sm float-right" icon="save" label="Salvar" />
      </form>
    </q-card-main>
  </q-page>
</template>

<script>
import moment from 'moment';

export default {
  data () {
    return {
      parent_id: null,
      title: '',
      description: '',
      start_at: new Date(),
      end_at: new Date(),
      cycles: [],
      error_title: false,
      error_description: false,
      error_start_at: false,
      error_end_at: false,
      errors: [],
      message: { color: '', text: '' }
    }
  },
  mounted() {
    this.$axios.get(this.$mangrowe.url +'/cycles/create?organization_id='+ this.$mangrowe.organization_id, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
        for(let i = 0; i < response.data.length; i++) {
          this.cycles.push({
              label: response.data[i].title,
              value: response.data[i].id
          });
        }
    });
  },
  methods: {
    store() {
      if(this.validates()) {
        return;
      }
      this.$axios.post(this.$mangrowe.url +'/cycles', {
        organization_id: this.$mangrowe.organization_id,
        parent_id: this.parent_id,
        title: this.title,
        description: this.description,
        start_at: moment(this.start_at).format('YYYY-MM-DD'),
        end_at: moment(this.end_at).format('YYYY-MM-DD')
      }, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
      }).then((response) => {
          this.message.color = 'green';
          this.message.text = response.data.message;
          setTimeout(() => {
            this.$router.push('/cycles');
          }, 2000);
      }).catch((err) => {
          this.message.color = 'red';
          this.message.text = response.data.message;
      });
    },
    validates() {
      this.errors = [];
      this.error_title = false;
      this.error_description = false;
      this.error_start_at = false;
      this.error_end_at = false;
      if(this.title.length < 1) {
        this.error_title = true;
        this.errors.push(this.error_title);
      }
      if(this.description.length < 1) {
        this.error_description = true;
        this.errors.push(this.error_description);
      }
      if(this.start_at.length < 1) {
        this.error_start_at = true;
        this.errors.push(this.error_start_at);
      }
      if(this.end_at.length < 1) {
        this.error_end_at = true;
        this.errors.push(this.error_end_at);
      }
      if(this.start_at >= this.end_at) {
        this.$q.dialog({
          title: 'Aviso',
          message: 'A data de início deve ser menor que a de término.'
        });
        this.error_start_at = true;
        this.errors.push(this.error_start_at);
        this.error_end_at = true;
        this.errors.push(this.error_end_at);
      }
      return this.errors.length;
    }
  }
}
</script>

<style>
</style>