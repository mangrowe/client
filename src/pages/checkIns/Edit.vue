<template>
  <q-page padding>
    <h3>Editar check-in</h3>
    <div v-if="message.text != ''">
      <q-alert :color="message.color">
        {{ message.text }}
      </q-alert>
    </div>
    <q-card-main>
      <form action="">
        <div class="row">
          <div class="col-12 col-md-4">
            <q-field
            class="q-pa-sm"
            icon="filter_1">
              <q-input type="number" v-model="previous" :disable="true" float-label="Atual" color="orange-9" />
            </q-field>
          </div>
          <div class="col-12 col-md-4">
            <q-field
            class="q-pa-sm"
            icon="filter_2">
              <q-input type="number" v-model="current" float-label="Novo" color="orange-9" />
            </q-field>
          </div>
          <div class="col-12 col-md-4">
            <q-field
            class="q-pa-sm"
            icon="filter_3">
              <q-input type="number" v-model="target" :disable="true" float-label="Alvo" color="orange-9" />
            </q-field>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <q-field
            class="q-pa-sm"
            icon="description">
              <q-editor v-model="description" float-label="Descrição" color="orange-9" />
            </q-field>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <q-field
              icon="rate_review"
              helper="Qual o nível de confiança?"
            >
              <q-rating size="2rem" v-model="confidance" color="orange-9" :max="3" icon="thumb_up_alt" />
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
export default {
  data() {
    return {
      key_result_id: 0,
      previous: '',
      current: '',
      confidance: 0,
      target: '',
      description: '',
      message: { color: '', text: '' }
    }
  },
  mounted() {
    this.$axios.get(this.$mangrowe.url +'/checkIns/'+ this.$route.params.id +'/edit', { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
        this.key_result_id = response.data.checkIn.key_result_id;
        this.previous = response.data.checkIn.previous;
        this.current = response.data.checkIn.current;
        this.target = response.data.keyResult.target;
        this.confidance = response.data.checkIn.confidance;
        this.description = response.data.checkIn.description;
    });
  },
  methods: {
    update() {
      this.$axios.put(this.$mangrowe.url +'/checkIns/'+ this.$route.params.id, {
        previous: this.previous,
        current: this.current,
        confidance: this.confidance,
        description: this.description
      }, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
      }).then((response) => {
          this.message.color = 'green';
          this.message.text = response.data.message;
          window.scrollTo(0, 0);
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
        this.$axios.delete(this.$mangrowe.url +'/checkIns/'+ this.$route.params.id, { headers: 
          {'Authorization': 'Bearer '+ this.$mangrowe.token}
        }).then((response) => {
            this.message.color = 'green';
            this.message.text = response.data.message;
            setTimeout(() => {
              this.$router.push('/keyResults/edit/'+ this.key_result_id +'/checkIns');
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
