<template>
  <div
    class="flex-container"
    v-for="(item, index) in formattedTradeData"
    :key="index"
  >
    <StatsButton
      :buttonText="$t('message.transaction_volume')"
      :amount="item.total_volume_of_transactions"
    />
    <StatsButton
      :buttonText="$t('message.number_of_issuers')"
      :amount="item.total_issuers"
    />
    <StatsButton
      :buttonText="$t('message.number_of_securities')"
      :amount="item.total_number_of_securities"
    />
    <h1 class="hq">{{ $t('message.number_of_trading_accounts') }}</h1>

    <StatsButton
      :buttonText="$t('message.buy')"
      :amount="item.total_buy_account_numbers"
    />
    <StatsButton
      :buttonText="$t('message.sell')"
      :amount="item.total_sell_account_numbers"
    />
  </div>
</template>

<script setup>
  import { ref, computed, watch } from 'vue'
  import http from '../../../http/index.js'
  import StatsButton from '../components/StatsButton.vue'

  const props = defineProps({
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
  })

  const loading = ref(false)
  const tradeData = ref([])

  const formattedTradeData = computed(() => {
    return tradeData.value.map((item) => ({
      total_volume_of_transactions: parseFloat(
        item.total_volume_of_transactions,
      ).toLocaleString('ru-RU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      total_issuers: parseInt(item.total_issuers).toLocaleString('ru-RU'),
      total_number_of_securities: parseInt(
        item.total_number_of_securities,
      ).toLocaleString('ru-RU'),
      total_buy_account_numbers: parseInt(
        item.total_buy_account_numbers,
      ).toLocaleString('ru-RU'),
      total_sell_account_numbers: parseInt(
        item.total_sell_account_numbers,
      ).toLocaleString('ru-RU'),
    }))
  })

  const fetchData = async () => {
    try {
      loading.value = true
      const response = await http.get(
        `iuzse/trade-analytics/?start_date=${props.startDate}&end_date=${props.endDate}`,
      )
      tradeData.value = [response.data]
    } catch (err) {
      console.log(err)
    } finally {
      loading.value = false
    }
  }

  // Watch for changes in startDate or endDate props and refetch data
  watch(
    () => [props.startDate, props.endDate],
    () => {
      fetchData()
    },
  )

  fetchData()
</script>

<style scoped>
  .flex-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 40%;
  }

  .flex-container > * {
    margin-bottom: 10px;
  }
  .hq {
    text-align: justify;
    color: #000;
    font-size: smaller;
    align-items: flex-end;
  }
</style>
