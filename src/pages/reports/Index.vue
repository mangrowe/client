<template>
  <q-page padding>
    <h3>
      Análises
    </h3>
    <div class="row">
      <div class="col-12">
        <q-field
        class="q-pa-sm"
        icon="person">
          <q-select v-model="user_id" :options="users" float-label="Responsável" color="orange-9" filter filter-placeholder="Pesquisar" @input="selectUser()" />
        </q-field>
      </div>
    </div>
    <div id="mynetwork"></div>
    <q-modal v-model="opened" content-css="padding: 0px 20px 30px 20px; margin: 30px;">
      <h4></h4>
      <p v-html="node != null ? node.title : ''"></p>
      <q-btn-group push class="float-right">
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
      user_id: null,
      users: []
    }
  },
  mounted() {    
    this.$axios.get(this.$mangrowe.url +'/reports?organization_id=' + this.$mangrowe.organization_id, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
      if(response.data.users != undefined) {
        for(let i = 0; i < response.data.users.length; i++) {
          this.users.push({
            label: response.data.users[i].name,
            value: response.data.users[i].id
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
      if(response.data.user != undefined) {
        nodes.push({
          id: 'u' + response.data.user.id,
          label: response.data.user.name,
          title: response.data.user.name,
          group: 'user'
        });
        for(let i = 0; i < response.data.user.objectives.length; i++) {
          total += response.data.user.objectives[i].total;
          nodes.push({
            id: 'o' + response.data.user.objectives[i].id,
            label: response.data.user.objectives[i].title.substring(0, 10) + '... [' + response.data.user.objectives[i].total.toFixed(0) + '%]',
            title: response.data.user.objectives[i].title,
            group: 'objectives'
          })
          edges.push({
            from: 'o' + response.data.user.objectives[i].id, 
            to: 'u' + response.data.user.id
          });
        }
        for(let i = 0; i < response.data.user.key_results.length; i++) {
          nodes.push({
            id: 'k' + response.data.user.key_results[i].id,
            label: response.data.user.key_results[i].title.substring(0, 10) + '... [' + response.data.user.key_results[i].total.toFixed(0) + '%]',
            title: response.data.user.key_results[i].title,
            group: 'key_results'
          })
          edges.push({
            from: 'k' + response.data.user.key_results[i].id, 
            to: 'o' + response.data.user.key_results[i].objective_id
          });
        }
        let totalPercentage = parseInt(total / response.data.user.objectives.length);
        let percentage = isNaN(totalPercentage) ? 0 : totalPercentage;
        nodes[0].label += ' [' + percentage + '%]';
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
          user: {
            shape: 'icon',
            icon: {
                face: 'FontAwesome',
                code: '\uf007',
                size: 50,
                color: '#2fb1ff'
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
          }
        }
      };
      var network = new vis.Network(container, data, options);
      network.on('click', function(params) {
        let selected = this.getNodeAt(params.pointer.DOM);
        self.node = nodes.find((elem, index) => {
          if(elem.id == selected) {
            self.opened = true
            return elem;
          }
        });
      });
    },
    selectUser() {
      this.$axios.get(this.$mangrowe.url +'/reports?organization_id=' + this.$mangrowe.organization_id + '&user_id=' + this.user_id, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
      }).then((response) => {
        this.loader(response);
      });
    }
  }
}

</script>

<style scoped>
@import url('https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css');
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
