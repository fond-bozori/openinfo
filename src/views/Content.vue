<template>
  <div class="calendar">
    <el-tabs
      v-model="activeName"
      class="demo-tabs m-0 p-0"
      @tab-click="handleClick"
    >
      <el-tab-pane :label="$t('message.listed')" name="listed">
        <TransactionListing />
      </el-tab-pane>

      <el-tab-pane :label="$t('message.unlisted')" name="unlisted">
        <TransactionNonListing />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('message.kotirovka.quotes_title')"
        name="kotirovka"
      >
        <KotirovkaInTransaction />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('message.kotirovka.unlisted_quotes_title')"
        name="unlisted-kotirovka"
      >
        <UnlistedKotirovkaInTransactions />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import TransactionListing from '@/components/transaction-results/TransactionListing.vue'
  import TransactionNonListing from '@/components/transaction-results/TransactionNonListing.vue'

  const activeName = ref('listed')
</script>

<style>
  .calendar .el-tabs__header .el-tabs__item.is-active {
    color: #1256a0;
  }
</style>

<!--<template>-->
<!--  <div v-loading="loading" class="trading">-->
<!--    <div class="search-bar mt-0">-->
<!--      <el-select-->
<!--        v-model="value"-->
<!--        class=""-->
<!--        placeholder="Select"-->
<!--        size="large"-->
<!--        @change="changeData"-->
<!--      >-->
<!--        <el-option-->
<!--          v-for="item in options"-->
<!--          :key="item.value"-->
<!--          :value="item.value"-->
<!--          :label="$t(`message.${item.label}`)"-->
<!--        />-->
<!--      </el-select>-->
<!--      <el-select-->
<!--        v-if="value === 'Option1'"-->
<!--        v-model="mktId"-->
<!--        class=""-->
<!--        :placeholder="$t('message.all')"-->
<!--        size="large"-->
<!--      >-->
<!--        <el-option-->
<!--          v-for="item in mktIdOptions"-->
<!--          :key="item.value"-->
<!--          :value="item.value"-->
<!--          :label="item.label"-->
<!--        />-->
<!--      </el-select>-->
<!--      <el-date-picker-->
<!--        v-if="value === 'Option1'"-->
<!--        v-model="startDate"-->
<!--        type="date"-->
<!--        format="YYYY-MM-DD"-->
<!--        :placeholder="$t('message.start_date')"-->
<!--        :shortcuts="shortcuts"-->
<!--        :picker-options="pickerOptions"-->
<!--        size="large"-->
<!--        style="width: 400px"-->
<!--      />-->
<!--      <el-date-picker-->
<!--        v-if="value === 'Option1'"-->
<!--        v-model="endDate"-->
<!--        type="date"-->
<!--        format="YYYY-MM-DD"-->
<!--        :placeholder="$t('message.end_date')"-->
<!--        :shortcuts="shortcuts"-->
<!--        :picker-options="pickerOptions"-->
<!--        size="large"-->
<!--        style="width: 400px"-->
<!--      />-->

<!--      <el-input-->
<!--        v-if="value === 'Option1'"-->
<!--        v-model="factSearchInput"-->
<!--        class="inline-input w-75"-->
<!--        :placeholder="$t('message.statistics_isin')"-->
<!--        size="large"-->
<!--        value-key="full_name_text"-->
<!--        clearable-->
<!--      />-->

<!--      <el-button-->
<!--        v-if="value === 'Option1'"-->
<!--        :icon="Search"-->
<!--        color="#124483"-->
<!--        size="large"-->
<!--        style="margin: 0"-->
<!--        type="success"-->
<!--        @click="getTradeResults"-->
<!--      >-->
<!--        {{ $t('message.Search') }}-->
<!--      </el-button>-->
<!--      <el-button-->
<!--        v-if="value === 'Option1'"-->
<!--        color="red"-->
<!--        size="large"-->
<!--        style="margin: 0"-->
<!--        @click="clearFields"-->
<!--      >-->
<!--        {{ $t('message.Clear') }}</el-button-->
<!--      >-->

<!--      <a-->
<!--        v-if="value === 'Option1'"-->
<!--        :href="`${url}/iuzse/export-excel/?isu_cd=${factSearchInput}${startDate ? `&start_date=${moment(startDate).format('YYYY-MM-DD')}` : ''}${endDate ? `&end_date=${moment(endDate).format('YYYY-MM-DD')}` : ''}`"-->
<!--        class="btn-primary d-flex align-items-center"-->
<!--        style="margin-left: 25px"-->
<!--        download-->
<!--      >-->
<!--        <img-->
<!--          style="width: 34px"-->
<!--          src="/src/assets/images/icons/excel-icon2.svg"-->
<!--          alt="pdfIcon"-->
<!--        />-->
<!--      </a>-->
<!--    </div>-->

