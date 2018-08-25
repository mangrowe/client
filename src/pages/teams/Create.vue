<template>
  <q-page padding>
    <h3>Novo time</h3>
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
        <q-btn color="orange-9" @click="store()" class="q-pa-sm float-right" icon="save" label="Salvar" />
      </form>
    </q-card-main>
    {{ messages }}
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
    this.$store.dispatch('teams/create');
  },
  computed: {
    users() {
      return this.$store.state.teams.users;
    },
    messages() {
      return this.$store.state.teams.messages;
    }
  },
  methods: {
    store() {
      let data = {
        user_id: this.user_id,
        title: this.title,
        users: this.users.map((elem) => elem.value)
      };
      this.$store.dispatch('teams/store', data);
    }
  }
}
</script>

<style>
</style>
