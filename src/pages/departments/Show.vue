<template>
  <q-page padding>
    <vo-basic :data="departments"></vo-basic>
  </q-page>
</template>

<script>
import { VoBasic } from 'vue-orgchart';
import 'vue-orgchart/dist/style.min.css'

export default {
  components: { VoBasic },
  data() {
    return {
      departments: {}
    }
  },
  mounted() {
    this.$axios.get(this.$mangrowe.url +'/departments/tree?organization_id='+ this.$mangrowe.organization_id, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
        this.departments = this.buildTree(response.data);
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
.orgchart .node .title {
  background-color: #ef6c00;
}
</style>
