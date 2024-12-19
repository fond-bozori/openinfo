<template>
  <div v-loading="loading" class="table-white-header">
    <div class="search-bar mt-0">
      <el-select v-model="mktId" class="" :placeholder="$t('message.all')">
        <el-option
          v-for="item in mktIdOptions"
          :key="item.value"
          :value="item.value"
          :label="$t(`message.${item.label}`)"
        />
      </el-select>
      <el-date-picker
        v-model="startDate"
        type="date"
        format="YYYY-MM-DD"
        :placeholder="$t('message.start_date')"
        :shortcuts="shortcuts"
        :picker-options="pickerOptions"
        style="min-width: 400px"
      />
      <el-date-picker
        v-model="endDate"
        type="date"
        format="YYYY-MM-DD"
        :placeholder="$t('message.end_date')"
        :shortcuts="shortcuts"
        :picker-options="pickerOptions"
        style="min-width: 400px"
      />

      <el-input
        v-model="factSearchInput"
        class="w-100"
        placeholder="ISIN"
        value-key="full_name_text"
        clearable
      />

      <el-button
        :icon="Search"
        color="#124483"
        style="margin: 0"
        type="success"
        @click="getTradeResults"
      >
        {{ $t('message.Search') }}
      </el-button>
      <el-button color="red" style="margin: 0" @click="clearFields">
        {{ $t('message.Clear') }}</el-button
      >
      <a
        style="background: #059b39"
        target="_blank"
        :href="`${url}/iuzse/export-excel/?isu_cd=${factSearchInput}${startDate ? `&start_date=${moment(startDate).format('YYYY-MM-DD')}` : ''}${endDate ? `&end_date=${moment(endDate).format('YYYY-MM-DD')}` : ''}`"
        class="el-button el-button--success d-flex align-items-center justify-content-center gap-2"
      >
        <img src="../../assets/images/icons/Vector.svg" alt="excel-icon" />
        <span> Excel</span>
      </a>
    </div>

    <el-table
      v-if="tradeData.length"
      v-loading="loading"
      :data="tradeData"
      style="width: 100%"
      element-loading-background="rgba(0, 0, 0, 0.4)"
      empty-text="Malumotlar Topilmadi"
    >
      <el-table-column
        prop="issuer_short_name"
        align="left"
        :label="$t('message.trade.organization')"
        min-width="160"
      >
        <template #default="scope">
          <p style="color: #1256a0">
            {{ scope.row.issuer_short_name }}
          </p>
        </template>
      </el-table-column>
      <el-table-column prop="ticker" align="right">
        <template #default="scope">
          <el-tag style="min-width: 60px">{{ scope.row.ticker }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="trade_date"
        :label="$t('message.statistics_date')"
        width="170"
        align="right"
      >
        <template #default="scope">
          {{
            new Date(scope.row?.trade_datetime)
              ?.toLocaleDateString('ru-RU', timeOptions)
              ?.replace(',', ' | ')
          }}
        </template>
      </el-table-column>

      <el-table-column
        prop="isin_code"
        align="right"
        label="ISIN"
        width="150"
      />

      <el-table-column
        prop="stock_type"
        :label="$t('message.type_stock')"
        min-width="120"
        align="right"
      >
        <template #default="scope">
          {{ getInfoByLang(scope.row.stock_type) }}
        </template>
      </el-table-column>

      <el-table-column
        prop="trade_price"
        :label="$t('message.statistics_torg_tsena')"
        align="right"
        min-width="120"
      >
        <template #default="scope">
          {{ scope.row.trade_price.toLocaleString('ru') }}
        </template>
      </el-table-column>
      <el-table-column
        prop="trade_quantity"
        :label="$t('message.statistics_quantity_sb')"
        align="right"
        width="110"
      >
        <template #default="scope">
          {{ scope.row.trade_quantity.toLocaleString('ru') }}
        </template>
      </el-table-column>
      <el-table-column
        prop="trade_value"
        :label="$t('message.statistics_vol_trading')"
        align="right"
        min-width="150"
      >
        <template #default="scope">
          {{ scope.row.trading_value.toLocaleString('ru') }}
        </template>
      </el-table-column>
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
  import { ref, onMounted, computed } from 'vue'
  import axios from 'axios'
  import { ElNotification } from 'element-plus'
  import { Search } from '@element-plus/icons-vue'
  import moment from 'moment/moment'
  import http from '@/http'

  const tradeData = ref([])
  const loading = ref(false)
  const currentPage = ref(1)
  const totalPages = ref(null)
  const pageSize = 20
  const total = ref(null)
  const factSearchInput = ref('')

  const timeOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // Use 24-hour format
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

  const startDate = ref(new Date(new Date().setDate(new Date().getDate() - 1)))
  const endDate = ref(new Date())
  const pickerOptions = {
    disabledDate(time) {
      return time.getTime() > Date.now()
    },
  }
  const mktId = ref('')

  const mktIdOptions = [
    { label: 'all', value: 'ALL' },
    { label: 'STK', value: 'STK' },
    { label: 'BND', value: 'BND' },
    { label: 'RPO', value: 'RPO' },
  ]

  // const  selectedUrl = ref('Option1')
  const dateValue = ref(null)
  const selectedUrl = computed(() => {
    return `iuzse/trade-results/?${startDate?.value ? `&start_date=${moment(startDate?.value).format('YYYY-MM-DD')}` : ''}${endDate?.value ? `&end_date=${moment(endDate?.value).format('YYYY-MM-DD')}` : ''}`
  })

  const url = import.meta.env.VITE_APP_SERVER_URL
  const value = ref('Option1')

  const getTradeResults = () => {
    loading.value = true
    http
      .get(`${url}/${selectedUrl.value}`, {
        params: {
          page_size: '40',
          page: currentPage.value,
          mkt_id: mktId.value,
          isu_cd: factSearchInput.value,
        },
      })
      .then((response) => {
        if (value.value === 'Option1') {
          tradeData.value = response.data.results
          totalPages.value = response.data?.total_pages
          total.value = response.data.count
        } else {
          tradeDataOtc.value = response.data.results
          totalPages.value = response.data?.total_pages
          total.value = response.data.count
        }
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

  const clearFields = () => {
    factSearchInput.value = ''
    startDate.value = null
    endDate.value = null
    selectValue.value = options[0].value
  }

  const handleCurrentChange = (val) => {
    currentPage.value = val
    getTradeResults()
  }

  const getInfoByLang = (stockType) => {
    switch (stockType) {
      case '01':
        return 'Простые акции'
      case '02':
        return 'Прив акции'
      case '':
        return 'Облигации'
      default:
        return '-'
    }
  }

  onMounted(() => {
    getTradeResults()
  })
</script>

<style scoped>
  .trading {
    min-height: 100vh;
    padding-bottom: 20px;
    display: flex;
    height: 100%;
    flex-direction: column;
    width: 100%;
    margin: 0;
  }

  th,
  td {
    padding: inherit !important;
    text-align: left;
    vertical-align: top;
    border-left: 1px solid transparent !important;
  }
</style>
