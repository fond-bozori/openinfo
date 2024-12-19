<template>
  <div class="header-name title">
    {{ $t('message.investment_intermediaries') }}
  </div>
  <div class="search-bar">
    <el-autocomplete
      v-model="factSearchInput"
      :fetch-suggestions="querySearch"
      :trigger-on-focus="false"
      class="inline-input w-100"
      clearable
      :placeholder="$t('message.placeholder_without_ticker')"
      size="large"
      value-key="full_name"
    />

    <el-button
      size="large"
      :icon="Search"
      type="success"
      color="#124483"
      style="margin: 0"
      @click="getBrokersData"
    >
      {{ $t('message.Search') }}
    </el-button>
    <el-button
      size="large"
      :icon="RefreshLeft"
      color="red"
      style="margin: 0"
      @click="clearFields"
    >
      {{ $t('message.Clear') }}
    </el-button>
  </div>
  <div class="search-bar">
    <el-tag size="large" style="font-size: 14px">
      {{ $t('message.sort_brokery_by_category') }}
      <el-icon size="18" style="vertical-align: middle"> <Right /> </el-icon>
    </el-tag>

    <el-select
      v-model="yearSort"
      :placeholder="$t('message.brokers_menu.sort_by_year')"
      style="width: 100%"
      @change="yearChange"
    >
      <el-option
        v-for="item in filterYearOptions"
        :key="item.value"
        :label="item.value"
        :value="item.value"
      />
    </el-select>

    <el-select
      v-model="amountFilter"
      :placeholder="$t('message.brokers_menu.sort_by_amount')"
      style="width: 100%"
      clearable
      :disabled="!!quantityFilter"
      @change="fetchOnChange"
    >
      <el-option
        v-for="item in sortOptions"
        :key="item.value"
        :label="$t(`message.${item.label}`)"
        :value="item.value"
      />
    </el-select>
    <el-select
      v-model="quantityFilter"
      :placeholder="$t('message.brokers_menu.sort_by_quantity')"
      style="width: 100%"
      :disabled="!!amountFilter"
      clearable
      @change="fetchOnChange"
    >
      <el-option
        v-for="item in sortOptionsTransactionCount"
        :key="item.value"
        :label="$t(`message.${item.label}`)"
        :value="item.value"
      />
    </el-select>
  </div>

  <div v-loading="loading" class="contain">
    <el-empty v-if="!data.length" description="No Data" />

    <div v-for="broker in data" :key="broker.id" class="broker-card">
      <div class="broker-card__header">
        <div class="img-container">
          <img
            v-if="broker.logo_file"
            :src="`${baseLogoUrl}${broker.logo_file}`"
            alt="Broker Logo"
            class="news-image"
          />
          <img
            v-else
            src="/src/assets/images/not-found.png"
            alt="Placeholder"
            class="news-image"
          />
        </div>

        <div class="d-flex justify-content-center w-100">
          <div class="broker-card__info">
            <h1 class="broker-name">{{ broker.full_name }}</h1>
            <div class="d-flex flex-column gap-3">
              <div class="footer-info">
                <img
                  class="broker-icon"
                  src="/src/assets/images/icons/phone-call.svg"
                  alt="phone-call"
                />
                {{ broker.broker_phones[0].phone_number }}
              </div>
              <div class="footer-info">
                <img
                  class="broker-icon"
                  src="/src/assets/images/icons/map-pin.svg"
                  alt="broker-icon"
                />
                {{ broker.address }}
              </div>
              <a :href="`mailto:${broker.email}`" class="footer-info">
                <img
                  class="broker-icon"
                  src="/src/assets/images/icons/mail.svg"
                  alt="broker-icon"
                />
                {{ broker.email }}
              </a>
              <p class="director-name">
                {{ $t('message.investment_intermediaries_ceo') }}:
                <b>{{ broker.broker_staffs[0].full_name }}</b>
              </p>
            </div>
          </div>

          <div>
            <div>
              <custom-dropdown
                class="brokerages-dropdown"
                :years="years"
                :selected-year="selectedYear"
                :selected-data="broker.turnover"
                :all-data="broker"
                @year-change="(year) => handleYearChange(year, broker.id)"
              />
            </div>

            <!--            <BrokerChart-->
            <!--              v-if="selectedChart === 'transaction_amount'"-->
            <!--              :chart-data="broker.turnover"-->
            <!--              :selected-chart="selectedChart"-->
            <!--            />-->
            <!--            <BrokerChartTransactionCount-->
            <!--              v-if="selectedChart === 'transaction_count'"-->
            <!--              :chart-data="broker.turnover"-->
            <!--              :selected-chart="selectedChart"-->
            <!--            />-->
          </div>
        </div>
      </div>
      <a
        :href="`http://${broker.web_site}`"
        class="link-to__website"
        target="_blank"
      >
        {{ $t('message.investment_intermediaries_web') }}
      </a>
    </div>

    <el-pagination
      class="flex"
      style="display: flex; justify-content: center"
      background
      layout="prev, pager, next"
      :total="total"
      :current-page="currentPage"
      :page-count="totalPages"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import { ElNotification } from 'element-plus'
  import { useRoute } from 'vue-router'
  import CustomDropdown from '@/components/brokerages-dropdown.vue'
  import { RefreshLeft, Search, Right } from '@element-plus/icons-vue'
  const data = ref([])
  const baseLogoUrl = 'https://openinfo.uz/media/'
  const url = import.meta.env.VITE_APP_SERVER_URL
  const loading = ref(false)
  const route = useRoute()
  const totalPages = ref(null)
  const total = ref(null)
  const currentPage = ref(1)

  const years = ref([2019, 2020, 2021, 2022, 2023])

  const selectedYear = ref(years.value[years.value.length - 1])
  const factSearchInput = ref('')
  const suggestionsList = ref([])

  const selectedChart = ref('transaction_amount')

  const FilterSort = ref([])
  const yearSort = ref('')
  const quantityFilter = ref('')
  const amountFilter = ref('')

  const giveFilterContentBy = (val) => {
    console.log(val, 'val')
    switch (val) {
      case 'transaction_order_asc':
        return '&transaction_order=asc'
      case 'transaction_order_desc':
        return '&transaction_order=desc'
      case 'turnover_order_asc':
        return '&turnover_order=asc'
      case 'turnover_order_desc':
        return '&turnover_order=desc'
      default:
        return ''
    }
  }

  const getBrokersData = () => {
    loading.value = true
    axios
      .get(`${url}/brokers/list/`, {
        params: {
          page: currentPage.value,
          year: yearSort.value || undefined, // Will not add to params if undefined
          search: factSearchInput.value || '',
          turnover_order: amountFilter.value || '',
          transaction_order: quantityFilter.value,
        },
      })
      .then((response) => {
        data.value = response.data.results
        totalPages.value = response.data.total_pages
        total.value = response.data.count
      })
      .catch((response) => {
        ElNotification({
          type: 'error',
          message: response?.data?.message || 'Error fetching data!',
        })
        console.log(response, 'error')
      })
      .finally(() => {
        loading.value = false
      })
  }

  const handleYearChange = (year, brokerId) => {
    const broker = data.value.find((b) => b.id === brokerId)
    if (broker) {
      broker.turnover = broker.turnover.map((t) => {
        if (t.year === year) {
          return {
            ...t,
            transactions_count: t.transactions_count,
            transactions_amount: t.transactions_amount,
          }
        }
        return t
      })
    }
  }

  const querySearch = (queryString, cb) => {
    axios
      .get(`${url}/brokers/autofill/?name=${queryString}`)
      .then((response) => {
        suggestionsList.value = response.data

        // call callback function to return suggestions
        cb(suggestionsList.value)
      })
      .catch((err) => {
        console.log(err, 'error')
      })
  }

  const changeFilter = () => {}

  const clearFields = () => {
    factSearchInput.value = ''
    amountFilter.value = ''
    quantityFilter.value = ''
    getBrokersData()
  }

  const handleCurrentChange = (page) => {
    currentPage.value = page
    getBrokersData()
  }

  const fetchOnChange = () => {
    console.log(quantityFilter.value, 'quantity')
    console.log(amountFilter.value, 'amount')
    getBrokersData()
  }

  const yearChange = () => {
    selectedYear.value = +yearSort.value
    getBrokersData()
  }

  const sortOptions = [
    {
      value: 'asc',
      label: 'turnover_order_asc',
    },
    {
      value: 'desc',
      label: 'turnover_order_desc',
    },
  ]

  // "transaction_order_asc": "Transactions Count by smallest ",
  //     "transaction_order_desc": "Transactions Count by largest",
  //     "turnover_order_asc": "Transaction amount by smallest ",
  //     "turnover_order_desc": "Transaction amount by largest",

  const sortOptionsTransactionCount = [
    {
      value: 'asc',
      label: 'transaction_order_asc',
    },
    {
      value: 'desc',
      label: 'transaction_order_desc',
    },
  ]

  const filterYearOptions = [
    {
      value: '2019',
    },
    {
      value: '2020',
    },
    {
      value: '2021',
    },
    {
      value: '2022',
    },
    {
      value: '2023',
    },
  ]

  const chartOption = [
    {
      value: 'transaction_amount',
      label: 'transaction_amount',
    },
    {
      value: 'transaction_count',
      label: 'transaction_count',
    },
  ]

  onMounted(() => {
    getBrokersData()
  })
