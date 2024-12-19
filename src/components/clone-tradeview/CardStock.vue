<template>
  <el-card v-loading="loading" class="card-box" shadow="hover">
    <div v-if="selectedStock" class="card-content">
      <div class="stock-header">
        <div class="stock-price">
          <div class="stock-title">
            {{ selectedStock?.ticker || 'N/A' }}
          </div>
          <div class="stock-price">
            <span class="current-price">
              {{ selectedStock?.trade_price || '0' }} UZS</span
            >
            <span
              :class="[
                'price-change',
                isNegativeChange ? 'red-text' : 'green-text',
              ]"
            >
              {{ isNegativeChange ? '' : '+' }}
              {{ selectedStock?.change || '0' }} UZS
            </span>
          </div>
        </div>

        <el-tag
          :type="isNegativeChange ? 'danger' : 'success'"
          class="change-section"
          style="border-radius: 10px"
        >
          <span
            :class="[
              'change-percent',
              isNegativeChange ? 'red-text' : 'green-text',
            ]"
          >
            <el-icon
              class="change-icon"
              size="40"
              style="margin-right: 2px"
              :color="isNegativeChange ? 'red' : 'green-text'"
            >
              <Bottom v-if="isNegativeChange" />
              <Top v-if="!isNegativeChange" />
            </el-icon>
            {{ financial(selectedStock?.change_percent) || '0' }}%
          </span>
        </el-tag>
      </div>

      <el-divider class="divider" />

      <div class="stats">
        <div class="stat-item">
          <span>{{ $t('message.trade.market_cap') }}</span>
          <span class="blue-text text-end"
            >{{ divideByMillion(dataMore.market_capitalization) }} mln
          </span>
        </div>
        <div class="stat-item">
          <span>{{ $t('message.trade.common_stock') }}</span>
          <span class="blue-text"
            >{{ financial(dataMore.common_stock_portion) }}%</span
          >
        </div>
        <div class="stat-item">
          <span>{{ $t('message.trade.preferred_stock') }}</span>
          <span class="blue-text"
            >{{ financial(dataMore.preferred_stock_portion) }}%</span
          >
        </div>
        <div class="stat-item">
          <span
            >{{ $t('message.trade.profit_dynamicyear') }} ({{
              getYear(dataMore?.last_reporting_year)
            }})</span
          >
          <span class="blue-text"
            >{{ divideByMillion(dataMore.last_net_income) }} mln</span
          >
        </div>
      </div>
    </div>
    <div v-else class="no-stock">Please select a stock</div>
  </el-card>
</template>

<script setup>
  import { ElCard, ElDivider, ElIcon } from 'element-plus'
  import { Bottom, Top } from '@element-plus/icons-vue'

  import { computed, onMounted, ref, watch } from 'vue'
  import { divideByMillion, financial, getYear } from '../kotirovka/utills'
  import http from '@/http'

  const dataMore = ref({})
  const loading = ref(false)
  // Props
  const props = defineProps({
    selectedStock: {
      type: Object,
      default: () => ({}), // Ensures selectedStock is at least an empty object
    },
  })

  // Computed properties to display the correct change color
  const isNegativeChange = computed(() => {
    return props.selectedStock?.change < 0
  })

  // Optionally watch for changes to selectedStock to perform any additional actions (e.g., fetching more data)
  watch(
    () => props.selectedStock,
    async (newStock) => {
      if (newStock?.isin_code) {
        try {
          loading.value = true
          const response = await http.get(
            `/iuzse/stock-details/?isu_cd=${newStock.isin_code}`,
            {},
          )
          dataMore.value = response.data
        } catch (error) {
          console.error('Error fetching stock details:', error)
        } finally {
          loading.value = false
        }
      }
    },
    { immediate: true }, // Fetches data immediately if `selectedStock` is available on mount
  )

  onMounted(() => {})
</script>

<style scoped>
  /* (Keep your existing styles) */
</style>

<style scoped>
  .card-box {
    width: 100%;

    border-radius: 10px;
  }

  .card-box:hover {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
  .card-content {
    display: flex;
    flex-direction: column;
  }

  .stock-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .stock-title {
    font-size: 1.4em;
    font-weight: 600;
  }

  .stock-price {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .current-price {
    color: #1582c7; /* Main price color (blue) */
    font-size: 1.5em;
    font-weight: bold;
  }

  .price-change {
    font-size: 0.9em;
  }

  .change-section {
    display: flex;
    align-items: center;
    margin-top: 5px;
    justify-content: center;
    padding: 4px 10px;
  }

  .change-percent {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 1.2em;
  }

  .red-text {
    color: #d52c2c; /* Red for negative values */
  }

  .blue-text {
    color: #1582c7; /* Blue for positive/statistic values */
  }
  .green-text {
    color: #0cb866;
  }

  .divider {
    margin: 15px 0;
  }

  .stats {
    display: flex;
    flex-direction: column;
  }

  .stat-item {
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
    font-size: 1em;
  }
</style>
