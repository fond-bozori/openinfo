<template>
  <EmitentTable
    :title="$t('message.issuers_by_volume')"
    :items="formattedTopIssuersByVolume"
    :loading="loading"
  />
</template>

<script setup>
  import { ref, onMounted, computed } from 'vue'
  import EmitentTable from '../components/EmitentTable.vue'
  import http from '../../../http/index.js'

  const baseLogoUrl = 'https://openinfo.uz/media/'

  const loading = ref(false)
  const topIssuersByTransaction = ref([])
  const topIssuersByVolume = ref([])

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
      topIssuersByTransaction.value = response.data.top_issuers_by_transaction
      topIssuersByVolume.value = response.data.top_issuers_by_volume
      console.log('Fetched Trade Analytics:', response.data)
    } catch (error) {
      console.error('Error fetching trade analytics:', error)
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

  onMounted(() => {
    fetchTradeAnalytics()
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
