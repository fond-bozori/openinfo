<template>
  <div
    style="
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 50px;
      padding-left: 10px;
      padding-right: 10px;
    "
  >
    <BulletinTitle :customTitle="$t('message.news')" />
    <NewsCard
      v-for="item in factData"
      :key="item.id"
      :item="item"
      :date="item.pub_date"
      :headline="item.organization_name"
      :description="item.fact_title"
      :buttonText="$t('message.read_more')"
      :url="`${baseLogoUrl}${item.logo}`"
    />
  </div>
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import NewsCard from '../components/NewsCard.vue'
  import BulletinTitle from '../components/BulletinTitle.vue'
  import http from '../../../http/index.js'

  const baseLogoUrl = 'https://openinfo.uz/media/'

  const loading = ref(false)
  const factData = ref([])

  const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const getTopWatchedFacts = async (startDate, endDate) => {
    try {
      loading.value = true
      const response = await http.get(
        `disclosure/fact-statistics/?start_date=${startDate}&end_date=${endDate}`,
      )
      factData.value = response.data.top_watched_facts
    } catch (err) {
      console.log(err)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 30)

    const startDate = formatDate(yesterday)
    const endDate = formatDate(today)

    getTopWatchedFacts(startDate, endDate)
  })
</script>

<style scoped></style>
