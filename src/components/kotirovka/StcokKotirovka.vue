<template>
  <div v-loading="loading" class="trade">
    <el-empty
      v-if="!tableData.length"
      :description="$t('message.trade.emptyText')"
    >
    </el-empty>
    <el-table
      v-if="tableData.length"
      :data="tableData"
      style="width: 100%"
      element-loading-background="rgba(0, 0, 0, 0.4)"
      :empty-text="$t('message.trade.emptyText')"
    >
      <el-table-column
        prop="issuer_short_name"
        :label="$t('message.trade.organization')"
        :min-width="columnWidths.organization"
        align="left"
      >
        <template #default="scope">
          <p style="color: #1256a0">
            {{ scope.row.issuer_short_name }}
          </p>
        </template>
      </el-table-column>

      <el-table-column prop="ticker" align="right">
        <template #default="scope">
          <el-tag>{{ scope.row.ticker }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="trade_price"
        align="right"
        :label="$t('message.kotirovka.trade_price')"
      >
        <template #default="scope">
          {{ scope.row?.trade_price?.toLocaleString('ru') }}
        </template>
      </el-table-column>
      <el-table-column
        prop="high_price"
        align="right"
        :label="$t('message.kotirovka.high_price')"
      >
        <template #default="scope">
          {{ scope.row?.high_price?.toLocaleString('ru') }}
        </template>
      </el-table-column>
      <el-table-column
        prop="low_price"
        align="right"
        :label="$t('message.kotirovka.low_price')"
      >
        <template #default="scope">
          {{ scope.row?.low_price?.toLocaleString('ru') }}
        </template>
      </el-table-column>
      <el-table-column
        prop="change"
        :label="$t('message.kotirovka.change')"
        align="right"
      >
        <template #default="scope">
          <p
            class="fw-medium"
            :style="{ color: scope.row.change < 0 ? 'red' : 'green' }"
          >
            {{ financial(scope.row.change) }}
          </p>
        </template>
      </el-table-column>
      <el-table-column
        prop="change_percent"
        align="right"
        :label="$t('message.kotirovka.change_percent')"
      >
        <template #default="scope">
          <p
            :style="{ color: scope.row.change_percent < 0 ? 'red' : 'green' }"
            class="fw-medium"
          >
            {{ financial(scope.row.change_percent) }} %
          </p>
        </template>
      </el-table-column>
      <el-table-column
        prop="trade_quantity"
        align="right"
        :label="$t('message.kotirovka.trade_quantity')"
      >
        <template #default="scope">
          <p>{{ scope.row.trade_quantity.toLocaleString('ru') }}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="trade_volume"
        :label="$t('message.kotirovka.trade_volume')"
        min-width="90px"
        align="right"
      >
        <template #default="scope">
          {{ scope.row?.trade_volume?.toLocaleString('ru') }}
        </template>
      </el-table-column>

      <el-table-column
        prop="decision_date"
        :label="DateToday"
        align="right"
        min-width="60px"
      >
        <template #default="scope">
          <p class="d-flex align-items-center justify-content-center gap-1">
            {{ moment(scope.row.trade_datetime).format('HH:mm') }}
            <el-icon><Clock /></el-icon>
          </p>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination d-flex gap-4 justify-content-center mt-5 mb-5">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :background="true"
        layout="prev, pager, next"
        :total="total"
        @current-change="handelCurrentPage"
      />
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import moment from 'moment'
  import axios from 'axios'
  const tableHeight = ref('auto')
  import http from '@/http/index.js'
  import { Clock, View, Search } from '@element-plus/icons-vue'
  import { useRouter } from 'vue-router'
  import { financial } from './utills'

  const DateToday = moment().format('DD/MM')

  const { t, locale } = useI18n()
  const columnWidths = ref({
    organization: '200px',
    start: '110px',
    end: '110px',
    amount: '110px',
    percentage: '110px',
    typeOfShare: '160px',
    decisionDate: '120px',
  })

  const totalPages = ref(null)
  const total = ref(null)
  const loading = ref(false)
  const tableData = ref([])
  const currentPage = ref(1)
  const router = useRouter()
  const dropdownLabel = ref(t('message.trade.ordinaryShare'))
  const factSearchInput = ref('')
  const activeSort = ref('')
  const url = import.meta.env.VITE_APP_SERVER_URL

  const props = defineProps({
    pageSize: {
      type: Number,
      default: 10, // Default to 10 if not provided
    },
    searchInput: {
      type: String,
      default: '',
    },
  })

  const fetchTradeData = async (
    stockType = 'simple',
    sortingOrder = '',
    pageSize,
  ) => {
    loading.value = true
    try {
      const response = await http.get(`iuzse/stock-screener/?mkt_id=STK`, {
        params: {
          stock_type: activeFilter.value,
          page: currentPage.value,
          search: factSearchInput.value,
          ordering: sortingOrder,
          page_size: props.pageSize,
        },
      })
      totalPages.value = response.data.total_pages
      total.value = response.data.count
      tableData.value = response.data.results
    } catch (error) {
      console.error('Error fetching trade data:', error)
    } finally {
      loading.value = false
    }
  }

  const sortData = (direction) => {
    const sortField =
      activeFilter.value === 'simple'
        ? 'common_share_amount'
        : activeFilter.value === 'privileged'
          ? 'priviliged_share_amount'
          : 'bond_amount'
    const order = direction === 'asc' ? sortField : `-${sortField}`
    activeSort.value = direction
    fetchTradeData(activeFilter.value, order)
  }

  const clearFields = () => {
    factSearchInput.value = ''
    activeFilter.value = 'simple'
    fetchTradeData(activeFilter.value)
  }

  watch(
    () => props.searchInput,
    (newVal) => {
      factSearchInput.value = newVal
      fetchTradeData(activeFilter.value)
    },
  )

  const activeFilter = ref('simple') // To track the active filter button

  // Filters data
  const filters = [
    { label: 'ordinaryShare', value: 'simple' },
    { label: 'preferredShare', value: 'privileged' },
    { label: 'bond', value: 'bond' },
  ]

  // Method to apply the filter
  const applyFilter = (filterValue) => {
    activeFilter.value = filterValue
    fetchTradeData(activeFilter.value)
  }

  const suggestionsList = ref([])
  const querySearch = (queryString, cb) => {
    axios
      .get(`${url}/home/autofill/?name=${queryString}`)
      .then((response) => {
        suggestionsList.value = response.data
        cb(suggestionsList.value)
      })
      .catch((err) => {
        console.log(err, 'error')
      })
  }

  watch(locale, () => {
    dropdownLabel.value = t('message.trade.' + activeFilter.value)
    fetchTradeData(activeFilter.value)
  })

  const updateColumnWidths = () => {
    const screenWidth = window.innerWidth
    if (screenWidth < 768) {
      columnWidths.value = {
        organization: '100px',
        start: '80px',
        end: '80px',
        amount: '70px',
        percentage: '70px',
        typeOfShare: '130px',
        decisionDate: '90px',
      }
      tableHeight.value = 'auto'
    } else if (screenWidth < 1200) {
      columnWidths.value = {
        organization: '120px',
        start: '100px',
        end: '100px',
        amount: '90px',
        percentage: '90px',
        typeOfShare: '140px',
        decisionDate: '110px',
      }
    } else {
      columnWidths.value = {
        organization: '200px',
        start: '110px',
        end: '110px',
        amount: '110px',
        percentage: '100px',
        typeOfShare: '170px',
        decisionDate: '120px',
      }
      tableHeight.value = '800px'
    }
  }

  window.addEventListener('resize', updateColumnWidths)

  // Pagination handler
  const handelCurrentPage = (page) => {
    currentPage.value = page
    updateColumnWidths()
    fetchTradeData(activeFilter.value)
  }

  // New Method: Trigger search
  const makeSearch = () => {
    fetchTradeData(activeFilter.value)
  }

  // const handelCurrentPage = (page) => {
  //   currentPage.value = page
  //   fetchTradeData(selectedStockType.value)
  // }

  onMounted(() => {
    fetchTradeData(activeFilter.value)
  })
</script>

<style scoped>
  .sort-icons .el-icon {
    cursor: pointer;
    margin-right: 0;
    margin-left: 0;
    transition: color 0.3s;
    font-size: 18px;
    font-weight: 900;
  }

  .sort-icons .el-icon.active {
    color: #24e48a;
  }

  .sort-icons .el-icon.hover {
    color: #1256a0;
  }

  .pagination {
    margin-top: 20px;
  }

  .filter-buttons {
    display: flex;
    align-items: center;
  }

  .is-active {
    background-color: #dceeff; /* Active button color (Element Plus default blue) */
    color: #1256a0;
    border: 1px solid #dceeff;
  }
</style>

<style>
  .trade .el-table th.el-table__cell {
    background: #fff;
    color: #262829;
    font-weight: 600;
  }

  .trade .el-table {
  }

  .border-radius .el-input__wrapper {
    border-radius: 25px;
  }
</style>
