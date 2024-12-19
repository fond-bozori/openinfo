<template>
  <div v-loading="loading" class="company-fact-container">
    <div class="d-flex gap-3 mb-3 align-items-center">
      <el-select
        v-model="selectValue"
        :placeholder="$t('message.all')"
        size="large"
        style="width: 450px"
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
        :placeholder="$t('message.start_date')"
        :shortcuts="shortcuts"
        :picker-options="pickerOptions"
        size="large"
        @change="selectDate('startDate')"
      />
      <el-date-picker
        v-model="endDate"
        type="date"
        format="DD.MM.YYYY"
        :placeholder="$t('message.end_date')"
        :shortcuts="shortcuts"
        :picker-options="pickerOptions"
        size="large"
        @change="selectDate('endDate')"
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
      <el-button
        type="danger"
        size="large"
        style="background-color: red; padding: 10px; color: #ffffff; margin: 0"
        @click="clearFields"
      >
        <el-icon size="16" style="vertical-align: middle">
          <RefreshLeft />
        </el-icon>
        <span style="vertical-align: middle"> {{ $t('message.Clear') }} </span>
      </el-button>
    </div>

    <el-table :data="factLists" border style="width: 100%" stripe>
      <el-table-column
        prop="fact_number"
        :label="$t('message.fact_number')"
        align="center"
        width="100"
      />
      <el-table-column
        prop="approved_date"
        :label="$t('message.date_recognized')"
        align="center"
        width="200"
      >
        <template #default="scope">
          {{
            new Date(scope.row.pub_date).toLocaleDateString('ru-RU', options)
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="fact_title"
        :label="$t('message.essential_fact_title')"
        align="center"
      >
        <template #default="scope">
          <p class="one-line__text">{{ scope.row.fact_title }}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="after_change_pro"
        :label="$t('message.Download')"
        align="center"
        width="200"
      >
        <template #default="scope">
          <a
            v-if="selectValue === 'facts/'"
            :href="`https://openinfo.uz/ru/facts/to_pdf/${scope.row.id}`"
            ><img
              src="/src/assets/images/icons/pdf-icon2.svg"
              alt="pdfIcon"
              class="xls-icon"
          /></a>
          <a
            v-if="selectValue !== 'facts/'"
            :href="`https://openinfo.uz/ru/facts/go_pdf/?fact=${scope.row.fact_number}&id=${scope.row.id}`"
          >
            <img
              src="/src/assets/images/icons/pdf-icon2.svg"
              alt="pdfIcon"
              class="xls-icon"
            />
          </a>
          <router-link
            type="primary"
            link
            :to="{
              name: 'facts-detailed',
              params: {
                id: scope.row.fact_number,
                factId:
                  selectValue === 'facts/' ? scope.row.object_id : scope.row.id,
              },
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
  </div>
</template>

<script setup>
  import {
    computed,
    onBeforeUnmount,
    onMounted,
    reactive,
    ref,
    watch,
  } from 'vue'
  import axios from 'axios'
  import { useStore } from '@/stores/store'
  import { useRoute, useRouter } from 'vue-router'
  import options from '@/components/options'
  import { View, Search, RefreshLeft } from '@element-plus/icons-vue'
  import moment from 'moment/moment'
  import { ElNotification } from 'element-plus'
  import { shortcuts } from '@/components/company profile/utils'
  const activeNames = ref(['1'])

  const loading = ref(false)
  const data = ref([])
  const store = useStore()

  const url = import.meta.env.VITE_APP_SERVER_URL

  const factLists = ref([])

  const dateValue = ref(null)
  const route = useRoute()
  const router = useRouter()
  const selectValue = ref(options[0].value)
  const startDate = ref(null)
  const endDate = ref(null)
  const pickerOptions = {
    disabledDate(time) {
      return time.getTime() > Date.now()
    },
  }
  const totalPages = ref(null)
  const total = ref(null)

  const results = ref([])
  const factNumber = ref(1)

  const id = computed(() => route.params.id)
  const suggestionsList = ref([])
  const currentPage = ref(1)

  const handleCurrentChange = (newPage) => {
    currentPage.value = newPage
    updateQueryParameters(
      {
        page: currentPage.value,
      },
      true,
    ) // Reset the page number to 1
      .then(getFacts)
      .catch((error) => {
        console.error('Error updating fact selection:', error)
      })
  }

  const selectChange = () => {
    currentPage.value = 1
    updateQueryParameters(
      {
        facts: selectValue.value,
      },
      true,
    ) // Reset the page number to 1
      .then(getFacts)
      .catch((error) => {
        console.error('Error updating fact selection:', error)
      })
  }

  const selectDate = (param) => {
    currentPage.value = 1
    let queryParams = {}

    if (param === 'startDate') {
      queryParams = {
        startDate: startDate.value,
      }
    } else if (param === 'endDate') {
      queryParams = {
        endDate: endDate.value,
      }
    }

    updateQueryParameters(queryParams, true) // Reset the page number to 1
      .then(getFacts)
      .catch((error) => {
        console.error('Error updating fact selection:', error)
      })
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

  const updateQueryParameters = async (changes, resetPage = true) => {
    const newQuery = {
      ...route.query,
      ...changes,
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

  const getFacts = () => {
    loading.value = true
    axios
      .get(`${url}/disclosure/${selectValue.value ?? 'facts/'}`, {
        params: {
          organization_id: id.value,
          pub_date__lte: endDate.value
            ? moment(endDate.value).format('YYYY-MM-DD hh:mm:ss')
            : '',
          pub_date__gte: startDate.value
            ? moment(startDate.value).format('YYYY-MM-DD hh:mm:ss')
            : '',
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
    selectValue.value = options[0].value
    currentPage.value = 1
    startDate.value = null
    endDate.value = null
    router.push({
      query: {},
    })
    getFacts()
  }

  const activeCollapse = computed(() => route.query['active-collapse'])

  // Watch for changes in activeCollapse
  watch(activeCollapse, (newValue) => {
    if (activeCollapse.value === 'facts') {
      getFacts()
    }
  })

  onMounted(() => {
    if (activeCollapse.value === 'facts') {
      selectValue.value = route.query['facts'] ?? options[0].value
      startDate.value = route.query.startDate ?? ''
      endDate.value = route.query.endDate ?? ''

      const shouldResetPage = route.query.infotype && !route.query.page
      const page = +route.query.page
      currentPage.value = shouldResetPage || Number.isNaN(page) ? 1 : page
      getFacts()
    }
  })
</script>

<style scoped>
  .company-fact-container {
    margin-top: 32px;
  }

  .xls-icon {
    width: 18px;
    margin: 0 8px;
  }

  .one-line__text {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    /* Number of lines to show before truncating */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
