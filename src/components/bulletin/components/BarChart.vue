<template>
  <div class="line-chart-container">
    <div class="line-chart-header">
      <BulletinTitle
        :customTitle="$t('message.uci_index')"
        style="margin-bottom: 0"
      />
      <el-button-group class="button-group">
        <el-button
          class="button"
          :class="{ active: activeButton === '1d' }"
          @click="handleButtonClick('1d')"
        >
          {{ $t('message.one_day') }}
        </el-button>
        <el-button
          class="button"
          :class="{ active: activeButton === '1m' }"
          @click="handleButtonClick('1m')"
        >
          {{ $t('message.one_month') }}
        </el-button>
        <el-button
          class="button"
          :class="{ active: activeButton === '1y' }"
          @click="handleButtonClick('1y')"
        >
          {{ $t('message.one_year') }}
        </el-button>
      </el-button-group>
    </div>
    <div :id="chartId" ref="chart" class="chart"></div>
  </div>
</template>

<script lang="ts">
  import * as echarts from 'echarts'
  import { defineComponent, onMounted, ref, onBeforeUnmount } from 'vue'
  import { ElButton, ElButtonGroup } from 'element-plus'
  import BulletinTitle from '../components/BulletinTitle.vue'
  import http from '../../../http/index.js'

  const getUCIIndex = async (duration: string) => {
    try {
      const response = await http.get(
        `iuzse/price-indices/?idx_ind_cd=001&duration=${duration}`,
      )
      return response.data
    } catch (err) {
      console.error(err)
      return { indices: [] }
    }
  }

  export default defineComponent({
    name: 'LineChart',
    components: {
      ElButton,
      ElButtonGroup,
      BulletinTitle,
    },
    setup() {
      const chartId = `chart-${Math.random().toString(36).substr(2, 9)}`
      const chart = ref<HTMLDivElement | null>(null)
      let myChart: echarts.ECharts | null = null
      const activeButton = ref<string>('1y')

      const formatDate = (dateStr: string, period: string) => {
        const date = new Date(dateStr)
        if (period === '1d') {
          return date.getHours().toString().padStart(2, '0') + ':00'
        } else if (period === '1m') {
          return (
            date.getDate().toString().padStart(2, '0') +
            '-' +
            (date.getMonth() + 1).toString().padStart(2, '0')
          )
        } else if (period === '1y') {
          return (
            (date.getMonth() + 1).toString().padStart(2, '0') +
            '-' +
            date.getFullYear()
          )
        }
        return date.toLocaleDateString()
      }

      const updateChart = (
        data: { calc_tm: string; idx: number }[],
        duration: string,
      ) => {
        const xAxisData = data.map((item) => formatDate(item.calc_tm, duration))
        const yAxisData = data.map((item) => item.idx)

        // Determine the minimum value for yAxis
        const minValue = Math.min(...yAxisData)
        const yAxisMin = Math.min(600, minValue - 10)

        if (chart.value) {
          if (myChart) {
            myChart.dispose()
          }
          myChart = echarts.init(chart.value)
          const option = {
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: xAxisData,
            },
            yAxis: {
              type: 'value',
              min: yAxisMin,
              interval: 300,
            },
            series: [
              {
                data: yAxisData,
                type: 'line',
                areaStyle: {
                  color: '#ebf4ff',
                },
              },
            ],
            tooltip: {
              trigger: 'axis',
              formatter: (params: any) =>
                `${params[0].name}<br/>Value: ${params[0].value}`,
            },
            grid: {
              left: 20,
              right: 20,
              top: 20,
              bottom: 40,
              containLabel: true,
            },
          }
          myChart.setOption(option)
        }
      }

      const handleButtonClick = async (period: string) => {
        activeButton.value = period
        const data = await getUCIIndex(period)
        updateChart(data.indices, period)
      }

      onMounted(() => {
        handleButtonClick('1m')
      })

      onBeforeUnmount(() => {
        if (myChart) {
          myChart.dispose()
        }
      })

      return {
        chart,
        chartId,
        handleButtonClick,
        activeButton,
      }
    },
  })
</script>

<style scoped>
  .line-chart-container {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .line-chart-header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    gap: 20px;
    justify-content: flex-start;
    background: transparent;
  }

  .button-group {
    display: flex;
    gap: 5px;
  }

  .button {
    width: 80px;
    background-color: #124483;
    color: white;
    border-radius: 4px;
  }

  .button.active {
    background-color: #409eff;
    border-color: #409eff;
  }

  .chart {
    height: 400px;
    width: 100%;
    padding: 20px;
    margin: 0;
  }
</style>
