<template>
  <q-page class="flex flex-center">
    Carregando...
  </q-page>
</template>

<style>
</style>

<script>
export default {
  name: 'PageIndex',
  mounted() {
    this.$router.push('/dashboard');
  }
}
</script>
