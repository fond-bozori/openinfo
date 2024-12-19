<template>
  <el-container>
    <el-main v-loading="loading" class="fact-container">
      <div class="header-name title">
        <p>{{ $t('message.INVESTMENT PROPOSAL') }}</p>
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
      <el-empty v-if="!factLists.length"> </el-empty>

      <div v-for="fact in factLists" class="facts-list">
        <div class="d-flex justify-content-between align-items-center">
          <p class="organization-in-facts">{{ fact.organization_name }}</p>
          <router-link
            class="button-more"
            color="#06AA17"
            :to="{ name: 'announce-jobs-detail', params: { id: fact.id } }"
            >{{ $t('message.more') }}</router-link
          >
        </div>

        <p v-if="fact.fact_title" class="fact-title">{{ fact.fact_title }}</p>

        <div class="d-flex justify-content-between flex-wrap gap-3">
          <div class="d-flex gap-3 align-items-center justify-content-between">
            <p class="fact-date fw-bold text-primary">
              {{ $t('message.date_recognized') }}
            </p>
            <p class="fact-date d-flex gap-1 align-items-center text-center">
              <el-icon><Calendar /></el-icon>
              {{ moment.utc(fact.pub_date).format('DD.MM.YYYY ') }} &nbsp;&nbsp;
              <el-icon><Clock /></el-icon>
              {{ moment.utc(fact.pub_date).format('HH:mm') }}
            </p>
          </div>

          <div
            v-if="fact.approved_date"
            class="d-flex align-items-center gap-3 justify-content-between"
          >
            <p class="fact-date text-primary fw-bold">
              {{ $t('message.data_approved') }}
            </p>
            <p class="fact-date d-flex gap-1 align-items-center">
              <el-icon><Calendar /></el-icon>
              {{
                moment.utc(fact.approved_date).format('DD.MM.YYYY ')
              }}&nbsp;&nbsp; <el-icon><Clock /></el-icon>
              {{ moment.utc(fact.approved_date).format('HH:mm') }}
            </p>
          </div>
        </div>
      </div>

      <div
        v-if="factLists.length"
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
  import options from '../../options'
  import router from '../../../router'

  const factLists = ref([])

  const url = import.meta.env.VITE_APP_SERVER_URL
  const route = useRoute()
  const selectValue = ref(options[0].value)
  const dateValue = ref([])
  const loading = ref(false)

  const totalPages = ref(null)
  const total = ref(null)

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
        `${url}/announcement/main/?type=investments&page=${currentPage.value}&report_type=2${dateValue.value.length ? `pub_date_lte=${dateValue.value[1].toISOString()}pub_date_gte=${dateValue.value[0].toISOString()}` : ''}&search=${factSearchInput.value}`,
        {
          method: 'get',
        },
      )
      .then((response) => {
        factLists.value = response.data.results
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
    /*text-transform: uppercase;*/
  }

  .fact-date {
    font-size: 14px;
  }
</style>
