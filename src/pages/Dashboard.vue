<template>
  <q-page padding>
    <vo-basic :data="departments"></vo-basic>
    <div class="text-center">{{ loading }}</div>
  </q-page>
</template>

<script>
import { LocalStorage } from 'quasar';
import { VoBasic } from 'vue-orgchart';
import 'vue-orgchart/dist/style.min.css';

export default {
  components: { VoBasic },
  data() {
    return {
      loading: 'Configurando...',
      departments: {}
    }
  },
  mounted() {
    this.$axios.get(this.$mangrowe.url +'/pages?organization_id='+ this.$mangrowe.organization_id, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
        this.$mangrowe.settings = response.data.settings;
        LocalStorage.set('settings', this.$mangrowe.settings);
        this.departments = this.buildTree(response.data.departments);
        this.loading = '';
    });
  },
  methods: {
    buildTree(elements) {
      let branch = new Object();
      for(var i = 0; i < elements.length; i++) {
        branch['name'] = elements[i]['name'];
        if(elements[i]['children'] != undefined) {
          branch['children'] = elements[i]['children'];
        }
      }
      return branch;
    }
  }
}
</script>

<style>
.orgchart .node {
  width: 180px;
  height: 20px;
  padding: 0px;
  background-color: #ce5d00;
}
.orgchart .node .title {
  height: 20px;
  background-color: #ef6c00;
}
</style>
