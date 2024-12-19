<template>
  <div class="bulletin-container">
    <div class="left-panel">
      <CandlestickChart :isuCd="selectedIsuCd" />
    </div>
    <div class="right-panel">
      <div class="demo-collapse">
        <!-- Listen for the select-stock event and pass it to handleStockSelection -->
        <TestTradeView @select-stock="handleStockSelection" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import CandlestickChart from './CandlestickChart.vue'
  import TestTradeView from '../../clone-tradeview/TestTradeView.vue'

  const selectedIsuCd = ref(null)

  // Function to handle selected stock from TestTradeView
  const handleStockSelection = (stock) => {
    selectedIsuCd.value = stock.isin_code // Update with selected stock's isu_cd
    console.log('selected ticker', selectedIsuCd.value)
  }
</script>

<style scoped>
  .bulletin-container {
    display: flex;
    height: 100%;
    margin-bottom: 20px;
  }

  .left-panel {
    width: 70%;
    background-color: #fff;
    border-radius: 10px;
  }

  .right-panel {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 30%;
    background-color: #fff;
    border-radius: 10px;
    padding: 10px;
  }
</style>
