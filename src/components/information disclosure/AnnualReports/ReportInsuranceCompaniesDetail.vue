<template>
  <div class="header-name title">
    <p>
      {{ $t('message.yearly_reports_title') }} ({{
        data.reporting_year?.split('-')[0]
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
      <tbody>
        <tr>
          <th>{{ $t('message.issuer_body') }}</th>
          <td>{{ data?.emitent_body }}</td>
        </tr>
        <tr>
          <th>{{ $t('message.Date of approval of the report') }}</th>
          <td>{{ data?.approval_date }}</td>
        </tr>
      </tbody>
    </table>

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
            {{ $t('message.fin_indicators') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data.annual_activity_report">
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
    <table class="table table-hover">
      <thead>
        <tr>
          <th class="table-header text-white" colspan="6">
            {{ $t('message.income_volume') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data.accrued_income_report">
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
    <table class="table table-hover">
      <thead>
        <tr>
          <th class="table-header text-white" colspan="6">
            {{ $t('message.existing_liabilities') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data.existing_debt_report">
          <th
            :class="{ 'text-center': item.is_title }"
            :colspan="item.is_title ? '6' : '1'"
          >
            {{ item.title }}
          </th>
          <td v-if="!item.is_title" class="text-center">{{ item.value }}</td>
        </tr>
      </tbody>
    </table>
    <table class="table table-hover">
      <thead>
        <tr>
          <th class="table-header text-white" colspan="6">
            {{ $t('message.changes_in_board') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="text-center">{{ $t('message.decision_date') }}</td>
          <td class="text-center">
            {{ $t('message.position_start') }}
          </td>
          <td class="text-center" style="min-width: 300px">
            {{ $t('message.full_name_candidates') }}
          </td>
          <td class="text-center" style="min-width: 300px">
            {{ $t('message.position_in_other_organizations') }}
          </td>
          <td class="text-center" style="min-width: 200px">
            {{ $t('message.decision_making_body') }}
          </td>
          <td class="text-center" style="min-width: 250px">
            {{ $t('message.elected') }}
          </td>
        </tr>

        <tr v-for="item in data.personnel_change_report">
          <th>{{ item.change_date }}</th>
          <th>{{ item.start_date }}</th>
          <td>{{ item.personnel_name }}</td>
          <td>{{ item.personnel_responsibility }}</td>
          <td>{{ item.auth_body }}</td>
          <td>
            {{
              item.chg_result === '1'
                ? 'Избран (назначен)'
                : 'выведен из состава (уволен)'
            }}
          </td>
        </tr>
      </tbody>
    </table>

    <table class="table table-hover">
      <thead>
        <tr>
          <th class="table-header text-white" colspan="6">
            {{ $t('message.main_info') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data.additional_stock_submission_report">
          <th
            :class="{ 'text-center': item.is_title }"
            :colspan="item.is_title ? '6' : '1'"
          >
            {{ item.title }}
          </th>
          <td v-if="!item.is_title" class="text-center">{{ item.value }}</td>
        </tr>
      </tbody>
    </table>

    <table class="table table-hover">
      <thead>
        <tr>
          <th class="table-header text-white" colspan="6">
            {{ $t('message.issued_essential_facts_year') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="text-center">{{ $t('message.name_essential_fact') }}</td>
          <td class="text-center">{{ $t('message.number_essential_fact') }}</td>
          <td class="text-center">
            {{ $t('message.occurrence_date') }}
          </td>
          <td class="text-center">
            {{ $t('message.pub_date') }}
          </td>
        </tr>
        <tr v-for="item in data.facts_report">
          <th>{{ item.fact }}</th>
          <td class="text-center">{{ item.fact_number }}</td>
          <td class="text-center">{{ item.date }}</td>
          <td class="text-center">{{ item.misc }}</td>
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
          <td>{{ $t('message.The name of the indicator') }}</td>
          <td>{{ $t('message.Page code') }}</td>
          <td>{{ $t('message.At the beginning of the reporting period') }}</td>
          <td>{{ $t('message.At the end of the reporting period') }}</td>
        </tr>

        <tr v-for="item in data.balance_sheet_report">
          <th
            :class="{ 'text-center': item.is_title }"
            :colspan="item.is_title ? '6' : '1'"
          >
            {{ item.title }}
          </th>
          <td v-if="!item.is_title" class="text-center">{{ item.tnum }}</td>
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
        <tr>
          <td rowspan="2">{{ $t('message.The name of the indicator') }}</td>
          <td class="text-center" rowspan="2" style="min-width: 100px">
            {{ $t('message.Page code') }}
          </td>
          <td colspan="2">
            {{ $t('message.For the corresponding period of last year') }}
          </td>
          <td colspan="2">{{ $t('message.For the reporting period') }}</td>
        </tr>

        <tr>
          <td>{{ $t('message.income (profit)') }}</td>
          <td>{{ $t('message.expenses (losses)') }}</td>
          <td>{{ $t('message.income (profit)') }}</td>
          <td>{{ $t('message.expenses (losses)') }}</td>
        </tr>

        <tr v-for="item in data.financial_results_report">
          <th
            :class="{ 'text-center': item.is_title }"
            :colspan="item.is_title ? '6' : '1'"
          >
            {{ item.title }}
          </th>
          <td v-if="!item.is_title" class="text-center">{{ item.tnum }}</td>
          <td v-if="!item.is_title" class="text-center">
            {{ item.value1?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') }}
          </td>
          <td v-if="!item.is_title" class="text-center">
            {{ item.value2?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') }}
          </td>
          <td v-if="!item.is_title" class="text-center">
            {{ item.value3?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') }}
          </td>
          <td v-if="!item.is_title" class="text-center">
            {{ item.value4?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') }}
          </td>
        </tr>
      </tbody>
    </table>

    <table class="table table-hover table-bordered">
      <thead>
        <tr>
          <th class="table-header text-white" colspan="8">
            {{ $t('message.audit_results') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="text-center">
            {{ $t('message.audit_organization') }}
          </td>
          <td class="text-center">{{ $t('message.license_issue_date') }}</td>
          <td class="text-center">{{ $t('message.licence_number') }}</td>
          <td class="text-center">{{ $t('message.agreement_type') }}</td>
          <td class="text-center">
            {{ $t('message.audit_decision_issue_date') }}
          </td>
          <td class="text-center">{{ $t('message.audit_decision_number') }}</td>
          <td class="text-center">
            {{ $t('message.auditor_name') }}
          </td>
          <td class="text-center">{{ $t('message.copy_audit_results') }}</td>
        </tr>
        <tr v-for="item in data.audition_result_report">
          <td>{{ item.org_name }}</td>
          <td>{{ item.license_date }}</td>
          <td>{{ item.license_number }}</td>
          <td>{{ item.conclusion_type }}</td>
          <td>{{ item.conclusion_date }}</td>
          <td>{{ item.conclusion_number }}</td>
          <td>{{ item.auditor_name }}</td>
          <td>
            <a
              v-if="item.conclusion_file"
              :href="`https://openinfo.uz/media/${item.conclusion_file}`"
              target="_blank"
              >Загрузить</a
            >
          </td>
        </tr>
      </tbody>
    </table>

    <table class="table table-hover table-bordered">
      <thead>
        <tr>
          <th class="table-header text-white" colspan="4">
            {{ $t('message.affiliates') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="text-center">
            {{ $t('message.name') }}
          </td>
          <td class="text-center">
            {{ $t('message.location_detail') }}
          </td>
          <td class="text-center">
            {{ $t('message.legal_base') }}
          </td>
          <td class="text-center">
            {{ $t('message.occurance_date') }}
          </td>
        </tr>
        <tr v-for="item in data.affiliates_list_report">
          <td>{{ item.name }}</td>
          <td>{{ item.location }}</td>
          <td>{{ item.lg_basis }}</td>
          <td>{{ item.lg_basis_date }}</td>
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
        :href="`${url}/reports/export-excel/?report_type=${data?.type === 2 ? 'quarter' : 'annual'}&org_type=insurance&report_id=${id}&lang=${store.$state.currentLanguage}`"
        target="_blank"
        download
      >
        <img src="/src/assets/images/icons/Excel-icon.svg" alt="pdfIcon"
      /></a>

      <a
        :href="`https://openinfo.uz/ru/reports/to_pdf${data?.parent_id}/`"
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
      .get(`${url}/reports/insurance/annual/${id.value}/`, {
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