<!--    <el-table-->
<!--      v-if="tradeData.length"-->
<!--      v-loading="loading"-->
<!--      stripe-->
<!--      border-->
<!--      :data="tradeData"-->
<!--      style="width: 100%"-->
<!--      height="800"-->
<!--      element-loading-background="rgba(0, 0, 0, 0.4)"-->
<!--      :header-cell-style="{-->
<!--        color: '#fff',-->
<!--        'text-transform': 'uppercase',-->
<!--        padding: '8px 0',-->
<!--      }"-->
<!--      empty-text="Malumotlar Topilmadi"-->
<!--    >-->
<!--      <el-table-column-->
<!--        prop="trade_date"-->
<!--        :label="$t('message.statistics_date')"-->
<!--        width="170"-->
<!--        align="center"-->
<!--      >-->
<!--        <template #default="scope">-->
<!--          {{-->
<!--            new Date(scope.row?.trade_datetime)-->
<!--              ?.toLocaleDateString('ru-RU', timeOptions)-->
<!--              ?.replace(',', ' | ')-->
<!--          }}-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="market_id"-->
<!--        :label="$t('message.statistics_market')"-->
<!--        align="center"-->
<!--        width="100"-->
<!--      />-->
<!--      <el-table-column-->
<!--        prop="board_id"-->
<!--        label="Площадка"-->
<!--        align="center"-->
<!--        width="110"-->
<!--      />-->

<!--      <el-table-column-->
<!--        prop="ticker"-->
<!--        width="100"-->
<!--        label="Ticker"-->
<!--        align="center"-->
<!--      />-->
<!--      <el-table-column-->
<!--        prop="isin_code"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        :label="$t('message.statistics_isin')"-->
<!--        width="150"-->
<!--      />-->

<!--      <el-table-column-->
<!--        prop="issuer_short_name"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        :label="$t('message.statistics_issuer')"-->
<!--        min-width="290"-->
<!--      />-->

<!--      <el-table-column-->
<!--        prop="stock_type"-->
<!--        label="Тип ценной бумаги"-->
<!--        min-width="120"-->
<!--        align="center"-->
<!--      >-->
<!--        <template #default="scope">-->
<!--          {{ getInfoByLang(scope.row.stock_type) }}-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      &lt;!&ndash;      <el-table-column label="Trade Info"  header-align="center" width="120">&ndash;&gt;-->

<!--      <el-table-column-->
<!--        prop="trade_price"-->
<!--        label="Торговая цена (UZS)"-->
<!--        align="center"-->
<!--        min-width="120"-->
<!--      >-->
<!--        <template #default="scope">-->
<!--          {{-->
<!--            (+scope.row.trade_price)-->
<!--              .toString()-->
<!--              .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')-->
<!--          }}-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="trade_quantity"-->
<!--        label="Кол-во ЦБ"-->
<!--        align="center"-->
<!--        width="110"-->
<!--      />-->
<!--      <el-table-column-->
<!--        prop="trade_value"-->
<!--        label="Объём торгов (UZS)"-->
<!--        align="center"-->
<!--        min-width="150"-->
<!--      >-->
<!--        <template #default="scope">-->
<!--          {{-->
<!--            (+scope.row.trading_value)-->
<!--              .toString()-->
<!--              .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')-->
<!--          }}-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      &lt;!&ndash;      </el-table-column>&ndash;&gt;-->
<!--    </el-table>-->

<!--    <el-table-->
<!--      v-if="tradeDataOtc.length"-->
<!--      v-loading="loading"-->
<!--      stripe-->
<!--      border-->
<!--      :data="tradeDataOtc"-->
<!--      style="width: 100%"-->
<!--      height="800"-->
<!--      element-loading-background="rgba(0, 0, 0, 0.4)"-->
<!--      :header-cell-style="{-->
<!--        color: '#fff',-->
<!--        'text-transform': 'uppercase',-->
<!--        padding: '8px 0',-->
<!--      }"-->
<!--      empty-text="Malumotlar Topilmadi"-->
<!--    >-->
<!--      <el-table-column-->
<!--        prop="trade_datetime"-->
<!--        :label="$t('message.statistics_date')"-->
<!--        min-width="160"-->
<!--        align="center"-->
<!--      >-->
<!--        <template #default="scope">-->
<!--          {{-->
<!--            new Date(scope.row?.trtime)-->
<!--              ?.toLocaleDateString('ru-RU', timeOptions)-->
<!--              ?.replace(',', ' | ')-->
<!--          }}-->
<!--        </template>-->
<!--      </el-table-column>-->

