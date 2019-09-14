<template>
  <q-page padding>
    <h3>
      Impedimento 
      <q-chip v-show="isClosed" color="orange-9">
        Fechado
      </q-chip>
    </h3>
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
                  <q-select v-model="user_id" :options="users" filter filter-placeholder="Pesquisar" float-label="Atribuído a" color="orange-9" />
                </q-field>
              </div>
              <div class="col-12">
                <q-field class="q-pa-sm" icon="description" :error="error_description" label="Descrição" label-width="12" />
                <q-editor v-model="description" color="orange-9" />
                <q-field class="q-pa-sm" :error="error_description" error-label="Este campo é obrigatório." label-width="12" />
              </div>
              <div class="col-12">
                <q-field
                class="q-pa-sm"
                icon="archive">
                  <input type="file" @change="upload()" ref="archiveFile">
                </q-field>
              </div>
              <div class="col-12" v-show="status">
                <q-field
                class="q-pa-sm"
                icon="info">
                  <q-radio v-model="status" val="1" color="orange-9" label="Pendente" />
                  <q-radio v-model="status" val="2" color="orange-9" label="Resolvido" />
                  <q-radio v-model="status" val="3" color="orange-9" label="Fechado" v-show="isOwner" />
                </q-field>
              </div>
              <div class="col-12">
                <q-btn push color="orange-9" @click="store()" class="q-pa-sm float-right" icon="save" label="Salvar" v-show="!isClosed" />
              </div>
            </div>
          </form>
        </div>
      </q-collapsible>
    </q-list>
  </q-page>
</template>

<script>
import { Loading } from 'quasar';

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
      archive: null,
      status: 0,
      isOwner: false,
      isClosed: false,
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
      Loading.show({message: 'Carregando...'});
      const formData = new FormData();
      formData.append('key_result_id', this.$route.query.key_result_id);
      formData.append('description', this.description);
      if(this.user_id) {
        formData.append('receiver_id', this.user_id); 
      }
      if(this.archive) {
        formData.append('archive', this.archive);  
      }
      if(this.$route.query.parent_id) {
        formData.append('parent_id', this.$route.query.parent_id);
      }
      if(this.status) {
        formData.append('status', this.status); 
      }
      this.$axios.post(this.$mangrowe.url +'/impediments', formData, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
      }).then((response) => {
          this.message.color = 'green';
          this.message.text = response.data.message;
          window.scrollTo(0, 0);
          Loading.hide();
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
          Loading.hide();
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
    },
    upload() {
      this.archive = this.$refs.archiveFile.files[0];
    }
  },
  mounted() {
    let url = this.$mangrowe.url +'/impediments';
    if(this.$route.query.parent_id) {
      url += '/' + this.$route.query.parent_id;
      this.status = '1';
    }else {
      url += '/create?key_result_id=' + this.$route.query.key_result_id;
    }
    this.$axios.get(url, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
      this.objective = response.data.objective;
      this.keyResult = response.data.keyResult;
      this.impediment = response.data.impediment;
      if(response.data.closed) {
        this.isClosed = true;
      }
      if(response.data.impediment && response.data.owner_id == response.data.impediment.user_id) {
        this.isOwner = true;
      }
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
