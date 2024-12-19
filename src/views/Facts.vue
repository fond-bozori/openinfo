<template>
  <div class="header-name title">
    <p>{{ $t('message.essential_facts') }}</p>
  </div>
  <div class="search-bar">
    <el-date-picker
      v-model="dateValue"
      :end-placeholder="$t('message.end_date')"
      :range-separator="$t('message.to')"
      :start-placeholder="$t('message.start_date')"
      format="DD.MM.YYYY"
      size="large"
      style="width: 550px"
      type="daterange"
    />
    <el-select
      v-model="selectValue"
      :placeholder="$t('message.all')"
      size="large"
      style="width: 550px"
      @change="selectChange"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>

    <el-autocomplete
      v-model="factSearchInput"
      :fetch-suggestions="querySearch"
      :trigger-on-focus="false"
      class="inline-input w-75"
      :placeholder="$t('message.placeholder_for_search')"
      size="large"
      value-key="full_name_text"
      clearable
    />

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
    <el-button color="red" size="large" style="margin: 0" @click="clearFields">
      {{ $t('message.Clear') }}</el-button
    >
  </div>

  <div v-loading="loading" class="fact-container">
    <el-empty v-if="!factLists.length"></el-empty>

    <div v-for="fact in factLists" class="facts-list">
      <div class="d-flex justify-content-between align-items-center">
        <h1 class="organization-in-facts fw-bold">
          <span style="font-weight: 300; font-size: 16px">
            {{ 'Fact № ' + fact.fact_number }}:
          </span>
          {{ fact.organization_name }}
        </h1>
        <div class="buttons d-flex gap-3 align-items-center">
          <a
            v-if="selectValue === 'facts/'"
            :href="`https://openinfo.uz/ru/facts/to_pdf/${fact.id}`"
          >
            <img
              style="width: 26px"
              src="/src/assets/images/icons/pdf-icon2.svg"
              alt="pdfIcon"
            />
          </a>
          <a
            v-if="selectValue !== 'facts/'"
            :href="`https://openinfo.uz/ru/facts/go_pdf/?fact=${fact.fact_number}&id=${fact.id}`"
          >
            <img
              style="width: 26px"
              src="/src/assets/images/icons/pdf-icon2.svg"
              alt="pdfIcon"
            />
          </a>

          <router-link
            :to="{
              name: 'facts-detailed',
              params: {
                id: fact.fact_number,
                factId: selectValue === 'facts/' ? fact?.object_id : fact.id,
              },
            }"
            class="button-more"
            color="#06AA17"
          >
            {{ $t('message.more') }}
          </router-link>
        </div>
      </div>

      <p class="fact-title">{{ fact.fact_title }}</p>

      <div class="d-flex justify-content-between">
        <div class="d-flex gap-3 align-items-center">
          <p class="fact-date text-primary">
            {{ $t('message.date_recognized') }}
          </p>
          <p class="fact-date d-flex gap-1 align-items-center text-center">
            <el-icon>
              <Calendar />
            </el-icon>
            {{ moment.utc(fact.pub_date).format('DD.MM.YYYY ') }} &nbsp;&nbsp;
            <el-icon>
              <Clock />
            </el-icon>
            {{ moment.utc(fact.pub_date).format('HH:mm') }}
          </p>
        </div>

        <div v-if="fact.approved_date" class="d-flex align-items-center gap-3">
          <p class="fact-date text-primary">
            {{ $t('message.data_approved') }}
          </p>
          <p class="fact-date d-flex gap-1 align-items-center">
            <el-icon>
              <Calendar />
            </el-icon>
            {{
              moment.utc(fact.approved_date).format('DD.MM.YYYY ')
            }}&nbsp;&nbsp;
            <el-icon>
              <Clock />
            </el-icon>
            {{ moment.utc(fact.approved_date).format('HH:mm') }}
          </p>
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="factLists.length"
    class="pagination d-flex justify-content-center mb-4"
  >
    <el-pagination
      :current-page="currentPage"
      :page-count="totalPages"
      :total="total"
      background
      layout="prev, pager, next"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue'
  import axios from 'axios'
  import { Calendar, Clock, Download, Search } from '@element-plus/icons-vue'
  import { ElNotification } from 'element-plus'

  import moment from 'moment'

  import { useRoute, useRouter } from 'vue-router'
  import options from '../components/options'
  import { useStore } from '@/stores/store'

  const factLists = ref([])

  const url = import.meta.env.VITE_APP_SERVER_URL

  const dateValue = ref(null)
  const route = useRoute()
  const router = useRouter()
  const selectValue = ref(options[0].value)
  const loading = ref(false)

  const totalPages = ref(null)
  const total = ref(null)

  const results = ref([])
  const factNumber = ref(1)

  const factSearchInput = ref('')
  const suggestionsList = ref([])

  const selectChange = () => {
    currentPage.value = 1
    getFacts()
  }

  const store = useStore()

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
        `${url}/disclosure/${selectValue?.value ? selectValue?.value : 'facts/'}?page=${currentPage.value}${dateValue.value?.length ? `&pub_date__lte=${(dateValue.value?.[1]).toISOString()}&pub_date__gte=${moment(dateValue.value?.[0]).toISOString()}` : ''}&search=${factSearchInput.value}`,
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

  // const getFactsBySearch = () => {
  //   loading.value = true
  //   axios.get(`${url}/disclosure/${selectValue.value}?page=${currentPage.value}${dateValue.value?.length ? `&pub_date__lte=${(dateValue.value?.[1]).toISOString()}&pub_date__gte=${moment(dateValue.value?.[0]).toISOString()}` : ''}&search=${factSearchInput.value}`, {
  //     method: 'get',
  //   })
  //       .then(response => {
  //         factLists.value = response.data.results
  //         totalPages.value = response.data.total_pages
  //         total.value = response.data.count
  //
  //       })
  //       .catch(({response}) => {
  //         ElNotification({
  //           type: "error",
  //           message: response.data.message || "Malumot olishda xatolik bor!"
  //         })
  //       }).finally(() => {
  //     loading.value = false
  //
  //   })
  // }

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
    min-height: 80vh;
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
    margin: 20px 0;
    padding-bottom: 10px;
    border-bottom: 1px solid #ddd;
  }

  .organization-in-facts {
    margin: 0;
    color: #124483;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }

  .search-bar {
    display: flex;
    margin: 20px 0;
    gap: 10px;
  }

  .fact-date {
    font-size: 14px;
  }
</style>
