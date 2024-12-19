Sure, here's the complete code combined into one piece, including the template,
script, and styles: ### Template, Script, and Styles Combined ```html
<template>
  <div class="marquee" v-if="exchangeData.length">
    <ul class="marquee-content" ref="marqueeContent">
      <li v-for="rate in exchangeData" :key="rate.Ccy">
        <img :src="rate.logo" alt="Flag" class="avatar" />
        <div class="rate-info">
          <div class="rate-label">{{ rate.Ccy }} = {{ rate.Rate }}</div>
          <div :class="{ positive: rate.Diff > 0, negative: rate.Diff < 0 }">
            {{ rate.Diff }}
          </div>
        </div>
        <div class="icon-container">
          <template v-if="rate.Diff > 0">
            <RiseOutlined class="icon positive" />
          </template>
          <template v-else>
            <FallOutlined class="icon negative" />
          </template>
        </div>
      </li>
    </ul>
  </div>
  <div v-else class="loading">Loading...</div>
</template>

<script>
  import { onMounted, ref, nextTick } from 'vue'
  import http from '../../../http/index.js'
  import { RiseOutlined, FallOutlined } from '@ant-design/icons-vue'

  export default {
    name: 'Marquee',
    components: {
      RiseOutlined,
      FallOutlined,
    },
    setup() {
      const exchangeData = ref([])
      const loading = ref(true)
      const marqueeContent = ref(null)

      const getExchangeRates = async () => {
        try {
          const response = await http.get('home/exchange-rates/')
          exchangeData.value = response.data
          console.log(response.data, 'response received')
        } catch (err) {
          console.error(err)
        } finally {
          loading.value = false
          nextTick(() => {
            setMarqueeProperties()
          })
        }
      }

      const setMarqueeProperties = () => {
        const root = document.documentElement
        const marqueeContentElement = marqueeContent.value

        const totalWidth = Array.from(marqueeContentElement.children).reduce(
          (acc, el) => acc + el.offsetWidth,
          0,
        )

        const clonesNeeded = Math.ceil(window.innerWidth / totalWidth)
        for (let i = 0; i < clonesNeeded; i++) {
          Array.from(marqueeContentElement.children).forEach((child) => {
            marqueeContentElement.appendChild(child.cloneNode(true))
          })
        }

        const animationDuration = (totalWidth * clonesNeeded) / 50
        root.style.setProperty(
          '--marquee-animation-duration',
          `${animationDuration}s`,
        )
      }

      onMounted(() => {
        getExchangeRates()
      })

      return { exchangeData, loading, marqueeContent }
    },
  }
</script>

<style scoped>
  :root {
    --marquee-width: 100vw;
    --marquee-height: 55px;
    --marquee-elements-displayed: 5;
    --marquee-element-width: 200px;
    --marquee-animation-duration: 10s;
    --marquee-elements: 12;
  }

  .marquee {
    width: var(--marquee-width);
    height: var(--marquee-height);
    background-color: white;
    color: #111;
    overflow: hidden;
    position: relative;
    border-radius: 10px;
    border: 1px solid #ddd;
    margin: 20px 0;
  }

  .marquee:before,
  .marquee:after {
    position: absolute;
    top: 0;
    width: 10%;
    height: 100%;
    content: '';
    z-index: 1;
  }

  .marquee:before {
    left: 0;
    background: linear-gradient(to right, white 0%, transparent 100%);
  }

  .marquee:after {
    right: 0;
    background: linear-gradient(to left, white 0%, transparent 100%);
  }

  .marquee-content {
    list-style: none;
    display: flex;
    align-items: center;
    animation: scrolling var(--marquee-animation-duration) linear infinite;
  }

  @keyframes scrolling {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-100%);
    }
  }

  .marquee-content li {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    width: var(--marquee-element-width);
    white-space: nowrap;
    padding: 0 30px;
  }

  .avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 10px;
    border: 1px solid #ddd;
  }

  .icon-container {
    display: flex;
    align-items: center;
    margin-right: 10px;
    margin-left: 10px;
  }

  .icon {
    font-size: 30px;
  }

  .rate-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .rate-label {
    display: flex;
    align-items: center;
    font-size: 16px;
  }

  .rate-info .positive {
    color: green;
    font-size: 12px;
  }

  .rate-info .negative {
    color: red;
    font-size: 12px;
  }

  .icon.positive {
    color: green;
  }

  .icon.negative {
    color: red;
  }

  .loading {
    text-align: center;
    font-size: 20px;
    color: #888;
  }

  @media (max-width: 600px) {
    :root {
      --marquee-width: 100vw;
      --marquee-height: 16vh;
      --marquee-elements-displayed: 3;
    }
    .marquee:before,
    .marquee:after {
      width: 5%;
    }
  }
</style>
