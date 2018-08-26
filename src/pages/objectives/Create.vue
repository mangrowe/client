<template>
  <q-page padding>
    <h3>Criar Objetivo</h3>
    <q-card-main>
      <form action="">
        <q-field
        class="q-pa-sm"
        icon="assignment_late">
          <q-input type="text" float-label="Titulo do objetivo" color="orange-9" v-model="objective_name" />
        </q-field>

        <q-field
        class="q-pa-sm"
        icon="description">
          <q-input type="text" float-label="Descrição do objetivo" color="orange-9" v-model="objective_description" />
        </q-field>

        <div class="row">

          <div class="col-12 col-md-6">
            <q-field
            class="q-pa-sm"
            icon="assignment">
              <q-select v-model="select" :options="selectObjective" float-label="Objetivo Vinculado" color="orange-9" />
            </q-field>
          </div>

          <div class="col-12 col-md-6">
            <q-field
            class="q-pa-sm"
            icon="group">
              <q-select v-model="select" :options="selectTeam" float-label="Time" color="orange-9" />
            </q-field>
          </div>

          <div class="col-12 col-md-6">
            <q-field
            class="q-pa-sm"
            icon="assignment_ind">
              <q-select v-model="select" :options="selectResponsible" float-label="Responsável" color="orange-9" />
            </q-field>
          </div>
          <div class="col-12 col-md-6">
            <q-field
            class="q-pa-sm"
            icon="group_work">
              <q-select v-model="select" :options="selectCooperator" float-label="Colaboradores" color="orange-9" />
            </q-field>
          </div>
        </div>
        <div class="row justify-center">
          <q-btn push color="green-9" class="q-my-xl q-mx-sm" icon="add_circle" label="Criar Objetivo" />
          <q-btn push color="red-9" class="q-my-xl q-mx-sm" icon="cancel" label="Fechar" />
        </div>
      </form>
    </q-card-main>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      objective_name: '',
      objective_description: '',
      contributors: [],
      selectObjective: [
        {
          label: 'Objetivo',
          value: ''
        },
        {
          label: 'Objetivo',
          value: ''
        }
      ],

      selectTeam: [
        {
          label: 'Time',
          value: ''
        },
        {
          label: 'Time',
          value: ''
        }
      ],
      selectResponsible: [
        {
          label: 'Responsável',
          value: ''
        },
        {
          label: 'Responsável',
          value: ''
        }
      ],
      selectCooperator: [
        {
          label: 'Colaborador',
          value: ''
        },
        {
          label: 'Colaborador',
          value: ''
        }
      ]
    }
  },
}
</script>

<style>
</style>
