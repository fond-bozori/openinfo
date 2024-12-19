<template>
  <BulletinTitle :customTitle="$t('message.range')" />
  <div class="table-container">
    <EmitentTable
      :title="$t('message.top_5_issuers_by_transactions')"
      :items="topIssuersByTransaction"
      :loading="loading"
      :buttonText="$t('message.full_list')"
      routePath="/bulletin-more"
      buttonKey="number"
      @viewFullList="handleViewFullList"
    />
    <EmitentTable
      :title="$t('message.top_5_issuers_by_volume')"
      :items="formattedTopIssuersByVolume"
      :loading="loading"
      :buttonText="$t('message.full_list')"
      routePath="/bulletin-more"
      buttonKey="volume"
      @viewFullList="handleViewFullList"
    />

    <EmitentTableWithEyeIcon
      :title="$t('message.top_viewed_dividends_data')"
      :items="defaultTopWatchedFacts"
      :loading="loading"
    />
  </div>
</template>

<script setup>
  import { ref, onMounted, computed } from 'vue'
  import EmitentTable from '../components/EmitentTable.vue'
  import EmitentTableWithEyeIcon from '../components/EmitentTableWithEyeIcon.vue'
  import http from '../../../http/index.js'
  import { useRouter } from 'vue-router'
  import BulletinTitle from '../components/BulletinTitle.vue'

  const baseLogoUrl = 'https://openinfo.uz/media/'
  const router = useRouter()

  const loading = ref(false)
  const topIssuersByTransaction = ref([])
  const topIssuersByVolume = ref([])
  const defaultTopWatchedFacts = ref([])

  const formatDate = (date) => {
    const d = new Date(date)
    let month = '' + (d.getMonth() + 1)
    let day = '' + d.getDate()
    const year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return [year, month, day].join('-')
  }

  const today = new Date()
  const endDate = formatDate(today)
  const startDate = formatDate(new Date(today.setDate(today.getDate() - 30)))

  const fetchTradeAnalytics = async () => {
    try {
      loading.value = true
      const response = await http.get(`iuzse/trade-analytics/?date=${endDate}`)
      topIssuersByTransaction.value =
        response.data.top_issuers_by_transaction.slice(0, 5)
      topIssuersByVolume.value = response.data.top_issuers_by_volume.slice(0, 5)
      console.log('Fetched Trade Analytics:', response.data)
    } catch (error) {
      console.error('Error fetching trade analytics:', error)
    } finally {
      loading.value = false
    }
  }

  const fetchWatchedFacts = async () => {
    try {
      loading.value = true
      const response = await http.get(
        `disclosure/top-fact32/?start_date=${startDate}&end_date=${endDate}`,
      )
      defaultTopWatchedFacts.value = response.data.top_watched_fact32s
        .slice(0, 5)
        .map((item) => ({
          ...item,
          logo: item.logo ? `${baseLogoUrl}${item.logo}` : '',
        }))
      console.log('Fetched Watched Facts:', response.data)
    } catch (error) {
      console.error('Error fetching watched facts:', error)
    } finally {
      loading.value = false
    }
  }

  const formattedTopIssuersByVolume = computed(() => {
    return topIssuersByVolume.value.map((item) => ({
      ...item,
      total_volume: parseInt(item.total_volume, 10),
    }))
  })

  const handleViewFullList = (key) => {
    router.push({ path: '/bulletin-more', query: { key } })
  }

  onMounted(() => {
    fetchTradeAnalytics()
    fetchWatchedFacts()
  })
</script>

<style scoped>
  .table-container {
    display: flex;
    gap: 20px;
    justify-content: center;
    padding: 15px;
  }

  .table-container > * {
    flex: 1;
  }
</style>
