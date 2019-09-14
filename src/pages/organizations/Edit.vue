<template>
  <q-page padding>
    <h3>Editar organização</h3>
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
        <q-btn-group push class="float-right">
          <q-btn push color="red-9" @click="destroy()" class="q-pa-sm" icon="delete" label="Remover" />
          <q-btn push color="orange-9" @click="update()" class="q-pa-sm" icon="save" label="Atualizar" />
        </q-btn-group>
      </form>
    </q-card-main>
  </q-page>
</template>

<script>
import { Loading } from 'quasar';

export default {
  data () {
    return {
      title: '',
      error_title: false,
      message: { color: '', text: '' }
    }
  },
  mounted() {
    Loading.show({message: 'Carregando...'});
    this.$axios.get(this.$mangrowe.url +'/organizations/'+ this.$route.params.id +'/edit', { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
        this.title = response.data.title;
        Loading.hide();
    });
  },
  methods: {
    update() {
      if(this.title.length < 1) {
        this.error_title = true;
        return;
      }
      Loading.show({message: 'Carregando...'});
      this.$axios.put(this.$mangrowe.url +'/organizations/'+ this.$route.params.id, {
        title: this.title
      }, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
      }).then((response) => {
          this.message.color = 'green';
          this.message.text = response.data.message;
          Loading.hide();
      }).catch((err) => {
          this.message.color = 'red';
          this.message.text = response.data.message;
          Loading.hide();
      });
    },
    destroy() {
      this.$q.dialog({
        title: 'Atenção',
        message: 'Deseja realmente remover?',
        ok: 'Sim',
        cancel: 'Não'
      }).then(() => {
        Loading.show({message: 'Carregando...'});
        this.$axios.delete(this.$mangrowe.url +'/organizations/'+ this.$route.params.id, { headers: 
          {'Authorization': 'Bearer '+ this.$mangrowe.token}
        }).then((response) => {
            this.message.color = 'green';
            this.message.text = response.data.message;
            Loading.hide();
            setTimeout(() => {
              this.$router.push('/organizations');
            }, 2000);
        }).catch((err) => {
            this.message.color = 'red';
            this.message.text = response.data.message;
            Loading.hide();
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
