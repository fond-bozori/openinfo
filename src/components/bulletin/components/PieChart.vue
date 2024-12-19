<template>
  <div :id="chartId" class="chart-container"></div>
</template>

<script>
  import * as echarts from 'echarts/core'
  import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
  } from 'echarts/components'
  import { PieChart as EchartsPieChart } from 'echarts/charts'
  import { LabelLayout } from 'echarts/features'
  import { CanvasRenderer } from 'echarts/renderers'
  import { onMounted, ref, onUnmounted, watch } from 'vue'
  import http from '../../../http/index.js'
  import { useI18n } from 'vue-i18n'

  echarts.use([
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    EchartsPieChart,
    CanvasRenderer,
    LabelLayout,
  ])

  export default {
    name: 'PieChart',
    props: {
      startDate: {
        type: String,
        required: true,
      },
      endDate: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const { t, locale } = useI18n() // Correctly use useI18n within setup
      const chartId = `chart-${Math.random().toString(36).substr(2, 9)}`
      const segmentsData = ref([])
      const loading = ref(false)

      const formatValue = (value) => {
        return parseFloat(value).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      }

      const fetchData = async () => {
        try {
          loading.value = true
          const response = await http.get(
            `iuzse/trade-analytics/?start_date=${props.startDate}&end_date=${props.endDate}`,
          )
          segmentsData.value = response.data.transaction_value_by_industry
          initChart()
        } catch (err) {
          console.log(err)
        } finally {
          loading.value = false
        }
      }

      const initChart = () => {
        const chartDom = document.getElementById(chartId)
        if (chartDom) {
          const myChart = echarts.init(chartDom)
          const data = segmentsData.value.map((item) => ({
            name: t(`message.industries.${item.industry}`),
            value: parseFloat(item.value),
          }))
          const option = {
            title: {
              text: t('message.pieChart.title'),
              subtext: t('message.pieChart.subtext'),
              left: 'center',
              textStyle: {
                color: '#124483',
                fontSize: 18,
                fontWeight: 'bold',
              },
              subtextStyle: {
                color: '#124483',
              },
            },
            tooltip: {
              trigger: 'item',
              formatter: (params) => {
                return `${params.name} : ${formatValue(params.value)} (${params.percent.toFixed(2)}%)`
              },
            },
            legend: {
              type: 'scroll',
              orient: 'vertical',
              right: 0,
              top: 20,
              bottom: 20,
              data: data.map((item) => item.name),
              textStyle: {
                fontSize: 14,
              },
              itemHeight: 25,
            },
            series: [
              {
                name: t('message.pieChart.seriesName'),
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                  borderRadius: 10,
                  borderColor: '#fff',
                  borderWidth: 2,
                },
                data: data,
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                  },
                },
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
              },
            ],
          }

          myChart.setOption(option)

          // Resize chart on window resize
          const resizeHandler = () => myChart.resize()
          window.addEventListener('resize', resizeHandler)

          onUnmounted(() => {
            window.removeEventListener('resize', resizeHandler)
            myChart.dispose() // Clean up chart instance
          })
        }
      }

      onMounted(() => {
        fetchData()
      })

      watch(
        () => [props.startDate, props.endDate],
        () => {
          fetchData()
        },
      )

      // Handle locale changes and update the chart
      watch(
        () => locale.value,
        async () => {
          await fetchData()
          initChart()
        },
        { immediate: true }, // Ensure the watcher runs immediately on setup
      )

      return {
        chartId,
        segmentsData,
        loading,
        fetchData,
      }
    },
  }
</script>

<style scoped>
  .chart-container {
    width: 60%;
    height: 50vh;
    margin: 0;
    padding: 0;
  }
</style>
