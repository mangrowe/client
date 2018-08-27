<template>
  <q-page padding>
    <h3>Editar ciclo</h3>
    <div v-if="message.text != ''">
      <q-alert :color="message.color">
        {{ message.text }}
      </q-alert>
    </div>
    <q-card-main>
      <form action="">
        <div class="row">
          <div class="col-12 col-md-12">
            <q-field
            class="q-pa-sm"
            icon="title">
              <q-input type="text" v-model="title" float-label="Título" color="orange-9" />
            </q-field>
          </div>
        </div>

        <q-field
        class="q-pa-sm"
        icon="description">
          <q-editor v-model="description" float-label="Descrição" color="orange-9" />
        </q-field>

        <div class="row">
          <div class="col-12 col-md-6">
            <q-field
              class="q-pa-sm"
              icon="date_range">
              <q-datetime v-model="start_at" type="date" color="orange-9" float-label="Data de início" />
            </q-field>
          </div>

          <div class="col-12 col-md-6">
            <q-field
              class="q-pa-sm"
              icon="date_range">
              <q-datetime v-model="end_at" type="date" color="orange-9" float-label="Data de término" />
            </q-field>
          </div>
        </div>
        <q-btn-group push class="float-right">
          <q-btn push color="red-9" @click="destroy()" class="q-pa-sm" icon="delete" label="Remover" />
          <q-btn push color="orange-9" @click="update()" class="q-pa-sm" icon="save" label="Atualizar" />
        </q-btn-group>
      </form>
    </q-card-main>
  </q-page>
</template>

<script>
import moment from 'moment';

export default {
  data () {
    return {
      title: '',
      description: '',
      cycle_name: '',
      start_at: '',
      end_at: '',
      message: { color: '', text: '' }
    }
  },
  mounted() {
    this.$axios.get(this.$mangrowe.url +'/cycles/'+ this.$route.params.id +'/edit', { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
        this.organization_id = this.$mangrowe.organization_id;
        this.title = response.data.title;
        this.description = response.data.description;
        this.start_at = moment(response.data.start_at).format('LLLL');
        this.end_at = moment(response.data.end_at).format('LLLL');
    });
  },
  methods: {
    update() {
      this.$axios.put(this.$mangrowe.url +'/cycles/'+ this.$route.params.id, {
        organization_id: this.$mangrowe.organization_id,
        title: this.title,
        description: this.description,
        start_at: moment(this.start_at).format('YYYY-MM-DD'),
        end_at: moment(this.end_at).format('YYYY-MM-DD')
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
        this.$axios.delete(this.$mangrowe.url +'/cycles/'+ this.$route.params.id, { headers: 
          {'Authorization': 'Bearer '+ this.$mangrowe.token}
        }).then((response) => {
            this.message.color = 'green';
            this.message.text = response.data.message;
            setTimeout(() => {
              this.$router.push('/cycles');
            }, 2000);
        }).catch((err) => {
            this.message.color = 'red';
            this.message.text = response.data.message;
        });
      }).catch(() => {
        this.$q.notify('Operação não realizada.');
      });
    }
  }
}
</script>

<style>
</style>
