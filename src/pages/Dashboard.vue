<template>
  <q-page padding>
    <q-card>
      <q-card-title>
        Progressos
      </q-card-title>
      <q-card-separator />
      <q-card-main>
        <vo-basic :data="departments"></vo-basic>
        <div class="text-center">{{ loading }}</div>
      </q-card-main>
    </q-card>
    <q-card>
      <q-card-title>
        Últimas atualizações
      </q-card-title>
      <q-card-separator />
      <q-card-main>
        <q-list>
        <q-item v-bind:key="index" v-for="(activity, index) in activities">
          <q-item-side icon="update" inverted color="orange-9" />
          <q-item-main>
            <q-item-tile label>{{ activity.message }}</q-item-tile>
          </q-item-main>
          <q-item-tile sublabel>{{ activity.created_at | dated }}</q-item-tile>
        </q-item>
        </q-list>
      </q-card-main>
    </q-card>
  </q-page>
</template>

<script>
import { LocalStorage, date, Loading } from 'quasar';
import { VoBasic } from 'vue-orgchart';
import 'vue-orgchart/dist/style.min.css';

export default {
  components: { VoBasic },
  data() {
    return {
      loading: 'Configurando...',
      departments: {},
      activities: [],
    }
  },
  mounted() {
    Loading.show({message: 'Carregando...'});
    this.$axios.get(this.$mangrowe.url +'/pages?organization_id='+ this.$mangrowe.organization_id, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
        this.$mangrowe.settings = response.data.settings;
        LocalStorage.set('settings', this.$mangrowe.settings);
        this.departments = this.buildTree(response.data.departments);
        this.activities = response.data.activities;
        this.loading = '';
        Loading.hide();
    }).catch((err) => {
      if(err.response == undefined) {
        LocalStorage.clear();
        Loading.hide();
        this.$router.push('/login');
      }
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
  },
  filters: {
    dated(value) {
      const hour = value.substr(11);
      const created = value.substring(0, 10);
      return created.substr(8, 2) +'/'+ created.substr(5, 2) +'/'+ created.substr(0, 4) +' '+ hour;
    }
  }
}
</script>

<style>
::-webkit-scrollbar {
    height: 10px;
}
::-webkit-scrollbar-track {
    background: #f1f1f1; 
}
::-webkit-scrollbar-thumb {
    background: #dddddd; 
}
::-webkit-scrollbar-thumb:hover {
    background: #d1d1d1; 
}
#chart-container {
  overflow-x: auto;
}
.orgchart .node {
  width: 200px;
  height: 20px;
  padding: 0px;
  background-color: none;
}
.orgchart .node .title {
  height: 20px;
  background-color: #ef6c00;
  font-size: 14px;
  line-height: 20px;
}
</style>
