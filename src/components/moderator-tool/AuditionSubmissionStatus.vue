<template>
  <div class="d-flex gap-3 mb-3 mt-3 align-items-center">
    <el-autocomplete
      v-model="searchInput"
      :fetch-suggestions="querySearch"
      :placeholder="t('message.placeholder_for_search')"
      :trigger-on-focus="false"
      class="inline-input w-25 border-radius"
      clearable
      value-key="full_name_text"
    >
    </el-autocomplete>

    <el-date-picker
      v-model="startDate"
      type="date"
      format="DD.MM.YYYY"
      :placeholder="t('message.start_date')"
      :shortcuts="shortcuts"
      :picker-options="pickerOptions"
      size="default"
    />
    <el-date-picker
      v-model="endDate"
      type="date"
      format="DD.MM.YYYY"
      :placeholder="t('message.end_date')"
      :shortcuts="shortcuts"
      :picker-options="pickerOptions"
      size="default"
    />
    <el-select v-model="statusOfOrganizations" style="width: 200px">
      <el-option
        :label="t('message.disclosured')"
        value="submitted"
      ></el-option>
      <el-option
        :label="t('message.non_disclosured')"
        value="not_submitted"
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
      {{ t('message.Search') }}
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
      </span> </el-button
    >x

    <a
      style="background: #059b39"
      target="_blank"
      :href="`${url}/reports/audition-submission-status/?${startDate ? `start_date=${moment(startDate).format(FactDateFormat)}` : ''}${endDate ? `&end_date=${moment(endDate).format(FactDateFormat)}` : ''}${searchInput ? `&search=${searchInput}` : ''}&submission_status=${statusOfOrganizations}&download=excel`"
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
            :href="scope.row.audition_url"
            style="color: #1256a0"
            target="_blank"
          >
            {{ scope.row.full_name_text }}
          </a>
        </template>
      </el-table-column>
      <el-table-column
        v-if="statusOfOrganizations === 'submitted'"
        :label="t('message.trade.publishingDate')"
        align="right"
      >
        <template #default="scope">
          <p>
            {{
              scope.row.pub_date
                ? moment.utc(scope.row.pub_date).format('DD.MM.YYYY ')
                : '-'
            }}
          </p>
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
          {{ $t(`message.${scope.row.email_status}`) }}
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
  import { ref, onMounted, watch, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import axios from 'axios'
  const tableHeight = ref('auto')
  import http from '@/http/index.js'
  import { useRouter } from 'vue-router'
  import { RefreshLeft, Search } from '@element-plus/icons-vue'
  import { shortcuts } from '@/components/company profile/utils'
  import moment from 'moment'
  import DialogComponent from '@/components/moderator-tool/LoginModeratorTool.vue'
  import { ElMessage } from 'element-plus'
  import { getFactOptions } from './factOptions'

  const totalPages = ref(null)
  const total = ref(null)
  const loading = ref(false)
  const tableData = ref({})
  const currentPage = ref(1)
  const router = useRouter()
  const statusOfOrganizations = ref('submitted')
  const searchInput = ref('')
  const activeSort = ref('')
  const url = import.meta.env.VITE_APP_SERVER_URL

  const { t } = useI18n()
  const options = computed(() => getFactOptions(t))
  const selectValue = ref(null)
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
      const response = await http.get(`/reports/audition-submission-status/`, {
        params: {
          start_date: startDate.value
            ? moment(startDate?.value).format(FactDateFormat)
            : '',
          end_date: endDate.value
            ? moment(endDate?.value).format(FactDateFormat)
            : '',
          search: searchInput.value ? searchInput.value : '',
        },
      })
      totalPages.value = response.data.total_pages
      total.value = response.data.count
      tableData.value =
        statusOfOrganizations.value === 'submitted'
          ? response.data?.submitted_organizations
          : response.data?.not_submitted_organizations
    } catch (error) {
      console.error('Error fetching trade data:', error)
      if (error.response && error.response.status === 401) {
        ElMessage.warning(` ${error.response.data.detail}!`)
      }
      if (error.response && error.response.status === 403) {
        ElMessage.warning(` ${error.response.data.detail}!`)
      }
      tableData.value = null
    } finally {
      loading.value = false
    }
  }

  const clearFields = () => {
    startDate.value = ''
    endDate.value = ''
    searchInput.value = ''
    selectValue.value = ''
    tableData.value = null

    fetchData()
  }

  const activeFilter = ref('simple') // To track the active filter button

  // Method to apply the filter
  const applyFilter = (filterValue) => {
    activeFilter.value = filterValue
    fetchData()
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

  // New Method: Trigger search
  const makeSearch = () => {
    fetchData()
  }
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
</style>
