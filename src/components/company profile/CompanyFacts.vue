<template>
  <div class="company-fact-container">
    <el-collapse v-model="isCollapseOpen" @change="changeCollapse">
      <el-collapse-item
        v-loading="loading"
        :title="$t('message.essential_facts')"
        name="facts"
      >
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
                new Date(scope.row.pub_date).toLocaleDateString(
                  'ru-RU',
                  options,
                )
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
                      selectValue === 'facts/'
                        ? scope.row.object_id
                        : scope.row.id,
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
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup>
  import { computed, onMounted, reactive, ref } from 'vue'
  import axios from 'axios'
  import { useStore } from '@/stores/store'
  import { useRoute, useRouter } from 'vue-router'
  import options from '@/components/options'
  import { View, Search } from '@element-plus/icons-vue'
  import moment from 'moment/moment'
  import { ElNotification } from 'element-plus'
  const activeNames = ref(['1'])

  const loading = ref(false)
  const data = ref([])
  const store = useStore()
  const isCollapseOpen = ref([])

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
  const factSearchInput = ref('')
  const suggestionsList = ref([])
  const currentPage = ref(1)

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

  const updateQueryParameters = async (changes, resetPage = true) => {
    const newQuery = {
      ...route.query, // Start with the existing query parameters
      ...(resetPage && { page: 1 }), // Override page to 1 if reset is needed
      ...changes, // Apply new changes
    }

    // Explicitly check if page should be removed when not resetting
    if (!resetPage) {
      delete newQuery.page // Remove page parameter if not resetting
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

  const getFacts = () => {
    loading.value = true
    axios
      .get(
        `${url}/disclosure/${selectValue?.value ? selectValue?.value : 'facts/'}?organization_id=${id.value}&page_size=5&page=${currentPage.value}${`&pub_date__lte=${endDate.value ? moment(endDate.value).format(DateFormat) : ''}&pub_date__gte=${startDate.value ? moment(startDate.value).format(DateFormat) : ''}`}&search=${factSearchInput.value}`,
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

  const openCollapse = () => {
    if (!factLists.value.length) {
      const shouldResetPage = route.query.infotype && !route.query.page
      const page = +route.query.page
      currentPage.value = shouldResetPage || Number.isNaN(page) ? 1 : page
      getFacts()
    }
    console.log(isCollapseOpen.value, 'opening')
  }

  const changeCollapse = () => {
    if (isCollapseOpen.value.length) {
      console.log('open...')
    } else if (!isCollapseOpen.value.length) {
    }
  }

  onMounted(() => {
    isCollapseOpen.value = [route.query['active-collapse'] ?? 'facts']
    getFacts()
  })
</script>

<style scoped>
  .company-fact-container {
    margin-top: 32px;
  }

  .search-bar {
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
