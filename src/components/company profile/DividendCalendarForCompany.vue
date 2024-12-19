<template>
  <div class="header-container">
    <a
      v-if="tradeData.length"
      :href="`${url}/disclosure/dividend-calendar/download-excel/?stock_type=${selectedStockType}&organization_id=${id}`"
      class="d-flex gap-2 bg-white el-button"
      download
      target="_blank"
      style="border-radius: 6px; color: #1256a0 !important"
    >
      {{ $t('message.Download') }}
      <img
        style="width: 18px"
        src="/src/assets/images/icons/excel-icon2.svg"
        alt="pdfIcon"
      />
    </a>
    <p class="header-title">{{ $t('message.trade.dividends_calendar') }}</p>
    <el-dropdown class="dropdown" @command="handleCommand">
      <span class="el-dropdown-link">
        {{ dropdownLabel }}
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="simple">{{
            $t('message.trade.ordinaryShare')
          }}</el-dropdown-item>
          <el-dropdown-item command="privileged">{{
            $t('message.trade.preferredShare')
          }}</el-dropdown-item>
          <el-dropdown-item command="bond">{{
            $t('message.trade.bond')
          }}</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>

  <div v-loading="loading" class="trade">
    <el-empty
      v-if="!tradeData.length"
      :description="$t('message.trade.emptyText')"
    >
    </el-empty>

    <el-table
      v-if="tradeData.length"
      stripe
      border
      :data="tradeData"
      style="width: 100%"
      element-loading-background="rgba(0, 0, 0, 0.4)"
      :header-cell-style="{
        color: '#fff',
        'text-transform': 'uppercase',
      }"
      :empty-text="$t('message.trade.emptyText')"
    >
      <el-table-column
        prop="decision_date"
        :label="$t('message.trade.decisionDate')"
        align="center"
        :min-width="columnWidths.decisionDate"
      >
        <template #default="scope">
          {{ moment(scope.row.decision_date).format('DD.MM.YYYY') }}
        </template>
      </el-table-column>
      <el-table-column
        prop="amount"
        :label="$t('message.trade.amount')"
        align="center"
        :min-width="columnWidths.amount"
      />
      <el-table-column
        prop="percentage"
        :label="$t('message.trade.percentage')"
        align="center"
        :min-width="columnWidths.percentage"
      />
      <el-table-column
        prop="start"
        :label="$t('message.trade.start')"
        align="center"
        :min-width="columnWidths.start"
      >
        <template #default="scope">
          {{ moment(scope.row.start).format('DD.MM.YYYY') }}
        </template>
      </el-table-column>
      <el-table-column
        prop="end"
        :label="$t('message.trade.end')"
        align="center"
        :min-width="columnWidths.end"
      >
        <template #default="scope">
          {{ moment(scope.row.end).format('DD.MM.YYYY') }}
        </template>
      </el-table-column>
      <el-table-column prop="organization" :label="' '" align="center">
        <template #default="scope">
          <a :href="scope.row.link" target="_blank">
            {{ $t('message.more') }}
          </a>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination d-flex justify-content-center mt-4">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="10"
        :background="true"
        layout="prev, pager, next"
        :total="total"
        @current-change="handelCurrentPage"
      />
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, watch, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import moment from 'moment'
  import http from '@/http/index.js'
  import { ArrowDown } from '@element-plus/icons-vue'
  import { useRoute } from 'vue-router'
  import axios from 'axios'
  import { ElNotification } from 'element-plus'

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
  const tradeData = ref([])
  const tableHeight = ref('auto')
  const selectedStockType = ref('simple')
  const dropdownLabel = ref(t('message.trade.ordinaryShare'))
  const dataTrade = ref([])
  const currentPage = ref(1)
  const route = useRoute()
  const id = computed(() => route.params.id)
  const url = import.meta.env.VITE_APP_SERVER_URL
  const fetchTradeData = async (stockType = 'simple') => {
    loading.value = true
    try {
      const response = await http.get(
        `/disclosure/dividend-calendar/?stock_type=${stockType}&page=${currentPage.value}&organization_id=${id.value}`,
      )

      totalPages.value = response.data.total_pages
      total.value = response.data.count
      tradeData.value = response.data.results.map((item) => {
        let mappedData = {
          organization: item.organization || 'N/A',
          decision_date: item.decision_date || 'N/A',
          link: item.link,
        }

        if (stockType === 'simple') {
          mappedData.start = item.common_share_start_date || 'N/A'
          mappedData.end = item.common_share_end_date || 'N/A'
          mappedData.amount = item.common_share_amount || 'N/A'
          mappedData.percentage = item.common_share_percent || 'N/A'
        } else if (stockType === 'privileged') {
          mappedData.start = item.priviliged_share_start_date || 'N/A'
          mappedData.end = item.priviliged_share_end_date || 'N/A'
          mappedData.amount = item.priviliged_share_amount || 'N/A'
          mappedData.percentage = item.priviliged_share_percent || 'N/A'
        } else if (stockType === 'bond') {
          mappedData.start = item.bond_start_date || 'N/A'
          mappedData.end = item.bond_end_date || 'N/A'
          mappedData.amount = item.bond_amount || 'N/A'
          mappedData.percentage = item.bond_percent || 'N/A'
        }

        return mappedData
      })
    } catch (error) {
      console.error('Error fetching trade data:', error)
    } finally {
      loading.value = false
    }
  }

  const selectDefaultShare = () => {
    loading.value = true
    http
      .get(
        `/disclosure/dividend-calendar/count-shares/?organization_id=${id.value}`,
        {},
      )
      .then((response) => {
        if (response.data.default_share) {
          handleCommand(response.data.default_share)
        }
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

  const handleCommand = (command) => {
    selectedStockType.value = command
    dropdownLabel.value = t('message.trade.' + command)
    fetchTradeData(command)
  }

  watch(locale, () => {
    dropdownLabel.value = t('message.trade.' + selectedStockType.value)
    fetchTradeData(selectedStockType.value)
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

  const handelCurrentPage = (page) => {
    currentPage.value = page
    updateColumnWidths()
    fetchTradeData()
  }

  onMounted(() => {
    selectDefaultShare()
    updateColumnWidths()
    fetchTradeData()
  })
</script>

<style scoped>
  .trade {
    max-width: 100%;
    width: 100%;
    padding-bottom: 20px;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    .trade {
      max-width: 100%;
      padding: 0 10px;
    }
  }

  th,
  td {
    padding: inherit !important;
    text-align: left;
    vertical-align: top;
    border-left: 1px solid transparent !important;
  }

  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #124483;
    padding: 0 20px;
    height: 50px;
    color: #fff;
    border-radius: 10px 10px 0 0;
    position: relative;
  }

  .header-title {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    text-transform: uppercase;
    font-size: 14px;
  }

  .dropdown {
    margin-left: auto;
    cursor: pointer;
    display: flex;
    align-items: center;
  }
</style>
