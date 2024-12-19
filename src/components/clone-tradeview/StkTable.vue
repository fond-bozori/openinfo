<template>
  <el-table
    :data="tableData"
    style="width: 100%; margin-bottom: 20px"
    row-key="isin_code"
    height="310px"
    row-style="cursor: pointer"
    :row-class-name="rowClassName"
    @row-click="handleRowClick"
  >
    <el-table-column
      prop="ticker"
      :label="$t('message.kotirovka.issuer_short_name')"
    />
    <el-table-column
      prop="trade_price"
      :label="$t('message.kotirovka.trade_price')"
      sortable
      align="right"
    >
      <template #default="scope">
        {{ scope.row?.trade_price?.toLocaleString('ru') }}
      </template>
    </el-table-column>
    <el-table-column
      prop="change"
      :label="$t('message.kotirovka.change')"
      align="right"
    >
      <template #default="scope">
        <p
          class="fw-medium"
          :style="{ color: scope.row.change < 0 ? 'red' : 'green' }"
        >
          {{ financial(scope.row.change) }}
        </p>
      </template>
    </el-table-column>
    <el-table-column
      prop="change_percent"
      :label="$t('message.kotirovka.change_percent')"
      sortable
      align="right"
    >
      <template #default="scope">
        <p
          :style="{
            color: scope.row.change_percent < 0 ? 'red' : 'green',
          }"
          class="fw-medium"
        >
          {{ financial(scope.row.change_percent) }} %
        </p>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue'
  import http from '@/http'
  import { financial } from '@/components/kotirovka/utills'

  const activeNames = ref('1')
  const tableData = ref([])
  const selectedStock = ref({}) // Ref to hold the selected stock data
  const selectedRowId = ref(null)

  const emit = defineEmits(['select-stock'])

  const fetchTradeData = async () => {
    try {
      const response = await http.get(`iuzse/stock-screener/?mkt_id=STK`, {
        params: {
          page_size: '100',
        },
      })
      tableData.value = response.data.results

      if (tableData.value.length > 0) {
        selectedRowId.value = tableData.value[0].isin_code
        emit('select-stock', tableData.value[0]) // Emit the first row as the default selectedStock
      }
    } catch (error) {
      console.error('Error fetching trade data:', error)
    } finally {
    }
  }

  const handleRowClick = (row) => {
    selectedRowId.value = row.isin_code // Update selectedRowId with the clicked row ID
    emit('select-stock', row) // Emit the clicked stock data to TradeView
  }

  // Highlight active row by adding a custom row-class-name function
  const rowClassName = ({ row }) => {
    return row.isin_code === selectedRowId.value ? 'active-row' : ''
  }

  onMounted(() => {
    fetchTradeData()
  })
</script>

<style scoped></style>
