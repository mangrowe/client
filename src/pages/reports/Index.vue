<template>
  <q-page padding>
    <h3>
      Análises
    </h3>
    <div id="mynetwork"></div>
  </q-page>
</template>

<script>
import vis from 'vis';

export default {
  data() {
    return {
      
    }
  },
  mounted() {    
    this.$axios.get(this.$mangrowe.url +'/reports', { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
      let nodes = [];
      let edges = [];
      let total = 0;
      if(response.data.user != undefined) {
        nodes.push({
          id: 'u' + response.data.user.id,
          label: response.data.user.name,
          group: 'user'
        });
        for(let i = 0; i < response.data.user.objectives.length; i++) {
          total += response.data.user.objectives[i].total;
          nodes.push({
            id: 'o' + response.data.user.objectives[i].id,
            label: response.data.user.objectives[i].title + ' [' + response.data.user.objectives[i].total.toFixed(0) + '%]',
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
            label: response.data.user.key_results[i].title + ' [' + response.data.user.key_results[i].total.toFixed(0) + '%]',
            group: 'key_results'
          })
          edges.push({
            from: 'k' + response.data.user.key_results[i].id, 
            to: 'o' + response.data.user.key_results[i].objective_id
          });
        }
        nodes[0].label += ' [' + parseInt(total / response.data.user.objectives.length) + '%]';
      }

      var container = document.getElementById('mynetwork');
      var data = {
          nodes: nodes,
          edges: edges
      };
      var options = {
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
    });
  },
  methods: {
    
  }
}

</script>

<style scoped>
@import url('https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css');
#mynetwork {
    width: 800px;
    height: 600px;
    border: 2px solid #efecec;
    box-shadow: 3px 3px 10px #efecec;
}
</style>
