<template>
  <div v-loading="loading" class="table-white-header">
    <div class="search-bar mt-0">
      <el-select
        v-model="mktId"
        class=""
        clearable
        :placeholder="t('message.type')"
      >
        <el-option
          v-for="item in mktIdOptions"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        />
      </el-select>
      <el-date-picker
        v-model="startDate"
        type="date"
        format="YYYY-MM-DD"
        :placeholder="t('message.start_date')"
        :shortcuts="shortcuts"
        :picker-options="pickerOptions"
        style="min-width: 400px"
      />
      <el-date-picker
        v-model="endDate"
        type="date"
        format="YYYY-MM-DD"
        :placeholder="t('message.end_date')"
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
        {{ t('message.Search') }}
      </el-button>
      <el-button color="red" style="margin: 0" @click="clearFields">
        {{ t('message.Clear') }}</el-button
      >
      <a
        style="background: #059b39"
        target="_blank"
        :href="`${url}/iuzse/otc-trade-results/?download=excel${factSearchInput ? `&isu_cd=${factSearchInput}` : ''}${startDate ? `&start_date=${moment(startDate).format('YYYY-MM-DD')}` : ''}${endDate ? `&end_date=${moment(endDate).format('YYYY-MM-DD')}` : ''}`"
        class="el-button el-button--success d-flex align-items-center justify-content-center gap-2"
      >
        <img src="../../assets/images/icons/Vector.svg" alt="excel-icon" />
        <span> Excel</span>
      </a>
    </div>
    <el-table
      v-if="tradeDataOtc.length"
      v-loading="loading"
      :data="tradeDataOtc"
      style="width: 100%"
      element-loading-background="rgba(0, 0, 0, 0.4)"
      empty-text="Malumotlar Topilmadi"
      :header-cell-style="
        () => ({
          textTransform: 'lowercase',
        })
      "
    >
      <el-table-column
        prop="emitent"
        align="left"
        :label="t('message.trade.organization')"
        min-width="300"
      >
        <template #default="scope">
          <p style="color: #1256a0">
            {{ scope.row.emitent }}
          </p>
        </template>
      </el-table-column>

      <el-table-column
        prop="trade_datetime"
        :label="t('message.statistics_date')"
        min-width="160"
        align="right"
      >
        <template #default="scope">
          {{
            new Date(scope.row?.trade_time)
              ?.toLocaleDateString('ru-RU', timeOptions)
              ?.replace(',', ' | ')
          }}
        </template>
      </el-table-column>

      <el-table-column
        prop="stock"
        :label="t('message.statistics_isin')"
        align="right"
        width="200"
      />

      <el-table-column
        prop="price"
        :label="t('message.statistics_torg_tsena')"
        align="right"
        min-width="151"
      >
        <template #default="scope">
          {{ (+scope.row.price)?.toLocaleString('ru') }}
        </template>
      </el-table-column>
      <el-table-column
        prop="quantity"
        :label="t('message.statistics_quantity_sb')"
        align="right"
        width="110"
      />
      <el-table-column
        prop="volume"
        :label="t('message.statistics_vol_trading')"
        align="right"
        min-width="150"
      >
        <template #default="scope">
          {{ scope.row.volume?.toLocaleString('ru') }}
        </template>
      </el-table-column>
      <!--      </el-table-column>-->
    </el-table>

    <div class="pagination d-flex justify-content-center mt-4 mb-4">
      <el-pagination
        :current-page="currentPage"
        :page-count="totalPages"
        :total="total"
        hide-on-single-page
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
  import { useI18n } from 'vue-i18n'

  const tradeData = ref([])
  const tradeDataOtc = ref([])
  const loading = ref(false)
  const currentPage = ref(1)
  const totalPages = ref(null)
  const total = ref(null)
  const factSearchInput = ref('')

  const { t } = useI18n()
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

  const startDate = ref()
  const endDate = ref()
  const pickerOptions = {
    disabledDate(time) {
      return time.getTime() > Date.now()
    },
  }

  const mktId = ref('')

  const mktIdOptions = [
    { label: 'SMB', value: 'SMB' },
    { label: 'SMS', value: 'SMS' },
  ]

  const url = import.meta.env.VITE_APP_SERVER_URL
  const value = ref('Option1')

  const getTradeResults = () => {
    loading.value = true

    const params = {
      page_size: '40',
      page: currentPage.value,
    }

    if (mktId.value) {
      params.mkt_id = mktId.value
    }
    if (startDate.value) {
      params.start_date = moment(startDate?.value).format('YYYY-MM-DD')
    }
    if (endDate.value) {
      params.end_date = moment(endDate?.value).format('YYYY-MM-DD')
    }

    if (factSearchInput.value) {
      params.isu_cd = factSearchInput.value
    }

    http
      .get(`iuzse/otc-trade-results/`, { params })
      .then((response) => {
        tradeDataOtc.value = response.data.results
        totalPages.value = response.data?.total_pages
        total.value = response.data.count
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
    mktId.value = null
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
  /*.trade .el-table {*/
  /*  border-radius: 10px!important;*/
  /*}*/

  .trading {
    min-height: 100vh;
    padding-bottom: 20px;
    display: flex;
    height: 100%;
    flex-direction: column;
    width: 100%;
    margin: 0;
  }

  /* #040b50 #040b4ef7  #414243  */
  /*background: linear-gradient(43deg, #4158D0 0%, #C850C0 100%, #ffcc70 100%);*/
</style>
