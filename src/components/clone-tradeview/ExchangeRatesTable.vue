<template>
  <el-table
    :data="tableData"
    style="width: 100%; margin-bottom: 20px"
    row-key="isin_code"
    height="320px"
  >
    <el-table-column prop="Ccy" :label="$t('message.kotirovka.Ccy')" sortable>
      <template #default="scope">
        <div class="d-flex gap-3 align-items-center">
          <img :src="scope.row.logo" class="rates-img" />
          <p>{{ scope.row.Ccy }}</p>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      :label="$t('message.kotirovka.rate')"
      sortable
      align="right"
    >
      <template #default="scope">
        {{
          scope.row.Rate
            ? Number(scope.row.Rate).toLocaleString('ru-RU')
            : 'N/A'
        }}
      </template>
    </el-table-column>
    <el-table-column
      prop="change"
      :label="$t('message.kotirovka.change')"
      sortable
      align="right"
    >
      <template #default="scope">
        <p
          class="fw-medium"
          :style="{ color: scope.row.Diff < 0 ? 'red' : 'green' }"
        >
          {{ financial(scope.row.Diff) }}
        </p>
      </template>
    </el-table-column>
    <el-table-column prop="change_percent" align="right" width="60">
      <template #default="scope">
        <p class="d-flex align-items-center justify-content-end">
          <el-icon v-if="scope.row.Diff > 0" size="20" color="green"
            ><Top
          /></el-icon>
          <el-icon v-if="scope.row.Diff < 0" size="20" color="red"
            ><Bottom
          /></el-icon>
        </p>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue'
  import http from '@/http'
  import { financial } from '@/components/kotirovka/utills'
  import { Top, Bottom } from '@element-plus/icons-vue'
  const tableData = ref([])

  const fetchTradeData = async () => {
    try {
      const response = await http.get(`home/exchange-rates/`, {})
      tableData.value = response.data
    } catch (error) {
      console.error('Error fetching trade data:', error)
    } finally {
    }
  }

  onMounted(() => {
    fetchTradeData()
  })
</script>

<style scoped>
  .rates-img {
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }
</style>
