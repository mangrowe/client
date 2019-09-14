<template>
  <q-page padding>
    <div class="row">
      <div class="col-12">
        <h3>
          Análises
          <q-btn-group push class="float-right">
            <q-btn push color="secondary" size="sm" to="/reports" class="q-pa-sm" label="Desempenho" :disable="true" />
            <q-btn push color="primary" size="sm" to="/reports/teams" class="q-pa-sm" label="Times" />
            <q-btn push color="green-9" size="sm" to="/reports/users" class="q-pa-sm" label="Colaboradores" />
            <q-btn push color="grey-8" size="sm" to="/reports/levels" class="q-pa-sm" label="Níveis" />
            <q-btn push color="blue-9" size="sm" to="/reports/objectives" class="q-pa-sm"  label="Objetivos" />
          </q-btn-group>
        </h3>
      </div>
    </div><br>
    <div class="row">
      <div class="col-12 col-sm-3 text-center" v-bind:key="index" v-for="(user, index) in users">
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
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-fab
        icon="share"
        direction="up"
        color="orange-9"
      >
        <q-fab-action @click="share('whatsapp')" color="secondary" class="white" icon="fa fa-whatsapp" />
        <q-fab-action @click="share('facebook')" color="secondary" class="white" icon="fa fa-facebook" />
        <q-fab-action @click="share('mail')" color="secondary" class="white" icon="mail" />
      </q-fab>
    </q-page-sticky>
  </q-page>
</template>

<script>
import { openURL, LocalStorage, Loading } from 'quasar';

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
    Loading.show({message: 'Carregando...'});
    this.$axios.get(this.$mangrowe.url +'/reports/users?organization_id=' + this.$mangrowe.organization_id, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
      this.users = response.data.users;
      Loading.hide();
    }).catch((err) => {
      Loading.hide();
      if(err.response == undefined) {
        LocalStorage.clear();
        this.$router.push('/login');
      }
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
    },
    share(type) {
      switch(type) {
        case 'mail':
          this.$q.dialog({
            title: 'Informar',
            message: 'Para qual e-mail deseja enviar? Ex.: contact@mangrowe.com',
            prompt: {
              model: '',
              type: 'text'
            },
            cancel: 'Cancelar',
            color: 'orange-9'
          }).then((res) => {
            window.location.href = 'mailto:'+ res +'&subject=Relatório de desempenho MOKR&body=' + this.$mangrowe.urlClient + '/reports';
          }).catch((err) => {});
          break;
        case 'whatsapp':
          this.$q.dialog({
            title: 'Informar',
            message: 'Para qual número de WhatsApp deseja enviar? Ex.: 5581998765432',
            prompt: {
              model: '',
              type: 'text'
            },
            cancel: 'Cancelar',
            color: 'orange-9'
          }).then((res) => {
            openURL('https://web.whatsapp.com/send?phone='+ res.replace(/\D/g, '') +'&text=Relatório de desempenho MOKR ' + this.$mangrowe.urlClient + '/reports');
          }).catch((err) => {});
          break;
        case 'facebook':
          openURL('https://www.facebook.com/sharer/sharer.php?u=' + this.$mangrowe.urlClient + '/reports');
          break;
      }
    }
  }
}

</script>

<style scoped>
</style>
