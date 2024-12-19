<template>
  <div class="common-layout">
    <el-container>
      <el-main v-loading="loading" class="fact-container">
        <div class="header-name title">
          <p>{{ t('message.information_disclosure') }}</p>
        </div>

        <div class="search-bar">
          <el-autocomplete
            v-model="factSearchInput"
            :fetch-suggestions="querySearch"
            :placeholder="t('message.placeholder_for_search')"
            :trigger-on-focus="false"
            class="inline-input w-100"
            clearable
            size="large"
            value-key="full_name_text"
            @select="organizationSelect"
          >
          </el-autocomplete>
          <el-select
            v-model="SearchType"
            :placeholder="t('message.all')"
            size="large"
            style="width: 500px"
            @change="selectChange"
          >
            <el-option
              v-for="item in finOptions"
              :key="item.value"
              :label="t(`message.${item.label}`)"
              :value="item.value"
            />
          </el-select>
          <el-select
            v-if="SearchType === 'facts'"
            v-model="selectValue"
            :placeholder="t('message.all')"
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

          <el-date-picker
            v-model="startDate"
            type="date"
            format="DD.MM.YYYY"
            :placeholder="t('message.start_date')"
            :shortcuts="shortcuts"
            :picker-options="pickerOptions"
            size="large"
            style="width: 400px"
          />
          <el-date-picker
            v-model="endDate"
            type="date"
            format="DD.MM.YYYY"
            :placeholder="t('message.end_date')"
            :shortcuts="shortcuts"
            :picker-options="pickerOptions"
            size="large"
            style="width: 400px"
          />

          <el-button
            size="large"
            style="background-color: #124483; color: #ffffff"
            @click="makeSearch"
          >
            <el-icon size="14" style="vertical-align: middle">
              <Search />
            </el-icon>
            <span style="vertical-align: middle">
              {{ t('message.Search') }}
            </span>
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
              {{ t('message.Clear') }}
            </span>
          </el-button>
        </div>

        <el-empty v-if="!factLists.length"> </el-empty>

        <div v-for="fact in factLists" class="facts-list">
          <div class="d-flex justify-content-between align-items-center">
            <h1
              class="organization-in-facts fw-bolds"
              @click="
                router.push({
                  name: 'company-profile',
                  params: { id: fact?.organization },
                })
              "
            >
              {{ fact.organization_name }}
            </h1>

            <div class="buttons d-flex gap-2 align-items-center">
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

              <!--              <router-link v-if="fact.fact_number  & selectValue === 'facts/'" class="button-more" color="#06AA17" :to="{name: 'facts-detailed', params : { id : fact.fact_number,  factId: fact.object_id ?? 1  }}">{{ $t("message.more") }}</router-link>-->
              <!--              <router-link v-if="SearchType === 'facts'  & selectValue !== 'facts/'" class="button-more" color="#06AA17" :to="{name: 'facts-detailed', params : { id : fact.fact_number,  factId: fact.id   }}">{{ $t("message.more") }}</router-link>-->
              <!--              <router-link v-if="fact.properties" class="button-more" color="#06AA17" :to="{path: `reports/${fact.properties.org_type}/${fact.properties.report_type}/${fact?.object_id}`}">{{ $t("message.more") }}</router-link>-->
              <!--              <router-link v-if="fact.body"  class="button-more" color="#06AA17" :to="{name: 'announce-by-id', params : { id :fact?.id}}">{{ $t("message.more") }}</router-link>-->

              <router-link
                v-if="selectValue === 'facts/'"
                class="button-more"
                color="#06AA17"
                :to="{
                  name: 'facts-detailed',
                  params: {
                    id: fact.fact_number,
                    factId: fact?.object_id ? fact?.object_id : 1,
                  },
                }"
                >{{ $t('message.more') }}</router-link
              >
              <router-link
                v-if="selectValue !== 'facts/'"
                class="button-more"
                color="#06AA17"
                :to="{
                  name: 'facts-detailed',
                  params: { id: fact.fact_number, factId: fact?.id },
                }"
                >{{ $t('message.more') }}</router-link
              >
              <router-link
                v-if="fact.properties"
                class="button-more"
                color="#06AA17"
                :to="{
                  path: `reports/${fact.properties.org_type}/${fact.properties.report_type}/${fact.object_id}`,
                }"
                >{{ $t('message.more') }}</router-link
              >
              <router-link
                v-if="fact.body"
                class="button-more"
                color="#06AA17"
                :to="{ name: 'announce-by-id', params: { id: fact.id } }"
                >{{ $t('message.more') }}</router-link
              >
            </div>
          </div>

          <p v-if="fact.fact_title" class="fact-title">
            <span style="font-weight: 600; font-size: 16px">
              {{ t('message.fact_number') + ' ' + fact.fact_number }}:
            </span>
            {{ fact.fact_title }}
          </p>
          <p v-if="fact.properties" class="fact-title">
            {{ fact.properties.report_title }}
          </p>
          <p v-if="fact.an_type" class="fact-title">
            <span style="font-weight: 600; color: #124483; font-size: 16px">
              {{ t('message.announcement_type') }}:
            </span>
            {{
              t(
                `message.${getMeetingByType(fact.an_type ? fact.an_type : 'charter')}`,
              )
            }}
          </p>

          <div class="d-flex justify-content-between flex-wrap gap-1">
            <div class="fact-date-container">
              <p class="fact-date text-primary">
                {{ t('message.date_recognized') }}
              </p>
              <p class="fact-date d-flex gap-1 align-items-center text-center">
                <el-icon><Calendar /></el-icon>
                {{ moment.utc(fact.pub_date).format('DD.MM.YYYY ') }}
                &nbsp;&nbsp; <el-icon><Clock /></el-icon>
                {{ moment.utc(fact.pub_date).format('HH:mm') }}
              </p>
            </div>

            <div v-if="fact.approved_date" class="fact-date-container">
              <p class="fact-date text-primary">
                {{ t('message.data_approved') }}
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

        <div class="pagination d-flex justify-content-center mb-4">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            :hide-on-single-page="true"
            :current-page="currentPage"
            :page-count="totalPages"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-main>
    </el-container>
  </div>

  <el-aside class="rightside"> <router-view></router-view></el-aside>
