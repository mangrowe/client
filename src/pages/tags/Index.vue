<template>
  <q-page padding>
    <h3>
      Tags
    </h3>
    <q-card>
      <div class="row">
        <div class="col-12">
          <q-field
          class="q-pa-sm"
          icon="title">
            <q-input type="text" v-model="title" float-label="Titulo da tag" color="orange-9" @keyup="search()" />
          </q-field>
        </div>
      </div>
    </q-card>
    <q-table 
      title="Tags"
      :columns="columns"
      :data="tagList"
      no-data-label="Sem registros disponíveis"
      rows-per-page-label="Linhas por páginas"
      :pagination-label="paginate"
    >
      <q-tr slot="body" slot-scope="props" :props="props" @click.native="show(props.row)" class="cursor-pointer">
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.value }}
        </q-td>
      </q-tr>
    </q-table>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      columns: [
        {
          name: 'id',
          field: 'id',
          align: 'left',
          label: '#',
          sortable: true
        },
        {
          name: 'title',
          field: 'title',
          align: 'left',
          label: 'Título',
          sortable: true
        }
      ],
      tags: [],
      tagList: []
    }
  },
  mounted() {
    this.$axios.get(this.$mangrowe.url +'/tags?organization_id='+ this.$mangrowe.organization_id, { headers: 
        {'Authorization': 'Bearer '+ this.$mangrowe.token}
    }).then((response) => {
        this.tags = this.tagList = response.data;
    });
  },
  methods: {
    show(tag) {
      this.$router.push('tags/'+ tag.id);
    },
    paginate(start, end, total) {
      return start + ' até ' + end + ' de ' + total;
    },
    search() {
      this.tagList = this.tags.filter((obj) => obj.title.includes(this.title));
    }
  }
}

</script>

<style>
</style>
