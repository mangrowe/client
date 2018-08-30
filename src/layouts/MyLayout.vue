<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header id="header-top">
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
          <div slot="subtitle">ManGve OKR</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer
      v-model="leftDrawerOpen"
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
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
        <q-item to="/organizations">
          <q-item-side icon="business_center" />
          <q-item-main label="Organizações" />
        </q-item>
        <q-item to="/teams">
          <q-item-side icon="people" />
          <q-item-main label="Times" />
        </q-item>
        <q-item to="/users">
          <q-item-side icon="person" />
          <q-item-main label="Usuários" />
        </q-item>
        <q-item to="/cycles">
          <q-item-side icon="donut_large" />
          <q-item-main label="Ciclos" />
        </q-item>
      </q-list>
    </q-layout-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'

export default {
  name: 'MyLayout',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },
  methods: {
    openURL
  }
}
</script>

<style>
.layout-padding h3 {
  margin-top: 0;
  margin-bottom: 10px;
}
</style>
