<template>
  <el-collapse v-model="isCollapseOpen" @click="openCollapse">
    <el-collapse-item
      v-loading="loading"
      :title="$t('message.charter_of_jsc')"
      name="1"
    >
      <div class="search-bar">
        <!--        <el-select v-model="AnnounceTypeValue" :placeholder="$t('message.По котегории')" size="large" style="width: 450px;" @change="selectAnnounceType" ref="mySelect" >-->
        <!--          <el-option-->
        <!--              v-for="item in announceTypes"-->
        <!--              :key="item.value"-->
        <!--              :label="$t(`message.${item.label}`)"-->
        <!--              :value="item.value"-->
        <!--          />-->
        <!--        </el-select>-->

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
          :disabled-date="disabledDate"
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
          prop="approved_date"
          :label="$t('message.date_recognized')"
          align="center"
        >
          <template #default="scope">
            {{
              new Date(scope.row.pub_date).toLocaleDateString('ru-RU', options)
            }}
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          :label="$t('message.announcement_type')"
          align="center"
        >
          <template #default="scope">
            {{
              $t(
                `message.${getMeetingByType(scope.row.an_type ? scope.row.an_type : 'charter')}`,
              )
            }}
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('message.Download')"
          align="center"
          width="200"
        >
          <template #default="scope">
            <a
              :href="`https://openinfo.uz/media/${scope.row.pdf_file}`"
              target="_blank"
              download
            >
              <img
                src="/src/assets/images/icons/pdf-icon2.svg"
                alt="pdfIcon"
                class="xls-icon"
              />
            </a>
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
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue'
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
  const isCollapseOpen = ref(false)

  const url = import.meta.env.VITE_APP_SERVER_URL
  const id = computed(() => route.params.id)

  const factLists = ref([])
  const mySelect = ref(null)

  const dateValue = ref(null)
  const route = useRoute()
  const router = useRouter()

  const announceTypes = [
    {
      value: '',
      label: 'all',
    },
    {
      value: 'tender',
      label: 'competitions_and_tenders',
    },
    {
      value: 'meetings',
      label: 'holding_a_gen_meeting_of_shrldrs',
    },
    {
      value: 'jobs',
      label: 'vacancies_of_jscs',
    },
    {
      value: 'corporal_management',
      label: 'comply_or_explain',
    },
    {
      value: 'investments',
      label: 'investments',
    },
    {
      value: 'others',
      label: 'other_announcements',
    },
  ]

  const AnnounceTypeValue = ref(announceTypes[0].value)

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

  const selectAnnounceType = (e) => {
    currentPage.value = 1
  }

  const selectedUrl = computed(() =>
    AnnounceTypeValue.value !== 'charter'
      ? `${url}/announcement/main/?organization_id=${id.value}&an_type=${AnnounceTypeValue.value}`
      : `${url}/announcement/charts/?organization_id=${id.value}&an_type=${AnnounceTypeValue.value}`,
  )

  const pickerOptions = {
    disabledDate(time) {
      return time.getTime() > Date.now()
    },
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

  const getFacts = () => {
    loading.value = true
    axios
      .get(
        `${url}/announcement/charts/?organization_id=${id.value}&an_type=${AnnounceTypeValue.value}&page_size=5&page=${currentPage.value}${`&pub_date__lte=${endDate.value ? moment(endDate.value).toISOString() : ''}&pub_date__gte=${startDate.value ? moment(startDate.value).toISOString() : ''}`}&search=${factSearchInput.value}`,
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
