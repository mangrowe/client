<template>
  <q-page padding>
    <h3>Cadastrar Organização</h3>
    <q-card-main>
      <form action="">
        <div class="row">
          <div class="col-12 col-md-6">
            <q-field
            class="q-pa-sm"
            icon="business_center">
              <q-input type="text" float-label="Nome da organização" color="orange-9" v-model="company_name" />
            </q-field>
          </div>

          <div class="col-12 col-md-6">
            <q-field
            class="q-pa-sm"
            icon="help">
              <q-input type="phone" float-label="Plan?" color="orange-9" v-model="company_plan" />
            </q-field>
          </div>

          <div class="col-12 col-md-6">
            <q-field
            class="q-pa-sm"
            icon="phone">
              <q-input type="text" float-label="Informe o telefone" color="orange-9" v-model="company_phone" />
            </q-field>
          </div>

          <div class="col-12 col-md-6">
            <q-field
            class="q-px-sm q-pt-lg"
            label="A empresa está ativa?"
            icon="lens">
              <q-radio v-model="option" val="opt1" color="green-7" label="Sim" checked-icon="check_circle" class="q-mx-xl" />
              <q-radio v-model="option" val="opt1" color="red-7" label="Não" checked-icon="cancel"/> 
            </q-field>
          </div>
        </div>
          <q-btn push color="orange-9" class="q-my-xl q-mx-sm float-right" icon="save" label="Salvar" />
      </form>
    </q-card-main>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      company_name: '',
      company_plan: '',
      company_phone:''
    }
  },
}
</script>

<style>
</style>