</script>

<style scoped>
  .header-name {
    /* background: #124483; */
    border-radius: 8px;
    text-transform: uppercase;
    color: #fff;
    text-align: center;
    height: 50px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #124483;
  }

  .contain {
    min-height: 50vh;
    display: flex;
    flex-direction: column;
    gap: 30px;
    padding: 0 5px;
    margin: 20px 0;
    width: 100%;
  }

  .broker-card {
    background: #fefefe;
    box-shadow: 0 0 2px 3px rgba(148, 148, 148, 0.1);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    color: #124483;
    width: 100%;
    padding: 20px;
    gap: 12px;
  }

  .broker-name {
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 29px;
    color: #124483;
    margin: 0;
  }

  .broker-card__header {
    display: flex;
    position: relative;
  }

  .img-container {
    border-radius: 8px;
    max-width: 200px;
    min-width: 200px;
    overflow: hidden;
    box-shadow: var(--el-box-shadow-lighter);
    border: 1px solid #e6e8f0;
    background: #efefef;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
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

  .broker-card__info {
    display: flex;
    flex-direction: column;
    gap: 15px;
    font-size: 16px;
    line-height: 19px;
    width: 100%;
    margin-left: 10px;
    margin-right: 10px;
    border-left: 1px solid #e6e8f0;
    padding-left: 35px;
  }

  .footer-info {
    color: #124483;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .broker-icon {
    width: 18px;
  }

  .link-to__website {
    background: #e6e8f0;
    color: #124483;
    text-align: center;
    padding: 4px 30px;
    text-decoration: none;
    border-radius: 8px;
  }

  .link-to__website:hover {
    color: #ffff;
    background: #5cb85c;
  }

  .brokerages-dropdown {
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(-10px, 10px);
  }
</style>
