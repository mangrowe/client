<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header id="header-top" class="print-hide">
      <q-toolbar
        color="orange-9"
        :inverted="$q.theme === 'ios'"
      >
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          MOKR
          <div slot="subtitle">{{ this.$mangrowe.organization_title }}</div>
        </q-toolbar-title>
        <q-btn flat round dense icon="arrow_back" @click="goBack()">
          <q-tooltip>Voltar</q-tooltip>
        </q-btn>
        <q-btn flat round dense icon="settings" to="/settings">
          <q-tooltip>Configuração</q-tooltip>
        </q-btn>
        <q-btn flat round dense icon="account_circle" to="/users/profile">
          <q-tooltip>Perfil</q-tooltip>
        </q-btn>
        <q-btn flat round dense icon="power_settings_new" @click="signOut()">
          <q-tooltip>Sair</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer
      v-model="leftDrawerOpen"
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
      class="print-hide"
    >
      <q-list
        no-border
        link
        inset-delimiter
      >
        <q-list-header>Navegação</q-list-header>
        <q-item to="/dashboard">
          <q-item-side icon="home" />
          <q-item-main label="Página inicial" />
        </q-item>
        <q-item to="/objectives">
          <q-item-side icon="assignment" />
          <q-item-main label="Objetivos" />
        </q-item>
        <q-item to="/keyResults">
          <q-item-side icon="vpn_key" />
          <q-item-main label="Resultados chave" />
        </q-item>
        <q-item to="/departments">
          <q-item-side icon="account_balance" />
          <q-item-main label="Unidade organizacional" />
        </q-item>
        <q-item to="/cycles">
          <q-item-side icon="donut_large" />
          <q-item-main label="Ciclos" />
        </q-item>
        <q-item to="/teams">
          <q-item-side icon="people" />
          <q-item-main label="Times" />
        </q-item>
        <q-item to="/users">
          <q-item-side icon="person" />
          <q-item-main label="Usuários" />
        </q-item>
        <q-item to="/organizations">
          <q-item-side icon="business_center" />
          <q-item-main label="Organizações" />
        </q-item>
        <q-item to="/reports">
          <q-item-side icon="bubble_chart" />
          <q-item-main label="Análises" />
        </q-item>
      </q-list>
    </q-layout-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL, LocalStorage, Loading } from 'quasar';

export default {
  name: 'MyLayout',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },
  methods: {
    openURL,
    signOut() {
      Loading.show({message: 'Carregando...'});
      this.$axios.post(this.$mangrowe.url +'/logout', {}).then((reponse) => {
        this.$mangrowe.organization_id = null;
        this.$mangrowe.token = null;
        this.$mangrowe.settings = null;
        LocalStorage.clear();
        Loading.hide();
        this.$router.push('/login');
      });
    },
    goBack() {
      window.history.back();
    }
  }
}
</script>

<style>
.layout-padding h3 {
  font-size: 35px;
  margin-top: 0;
  margin-bottom: 10px;
}
.layout-padding {
  padding: 15px 20px;
}
.q-btn {
  padding: 0px 10px;
  text-transform: capitalize;
}
</style>
