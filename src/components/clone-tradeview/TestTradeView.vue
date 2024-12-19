<template>
  <CardStock :selected-stock="selectedStock" />
  <div class="Kotirovka-collapse table-white-header">
    <el-collapse v-model="activeNames" accordion>
      <el-collapse-item :title="$t('message.trade.stock')" name="1">
        <StkTable @select-stock="updateSelectedStock" />
      </el-collapse-item>
      <el-collapse-item :title="$t('message.trade.bond')" name="2">
        <BNDTable @select-stock="updateSelectedStock" />
      </el-collapse-item>

      <el-collapse-item
        :title="$t('message.kotirovka.exchange_rates')"
        name="3"
      >
        <ExchangeRatesTable @select-stock="updateSelectedStock" />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import StkTable from '@/components/clone-tradeview/StkTable.vue'
  import BNDTable from '@/components/clone-tradeview/BNDTable.vue'
  import ExchangeRatesTable from '@/components/clone-tradeview/ExchangeRatesTable.vue'

  const activeNames = ref('1')
  const selectedStock = ref({})

  // Emit function to communicate with the parent
  const emit = defineEmits(['select-stock'])

  // Function to update selected stock and emit to parent
  const updateSelectedStock = (stock) => {
    selectedStock.value = stock
    emit('select-stock', stock) // Emit the selected stock to the parent
  }
</script>
