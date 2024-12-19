<template>
  <div class="table-responsive">
    <table
      v-if="store.$state.nameSuffix === 1"
      class="table table-hover table-bordered mt-xxl-4 table-responsive-sm"
    >
      <thead>
        <tr>
          <th
            class="text-center"
            colspan="18"
            style="border: none; border-radius: 8px 8px 0 0"
          >
            {{ $t('message.key_financial_indicators') }}
          </th>
        </tr>
        <tr>
          <th class="table-header text-center">
            {{ $t('message.indicator') }}
          </th>
          <th v-for="item in FinancialData" class="text-center">
            {{ item.reporting_year }}
          </th>
        </tr>
      </thead>
      <tbody>
        <el-tooltip
          class="box-item tooltip"
          effect="dark"
          :content="$t('message.net_margin')"
          placement="bottom-start"
          :offset="5"
          hide-after="100"
          show-after="200"
        >
          <tr>
            <td>{{ $t('message.net_margin-title') }}</td>
            <td v-for="item in FinancialData">{{ item.net_profit_margin }}</td>
          </tr>
        </el-tooltip>

        <el-tooltip
          class="box-item"
          effect="dark"
          :content="$t('message.return_on_equity')"
          placement="bottom-start"
          :offset="5"
          :show-arrow="false"
          hide-after="100"
          show-after="200"
        >
          <tr>
            <td>{{ $t('message.ROE') }}</td>
            <td v-for="item in FinancialData">{{ item.return_on_equity }}</td>
          </tr>
        </el-tooltip>
        <el-tooltip
          class="box-item"
          effect="dark"
          :content="$t('message.return_on_assets')"
          placement="bottom-start"
          :offset="5"
          :show-arrow="false"
          hide-after="100"
          show-after="200"
        >
          <tr>
            <td>{{ $t('message.ROA') }}</td>
            <td v-for="item in FinancialData">{{ item.return_on_assets }}</td>
          </tr>
        </el-tooltip>
        <el-tooltip
          class="box-item"
          effect="dark"
          :content="$t('message.debt_ratio')"
          placement="bottom-start"
          :offset="5"
          :show-arrow="false"
          hide-after="100"
          show-after="200"
        >
          <tr>
            <td>{{ $t('message.debt_ratio-title') }} (%)</td>
            <td v-for="item in FinancialData">{{ item.debt_ratio }}</td>
          </tr>
        </el-tooltip>
        <el-tooltip
          class="box-item"
          effect="dark"
          :content="$t('message.debt_to_equity')"
          placement="bottom-start"
          :offset="5"
          :show-arrow="false"
          hide-after="100"
          show-after="200"
        >
          <tr>
            <td>{{ $t('message.debt_to_equity-title') }} (%)</td>
            <td v-for="item in FinancialData">
              {{ item.debt_to_equity_ratio }}
            </td>
          </tr>
        </el-tooltip>
      </tbody>
    </table>
  </div>

  <div class="table-responsive table-responsive-sm">
    <table
      v-if="store.$state.nameSuffix === 5"
      class="table table-hover table-responsive table-responsive-sm table-bordered mt-xxl-4"
    >
      <thead>
        <tr>
          <th
            class="text-center"
            colspan="18"
            style="border: none; border-radius: 8px 8px 0 0"
          >
            {{ $t('message.key_financial_indicators') }}
            ({{ $t('message.ths sum') }})
          </th>
        </tr>
        <tr>
          <th class="table-header text-center">
            {{ $t('message.indicator') }}
          </th>
          <th v-for="item in FinancialData" class="text-center">
            {{ item.reporting_year }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ $t('message.total_assets') }}</td>
          <td v-for="item in FinancialData">
            {{
              item?.total_assets
                ?.toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
            }}
          </td>
        </tr>

        <tr>
          <td>{{ $t('message.Total_Bank_Equity') }}</td>
          <td v-for="item in FinancialData">
            {{
              item.total_equity
                ?.toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
            }}
          </td>
        </tr>

        <el-tooltip
          class="box-item"
          effect="dark"
          :content="$t('message.Return_on_Assets(ROA)')"
          placement="bottom-start"
          :offset="5"
          :show-arrow="false"
          hide-after="100"
          show-after="200"
        >
          <tr>
            <td>{{ $t('message.ROA') }}</td>
            <td v-for="item in FinancialData">{{ item.return_on_assets }}</td>
          </tr>
        </el-tooltip>

        <el-tooltip
          class="box-item"
          effect="dark"
          :content="$t('message.Return_on_Equity(ROE)')"
          placement="bottom-start"
          :offset="5"
          :show-arrow="false"
          hide-after="100"
          show-after="200"
        >
          <tr>
            <td>{{ $t('message.ROE') }}</td>
            <td v-for="item in FinancialData">{{ item.return_on_equity }}</td>
          </tr>
        </el-tooltip>
        <el-tooltip
          class="box-item"
          effect="dark"
          :content="$t('message.Cost_of_Risk(COR)')"
          placement="bottom-start"
          :offset="5"
          :show-arrow="false"
          hide-after="100"
          show-after="200"
        >
          <tr>
            <td>{{ $t('message.COR') }}</td>
            <td v-for="item in FinancialData">{{ item.net_profit_margin }}</td>
          </tr>
        </el-tooltip>
      </tbody>
    </table>
  </div>

  <div class="table-responsive">
    <table
      v-if="store.$state.nameSuffix === 6"
      class="table table-hover table-bordered mt-xxl-4"
    >
      <thead>
        <tr>
          <th
            class="text-center"
            colspan="18"
            style="border: none; border-radius: 8px 8px 0 0"
          >
            {{ $t('message.key_financial_indicators') }}
            ({{ $t('message.ths sum') }})
          </th>
        </tr>
        <tr>
          <th class="table-header text-center">
            {{ $t('message.indicator') }}
          </th>
          <th v-for="item in FinancialData" class="text-center">
            {{ item.reporting_year }}
          </th>
        </tr>
      </thead>
      <tbody>
        <el-tooltip
          class="box-item"
          effect="dark"
          :content="$t('message.ROA-tooltip')"
          placement="bottom-start"
          :offset="5"
          :show-arrow="false"
          hide-after="100"
          show-after="200"
        >
          <tr>
            <td>{{ $t('message.ROA') }}</td>
            <td v-for="item in FinancialData">{{ item.return_on_assets }}</td>
          </tr>
        </el-tooltip>
        <el-tooltip
          class="box-item"
          effect="dark"
          :content="$t('message.ROE-tooltip')"
          placement="bottom-start"
          :offset="5"
          :show-arrow="false"
          hide-after="100"
          show-after="200"
        >
          <tr>
            <td>{{ $t('message.ROE') }}</td>
            <td v-for="item in FinancialData">{{ item.return_on_equity }}</td>
          </tr>
        </el-tooltip>
        <el-tooltip
          class="box-item"
          effect="dark"
          :content="$t('message.Insurance_Reserves')"
          placement="bottom-start"
          :offset="5"
          :show-arrow="false"
          hide-after="100"
          show-after="200"
        >
          <tr>
            <td>{{ $t('message.Insurance_Reserves') }}</td>
            <td v-for="item in FinancialData">
              {{
                item.insurance_reserves
                  ?.toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
              }}
            </td>
          </tr>
        </el-tooltip>

        <el-tooltip
          class="box-item"
          effect="dark"
          :content="$t('message.Insurance_Reserves_Level')"
          placement="bottom-start"
          :offset="5"
          :show-arrow="false"
          hide-after="100"
          show-after="200"
        >
          <tr>
            <td>{{ $t('message.insurance-level-title') }} (%)</td>
            <td v-for="item in FinancialData">{{ item.insurance_level }}</td>
          </tr>
        </el-tooltip>

        <el-tooltip
          class="box-item"
          effect="dark"
          :content="$t('message.equity_level')"
          placement="bottom-start"
          :offset="5"
          :show-arrow="false"
          hide-after="100"
          show-after="200"
        >
          <tr>
            <td>{{ $t('message.equity-level-title') }} (%)</td>
            <td v-for="item in FinancialData">{{ item.equity_level }}</td>
          </tr>
        </el-tooltip>
      </tbody>
    </table>
  </div>
