<template>
  <div class="container">
    <!--    <div class="title mb-3"> {{ $t("message.gen_stat") }} </div>-->

    <div class="yearly-graphic__container" style="margin-top: 0">
      <div class="container-title">{{ $t('message.gen_stat2') }}</div>
      <div id="chart-container" class="main-chart"></div>
    </div>

    <div class="container-title">{{ $t('message.gen_stat3') }}</div>
    <div id="main-chart" class="main-chart"></div>

    <div style="display: none">
      <span id="fact1" v-html="$t('message.top4_essen_facts')"></span>
      <span id="fact2">{{ $t('message.top4_essen_facts1') }}</span>
      <span id="fact3">{{ $t('message.top4_essen_facts2') }}</span>
      <span id="fact4">{{ $t('message.top4_essen_facts3') }}</span>
    </div>

    <Generalstatistics />
  </div>
</template>

<script setup>
  import { onMounted } from 'vue'
  import Generalstatistics from './generalstatistics.vue'

  const getStatistics = () => {
    var dom = document.getElementById('chart-container')
    var myChart = echarts.init(dom, null, {
      renderer: 'canvas',
      useDirtyRect: false,
    })
    var app = {}

    var option

    option = {
      title: {
        text: '',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        left: 'center',
        data: ['АО', 'ООО'],
      },
      toolbox: {
        left: 'center',
        top: 'bottom',
        feature: {
          dataView: { readOnly: false },
          magicType: { type: ['line', 'bar'] },
          restore: {},
          saveAsImage: {},
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['2017', '2018', '2019', '2020', '2021', '2022', '2023'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: 'АО',
          type: 'line',
          stack: 'Total',
          data: [630, 606, 603, 593, 599, 607, 628],
        },
        {
          name: 'ООО',
          type: 'line',
          data: [0, 0, 0, 1, 3, 20, 22],
        },
      ],
    }

    if (option && typeof option === 'object') {
      myChart.setOption(option)
    }

    window.addEventListener('resize', myChart.resize)

    var dom = document.getElementById('main-chart')
    var myChart = echarts.init(dom, null, {
      renderer: 'canvas',
      useDirtyRect: false,
    })
    var app = {}

    var option

    const posList = [
      'left',
      'right',
      'top',
      'bottom',
      'inside',
      'insideTop',
      'insideLeft',
      'insideRight',
      'insideBottom',
      'insideTopLeft',
      'insideTopRight',
      'insideBottomLeft',
      'insideBottomRight',
    ]
    app.configParameters = {
      rotate: {
        min: -90,
        max: 90,
      },
      align: {
        options: {
          left: 'left',
          center: 'center',
          right: 'right',
        },
      },
      verticalAlign: {
        options: {
          top: 'top',
          middle: 'middle',
          bottom: 'bottom',
        },
      },
      position: {
        options: posList.reduce(function (map, pos) {
          map[pos] = pos
          return map
        }, {}),
      },
      distance: {
        min: 0,
        max: 100,
      },
    }
    app.config = {
      rotate: 90,
      align: 'left',
      verticalAlign: 'middle',
      position: 'insideBottom',
      distance: 15,
      onChange: function () {
        const labelOption = {
          rotate: app.config.rotate,
          align: app.config.align,
          verticalAlign: app.config.verticalAlign,
          position: app.config.position,
          distance: app.config.distance,
        }
        myChart.setOption({
          series: [
            {
              label: labelOption,
            },
            {
              label: labelOption,
            },
            {
              label: labelOption,
            },
            {
              label: labelOption,
            },
          ],
        })
      },
    }
    const labelOption = {
      show: true,
      position: app.config.position,
      distance: app.config.distance,
      align: app.config.align,
      verticalAlign: app.config.verticalAlign,
      rotate: app.config.rotate,
      formatter: '{c}',
      fontSize: 14,
      rich: {
        name: {},
      },
    }
    option = {
      grid: {
        top: 120,
      },
      tooltip: {
        trigger: 'axis',
        left: 'left',
        top: 'center',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: [
          document.getElementById('fact1').innerHTML,
          document.getElementById('fact2').innerHTML,
          document.getElementById('fact3').innerHTML,
          document.getElementById('fact4').innerHTML,
        ],
        top: 'top',
        left: 'left',
        orient: 'vertical',
      },
      toolbox: {
        show: true,
        left: 'center',
        top: 'bottom',
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar', 'stack'] },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          data: ['2020', '2021', '2022'],
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series: [
        {
          name: document.getElementById('fact1').innerHTML,
          type: 'bar',
          barGap: 0,
          label: labelOption,
          emphasis: {
            focus: 'series',
          },
          data: [1312, 1292, 1403],
        },
        {
          name: document.getElementById('fact2').innerHTML,
          type: 'bar',
          label: labelOption,
          emphasis: {
            focus: 'series',
          },
          data: [1131, 1140, 1400],
        },
        {
          name: document.getElementById('fact3').innerHTML,
          type: 'bar',
          label: labelOption,
          emphasis: {
            focus: 'series',
          },
          data: [784, 1021, 1521],
        },
        {
          name: document.getElementById('fact4').innerHTML,
          type: 'bar',
          label: labelOption,
          emphasis: {
            focus: 'series',
          },
          data: [687, 661, 746],
        },
      ],
    }

    if (option && typeof option === 'object') {
      myChart.setOption(option)
    }

    window.addEventListener('resize', myChart.resize)
  }

  onMounted(() => {
    getStatistics()
    // gettableDate()
  })
</script>

<style scoped>
  .container {
    max-width: 400px;
    /*height: 100%;*/
    border-radius: 10px;
    padding-bottom: 20px;
    margin-left: 20px;
  }

  .main-chart {
    min-width: 365px;
    min-height: 450px;
    width: 100%;
    margin-top: 10px;
  }

  .title {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #124483;
    color: white;
    border-radius: 10px;
  }

  .container-title {
    border-radius: 10px 10px 0 0 !important;
    height: 50px;
    background: #124483;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .yearly-graphic__container {
    margin-top: 20px;
    /*height: 550px;*/
  }

  table {
    font-size: 14px;
    border-radius: 10px;
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
    border: 1px solid #eee;
  }

  td,
  th {
    border: 1px solid #eee;
    text-align: center;
    padding: 8px;
  }

  th {
    font-size: 18px;
  }

  td:first-child {
    text-align: left;
  }

  .inner-td {
    font-weight: 100;
  }

  tr:nth-child(even) {
    background-color: #f8f8f8;
  }

  .statistic-table {
    font-weight: bold;
    color: rgb(18 68 131);
  }

  .filterByYear {
    border: 1px solid #eee;
    border-bottom: none;
    border-top: none;
    align-items: center;
    gap: 40px;
    display: flex;
    justify-content: space-between;
  }

  /* Style the tab */
  .statistic-table {
    font-weight: bold;
    color: rgb(18 68 131);
  }

  h1 {
    text-align: center;
    margin: 2rem 0;
    font-size: 2.5rem;
  }

  .accordion {
    width: 100%;
    margin-top: 20px;
  }

  .accordion-item {
    background-color: #fff;
    position: relative;
  }

  .accordion-item-header {
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    /* identical to box height */
    background: #124483;
    border-radius: 10px 10px 0px 0px;
    color: #fff;
    font-weight: bold;
    display: flex;
    align-items: center;
    position: relative;
    cursor: pointer;
    user-select: none;
    padding: 15px 10px 15px 10px;
    justify-content: space-between;
  }

  /* .accordion-item-header::after {
  content: "🠯";
  font-size: 16px;
  position: absolute;
  right: 20px;
  top: 18px;
  color: #094580;
}

.accordion-item-header.active::after {
  content: "🠭";
  color: #094580;
} */

  .accordion-item-body {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.2s ease-out;
    /* width: 100%; */
  }

  .accordion-item-body-content {
    font-weight: 700;
    font-size: 18px;
    color: #124483;
    background: #eee;
    padding: 0 10px;
  }

  @media (max-width: 767px) {
    html {
      font-size: 14px;
    }
  }

  .tab {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  ul.tab {
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
  }

  li.tablinks {
    font-size: 14px;
    cursor: pointer;
    padding: 8px 25px;
  }

  li.tablinks:hover {
    background-color: #fff;
    border-radius: 10px;
  }

  .table-wrapper {
    max-width: 397px;
  }

  .year {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    padding: 5px 15px;
    border-radius: 10px;
    color: #094580;
  }

  .arr-down {
    font-size: 16px;
    width: 10px;
    filter: invert(23%) sepia(23%) saturate(3582%) hue-rotate(188deg)
      brightness(93%) contrast(97%);
  }

  .title {
    text-transform: uppercase;
  }
</style>
