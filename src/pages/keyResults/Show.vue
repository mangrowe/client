<template>
  <q-page padding>
    <h3>Resultado chave</h3>
    <div class="row">
      <div class="col-12">
        <p><b><q-icon name="title" /> Título </b><br> {{ title }}</p>
        <p><b><q-icon name="assignment" /> Objetivo </b><br> {{ objective }}</p>
        <p><b><q-icon name="person" /> Responsável </b><br> {{ user }}</p>
        <p><b><q-icon name="description" /> Base de cálculo </b><br> <span v-html="description"></span></p>
      </div>
    </div>
    <div class="row">
      <div class="col-4">
        <p><b><q-icon name="assignment" /> Tipo de resultado </b><br> {{ type }}</p> 
      </div>
      <div class="col-4">
        <p><b><q-icon name="timeline" /> Critérios </b><br> {{ criteria }}</p>
      </div>
      <div class="col-4">
        <p><b><q-icon name="tab_unselected" /> Formato </b><br> {{ format }}</p>
      </div>
    </div>
    <div class="row">
      <div class="col-4">
        <p><b><q-icon name="filter_1" /> Inicial </b><br> {{ initial }}</p>
      </div>
      <div class="col-4">
        <p><b><q-icon name="filter_2" /> Atual </b><br> {{ current }}</p>
      </div>
      <div class="col-4">
        <p><b><q-icon name="filter_3" /> Alvo </b><br> {{ target }}</p>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <q-btn-group push class="float-right">
          <q-btn push color="primary" @click="objectiveShow()" class="q-pa-sm" icon="assignment" label="Objetivo" />
          <q-btn push color="green-9" @click="checkIn()" class="q-pa-sm" icon="add_location" label="Check In" />
          <q-btn push color="orange-9" @click="edit()" class="q-pa-sm" icon="edit" label="Editar" />
        </q-btn-group>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      id: null,
      objective: '',
      objective_id: '',
      user: '',
      title: '',
      description: '',
      criteria: '',
      initial: 0,
      current: 0,
      target: 0,
      format: '',
      total: 0,
      type: ''
    }
  },
  methods: {
    edit() {
      this.$router.push('/keyResults/edit/'+ this.id);
    },
    objectiveShow() {
      this.$router.push('/objectives/'+ this.objective_id);
    },
    checkIn() {
      this.$router.push('/keyResults/edit/'+ this.$route.params.id +'/checkIns');
    }
  },
  mounted() {
    this.$axios.get(this.$mangrowe.url +'/keyResults/'+ this.$route.params.id +'?organization_id='+ this.$mangrowe.organization_id, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
      this.id = response.data.keyResult.id;
      this.objective = response.data.keyResult.objective.title;
      this.user = response.data.keyResult.user.name;
      this.title = response.data.keyResult.title;
      this.objective_id = response.data.keyResult.objective_id;
      this.description = response.data.keyResult.description;
      if(response.data.keyResult.type == 'boolean') {
        this.type = 'Booleano';
      }else {
        this.type = 'Númerico';
      }
      if(response.data.keyResult.criteria == 'gte') {
        this.criteria = 'Maior ou igual';
      }else {
        this.criteria = 'Menor ou igual';
      }
      this.initial = response.data.keyResult.initial;
      this.current = parseInt(response.data.keyResult.current);
      this.target = response.data.keyResult.target;
      if(response.data.keyResult.format == 'number') {
        this.format = 'Número';
      }else if(response.data.keyResult.format == 'currency') {
        this.format = 'Moeda';
      }else {
        this.format = 'Porcentagem';
      }
      this.total = response.data.keyResult.total;
    });
  },
}
</script>

<style scoped>
p {
  border-bottom: 1px solid #d2d2d2;
}
</style>
