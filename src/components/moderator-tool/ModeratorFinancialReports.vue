<template>
  <div
    class="d-flex gap-3 mb-3 mt-3 align-items-center justify-content-between"
  >
    <el-autocomplete
      v-model="factSearchInput"
      :fetch-suggestions="querySearch"
      :placeholder="t('message.placeholder_for_search')"
      :trigger-on-focus="false"
      class="inline-input w-25 border-radius"
      clearable
      value-key="full_name_text"
    >
      <!--      <template #default="{ item }">-->
      <!--        <div class="suggestion-item">-->
      <!--          <img-->
      <!--            v-if="item.logo"-->
      <!--            :src="item.logo"-->
      <!--            alt="logo"-->
      <!--            class="autocomplete-logo"-->
      <!--          />-->
      <!--          <img-->
      <!--            v-if="!item.logo"-->
      <!--            src="../../assets/images/icons/company-blue.svg"-->
      <!--            alt="logo"-->
      <!--            class="autocomplete-logo"-->
      <!--          />-->
      <!--          <span>{{ item.full_name_text }}</span>-->
      <!--        </div>-->
      <!--      </template>-->
    </el-autocomplete>
    <el-date-picker
      v-model="selectedYear"
      type="year"
      :placeholder="t('message.pick a year')"
    />

    <el-radio-group v-model="report_type" class="d-flex flex-nowrap">
      <el-radio-button :label="t('message.quarterly')" value="quarterly" />
      <el-radio-button :label="t('message.annual')" value="annual" />
    </el-radio-group>

    <el-select
      v-model="selectedQuater"
      style="width: 200px"
      :disabled="report_type === 'annual'"
      :placeholder="t('message.quarter')"
    >
      <el-option
        v-for="item in quarterOptions"
        :label="t('message.' + item.label)"
        :value="item.value"
      ></el-option>
    </el-select>
    <el-select v-model="statusOfOrganizations" style="width: 200px">
      <el-option
        :label="t('message.disclosured')"
        value="submitted"
      ></el-option>
      <el-option
        :label="t('message.non_disclosured')"
        value="not_submitted"
      ></el-option>
      <el-option
        :label="t('message.late_disclosured')"
        value="late_submitted_organizations"
      ></el-option>
    </el-select>

    <el-button
      :icon="Search"
      color="#124483"
      size="default"
      style="margin: 0"
      type="success"
      @click="fetchData"
    >
      {{ $t('message.Search') }}
    </el-button>

    <el-button
      type="danger"
      size="default"
      style="background-color: red; padding: 10px; color: #ffffff; margin: 0"
      @click="clearFields"
    >
      <el-icon size="16" style="vertical-align: middle">
        <RefreshLeft />
      </el-icon>
      <span style="vertical-align: middle">
        {{ t('message.Clear') }}
      </span>
    </el-button>

    <a
      v-if="report_type === 'quarterly'"
      style="background: #059b39"
      :href="
        selectedYear
          ? `${url}/reports/quarterly-submission-status/?year=${encodeURIComponent(moment(selectedYear).format('YYYY'))}${selectedQuater ? `&quarter=${encodeURIComponent(selectedQuater)}` : ''}${factSearchInput ? `&search=${encodeURIComponent(factSearchInput)}` : ''}&submission_status=${encodeURIComponent(statusOfOrganizations)}&download=excel`
          : null
      "
      target="_blank"
      class="el-button el-button--success d-flex align-items-center justify-content-center gap-2"
    >
      <img src="../../assets/images/icons/Vector.svg" alt="excel-icon" />
      <span> Excel</span>
    </a>

    <a
      v-if="report_type === 'annual'"
      style="background: #059b39"
      :href="
        selectedYear
          ? `${url}/reports/annual-submission-status/?year=${encodeURIComponent(moment(selectedYear).format('YYYY'))}${factSearchInput ? `&search=${encodeURIComponent(factSearchInput)}` : ''}&submission_status=${encodeURIComponent(statusOfOrganizations)}&download=excel`
          : null
      "
      target="_blank"
      class="el-button el-button--success d-flex align-items-center justify-content-center gap-2"
    >
      <img src="../../assets/images/icons/Vector.svg" alt="excel-icon" />
      <span> Excel</span>
    </a>
  </div>
  <div v-loading="loading" class="trade">
    <el-empty
      v-if="!tableData?.length"
      :description="t('message.trade.emptyText')"
    >
    </el-empty>

    <el-table
      v-if="tableData?.length"
      :data="tableData"
      style="width: 100%"
      element-loading-background="rgba(0, 0, 0, 0.4)"
      :empty-text="t('message.trade.emptyText')"
    >
      <el-table-column :label="t('message.trade.organization')" align="left">
        <template #default="scope">
          <a
            :href="scope.row.report_link"
            style="color: #1256a0"
            target="_blank"
          >
            {{ scope.row.full_name_text }}
          </a>
        </template>
      </el-table-column>
      <el-table-column
        v-if="confirmedStatusOfOrganizations"
        :label="t('message.trade.publishingDate')"
        align="right"
      >
        <template #default="scope">
          <p style="color: #1256a0">
            {{
              moment.utc(scope.row.last_publication_date).format('DD.MM.YYYY ')
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column
        v-if="confirmedStatusOfOrganizations"
        :label="t('message.due_days')"
        align="right"
      >
        <template #default="scope">
          <el-tag
            effect="dark"
            style="width: 50px"
            :type="scope.row.days_due_or_late >= 0 ? 'success' : 'danger'"
          >
            {{ scope.row.days_due_or_late }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="inn" align="right" :label="$t('message.TIN_KPP')">
      </el-table-column>
      <!-- <el-table-column
        prop="email_status"
        align="right"
        :label="t('message.email_status')"
      >
        <template #default="scope">
          <p v-if="scope.row.email_status">
            {{ $t(`message.${scope.row.email_status}`) }}
          </p>
          <p v-else>{{ $t('message.not_sent') }}</p>
        </template>
      </el-table-column> -->

      <el-table-column
        prop="phone_number"
        align="right "
        :label="t('message.phone_number')"
      />

      <el-table-column prop="email" align="right" :label="t('message.email')">
        <template #default="scope">
          <a :href="`mailto:${scope.row.email}`">{{ scope.row.email }}</a>
          <span v-if="!scope.row.email">-</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
  import { ref, onMounted, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import axios from 'axios'
  const tableHeight = ref('auto')
  import http from '@/http/index.js'
  import { useRouter } from 'vue-router'
  import { RefreshLeft, Search } from '@element-plus/icons-vue'
  import options from '@/components/options'
  import { shortcuts } from '@/components/company profile/utils'
  import moment from 'moment'
  import DialogComponent from '@/components/moderator-tool/LoginModeratorTool.vue'
  import { ElMessage } from 'element-plus'

  const totalPages = ref(null)
  const total = ref(null)
  const loading = ref(false)
  const tableData = ref([])

  const ConditionalRendering = ref(false)
  const confirmedStatusOfOrganizations = ref(true)
  const report_type = ref('quarterly')
  const router = useRouter()
  const statusOfOrganizations = ref('submitted')

  const quarterOptions = ref([
    {
      value: '1',
      label: 'q1',
    },
    {
      value: '2',
      label: 'q2',
    },
    {
      value: '3',
      label: 'q3',
    },
    {
      value: '4',
      label: 'q4',
    },
  ])
  const selectedQuater = ref('1')

  const factSearchInput = ref('')
  const activeSort = ref('')
  const url = import.meta.env.VITE_APP_SERVER_URL

  const { t } = useI18n()
  const selectedYear = ref(null)
  const dialogVisible = ref(false)
  const startDate = ref(null)
  const endDate = ref(null)
  const FactDateFormat = 'YYYY-MM-DD'
  const pickerOptions = {
    disabledDate(time) {
      return time.getTime() > Date.now()
    },
  }

  const fetchData = async () => {
    loading.value = true

    try {
      // Define the URL dynamically based on report type
      const selectedUrl =
        report_type.value === 'quarterly'
          ? '/quarterly-submission-status/'
          : '/annual-submission-status/'

      // Fetch data from the constructed URL
      const params = {
        year: selectedYear.value
          ? new Date(selectedYear.value).getFullYear()
          : '',
        quarter: report_type.value === 'quarterly' ? selectedQuater.value : '',
      }
      const response = await http.get(`/reports${selectedUrl}`, { params })

      // Process response data
      const {
        total_pages,
        count,
        submitted_organizations,
        not_submitted_organizations,
        late_submitted_organizations,
      } = response.data

      totalPages.value = total_pages
      total.value = count

      ConditionalRendering.value = report_type.value === 'quarterly'

      // Determine organization status and corresponding table data
      const organizationStatusMap = {
        submitted: submitted_organizations,
        not_submitted: not_submitted_organizations,
        late_submitted_organizations: late_submitted_organizations,
      }

      confirmedStatusOfOrganizations.value = [
        'submitted',
        'late_submitted_organizations',
      ].includes(statusOfOrganizations.value)
      tableData.value =
        organizationStatusMap[statusOfOrganizations.value] || null
    } catch (error) {
      console.error('Error fetching trade data:', error)

      if (error.response) {
        const { status, data } = error.response
        if (status === 401 || status === 403) {
          ElMessage.warning(` ${data.detail}!`)
        }
      }

      tableData.value = null
    } finally {
      loading.value = false
    }
  }

  const clearFields = () => {
    selectedYear.value = null
    factSearchInput.value = null
    tableData.value = null
    fetchData()
  }

  const activeFilter = ref('simple') // To track the active filter button

  const suggestionsList = ref([])
  const querySearch = (queryString, cb) => {
    http
      .get(`${url}/home/autofill/?name=${queryString}`)
      .then((response) => {
        suggestionsList.value = response.data
        cb(suggestionsList.value)
      })
      .catch((err) => {
        console.log(err, 'error')
      })
  }

  // New Method: Trigger search
  const makeSearch = () => {
    fetchData()
  }

  onMounted(() => {
    // fetchData()
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
</style>

<style>
  .trade .el-table th.el-table__cell {
    background: #fff;
    color: #262829;
    font-weight: 600;
  }

  .trade .el-table {
  }

  /*
  .suggestion-item {
    display: flex;
    align-items: center;
  }

  .suggestion-item .autocomplete-logo {
    width: 40px;
    height: 40px;
    object-fit: contain;
    margin-right: 8px;
  }

   */
</style>
