<template>
  <el-container>
    <el-main v-loading="loading" class="fact-container">
      <div class="header-name title">
        <p>{{ $t('message.REPORTS - JOINT STOCK COMPANIES') }}</p>
      </div>
      <div class="search-bar">
        <el-date-picker
          v-model="dateValue"
          size="large"
          type="daterange"
          :range-separator="$t('message.to')"
          :start-placeholder="$t('message.start_date')"
          :end-placeholder="$t('message.end_date')"
          style="width: 550px"
          format="DD.MM.YYYY"
        />
        <el-autocomplete
          v-model="factSearchInput"
          :fetch-suggestions="querySearch"
          :trigger-on-focus="false"
          class="inline-input w-75"
          clearable
          :placeholder="$t('message.placeholder_for_search')"
          size="large"
          value-key="full_name_text"
        />

        <el-button
          size="large"
          :icon="Search"
          type="success"
          color="#124483"
          style="margin: 0"
          @click="getFacts"
        >
          {{ $t('message.Search') }}</el-button
        >
        <el-button
          size="large"
          color="red"
          style="margin: 0"
          @click="clearFields"
        >
          {{ $t('message.Clear') }}</el-button
        >
      </div>
      <el-empty v-if="!data.length"> </el-empty>

      <div v-for="item in data" class="facts-list">
        <div class="d-flex justify-content-between align-items-center">
          <p class="organization-in-facts">{{ item.organization_name }}</p>
          <div class="d-flex align-items-center gap-3">
            <a
              :href="`${url}/reports/export-excel/?report_type=${item?.type === 2 ? 'quarter' : 'annual'}&org_type=jsc&report_id=${item.id}&lang=${store.$state.currentLanguage}`"
              download
            >
              <img
                style="width: 26px"
                src="/src/assets/images/icons/excel-icon2.svg"
                alt="pdfIcon"
            /></a>
            <router-link
              class="button-more"
              color="#06AA17"
              :to="{
                name: 'reports-annual-detailJSC',
                params: { id: item.id },
              }"
              >{{ $t('message.more') }}</router-link
            >
          </div>
        </div>

        <p class="fact-title">
          {{
            item.type === 2
              ? $t('message.quarterly_reports')
              : $t('message.annual_reports')
          }}
        </p>

        <div class="d-flex justify-content-between flex-wrap gap-3">
          <div class="d-flex gap-3 align-items-center justify-content-between">
            <p class="fact-date fw-bold text-primary">
              {{ $t('message.date_recognized') }}
            </p>
            <p class="fact-date d-flex gap-1 align-items-center text-center">
              <el-icon><Calendar /></el-icon>
              {{ moment.utc(item.pub_date).format('DD.MM.YYYY ') }} &nbsp;&nbsp;
              <el-icon><Clock /></el-icon>
              {{ moment.utc(item.pub_date).format('HH:mm') }}
            </p>
          </div>

          <div
            v-if="item.approved_date"
            class="d-flex align-items-center gap-3 justify-content-between"
          >
            <p class="fact-date text-primary fw-bold">
              {{ $t('message.data_approved') }}
            </p>
            <p class="fact-date d-flex gap-1 align-items-center">
              <el-icon><Calendar /></el-icon>
              {{
                moment.utc(item.approved_date).format('DD.MM.YYYY ')
              }}&nbsp;&nbsp; <el-icon><Clock /></el-icon>
              {{ moment.utc(item.approved_date).format('HH:mm') }}
            </p>
          </div>
        </div>
      </div>

      <div
        v-if="data.length"
        class="pagination d-flex justify-content-center mb-4"
      >
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :current-page="currentPage"
          :page-count="totalPages"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-main>
  </el-container>
</template>

<script setup>
  import { ref, onMounted, computed } from 'vue'
  import axios from 'axios'
  import { Search, Calendar, Clock } from '@element-plus/icons-vue'

  import { ElNotification } from 'element-plus'

  import moment from 'moment'

  import { useRoute } from 'vue-router'
  import router from '../../../router'
  import { useStore } from '@/stores/store'

  const data = ref([])

  const url = import.meta.env.VITE_APP_SERVER_URL
  const route = useRoute()
  const dateValue = ref([])
  const loading = ref(false)

  const totalPages = ref(null)
  const total = ref(null)
  const store = useStore()

  const factSearchInput = ref('')
  const suggestionsList = ref([])

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

  const getFacts = () => {
    loading.value = true
    axios
      .get(
        `${url}/reports/jsc/annual/?page=${currentPage.value}&report_type=2${dateValue.value.length ? `pub_date_lte=${dateValue.value[1].toISOString()}pub_date_gte=${dateValue.value[0].toISOString()}` : ''}&search=${factSearchInput.value}`,
        {
          method: 'get',
        },
      )
      .then((response) => {
        data.value = response.data.results
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
    factSearchInput.value = ''
    dateValue.value = []
    selectValue.value = options[0].value
  }

  const currentPage = ref(1)
  const handleCurrentChange = (val) => {
    currentPage.value = val
    getFacts()
  }

  onMounted(() => {
    getFacts()
    console.log()
  })
</script>

<style scoped>
  .fact-container {
    min-height: 90vh;
    /*display: flex;*/
    /*flex-direction: column;*/
    /*gap: 10px;*/
  }

  .header-name {
    /* background: #124483; */
    border-radius: 10px;
    text-transform: uppercase;
    color: #fff;
    text-align: center;
    height: 50px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #124483;
    gap: 20px;
  }

  .facts-list {
    display: flex;
    color: #5c5c5c;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 1.4;
    flex-direction: column;
    gap: 10px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 12px;
    margin: 20px 0;
    /*padding: 12px;*/
    /*box-shadow: 0px 0px 2px 3px rgba(148, 148, 148, 0.1);*/
    /*margin: 5px;*/
    /*border-radius: 10px;*/
  }

  .organization-in-facts {
    margin: 0;
    color: #124483;
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    cursor: pointer;
    /*text-transform: uppercase;*/
  }

  .fact-date {
    font-size: 14px;
  }
</style>
