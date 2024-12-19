<template>
  <div class="header-name title">
    <p>{{ $t('message.fact32') }}</p>
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
    <div v-if="data.approved_date" class="d-flex gap-2 align-items-end">
      <img
        src="/src/assets/images/icons/calendarwhite.svg"
        alt="iconCalendar"
        class="calendar"
      />
      {{ $t('message.data_approved') }}
      <i>{{
        new Date(data.approved_date).toLocaleDateString('ru-RU', options)
      }}</i>
    </div>
  </div>
  <div v-loading="loading" class="loader">
    <table class="table table-hover border-radius">
      <thead>
        <tr>
          <th class="table-header text-white" colspan="2">
            {{ $t('message.issuer_name') }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <th>{{ $t('message.full_name') }}</th>
          <td>{{ data.organization_name }}</td>
        </tr>
        <tr>
          <th>{{ $t('message.short_name') }}</th>
          <td>{{ data.organization_short_name_text }}</td>
        </tr>
        <tr>
          <th>{{ $t('message.stock_exchange_ticker') }}</th>
          <td>{{ data.org_ticket_number ? data.org_ticket_number : 'No' }}</td>
        </tr>
      </tbody>
    </table>

    <table class="table table-hover">
      <thead>
        <tr>
          <th class="table-header text-white" colspan="4">
            {{ $t('message.contact_details') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>{{ $t('message.location') }}</th>
          <td>{{ data.org_location }}</td>
        </tr>
        <tr>
          <th>{{ $t('message.postal_address') }}</th>
          <td>{{ data.org_address }}</td>
        </tr>
        <tr>
          <th>{{ $t('message.email_address') }}</th>
          <td>
            <a :href="`mailto:${data.org_email}`">{{ data.org_email }}</a>
          </td>
        </tr>
        <tr>
          <th>{{ $t('message.official_website') }}</th>
          <td>
            <a :href="`http://${data.org_website}`" target="_blank">
              {{ data.org_website }}</a
            >
          </td>
        </tr>
      </tbody>
    </table>

    <table class="table table-hover">
      <thead>
        <tr>
          <th class="table-header text-white" colspan="4">
            {{ $t('message.info_essential_facts') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th colspan="2">{{ $t('message.number_essential_fact') }}</th>
          <td colspan="2">{{ data.fact_number }}</td>
        </tr>

        <tr>
          <th colspan="2">{{ $t('message.name_essential_fact') }}</th>
          <td colspan="2">{{ data.fact_title }}</td>
        </tr>

        <tr>
          <th colspan="2">{{ $t('message.decision_making_body') }}</th>
          <td colspan="2">{{ data.person_emitet }}</td>
        </tr>
        <tr>
          <th colspan="2">{{ $t('message.decision_date') }}</th>
          <td colspan="2">
            {{
              new Date(data.date_solution).toLocaleDateString('ru-RU', options)
            }}
          </td>
        </tr>

        <tr>
          <th colspan="2">
            {{
              $t('message.date_of_the_meeting_of_the_authority_of_the_issuer')
            }}
          </th>
          <td colspan="2">
            {{
              new Date(data.date_parsect).toLocaleDateString('ru-RU', options)
            }}
          </td>
        </tr>

        <tr>
          <th colspan="4" class="text-center">
            {{ $t('message.accrual_of_dividends_on_common_shares') }}
          </th>
        </tr>
        <tr>
          <th colspan="2">{{ $t('message.in_sums_per_share') }}</th>
          <td colspan="2">{{ data.sum_aksiya }}</td>
        </tr>
        <tr>
          <th colspan="2">
            {{
              $t('message.as_a_percentage_of_the_nominal_value_of_one_share')
            }}
          </th>
          <td colspan="2">{{ data.one_procent }}</td>
        </tr>
        <tr>
          <th colspan="4" class="text-center">
            {{ $t('message.accrual_of_dividends_on_preferred_shares') }}
          </th>
        </tr>
        <tr>
          <th colspan="2">{{ $t('message.in_sums_per_share') }}</th>
          <td colspan="2">{{ data.sum_aksiya2 }}</td>
        </tr>
        <tr>
          <th colspan="2">
            {{
              $t('message.as_a_percentage_of_the_nominal_value_of_one_share')
            }}
          </th>
          <td colspan="2">{{ data.one_procent2 }}</td>
        </tr>

        <tr>
          <th colspan="4" class="text-center">
            {{ $t('message.accrual_of_income_on_corporate_bonds') }}
          </th>
        </tr>
        <tr>
          <th colspan="2">{{ $t('message.in_sums_per_bond') }}</th>
          <td colspan="2">{{ data.sum_per }}</td>
        </tr>
        <tr>
          <th colspan="2">
            {{ $t('message.as_a_percentage_of_the_nominal_value_of_one_bond') }}
          </th>
          <td colspan="2">{{ data.percentage_nominal }}</td>
        </tr>

        <tr>
          <th colspan="4" class="text-center">
            {{ $t('message.accrual_of_income_on_infrastructure_bonds') }}
          </th>
        </tr>
        <tr>
          <th colspan="2">{{ $t('message.in_sums_per_bond') }}</th>
          <td colspan="2">{{ data.sum_per2 }}</td>
        </tr>
        <tr>
          <th colspan="2">
            {{ $t('message.as_a_percentage_of_the_nominal_value_of_one_bond') }}
          </th>
          <td colspan="2">{{ data.percentage_nominal2 }}</td>
        </tr>

        <tr>
          <th colspan="4" class="text-center">
            {{ $t('message.accrual_of_income_on_infrastructure_bonds') }}
          </th>
        </tr>
        <tr>
          <th colspan="2">
            {{ $t('message.date_of_commencement_on_common_shares') }}
          </th>
          <td colspan="1" class="text-center">
            {{ $t('message.start_date_of_repurchase') }}
          </td>
          <td colspan="1" class="text-center">{{ $t('message.end_date') }}</td>
        </tr>

        <tr>
          <th colspan="2">{{ $t('message.for_common_shares') }}</th>
          <td colspan="1" class="text-center">
            {{
              data.start_date_common_shares
                ? new Date(data.start_date_common_shares).toLocaleDateString(
                    'ru-RU',
                    options,
                  )
                : '-'
            }}
          </td>
          <td colspan="1" class="text-center">
            {{
              data.end_date_common_shares
                ? new Date(data.end_date_common_shares).toLocaleDateString(
                    'ru-RU',
                    options,
                  )
                : '-'
            }}
          </td>
        </tr>
        <tr>
          <th colspan="2">{{ $t('message.on_common_shares') }}</th>
          <td colspan="1" class="text-center">
            {{
              data.start_date_ordinary_shares
                ? new Date(data.start_date_ordinary_shares).toLocaleDateString(
                    'ru-RU',
                    options,
                  )
                : '-'
            }}
          </td>
          <td colspan="1" class="text-center">
            {{
              data.end_date_ordinary_shares
                ? new Date(data.end_date_ordinary_shares).toLocaleDateString(
                    'ru-RU',
                    options,
                  )
                : '-'
            }}
          </td>
        </tr>
        <tr>
          <th colspan="2">{{ $t('message.on_preferred_shares') }}</th>
          <td colspan="1" class="text-center">
            {{
              data.start_date_other_securities
                ? new Date(data.start_date_other_securities).toLocaleDateString(
                    'ru-RU',
                    options,
                  )
                : '-'
            }}
          </td>
          <td colspan="1" class="text-center">
            {{
              data.end_date_other_securities
                ? new Date(data.end_date_other_securities).toLocaleDateString(
                    'ru-RU',
                    options,
                  )
                : '-'
            }}
          </td>
        </tr>
        <tr>
          <th colspan="2">{{ $t('message.on_corporate_bonds') }}</th>
          <td colspan="1" class="text-center">
            {{
              data.start_date_other_securities2
                ? new Date(
                    data.start_date_other_securities2,
                  ).toLocaleDateString('ru-RU', options)
                : '-'
            }}
          </td>
          <td colspan="1" class="text-center">
            {{
              data.end_date_other_securities2
                ? new Date(data.end_date_other_securities2).toLocaleDateString(
                    'ru-RU',
                    options,
                  )
                : '-'
            }}
          </td>
        </tr>

        <tr>
          <th colspan="2">{{ $t('message.on_infrastructure_bonds') }}</th>
          <td colspan="2" class="text-center">{{ data.form_of_payment }}</td>
        </tr>
      </tbody>
    </table>

    <table class="table table-hover table-bordered">
      <tbody>
        <tr>
          <th>{{ $t('message.executive_body_head_name') }}</th>
          <td>{{ data.head_person_name }}</td>
        </tr>

        <tr>
          <th>{{ $t('message.chief_accountant_full_name') }}</th>
          <td>{{ data.accountant_person_name }}</td>
        </tr>

        <tr>
          <th>{{ $t('message.authorized_person_full_name') }}</th>
          <td>{{ data.responsible_person_name }}</td>
        </tr>
      </tbody>
    </table>
    <div class="table-footer">
      {{ $t('message.fact_attention') }}
    </div>
    <!--    <div class="social-links">-->
    <!--      <img src="/src/assets/images/icons/pdf.svg" alt="pdfIcon"/>-->
    <!--      <img src="/src/assets/images/icons/facebook.svg" alt="facebookIcon"/>-->
    <!--      <img src="/src/assets/images/icons/twitter.svg" alt="twitterIcon"/>-->
    <!--    </div>-->
  </div>
</template>

<script setup>
  import { ref, onMounted, computed } from 'vue'
  import axios from 'axios'
  import { Search } from '@element-plus/icons-vue'
  import { useRoute } from 'vue-router'

  const data = ref([])

  const url = import.meta.env.VITE_APP_SERVER_URL
  const input = ref('')
  const options = ref(['1', '2', '3'])
  const selectValue = ref('')
  const dateValue = ref([])
  const loading = ref(false)
  const route = useRoute()
  const id = computed(() => route.params.factId)

  const getFactsById = () => {
    loading.value = true

    axios
      .get(`${url}/disclosure/fact32/${id.value}`, {
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

  const getByType = (method) => {
    switch (method) {
      case 1:
        return 'приобретение'
      case 2:
        return 'создание'
      case 3:
        return 'отчуждение'
      default:
        return 'ликвидация'
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
