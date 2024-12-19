<template>
  <div class="header-container mt-4">
    <h1 class="header-title p-0 m-0">{{ $t('message.trade.calendars') }}</h1>
  </div>
  <div class="calendar">
    <el-tabs
      v-model="activeName"
      class="demo-tabs m-0 p-0"
      @tab-click="handleClick"
    >
      <el-tab-pane :label="$t('message.trade.dividends_calendar')" name="first">
        <DividendCalendar />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('message.trade.announcements_calendar')"
        name="second"
      >
        <AnnouncementsCalendar />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import DividendCalendar from '@/components/DividendCalendar.vue'
  const activeName = ref('first')
  const handleClick = (tab, event) => {
    console.log(tab, event)
  }
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