</template>

<script setup>
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
  import axios from 'axios'
  import { ElNotification } from 'element-plus'
  import { useRoute } from 'vue-router'
  import { useStore } from '@/stores/store'

  const route = useRoute()
  const url = import.meta.env.VITE_APP_SERVER_URL
  const loading = ref(false)
  const id = computed(() => route.params.id)
  const FinancialData = ref([])
  const store = useStore()

  const getKeyFinIndicator = () => {
    loading.value = true
    axios
      .get(`${url}/reports/financial_indicators/?organization_id=${id.value}`, {
        method: 'get',
      })
      .then((response) => {
        FinancialData.value = response.data.results
      })
      .catch(({ response }) => {
        ElNotification({
          type: 'error',
          message: response.data.message || 'Malumot olishda xatolik bor!',
        })
      })
      .finally(() => {
        loading.value = false
      })
  }

  onMounted(() => {
    getKeyFinIndicator()
  })

  onBeforeUnmount(() => {
    store.setCurrentSuffix(null)
  })
</script>

<style scoped>
  table {
  }

  thead {
    font-size: 18px;
    background-color: #094580;
    color: #ffffff;
    border-radius: 10px;
  }

  th {
    font-weight: 600;
    background-color: #094580;
    color: #ffffff;
    border: none;
  }

  td {
    color: #535353;
    text-align: center;
    padding: 12px;
  }

  table {
    border-radius: 8px;
  }

  tr td:first-child {
    /* CSS properties here */
    font-weight: 600;
    text-align: left;
  }
</style>
