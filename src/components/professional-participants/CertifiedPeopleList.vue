<template>
  <div class="table-title">
    <p>{{ $t('message.certified_table_title') }}</p>
  </div>
  <div class="d-flex justify-content-between align-items-end mt-3 mb-3">
    <div class="search-bar w-75">
      <a
        href="https://my.gov.uz/ru/service/546"
        target="_blank"
        class="btn btn-outline-primary text-nowrap d-flex align-items-center gap-1 me-lg-3"
        ><el-icon size="14"><Right /></el-icon>
        {{ $t('message.getAtesstation') }}</a
      >
      <el-autocomplete
        v-model="CertifiedNameInput"
        :fetch-suggestions="querySearch"
        :trigger-on-focus="false"
        class="inline-input w-50"
        :placeholder="$t('message.certified_full_name')"
        size="large"
        value-key="owner_full_name"
        clearable
      />
      <el-button
        :icon="Search"
        color="#124483"
        size="large"
        style="margin: 0"
        type="success"
        @click="getCertifiedUsers"
      >
        {{ $t('message.Search') }}
      </el-button>
      <el-button
        color="red"
        size="large"
        style="margin: 0"
        @click="clearFields"
      >
        <el-icon size="16" style="vertical-align: middle">
          <RefreshLeft />
        </el-icon>
        {{ $t('message.Clear') }}</el-button
      >
    </div>

    <p
      class="d-flex justify-content-end"
      style="color: #124483; margin: 0; padding: 0"
    >
      {{ $t('message.as_of_date', { date: '07.06.2024' }) }}
    </p>
  </div>

  <el-table
    v-loading="loading"
    :data="UserData"
    border
    style="width: 100%"
    stripe
  >
    <el-table-column
      prop="owner_full_name"
      :label="$t('message.certified_full_name')"
      align="center"
    ></el-table-column>
    <el-table-column
      prop="category"
      :label="$t('message.Certified_category')"
      align="center"
    />
    <el-table-column
      prop="issuance_date"
      :label="$t('message.date_of_issue_certificate')"
      align="center"
    />
    <el-table-column
      prop="expiration_date"
      :label="$t('message.expiration_date_certificate')"
      align="center"
    />
  </el-table>
  <div class="pagination d-flex justify-content-center mt-4">
    <el-pagination
      :current-page="currentPage"
      :page-count="totalPages"
      :total="total"
      background
      layout="prev, pager, next"
      hide-on-single-page
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue'
  import axios from 'axios'
  import { RefreshLeft, Right, Search } from '@element-plus/icons-vue'
  import { useStore } from '@/stores/store'
  import { useRoute, useRouter } from 'vue-router'
  import { ElNotification } from 'element-plus'
  const activeNames = ref(['1'])

  const loading = ref(false)
  const data = ref([])
  const store = useStore()

  const url = import.meta.env.VITE_APP_SERVER_URL
  const id = computed(() => route.params.id)

  const UserData = ref([])
  const mySelect = ref(null)

  const dateValue = ref(null)
  const route = useRoute()
  const router = useRouter()

  const totalPages = ref(null)
  const total = ref(null)

  const results = ref([])
  const factNumber = ref(1)
  const startDate = ref(null)
  const endDate = ref(null)

  const CertifiedNameInput = ref('')
  const suggestionsList = ref([])
  const currentPage = ref(1)

  const handleCurrentChange = (val) => {
    currentPage.value = val
    getCertifiedUsers()
  }

  const indexMethod = (index) => {
    return index + 1
  }

  const querySearch = (queryString, cb) => {
    axios
      .get(`${url}/reestr/certificates/autofill/?query=${queryString}`)
      .then((response) => {
        suggestionsList.value = response.data

        // call callback function to return suggestions
        cb(suggestionsList.value)
      })
      .catch((err) => {
        console.log(err, 'error')
      })
  }

  const getCertifiedUsers = () => {
    loading.value = true
    axios
      .get(
        `${url}/reestr/certificates/?search=${CertifiedNameInput.value}&page=${currentPage.value}`,
        {
          method: 'get',
        },
      )
      .then((response) => {
        UserData.value = response?.data?.results
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
    CertifiedNameInput.value = ''
  }

  onMounted(() => {
    getCertifiedUsers()
  })
</script>

<style scoped>
  .table-title {
    border-radius: 10px;
    padding: 8px;
    background: #ddd403;
    margin: 20px 0;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .table-title p {
    text-align: center;
  }

  .search-bar {
    display: flex;
    margin: 0;
    gap: 10px;
    align-items: center;
  }
</style>
