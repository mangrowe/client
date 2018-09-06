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
            icon="title">
              <q-input type="text" v-model="title" float-label="Título" color="orange-9" :error="error_title" error-label="Este campo é obrigatório."/>
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
      departments: [],
      error_title: false,
      message: { color: '', text: '' }
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
        this.parent_id = response.data.department.parent_id;
        this.title = response.data.department.title;
    });
  },
  methods: {
    update() {
      if(this.title.length < 1) {
        this.error_title = true;
        return;
      }
      this.$axios.put(this.$mangrowe.url +'/departments/'+ this.$route.params.id, {
        organization_id: this.$mangrowe.organization_id,
        parent_id: this.parent_id,
        title: this.title,
      }, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
      }).then((response) => {
          this.message.color = 'green';
          this.message.text = response.data.message;
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
    }
  }
}
</script>

<style>
</style>
