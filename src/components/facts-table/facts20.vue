<template>
  <div class="header-name title">
    <p>{{ $t('message.fact20') }}</p>
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
          <th class="table-header text-white" colspan="2">
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
          <th class="table-header text-white" colspan="2">
            {{ $t('message.info_essential_facts') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>{{ $t('message.number_essential_fact') }}</th>
          <td>{{ data.fact_number }}</td>
        </tr>

        <tr>
          <th>{{ $t('message.name_essential_fact') }}</th>
          <td>{{ data.fact_title }}</td>
        </tr>

        <tr>
          <th>{{ $t('message.counterparty_name') }}</th>
          <td>{{ data.name_counterparty }}</td>
        </tr>

        <tr>
          <th>{{ $t('message.counterparty_postal_address') }}</th>
          <td>{{ data.location_counterparty }}</td>
        </tr>
        <tr>
          <th>
            {{
              $t(
                'message.the_issuers_body_that_made_the_decision_on_the_transaction',
              )
            }}
          </th>
          <td>{{ data.decision_transaction }}</td>
        </tr>
        <tr>
          <th>{{ $t('message.decision_date') }}</th>
          <td>
            {{
              new Date(data.date_decision).toLocaleDateString('ru-RU', options)
            }}
          </td>
        </tr>
        <tr>
          <th>
            {{
              $t(
                'message.the_value_of_the_issuers_net_assets_at_the_end_of_the_quarter_preceding_the_date_of_the_transaction',
              )
            }}
          </th>
          <td>
            {{
              data?.carrying_value
                ?.toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
            }}
          </td>
        </tr>

        <tr>
          <th>{{ $t('message.transaction_date') }}</th>
          <td>
            {{
              new Date(data.date_transaction).toLocaleDateString(
                'ru-RU',
                options,
              )
            }}
          </td>
        </tr>

        <tr>
          <th>{{ $t('message.transaction_amount_sum') }}</th>
          <td>
            {{
              data.transaction_amount
                ?.toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
            }}
          </td>
        </tr>

        <tr>
          <th>{{ $t('message.transaction_size_from_net_assets_percent') }}</th>
          <td>{{ data.assets_issuer }}</td>
        </tr>

        <tr>
          <th>{{ $t('message.transaction_type') }}</th>
          <td>{{ data.type_transaction }}</td>
        </tr>

        <tr>
          <th>{{ $t('message.transaction_subject') }}</th>
          <td>{{ data.subject_matter }}</td>
        </tr>
        <tr>
          <th>{{ $t('message.issuer_role_in_transaction') }}</th>
          <td>
            {{
              data.issuer_transaction === '1' ? 'Приобретатель' : 'Отчуждатель'
            }}
          </td>
        </tr>
        <tr>
          <th colspan="2" class="text-center">
            <a :href="data.fact_own_link">
              {{
                $t(
                  'message.this_publication_is_available_on_the_Issuers_corporate_website',
                )
              }}
            </a>
          </th>
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
      .get(`${url}/disclosure/fact20/${id.value}`, {
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

  const getMeetingByType = (method) => {
    switch (method) {
      case 1:
        return 'Основные средства '
      case 2:
        return 'в том числе недвижимость '
      case 3:
        return 'Долгосрочные инвестиции '
      case 4:
        return 'в том числе ценные бумаги'
      case 5:
        return 'Денежные средства'
      default:
        return 'Другое имущество'
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

  .name-of-fact {
    background: green;
    height: 50px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    margin: 10px 0 20px 0;
    padding: 20px;
    justify-content: center;
  }

  .el-table {
    border-radius: 10px 10px 0 0;
  }
</style>
