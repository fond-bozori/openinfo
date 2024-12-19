<template>
  <div class="container">
    <News />
    <Generalstatistics />
    <Emitent />
    <MarqueEffect />

    <!--          <WebsiteNews/>-->
  </div>
</template>

<script setup>
  import Generalstatistics from './generalstatistics.vue'
  import News from './News.vue'
  import WebsiteNews from './Website-news.vue'
  import MarqueEffect from '@/components/MarqueEffect.vue'
  import Emitent from '@/components/Emitent.vue'
</script>

<style scoped>
  .container {
    max-width: 400px !important;
    padding: 0;
    margin-left: 20px;
  }
</style>