</template>

<script setup>
  import { ref, onMounted, computed, watch } from 'vue'
  import axios from 'axios'
  import { Search, Calendar, Clock, RefreshLeft } from '@element-plus/icons-vue'

  import { ElNotification } from 'element-plus'

  import moment from 'moment'
  import Facts5 from '../components/facts-table/facts5.vue'
  import router from '../router'
  import { useRoute } from 'vue-router'
  import options from '../components/options'
  import LeftSideHome from '../components/left-side-home.vue'
  import { useStore } from '@/stores/store'
  import { useI18n } from 'vue-i18n'
  import MainNavigationModerator from '@/components/MainNavigationModerator.vue'
  const factLists = ref([])

  const url = import.meta.env.VITE_APP_SERVER_URL
  const factSearchInput = ref('')
  const route = useRoute()
  const selectValue = ref(options[0].value)
  const dateValue = ref([])
  const loading = ref(false)

  const { t } = useI18n()
  const totalPages = ref(null)
  const total = ref(null)
  const currentPage = ref(1)
  const startDate = ref(null)
  const endDate = ref(null)
  const organizationsList = ref([])

  const getSelectedUrl = (SearchType) => {
    switch (SearchType) {
      case 'facts':
        return `${url}/disclosure/${selectValue?.value ?? 'facts/'}`
      case 'report':
        return `${url}/reports/main/`
      case 'announcement':
        return `${url}/announcement/main/`
    }
  }

  // const getFacts = () => {
  //   loading.value = true
  //   axios.get(`${getSelectedUrl(SearchType.value)}?page=${currentPage.value}&${`pub_date__lte=${endDate.value ? moment(endDate.value).toISOString() : ''}&pub_date__gte=${startDate.value ? (startDate.value).toISOString() : ''}` }&search=${factSearchInput.value}`, {
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
  //   })
  // }

  const getFacts = () => {
    loading.value = true
    axios
      .get(
        `${url}/disclosure/${selectValue?.value ? selectValue?.value : 'facts/'}?page=${currentPage.value}&${`pub_date__lte=${endDate.value ? moment(endDate.value).toISOString() : ''}&pub_date__gte=${startDate.value ? startDate.value.toISOString() : ''}`}&search=${factSearchInput.value}`,
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

  watch(currentPage, async function (page) {
    await changeQueryParams({ page })
  })

  watch(selectValue, async function (facts) {
    await changeQueryParams({ facts })
  })

  const getOrganizationsList = () => {
    axios
      .get(`${url}/home/autofill/`)
      .then((response) => {
        organizationsList.value = response.data
        console.log(organizationsList.value, 'autofill')
      })
      .catch((err) => {
        console.log(err, 'error')
      })
  }

  const changeQueryParams = async (query) => {
    await router.replace({
      path: route.path,
      params: route.params,
      query: {
        ...route.query,
        ...query,
      },
    })
  }

  const finOptions = [
    {
      value: 'facts',
      label: 'essential_facts',
    },
    {
      value: 'report',
      label: 'financial_statements',
    },
    {
      value: 'announcement',
      label: 'announcements',
    },
  ]
  const SearchType = ref(finOptions[0].value)

  const clearFields = () => {
    selectValue.value = options[0].value
    factSearchInput.value = ''
    startDate.value = null
    endDate.value = null
    getFacts()
    // const { path, hash } = router.currentRoute.value;
    // router.push({ path, hash });
    router.push(route.path)
  }

  const makeSearch = () => {
    currentPage.value = 1
    getFacts()
  }

  const organizationSelect = async (val) => {
    currentPage.value = 1
    factSearchInput.value = val.full_name_text
    await changeQueryParams({ search: factSearchInput.value })
    await getFacts()
  }

  const selectChange = async () => {
    currentPage.value = 1
    await getFacts()
    await changeQueryParams({ facts: selectValue.value })
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

  const handleCurrentChange = (val) => {
    currentPage.value = val
    getFacts()
  }

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

  const getMeetingByType = (type) => {
    switch (type) {
      case 'charter':
        return 'charter_of_jsc'
      case 'tender':
        return 'competitions_and_tenders'
      case 'meetings':
        return 'holding_a_gen_meeting_of_shrldrs'
      case 'jobs':
        return 'vacancies_of_jscs'
      case 'corporal_management':
        return 'comply_or_explain'
      case 'investments':
        return 'investments'
      case 'others':
        return 'other_announcements'
    }
  }

  onMounted(() => {
    selectValue.value = route.query.facts ?? options[0].value
    factSearchInput.value = route.query.search ?? ''
    const page = +route.query.page
    currentPage.value = Number.isNaN(page) ? 1 : page
    // getOrganizationsList()
    getFacts()
  })
</script>

<style scoped>
  .fact-container {
    min-height: 100vh;
    height: 100%;
    /*display: flex;*/
    /*flex-direction: column;*/
    /*gap: 10px;*/
  }

  .header-name {
    /* background: #124483; */
    border-radius: 10px;
    color: #fff;
    text-align: center;
    height: 50px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #124483;
    gap: 20px;
    text-transform: uppercase !important;
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
    font-weight: 600;
    line-height: normal;
    cursor: pointer;
    /*text-transform: uppercase;*/
  }
  .organization-in-facts:hover {
    color: #0c63bb;
    /*text-transform: uppercase;*/
  }

  .fact-date-container {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: center;
  }

  .fact-date {
    font-size: 14px;
  }

  .fact-title {
    width: 80%;
  }

  @media (max-width: 1600px) {
    .fact-date-container {
      width: 100%;
    }
  }

  @media (max-width: 767px) {
    html {
      font-size: 14px;
    }
  }

  .header-name {
    /* background: #124483; */
    border-radius: 10px;
    color: #fff;
    text-align: center;
    height: 50px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #124483;
    gap: 20px;
    text-transform: uppercase !important;
  }
</style>
