<template>
  <div class="common-layout">
    <div class="header-name title">
      <p>{{ $t('message.bulletin') }}</p>
    </div>
    <VolOrderedTopList v-if="key === 'volume'" />
    <DealNumOrderedTopList v-else-if="key === 'number'" />
  </div>
</template>

<script setup>
  import { useRoute } from 'vue-router'
  import VolOrderedTopList from '../components/bulletin/containers/VolOrderedTopList.vue'
  import DealNumOrderedTopList from '../components/bulletin/containers/DealNumOrderedTopList.vue'

  const route = useRoute()
  const key = route.query.key
</script>

<style scoped>
  .header-name {
    border-radius: 10px;
    text-transform: uppercase;
    color: #fff;
    text-align: center;
    height: 50px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #124483;
    gap: 20px;
    margin-top: 10px;
  }
</style>
