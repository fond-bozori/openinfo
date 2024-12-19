<template>
  <div class="mt-4 mb-3">
    <h1 class="header-title p-0 mb-3">
      {{ $t('message.kotirovka.quotes_all_title') }}
    </h1>
  </div>
  <el-tabs v-model="selectedCategoryKotirovka" class="demo-tabs">
    <el-tab-pane :label="$t(`message.kotirovka.quotes_title`)" name="listed">
      <ListedKotirovkaContainer
    /></el-tab-pane>
    <el-tab-pane
      :label="$t(`message.kotirovka.unlisted_quotes_title`)"
      name="unlisted"
    >
      <UnListedKotirovkaContainer
    /></el-tab-pane>
  </el-tabs>
</template>

<script setup>
  import { ref } from 'vue'

  import ListedKotirovkaContainer from '@/components/kotirovka/ListedKotirovkaContainer.vue'
  import UnListedKotirovkaContainer from '@/components/kotirovka/UnListedKotirovkaContainer.vue'

  const selectedCategoryKotirovka = ref('listed')

  const filters = [
    { label: 'quotes_title', value: 'listed' },
    { label: 'unlisted_quotes_title', value: 'unlisted' },
  ]

  const applyFilter = (filterValue) => {
    console.log(selectedCategoryKotirovka.value, 'selected')
    selectedCategoryKotirovka.value = filterValue
  }
</script>
<style scoped>
  .header-title {
    font-size: 24px;
    color: #000000;
    font-weight: 700;
  }

  .header-title.link-header {
    cursor: pointer;
  }

  .header-title.link-header:hover {
    color: #0c63bb;
  }

  .is-active {
    background-color: #dceeff;
    color: #1256a0;
    border: 1px solid #dceeff;
  }
</style>

<style>
  .calendar .el-tabs__header .el-tabs__item.is-active {
    color: #1256a0;
  }
</style>
