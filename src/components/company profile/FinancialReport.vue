<template>
  <div class="div">
    <el-collapse v-model="isCollapseOpen" @click="openCollapse">
      <el-collapse-item
        v-loading="loading"
        :title="$t('message.financial_statements')"
        name="1"
      >
        <div class="search-bar">
          <el-select
            v-model="report_standard"
            :placeholder="$t('message.nsbu')"
            size="large"
            style="width: 250px"
            @change="changeData"
          >
            <el-option
              v-for="item in standardOptions"
              :key="item.value"
              :label="$t(`message.${item.label}`)"
              :value="item.value"
            />
          </el-select>
          <el-date-picker
            v-model="selectedYear"
            type="year"
            :placeholder="$t('message.pick a year')"
            size="large"
          />

          <el-date-picker
            v-model="startDate"
            type="date"
            format="DD.MM.YYYY"
            :placeholder="$t('message.start_date')"
            :shortcuts="shortcuts"
            :picker-options="pickerOptions"
            size="large"
          />
          <el-date-picker
            v-model="endDate"
            type="date"
            format="DD.MM.YYYY"
            :placeholder="$t('message.end_date')"
            :shortcuts="shortcuts"
            :picker-options="pickerOptions"
            size="large"
          />

          <el-select
            v-model="report_type"
            :placeholder="$t('message.all')"
            size="large"
            style="width: 250px"
            @change="selectChange"
          >
            <el-option
              v-for="item in nsbuData.length
                ? reportOptions
                : reportOptionsMsfo"
              :key="item.value"
              :label="$t(`message.${item.label}`)"
              :value="item.value"
            />
          </el-select>

          <!--        <el-autocomplete-->
          <!--            v-model="factSearchInput"-->
          <!--            :fetch-suggestions="querySearch"-->
          <!--            :trigger-on-focus="false"-->
          <!--            class="inline-input w-75"-->
          <!--            :placeholder="$t('message.placeholder_for_search')"-->
          <!--            size="large"-->
          <!--            value-key="full_name_text"-->
          <!--            clearable-->
          <!--        />-->

          <el-button
            :icon="Search"
            color="#124483"
            size="large"
            style="margin: 0"
            type="success"
            @click="getFacts"
          >
            {{ $t('message.Search') }}
          </el-button>
          <el-button
            type="danger"
            size="large"
            style="
              background-color: red;
              padding: 10px;
              color: #ffffff;
              margin: 0;
            "
            @click="clearFields"
          >
            <el-icon size="16" style="vertical-align: middle">
              <RefreshLeft />
            </el-icon>
            <span style="vertical-align: middle">
              {{ $t('message.Clear') }}
            </span>
          </el-button>
        </div>

        <el-table
          v-if="nsbuData.length"
          :data="nsbuData"
          border
          style="width: 100%"
          stripe
        >
          <el-table-column
            prop="pub_date"
            :label="$t('message.date_recognized')"
            align="center"
          >
            <template #default="scope">
              <p v-if="!scope.row.report_type">
                {{
                  scope.row.pub_date
                    ? new Date(scope.row.pub_date).toLocaleDateString(
                        'ru-RU',
                        options,
                      )
                    : '-'
                }}
              </p>
              <p v-if="scope.row.report_type">{{ scope.row.pub_date }}</p>
            </template>
          </el-table-column>

          <el-table-column
            prop="report_title"
            :label="$t('message.statement_type')"
            align="center"
          >
            <template #default="scope">
              <p v-if="!scope.row.report_type">
                {{ scope.row.properties.report_title }}
              </p>
              <p v-if="scope.row.report_type">
                {{ scope.row.report_type === 1 ? 'annual' : 'quarterly' }}
              </p>
            </template>
          </el-table-column>

          <el-table-column
            :label="$t('message.Download')"
            align="center"
            width="200"
          >
            <template #default="scope">
              <a
                :href="`https://openinfo.uz/ru/reports/to_pdf${scope.row?.id}/`"
                download
                ><img
                  src="/src/assets/images/icons/pdf-icon2.svg"
                  alt="pdfIcon"
                  class="xls-icon"
              /></a>
              <a
                :href="`${url}/reports/export-excel/?report_type=${scope.row.properties.report_type}&org_type=${scope.row.properties.org_type}&report_id=${scope.row.object_id}&lang=${store.$state.currentLanguage}`"
                download
                ><img
                  src="/src/assets/images/icons/excel-icon2.svg"
                  alt="pdfIcon"
                  class="xls-icon"
              /></a>

              <router-link
                v-if="!scope.row.report_type"
                :to="{
                  name: generateRouteName(
                    scope.row.properties.org_type,
                    scope.row.properties.report_type,
                  ),
                  params: { id: scope.row.object_id },
                }"
              >
                <img
                  src="/src/assets/images/icons/eye.svg"
                  alt="pdfIcon"
                  style="width: 24px"
                />
              </router-link>
            </template>
          </el-table-column>
        </el-table>

        <el-table
          v-if="msfoData.length"
          :data="msfoData"
          border
          style="width: 100%"
          stripe
        >
          <el-table-column
            prop="pub_date"
            :label="$t('message.date_recognized')"
            align="center"
          >
          </el-table-column>

          <el-table-column :label="$t('message.statement_type')" align="center">
            <template #default="scope">
              <p>{{ scope.row.report_type === 1 ? 'annual' : 'quarterly' }}</p>
            </template>
          </el-table-column>

          <el-table-column
            :label="$t('message.Download')"
            align="center"
            width="200"
          >
            <template #default="scope">
              <a
                :href="`https://openinfo.uz/media/${scope.row?.pdf_file}/`"
                download
                target="_blank"
                ><img
                  src="/src/assets/images/icons/pdf-icon2.svg"
                  alt="pdfIcon"
                  class="xls-icon"
              /></a>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination d-flex justify-content-center mt-4">
          <el-pagination
            :current-page="currentPage"
            :page-count="totalPages"
            :total="total"
            background
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue'
  import axios from 'axios'
  import { useStore } from '@/stores/store'
  import { useRoute, useRouter } from 'vue-router'

  import { View, Search, RefreshLeft } from '@element-plus/icons-vue'
  import moment from 'moment/moment'
  import { ElNotification } from 'element-plus'
  import options from '@/components/options'
  import { DateFormat } from '@/components/company profile/utils'
  const activeNames = ref(['1'])

  const loading = ref(false)
  const data = ref([])
  const store = useStore()
  const isCollapseOpen = ref(false)

  const url = import.meta.env.VITE_APP_SERVER_URL
  const id = computed(() => route.params.id)

  const msfoData = ref([])
  const nsbuData = ref([])
  const selectedYear = ref(null)
  const dateValue = ref(null)
  const route = useRoute()
  const router = useRouter()

  const totalPages = ref(null)
  const total = ref(null)

  const results = ref([])
  const factNumber = ref(1)
  const startDate = ref(null)
  const endDate = ref(null)
  const factSearchInput = ref('')
  const suggestionsList = ref([])
  const currentPage = ref(1)
  const handleCurrentChange = (val) => {
    currentPage.value = val
    getFacts()
  }

  const reportOptions = [
    {
      value: ``,
      label: 'all',
    },
    {
      value: `quarter`,
      label: 'quarterly',
    },
    {
      value: `annual`,
      label: 'annual',
    },
  ]

  const reportOptionsMsfo = [
    {
      value: ``,
      label: 'all',
    },
    {
      value: `2`,
      label: 'quarterly',
    },
    {
      value: `1`,
      label: 'annual',
    },
  ]

  const standardOptions = [
    {
      value: `main`,
      label: 'nsbu',
    },
    {
      value: `msfo`,
      label: 'ifrs',
    },
    {
      value: `audition`,
      label: 'audition_results',
    },
  ]

  const report_type = ref(reportOptions[0].value)
  const report_standard = ref(standardOptions[0].value)

  const selectChange = () => {
    currentPage.value = 1
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

  const pickerOptions = {
    disabledDate(time) {
      return time.getTime() > Date.now()
    },
  }

  const querySearch = (queryString, cb) => {
    axios
      .get(`${url}/home/autofill/?name=${queryString}`)
      .then((response) => {
        suggestionsList.value = response.data

        // call callback function to return suggestions
        cb(suggestionsList.value)
      })
      .catch((err) => {
        console.log(err, 'error')
      })
  }

  const generateRouteName = (orgType, reportType) => {
    switch (orgType) {
      case 'bank':
        return reportType === 'quarter'
          ? 'reports-quarter-detailBanks'
          : 'reports-annual-detailBanks'
      case 'jsc':
        return reportType === 'quarter'
          ? 'reports-quarter-detailJSC'
          : 'reports-annual-detailJSC'
      case 'insurance':
        return reportType === 'quarter'
          ? 'reports-insurance-detailInsurance'
          : 'reports-annual-detailInsurance'
    }
  }

  const getFacts = () => {
    loading.value = true
    axios
      .get(
        `${url}/reports/${report_standard.value}/?organization_id=${id.value}${report_type.value ? `&report_type=${report_type.value}` : ''}&page_size=5&pub_date__year=${selectedYear.value ? new Date(selectedYear?.value).getFullYear() : ''}&page=${currentPage.value}${`&pub_date__lte=${endDate.value ? moment(endDate.value).format(DateFormat) : ''}&pub_date__gte=${startDate.value ? moment(startDate.value).format(DateFormat) : ''}`}&search=${factSearchInput.value}`,
        {
          method: 'get',
        },
      )
      .then((response) => {
        if (report_standard.value === 'main') {
          nsbuData.value = response.data.results
        } else {
          msfoData.value = response.data.results
        }

        totalPages.value = response.data.total_pages
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
    report_type.value = reportOptions[0].value
    report_standard.value = standardOptions[0].value
    startDate.value = null
    endDate.value = null
    getFacts()
  }

  const changeData = () => {
    currentPage.value = 1
    loading.value = true
    if (report_standard.value === 'main') {
      msfoData.value = []
      getFacts()
    } else {
      nsbuData.value = []
      getFacts()
    }
    // console.log(document.getElementById("chart"))
    // loading.value = false
  }

  const openCollapse = () => {
    if (!msfoData.value.length || !nsbuData.value.length) {
      getFacts()
    }
  }
</script>

<style scoped>
  .xls-icon {
    width: 18px;
    margin: 0 8px;
  }
</style>
