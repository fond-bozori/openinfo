<template>
  <!--<div class="graph-title">-->
  <!--  График с финансовыми показателями-->
  <!--</div>-->

  <div ref="chartContainer" class="chart2-container">
    <div ref="chart" style="width: 100%; height: 400px"></div>
  </div>
</template>

<script setup>
  import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import axios from 'axios'
  import { ElNotification } from 'element-plus'
  import { useRoute } from 'vue-router'
  const url = import.meta.env.VITE_APP_SERVER_URL
  const id = computed(() => route.params.id)
  const route = useRoute()
  const FinancialData = ref(null)
  const chart = ref(null) // Reference to the chart DOM element

  const { t } = useI18n()
  const { locale } = useI18n()

  const option = ref({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {},
    toolbox: {
      show: false,
      feature: {
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true },
      },
      left: 'right',
      top: 'top',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01],
    },
    yAxis: {
      type: 'category',
      data: ['Brazil', 'Indonesia', 'USA', 'India', 'China', 'World'],
    },
    series: [
      {
        name: 'Активы',
        type: 'bar',
        data: [18203, 23489, 29034, 104970, 131744, 630230],
      },
      {
        name: 'Обязательства',
        type: 'bar',
        data: [19325, 23438, 31000, 121594, 134141, 681807],
      },
    ],
  })

  const Total_Assets = ref([])
  const Total_Liablities = ref([])
  const Dates = ref([])

  const getKeyFinIndicator = async () => {
    try {
      const response = await axios.get(
        `${url}/reports/financial_indicators/?organization_id=${id.value}`,
      )
      const financialData = response.data.results
      for (let i = 0; i < financialData.length; i++) {
        Total_Assets.value.push(financialData[i]?.total_assets)
        Total_Liablities.value.push(financialData[i]?.total_liabilites)
        Dates.value.push(financialData[i]?.reporting_year)
      }
    } catch (error) {
      ElNotification({
        type: 'error',
        message: error.response.data.message || 'Malumot olishda xatolik bor!',
      })
    }
  }

  const fetchDataFromBackend = async () => {
    await getKeyFinIndicator() // Wait for data to be fetched
    return {
      total_assets: [...Total_Assets.value],
      total_liabilites: [...Total_Liablities.value],
      dates: [...Dates.value],
    }
  }

  const fetchAndSetData = async () => {
    const fetchedData = await fetchDataFromBackend() // Fetch data from the backend
    option.value.yAxis.data = fetchedData.dates // Update xAxis data with fetched categories
    option.value.series[0].data = fetchedData.total_assets // Update series data with fetched evaporation data
    option.value.series[1].data = fetchedData.total_liabilites // Update series data with fetched evaporation data
    renderChart() // Re-render the chart with updated options
  }

  // Function to update series names
  const updateSeriesNames = () => {
    option.value.series[0].name = t('message.assets')
    option.value.series[1].name = t('message.liabilities') // Make sure this key exists in your i18n messages
  }

  const renderChart = () => {
    if (chart.value) {
      const myChart = echarts.init(chart.value)
      myChart.setOption(option.value)
    } else {
      console.log('No chart element found:', chart.value)
    }
  }

  // Watch for locale changes
  watch(locale, () => {
    updateSeriesNames()
    renderChart() // Re-render the chart to reflect the name changes
  })

  onMounted(() => {
    fetchAndSetData()
  })

  onUnmounted(() => {
    // Clean up event listeners when the component is unmounted
    window.removeEventListener('resize', () => {})
  })
</script>

<style scoped>
  .chart2-container {
    width: 100%;
    max-width: 100%;
    padding: 0 !important;
    /*margin-bottom: 80px;*/
  }

  @media (max-width: 768px) {
    .chart-container {
      width: 50%; /* Adjust the width for smaller screens */
    }
  }

  /* Media query for even smaller screens (e.g., mobile devices) */
  @media (max-width: 576px) {
    .chart-container {
      width: 70%; /* Further adjust the width for smaller screens */
    }
  }
</style>
