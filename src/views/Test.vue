<template>
  <div class="common-layout">
    <el-container>
      <el-main v-loading="loading" class="fact-container">
        <BulletinChart20 />
        <div class="header-name title">
          <!--          <p>{{ $t("message.essential_facts") }}</p>-->

          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link" style="color: #e6e8f0">
              {{ $t(`message.${showTextBySelection(typeOfInformation)}`)
              }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="facts">{{
                  $t('message.essential_facts')
                }}</el-dropdown-item>
                <el-dropdown-item command="reports">{{
                  $t('message.financial_statements')
                }}</el-dropdown-item>
                <el-dropdown-item command="announcement">{{
                  $t('message.announcements')
                }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>

        <div class="search-bar">
          <el-autocomplete
            v-model="factSearchInput"
            :fetch-suggestions="querySearch"
            :placeholder="$t('message.placeholder_for_search')"
            :trigger-on-focus="false"
            class="inline-input w-100"
            clearable
            size="large"
            value-key="full_name_text"
            @select="organizationSelect"
          >
          </el-autocomplete>

          <el-select
            v-if="typeOfInformation === 'facts'"
            v-model="selectValue"
            :placeholder="$t('message.all')"
            size="large"
            style="width: 550px"
            @change="selectChange"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="$t(item.label)"
              :value="item.value"
            />
          </el-select>

          <el-date-picker
            v-model="startDate"
            :picker-options="pickerOptions"
            :placeholder="$t('message.start_date')"
            :shortcuts="shortcuts"
            format="DD.MM.YYYY"
            size="large"
            style="width: 400px"
            type="date"
          />
          <el-date-picker
            v-model="endDate"
            :picker-options="pickerOptions"
            :placeholder="$t('message.end_date')"
            :shortcuts="shortcuts"
            format="DD.MM.YYYY"
            size="large"
            style="width: 400px"
            type="date"
          />

          <el-button
            size="large"
            style="background-color: #124483; color: #ffffff; padding: 10px"
            @click="makeSearch"
          >
            <el-icon size="17" style="vertical-align: middle">
              <Search />
            </el-icon>
            <span style="vertical-align: middle">
              {{ $t('message.Search') }}
            </span>
          </el-button>
          <el-button
            size="large"
            style="
              background-color: red;
              padding: 10px;
              color: #ffffff;
              margin: 0;
            "
            type="danger"
            @click="clearFields"
          >
            <el-icon size="18" style="vertical-align: middle">
              <RefreshLeft />
            </el-icon>
            <span style="vertical-align: middle">
              {{ $t('message.Clear') }}
            </span>
          </el-button>
        </div>

        <el-empty v-if="!factLists.length"></el-empty>

        <div v-for="fact in factLists" class="facts-list">
          <div class="d-flex justify-content-between align-items-center">
            <h1
              class="organization-in-facts fw-bolds"
              @click="
                router.push({
                  name: 'company-profile',
                  params: { id: fact.organization },
                })
              "
            >
              {{ fact.organization_name }}
            </h1>

            <div class="buttons d-flex gap-2 align-items-center">
              <a
                v-if="selectValue === 'facts/' && typeOfInformation === 'facts'"
                :href="`https://openinfo.uz/ru/facts/to_pdf/${fact.id}`"
              >
                <img
                  alt="pdfIcon"
                  src="/src/assets/images/icons/pdf-icon2.svg"
                  style="width: 26px"
                />
              </a>
              <a
                v-if="selectValue !== 'facts/' && typeOfInformation === 'facts'"
                :href="`https://openinfo.uz/ru/facts/go_pdf/?fact=${fact.fact_number}&id=${fact.id}`"
              >
                <img
                  alt="pdfIcon"
                  src="/src/assets/images/icons/pdf-icon2.svg"
                  style="width: 26px"
                />
              </a>

              <a
                v-if="typeOfInformation === 'reports'"
                :href="`https://openinfo.uz/ru/reports/to_pdf${fact.id}/`"
              >
                <img
                  alt="pdfIcon"
                  src="/src/assets/images/icons/pdf-icon2.svg"
                  style="width: 26px"
                />
              </a>
              <a
                v-if="typeOfInformation === 'announcement'"
                :href="`https://openinfo.uz/ru/announce/to_pdf/${fact.id}/`"
              >
                <img
                  alt="pdfIcon"
                  src="/src/assets/images/icons/pdf-icon2.svg"
                  style="width: 26px"
                />
              </a>

              <router-link
                v-if="selectValue === 'facts/' && fact.fact_number"
                :to="{
                  name: 'facts-detailed',
                  params: {
                    id: fact?.fact_number,
                    factId: fact?.object_id ? fact?.object_id : 1,
                  },
                }"
                class="button-more"
                color="#06AA17"
              >
                {{ $t('message.more') }}
              </router-link>

              <router-link
                v-if="selectValue !== 'facts/' && fact.fact_number"
                :to="{
                  name: 'facts-detailed',
                  params: { id: fact.fact_number, factId: fact?.id },
                }"
                class="button-more"
                color="#06AA17"
              >
                {{ $t('message.more') }}
              </router-link>

              <router-link
                v-if="fact.properties"
                :to="{
                  path: `reports/${fact.properties.org_type}/${fact.properties.report_type}/${fact.object_id}`,
                }"
                class="button-more"
                color="#06AA17"
              >
                {{ $t('message.more') }}
              </router-link>
              <router-link
                v-if="fact.body"
                :to="{ name: 'announce-by-id', params: { id: fact.id } }"
                class="button-more"
                color="#06AA17"
                >{{ $t('message.more') }}
              </router-link>
            </div>
          </div>

          <p v-if="fact.fact_title" class="fact-title">
            <span style="font-weight: 600; font-size: 16px">
              {{ $t('message.fact_number') + ' ' + fact.fact_number }}:
            </span>
            {{ fact.fact_title }}
          </p>
          <p v-if="fact.properties" class="fact-title">
            {{ fact.properties.report_title }}
          </p>
          <p v-if="fact.an_type" class="fact-title">
            <span style="font-weight: 600; color: #124483; font-size: 16px">
              {{ $t('message.announcement_type') }}:
            </span>
            {{
              $t(
                `message.${getMeetingByType(fact.an_type ? fact.an_type : 'charter')}`,
              )
            }}
          </p>

          <div class="d-flex justify-content-between flex-wrap gap-1">
            <div class="fact-date-co ntainer">
              <p class="fact-date text-primary">
                {{ $t('message.date_recognized') }}
              </p>
              <p class="fact-date d-flex gap-1 align-items-center text-center">
                <el-icon>
                  <Calendar />
                </el-icon>
                {{ moment.utc(fact.pub_date).format('DD.MM.YYYY ') }}
                &nbsp;&nbsp;
                <el-icon>
                  <Clock />
                </el-icon>
                {{ moment.utc(fact.pub_date).format('HH:mm') }}
              </p>
            </div>

            <div v-if="fact.approved_date" class="fact-date-container">
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

        <div class="pagination d-flex justify-content-center mb-4">
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="10"
            :background="true"
            layout="prev, pager, next"
            :total="total"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-main>
    </el-container>
    <div style="margin-bottom: 20px">
      <KotirovkaView />
      <CalendarDevidentView />
    </div>
  </div>

  <el-aside class="rightside">
    <router-view></router-view>
  </el-aside>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue'
  import axios from 'axios'
  import {
    Calendar,
    Clock,
    RefreshLeft,
    Search,
    ArrowDown,
  } from '@element-plus/icons-vue'
  import { ElNotification } from 'element-plus'

  import moment from 'moment'

  import { useRoute, useRouter } from 'vue-router'
  // import options from '../components/options.js'
  import CalendarDevidentView from '@/views/CalendarDevidentView.vue'
  import KotirovkaView from '@/views/KotirovkaView.vue'
  import { useI18n } from 'vue-i18n'
  import { getOptions } from '@/components/selectOptions'

  const factLists = ref([])

  const url = import.meta.env.VITE_APP_SERVER_URL
  const factSearchInput = ref('')
  const route = useRoute()
  const router = useRouter()
  const { currentRoute, push } = useRouter()

  const dateValue = ref([])
  const loading = ref(false)
  const { t } = useI18n()
  const options = computed(() => getOptions(t))
  const selectValue = ref(options.value[0].value)
  const totalPages = ref(null)
  const total = ref(null)
  const currentPage = ref(1)
  const startDate = ref(null)
  const endDate = ref(null)

  // const changeQueryParams = async (query) => {
  //   await router.replace({
  //     path: route.path,
  //     params: route.params,
  //     query: {
  //       ...route.query,
  //       ...query,
  //     }
  //   });
  // };

  const handleCommand = (commend) => {
    typeOfInformation.value = commend
    updateQueryParameters(
      {
        infotype: typeOfInformation.value,
        ...(factSearchInput.value && { search: factSearchInput.value }), // Optionally keep the search
      },
      true,
      true,
    ) // Reset the page number to 1
      .then(getFacts)
      .catch((error) => {
        console.error('Error updating type information:', error)
      })
  }

  // const resetForTypeChange = async () => {
  //   // Construct the new query object to include typeOfInformation and optionally the search input
  //   const newQuery = {
  //     page: 1,  // Always reset to page 1
  //     'infotype': typeOfInformation.value,  // Save the current type of information
  //     ...(factSearchInput.value && { search: factSearchInput.value })  // Preserve the search input if it exists
  //   };
  //
  //   try {
  //     await router.replace({
  //       path: route.path,
  //       params: route.params,
  //       query: newQuery
  //     });
  //     console.log('Navigation to new type with updated parameters succeeded');
  //   } catch (error) {
  //     console.error('Failed to reset query parameters:', error);
  //   }
  // };

  // const changeQueryParamsOnSearch = async (query) => {
  //   await router.replace({
  //     path: route.path,
  //     params: route.params,
  //     query: {
  //       ...route.query,
  //       ...query,
  //     }
  //   });
  // };

  const updateQueryParameters = async (
    changes,
    resetPage = true,
    resetDates = false,
  ) => {
    const newQuery = {
      ...route.query, // Start with the existing query parameters
      ...(resetPage && { page: 1 }), // Override page to 1 if reset is needed
      ...changes, // Apply new changes
    }

    // Explicitly check if page should be removed when not resetting
    if (!resetPage) {
      delete newQuery.page // Remove page parameter if not resetting
    }

    if (resetDates) {
      delete newQuery.startDate
      delete newQuery.endDate
    }

    try {
      await router.replace({
        path: route.path,
        params: route.params,
        query: newQuery,
      })
      console.log('Query parameters successfully updated:', newQuery)
    } catch (error) {
      console.error('Failed to update query parameters:', error)
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

  const finOptions = [
    {
      value: 'facts',
      label: 'essential_facts',
    },
    {
      value: 'reports',
      label: 'financial_statements',
    },
    {
      value: 'announcement',
      label: 'announcements',
    },
  ]
  const typeOfInformation = ref(finOptions[0].value)

  // const SearchTypeChange =  () => {
  //   updateQueryState('infotype', typeOfInformation.value);
  //   resetForTypeChange().then(() => {
  //     getFacts(); // Fetch facts after query params are updated
  //   }).catch(error => {
  //     console.error('Failed to reset query parameters:', error);
  //   });
  // }

  const SearchTypeChange = () => {
    updateQueryParameters(
      {
        infotype: typeOfInformation.value,
        ...(factSearchInput.value && { search: factSearchInput.value }), // Optionally keep the search
      },
      true,
    ) // Reset the page number to 1
      .then(getFacts)
      .catch((error) => {
        console.error('Error updating type information:', error)
      })
  }

  const apiUrl = computed(() => {
    switch (typeOfInformation.value) {
      case 'facts':
        return `${url}/disclosure/${selectValue.value ?? 'facts/'}`
      case 'reports':
        return `${url}/reports/main/`
      case 'announcement':
        return `${url}/announcement/main/`
      default:
        return `${url}/disclosure/facts/` // Default to facts if nothing matches
    }
  })

  const getFacts = () => {
    loading.value = true
    axios
      .get(apiUrl.value, {
        params: {
          pub_date__lte: endDate.value
            ? moment(endDate.value).format('YYYY-MM-DD hh:mm:ss')
            : '',
          pub_date__gte: startDate.value
            ? moment(startDate.value).format('YYYY-MM-DD hh:mm:ss')
            : '',
          search: factSearchInput.value,
          page: currentPage.value,
        },
      })
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
    selectValue.value = options.value[0].value
    factSearchInput.value = ''
    startDate.value = null
    endDate.value = null
    getFacts()
    router.push({
      query: {},
    })
  }

  const makeSearch = () => {
    currentPage.value = 1
    updateQueryParameters(
      {
        facts: selectValue.value,
        startDate: startDate.value,
        endDate: endDate.value, //  Keep the selected fact type
      },
      true,
    ) // Reset the page number to 1
      .then(getFacts)
      .catch((error) => {
        console.error('Error updating fact selection:', error)
      })
  }

  // const updateUrl = () => {
  //   const query = new URLSearchParams({
  //     search: factSearchInput.value,
  //     fact: selectValue.value,
  //     page: currentPage.value,
  //   }).toString();
  //   history.pushState({}, '', '?' + query);
  // };
  //
  // watch([factSearchInput, currentPage, selectValue], getFacts);
  //
  //
  // const syncUrlWithState = () => {
  //
  //
  //   getFacts();
  // };

  const updateQueryState = (parameter, value) => {
    router.push({
      query: {
        ...currentRoute.value.query,
        [parameter]: value,
      },
    })
  }

  const organizationSelect = async (val) => {
    currentPage.value = 1
    // await updateQueryState('page', currentPage.value);
    // factSearchInput.value = val.full_name_text
    //  updateQueryState('search', val.full_name_text )
    // getFacts()
    updateQueryParameters(
      {
        search: val?.full_name_text,
        startDate: startDate.value,
        endDate: endDate.value, //  Keep the selected fact type
      },
      true,
    ) // Reset the page number to 1
      .then(getFacts)
      .catch((error) => {
        console.error('Error updating fact selection:', error)
      })
  }

  const selectChange = async () => {
    currentPage.value = 1
    // await updateQueryState('page', currentPage.value);
    // updateQueryState('facts', selectValue.value);
    // getFacts();
    updateQueryParameters(
      {
        facts: selectValue.value, // Keep the selected fact type
      },
      true,
    ) // Reset the page number to 1
      .then(getFacts)
      .catch((error) => {
        console.error('Error updating fact selection:', error)
      })
  }

  const pickerOptions = {
    disabledDate(time) {
      return time.getTime() > Date.now()
    },
  }

  const handleCurrentChange = (val) => {
    currentPage.value = val
    updateQueryState('page', currentPage.value)
    getFacts()
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

  const showTextBySelection = (type) => {
    switch (type) {
      case 'facts':
        return 'essential_facts'
      case 'reports':
        return 'financial_statements'
      case 'announcement':
        return 'announcements'
    }
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

  onMounted(() => {
    selectValue.value = route.query.facts ?? options.value[0].value
    factSearchInput.value = route.query.search ?? ''
    typeOfInformation.value = route.query.infotype ?? 'facts'
    startDate.value = route.query.startDate ?? ''
    endDate.value = route.query.endDate ?? ''

    // Check if infotype has changed, and if so, force currentPage to 1
    const shouldResetPage = route.query.infotype && !route.query.page
    const page = +route.query.page
    currentPage.value = shouldResetPage || Number.isNaN(page) ? 1 : page

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
