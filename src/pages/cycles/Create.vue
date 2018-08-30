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
            icon="title">
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

        <q-field
        class="q-pa-sm"
        icon="description">
          <q-editor v-model="description" float-label="Descrição" color="orange-9" />
        </q-field>

        <div class="row">
          <div class="col-12 col-md-6">
            <q-field
              class="q-pa-sm"
              icon="date_range">
              <q-datetime v-model="start_at" type="date" color="orange-9" float-label="Data de início" />
            </q-field>
          </div>

          <div class="col-12 col-md-6">
            <q-field
              class="q-pa-sm"
              icon="date_range">
              <q-datetime v-model="end_at" type="date" color="orange-9" float-label="Data de término" />
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
      cycle_name: '',
      start_at: new Date(),
      end_at: new Date(),
      cycles: [],
      message: { color: '', text: '' }
    }
  },
  mounted() {
    this.$axios.get(this.$mangrowe.url +'/cycles/create', { headers: 
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
      this.$axios.post(this.$mangrowe.url +'/cycles', {
        organization_id: this.$mangrowe.organization_id,
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
    }
  }
}
</script>

<style>
</style>