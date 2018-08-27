<template>
  <q-page padding>
    <h3>Cadastrar Ciclo</h3>
    <q-card-main>
      <form action="">
        <div class="row">
          <div class="col-12 col-md-4">
            <q-field
            class="q-pa-sm"
            icon="donut_large">
              <q-input type="text" float-label="Nome do Ciclo" color="orange-9" v-model="cycle_name" />
            </q-field>
          </div>

          <div class="col-12 col-md-4">
            <q-field
            class="q-pa-sm"
            icon="work">
              <q-select v-model="select" :options="selectCycleType" float-label="Tipo do Ciclo" color="orange-9" />
            </q-field>
          </div>

          <div class="col-12 col-md-4">
            <q-field
            class="q-pa-sm"
            icon="work">
              <q-select v-model="select" :options="selectStrategicCycle" float-label="Ciclo Estratégico Vinculado" color="orange-9" />
            </q-field>
          </div>
        </div>

        <q-field
        class="q-pa-sm"
        icon="description">
          <q-input type="text" float-label="Descrição do Ciclo" color="orange-9" v-model="cycle_description" />
        </q-field>

        <div class="row">
          <div class="col-12 col-md-6">
            <q-field
              class="q-pa-sm"
              icon="date_range">
              <q-datetime v-model="modelDateStart" type="date" float-label="Informe a data de início do ciclo" />
            </q-field>
          </div>

          <div class="col-12 col-md-6">
            <q-field
              class="q-pa-sm"
              icon="date_range">
              <q-datetime v-model="modelDateEnd" type="date" float-label="Informe a data de término do ciclo" />
            </q-field>
          </div>
        </div>
          <q-btn push color="orange-9" class="q-my-xl q-mx-sm float-right" icon="save" label="Cadastrar Ciclo" />
      </form>
    </q-card-main>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      cycle_name: '',
      selectCycleType: [
        {
          label: 'Estratégico',
          value: ''
        },
        {
          label: 'Tático',
          value: ''
        }
      ],
      selectStrategicCycle:[
        {
          label: 'Ciclo Estratégico 1',
          value: ''
        },
        {
          label: 'Ciclo Estratégico 2',
          value: ''
        }
      ],
      cycle_description: '',
      modelDateStart: new Date(),
      modelDateEnd: new Date()
    }
  },
}
</script>

<style>
</style>