<!--      <el-table-column-->
<!--        prop="market"-->
<!--        :label="$t('message.statistics_market')"-->
<!--        align="center"-->
<!--        width="100"-->
<!--      />-->
<!--      <el-table-column-->
<!--        prop="board"-->
<!--        :label="$t('message.statistics_section')"-->
<!--        align="center"-->
<!--        width="110"-->
<!--      />-->
<!--      <el-table-column-->
<!--        prop="stock"-->
<!--        :label="$t('message.statistics_isin')"-->
<!--        align="center"-->
<!--        width="200"-->
<!--      />-->
<!--      <el-table-column-->
<!--        prop="emitent"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        :label="$t('message.statistics_issuer')"-->
<!--        min-width="290"-->
<!--      />-->

<!--      &lt;!&ndash;      <el-table-column label="Trade Info"  header-align="center" width="120">&ndash;&gt;-->

<!--      <el-table-column-->
<!--        prop="price"-->
<!--        :label="$t('message.statistics_torg_tsena')"-->
<!--        align="center"-->
<!--        min-width="151"-->
<!--      >-->
<!--        <template #default="scope">-->
<!--          {{-->
<!--            scope.row.price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')-->
<!--          }}-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="quantity"-->
<!--        :label="$t('message.statistics_quantity_sb')"-->
<!--        align="center"-->
<!--        width="110"-->
<!--      />-->
<!--      <el-table-column-->
<!--        prop="total_value"-->
<!--        :label="$t('message.statistics_vol_trading')"-->
<!--        align="center"-->
<!--        min-width="150"-->
<!--      >-->
<!--        <template #default="scope">-->
<!--          {{-->
<!--            (+scope.row.total_value)-->
<!--              ?.toString()-->
<!--              ?.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')-->
<!--          }}-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      &lt;!&ndash;      </el-table-column>&ndash;&gt;-->
<!--    </el-table>-->

<!--    <div class="pagination d-flex justify-content-center mt-4 mb-4">-->
<!--      <el-pagination-->
<!--        :current-page="currentPage"-->
<!--        :page-count="totalPages"-->
<!--        :total="total"-->
<!--        background-->
<!--        layout="prev, pager, next"-->
<!--        @current-change="handleCurrentChange"-->
<!--      />-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--<script setup>-->
<!--  import { ref, onMounted, computed } from 'vue'-->
<!--  import axios from 'axios'-->
<!--  import { ElNotification } from 'element-plus'-->
<!--  import { Search } from '@element-plus/icons-vue'-->
<!--  import moment from 'moment/moment'-->

<!--  const tradeData = ref([])-->
<!--  const tradeDataOtc = ref([])-->
<!--  const loading = ref(false)-->
<!--  const currentPage = ref(1)-->
<!--  const totalPages = ref(null)-->
<!--  const pageSize = 20-->
<!--  const total = ref(null)-->
<!--  const factSearchInput = ref('')-->

<!--  const timeOptions = {-->
<!--    year: 'numeric',-->
<!--    month: '2-digit',-->
<!--    day: '2-digit',-->
<!--    hour: '2-digit',-->
<!--    minute: '2-digit',-->
<!--    second: '2-digit',-->
<!--    hour12: false, // Use 24-hour format-->
<!--  }-->

<!--  const shortcuts = [-->
<!--    {-->
<!--      text: 'Today',-->
<!--      value: new Date(),-->
<!--    },-->
<!--    {-->
<!--      text: 'Yesterday',-->
<!--      value: () => {-->
<!--        const date = new Date()-->
<!--        date.setTime(date.getTime() - 3600 * 1000 * 24)-->
<!--        return date-->
<!--      },-->
<!--    },-->
<!--    {-->
<!--      text: 'A week ago',-->
<!--      value: () => {-->
<!--        const date = new Date()-->
<!--        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)-->
<!--        return date-->
<!--      },-->
<!--    },-->
<!--  ]-->

<!--  const startDate = ref(new Date(new Date().setDate(new Date().getDate() - 1)))-->
<!--  const endDate = ref(new Date())-->
<!--  const pickerOptions = {-->
<!--    disabledDate(time) {-->
<!--      return time.getTime() > Date.now()-->
<!--    },-->
<!--  }-->
<!--  const mktId = ref('')-->

<!--  const mktIdOptions = [-->
<!--    { label: 'ALL', value: 'ALL' },-->
<!--    { label: 'STK', value: 'STK' },-->
<!--    { label: 'BND', value: 'BND' },-->
<!--    { label: 'RPO', value: 'RPO' },-->
<!--    { label: 'FCT', value: 'FCT' },-->
<!--  ]-->

