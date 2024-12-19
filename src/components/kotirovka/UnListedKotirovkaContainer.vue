<template>
  <div class="calendar">
    <el-input
      v-model="searchInput"
      style="width: 240px; margin-right: 10px"
      :placeholder="$t('message.placeholder_without_ticker')"
    >
      <template #prefix>
        <el-icon class="el-input__icon"><Search /></el-icon>
      </template>
    </el-input>
    <el-button
      v-for="filter in filters"
      :key="filter.value"
      :class="{ 'is-active': selectedCategoryKotirovka === filter.value }"
      round
      @click="applyFilter(filter.value)"
    >
      {{ $t(`message.trade.${filter.label}`) }}
    </el-button>

    <UnlistedStcokKotirovka
      v-if="selectedCategoryKotirovka === 'stk'"
      :search-input="searchInput"
    />
    <UnlistedBondKotirovka
      v-if="selectedCategoryKotirovka === 'bnd'"
      :search-input="searchInput"
    />
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  const activeName = ref('first')

  import { useRouter } from 'vue-router'
  import { Search } from '@element-plus/icons-vue'
  import { useI18n } from 'vue-i18n'

  // Initialize the router instance
  const router = useRouter()
  const { t } = useI18n()
  const searchInput = ref('')
  const handleClick = (tab, event) => {
    console.log(tab, event)
  }
  const selectedCategoryKotirovka = ref('stk')
  const filters = [
    { label: 'stock', value: 'stk' },
    { label: 'bond', value: 'bnd' },
  ]
  const applyFilter = (filterValue) => {
    selectedCategoryKotirovka.value = filterValue
  }
</script>

<style>
  .calendar .el-tabs__header .el-tabs__item.is-active {
    color: #1256a0;
  }
</style>

<style scoped>
  .is-active {
    background-color: #dceeff;
    color: #1256a0;
    border: 1px solid #dceeff;
  }
</style>
