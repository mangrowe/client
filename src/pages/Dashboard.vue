<template>
  <q-page class="flex flex-center">
    {{ loading }}
  </q-page>
</template>

<script>
import { LocalStorage } from 'quasar';

export default {
  data() {
    return {
      loading: 'Configurando...'
    }
  },
  mounted() {
    this.$axios.get(this.$mangrowe.url +'/settings?organization_id='+ this.$mangrowe.organization_id, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
        this.$mangrowe.settings = response.data;
        LocalStorage.set('settings', this.$mangrowe.settings);
        if(this.$mangrowe.settings != null) {
          this.loading = '';
        }
    });
  }
}
</script>

<style>
</style>
