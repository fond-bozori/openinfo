<template>
  <div class="header-name title">{{ t('message.calculator.title') }}</div>

  <div class="calculator-container">
    <h5 class="title-calc">
      {{ t('message.calculator.info_about') }}
    </h5>
    <div class="calc-form">
      <el-form class="w-100" label-position="top">
        <div class="d-flex gap-5">
          <el-form-item
            class="w-100"
            :label="`${t('message.calculator.quantity')} ${formattedQuantity ? formattedQuantity.toLocaleString() : ''}`"
          >
            <el-input-number
              v-model="quantity"
              :controls="false"
              class="w-100"
              placeholder="0"
              size="large"
              step-strictly
              :min="0"
              :max="100000000000000"
            />
          </el-form-item>

          <el-form-item
            class="w-100"
            :label="`${t('message.calculator.price')} ${formattedUnitPrice ? formattedUnitPrice.toLocaleString() : ''}`"
          >
            <el-input-number
              v-model="unitPrice"
              :controls="false"
              class="w-100"
              placeholder="0"
              size="large"
              :min="0"
              :max="100000000000000"
            />
          </el-form-item>

          <el-form-item
            class="w-100"
            :label="`${t('message.calculator.broker_commission')} (%)`"
          >
            <el-input-number
              v-model="brokerCommission"
              :min="0"
              :max="100"
              :controls="false"
              class="w-100"
              placeholder="0%"
              size="large"
            />
          </el-form-item>
        </div>

        <div class="d-flex w-100 gap-5 align-content-center">
          <el-form-item class="w-75 gap-5 d-flex justify-content-start">
            <div class="d-flex gap-3">
              <p class="tab-title text-nowrap">
                {{ t('message.calculator.type_operation') }}:
              </p>
              <el-radio-group v-model="typeOperation">
                <el-radio size="large" label="sell">{{
                  t('message.calculator.buy')
                }}</el-radio>
                <el-radio size="large" label="buy">{{
                  t('message.calculator.sell')
                }}</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>

          <el-form-item
            v-if="typeOperation === 'sell'"
            class="w-50 d-flex justify-content-start"
          >
            <el-radio-group v-model="typeOperationContinue">
              <el-radio size="large" label="1">{{
                t('message.calculator.first_hand')
              }}</el-radio>
              <el-radio size="large" label="2">{{
                t('message.calculator.second_hand')
              }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>

        <el-form-item class="w-100">
          <p class="tab-title w-100">
            {{ t('message.calculator.trading_areas') }}
          </p>
          <el-tabs
            v-model="selectedBoard"
            class="demo-tabs w-100"
            type="border-card"
          >
            <el-tab-pane name="main" label="Main (G1)">
              <el-radio-group v-model="mainStockType">
                <el-radio border size="large" label="STK">STK</el-radio>
                <el-radio border size="large" label="SMS">SMS</el-radio>
                <el-radio border size="large" label="BND">BND</el-radio>
                <el-radio border size="large" label="SMB">SMB</el-radio>
              </el-radio-group>
            </el-tab-pane>
            <el-tab-pane name="nego" label="Nego (T1)">
              <el-radio-group v-model="negoStockType">
                <el-radio border size="large" label="STK">STK</el-radio>
                <el-radio border size="large" label="SMS">SMS</el-radio>
                <el-radio border size="large" label="BND">BND</el-radio>
              </el-radio-group>
            </el-tab-pane>
            <el-tab-pane name="fop" label="FOP (NC)">
              <el-radio-group v-model="fopStockType">
                <el-radio border size="large" label="STK">STK</el-radio>
                <el-radio border size="large" label="SMS">SMS</el-radio>
              </el-radio-group>
            </el-tab-pane>

            <el-tab-pane name="ipo" label="IPO/SPO/PO">
              <el-radio-group v-model="ipoStockType">
                <el-radio border size="large" label="STK">STK</el-radio>
              </el-radio-group>
            </el-tab-pane>
          </el-tabs>
        </el-form-item>

        <el-form-item
          :label="`${t('message.calculator.transaction_amount')}: ${transactionAmount.toLocaleString()}`"
        >
          <el-input
            v-model="transactionAmount"
            class="w-100"
            placeholder=""
            readonly
            size="large"
          />
        </el-form-item>

        <el-form-item
          v-if="typeOperation === 'sell'"
          :label="`${t('message.calculator.total_broker_commission')}: ${totalCommissionCostsSell.toLocaleString()}`"
        >
          <el-input
            v-model="totalCommissionCostsSell"
            class="w-100"
            placeholder=""
            readonly
            size="large"
          />
        </el-form-item>

        <el-form-item
          v-if="typeOperation === 'buy'"
          :label="`${t('message.calculator.total_broker_commission')}: ${totalCommissionCostsBuy.toLocaleString()}`"
        >
          <el-input
            v-model="totalCommissionCostsBuy"
            class="w-100"
            placeholder=""
            readonly
            size="large"
          />
        </el-form-item>

        <el-form-item
          v-if="typeOperation === 'buy'"
          :label="`${t('message.calculator.total_costs')}: ${totalCostsBuy.toLocaleString()}`"
        >
          <el-input
            v-model="totalCostsBuy"
            class="w-100"
            placeholder=""
            readonly
            size="large"
          />
        </el-form-item>

        <el-form-item
          v-if="typeOperation === 'sell'"
          :label="`${t('message.calculator.total_costsSell')}: ${totalCostsSell.toLocaleString()}`"
        >
          <el-input
            v-model="totalCostsSell"
            class="w-100"
            placeholder=""
            readonly
            size="large"
          />
        </el-form-item>
      </el-form>
    </div>
  </div>

  <TableForTarrifs />
</template>

<script setup>
  import { ElRadio, ElRadioGroup } from 'element-plus'
  import { computed, ref } from 'vue'
  import TableForTarrifs from '@/components/calculator-for-tarrif/TableForTarrifs.vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const radio = ref(3)
  const quantity = ref(0)
  const unitPrice = ref(0)
  const brokerCommission = ref(0)

  const selectedBoard = ref('main')
  const mainStockType = ref('STK')
  const negoStockType = ref('STK')
  const fopStockType = ref('STK')
  const repoStockType = ref('STK')
  const ipoStockType = ref('STK')

  const typeOperation = ref('sell')
  const typeOperationContinue = ref('1')

  // function parseFormattedNumber(formattedNumber) {
  //   // Ensure the input is a string
  //   if (typeof formattedNumber !== 'string') {
  //     formattedNumber = String(formattedNumber);
  //   }
  //
  //   // Remove commas and whitespace
  //   let cleanedNumber = formattedNumber.replace(/,/g, '').trim();
  //
  //   // Parse the cleaned number to a float
  //   let parsedNumber = parseFloat(cleanedNumber);
  //
  //   // Check if the parsed number is a valid number
  //   if (isNaN(parsedNumber)) {
  //     throw new Error('Invalid formatted number');
  //   }
  //
  //   return parsedNumber;
  // }

  function formatNumber(number) {
    if (number) {
      return number.toLocaleString()
    } else return number
  }

  const transactionAmount = computed(() => {
    return quantity.value * unitPrice.value
  })

  const formattedUnitPrice = computed(() => {
    return unitPrice.value
  })

  const formattedQuantity = computed(() => {
    return quantity.value
  })

  const isLessThanTenBillion = () => {
    return transactionAmount.value <= 10000000000
  }
  const isLessThanHundredBillion = () => {
    return transactionAmount.value <= 10000000000
  }

  const CalculateComission = () => {
    switch (selectedBoard.value) {
      case 'main':
        switch (mainStockType.value) {
          case 'STK':
            if (isLessThanTenBillion()) {
              return 0.36
            } else {
              return 0.26
            }
          case 'BND':
            return 0.0555
          case 'SMS':
            if (isLessThanTenBillion()) {
              return 0.48
            } else {
              return 0.38
            }
          case 'SMB':
            return 0.131
          default:
            return null // or some default value
        }
      case 'nego':
        switch (negoStockType.value) {
          case 'STK':
            if (isLessThanHundredBillion()) {
              return 0.26
            } else {
              return 0.16
            }
          case 'BND':
            return 0.0555
          case 'SMS':
            if (isLessThanHundredBillion()) {
              return 0.48
            } else {
              return 0.38
            }
          case 'SMB':
            return 0.091
          default:
            return null // or some default value
        }
      case 'fop':
        switch (fopStockType.value) {
          case 'STK':
          case 'SMS':
            return 0.1
          default:
            return null // or some default value
        }
      case 'ipo':
        switch (ipoStockType.value) {
          case 'STK':
            return 0.3
          default:
            return null // or some default value
        }
      default:
        return null // or some default value
    }
  }
  const CalculateTaxWhenSell = () => {
    switch (selectedBoard.value) {
      case 'main':
        switch (mainStockType.value) {
          case 'STK':
            return 0.01
          case 'BND':
            return 0.01
          case 'SMS':
            return 0.3
          case 'SMB':
            return 0.3
          default:
            return null // or some default value
        }
      case 'nego':
        switch (negoStockType.value) {
          case 'STK':
            return 0.01
          case 'BND':
            return 0.01
          case 'SMS':
            return 0.3
          case 'SMB':
            return 0.3
          default:
            return null // or some default value
        }
      case 'fop':
        switch (fopStockType.value) {
          case 'STK':
            return 0.01
          case 'SMS':
            return 0.3
          default:
            return null // or some default value
        }
      case 'ipo':
        switch (ipoStockType.value) {
          case 'STK':
            return 0.01
          default:
            return null // or some default value
        }
      default:
        return null // or some default value
    }
  }

  const totalCommissionCostsSell = computed(() => {
    const totalComission = CalculateComission()
    const tax = CalculateTaxWhenSell()
    if (typeOperationContinue.value === '1') {
      return Number(
        (transactionAmount.value * totalComission) / 100 +
          transactionAmount.value * (brokerCommission.value / 100),
      ).toFixed(2)
    } else if (typeOperationContinue.value === '2') {
      return Number(
        (transactionAmount.value * totalComission) / 100 +
          transactionAmount.value * (brokerCommission.value / 100) +
          transactionAmount.value * (tax / 100),
      )
        .toFixed(2)
        .toString()
    }
  })

  const totalCostsSell = computed(() => {
    return transactionAmount.value - totalCommissionCostsSell.value
  })

  const totalCommissionCostsBuy = computed(() => {
    const totalComission = CalculateComission()
    return (
      (transactionAmount.value * totalComission) / 100 +
      transactionAmount.value * (brokerCommission.value / 100)
    )
  })

  const totalCostsBuy = computed(() => {
    return transactionAmount.value + totalCommissionCostsBuy.value
  })
</script>

<style scoped>
  .header-name {
    border-radius: 10px;
    text-transform: uppercase;
    color: #fff;
    text-align: center;
    height: 50px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #124483;
  }

  .calculator-container {
    background: #eaf5ff;
    padding: 20px 40px 40px 40px;
    border-radius: 10px;
    margin-top: 20px;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }

  .title-calc {
    color: #048430;
    text-align: center;
    margin-bottom: 28px;
  }

  .tab-title {
    color: #048430;
    text-align: center;
    margin: 20px 0;
    font-size: 22px;
  }
</style>
