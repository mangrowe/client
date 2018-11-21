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
      <div class="col-12">
        <q-field
        class="q-pa-sm"
        icon="people">
          <q-select v-model="teams_id" :options="teams" float-label="Times" multiple color="orange-9" filter filter-placeholder="Pesquisar" @input="selectTeams()" />
        </q-field>
      </div>
    </div>
    <div id="mynetwork"></div>
    <q-modal v-model="opened" content-css="padding: 0px 20px 30px 20px; margin: 30px;">
      <h4></h4>
      <p v-html="node != null ? node.title : ''"></p>
      <q-btn-group push class="float-right">
        <q-btn
          color="primary"
          :to="opened_url"
          label="Acessar"
          push
          class="float-right"
          v-show="opened_url"
        />
        <q-btn
          color="orange-9"
          @click="opened = false"
          label="Fechar"
          push
          class="float-right"
        />
      </q-btn-group>
    </q-modal>
  </q-page>
</template>

<script>
import vis from 'vis';

export default {
  data() {
    return {
      node: null,
      opened: false,
      opened_url: '',
      teams_id: [],
      teams: []
    }
  },
  mounted() {    
    this.$axios.get(this.$mangrowe.url +'/reports/users?organization_id=' + this.$mangrowe.organization_id, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
      if(response.data.teams != undefined) {
        for(let i = 0; i < response.data.users.length; i++) {
          this.teams.push({
            label: response.data.teams[i].title,
            value: response.data.teams[i].id
          });
        }
      }
      this.loader(response);
    });
  },
  methods: {
    loader(response) {
      let self = this;
      let nodes = [];
      let edges = [];
      let total = 0;

      if(response.data.teams != undefined) {
        for(let i = 0; i < response.data.teams.length; i++) {
          let team = response.data.teams[i];
          nodes.push({
            id: 't' + team.id,
            label: team.title,
            title: team.title,
            group: 'teams'
          });
        }
      }

      if(response.data.users != undefined) {
        for(let i = 0; i < response.data.users.length; i++) {
          let user = response.data.users[i];
          
          nodes.push({
            id: 'u' + user.id,
            label: user.name + '[' + user.total.toFixed(1) + '%]',
            title: user.name,
            group: 'users'
          });

          if(user.teams != undefined) {
            for(let j = 0; j < user.teams.length; j++) {
              edges.push({
                from: 'u' + user.id, 
                to: 't' + user.teams[j].id
              });
            }
          }

          if(user.objectives != undefined) {
            for(let j = 0; j < user.objectives.length; j++) {
              total += user.objectives[j].total;
              nodes.push({
                id: 'o' + user.objectives[j].id,
                label: user.objectives[j].title.substring(0, 10) + '... [' + user.objectives[j].total.toFixed(0) + '%]',
                title: user.objectives[j].title,
                group: 'objectives'
              });
              edges.push({
                from: 'o' + user.objectives[j].id, 
                to: 'u' + user.id
              });

              if(user.objectives[j].key_results != undefined) {
                for(let k = 0; k < user.objectives[j].key_results.length; k++) {
                  let keyResult = user.objectives[j].key_results[k];
                  nodes.push({
                    id: 'k' + keyResult.id,
                    label: keyResult.title.substring(0, 10) + '... [' + keyResult.total.toFixed(0) + '%]',
                    title: keyResult.title,
                    group: 'key_results'
                  })
                  edges.push({
                    from: 'k' + keyResult.id, 
                    to: 'o' + keyResult.objective_id
                  });
                }
              }
            }
          }
        }
      }

      var container = document.getElementById('mynetwork');
      var data = {
          nodes: nodes,
          edges: edges
      };
      var options = {
        interaction: { hover: true },
        manipulation: {
          enabled: true
        },
        nodes: {
            shape: 'dot',
            size: 20,
            font: {
                size: 15,
                color: '#000000'
            },
            borderWidth: 1
        },
        edges: {
            width: 2
        },
        groups: {
          objectives: {
              shape: 'icon',
              icon: {
                  face: 'FontAwesome',
                  code: '\uf02d',
                  size: 50,
                  color: '#fbc403'
              }
          },
          key_results: {
            shape: 'icon',
            icon: {
                face: 'FontAwesome',
                code: '\uf084',
                size: 50,
                color: '#81c784'
            }
          },
          users: {
            shape: 'icon',
            icon: {
                face: 'FontAwesome',
                code: '\uf007',
                size: 50,
                color: '#31ccec'
            }
          },
          teams: {
            shape: 'icon',
            icon: {
                face: 'FontAwesome',
                code: '\uf0c0',
                size: 50,
                color: '#027be3'
            }
          }
        }
      };
      
      var network = new vis.Network(container, data, options);
      network.on('click', function(params) {
        let selected = this.getNodeAt(params.pointer.DOM);
        self.node = nodes.find((elem, index) => {
          if(elem.id == selected) {
            if(/^o/g.test(elem.id)) {
              self.opened_url = '/objectives/' + elem.id.replace('o', '');
            }else if(/^k/g.test(elem.id)) {
              self.opened_url = '/keyResults/' + elem.id.replace('k', '');
            }
            self.opened = true
            return elem;
          }
        });
      });
    },
    selectTeams() {
      this.$axios.get(this.$mangrowe.url +'/reports/teams?organization_id=' + this.$mangrowe.organization_id + '&teams_id=' + this.teams_id, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
      }).then((response) => {
        this.loader(response);
      });
    }
  }
}

</script>

<style scoped>
#mynetwork {
    width: 100%;
    height: 600px;
    border: 2px solid #efecec;
    box-shadow: 3px 3px 10px #efecec;
}

#vis-configuration-popup, .vis-configuration-popup {
  top: 0px;
  left: 0px;
  position: relative;
  padding: 20px;
  background: blue;
}

</style>
