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
        <div class="row" v-if="type == 'boolean'">
          <div class="q-pa-sm">
            <q-radio v-model="current" :val="0" label="A fazer" color="orange-9" class="q-pa-sm" />
            <q-radio v-model="current" :val="100" label="Feito" color="orange-9" class="q-pa-sm" />
          </div>
        </div>
        <div class="row" v-if="type == 'number'">
          <div class="col-12 col-md-4">
            <q-field
            class="q-pa-sm"
            icon="filter_1">
              <q-input v-model.lazy="previous" v-money="numberMask" :disable="true" float-label="Atual" color="orange-9" />
            </q-field>
          </div>
          <div class="col-12 col-md-4">
            <q-field
            class="q-pa-sm"
            icon="filter_2" :error="error_current" error-label="Este campo é obrigatório.">
              <q-input v-model.lazy="current" v-money="numberMask" float-label="Novo" color="orange-9" />
            </q-field>
          </div>
          <div class="col-12 col-md-4">
            <q-field
            class="q-pa-sm"
            icon="filter_3">
              <q-input v-model.lazy="target" v-money="numberMask" :disable="true" float-label="Alvo" color="orange-9" />
            </q-field>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <q-field class="q-pa-sm" icon="description" :error="error_description" label="Descrição" label-width="12" />
            <q-editor v-model="description" color="orange-9" />
            <q-field class="q-pa-sm" :error="error_description" error-label="Este campo é obrigatório." label-width="12" />
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <q-field
              icon="rate_review"
              helper="Qual o nível de confiança?"
              :error="error_confidance" error-label="Este campo é obrigatório.">
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
import { Loading } from 'quasar';
import {VMoney} from 'v-money';

export default {
  directives: {money: VMoney},
  data() {
    return {
      type: null,
      previous: '',
      current: '',
      confidance: 0,
      target: '',
      description: '',
      message: { color: '', text: '' },
      error_current: false,
      error_confidance: false,
      error_description: false,
      errors: [],
      numberMask: {
        decimal: ',',
        thousands: '.',
        prefix: 'R$ ',
        suffix: '',
        precision: 2
      }
    }
  },
  mounted() {
    Loading.show({message: 'Carregando...'});
    this.$axios.get(this.$mangrowe.url +'/checkIns/create?key_result_id='+ this.$route.params.id, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
        this.type = response.data.type;
        if(this.type == 'boolean') {
          this.current = parseInt(response.data.current);
        }
        this.previous = this.current = response.data.current;
        this.target = response.data.target;
        if(response.data.format != 'currency') {
          this.numberMask.prefix = '';
        }
        if(response.data.format == 'percentage') {
          this.numberMask.suffix = '%';
        }
        Loading.hide();
    });
  },
  methods: {
    store() {
      if(this.validates()) {
        return;
      }
      Loading.show({message: 'Carregando...'});
      this.$axios.post(this.$mangrowe.url +'/checkIns', {
        key_result_id: this.$route.params.id,
        previous: this.$mangrowe.deformat(this.previous),
        current: this.$mangrowe.deformat(this.current),
        confidance: this.confidance,
        description: this.description
      }, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
      }).then((response) => {
          this.message.color = 'green';
          this.message.text = response.data.message;
          Loading.hide();
          setTimeout(() => {
            this.$router.push('/keyResults/edit/'+ this.$route.params.id +'/checkIns');
          }, 2000);
      }).catch((err) => {
          this.message.color = 'red';
          this.message.text = response.data.message;
          Loading.hide();
      });
    },
    validates() {
      this.errors = [];
      this.error_current = false;
      this.error_confidance = false;
      this.error_description = false;
      if(this.current.length < 1) {
        this.error_current = true;
        this.errors.push(this.error_current);
      }
      if(this.confidance < 1) {
        this.error_confidance = true;
        this.errors.push(this.error_confidance);
      }
      if(this.description.length < 1) {
        this.error_description = true;
        this.errors.push(this.error_description);
      }
      return this.errors.length;
    }
  }
}
</script>

<style>
</style>
