<template>
  <div class="calendar">
    <div class="filter-buttons mb-3" style="margin-right: 50px">
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
        :class="{ 'is-active': activeFilter === filter.value }"
        round
        @click="applyFilter(filter.value)"
      >
        {{ $t(`message.trade.${filter.label}`) }}
      </el-button>
    </div>

    <UnlistedStcokKotirovka
      v-if="activeFilter === 'stock'"
      :page-size="40"
      :search-input="searchInput"
    />
    <UnlistedBondKotirovka
      v-if="activeFilter === 'bond'"
      :page-size="40"
      :search-input="searchInput"
    />
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { Search } from '@element-plus/icons-vue'
  const activeFilter = ref('stock')
  const searchInput = ref('')
  const filters = [
    { label: 'stock', value: 'stock' },
    { label: 'bond', value: 'bond' },
  ]

  const applyFilter = (filterValue) => {
    activeFilter.value = filterValue
  }
</script>
