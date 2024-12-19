<template>
  <div class="d-flex gap-2 align-items-center mb-3 justify-content-between">
    <div class="filter-buttons" style="margin-right: 50px">
      <el-button
        v-for="filter in filters"
        :key="filter.value"
        :class="{ 'is-active': activeFilter === filter.value }"
        round
        @click="applyFilter(filter.value)"
      >
        {{ t(`message.trade.${filter.label}`) }}
      </el-button>
    </div>
    <div class="d-flex gap-3">
      <el-autocomplete
        v-model="factSearchInput"
        :fetch-suggestions="querySearch"
        :placeholder="$t('message.placeholder_for_search')"
        :trigger-on-focus="false"
        class="inline-input w-100 border-radius"
        clearable
        value-key="full_name_text"
        :prefix="Search"
        @select="makeSearch"
        @clear="makeSearch"
      >
        <template #suffix>
          <el-icon class="el-input__icon">
            <Search />
          </el-icon>
        </template>
      </el-autocomplete>
      <a
        v-if="tradeData.length"
        :href="`${url}/disclosure/dividend-calendar/download-excel/?stock_type=${activeFilter}&search=${factSearchInput}`"
        class="d-flex gap-2 bg-white el-button"
        download
        target="_blank"
        style="border-radius: 20px; color: #1256a0 !important"
      >
        {{ $t('message.Download') }}
        <img
          style="width: 18px"
          src="/src/assets/images/icons/excel-icon2.svg"
          alt="pdfIcon"
        />
      </a>

      <a class="bell_icon" @click="openSubscriptionDialog()">
        <el-icon size="25" color="#FF0000">
          <Bell />
        </el-icon>
      </a>
    </div>
  </div>

  <div v-loading="loading" class="table-white-header">
    <el-empty
      v-if="!tradeData.length"
      :description="$t('message.trade.emptyText')"
    >
    </el-empty>
    <el-table
      v-if="tradeData.length"
      :data="tradeData"
      style="width: 100%"
      element-loading-background="rgba(0, 0, 0, 0.4)"
      :empty-text="$t('message.trade.emptyText')"
    >
      <el-table-column
        prop="organization"
        :label="$t('message.trade.organization')"
        :min-width="columnWidths.organization"
        align="left"
      >
        <template #default="scope">
          <a
            :href="`https://new.openinfo.uz/organizations/${scope.row.organization_id}`"
            target="_blank"
            style="color: #1256a0"
          >
            {{ scope.row.organization }}</a
          >
        </template>
      </el-table-column>
      <el-table-column
        prop="decision_date"
        :label="$t('message.trade.decisionDate')"
        align="right"
        :min-width="columnWidths.decisionDate"
      >
        <template #default="scope">
          {{ moment(scope.row.decision_date).format('DD.MM.YYYY') }}
        </template>
      </el-table-column>

      <el-table-column
        prop="amount"
        :label="$t('message.trade.amount')"
        align="right"
        :min-width="columnWidths.amount"
      >
      </el-table-column>
      <el-table-column
        prop="percentage"
        :label="$t('message.trade.percentage')"
        align="right"
        :min-width="columnWidths.percentage"
      />
      <el-table-column
        prop="start"
        :label="$t('message.trade.start')"
        align="right"
        :min-width="columnWidths.start"
      >
        <template #default="scope">
          {{
            scope.row.start
              ? moment(scope.row.start).format('DD.MM.YYYY ')
              : scope.row.start
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="end"
        :label="$t('message.trade.end')"
        align="right"
        :min-width="columnWidths.end"
      >
        <template #default="scope">
          {{ moment(scope.row.end).format('DD.MM.YYYY') }}
        </template>
      </el-table-column>
      <el-table-column width="40px">
        <template #default="scope">
          <a
            :href="scope.row.link"
            target="_blank"
            style="color: #1256a0 !important"
          >
            <el-icon size="16" color="#1256a0"> <View /> </el-icon
          ></a>
        </template>
      </el-table-column>
      <el-table-column width="40px">
        <template #default="scope">
          <a
            class="bell_icon"
            @click="
              openSubscriptionDialog(
                scope.row.organization_id,
                scope.row.ticker,
                scope.row.organization,
              )
            "
            style="color: #1256a0 !important"
          >
            <el-icon size="16" color="#1256a0"> <Bell /> </el-icon>
          </a>
          <!-- Dialog Modal -->
          <el-dialog
            v-model="dialogVisible"
            prop="organization"
            :title="dialogTitle"
            width="500"
            top="50vh"
            :before-close="handleClose"
          >
            <!-- Updated dialog content -->
            <span>{{ $t('message.please_enter_your_email') }}</span>
            <el-input
              v-model="email"
              placeholder="username@mailServer.domain"
              clearable
              class="mt-2 mb-4"
            />

            <!-- Dialog Footer Buttons -->
            <template #footer>
              <div class="dialog-footer">
                <el-button @click="clearEmail">{{
                  $t('message.Clear')
                }}</el-button>
                <el-button type="primary" @click="sendEmail">{{
                  $t('message.Send')
                }}</el-button>
              </div>
            </template>
          </el-dialog>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination d-flex gap-4 justify-content-center mt-5">
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
  import { ElMessageBox, ElNotification } from 'element-plus'
  import axios from 'axios'
  const tableHeight = ref('auto')
  import http from '@/http/index.js'
  import { Bell, View, Search } from '@element-plus/icons-vue'
  import { useRouter } from 'vue-router'

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
  const currentPage = ref(1)
  const router = useRouter()
  const dropdownLabel = ref(t('message.trade.ordinaryShare'))
  const factSearchInput = ref('')
  const activeSort = ref('')
  const url = import.meta.env.VITE_APP_SERVER_URL
  const dialogVisible = ref(false)
  const email = ref('')
  const currentTicker = ref('')
  const currentOrganizationId = ref('')
  const currentOrganizationName = ref('')

  const handleClose = (done) => {
    ElMessageBox.confirm(t('message.confirmCloseDialog'), '', {
      cancelButtonText: t('message.cancel'),
    })
      .then(() => {
        done()
      })
      .catch(() => {
        console.log(t('message.cancelAction'))
      })
  }

  // Computed property for dialog title
  const dialogTitle = computed(() => {
    return currentOrganizationId.value
      ? `${t('message.subscriptionTo')} ${currentOrganizationName.value} ${currentTicker.value}`
      : t('message.subscriptionToAll')
  })

  const fetchTradeData = async (stockType = 'simple', sortingOrder = '') => {
    loading.value = true
    try {
      const response = await http.get(`/disclosure/dividend-calendar/`, {
        params: {
          stock_type: activeFilter.value,
          page: currentPage.value,
          search: factSearchInput.value,
          ordering: sortingOrder,
        },
      })
      totalPages.value = response.data.total_pages
      total.value = response.data.count

      tradeData.value = response.data.results.map((item) => {
        let mappedData = {
          organization: item.organization || 'N/A',
          decision_date: item.decision_date || 'N/A',
          link: item.link,
          organization_id: item.organization_id,
        }

        if (stockType === 'simple') {
          mappedData.start = item.common_share_start_date || 'N/A'
          mappedData.end = item.common_share_end_date || 'N/A'
          mappedData.amount =
            item.common_share_amount.toLocaleString('ru-RU') || 'N/A'
          mappedData.percentage = item.common_share_percent || 'N/A'
        } else if (stockType === 'privileged') {
          mappedData.start = item.priviliged_share_start_date || 'N/A'
          mappedData.end = item.priviliged_share_end_date || 'N/A'
          mappedData.amount =
            item.priviliged_share_amount.toLocaleString('ru-RU') || 'N/A'
          mappedData.percentage = item.priviliged_share_percent || 'N/A'
        } else if (stockType === 'bond') {
          mappedData.start = item.bond_start_date || 'N/A'
          mappedData.end = item.bond_end_date || 'N/A'
          mappedData.amount = item.bond_amount.toLocaleString('ru-RU') || 'N/A'
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

  const clearEmail = () => {
    email.value = ''
  }

  const openSubscriptionDialog = (organizationId, ticker, organizationName) => {
    currentOrganizationId.value = organizationId || ''
    currentTicker.value = ticker || ''
    currentOrganizationName.value = organizationName || ''
    dialogVisible.value = true
  }

  const sendEmail = async () => {
    try {
      // Determine the listfield based on whether currentOrganizationId is set
      const listfield = currentOrganizationId.value
        ? [`fact32:${currentOrganizationId.value}`] // For specific organization
        : ['fact32:all'] // For all organizations

      const response = await axios.post(`${url}/userprofile/subscribe/`, {
        email: email.value,
        listfield: listfield, // Dynamic listfield based on condition
      })

      // Check response status and provide relevant notification
      if (response.status === 201) {
        // New subscription created
        ElNotification({
          title: t('message.notification.successTitle'),
          message: t('message.notification.successMessage'), // For new subscription
          type: 'success',
          duration: 2000,
        })
      } else if (response.status === 200) {
        // Subscription updated
        ElNotification({
          title: t('message.notification.successTitle'),
          message: t('message.notification.updateMessage'), // For updated subscription
          type: 'success',
          duration: 2000,
        })
      }
      // Close dialog on successful response
      dialogVisible.value = false
      email.value = '' // Clear email input
    } catch (error) {
      console.error('Subscription failed:', error)
      ElNotification({
        title: t('message.notification.errorTitle'),
        message: t('message.notification.errorMessage'),
        type: 'error',
        duration: 2000,
      })
    }
  }
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

  .bell_icon {
    align-items: center;
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
    background-color: #dceeff;
    color: #1256a0;
    border: 1px solid #dceeff;
  }
</style>

<style>
  .border-radius .el-input__wrapper {
    border-radius: 25px;
  }
</style>
