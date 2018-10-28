<template>
  <q-page padding>
    <h3>Impedimento</h3>
    <div v-if="message.text != ''">
      <q-alert :color="message.color">
        {{ message.text }}
      </q-alert>
    </div>
    <q-list>
      <q-collapsible icon="notification_important" label="Detalhes">
        <div>
          <p><b><q-icon name="assignment" /> Objetivo </b><br> {{ objective }}</p>
          <p><b><q-icon name="vpn_key" /> Resultado chave </b><br> {{ keyResult }}</p>
          <p><b><q-icon name="notification_important" /> Impedimento </b><br> {{ impediment ? impediment.description : '-' }}</p>
        </div>
      </q-collapsible>
      <q-collapsible icon="note_add" opened label="Relatar">
        <div>
          <form>
            <div class="row">
              <div class="col-12">
                <q-field
                class="q-pa-sm"
                icon="assignment_ind">
                  <q-select v-model="user_id" :options="users" filter filter-placeholder="Pesquisar" float-label="Solicitado" color="orange-9" />
                </q-field>
              </div>
              <div class="col-12">
                <q-field
                class="q-pa-sm"
                icon="description" :error="error_description" error-label="Este campo é obrigatório.">
                  <q-editor v-model="description" float-label="Descrição" color="orange-9" />
                </q-field>
              </div>
              <div class="col-12">
                <q-field
                class="q-pa-sm"
                icon="archive">
                  <input type="file">
                </q-field>
              </div>
              <div class="col-12">
                <q-btn push color="orange-9" @click="store()" class="q-pa-sm float-right" icon="save" label="Salvar" />
              </div>
            </div>
          </form>
        </div>
      </q-collapsible>
    </q-list>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      objective: '',
      keyResult: '',
      description: '',
      impediment: {},
      user_id: null,
      users: [],
      parent_id: null,
      errors: [],
      error_description: false,
      message: { color: '', text: '' }
    }
  },
  methods: {
    store() {
      if(this.validates()) {
        return;
      }
      this.$axios.post(this.$mangrowe.url +'/impediments', {
        receiver_id: this.user_id,
        key_result_id: this.$route.query.key_result_id,
        parent_id: this.$route.query.parent_id ? this.$route.query.parent_id : this.parent_id,
        description: this.description
      }, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
      }).then((response) => {
          this.message.color = 'green';
          this.message.text = response.data.message;
          window.scrollTo(0, 0);
          setTimeout(() => {
            if(this.$route.query.parent_id) {
              this.$router.push('/impediments/'+ this.$route.query.parent_id);
            }else {
              this.$router.push('/impediments?key_result_id='+ this.$route.query.key_result_id);
            }
          }, 2000);
      }).catch((err) => {
          this.message.color = 'red';
          this.message.text = err.response.data.message;
      });
    },
    validates() {
      this.errors = [];
      this.error_description = false;
      if(this.description.length < 1) {
        this.error_description = true;
        this.errors.push(this.error_description);
      }
      return this.errors.length;
    }
  },
  mounted() {
    let url = this.$mangrowe.url +'/impediments';
    if(this.$route.query.parent_id) {
      url += '/' + this.$route.query.parent_id;
    }else {
      url += '/create?key_result_id=' + this.$route.query.key_result_id;
    }
    this.$axios.get(url, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
      this.objective = response.data.objective;
      this.keyResult = response.data.keyResult;
      this.impediment = response.data.impediment;
      for(let i = 0; i < response.data.users.length; i++) {
        this.users.push({
            label: response.data.users[i].name,
            value: response.data.users[i].id
        });
      }
    });
  }
}
</script>

<style>
</style>
