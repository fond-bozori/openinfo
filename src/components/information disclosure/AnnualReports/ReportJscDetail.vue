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
        alt="iconCalendar"
        class="calendar"
        src="/src/assets/images/icons/calendarwhite.svg"
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
            {{ $t('Показатели финансово-экономического состояния эмитента') }}
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
          <td v-if="!item.is_title" class="text-center">{{ item.value }}</td>
        </tr>
      </tbody>
    </table>
    <table class="table table-hover">
      <thead>
        <tr>
          <th class="table-header text-white" colspan="6">
            {{
              $t('Объем начисленных доходов по ценным бумагам в отчетном году')
            }}
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
          <td v-if="!item.is_title" class="text-center">{{ item.value }}</td>
        </tr>
      </tbody>
    </table>

    <table class="table table-hover">
      <thead>
        <tr>
          <th class="table-header text-white" colspan="6">
            {{
              $t('Имеющаяся задолженность по выплате доходов по ценным бумагам')
            }}
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
          <th class="table-header text-white" colspan="8">
            {{
              $t(
                'Изменения в составе наблюдательного совета, ревизионной комиссии или исполнительного органа',
              )
            }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td colspan="2" class="text-center" style="min-width: 400px">
            {{ $t('Дата изменений') }}
          </td>
          <td class="text-center" style="min-width: 200px" rowspan="2">
            {{ $t('message.full_name_candidates') }}
          </td>
          <td class="text-center" style="min-width: 200px" rowspan="2">
            {{ $t('message.position_in_other_organizations') }}
          </td>
          <td class="text-center" rowspan="2">
            {{ $t('message.decision_making_body') }}
          </td>
          <td class="text-center" style="min-width: 100px" rowspan="2">
            {{
              $t(
                'Избран (назначен) / выведен из состава (уволен, истечение срока полномочий',
              )
            }}
          </td>
        </tr>

        <tr>
          <td class="text-center">{{ $t('message.decision_date') }}</td>
          <td class="text-center">
            {{ $t('дата вступления к обязанностям') }}
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
            {{
              $t(
                'Основные сведения о дополнительно выпущенных ценных бумагах (заполняется, если в отчетном периоде осуществлялся выпуск ценных бумаг)',
              )
            }}
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
            {{
              $t('Существенные факты в деятельности эмитента за отчетный год')
            }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="text-center">{{ $t('message.name_essential_fact') }}</td>
          <td class="text-center">{{ $t('message.number_essential_fact') }}</td>
          <td class="text-center">
            {{ $t('Дата наступления существенного факта	') }}
          </td>
          <td class="text-center">
            {{ $t('Дата публикации существенного факта	') }}
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
          <td class="text-center">
            {{ $t('message.The name of the indicator') }}
          </td>
          <td class="text-center">{{ $t('message.Page code') }}</td>
          <td class="text-center">
            {{ $t('message.At the beginning of the reporting period') }}
          </td>
          <td class="text-center">
            {{ $t('message.At the end of the reporting period') }}
          </td>
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
          <td
            v-if="!item.is_title"
            class="text-center"
            style="min-width: 150px"
          >
            {{ item.value4?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') }}
          </td>
        </tr>
      </tbody>
    </table>

    <table class="table table-hover table-bordered">
      <thead>
        <tr>
          <th class="table-header text-white" colspan="8">
            {{ $t('Сведения о результатах аудиторской проверки') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="text-center">
            {{ $t('Наименование аудиторской организации') }}
          </td>
          <td class="text-center">{{ $t('Дата выдачи лицензии') }}</td>
          <td class="text-center">{{ $t('Номер лицензии') }}</td>
          <td class="text-center">{{ $t('Вид заключения') }}</td>
          <td class="text-center">
            {{ $t('Дата выдачи аудиторского заключения') }}
          </td>
          <td class="text-center">{{ $t('Номер аудиторского заключения') }}</td>
          <td class="text-center">
            {{ $t('Ф.И.О. аудитора (аудиторов), проводившего проверку') }}
          </td>
          <td class="text-center">{{ $t('Копия аудиторского заключения') }}</td>
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
            {{
              $t(
                'Список аффилированных лиц (по состоянию на конец отчетного года)',
              )
            }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="text-center">
            {{ $t('Ф.И.О. или полное наименование') }}
          </td>
          <td class="text-center">
            {{
              $t(
                'Местонахождение (местожительство) (государство, область, город, район)',
              )
            }}
          </td>
          <td class="text-center">
            {{
              $t(
                'Основание, по которому они признаются аффилированными лицами)',
              )
            }}
          </td>
          <td class="text-center">
            {{ $t('Дата (наступления основания (-ий))') }}
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
        :href="`${url}/reports/export-excel/?report_type=${data?.type === 2 ? 'quarter' : 'annual'}&org_type=jsc&report_id=${id}&lang=${store.$state.currentLanguage}`"
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
  import { computed, onMounted, ref } from 'vue'
  import axios from 'axios'
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
      .get(`${url}/reports/jsc/annual/${id.value}/`, {
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
