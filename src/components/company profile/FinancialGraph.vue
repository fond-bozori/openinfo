<template>
  <div class="graph-title">
    {{ $t('message.financial_schedule') }}
    ({{ $t('message.ths sum') }})
  </div>

  <div ref="chartContainer" class="chart-container">
    <div ref="chart" style="width: 80%; height: 400px"></div>
    <FinancialGraph2 />
  </div>
</template>

<script setup>
  import { computed, onMounted, onUnmounted, ref } from 'vue'
  import axios from 'axios'
  import { ElNotification } from 'element-plus'
  import { useRoute } from 'vue-router'
  import FinancialGraph2 from '@/components/company profile/FinancialGraph2.vue'
  import { useI18n } from 'vue-i18n'
  import { watch } from 'vue'
  const { t } = useI18n()
  const { locale } = useI18n()

  const url = import.meta.env.VITE_APP_SERVER_URL
  const id = computed(() => route.params.id)
  const route = useRoute()
  const FinancialData = ref(null)

  const chart = ref(null) // Reference to the chart DOM element
  const option = ref({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999',
        },
      },
    },
    toolbox: {
      feature: {
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true },
      },
      left: 'center',
      top: 'bottom',
    },
    legend: {
      show: true,
      left: 'center',
      top: 'top',
    },
    xAxis: [
      {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisPointer: {
          type: 'shadow',
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: '',
        axisLabel: {
          formatter: ' ',
        },
      },
      {
        type: 'value',
        name: '',

        interval: 5,
        axisLabel: {
          formatter: '',
        },
      },
    ],
    series: [
      {
        name: 'Чистая прибыль',
        type: 'bar',
        tooltip: {
          valueFormatter: function (value) {
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' '
          },
        },
        data: [
          2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3,
        ],
      },
      {
        name: 'Чистая выручка',
        type: 'bar',
        tooltip: {
          valueFormatter: function (value) {
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' '
          },
        },
      },
    ],
  })

  const NetProfit = ref([])
  const NetRevenue = ref([])
  const Dates = ref([])

  const getKeyFinIndicator = async () => {
    try {
      const response = await axios.get(
        `${url}/reports/financial_indicators/?organization_id=${id.value}`,
      )
      const financialData = response.data.results
      for (let i = 0; i < financialData.length; i++) {
        NetProfit.value.push(financialData[i]?.net_profit)
        NetRevenue.value.push(financialData[i]?.net_revenue)
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
      net_profit: [...NetProfit.value],
      net_revenue: [...NetRevenue.value],
      dates: [...Dates.value],
    }
  }

  const fetchAndSetData = async () => {
    const fetchedData = await fetchDataFromBackend() // Fetch data from the backend
    option.value.xAxis[0].data = fetchedData.dates // Update xAxis data with fetched categories
    option.value.series[0].data = fetchedData.net_profit // Update series data with fetched evaporation data
    option.value.series[1].data = fetchedData.net_revenue // Update series data with fetched evaporation data

    renderChart() // Re-render the chart with updated options
  }

  // Function to update series names
  const updateSeriesNames = () => {
    option.value.series[0].name = t('message.netProfit')
    option.value.series[1].name = t('message.netRevenue') // Make sure this key exists in your i18n messages
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
  .chart-container {
    padding-top: 20px;
    width: 100%;
    /*height: 500px;*/
    max-width: 100%;
    display: flex;
  }

  .graph-title {
    width: 100%;
    padding: 12px;
    text-align: center;
    background: #094580;
    border-radius: 8px;
    font-size: 18px;
  }

  .chart-wrapper {
    padding-top: 12px;
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
