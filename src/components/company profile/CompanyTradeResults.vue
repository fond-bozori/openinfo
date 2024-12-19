<template>
  <div class="search-bar">
    <el-select
      v-model="selectedStock"
      placeholder="Select"
      size="large"
      @change="selectChange"
    >
      <el-option
        v-for="item in isinCodes"
        :key="item.value"
        :value="item.isu_cd"
        :label="`${$t(`message.${getInfoByLang(item.stock_type)}`)} `"
      />
    </el-select>

    <el-date-picker
      v-model="startDate"
      type="date"
      format="YYYY-MM-DD"
      :placeholder="$t('message.start_date')"
      :shortcuts="shortcuts"
      :picker-options="pickerOptions"
      size="large"
      style="width: 400px"
    />
    <el-date-picker
      v-model="endDate"
      type="date"
      format="YYYY-MM-DD"
      :placeholder="$t('message.end_date')"
      :shortcuts="shortcuts"
      :picker-options="pickerOptions"
      size="large"
      style="width: 400px"
    />

    <el-button
      :icon="Search"
      color="#124483"
      size="large"
      style="margin: 0"
      type="success"
      @click="getTradeResults"
    >
      {{ $t('message.Search') }}
    </el-button>
    <el-button
      v-if="value === 'Option1'"
      color="red"
      size="large"
      style="margin: 0"
      @click="clearFields"
    >
      {{ $t('message.Clear') }}</el-button
    >
    <a
      :href="`${url}/iuzse/export-excel/?isu_cd=${selectedStock}${startDate ? `&start_date=${moment(startDate).format('YYYY-MM-DD')}` : ''}${endDate ? `&end_date=${moment(endDate).format('YYYY-MM-DD')}` : ''}`"
      class="btn-primary d-flex align-items-center"
      style="margin-left: 25px"
      download
    >
      <img
        style="width: 34px"
        src="/src/assets/images/icons/excel-icon2.svg"
        alt="pdfIcon"
      />
    </a>
  </div>

  <div class="company-fact-container">
    <el-table
      v-loading="loading"
      stripe
      border
      :data="tradeData"
      style="width: 100%"
      height="400"
      element-loading-background="rgba(0, 0, 0, 0.4)"
      :header-cell-style="{
        color: '#fff',
        'text-transform': 'uppercase',
        padding: '4px 0',
      }"
      empty-text="Malumotlar Topilmadi"
    >
      <el-table-column
        prop="trade_date"
        :label="$t('message.statistics_date')"
        width="120"
        align="center"
      >
        <template #default="scope">
          {{
            new Date(scope.row.trade_datetime).toLocaleDateString(
              'ru-RU',
              options,
            )
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="market_id"
        :label="$t('message.statistics_market')"
        align="center"
      />

      <el-table-column
        prop="board_id"
        label="Площадка"
        align="center"
        min-width="150"
      />
      <el-table-column prop="ticker" label="Ticker" align="center" />
      <el-table-column
        prop="isin_code"
        header-align="center"
        align="center"
        :label="$t('message.statistics_isin')"
        min-width="150"
      />
      <el-table-column
        prop="issuer_short_name"
        header-align="center"
        :label="$t('message.statistics_issuer')"
        align="center"
        min-width="290"
      />

      <el-table-column
        prop="stock_type"
        label="Тип ценной бумаги"
        align="center"
        min-width="200"
      >
        <template #default="scope">
          {{ $t(`message.${getInfoByLang(scope.row.stock_type)}`) }}
        </template>
      </el-table-column>
      <!--        <el-table-column label="Trade Info"  header-align="center" >-->

      <el-table-column
        prop="trade_price"
        label="Торговая цена (UZS)"
        align="center"
        min-width="180"
      >
        <template #default="scope">
          {{
            (+scope.row.trade_price)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="trade_quantity"
        label="Кол-во ЦБ"
        align="center"
        min-width="150"
      />
      <el-table-column
        prop="trade_value"
        label="Объём торгов (UZS)"
        align="center"
        min-width="180"
      >
        <template #default="scope">
          {{
            (+scope.row.trading_value)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
          }}
        </template>
      </el-table-column>
      <!--              </el-table-column>-->
    </el-table>
    <div class="pagination d-flex justify-content-center mt-4 mb-4">
      <el-pagination
        :current-page="currentPage"
        :page-count="totalPages"
        :total="total"
        background
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
  import { computed, onBeforeMount, ref } from 'vue'
  import axios from 'axios'
  import { useStore } from '@/stores/store'
  import { useRoute, useRouter } from 'vue-router'
  import options from '@/components/options'
  import { Search } from '@element-plus/icons-vue'
  import moment from 'moment/moment'
  import { ElNotification } from 'element-plus'
  const activeNames = ref(['1'])

  const loading = ref(false)
  const data = ref([])
  const store = useStore()
  const isCollapseOpen = ref(false)

  const url = import.meta.env.VITE_APP_SERVER_URL

  const factLists = ref([])

  const dateValue = ref(null)

  const route = useRoute()
  const router = useRouter()
  const selectValue = ref(options[0].value)
  const startDate = ref(null)
  const endDate = ref(null)
  const pickerOptions = {
    disabledDate(time) {
      return time.getTime() > Date.now()
    },
  }

  const totalPages = ref(null)
  const total = ref(null)
  const results = ref([])
  const factNumber = ref(1)

  const id = computed(() => route.params.id)
  const factSearchInput = ref('')
  const suggestionsList = ref([])
  const currentPage = ref(1)
  const tradeData = ref([])

  const suffix = ref('')
  const Inn = ref(null)
  const Isin = ref(null)
  const PrivIsin = ref(null)

  const isinCodes = ref([])

  const mktId = ref('')
  const selectedStock = ref(null)

  const stockTypes = ref([
    {
      value: '01',
      label: 'simple',
    },
    {
      value: '02',
      label: 'privigled',
    },
    {
      value: '',
      label: 'obligations',
    },
  ])

  const value = ref('Option1')
  const Listedoptions = [
    {
      value: 'Option1',
      label: 'listed',
    },
    {
      value: 'Option2',
      label: 'unlisted',
    },
  ]
  const mktIdOptions = [
    { label: 'ALL', value: 'ALL' },
    { label: 'STK', value: 'STK' },
    { label: 'BND', value: 'BND' },
    { label: 'RPO', value: 'RPO' },
    { label: 'FCT', value: 'FCT' },
  ]

  const handleCurrentChange = (val) => {
    currentPage.value = val
    getTradeResults()
  }

  const selectChange = () => {
    currentPage.value = 1
    getTradeResults()
  }

  const shortcuts = [
    {
      text: 'Today',
      value: new Date(),
    },
    {
      text: 'Yesterday',
      value: () => {
        const date = new Date()
        date.setTime(date.getTime() - 3600 * 1000 * 24)
        return date
      },
    },
    {
      text: 'A week ago',
      value: () => {
        const date = new Date()
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
        return date
      },
    },
  ]

  const getCompanyProfile = () => {
    loading.value = true
    axios
      .get(`${url}/home/organizations/${id.value}/`, {
        method: 'get',
      })
      .then((response) => {
        suffix.value = data.value.name_suffix_id
        Inn.value = data.value.inn
        // for (let i = 0; i < response.data.info_rfb.isin_codes.length; i++) {
        //   // response.data.info_rfb.isin_codes[i].stock_type === '01' ? Isin.value(response.data.info_rfb.isin_codes[i].isu_cd) :  response.data.info_rfb.isin_codes[i].stock_type === '02' ? PrivIsin.value(response.data.info_rfb.isin_codes[i].stock_type === '02') : ''
        //   console.log(response.data.info_rfb.isin_codes[i], 'sss')
        //
        // }

        isinCodes.value = response.data.info_rfb.isin_codes
        selectedStock.value = isinCodes.value[0]?.isu_cd
        getTradeResults()
      })
      .catch(({ response }) => {
        ElNotification({
          type: 'error',
          message: response?.data?.message || 'Malumot olishda xatolik bor!',
        })
      })
      .finally(() => {
        loading.value = false
      })
  }

  const getTradeResults = () => {
    loading.value = true
    axios
      .get(
        `${url}/iuzse/trade-results/${selectedStock?.value}?page=${currentPage.value}&page_size=8${startDate?.value ? `&start_date=${moment(startDate?.value).format('YYYY-MM-DD')}` : ''}${endDate?.value ? `&end_date=${moment(endDate?.value).format('YYYY-MM-DD')}` : ''}`,
        {
          method: 'get',
        },
      )
      .then((response) => {
        tradeData.value = response.data.results
        totalPages.value = response.data.total_pages
        total.value = response.data.count
        new Date(dateValue.value).toLocaleDateString('ru-RU', options, 'then')
      })
      .catch(({ response }) => {
        ElNotification({
          type: 'error',
          message: response.data.message || 'Malumot olishda xatolik bor!',
        })
      })
      .finally(() => {
        loading.value = false
      })
  }

  const getInfoByLang = (stockType) => {
    switch (stockType) {
      case '01':
        return 'simple_stock'
      case '02':
        return 'privileged_stock'
      case '':
        return 'obligations'
      default:
        return '-'
    }
  }

  const getExcel = () => {
    axios
      .get(
        `${url}/iuzse/export-excel/?isu_cd=${selectedStock?.value}${startDate?.value ? `&start_date=${moment(startDate?.value).format('YYYY-MM-DD')}` : ''}${endDate?.value ? `&end_date=${moment(endDate?.value).format('YYYY-MM-DD')}` : ''}`,
        {
          method: 'GET',
          responseType: 'blob', // Important for processing binary data
        },
      )
      .then((response) => {
        // Create a URL for the blob
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'file.xlsx') // Or any other extension
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
      .catch((error) => {
        console.error('Error downloading the file:', error)
      })
  }

  const changeData = () => {
    currentPage.value = 1
    loading.value = true
    if (value.value === 'Option1') {
      tradeDataOtc.value = []
      getTradeResults()
    } else {
      tradeData.value = []
      getTradeResults()
    }
    // console.log(document.getElementById("chart"))
    // loading.value = false
  }

  // const openCollapse = ()=> {
  //   if(!factLists.value.length) {
  //     getTradeResults()
  //   }
  //
  //
  //
  // }

  onBeforeMount(() => {
    getCompanyProfile()
  })

  // onBeforeUnmount(()=> {
  //   store.setInn(null)
  //   store.setPrivilegedIsin(null)
  //   store.setSimpleIsin(null)
  // })
</script>

<style scoped></style>
