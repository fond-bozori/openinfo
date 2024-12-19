<template>
  <div v-loading="loading" class="wrapper">
    <div class="head-random">
      <h1 class="fs-2">{{ $t('message.random_title') }}</h1>
    </div>

    <div class="random">
      <div class="containerOrg">
        <div class="random-picker">
          <h1 class="org-title">{{ $t('message.random_title1') }}</h1>
          <h1 id="headerNames">?</h1>
          <div id="startButton" class="button">
            {{ $t('message.button_start') }}
          </div>
          <div id="stopButton" class="button">
            {{ $t('message.button_stop') }}
          </div>
        </div>

        <div v-if="randomOrgResult" id="randomly-selected">
          <div class="head-selected">
            <div class="img-container">
              <img
                v-if="randomOrgResult?.logo_file"
                :src="`${baseLogoUrl}${randomOrgResult?.logo_file}`"
                alt="newsImage"
                class="news-image"
              />
              <img
                v-else
                src="/src/assets/images/not-found.png"
                alt="newsImage"
                class="news-image"
              />
            </div>
            <h1 class="broker-name">{{ randomOrgResult?.short_name_text }}</h1>
          </div>

          <div class="footer-info">
            <img
              class="broker-icon"
              src="/src/assets/images/icons/phone-call.svg"
            />{{
              randomOrgResult?.detailinfo.phone_number
                ? randomOrgResult?.detailinfo.phone_number
                : 'нет номера'
            }}
          </div>
          <a :href="randomOrgResult?.location_url">
            <div class="footer-info">
              <img
                class="broker-icon"
                src="/src/assets/images/icons/map-pin.svg"
              />
              {{ randomOrgResult?.address }}
            </div></a
          >
          <div class="footer-info">
            <img class="broker-icon" src="/src/assets/images/icons/mail.svg" />
            {{ randomOrgResult?.email }}
          </div>
          <!--          <p class="broker-info__detail">{{data.additional_info}}</p>-->
          <div class="footer-info">
            {{ $t('message.investment_intermediaries_ceo') }} :
            <b> {{ randomOrgResult?.detailinfo.director_name }} </b>
          </div>
          <div class="footer-info" style="justify-content: center">
            <el-link
              :href="`http://${randomOrgResult.web_site}`"
              class="trade"
              type="success"
              :underline="false"
              :icon="DArrowRight"
            >
              {{ $t('message.investment_intermediaries_web') }}
            </el-link>
          </div>
        </div>
      </div>
      <div class="containerBroker">
        <div id="chart"></div>

        <div v-if="randomBrokersResult" id="randomly-selected">
          <div class="head-selected">
            <div class="img-container">
              <img
                v-if="randomBrokersResult?.logo_file"
                :src="`${baseLogoUrl}${randomBrokersResult?.logo_file}`"
                alt="newsImage"
                class="news-image"
              />
              <img
                v-else
                src="/src/assets/images/not-found.png"
                alt="newsImage"
                class="news-image"
              />
            </div>
            <h1 class="broker-name">{{ randomBrokersResult?.full_name }}</h1>
          </div>

          <div class="footer-info">
            <img
              class="broker-icon"
              src="/src/assets/images/icons/phone-call.svg"
            />{{ randomBrokersResult?.broker_phones[0].phone_number }}
          </div>
          <a :href="randomBrokersResult?.location_url">
            <div class="footer-info">
              <img
                class="broker-icon"
                src="/src/assets/images/icons/map-pin.svg"
              />
              {{ randomBrokersResult?.address }}
            </div></a
          >
          <div class="footer-info">
            <img class="broker-icon" src="/src/assets/images/icons/mail.svg" />
            {{ randomBrokersResult?.email }}
          </div>
          <!--          <p class="broker-info__detail">{{data.additional_info}}</p>-->
          <div class="footer-info">
            {{ $t('message.investment_intermediaries_ceo') }} :
            <b> {{ randomBrokersResult?.broker_staffs[0].full_name }} </b>
          </div>
          <div class="footer-info" style="justify-content: center">
            <el-link
              :href="`http://${randomBrokersResult.web_site}`"
              class="trade"
              type="success"
              :underline="false"
              :icon="DArrowRight"
            >
              {{ $t('message.investment_intermediaries_web') }}
            </el-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed, onBeforeMount, onMounted, ref, watch } from 'vue'
  import axios from 'axios'
  import { DArrowRight } from '@element-plus/icons-vue'

  const OrganizationsData = ref([])
  const BrokersData = ref([])
  const selectValue = ref('brokers')
  const loading = ref(false)
  const selectedData = ref(null)
  const randomOrgResult = ref(null)
  const randomBrokersResult = ref(null)
  const baseLogoUrl = 'https://openinfo.uz/media/'

  const getSelected = (id) => {
    loading.value = true
    axios
      .get(`${import.meta.env.VITE_APP_SERVER_URL}/brokers/list/${id}`, {
        method: 'get',
      })
      .then((response) => {
        randomBrokersResult.value = response.data
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        loading.value = false
      })
  }

  const getRandomResult = (id) => {
    loading.value = true
    axios
      .get(`${import.meta.env.VITE_APP_SERVER_URL}/home/organizations/${id}`, {
        method: 'get',
      })
      .then((response) => {
        randomOrgResult.value = response.data
        console.log(selectedData.value, 'ssss')
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        loading.value = false
      })
  }

  const options = [
    {
      value: 'brokers',
      label: 'Brokerlar',
    },
    {
      value: 'organizations',
      label: 'Tashkilotlar',
    },
  ]

  const getBrokersData = () => {
    loading.value = true
    axios
      .get(`${import.meta.env.VITE_APP_SERVER_URL}/brokers/randomize/`, {
        method: 'get',
      })
      .then((response) => {
        BrokersData.value = response.data
        getCycle()
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        loading.value = false
      })
  }

  const getOrganizations = () => {
    loading.value = true
    axios
      .get(`${import.meta.env.VITE_APP_SERVER_URL}/home/org-randomize/`, {
        method: 'get',
      })
      .then((response) => {
        OrganizationsData.value = response.data
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        loading.value = false
      })
  }

  const getCycle = () => {
    let padding = { top: 0, right: 0, bottom: 0, left: 0 },
      w = 550 - padding.left - padding.right,
      h = 550 - padding.top - padding.bottom,
      r = Math.min(w, h) / 2,
      rotation = 0,
      oldrotation = 0,
      picked = 100000,
      oldpick = [],
      color = d3.scale.category20() //category20c()
    // randomNumbers = getRandomNumbers();
    //http://osric.com/bingo-card-generator/?title=HTML+and+CSS+BINGO!&words=padding%2Cfont-family%2Ccolor%2Cfont-weight%2Cfont-size%2Cbackground-color%2Cnesting%2Cbottom%2Csans-serif%2Cperiod%2Cpound+sign%2C%EF%B9%A4body%EF%B9%A5%2C%EF%B9%A4ul%EF%B9%A5%2C%EF%B9%A4h1%EF%B9%A5%2Cmargin%2C%3C++%3E%2C{+}%2C%EF%B9%A4p%EF%B9%A5%2C%EF%B9%A4!DOCTYPE+html%EF%B9%A5%2C%EF%B9%A4head%EF%B9%A5%2Ccolon%2C%EF%B9%A4style%EF%B9%A5%2C.html%2CHTML%2CCSS%2CJavaScript%2Cborder&freespace=true&freespaceValue=Web+Design+Master&freespaceRandom=false&width=5&height=5&number=35#results

    const svg = d3
      .select('#chart')
      .append('svg')
      .data([BrokersData.value])
      .attr('width', w + padding.top + padding.bottom)
      .attr('height', h + padding.top + padding.bottom)

    const container = svg
      .append('g')
      .attr('class', 'chartholder')

      .attr(
        'transform',
        'translate(' +
          (w / 2 + padding.left) +
          ',' +
          (h / 2 + padding.top) +
          ')',
      )
    const vis = container.append('g')

    const pie = d3.layout
      .pie()
      .sort(null)
      .value(function (d) {
        return 1
      })
    // declare an arc generator function
    const arc = d3.svg.arc().outerRadius(r)
    // select paths, use arc generator to draw
    const arcs = vis
      .selectAll('g.slice')
      .data(pie)
      .enter()
      .append('g')
      .attr('class', 'slice')

    arcs
      .append('path')
      .attr('fill', function (d, i) {
        return color(i)
      })
      .attr('d', function (d) {
        return arc(d)
      })
    // add the text
    arcs
      .append('text')
      .style({ 'font-size': '8px', 'font-weight': 'bold' })
      .attr('transform', function (d) {
        d.innerRadius = 0
        d.outerRadius = r
        d.angle = (d.startAngle + d.endAngle) / 2
        return (
          'rotate(' +
          ((d.angle * 180) / Math.PI - 90) +
          ')translate(' +
          (d.outerRadius - 10) +
          ')'
        )
      })
      .attr('text-anchor', 'end')
      .text(function (d, i) {
        return (
          BrokersData.value[i].label.replace('ООО', '') ||
          BrokersData.value[i].label.replace('ооо', '') ||
          BrokersData.value[i].label.replace('ooo', '')
        )
      })
    container.on('click', spin)
    function spin(d) {
      container.on('click', null)
      //all slices have been seen, all done
      console.log(
        'OldPick: ' + oldpick.length,
        'Data length: ' + BrokersData.value.length,
      )
      if (oldpick.length === BrokersData.value.length) {
        console.log('done')
        container.on('click', null)
        return
      }
      const ps = 360 / BrokersData.value.length,
        pieslice = Math.round(1440 / BrokersData.value.length),
        rng = Math.floor(Math.random() * 1440 + 1080)

      rotation = Math.round(rng / ps) * ps

      picked = Math.round(BrokersData.value.length - (rotation % 360) / ps)
      picked =
        picked >= BrokersData.value.length
          ? picked % BrokersData.value.length
          : picked
      // if(oldpick.indexOf(picked) !== -1){
      //     d3.select(this).call(spin);
      //     return;
      // } else {
      //     // oldpick.push(picked);
      // }
      rotation += 90 - Math.round(ps / 2)
      vis
        .transition()
        .duration(6000)
        .attrTween('transform', rotTween)
        .each('end', function () {
          //mark question as seen

          // d3.select(".slice:nth-child(" + (picked + 1) + ") path")
          //     .attr("fill", "#111");

          //populate question
          getSelected(BrokersData.value[picked].value)
          // console.log(data.value[picked].value)
          // d3.select('#randomly-selected h1').text(data.value[picked].label);
          // d3.select('#randomly-selected h1').text(selectedData.value.full_name +  selectedData.value.web_site);
          oldrotation = rotation

          /* Get the result value from object "data" */
          // console.log(data.value[picked]);

          /* Comment the below line for restrict spin to sngle time */
          container.on('click', spin)
        })
    }
    //make arrow
    svg
      .append('g')
      .attr(
        'transform',
        'translate(' +
          (w + padding.left + padding.right) +
          ',' +
          (h / 2 + padding.top) +
          ')',
      )
      .append('path')
      .attr('d', 'M-' + r * 0.15 + ',0L0,' + r * 0.05 + 'L0,-' + r * 0.05 + 'Z')
      .style({ fill: '#124483' })
    //draw spin circle
    container
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 60)
      .style({ fill: '#fff', cursor: 'pointer' })
    //spin text
    container
      .append('text')
      .attr('x', 0)
      .attr('y', 10)
      .attr('text-anchor', 'middle')
      .text('старт')
      .style({
        'font-weight': 'bold',
        'font-size': '28px',
        cursor: 'pointer',
        width: '100px',
        'border-radius': '50%',
        'text-transform': 'uppercase',
        fill: '#124483',
      })

    function rotTween(to) {
      const i = d3.interpolate(oldrotation % 360, rotation)
      return function (t) {
        return 'rotate(' + i(t) + ')'
      }
    }

    function getRandomNumbers() {
      const array = new Uint16Array(1000)
      const scale = d3.scale.linear().range([360, 1440]).domain([0, 100000])
      if (
        window.hasOwnProperty('crypto') &&
        typeof window.crypto.getRandomValues === 'function'
      ) {
        window.crypto.getRandomValues(array)
        console.log('works')
      } else {
        //no support for crypto, get crappy random numbers
        for (let i = 0; i < 1000; i++) {
          array[i] = Math.floor(Math.random() * 100000) + 1
        }
      }
      return array
    }

    ;('use strict')

    // Add list of names here

    // Default variables
    let i = 0
    const x = 0
    let intervalHandle = null
    const startButton = document.getElementById('startButton')
    const stopButton = document.getElementById('stopButton')
    const headerOne = document.getElementById('headerNames')
    const timerWrapper = document.getElementById('timerWrapper')
    // const timer = document.getElementById('timer');

    // Optional countdown timer
    // Add zero in front of numbers < 10
    function checkSecond(sec) {
      if (sec < 10 && sec >= 0) {
        sec = '0' + sec
      }
      if (sec < 0) {
        sec = '59'
      }
      return sec
    }

    // Start or stop the name shuffle on button click
    startButton.addEventListener('click', function () {
      this.style.display = 'none'
      stopButton.style.display = 'block'
      intervalHandle = setInterval(function () {
        // console.log(OrganizationsData.value[i++ % OrganizationsData.value.length].label,   )
        headerNames.textContent =
          OrganizationsData.value[++i % OrganizationsData.value.length].label
        console.log(i % OrganizationsData.value.length, 'value')
      }, 70)
    })
    stopButton.addEventListener('click', function () {
      this.style.display = 'none'
      startButton.style.display = 'block'
      clearInterval(intervalHandle)
      getRandomResult(
        OrganizationsData.value[i % OrganizationsData.value.length].value,
      )
    })

    // Allow use of spacebar to start/stop name shuffle
    //   document.body.onkeyup = function(e) {
    //     if (e.keyCode == 32) {
    //       if (x%2===0) {
    //         startButton.style.display = "none";
    //         stopButton.style.display = "block";
    //         intervalHandle = setInterval(function () {
    //           headerNames.textContent = data.value[i++ % data.value.length].label;
    //         }, 100);
    //       } else {
    //         startButton.style.display = "block";
    //         stopButton.style.display = "none";
    //         clearInterval(intervalHandle);
    //       }
    //       x++;
    //     }
    //   }
  }

  onMounted(() => {
    getBrokersData()
    getOrganizations()
  })
