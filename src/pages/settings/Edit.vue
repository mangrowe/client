<template>
  <q-page padding>
    <h3>Editar configuração</h3>
    <div v-if="message.text != ''">
      <q-alert :color="message.color">
        {{ message.text }}
      </q-alert>
    </div>
    <q-card-main>
      <form action="">
        <q-field
        class="q-pa-sm"
        icon="book" :error="error_title" error-label="Este campo é obrigatório.">
          <q-input type="text" float-label="Título" color="orange-9" v-model="title" />
        </q-field>
        <div class="row">
          <div class="col-6">
            <q-field
            class="q-pa-sm"
            icon="label_important" :error="error_code" error-label="Este campo é obrigatório.">
              <q-select
                v-model="code"
                :options="codes"
                float-label="Opção"
                color="orange-9"
              />
            </q-field>
          </div>
          <div class="col-6">
            <q-field
            class="q-pa-sm"
            icon="spellcheck" :error="error_info" error-label="Este campo é obrigatório.">
              <q-input type="text" float-label="Valor" color="orange-9" v-model="info" />
            </q-field>
          </div>
        </div>
        <q-field
        class="q-pa-sm"
        icon="invert_colors" :error="error_additional" error-label="Este campo é obrigatório.">
          <q-color-picker float-label="Adicional" color="orange-9" v-model="additional" />
        </q-field>
        <q-btn-group push class="float-right">
          <q-btn push color="red-9" @click="destroy()" class="q-pa-sm" icon="delete" label="Remover" />
          <q-btn push color="orange-9" @click="update()" class="q-pa-sm" icon="save" label="Atualizar" />
        </q-btn-group>
      </form>
    </q-card-main>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      code: '',
      codes: [
        {
          label: 'Régua',
          value: 'ruler'
        }
      ],
      info: '',
      additional: '',
      error_title: false,
      error_code: false,
      error_info: false,
      error_additional: false,
      errors: [],
      message: { color: '', text: '' },
    }
  },
  mounted() {
    this.$axios.get(this.$mangrowe.url +'/settings/'+ this.$route.params.id +'/edit', { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
        this.title = response.data.title;
        this.code = response.data.code;
        this.info = response.data.info;
        this.additional = response.data.additional;
    });
  },
  methods: {
    update() {
      if(this.validates()) {
        return;
      }
      this.$axios.put(this.$mangrowe.url +'/settings/'+ this.$route.params.id, {
        title: this.title,
        code: this.code,
        info: this.info,
        additional: this.additional
      }, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
      }).then((response) => {
          this.message.color = 'green';
          this.message.text = response.data.message;
      }).catch((err) => {
          this.message.color = 'red';
          this.message.text = response.data.message;
      });
    },
    destroy() {
      this.$q.dialog({
        title: 'Atenção',
        message: 'Deseja realmente remover?',
        ok: 'Sim',
        cancel: 'Não'
      }).then(() => {
        this.$axios.delete(this.$mangrowe.url +'/settings/'+ this.$route.params.id, { headers: 
          {'Authorization': 'Bearer '+ this.$mangrowe.token}
        }).then((response) => {
            this.message.color = 'green';
            this.message.text = response.data.message;
            setTimeout(() => {
              this.$router.push('/settings');
            }, 2000);
        }).catch((err) => {
            this.message.color = 'red';
            this.message.text = response.data.message;
        });
      }).catch(() => {
        this.$q.notify('Operação não realizada.');
      });
    },
    validates() {
      this.errors = [];
      this.error_title = false;
      this.error_code = false;
      this.error_info = false;
      this.error_additional = false;
      if(this.title == '') {
        this.error_title = true;
        this.errors.push(this.error_title);
      }
      if(this.code == '') {
        this.error_code = true;
        this.errors.push(this.error_code);
      }
      if(this.info == '') {
        this.error_info = true;
        this.errors.push(this.error_info);
      }
      if(this.additional == '') {
        this.error_additional = true;
        this.errors.push(this.error_additional);
      }
      return this.errors.length;
    }
  }
}
</script>

<style>
</style>
