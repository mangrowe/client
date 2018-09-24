<template>
  <q-page padding>
    <h3>Editar time</h3>
    <div v-if="message.text != ''">
      <q-alert :color="message.color">
        {{ message.text }}
      </q-alert>
    </div>
    <q-card-main>
      <form action="">
        <q-field
        class="q-pa-sm"
        icon="book" :error="error_title" error-label="Este campo é obrigatório.">
          <q-input type="text" float-label="Título" color="orange-9" v-model="title" />
        </q-field>
        <q-field
        class="q-pa-sm"
        icon="person" :error="error_user" error-label="Este campo é obrigatório.">
          <q-select
            v-model="user_id"
            :options="users"
            float-label="Responsável"
            color="orange-9"
          />
        </q-field>
        <q-field
        class="q-pa-sm"
        icon="people" :error="error_members" error-label="Este campo é obrigatório.">
          <q-select
            v-model="members"
            :options="users"
            float-label="Colaboradores"
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
export default {
  data () {
    return {
      title: '',
      user_id: '',
      members: [],
      users: [],
      error_title: false,
      error_user: false,
      error_members: false,
      errors: [],
      message: { color: '', text: '' },
    }
  },
  mounted() {
    this.$axios.get(this.$mangrowe.url +'/teams/'+ this.$route.params.id +'/edit?organization_id='+ this.$mangrowe.organization_id, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
        for(let i = 0; i < response.data.members.length; i++) {
            this.members.push(parseInt(response.data.members[i].id));
        }
        for(let i = 0; i < response.data.users.length; i++) {
            this.users.push({
                label: response.data.users[i].name,
                value: response.data.users[i].id
            });
        }
        this.user_id = parseInt(response.data.team.user_id);
        this.title = response.data.team.title;
    });
  },
  methods: {
    update() {
      if(this.validates()) {
        return;
      }
      this.$axios.put(this.$mangrowe.url +'/teams/'+ this.$route.params.id, {
        user_id: this.user_id,
        title: this.title,
        users: this.members
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
        this.$axios.delete(this.$mangrowe.url +'/teams/'+ this.$route.params.id, { headers: 
          {'Authorization': 'Bearer '+ this.$mangrowe.token}
        }).then((response) => {
            this.message.color = 'green';
            this.message.text = response.data.message;
            setTimeout(() => {
              this.$router.push('/teams');
            }, 2000);
        }).catch((err) => {
              this.message.color = 'red';
              this.message.text = 'A operação não pode ser realizada, por favor, verifique a relação com objetivos.';
              window.scrollTo(0, 0);
           
        });
      }).catch(() => {
        this.$q.notify('Operação não realizada.');
      });
    },
    validates() {
      this.errors = [];
      this.error_title = false;
      this.error_user = false;
      this.error_members = false;
      if(this.title.length < 1) {
        this.error_title = true;
        this.errors.push(this.error_title);
      }
      if(this.user_id.length < 1) {
        this.error_user = true;
        this.errors.push(this.error_user);
      }
      if(this.members.length < 1) {
        this.error_members = true;
        this.errors.push(this.error_members);
      }
      return this.errors.length;
    }
  }
}
</script>

<style>
</style>
