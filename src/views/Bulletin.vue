<template>
  <div class="common-layout">
    <div class="header-name title">
      <p>{{ $t('message.bulletin') }}</p>
    </div>
    <Quotes />
    <BulletinChart20 />

    <PieChartStatsBtnContainer />
    <TopLists />
    <NewsCardContainer />
  </div>
</template>

<script setup>
  import TopLists from '@/components/bulletin/containers/TopLists.vue'

  import PieChartStatsBtnContainer from '../components/bulletin/containers/PieChartStatsBtnContainer.vue'
  import NewsCardContainer from '../components/bulletin/containers/NewsCardContainer.vue'

  import Quotes from '../components/bulletin/components/Quotes.vue'
  import BulletinChart20 from '../components/bulletin/components/BulletinChart2.0.vue'
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
