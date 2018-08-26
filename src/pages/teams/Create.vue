<template>
  <q-page padding>
    <h3>Novo time</h3>
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
        <q-btn push color="orange-9" @click="store()" class="q-pa-sm float-right" icon="save" label="Salvar" />
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
    this.$axios.get(this.$mangrowe.url +'/teams/create', { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
        let result = response.data.users || [];
        for(let i = 0; i < result.length; i++) {
            this.users.push({
                label: result[i].name,
                value: result[i].id
            });
        }
    });
  },
  methods: {
    store() {
      let data = {
        user_id: this.user_id,
        title: this.title,
        users: this.members
      };
      this.$axios.post(this.$mangrowe.url +'/teams', data, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
      }).then((response) => {
          this.message.color = 'green';
          this.message.text = response.data.message;
          setInterval(() => {
            this.$router.push('/teams');
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
