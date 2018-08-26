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
        icon="book">
          <q-input type="text" float-label="Título" color="orange-9" v-model="title" />
        </q-field>
        <q-field
        class="q-pa-sm"
        icon="person">
          <q-select
            v-model="user_id"
            :options="users"
            float-label="Responsável"
            color="orange-9"
          />
        </q-field>
        <q-field
        class="q-pa-sm"
        icon="people">
          <q-select
            v-model="members"
            :options="users"
            float-label="Colaboradores"
            multiple
            color="orange-9"
          />
        </q-field>
        <q-btn color="orange-9" @click="update()" class="q-pa-sm float-right" icon="save" label="Atualizar" />
        <q-btn color="red-9" @click="destroy()" class="q-pa-sm float-right" icon="delete" label="Remover" />
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
      message: { color: '', text: '' },
    }
  },
  mounted() {
    this.$axios.get(this.$mangrowe.url +'/teams/'+ this.$route.params.id +'/edit', { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
        this.user_id = response.data.team.user_id;
        this.title = response.data.team.title;
        for(let i = 0; i < response.data.members.length; i++) {
            this.members.push(response.data.members[i].id);
        }
        for(let i = 0; i < response.data.users.length; i++) {
            this.users.push({
                label: response.data.users[i].name,
                value: response.data.users[i].id
            });
        }
    });
  },
  methods: {
    update() {
      let data = {
        user_id: this.user_id,
        title: this.title,
        users: this.members
      };
      this.$axios.put(this.$mangrowe.url +'/teams/'+ this.$route.params.id, data, { headers: 
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
