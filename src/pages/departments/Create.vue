<template>
  <q-page padding>
    <h3>Nova unidade organizacional</h3>
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
              <q-input type="text" v-model="title" float-label="Título" color="orange-9"/>
            </q-field>
          </div>
          <div class="col-12 col-md-6">
            <q-field
            class="q-pa-sm"
            icon="donut_large">
              <q-select v-model="parent_id" :options="departments" float-label="Unidade organizacional (pai)" color="orange-9" />
            </q-field>
          </div>
        </div>
        <div class="row">
          <div class="col-6">
            <q-field icon="view_stream" :error="error_horizontal" error-label="O somatório de horizontal e vertical devem ser 100%.">
              <q-input type="text" v-model="weightHorizontal" float-label="Peso dos objetivos da unidade" color="orange-9"/>
            </q-field>
          </div>
          <div class="col-6">
            <q-field icon="view_stream" :error="error_vertical" error-label="O somatório de horizontal e vertical devem ser 100%.">
              <q-input type="text" v-model="weightVertical" float-label="Peso da unidade organizacional" color="orange-9"/>
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

export default {
  data () {
    return {
      parent_id: null,
      title: '',
      departments: [],
      weightHorizontal: 40,
      weightVertical: 60,
      error_title: false,
      error_horizontal: false,
      error_vertical: false,
      message: { color: '', text: '' },
      errors: []
    }
  },
  mounted() {
    Loading.show({message: 'Carregando...'});
    this.$axios.get(this.$mangrowe.url +'/departments/create?organization_id='+ this.$mangrowe.organization_id, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
        for(let i = 0; i < response.data.length; i++) {
          this.departments.push({
              label: response.data[i].title,
              value: response.data[i].id
          });
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
      this.$axios.post(this.$mangrowe.url +'/departments', {
        organization_id: this.$mangrowe.organization_id,
        parent_id: this.parent_id,
        title: this.title,
        weight_horizontal: this.weightHorizontal,
        weight_vertical: this.weightVertical
      }, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
      }).then((response) => {
          this.message.color = 'green';
          this.message.text = response.data.message;
          Loading.hide();
          setTimeout(() => {
            this.$router.push('/departments');
          }, 2000);
      }).catch((err) => {
          this.message.color = 'red';
          this.message.text = err.response.data.message;
          Loading.hide();
      });
    },
    validates() {
      this.errors = [];
      this.error_title = false;
      this.error_horizontal = false;
      this.error_vertical = false;
      let total = parseInt(this.weightHorizontal) + parseInt(this.weightVertical);
      if(this.title.length < 1) {
        this.error_title = true;
        this.errors.push(this.error_title);
      }else {
        let departmentTaken = this.departments.find((department) => department.label == this.title);
        if(departmentTaken) {
          this.error_title = true;
          this.errors.push(this.error_title);
          this.$q.dialog({
            title: 'Aviso',
            message: 'Já existe um departamento com este nome.'
          });
        }
      }
      if(this.weightHorizontal.length < 1) {
        this.error_horizontal = true;
        this.errors.push(this.error_horizontal);
      }
      if(this.weightVertical.length < 1) {
        this.error_vertical = true;
        this.errors.push(this.error_vertical);
      }
      if(total != 100) {
        this.error_horizontal = true;
        this.error_vertical = true;
        this.errors.push(this.error_horizontal);
        this.errors.push(this.error_vertical);
      }
      return this.errors.length;
    }
  }
}
</script>

<style>
</style>
