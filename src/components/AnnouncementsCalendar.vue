<template>
  <div class="d-flex align-items-center gap-2 mb-3">
    <el-autocomplete
      v-model="factSearchInput"
      :fetch-suggestions="querySearch"
      :placeholder="$t('message.placeholder_for_search')"
      :trigger-on-focus="false"
      class="inline-input border-radius"
      clearable
      value-key="full_name_text"
      @clear="makeSearch"
      @select="makeSearch"
    >
      <template #suffix>
        <el-icon class="el-input__icon">
          <Search />
        </el-icon>
      </template>
    </el-autocomplete>

    <!--    <a-->
    <!--      v-if="tradeData.length"-->
    <!--      :href="`${url}/disclosure/dividend-calendar/download-excel/?stock_type=${activeFilter}&search=${factSearchInput}`"-->
    <!--      class="d-flex gap-2 bg-white el-button"-->
    <!--      download-->
    <!--      target="_blank"-->
    <!--      style="border-radius: 20px"-->
    <!--    >-->
    <!--      {{ $t('message.Download') }}-->
    <!--      <img-->
    <!--        style="width: 18px"-->
    <!--        src="/src/assets/images/icons/excel-icon2.svg"-->
    <!--        alt="pdfIcon"-->
    <!--      />-->
    <!--    </a>-->
    <!--    <el-button-->
    <!--      size="large"-->
    <!--      style="background-color: #124483; color: #ffffff; padding: 10px"-->
    <!--      @click="makeSearch"-->
    <!--    >-->
    <!--      <el-icon size="17" style="vertical-align: middle">-->
    <!--        <Search />-->
    <!--      </el-icon>-->
    <!--      <span style="vertical-align: middle">{{ $t('message.Search') }}</span>-->
    <!--    </el-button>-->

    <!--    <el-button-->
    <!--      size="large"-->
    <!--      style="background-color: red; padding: 10px; color: #ffffff; margin: 0"-->
    <!--      type="danger"-->
    <!--      @click="clearFields"-->
    <!--    >-->
    <!--      <el-icon size="18" style="vertical-align: middle">-->
    <!--        <RefreshLeft />-->
    <!--      </el-icon>-->
    <!--      <span style="vertical-align: middle">{{ $t('message.Clear') }}</span>-->
    <!--    </el-button>-->
    <a class="bell_icon" @click="openSubscriptionDialog()">
      <el-icon size="25" color="#FF0000">
        <Bell />
      </el-icon>
    </a>
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
        prop="organization_name"
        :label="$t('message.trade.organization')"
        align="left"
        min-width="150"
      >
        <template #default="scope">
          <!--          <p-->
          <!--            style="color: #1256a0; cursor: pointer"-->
          <!--            @click="-->
          <!--              router.push({-->
          <!--                name: 'company-profile',-->
          <!--                params: { id: scope.row.organization_id },-->
          <!--              })-->
          <!--            "-->
          <!--          >-->
          <!--            {{ scope.row.organization_name }}-->
          <!--          </p>-->
          <a
            :href="`https://new.openinfo.uz/organizations/${scope.row.organization_id}`"
            target="_blank"
            style="color: #1256a0"
          >
            {{ scope.row.organization_name }}</a
          >
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        :label="$t('message.trade.title')"
        min-width="200"
      />

      <el-table-column
        prop="pub_date"
        :label="$t('message.trade.publishingDate')"
        align="right"
      >
        <template #default="scope">
          {{ moment(scope.row.pub_date).format('DD.MM.YYYY') }}
        </template>
      </el-table-column>
      <el-table-column
        prop="meeting_date"
        :label="$t('message.trade.meetingDate')"
        align="right"
      >
        <template #default="scope">
          {{
            scope.row.meeting_date
              ? moment(scope.row.meeting_date).format('DD.MM.YYYY')
              : '-'
          }}
        </template>
      </el-table-column>

      <el-table-column width="60" align="right">
        <template #default="scope">
          <p
            style="cursor: pointer; color: #1256a0"
            @click.prevent="navigateToAnnounce(scope.row.id)"
          >
            <el-icon size="16" color="#1256a0"> <View /> </el-icon>
          </p>
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
                scope.row.organization_name,
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
    <el-empty v-else :description="$t('message.trade.no_announcements')" />
    <div class="pagination d-flex justify-content-center mt-5">
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
  import axios from 'axios'
  import { Search, View, Bell } from '@element-plus/icons-vue'
  import { useRouter } from 'vue-router'
  import { ElMessageBox, ElNotification } from 'element-plus'

  const router = useRouter()
  const navigateToAnnounce = (id) => {
    router.push(`/announce/${id}`)
  }
  const { t } = useI18n()
  const factSearchInput = ref('')
  const tradeData = ref([])
  const loading = ref(false)
  const currentPage = ref(1)
  const total = ref(0)
  const pageSize = 10
  const url = import.meta.env.VITE_APP_SERVER_URL
  const startDate = ref()
  const endDate = ref()
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
        ? [`meeting_of_shareholders:${currentOrganizationId.value}`] // For specific organization
        : ['meeting_of_shareholders:all'] // For all organizations

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

  const fetchTradeData = async (searchParams = {}) => {
    loading.value = true
    try {
      const response = await http.get('/announcement/calendar/', {
        params: {
          page: currentPage.value,
          meeting_date__gte: startDate.value
            ? moment(startDate.value).format('YYYY-MM-DD')
            : null,
          meeting_date__lte: endDate.value
            ? moment(endDate.value).format('YYYY-MM-DD')
            : null,
          search: factSearchInput.value,
          ...searchParams,
        },
      })
      const { results, count } = response.data
      tradeData.value = results || []
      total.value = count
    } catch (error) {
      console.error('Error fetching trade data:', error)
      tradeData.value = []
    } finally {
      loading.value = false
    }
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

  const clearFields = () => {
    factSearchInput.value = ''
    fetchTradeData()
  }

  const makeSearch = () => {
    fetchTradeData()
  }

  const handelCurrentPage = (page) => {
    currentPage.value = page
    fetchTradeData()
  }

  onMounted(() => {
    fetchTradeData()
  })
</script>

<style scoped>
  .table-white-header {
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

  .no-announcements {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 50px;
    text-align: center;
    font-size: 16px;
  }
</style>
