<template>
  <q-page padding>
    <h3>Novo time</h3>
    <div v-if="message">
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
            v-model="contributors"
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
      contributors: []
    }
  },
  mounted() {
    this.$store.dispatch('teams/create', {
      url: this.$mangrowe.url,
      token: this.$mangrowe.token
    });
  },
  computed: {
    users() {
      return this.$store.state.teams.users;
    },
    message() {
      return this.$store.state.teams.message;
    }
  },
  methods: {
    store() {
      this.$store.dispatch('teams/store', {
        url: this.$mangrowe.url,
        token: this.$mangrowe.token,
        user_id: this.user_id,
        title: this.title,
        users: this.users.map((elem) => elem.value)
      });
    }
  }
}
</script>

<style>
</style>
