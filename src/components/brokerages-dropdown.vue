<template>
  <div class="custom-dropdown">
    <!-- Dropdown for selecting year -->
    <el-select v-model="internalSelectedYear" @change="handleYearChange">
      <el-option
        v-for="year in years"
        :key="year"
        :label="`${$t('message.brokerages-dropdown.trading_for_year', { year })}`"
        :value="year"
      ></el-option>
    </el-select>

    <!-- Display selected data details if available -->
    <div v-if="selectedData" class="details">
      <!-- Display quantity of transactions for the selected year -->
      <div class="quantity">
        {{ $t('message.brokerages-dropdown.quantity') }} :
        {{
          selectedData
            .find((item) => item?.year === internalSelectedYear)
            ?.transactions_count.toLocaleString('ru-RU') || 0
        }}
      </div>
      <!-- Display amount of transactions for the selected year -->
      <div class="amount">
        {{ $t('message.brokerages-dropdown.amount') }} :
        {{
          selectedData
            .find((item) => item?.year === internalSelectedYear)
            ?.transactions_amount.toLocaleString('ru-RU') || 0
        }}
        {{ $t('message.brokerages-dropdown.sum') }}
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue'

  import { ElSelect, ElOption } from 'element-plus'
  import { defineEmits } from 'vue'

  // Define props
  const props = defineProps({
    years: {
      type: Array,
      required: true,
    },
    selectedYear: {
      type: Number,
      required: true,
    },
    selectedData: {
      type: Array,
      required: true,
    },
  })

  // Define emits
  const emit = defineEmits(['year-change'])

  // Reactive variables
  const internalSelectedYear = ref(props.selectedYear)

  // Handle year change
  const handleYearChange = (year) => {
    internalSelectedYear.value = year
    emit('year-change', year)
  }

  // Watch for changes in selectedYear prop
  watch(
    () => props.selectedYear,
    (newVal) => {
      internalSelectedYear.value = newVal
    },
  )
</script>

<style scoped>
  .custom-dropdown {
    display: flex;
    flex-direction: column;
    max-width: 20%;
    width: 100%;
    margin: 0 auto;
  }

  .details {
    display: flex;
    flex-direction: column;
  }

  .quantity,
  .amount {
    margin-bottom: 10px;
    font-size: 16px;
    padding: 10px;
  }
</style>
