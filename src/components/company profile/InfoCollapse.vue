<template>
  <div class="company-fact-container">
    <el-collapse v-model="isCollapseOpen" accordion>
      <el-collapse-item
        v-loading="loading"
        :title="$t('message.essential_facts')"
        name="facts"
      >
        <CompanyFactsTest />
      </el-collapse-item>

      <el-collapse-item
        v-loading="loading"
        :title="$t('message.financial_statements')"
        name="reports"
      >
        <FinancialReportTest />
      </el-collapse-item>
      <el-collapse-item
        v-loading="loading"
        :title="$t('message.announcements')"
        name="announcements"
      >
        <CompanyAnnouncement />
      </el-collapse-item>
      <el-collapse-item
        v-loading="loading"
        :title="$t('message.trade.dividends_calendar')"
        name="devidenCalendar"
      >
        <DividendCalendarForCompany />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup>
  import { onMounted, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import CompanyFactsTest from '@/components/company profile/CompanyFactsTest.vue'
  import FinancialReportTest from '@/components/company profile/FinancialReportTest.vue'
  import CalendarDevidentView from '@/views/CalendarDevidentView.vue'

  const loading = ref(false)

  const isCollapseOpen = ref('')
  const route = useRoute()
  const router = useRouter()

  const updateQueryState = (parameter, value) => {
    // Create a new query object with only the desired parameter
    const newQuery = {
      [parameter]: value,
    }
    router.push({ query: newQuery })

    // Use router.replace or router.push to update the URL without reloading
  }

  watch(isCollapseOpen, () => {
    router.push({ query: {} })
    updateQueryState('active-collapse', isCollapseOpen.value)
  })

  onMounted(() => {
    isCollapseOpen.value = route.query['active-collapse'] ?? ''
  })
</script>

<style scoped>
  .company-fact-container {
    margin-top: 32px;
  }
</style>
