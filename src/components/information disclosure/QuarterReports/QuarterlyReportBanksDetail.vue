<template>
  <div class="header-name title d-flex">
    <p>{{ $t('message.quarly_reports_title1') }}</p>
    <p v-if="data.quarter_no">
      {{ getQuarter(data?.quarter_no) + '-' }}{{ $t('message.quarter') }} ({{
        data?.reporting_year?.split('-')[0]
      }})
    </p>
  </div>
  <div class="name-of-fact justify-content-between">
    <div class="d-flex gap-2 align-items-end">
      <img
        src="/src/assets/images/icons/calendarwhite.svg"
        alt="iconCalendar"
        class="calendar"
      />
      {{ $t('message.date_recognized') }}
      <i>{{ new Date(data.pub_date).toLocaleDateString('ru-RU', options) }} </i>
    </div>
    <div class="d-flex gap-2 align-items-end">
      <img
        src="/src/assets/images/icons/calendarwhite.svg"
        alt="iconCalendar"
        class="calendar"
      />
      {{ $t('message.data_approved') }}
      <i v-if="data.approved_date">{{
        new Date(data.approved_date).toLocaleDateString('ru-RU', options)
      }}</i>
      <i v-else
        >{{ new Date(data.pub_date).toLocaleDateString('ru-RU', options) }}
      </i>
    </div>
  </div>

  <div v-loading="loading" class="loader">
    <table class="table table-hover border-radius">
      <thead>
        <tr>
          <th class="table-header text-white" colspan="2">
            {{ $t('message.name_of_the_issuer') }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <th>{{ $t('message.full_name') }}</th>
          <td>{{ data.organization?.full_name_text }}</td>
        </tr>
        <tr>
          <th>{{ $t('message.short_name') }}</th>
          <td>{{ data.organization?.short_name_text }}</td>
        </tr>
        <tr>
          <th>{{ $t('message.stock_exchange_ticker') }}</th>
          <td>
            {{
              data.organization?.exchange_ticket_name
                ? data.organization?.exchange_ticket_name
                : 'No'
            }}
          </td>
        </tr>
      </tbody>
    </table>

    <table class="table table-hover">
      <thead>
        <tr>
          <th class="table-header text-white" colspan="2">
            {{ $t('message.contact_details') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>{{ $t('message.location') }}</th>
          <td>{{ data.organization?.location }}</td>
        </tr>
        <tr>
          <th>{{ $t('message.postal_address') }}</th>
          <td>{{ data.organization?.address }}</td>
        </tr>
        <tr>
          <th>{{ $t('message.email_address') }}</th>
          <td>
            <a :href="`mailto:${data.organization?.email}`">{{
              data.organization?.email
            }}</a>
          </td>
        </tr>
        <tr>
          <th>{{ $t('message.official_website') }}</th>
          <td>
            <a :href="`http://${data.organization?.web_site}`" target="_blank">
              {{ data.organization?.web_site }}</a
            >
          </td>
        </tr>
      </tbody>
    </table>

    <table class="table table-hover">
      <thead>
        <tr>
          <th class="table-header text-white" colspan="2">
            {{ $t('message.bank requisites') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>{{ $t('message.Name of the servicing bank') }}</th>
          <td>{{ data.organization?.serving_bank }}</td>
        </tr>

        <tr>
          <th>{{ $t('message.Current account number') }}</th>
          <td>{{ data.organization?.account_number }}</td>
        </tr>
        <tr>
          <th>{{ $t('message.mfOs') }}</th>
          <td>{{ data.organization?.mfo }}</td>
        </tr>
      </tbody>
    </table>

    <table class="table table-hover">
      <thead>
        <tr>
          <th class="table-header text-white" colspan="2">
            {{ $t('message.registration and identical numbers') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>{{ $t('message.assigned by the registering authority') }}</th>
          <td>{{ data.organization?.gov_reg_number }}</td>
        </tr>
        <tr>
          <th>{{ $t('message.assigned by the state tax service body') }}</th>
          <td>{{ data.organization?.inn }}</td>
        </tr>
        <tr>
          <th class="text-center" colspan="2">
            {{ $t('message.assigned by the state statistics bodies') }}
          </th>
        </tr>

        <tr>
          <th>{{ $t('message.kfc') }}</th>
          <td>{{ data.organization?.kfs }}</td>
        </tr>
        <tr>
          <th>{{ $t('message.okpo') }}</th>
          <td>{{ data.organization?.okpo }}</td>
        </tr>
        <tr>
          <th>{{ $t('message.okonx') }}</th>
          <td>{{ data.organization?.okonx }}</td>
        </tr>
        <tr>
          <th>{{ $t('message.coato') }}</th>
          <td>{{ data.organization?.soato }}</td>
        </tr>
      </tbody>
    </table>
    <table class="table table-hover">
      <thead>
        <tr>
          <th class="table-header text-white" colspan="6">
            {{ $t('message.Balance sheet') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="text-center">{{ $t('message.Category') }}</td>

          <td class="text-center">{{ $t('message.ths sum') }}</td>
        </tr>

        <tr v-for="item in data.quarter_balance_sheet_report">
          <th
            :class="{ 'text-center': item.is_title }"
            :colspan="item.is_title ? '6' : '1'"
          >
            {{ item.title }}
          </th>
          <td v-if="!item.is_title" class="text-center">
            {{ item.value1?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') }}
          </td>
          <td v-if="!item.is_title" class="text-center">
            {{ item.value2?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') }}
          </td>
        </tr>
      </tbody>
    </table>

    <table class="table table-hover">
      <thead>
        <tr>
          <th class="table-header text-white" colspan="6">
            {{ $t('message.Report on financial results') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data.quarter_financial_results_report">
          <th
            :class="{ 'text-center': item.is_title }"
            :colspan="item.is_title ? '6' : '1'"
          >
            {{ item.title }}
          </th>
          <td v-if="!item.is_title" class="text-center">
            {{ item.value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') }}
          </td>
          <!--        <td v-if="!item.is_title" class="text-center">{{ item.value2?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') }}</td>-->
        </tr>
      </tbody>
    </table>

    <table class="table table-hover table-bordered">
      <thead>
        <tr>
          <th class="table-header text-white" colspan="2">
            {{ $t('message.responsible') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data.quarter_report_resp">
          <th>{{ item.title }}</th>
          <td>{{ item.value }}</td>
        </tr>
      </tbody>
    </table>

    <div class="table-footer">
      {{
        $t(
          'message.issuer_responsible_for_information_accuracy_and_completeness',
        )
      }}
    </div>

    <div class="social-links">
      <a
        :href="`${url}/reports/export-excel/?report_type=${data?.type === 2 ? 'quarter' : 'annual'}&org_type=bank&report_id=${id}&lang=${store.$state.currentLanguage}`"
        target="_blank"
        download
      >
        <img src="/src/assets/images/icons/Excel-icon.svg" alt="pdfIcon"
      /></a>
      <a
        :href="`https://openinfo.uz/ru/reports/to_pdf${data?.parent_id}/`"
        target="_blank"
        download
      >
        <img src="/src/assets/images/icons/pdf.svg" alt="pdfIcon"
      /></a>
      <!--      <img src="/src/assets/images/icons/facebook.svg" alt="facebookIcon"/>-->
      <!--      <img src="/src/assets/images/icons/twitter.svg" alt="twitterIcon"/>-->
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, computed } from 'vue'
  import axios from 'axios'
  import { Search } from '@element-plus/icons-vue'
  import { useRoute } from 'vue-router'
  import { useStore } from '@/stores/store'

  const data = ref([])

  const url = import.meta.env.VITE_APP_SERVER_URL
  const input = ref('')
  const options = ref(['1', '2', '3'])
  const selectValue = ref('')
  const dateValue = ref([])
  const loading = ref(false)
  const route = useRoute()
  const id = computed(() => route.params.id)
  const store = useStore()

  const getFactsById = () => {
    loading.value = true
    axios
      .get(`${url}/reports/bank/quarter/${id.value}/`, {
        method: 'get',
      })
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

  const getQuarter = (method) => {
    switch (method) {
      case '2':
        return '1'
      case '5':
        return '2'
      case '7':
        return '3'
      case '10':
        return '4'
    }
  }

  onMounted(() => {
    window.scrollTo(0, 0)
    getFactsById()
  })
</script>

<style scoped>
  .header-name {
    /* background: #124483; */
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
    gap: 20px;
  }

  .search-bar {
    display: flex;
    margin: 20px 0;
    gap: 10px;
  }

  th {
    width: 50%;
  }

  thead {
    background: #124483;
  }

  .table-footer {
    background: #831234;
    height: 59px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 20px;
  }

  .social-links {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
    gap: 10px;
  }

  .table-header {
    background: #124483;
  }

  table {
    border: 1px solid #ddd;
    border-collapse: separate;
    border-left: 0;
    border-radius: 10px 10px 0 0;
    border-spacing: 0px;
  }
  thead {
    display: table-header-group;
    vertical-align: middle;
    border-color: inherit;
    border-collapse: separate;
  }
  tr {
    display: table-row;
    vertical-align: inherit;
    border-color: inherit;
  }
  th,
  td {
    padding: 5px 4px 6px 4px;
    text-align: left;
    vertical-align: top;
    border-left: 1px solid #ddd;
    text-transform: capitalize;
  }
  td {
    border-top: 1px solid #ddd;
  }

  th {
    border-top: 1px solid #ddd;
  }

  thead:first-child tr:first-child th:first-child,
  tbody:first-child tr:first-child td:first-child {
    border-radius: 10px 10px 0 0;
  }

  thead th {
    border-radius: 10px 10px 0 0;
  }

  /*.header-name {*/
  /*  margin:10px 0 ;*/
  /*}*/

  .name-of-fact {
    background: green;
    height: 50px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 10px 0 20px 0;
    padding: 20px;
    justify-content: center;
  }
</style>
