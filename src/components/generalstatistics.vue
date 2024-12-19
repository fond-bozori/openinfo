<template>
  <div class="general-statistics">
    <div class="general-title">
      {{ $t('message.General Statics') }}
    </div>

    <el-select
      v-model="selectedYear"
      class="w-50"
      placeholder="Select"
      size="large"
      @change="selectedQuarter = 'all'"
    >
      <el-option
        v-for="item in yearOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>

  <div>
    <table class="statistic-table">
      <thead>
        <tr>
          <th class="quater-buttons">
            <el-button type="success" @click="changeselectedQuarter('q1')">{{
              $t('message.q1')
            }}</el-button>
            <el-button type="success" @click="changeselectedQuarter('q2')">{{
              $t('message.q2')
            }}</el-button>
            <el-button type="success" @click="changeselectedQuarter('q3')">{{
              $t('message.q3')
            }}</el-button>
            <el-button type="success" @click="changeselectedQuarter('q4')">{{
              $t('message.q4')
            }}</el-button>
          </th>
          <th>{{ $t('message.jsc') }}</th>
          <th>{{ $t('message.llc') }}</th>
        </tr>
      </thead>
      <thead>
        <tr>
          <td>{{ $t('message.Total issuers') }}</td>
          <td>{{ data?.[selectedYear]?.[selectedQuarter]?.allEmitent.jsc }}</td>
          <td>{{ data?.[selectedYear]?.[selectedQuarter]?.allEmitent.llc }}</td>
        </tr>
      </thead>
      <thead>
        <tr>
          <td>{{ $t('message.Total diclosures') }}</td>
          <td>{{ data?.[selectedYear]?.[selectedQuarter].allinfo.jsc }}</td>
          <td>{{ data?.[selectedYear]?.[selectedQuarter].allinfo.llc }}</td>
        </tr>
      </thead>
      <thead>
        <tr>
          <td>{{ $t('message.Essential facts') }}</td>
          <td>{{ data?.[selectedYear]?.[selectedQuarter].facts.jsc }}</td>
          <td>{{ data?.[selectedYear]?.[selectedQuarter].facts.llc }}</td>
        </tr>
      </thead>
      <thead>
        <tr>
          <td>{{ $t('message.Prospectuses') }}</td>
          <td>{{ data?.[selectedYear]?.[selectedQuarter].emissions.jsc }}</td>
          <td>{{ data?.[selectedYear]?.[selectedQuarter].emissions.llc }}</td>
        </tr>
      </thead>
      <thead>
        <tr>
          <td>{{ $t('message.Quarterly reports') }}</td>
          <td>
            {{ data?.[selectedYear]?.[selectedQuarter].quarterReports.jsc }}
          </td>
          <td>
            {{ data?.[selectedYear]?.[selectedQuarter].quarterReports.llc }}
          </td>
        </tr>
      </thead>
      <thead>
        <tr>
          <td>{{ $t('message.Annual reports') }}</td>
          <td>
            {{ data?.[selectedYear]?.[selectedQuarter].annualReports.jsc }}
          </td>
          <td>
            {{ data?.[selectedYear]?.[selectedQuarter].annualReports.llc }}
          </td>
        </tr>
      </thead>
      <thead>
        <tr>
          <td>{{ $t('message.Charters') }}</td>
          <td>
            {{ data?.[selectedYear]?.[selectedQuarter].announcements.jsc }}
          </td>
          <td>
            {{ data?.[selectedYear]?.[selectedQuarter].announcements.llc }}
          </td>
        </tr>
      </thead>
    </table>
  </div>
</template>

<script setup>
  import { onBeforeMount, ref } from 'vue'
  import axios from 'axios'

  const selectedQuarter = ref('all')
  const selectedYear = ref('2024')

  const data = ref(null)
  const loading = ref(false)

  const changeselectedQuarter = (key) => {
    selectedQuarter.value = key
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

  const quarterOptions = [
    {
      value: 'q1',
      label: 'q1',
    },
    {
      value: 'q2',
      label: 'q2',
    },
    {
      value: 'q3',
      label: 'q3',
    },
    {
      value: 'q4',
      label: 'q4',
    },
  ]

  const url = import.meta.env.VITE_APP_SERVER_URL
  const getFactsById = () => {
    loading.value = true

    axios
      .get(`${url}/home/general-statistics/`, {
        method: 'get',
      })
      .then((response) => {
        data.value = response.data.result
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        loading.value = false
      })
  }

  onBeforeMount(async () => {
    await getFactsById()
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

  td,
  th {
    border: 1px solid #eee;
    text-align: center;
    padding: 8px;
  }

  th {
    font-size: 18px;
  }

  td:first-child {
    text-align: left;
  }

  tr:nth-child(even) {
    background-color: #f8f8f8;
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

  /* Remove focus outline */
  option:focus {
    outline: none;
  }

  /* Remove IE arrow */
  option::-ms-expand {
    display: none;
  }

  @media (max-width: 767px) {
    html {
      font-size: 14px;
    }
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
