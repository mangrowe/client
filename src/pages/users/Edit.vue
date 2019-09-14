<template>
  <q-page padding>
    <h3>Editar usuário</h3>
    <div v-if="message.text != ''">
      <q-alert :color="message.color">
        {{ message.text }}
      </q-alert>
    </div>
    <q-card-main>
      <form action="">
        <q-field
        class="q-pa-sm"
        icon="person" :error="error_name" error-label="Este campo é obrigatório.">
          <q-input type="text" v-model="name" float-label="Nome completo" color="orange-9" />
        </q-field>

        <div class="row">
          <div class="col-12 col-md-6">
            <q-field
            class="q-pa-sm"
            icon="alternate_email" :error="error_email" error-label="Este campo é obrigatório.">
              <q-input type="text" v-model="email" float-label="Email" color="orange-9" />
            </q-field>
          </div>

          <div class="col-12 col-md-6">
            <q-field
            class="q-pa-sm"
            icon="lock">
              <q-input type="password" v-model="password" float-label="Senha" color="orange-9" />
            </q-field>
          </div>
        </div>
        <q-field
        class="q-pa-sm"
        icon="people" :error="error_associations" error-label="Este campo é obrigatório.">
          <q-select
            v-model="associations"
            :options="organizations"
            float-label="Organizações"
            multiple
            color="orange-9"
          />
        </q-field>
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
      name: '',
      email: '',
      password: '',
      organizations: [],
      associations: [],
      error_name: false,
      error_email: false,
      error_associations: false,
      errors: [],
      message: { color: '', text: '' }
    }
  },
  mounted() {
    Loading.show({message: 'Carregando...'});
    this.$axios.get(this.$mangrowe.url +'/users/'+ this.$route.params.id +'/edit', { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
        this.name = response.data.user.name;
        this.email = response.data.user.email;
        for(let i = 0; i < response.data.organizations.length; i++) {
            this.organizations.push({
                label: response.data.organizations[i].title,
                value: response.data.organizations[i].id
            });
        }
        for(let i = 0; i < response.data.associations.length; i++) {
            this.associations.push(parseInt(response.data.associations[i].id));
        }
        Loading.hide();
    });
  },
  methods: {
    update() {
      if(this.validates()) {
        return;
      }
      Loading.show({message: 'Carregando...'});
      this.$axios.put(this.$mangrowe.url +'/users/'+ this.$route.params.id, {
        name: this.name,
        email: this.email,
        password: this.password,
        associations: this.associations
      }, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
      }).then((response) => {
          this.message.color = 'green';
          this.message.text = response.data.message;
          window.scrollTo(0, 0);
          Loading.hide();
      }).catch((err) => {
          let errors = err.response.data.errors;
          this.message.color = 'red';
          this.message.text = '';

          if(errors.name != undefined) {
            this.message.text += errors.name.join() + ' ';
          }

          if(errors.email != undefined) {
            this.message.text += errors.email.join();
          }

          if(errors.password != undefined) {
            this.message.text += errors.password.join();
          }
          window.scrollTo(0, 0);
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
        this.$axios.delete(this.$mangrowe.url +'/users/'+ this.$route.params.id, { headers: 
          {'Authorization': 'Bearer '+ this.$mangrowe.token}
        }).then((response) => {
            this.message.color = 'green';
            this.message.text = response.data.message;
            Loading.hide();
            setTimeout(() => {
              this.$router.push('/users');
            }, 2000);
        }).catch((err) => {
            this.message.color = 'red';
            this.message.text = response.data.message;
            Loading.hide();
        });
      }).catch(() => {
        this.$q.notify('Operação não realizada.');
      });
    },
    validates() {
      this.errors = [];
      this.error_name = false;
      this.error_email = false;
      let emailRE = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if(this.name.length < 1) {
        this.error_name = true;
        this.errors.push(this.error_name);
      }
      if(this.email.length < 1) {
        this.error_email = true;
        this.errors.push(this.error_email);
      }
      if(!emailRE.test(this.email)) {
        this.error_email = true;
        this.errors.push(this.error_email);
      }
      return this.errors.length;
    }
  }
}
</script>

<style>
</style>
