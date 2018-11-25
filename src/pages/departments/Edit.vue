<template>
  <q-page padding>
    <h3>Editar unidade organizacional</h3>
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
        <q-btn-group push class="float-right">
          <q-btn push color="red-9" @click="destroy()" class="q-pa-sm" icon="delete" label="Remover" />
          <q-btn push color="orange-9" @click="update()" class="q-pa-sm" icon="save" label="Atualizar" />
        </q-btn-group>
      </form>
    </q-card-main>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      parent_id: null,
      title: '',
      titleEdit: '',
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
    this.$axios.get(this.$mangrowe.url +'/departments/'+ this.$route.params.id +'/edit?organization_id='+ this.$mangrowe.organization_id, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
        for(let i = 0; i < response.data.departments.length; i++) {
          this.departments.push({
              label: response.data.departments[i].title,
              value: response.data.departments[i].id
          });
        }
        this.organization_id = this.$mangrowe.organization_id;
        this.parent_id = parseInt(response.data.department.parent_id);
        this.title = response.data.department.title;
        this.weightHorizontal = response.data.department.weight_horizontal;
        this.weightVertical = response.data.department.weight_vertical;
        this.titleEdit = this.title;
    });
  },
  methods: {
    update() {
      if(this.validates()) {
        return;
      }
      this.$axios.put(this.$mangrowe.url +'/departments/'+ this.$route.params.id, {
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
      }).catch((err) => {
          this.message.color = 'red';
          this.message.text = err.response.data.message;
      });
    },
    destroy() {
      this.$q.dialog({
        title: 'Atenção',
        message: 'Deseja realmente remover?',
        ok: 'Sim',
        cancel: 'Não'
      }).then(() => {
        this.$axios.delete(this.$mangrowe.url +'/departments/'+ this.$route.params.id, { headers: 
          {'Authorization': 'Bearer '+ this.$mangrowe.token}
        }).then((response) => {
            this.message.color = 'green';
            this.message.text = response.data.message;
            setTimeout(() => {
              this.$router.push('/departments');
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
      this.error_title = false;
      this.error_horizontal = false;
      this.error_vertical = false;
      let total = parseInt(this.weightHorizontal) + parseInt(this.weightVertical);
      if(this.title.length < 1) {
        this.error_title = true;
        this.errors.push(this.error_title);
      }else {
        let departmentTaken = this.departments.find((department) => department.label == this.title);
        if(departmentTaken && this.titleEdit != this.title) {
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
