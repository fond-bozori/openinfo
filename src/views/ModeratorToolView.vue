<template>
  <div>
    <!--    <el-button plain @click="dialogVisible = true">Open Dialog</el-button>-->
  </div>

  <div class="calendar mt-3">
    <div class="button-container d-flex gap-3">
      <el-button @click="dialogVisible = true">Login </el-button>
      <el-badge :value="notificationCount" color="green">
        <el-button :icon="Bell" @click="notificationDialog = true"
          >Alarm</el-button
        >
      </el-badge>
    </div>
    <el-tabs
      v-model="activeName"
      class="demo-tabs m-0 p-0"
      @tab-click="handleClick"
    >
      <el-tab-pane :label="t('message.essential_facts')" name="first">
        <ModeratorFacts />
      </el-tab-pane>

      <el-tab-pane :label="t('message.financial_statements')" name="second">
        <ModeratorFinancialReports />
      </el-tab-pane>

      <el-tab-pane :label="t('message.audition_results')" name="third">
        <AuditionSubmissionStatus />
      </el-tab-pane>

      <el-tab-pane :label="t('message.announcements')" name="fourth">
        <ModeratorAnnouncements />
      </el-tab-pane>
      <el-tab-pane :label="t('Announcements & Facts')" name="fifth">
        <ExceptionAnnouncements />
      </el-tab-pane>
    </el-tabs>
  </div>
  <DialogComponent
    :visible="dialogVisible"
    @update:visible="dialogVisible = $event"
  />
  <NotificationModal
    :visible="notificationDialog"
    @update:visible="notificationDialog = $event"
  />
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import ModeratorFinancialReports from '@/components/moderator-tool/ModeratorFinancialReports.vue'
  import DialogComponent from '@/components/moderator-tool/LoginModeratorTool.vue'
  import NotificationModal from '@/components/moderator-tool/NotificationModal.vue'
  import http from '@/http'
  import { Bell } from '@element-plus/icons-vue'
  import moment from 'moment/moment'
  import AuditionSubmissionStatus from '@/components/moderator-tool/AuditionSubmissionStatus.vue'
  import ModeratorAnnouncements from '@/components/moderator-tool/ModeratorAnnouncements.vue'
  import { useI18n } from 'vue-i18n'
  import { useRoute, useRouter } from 'vue-router'
  const activeName = ref('first')

  const { t } = useI18n()
  const handleClick = (tab, event) => {
    console.log(tab, event)
  }

  const router = useRouter()
  const dialogVisible = ref(false)
  const notificationDialog = ref(false)
  const FactDateFormat = 'YYYY-MM-DD'
  const notificationCount = ref(0)

  const fetchData = async () => {
    try {
      const response = await http.get(`/disclosure/fact-submission-status/`, {})
    } catch (error) {
      console.error('Error fetching trade data:', error)
      if (error.response && error.response.status === 401) {
        dialogVisible.value = true // Open modal on 401 error
      }
      console.log(error.response.status, 'status')
    }
  }

  // const fetchNotifications = async () => {
  //   try {
  //     const response = await http.get(`/organizations/notifications/`, {})
  //     notificationCount.value = response?.data.results.length
  //     notificationDialog.value = true
  //   } catch (error) {
  //     console.error('Error fetching trade data:', error)
  //     if (error.response && error.response.status === 401) {
  //       dialogVisible.value = true // Open modal on 401 error
  //     }

  //     console.log(error.response.status, 'status')
  //   }
  // }

  onMounted(() => {
    fetchData()
    // fetchNotifications()
  })
</script>

<style scoped>
  .header-container {
    display: flex;
    justify-content: left;
    align-items: center;
  }

  .header-title {
    font-size: 24px;
    color: #000000;
    font-weight: 700;
  }
</style>

<style>
  .calendar .el-tabs__header .el-tabs__item.is-active {
    color: #1256a0;
  }
</style>
