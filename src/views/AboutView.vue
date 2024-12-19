<template>
  <div class="container">
    <Random />
  </div>
</template>

<script>
  import Random from '../components/Random/Random.vue'
  export default {
    components: { Random },
  }
</script>
<style scoped>
  .container {
    min-height: 100vh;
    background: #eee;
    border-radius: 10px;
    padding: 0;
    margin: 0;
  }

  h1 {
    margin: 0;
  }
</style>
