<template>
  <q-page padding>
    <h3>
      Análises
      <q-btn-group push class="float-right">
        <q-btn push color="secondary" to="/reports" class="q-pa-sm" icon="pie_chart" label="Desempenho" />
        <q-btn push color="primary" to="/reports/teams" class="q-pa-sm" icon="people" label="Times" />
        <q-btn push color="green-9" to="/reports/users" class="q-pa-sm" icon="person" label="Colaboradores" />
      </q-btn-group>
    </h3>
    <div class="row">
      <div class="col-3 text-center" v-bind:key="index" v-for="(user, index) in users">
        <q-knob
          id="progress"
          :value="user.total"
          size="12rem"
          readonly
          :style="setting(user.total)"
        >
        {{ user.total.toFixed(1) }}%
        </q-knob> <br>
        {{ user.name.substring(0, 15) }}
      </div>
    </div>
  </q-page>
</template>

<script>

export default {
  data() {
    return {
      node: null,
      opened: false,
      user_id: null,
      users: []
    }
  },
  mounted() {
    this.$axios.get(this.$mangrowe.url +'/reports/users?organization_id=' + this.$mangrowe.organization_id, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
      this.users = response.data.users;
    });
  },
  methods: {
    setting(total) {
      for(var i = 0; i < this.$mangrowe.settings.length; i++) {
        if(this.$mangrowe.settings[i].code == 'ruler' && total <= this.$mangrowe.settings[i].info) {
          return 'color: ' + this.$mangrowe.settings[i].additional;
          break;
        }
      }
    }
  }
}

</script>

<style scoped>
</style>
