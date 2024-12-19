<template>
  <div class="page-not-found">
    <h1 class="title">Sahifa topilmadi (404)</h1>
    <el-button @click="onClick"><i class="ion-md-home"></i> Go Home</el-button>
  </div>
</template>

<script>
  export default {
    name: 'PageNotFound',
    methods: {
      onClick() {
        this.$router.push({ path: '/' })
      },
    },
  }
</script>

<style scoped>
  .page-not-found {
    color: #124483;
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .page-not-found > .title {
    font-size: 27px;
    margin-bottom: 10px;
  }
</style>
