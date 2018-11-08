<template>
  <q-page padding>
    <h3>Editar check-in</h3>
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
        <q-btn-group push class="float-right">
          <q-btn push color="red-9" @click="destroy()" class="q-pa-sm" icon="delete" label="Remover" />
          <q-btn push color="orange-9" @click="update()" class="q-pa-sm" icon="save" label="Atualizar" />
        </q-btn-group>
      </form>
    </q-card-main>
  </q-page>
</template>

<script>
import {VMoney} from 'v-money';

export default {
  directives: {money: VMoney},
  data() {
    return {
      type: null,
      key_result_id: 0,
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
    this.$axios.get(this.$mangrowe.url +'/checkIns/'+ this.$route.params.id +'/edit', { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
        this.type = response.data.keyResult.type;
        if(this.type == 'boolean') {
          this.current = parseInt(response.data.keyResult.current);
        }else {
          this.current = response.data.checkIn.current;
        }
        this.key_result_id = response.data.checkIn.key_result_id;
        this.previous = response.data.checkIn.previous;
        this.target = response.data.keyResult.target;
        this.confidance = response.data.checkIn.confidance;
        this.description = response.data.checkIn.description;
        if(response.data.keyResult.format != 'currency') {
          this.numberMask.prefix = '';
        }
        if(response.data.keyResult.format == 'percentage') {
          this.numberMask.suffix = '%';
        }
    });
  },
  methods: {
    update() {
      if(this.validates()) {
        return;
      }
      this.$axios.put(this.$mangrowe.url +'/checkIns/'+ this.$route.params.id, {
        previous: this.previous,
        current: this.current,
        confidance: this.confidance,
        description: this.description
      }, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
      }).then((response) => {
          this.message.color = 'green';
          this.message.text = response.data.message;
          window.scrollTo(0, 0);
      }).catch((err) => {
          this.message.color = 'red';
          this.message.text = response.data.message;
      });
    },
    destroy() {
      this.$q.dialog({
        title: 'Atenção',
        message: 'Deseja realmente remover?',
        ok: 'Sim',
        cancel: 'Não'
      }).then(() => {
        this.$axios.delete(this.$mangrowe.url +'/checkIns/'+ this.$route.params.id, { headers: 
          {'Authorization': 'Bearer '+ this.$mangrowe.token}
        }).then((response) => {
            this.message.color = 'green';
            this.message.text = response.data.message;
            setTimeout(() => {
              this.$router.push('/keyResults/edit/'+ this.key_result_id +'/checkIns');
            }, 2000);
        }).catch((err) => {
            this.message.color = 'red';
            this.message.text = response.data.message;
        });
      }).catch(() => {
        this.$q.notify('Operação não realizada.');
      });
    },
    validates() {
      this.errors = [];
      this.error_current = false;
      this.error_confidance = false;
      this.error_description = false;
      if(this.current == null) {
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
