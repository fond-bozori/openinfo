<template>
  <div class="table-responsive">
    <el-table v-loading="loading" :data="FetchedData" style="width: 100%">
      <el-table-column
        prop="provider_name"
        :label="t('message.provider_name')"
      />
      <el-table-column
        prop="deal_date"
        :label="t('message.deal_date')"
        width="200"
        align="center"
      >
        <template #default="scope">
          {{ moment.utc(scope.row.deal_date).format('DD.MM.YYYY') }}
        </template>
      </el-table-column>
      <el-table-column
        prop="category_name"
        :label="t('message.category_name')"
      />
      <el-table-column
        prop="deal_cost"
        :label="t('message.deal_cost')"
        align="center"
      >
        <template #default="scope">
          {{ scope.row.deal_cost?.toLocaleString('ru') }}
          {{ scope.row.currency_name }}
        </template>
      </el-table-column>
    </el-table>
    <div class="d-flex align-items-center mt-3"></div>
    <el-pagination
      :current-page="currentPage"
      :page-count="totalPages"
      background
      layout="prev, pager, next"
      hide-on-single-page
      @current-change="handlePagination"
    />
  </div>
</template>

<script setup>
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
  import axios from 'axios'
  import { ElNotification } from 'element-plus'
  import { useStore } from '@/stores/store'
  import moment from 'moment/moment'
  import { useI18n } from 'vue-i18n'

  const url = import.meta.env.VITE_APP_SERVER_URL
  const loading = ref(false)
  const FetchedData = ref([])
  const currentPage = ref(1)
  const store = useStore()
  const totalPages = ref(1)
  const totalCount = ref(1)
  const pageSize = ref(10)

  const activeName = ref('first')
  const { t } = useI18n()
  const nextTo = computed(() => currentPage.value * 10)
  const from = computed(() => (currentPage.value - 1) * 10)
  const handlePagination = (val) => {
    currentPage.value = val
    getUzexData()
  }
  const getUzexData = () => {
    loading.value = true
    axios
      .post(`${url}/reestr/proxy/`, {
        from: from.value,
        to: nextTo.value,
        customerTin: store.$state.companyInn,
      })
      .then((response) => {
        FetchedData.value = response.data
        totalCount.value = response.data[0].total_count
        totalPages.value = Math.ceil(totalCount.value / pageSize.value)
      })
      .catch(({ response }) => {
        console.log(response.data)
      })
      .finally(() => {
        loading.value = false
      })
  }

  onMounted(() => {
    getUzexData()
  })

  onBeforeUnmount(() => {
    store.setCurrentSuffix(null)
    store.setInn(null)
  })
</script>

<style scoped>
  table {
  }

  thead {
    font-size: 18px;
    background-color: #094580;
    color: #ffffff;
    border-radius: 10px;
  }

  th {
    font-weight: 600;
    background-color: #094580;
    color: #ffffff;
    border: none;
  }

  td {
    color: #535353;
    text-align: center;
    padding: 12px;
  }

  table {
    border-radius: 8px;
  }

  tr td:first-child {
    /* CSS properties here */
    font-weight: 600;
    text-align: left;
  }
</style>