<!--  // const  selectedUrl = ref('Option1')-->
<!--  const dateValue = ref(null)-->
<!--  const selectedUrl = computed(() => {-->
<!--    return value.value === 'Option1'-->
<!--      ? `iuzse/trade-results/?page=${currentPage.value}&page_size=${pageSize}&mkt_id=${mktId.value}${startDate?.value ? `&start_date=${moment(startDate?.value).format('YYYY-MM-DD')}` : ''}${endDate?.value ? `&end_date=${moment(endDate?.value).format('YYYY-MM-DD')}` : ''}${factSearchInput.value ? '&isu_cd=' + factSearchInput.value : ''}`-->
<!--      : `home/trade-results-otc/?page_size=${pageSize}&page=${currentPage.value}`-->
<!--  })-->

<!--  const changeData = () => {-->
<!--    currentPage.value = 1-->
<!--    loading.value = true-->
<!--    if (value.value === 'Option1') {-->
<!--      tradeDataOtc.value = []-->
<!--      getTradeResults()-->
<!--    } else {-->
<!--      tradeData.value = []-->
<!--      getTradeResults()-->
<!--    }-->
<!--    // console.log(document.getElementById("chart"))-->
<!--    // loading.value = false-->
<!--  }-->

<!--  const url = import.meta.env.VITE_APP_SERVER_URL-->
<!--  const value = ref('Option1')-->

<!--  const options = [-->
<!--    {-->
<!--      value: 'Option1',-->
<!--      label: 'listed',-->
<!--    },-->
<!--    {-->
<!--      value: 'Option2',-->
<!--      label: 'unlisted',-->
<!--    },-->
<!--  ]-->

<!--  const getTradeResults = () => {-->
<!--    loading.value = true-->
<!--    axios-->
<!--      .get(`${url}/${selectedUrl.value}`, {-->
<!--        method: 'get',-->
<!--      })-->
<!--      .then((response) => {-->
<!--        if (value.value === 'Option1') {-->
<!--          tradeData.value = response.data.results-->
<!--          totalPages.value = response.data?.total_pages-->
<!--          total.value = response.data.count-->
<!--        } else {-->
<!--          tradeDataOtc.value = response.data.results-->
<!--          totalPages.value = response.data?.total_pages-->
<!--          total.value = response.data.count-->
<!--        }-->
<!--      })-->
<!--      .catch(({ response }) => {-->
<!--        ElNotification({-->
<!--          type: 'error',-->
<!--          message: response.data.message || 'Malumot olishda xatolik bor!',-->
<!--        })-->
<!--      })-->
<!--      .finally(() => {-->
<!--        loading.value = false-->
<!--      })-->
<!--  }-->

<!--  const clearFields = () => {-->
<!--    factSearchInput.value = ''-->
<!--    startDate.value = null-->
<!--    endDate.value = null-->
<!--    selectValue.value = options[0].value-->
<!--  }-->

<!--  const handleCurrentChange = (val) => {-->
<!--    currentPage.value = val-->
<!--    getTradeResults()-->
<!--  }-->

<!--  const getInfoByLang = (stockType) => {-->
<!--    switch (stockType) {-->
<!--      case '01':-->
<!--        return 'Простые акции'-->
<!--      case '02':-->
<!--        return 'Прив акции'-->
<!--      case '':-->
<!--        return 'Облигации'-->
<!--      default:-->
<!--        return '-'-->
<!--    }-->
<!--  }-->

<!--  onMounted(() => {-->
<!--    getTradeResults()-->
<!--  })-->
<!--</script>-->

<!--<style scoped>-->
<!--  /*.trade .el-table {*/-->
<!--  /*  border-radius: 10px!important;*/-->
<!--  /*}*/-->

<!--  .trading {-->
<!--    min-height: 100vh;-->
<!--    padding-bottom: 20px;-->
<!--    display: flex;-->
<!--    height: 100%;-->
<!--    flex-direction: column;-->
<!--    width: 100%;-->
<!--    margin: 0;-->
<!--  }-->

<!--  th,-->
<!--  td {-->
<!--    padding: inherit !important;-->
<!--    text-align: left;-->
<!--    vertical-align: top;-->
<!--    border-left: 1px solid transparent !important;-->
<!--  }-->
<!--  /* #040b50 #040b4ef7  #414243  */-->
<!--  /*background: linear-gradient(43deg, #4158D0 0%, #C850C0 100%, #ffcc70 100%);*/-->
<!--</style>-->
