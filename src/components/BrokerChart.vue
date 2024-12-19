<script setup>
  import { onMounted, ref, watchEffect } from 'vue'
  import * as echarts from 'echarts'

  // Props
  const props = defineProps({
    chartData: Array,
    selectedChart: String,
  })

  const chartRef = ref(null)
  let myChart = null

  onMounted(() => {
    myChart = echarts.init(chartRef.value)
    createChart()
  })

  watchEffect(() => {
    createChart()
  })

  function createChart() {
    console.log(props.selectedChart, 'ss')
    if (!myChart) return
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: function (params) {
          let result = `${params[0].axisValue}<br/>`
          params.forEach((item) => {
            // Correctly displaying the amount and count in the tooltip
            result += `${item.marker}${item.seriesName}: ${item.data.value.toLocaleString()} <br> Transaction Count: ${item.data.count.toLocaleString()}<br/>`
          })
          return result
        },
      },
      grid: {
        left: '2%', // Provide enough space for the axis labels
        right: '0%', // Adjust right margin to fit
        bottom: '3%', // Adjust bottom margin
        top: '2%', // Adjust top margin to avoid cutting off the top labels
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: props.chartData.map((item) => item.year), // Using 'year' as categories
        axisLabel: {
          show: true,
          textStyle: {
            color: 'black',
            fontSize: 12,
          },
        },
        splitLine: {
          show: false, // Typically, no need to show split lines on category axis
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          show: false, // You can hide these if the tooltips provide enough info
          textStyle: {
            color: 'black',
            fontSize: 12,
          },
        },
        splitLine: {
          show: false, // Show split lines for value reference
        },
      },
      series: [
        {
          name: 'Transaction Amount',
          data: props.chartData.map((item) => ({
            value: item.transactions_amount,
            count: item.transactions_count, // Assuming this additional data point
          })),
          type: 'bar',
          barWidth: '35%', // Adjust as needed
          itemStyle: {
            // Corrected color code
          },
          label: {
            show: true,
            position: 'insideBottom',
            color: '#fff',
            rotate: 90,
            verticalAlign: 'middle',
            align: 'left',
            formatter: function (params) {
              return params.value.toLocaleString() // Use toLocaleString here
            },
            fontSize: 11, // Smaller font size to fit more text
            fontWeight: 'bold',
          },
          showBackground: true,

          backgroundStyle: {
            color: '#dcdee8',
          },
        },
      ],
    }
    myChart.setOption(option, true)
  }

  // function createChart() {
  //   if (!myChart) return
  //   const option = {
  //     tooltip: {
  //       trigger: 'axis',
  //       axisPointer: {
  //         type: 'shadow', // Ensures a shadow appears under the cursor for better visual tracking
  //       },
  //       formatter: function (params) {
  //         let result = `${params[0].axisValue}<br/>` // Shows the year
  //         params.forEach((item) => {
  //           result += `${item.marker}${item.seriesName}: ${item.value.toLocaleString()}<br/>` // Formats the tooltip with commas
  //         })
  //         return result
  //       },
  //     },
  //     grid: {
  //       left: '1%', // Adjust left margin
  //       right: '0%', // Adjust right margin
  //       bottom: '0%',
  //       top: '3%', // Adjust bottom margin
  //       containLabel: true, // Ensures that labels are contained within the grid
  //     },
  //     xAxis: {
  //       type: 'category',
  //       data: props.chartData.map((item) => item.year),
  //       axisLabel: {
  //         interval: 0,
  //         textStyle: {
  //           color: 'black',
  //           fontSize: 12,
  //         },
  //       },
  //     },
  //
  //     yAxis: {
  //       type: 'value',
  //       axisLabel: {
  //         show: false,
  //         textStyle: {
  //           color: 'black',
  //           fontSize: 12,
  //         },
  //       },
  //       splitLine: {
  //         show: true, // Hide background grid lines for X-axis
  //       },
  //     },
  //     series: [
  //       {
  //         name: 'Transaction Amount', // Giving a name to the series for better tooltip information
  //         data: props.chartData.map((item) => item.transactions_amount),
  //         type: 'bar',
  //         barWidth: '25%', // Adjusted bar width for better visibility
  //         showBackground: true,
  //         backgroundStyle: {
  //           color: 'rgba(220, 220, 220, 0.8)',
  //         },
  //       },
  //     ],
  //   }
  //   myChart.setOption(option, true)
  // }