</script>

<style scoped>
  .wrapper {
    padding-bottom: 40px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: white;
  }

  .head-random {
    background: #124483;
    /* background: #124483; */
    /*text-transform: uppercase;*/
    color: #fff;
    text-align: center;
    height: 50px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px 10px 0 0;
    font-size: 20px;
  }

  .random {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    gap: 50px;
    flex-wrap: wrap;
  }

  .containerOrg {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 550px;
    justify-content: space-between;
  }

  .containerBroker {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  #randomly-selected {
    justify-content: space-between;
    display: flex;
    flex-direction: column;
    background-image: linear-gradient(
      174.2deg,
      rgba(255, 244, 228, 1) 7.1%,
      rgba(240, 246, 238, 1) 67.4%
    );
    box-shadow: var(--el-box-shadow-light);
    border-radius: 10px;
    padding: 20px;
    border-bottom: 1px solid #e6e8f0;
  }

  .head-selected {
    display: flex;
    gap: 20px;
    font-size: 20px;
    border-bottom: 1px solid #e6e8f0;
    padding-bottom: 15px;
    text-align: center;
    align-items: center;
    justify-content: center;
  }

  .broker-name {
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 29px;
    /* identical to box height */
    /*color: #2F2F2F;*/
    color: #124483;
    margin: 0;
  }

  /*RANDOM  */

  .random-picker {
    height: 550px;
    /*margin-bottom: 50px;*/
    background-color: #124483;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    box-shadow: var(--el-box-shadow-light);
    padding: 20px;
    border-radius: 10px;
    gap: 20px;
    width: 100%;
  }

  .random-result {
    height: 450px;
    /*margin-bottom: 50px;*/
    background-color: #0093e9;
    background-image: linear-gradient(160deg, #0093e9 0%, #80d0c7 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: var(--el-box-shadow-light);
    padding: 20px;
    border-radius: 10px;
    width: 100%;
  }

  h1#headerNames {
    /*margin-top: 5%;*/
    color: #fff;
    font-family: Georgia, serif;
    font-size: 22px;
    text-align: center;
    cursor: pointer;
    border-radius: 20px;
    border: 1px solid #fff;
    padding: 25px 0;
    width: 90%;
    margin: 0px auto;
    height: 80px;
    display: flex;
    align-items: center;
    background: white;
    color: #124483;
    justify-content: center;
  }

  .button {
    width: 200px;
    margin: 0 auto;
    padding: 10px;
    /*background: rgb(18, 68, 131);*/
    background: green;
    border: 1px solid #fff;
    border-radius: 10px;
    color: #fff;
    font-family: Arial, sans-serif;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 2px;
    display: block;
    cursor: pointer;
  }

  #stopButton {
    background: red;
    display: none;
  }

  .footer-info {
    border-bottom: 1px solid #e6e8f0;
    padding: 10px;
    color: #124483;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .img-container {
    border-radius: 8px;
    max-width: 100px;
    min-width: 100px;
    max-height: 100px;
    min-height: 100px;
    overflow: hidden;
    /*background: rgba(21, 78, 150, 0.7);*/
    box-shadow: var(--el-box-shadow-lighter);
    border: 1px solid #e6e8f0;
    background: #efefef;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .news-image {
    width: 100%;
    height: 100%;
    max-height: 150px;
    object-fit: contain;
    transition: transform 0.4s ease;
    transform: scale(1);
    cursor: pointer;
  }

  .news-image:hover {
    transform: scale(1.05);
  }

  #chart {
    background: #124483;
    box-sizing: border-box;
    margin: 0 auto;
    border-radius: 20px;
  }

  .org-title {
    text-align: center;
    font-size: 30px;
    text-transform: uppercase;
    line-height: 1.6;
    width: 250px;
    margin: 0 auto;
  }

  @media only screen and (max-width: 600px) {
    h1 {
      font-size: 50px;
    }
  }

  @media only screen and (max-width: 1720px) {
    .containerOrg {
      width: 100%;
    }

    .containerBroker {
      width: 100%;
      justify-content: center;
    }
    #chart {
      display: flex;
      width: 100%;
      justify-content: center;
      padding: 30px;
    }
  }
</style>
