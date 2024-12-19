<template>
  <div class="marquee" v-if="!loading && exchangeData.length">
    <ul class="marquee-content" ref="marqueeContent">
      <li v-for="item in exchangeData" :key="item.isin">
        <div class="rate-info">
          <div class="rate-label">{{ item.name }}</div>
          <div
            :class="{
              positive: getPriceDiff(item) > 0,
              negative: getPriceDiff(item) < 0,
            }"
          >
            {{ $t('message.closing_price') }}: {{ item.close_price }} ({{
              $t('message.diff')
            }}:
            <span :class="getPriceDiff(item) > 0 ? 'positive' : 'negative'">
              {{ getPriceDiff(item).toFixed(2) }} </span
            >)
          </div>
          <div class="text">
            {{ $t('message.opening_price') }}: {{ item.open_price }}
          </div>
          <div class="text">
            {{ $t('message.latest_transaction_date') }}:
            {{ formatDate(item.date) }}
          </div>
        </div>
        <div class="icon-container">
          <template v-if="getPriceDiff(item) > 0">
            <RiseOutlined class="icon positive" />
          </template>
          <template v-else>
            <FallOutlined class="icon negative" />
          </template>
        </div>
      </li>
    </ul>
  </div>
  <div v-else-if="loading" class="loading">{{ $t('message.loading') }}</div>
  <div v-else class="error">{{ $t('message.error_loading_data') }}</div>
</template>

<script>
  import { onMounted, ref, nextTick, watch, getCurrentInstance } from 'vue'
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
      const error = ref(false)
      const marqueeContent = ref(null)
      const { proxy } = getCurrentInstance()

      const getQuotes = async () => {
        try {
          const response = await http.get('/iuzse/listing-carousel/')
          exchangeData.value = response.data
        } catch (err) {
          console.error(err)
          error.value = true
        } finally {
          loading.value = false
          nextTick(() => {
            if (!error.value) {
              setMarqueeProperties()
            }
          })
        }
      }

      const cleanPrice = (price) => {
        const cleaned = price.replace(/,/g, '.').replace(/\s/g, '')

        return isNaN(parseFloat(cleaned)) ? 0 : parseFloat(cleaned)
      }

      const getPriceDiff = (item) => {
        const openPrice = cleanPrice(item.open_price)
        const closePrice = cleanPrice(item.close_price)

        if (isNaN(openPrice) || isNaN(closePrice)) {
          return 0
        }

        return closePrice - openPrice
      }

      // Format date to dd-mm-yyyy
      const formatDate = (dateString) => {
        const date = new Date(dateString)
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        return `${day}-${month}-${year}`
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
        getQuotes()
      })

      watch(
        () => proxy.$i18n.locale,
        (newLang) => {
          nextTick(() => {
            setMarqueeProperties()
          })
        },
      )

      return {
        exchangeData,
        getPriceDiff,
        formatDate,
        marqueeContent,
        loading,
        error,
      }
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

  .text {
    color: black;
    font-size: 12px;
  }

  .marquee:before {
    left: 0;
    background: linear-gradient(to right, white 0%, transparent 100%);
  }

  .marquee:after {
    right: 0;
    background: linear-gradient(to left, white 0%, transparent 100%);
  }

  @keyframes scrolling {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-100%);
    }
  }

  .marquee-content {
    margin-top: 15px;
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    animation: scrolling var(--marquee-animation-duration) linear infinite;
  }

  .marquee-content li {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: var(--marquee-element-width);
    height: var(--marquee-height);
    white-space: nowrap;
    padding: 0 30px;
  }

  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 10%;
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
    color: darkblue;
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: bold;
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

  .error {
    text-align: center;
    font-size: 18px;
    color: red;
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