</script>

<template>
  <div ref="chartRef" style="width: 300px; height: 200px"></div>
</template>

<style scoped>
  /* You can add styles for your chart container here */
</style>

<!--<template>-->
<!--  <div ref="chartContainer" style="width: 600px; height: 400px"></div>-->
<!--</template>-->

<!--<script setup>-->
<!--  import { ref, onMounted, watch } from 'vue'-->
<!--  import * as echarts from 'echarts'-->
<!--  import axios from 'axios'-->
<!--  import moment from 'moment/moment'-->
<!--  import { ElNotification } from 'element-plus'-->
<!--  import http from '@/http'-->
<!--  const url = import.meta.env.VITE_APP_SERVER_URL-->

<!--  // Prop to receive the query info-->
<!--  const props = defineProps({-->
<!--    query: {-->
<!--      type: Object,-->
<!--      required: true,-->
<!--    },-->
<!--  })-->

<!--  const chartContainer = ref(null)-->
<!--  const chartInstance = ref(null)-->

<!--  // Function to fetch data based on the query-->
<!--  const fetchData = async (query) => {-->
<!--    // This should be replaced with your actual data fetching logic-->
<!--    // For example, using fetch API to get data from a server-->
<!--    try {-->
<!--      const response = await fetch(query.url)-->
<!--      const data = await response.json()-->
<!--      return data-->
<!--    } catch (error) {-->
<!--      console.error('Failed to fetch data:', error)-->
<!--      return []-->
<!--    }-->
<!--  }-->

<!--  const fetchDatas = () => {-->
<!--    loading.value = true-->
<!--    http-->
<!--      .get(`${url.value}/brokers/list/?page=1`, {-->
<!--        params: {-->
<!--          search: factSearchInput.value,-->
<!--          page: currentPage.value,-->
<!--        },-->
<!--      })-->
<!--      .then((response) => {-->
<!--        return response.data-->
<!--      })-->
<!--      .catch(({ response }) => {-->
<!--        ElNotification({-->
<!--          type: 'error',-->
<!--          message: response.data.message || 'Malumot olishda xatolik bor!',-->
<!--        })-->
<!--      })-->
<!--      .finally(() => {-->
<!--        loading.value = false-->
<!--      })-->
<!--  }-->

<!--  // Function to initialize the chart-->
<!--  const initChart = () => {-->
<!--    if (chartContainer.value) {-->
<!--      chartInstance.value = echarts.init(chartContainer.value)-->
<!--      chartInstance.value.setOption({-->
<!--        // Configure your chart option here-->
<!--        xAxis: {-->
<!--          type: 'category',-->
<!--          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],-->
<!--        },-->
<!--        yAxis: {-->
<!--          type: 'value',-->
<!--        },-->
<!--        series: [-->
<!--          {-->
<!--            data: [120, 200, 150, 80, 70, 110, 130],-->
<!--            type: 'bar',-->
<!--          },-->
<!--        ],-->
<!--      })-->
<!--    }-->
<!--  }-->

<!--  // Reactivity to props and chart updates-->
<!--  onMounted(async () => {-->
<!--    const data = await fetchData(props.query)-->
<!--    // Assume data is directly applicable or map it accordingly to the chart's needs-->
<!--    initChart()-->
<!--  })-->

<!--  // Watch for changes in the query and update the chart-->
<!--  watch(-->
<!--    () => props.query,-->
<!--    async (newQuery) => {-->
<!--      const data = await fetchData(newQuery)-->
<!--      // Update your chart's data here-->
<!--      chartInstance.value.setOption({-->
<!--        series: [-->
<!--          {-->
<!--            data: data, // assuming data is formatted correctly-->
<!--          },-->
<!--        ],-->
<!--      })-->
<!--    },-->
<!--    { deep: true },-->
<!--  )-->
<!--</script>-->
