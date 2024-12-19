<template>
  <div class="table-responsive">
    <el-table v-loading="loading" :data="FetchedData" style="width: 100%">
      <el-table-column
        prop="id"
        :label="t('message.number_lot')"
        width="120"
        align="center"
      >
        <template #default="scope">
          <a
            target="_blank"
            :href="`https://xt-xarid.uz/procedure/${scope.row.id}/core`"
          >
            <el-tag>{{ scope.row.id }}</el-tag></a
          >
        </template>
      </el-table-column>
      <el-table-column prop="name" :label="t('message.category_name')" />
      <el-table-column
        prop="publicated_at"
        :label="t('message.trade.publishingDate')"
        width="200"
        align="right"
      >
        <template #default="scope">
          {{ moment.utc(scope.row.publicated_at).format('DD.MM.YYYY') }}
        </template>
      </el-table-column>

      <el-table-column
        prop="close_at"
        :label="t('message.closing_date')"
        align="right"
      >
        <template #default="scope">
          <p>{{ moment.utc(scope.row.close_at).format('DD.MM.YYYY') }}</p>
          <el-countdown
            :format="customFormat"
            :value-style="{ fontSize: '14px', textWrap: 'break-word' }"
            :value="calculateRemainingTime(scope.row.remain_time)"
          >
          </el-countdown>
        </template>
      </el-table-column>

      <el-table-column prop="status" :label="t('message.Status')" align="right">
        <template #default="scope">
          {{ $t(`message.${scope.row.status}`) }}.
        </template>
      </el-table-column>
      <el-table-column
        prop="totalcost"
        :label="t('message.maximum_cost')"
        align="right"
      >
        <template #default="scope">
          {{ scope.row.totalcost?.toLocaleString('ru') }}
          {{ scope.row.currency }}
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
  import { useStore } from '@/stores/store'
  import moment from 'moment/moment'
  import { useI18n } from 'vue-i18n'
  import http from '@/http'
  const url = import.meta.env.VITE_APP_SERVER_URL
  const loading = ref(false)
  const FetchedData = ref([])
  const currentPage = ref(1)
  const store = useStore()
  const totalPages = ref(1)
  const totalCount = ref(1)
  const pageSize = ref(10)
  const countdownValue = ref(0)
  const { t } = useI18n()
  const nextTo = computed(() => currentPage.value * 10)
  const from = computed(() => (currentPage.value - 1) * 10)
  const handlePagination = (val) => {
    currentPage.value = val
    getUzexData()
  }

  // Function to calculate the target time for the countdown
  const calculateRemainingTime = (remainTimeInSeconds) => {
    // Ensure remainTimeInSeconds is a valid number
    if (!remainTimeInSeconds || isNaN(remainTimeInSeconds)) {
      console.warn('Invalid remaining time:', remainTimeInSeconds)
      return Date.now() // Fallback to the current time if invalid
    }

    // Add the remaining time to the current timestamp
    const currentTime = Date.now() // Current time in milliseconds
    const targetTime = currentTime + remainTimeInSeconds * 1000 // Add remaining time in milliseconds
    return targetTime
  }

  // Custom format for the countdown, dynamically translatable
  const customFormat = computed(() => {
    const daysLabel = ' ' + t('message.days') // Add your translation for "days"
    return `DD [${daysLabel}] HH:mm:ss`
  })

  const getUzexData = () => {
    loading.value = true
    http
      .get(`/reestr/tender-xt-xarid/`, {
        params: {
          query: store.$state.companyInn,
          ref: 'ref_selection_public',
        },
      })
      .then((response) => {
        FetchedData.value = response.data.result

        // totalCount.value = response.data[0].total_count
        // totalPages.value = Math.ceil(totalCount.value / pageSize.value)
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
