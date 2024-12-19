<template>
  <div class="general-statistics mt-4">
    <div class="w-100 justify-content-between d-flex align-items-center">
      {{ $t('message.top') }} 5
      <el-select
        v-model="selectedTopOption"
        style="width: 80%"
        :placeholder="$t('message.issuers by income')"
        size="large"
        @change="changeSelection"
      >
        <el-option
          v-for="item in topOption"
          :key="item.value"
          :label="$t(`message.${item.label}`)"
          :value="item.value"
        />
      </el-select>
    </div>
  </div>

  <div>
    <table v-loading="loading" class="statistic-table">
      <thead>
        <tr>
          <th class="quater-buttons w-100">
            <el-button
              type="success"
              @click="changeselectedQuarter('quarter1')"
              >{{ $t('message.q1') }}</el-button
            >
            <el-button
              type="success"
              @click="changeselectedQuarter('quarter2')"
              >{{ $t('message.q2') }}</el-button
            >
            <el-button
              type="success"
              @click="changeselectedQuarter('quarter3')"
              >{{ $t('message.q3') }}</el-button
            >
            <el-button
              type="success"
              @click="changeselectedQuarter('quarter4')"
              >{{ $t('message.q4') }}</el-button
            >
          </th>
          <th>
            <el-select
              v-model="selectedYear"
              class="w-100"
              style="min-width: 100px"
              placeholder="Select"
              @change="changeSelectedYear"
            >
              <el-option
                v-for="item in yearOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </th>
        </tr>
      </thead>
      <thead>
        <tr v-for="item in data?.[selectedQuarter]">
          <td v-if="selectedTopOption === 'income'">
            {{ item.main_report__organization__short_name_text }}
          </td>
          <td v-if="selectedTopOption === 'information-disclosure'">
            {{ item.organization__short_name_text }}
          </td>

          <td v-if="selectedTopOption === 'income'">
            {{ item.value3?.toLocaleString('ru') }}
            <span style="font-size: 12px">{{ $t('message.ths sum') }} </span>
          </td>
          <td
            v-if="selectedTopOption === 'information-disclosure'"
            style="text-align: right"
          >
            {{ item.fact_count }}
          </td>
        </tr>
      </thead>
    </table>
  </div>
</template>

<script setup>
  import { onBeforeMount, ref } from 'vue'
  import axios from 'axios'

  const annual = 'annual'

  const selectedQuarter = ref(annual)

  const selectedYear = ref('2023')

  const data = ref(null)
  const loading = ref(false)

  const changeselectedQuarter = (key) => {
    selectedQuarter.value = key
  }

  const changeSelectedYear = () => {
    selectedQuarter.value = annual
    getTopEmitents()
  }

  const yearOptions = [
    {
      value: '2020',
      label: '2020',
    },
    {
      value: '2021',
      label: '2021',
    },
    {
      value: '2022',
      label: '2022',
    },
    {
      value: '2023',
      label: '2023',
    },
    {
      value: '2024',
      label: '2024',
    },
  ]

  const topOption = [
    {
      value: 'income',
      label: 'income',
    },
    {
      value: 'information-disclosure',
      label: 'information-disclosure',
    },
  ]

  const selectedTopOption = ref(topOption[0].value)

  const changeSelection = () => {
    getTopEmitents()
  }

  const url = import.meta.env.VITE_APP_SERVER_URL
  const getTopEmitents = () => {
    loading.value = true

    axios
      .get(
        `${url}/home/top-issuers/?year=${selectedYear.value}&top_by=${selectedTopOption.value}`,
        {
          method: 'get',
        },
      )
      .then((response) => {
        data.value = response.data
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        loading.value = false
      })
  }

  onBeforeMount(() => {
    getTopEmitents()
  })
</script>

<style scoped>
  table {
    font-size: 14px;
    border-radius: 10px;
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
    border: 1px solid #eee;
  }

  th {
    border-bottom: 1px dashed #eee;
    padding: 14px;
    background: rgb(230, 243, 255);
    font-size: 18px;
  }

  tr:last-child {
    border-radius: 8px;
  }

  td {
    border-top: 1px dashed #eee;
    border-bottom: 1px dashed #9e9e9e;
    text-align: center;
    padding: 14px;
    align-content: center;
  }

  td:first-child {
    text-align: left;
  }

  .statistic-table {
    font-weight: bold;
    color: rgb(18 68 131);
  }

  /* Style the tab */
  .statistic-table {
    font-weight: bold;
    color: rgb(18 68 131);
  }

  h1 {
    text-align: center;
    margin: 2rem 0;
    font-size: 2.5rem;
  }

  .general-statistics {
    display: flex;
    justify-content: space-between;
    background-color: #094580;
    height: 56px;
    border-radius: 10px 10px 0 0;
    color: #fff;
    align-items: center;
    padding: 15px 20px;
  }

  th {
    text-align: left;
  }

  .quater-buttons button:focus {
    outline: none;
    border: none;
  }

  .quater-buttons button:active {
    outline: none;
    border: none;
  }

  .quater-buttons .el-button {
    background: #5cb85c !important;
    padding: 5px;
    margin: 0 5px;
  }

  .general-year-select option {
    height: 50px;
    border-radius: 0;
  }
</style>
