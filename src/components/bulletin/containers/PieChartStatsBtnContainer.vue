<template>
  <div class="header">
    <BulletinTitle :customTitle="$t('message.transaction_volume_by_sector')" />
    <div class="search-bar mt-0">
      <!-- Start Date Picker -->
      <el-date-picker
        v-model="startDate"
        type="date"
        format="YYYY-MM-DD"
        :placeholder="$t('message.start_date')"
        size="large"
        style="width: 200px"
      />

      <!-- End Date Picker -->
      <el-date-picker
        v-model="endDate"
        type="date"
        format="YYYY-MM-DD"
        :placeholder="$t('message.end_date')"
        size="large"
        style="width: 200px"
      />

      <!-- Search Button
      <el-button type="primary" size="large" @click="getTradeResults">
        {{ $t('message.select') }}
      </el-button> -->
    </div>
  </div>
  <div class="d-flex gap-5 justify-content-center">
    <PieChart
      :startDate="formattedStartDate"
      :endDate="formattedEndDate"
      ref="pieChartRef"
    />
    <StatsButtonsContainer
      :startDate="formattedStartDate"
      :endDate="formattedEndDate"
      ref="statsButtonsRef"
    />
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue'
  import PieChart from '../components/PieChart.vue'
  import StatsButtonsContainer from './StatsButtonsContainer.vue'
  import BulletinTitle from '../components/BulletinTitle.vue'

  // Initialize startDate and endDate with today's date
  const startDate = ref(new Date().toISOString().split('T')[0])
  const endDate = ref(new Date().toISOString().split('T')[0])

  const formattedStartDate = computed(() => {
    return new Date(startDate.value).toISOString().split('T')[0]
  })

  const formattedEndDate = computed(() => {
    return new Date(endDate.value).toISOString().split('T')[0]
  })

  // Refs to child components
  const pieChartRef = ref(null)
  const statsButtonsRef = ref(null)

  const getTradeResults = () => {
    // Call methods in the child components to fetch data based on the selected dates
    if (pieChartRef.value) {
      pieChartRef.value.fetchData()
    }

    if (statsButtonsRef.value) {
      statsButtonsRef.value.fetchData()
    }
  }
</script>

<style scoped>
  .header {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
</style>
