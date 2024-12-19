<template>
  <div style="position: relative" class="card-box">
    <div class="info-box">
      <img :src="computedLogo" alt="Organization Logo" class="logo" />

      <div>
        {{ $t('message.Organization') }}: {{ name }} | {{ $t('message.open') }}:
        {{
          latestData.open?.toLocaleString('ru-RU', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        }}
        | {{ $t('message.high') }}:
        {{
          latestData.high?.toLocaleString('ru-RU', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        }}
        | {{ $t('message.low') }}:
        {{
          latestData.low?.toLocaleString('ru-RU', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        }}
        | {{ $t('message.close') }}:
        {{
          latestData.close?.toLocaleString('ru-RU', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        }}
      </div>
    </div>
    <div ref="chart" style="width: 100%; height: 600px"></div>
    <div class="control-container">
      <div class="range-picker">
        <div class="range">
          <div
            v-for="option in timeOptions"
            :key="option.value"
            @mouseover="hoverOption(option.value)"
            @mouseleave="resetHover"
            :class="{
              active:
                hoveredOption === option.value || activeRange === option.value,
            }"
            @click="fetchCandlestickData(option.value, isuCd)"
          >
            {{ option.label }}
          </div>
          <span v-if="hoveredOption" class="picker-text">{{
            hoveredOptionText
          }}</span>
        </div>
      </div>
      <div class="current-time">{{ currentTime }}</div>
    </div>
  </div>
</template>

<script>
  import * as echarts from 'echarts'
  import http from '../../../http/index.js'
  import { watch } from 'vue'
  import defaultLogo from '@/assets/images/icons/company-blue.svg'

  export default {
    name: 'EChartCandlestick',
    props: {
      isuCd: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        chart: null,
        latestData: {
          open: null,
          high: null,
          low: null,
          close: null,
          volume: null,
        },
        name: '',
        logo: '',
        ticker: '',
        hoveredOption: null,
        hoveredOptionText: '',
        timeOptions: [],
        currentTime: this.getCurrentTime(),
        activeRange: '1m',
        clockInterval: null,
      }
    },

    computed: {
      computedLogo() {
        return this.logo || defaultLogo
      },
    },

    created() {
      this.setTimeOptions()
    },

    mounted() {
      this.initChart()
      this.startClock()
      this.fetchCandlestickData(this.activeRange, this.isuCd)
    },

    beforeDestroy() {
      if (this.chart) {
        this.chart.dispose()
      }
      clearInterval(this.clockInterval)
    },

    watch: {
      '$i18n.locale': {
        immediate: true,
        handler() {
          this.setTimeOptions()
        },
      },
      isuCd: {
        immediate: true,
        handler(newVal) {
          this.fetchCandlestickData(this.activeRange, newVal)
        },
      },
    },

    methods: {
      setTimeOptions() {
        this.timeOptions = [
          {
            value: '1d',
            label: this.$t('message.label.1d'),
            fullLabel: this.$t('message.fullLabel.1Day'),
          },
          {
            value: '5d',
            label: this.$t('message.label.5d'),
            fullLabel: this.$t('message.fullLabel.5Days'),
          },
          {
            value: '1m',
            label: this.$t('message.label.1m'),
            fullLabel: this.$t('message.fullLabel.1Month'),
          },
          {
            value: '3m',
            label: this.$t('message.label.3m'),
            fullLabel: this.$t('message.fullLabel.3Months'),
          },
          {
            value: '6m',
            label: this.$t('message.label.6m'),
            fullLabel: this.$t('message.fullLabel.6Months'),
          },
          {
            value: 'ytd',
            label: this.$t('message.label.ytd'),
            fullLabel: this.$t('message.fullLabel.yearToDate'),
          },
          {
            value: '1y',
            label: this.$t('message.label.1y'),
            fullLabel: this.$t('message.fullLabel.1Year'),
          },
          {
            value: '5y',
            label: this.$t('message.label.5y'),
            fullLabel: this.$t('message.fullLabel.5Years'),
          },
        ]
      },

      calculateDates(period) {
        const endDate = new Date()
        let startDate = new Date()
        switch (period) {
          case '1d':
            startDate.setDate(endDate.getDate() - 1)
            break
          case '5d':
            startDate.setDate(endDate.getDate() - 5)
            break
          case '1m':
            startDate.setMonth(endDate.getMonth() - 1)
            break
          case '3m':
            startDate.setMonth(endDate.getMonth() - 3)
            break
          case '6m':
            startDate.setMonth(endDate.getMonth() - 6)
            break
          case 'ytd':
            startDate.setFullYear(endDate.getFullYear(), 0, 1)
            break
          case '1y':
            startDate.setFullYear(endDate.getFullYear() - 1)
            break
          case '5y':
            startDate.setFullYear(endDate.getFullYear() - 5)
            break
          default:
            break
        }
        return {
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
        }
      },

      async fetchCandlestickData(period, isu_cd) {
        if (!isu_cd) {
          console.warn('isuCd is not available')
          return
        }
        try {
          const { start_date, end_date } = this.calculateDates(period)
          const response = await http.get('iuzse/conclusions/', {
            params: { isu_cd, start_date, end_date },
          })
          const { name, logo, results, ticker = [] } = response.data
          this.name = name
          this.logo = logo
          this.ticker = ticker

          if (results.length) {
            const latest = results[results.length - 1]
            this.latestData = {
              open: latest.open,
              high: latest.high,
              low: latest.low,
              close: latest.close,
              volume: latest.trading_volume,
            }
          }

          this.updateChart(results.reverse())
          this.activeRange = period
        } catch (error) {
          console.error('Error fetching data:', error)
        }
      },

      updateChart(data) {
        if (!data.length) return

        const chartData = data.map((item) => [
          item.date,
          item.open,
          item.close,
          item.low,
          item.high,
        ])

        const volumeData = data.map((item) => ({
          value: item.trading_volume,
          itemStyle: {
            color:
              item.close >= item.open ? 'rgba(0, 218, 60)' : 'rgba(236, 0, 0)',
          },
        }))

        // Function to format dates based on the active range
        const formatDate = (date, period) => {
          const d = new Date(date)
          switch (period) {
            case '1d':
            case '5d':
            case '1m':
              return `${d.getMonth() + 1}/${d.getDate()}` // Daily format: MM/DD
            case '3m':
              return `${this.$t('message.week')} ${Math.ceil(d.getDate() / 7)}, ${d.getMonth() + 1}` // Weekly format for 3m
            case '6m':
            case 'ytd':
            case '1y':
              return `${d.getMonth() + 1}/${d.getFullYear()}` // Monthly format for 6m, ytd, 1y
            case '5y':
              return `${d.getFullYear()}` // Only the year for 5y
            default:
              return ''
          }
        }

        // Format dates according to the active range
        const formattedDates = chartData.map((item) =>
          formatDate(item[0], this.activeRange),
        )

        // Determine the appropriate interval for the x-axis based on the active range
        let axisLabelInterval = 0 // Default to 0 (show all labels)
        switch (this.activeRange) {
          case '1d':
          case '5d':
          case '1m':
            axisLabelInterval = 0 // Show labels for every data point
            break
          case '3m':
            axisLabelInterval = 5 // Show labels for every 5th data point (roughly weekly)
            break
          case '6m':
          case 'ytd':
          case '1y':
            axisLabelInterval = 10 // Show labels for every 10th data point (roughly monthly)
            break
          case '5y':
            axisLabelInterval = 150
            break
          default:
            axisLabelInterval = 0
        }

        const option = {
          grid: [
            { left: '5%', right: '5%', height: '50%' },
            { left: '5%', right: '5%', top: '63%', height: '16%' },
          ],
          tooltip: {
            trigger: 'item',
            formatter: (params) => {
              const dataIndex = params.dataIndex
              const item = data[dataIndex]
              return `
      <div>
        <strong>${this.$t('message.tooltip.stock_ticker')}:</strong> ${this.ticker}<br/>
        <strong>${this.$t('message.tooltip.date')}:</strong> ${item.date}<br/>
        <strong>${this.$t('message.tooltip.volume')}:</strong> ${item.trading_volume.toLocaleString('ru-RU')}<br/>
        <strong>${this.$t('message.tooltip.open')}:</strong> ${item.open.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}<br/>
        <strong>${this.$t('message.tooltip.high')}:</strong> ${item.high.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}<br/>
        <strong>${this.$t('message.tooltip.low')}:</strong> ${item.low.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}<br/>
        <strong>${this.$t('message.tooltip.close')}:</strong> ${item.close.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
    `
            },
            axisPointer: { type: 'cross', crossStyle: { color: '#999' } },
          },

          xAxis: [
            {
              type: 'category',
              data: formattedDates,
              boundaryGap: false,
              axisLabel: {
                interval: axisLabelInterval, // Set the interval based on the active range
                rotate: 75,
                color: '#555',
              },
              axisLine: { lineStyle: { color: '#ccc' } },
              splitLine: {
                show: true,
                lineStyle: { color: ['#eee'], type: 'dashed' },
              },
            },
            {
              type: 'category',
              gridIndex: 1,
              data: formattedDates,
              axisLabel: { show: false },
              axisLine: { show: false },
            },
          ],
          yAxis: [
            {
              type: 'value',
              position: 'right',
              axisLine: { lineStyle: { color: '#ccc' } },
              splitLine: { lineStyle: { color: ['#eee'], type: 'dashed' } },
            },
            {
              type: 'value',
              gridIndex: 1,
              position: 'left',
              scale: true,
              splitNumber: 2,
              axisLabel: { show: false },
            },
          ],
          series: [
            {
              name: 'Price',
              type: 'candlestick',
              data: chartData.map((item) => [
                item[1],
                item[2],
                item[3],
                item[4],
              ]),
              itemStyle: {
                color: '#00da3c',
                color0: '#ec0000',
                borderColor: '#00da3c',
                borderColor0: '#ec0000',
              },
              barWidth: '30%',
            },
            {
              name: 'Volume',
              type: 'bar',
              xAxisIndex: 1,
              yAxisIndex: 1,
              data: volumeData,
              barWidth: '60%',
              itemStyle: {
                color: (params) =>
                  params.data.close >= params.data.open
                    ? 'rgba(0, 218, 60)'
                    : 'rgba(236, 0, 0)',
              },
              barWidth: '40%',
            },
          ],
        }

        // Set the chart options
        this.chart.setOption(option)
      },
      initChart() {
        this.chart = echarts.init(this.$refs.chart)
      },

      hoverOption(option) {
        this.hoveredOption = option
        const selectedOption = this.timeOptions.find(
          (opt) => opt.value === option,
        )
        if (selectedOption) {
          this.hoveredOptionText = selectedOption.fullLabel
        }
      },

      resetHover() {
        this.hoveredOption = null
        this.hoveredOptionText = ''
      },

      getCurrentTime() {
        const now = new Date()
        return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
      },

      startClock() {
        this.clockInterval = setInterval(() => {
          this.currentTime = this.getCurrentTime()
        }, 1000)
      },
    },
  }
</script>

<style scoped>
  .card-box {
    width: 100%;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    background-color: #fff;
    padding: 20px;
    transition:
      box-shadow 0.3s ease,
      transform 0.3s ease;
  }

  .card-box:hover {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
    transform: translateY(-5px);
  }

  .info-box {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: bold;
    padding: 10px;
    background-color: #f9f9f9;
    border-bottom: 1px solid #ccc;
    color: #1582c7;
    border-radius: 10px 10px 0 0;
  }
  .logo {
    height: 40px;
    margin-right: 10px;
  }
  .control-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    background-color: #f9f9f9;
    color: #1582c7;
    font-weight: bold;
    border-radius: 0 0 10px 10px;
  }
  .range-picker .range {
    display: flex;
    gap: 15px;
  }
  .range-picker .range div {
    cursor: pointer;
    padding: 5px 10px;
    border-radius: 5px;
    transition: background-color 0.3s;
  }
  .range-picker .range div.active,
  .range-picker .range div:hover {
    background-color: #ddd;
  }
  .current-time {
    font-weight: bold;
  }
</style>
