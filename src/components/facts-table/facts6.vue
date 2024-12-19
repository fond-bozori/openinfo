<template>
  <div class="header-name title">
    <p>{{ $t('message.fact6') }}</p>
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
          <th>{{ $t('message.meeting_type') }}</th>
          <td>{{ getMeetingByType(data.meeting_type) }}</td>
        </tr>

        <tr>
          <th>{{ $t('message.meeting_date') }}</th>
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
          <th>{{ $t('message.registration_date_of_amendments') }}</th>
          <td>
            {{
              new Date(data.date_minutes).toLocaleDateString('ru-RU', options)
            }}
          </td>
        </tr>

        <tr>
          <th>{{ $t('message.meeting_location') }}</th>
          <td>{{ data.venue_meeting }}</td>
        </tr>
        <tr>
          <th>{{ $t('message.quorum') }}</th>
          <td>{{ data.quorum_general }}</td>
        </tr>
      </tbody>
    </table>

    <table v-if="data.facts_voting_results" class="table table-hover">
      <tbody>
        <tr>
          <th rowspan="3" colspan="6">
            {{ $t('message.voting_questions_and_results') }}
          </th>
          <th class="text-center" colspan="6">
            {{ $t('message.voting_results') }}
          </th>
        </tr>

        <tr>
          <td class="text-center" colspan="2">{{ $t('message.votes_for') }}</td>
          <td class="text-center" colspan="2">
            {{ $t('message.votes_against') }}
          </td>
          <td class="text-center" colspan="2">{{ $t('message.abstained') }}</td>
        </tr>

        <tr>
          <td class="text-center">{{ $t('message.percentage') }}</td>
          <td class="text-center">{{ $t('message.count') }}</td>
          <td class="text-center">{{ $t('message.percentage') }}</td>
          <td class="text-center">{{ $t('message.count') }}</td>
          <td class="text-center">{{ $t('message.percentage') }}</td>
          <td class="text-center">{{ $t('message.count') }}</td>
        </tr>

        <tr v-for="item in data.facts_voting_results">
          <td colspan="6">{{ item?.question_name }}</td>
          <td class="text-center">{{ item.yes_percent }}</td>
          <td class="text-center">{{ item.yes_sum }}</td>
          <td class="text-center">{{ item.no_percent }}</td>
          <td class="text-center">{{ item.no_sum }}</td>
          <td class="text-center">{{ item.abstentions_percent }}</td>
          <td class="text-center">{{ item.abstentions_sum }}</td>
        </tr>
      </tbody>
    </table>

    <table
      v-if="data.facts_decisions_wording"
      class="table table-hover table-bordered"
    >
      <thead>
        <tr>
          <th class="table-header text-white" colspan="2">
            {{ $t('message.meeting_resolution') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data.facts_decisions_wording">
          <td style="padding: 8px 16px" colspan="2">
            {{ item.decisions_wording }}
          </td>
        </tr>
      </tbody>
    </table>

    <table
      v-if="data.facts_compensation_for_executives"
      class="table table-hover table-bordered"
    >
      <thead>
        <tr>
          <th class="table-header text-white" colspan="7">
            {{ $t('message.dividends') }}:
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="text-center">{{ $t('message.full_name_candidates') }}</td>
          <td class="text-center">
            {{ $t('message.organization_body_name') }}
          </td>
          <td class="text-center">
            {{ $t('message.payment_type') }}
          </td>
          <td class="text-center">{{ $t('message.accrued_amount') }}</td>
          <td class="text-center">
            {{ $t('message.accrual_period') }}
          </td>
          <td class="text-center" colspan="2">
            {{ $t('message.payment_document') }}
          </td>
        </tr>

        <tr v-for="item in data.facts_compensation_for_executives">
          <td>{{ item.executive_name }}</td>
          <td>{{ item.executive_position }}</td>
          <td>{{ item.compensation_type }}</td>
          <td>{{ item.compensation_amount }}</td>
          <td>{{ item.compensation_period }}</td>
          <td>{{ item.compensation_basis }}</td>
        </tr>
      </tbody>
    </table>

    <table
      v-if="data.facts_candidate_info"
      class="table table-hover table-bordered"
    >
      <thead>
        <tr>
          <th class="table-header text-white" colspan="6">
            {{ $t('message.election_of_supervisory_board_members') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="text-center" colspan="5">
            {{ $t('message.candidates_information') }}
          </td>
          <td rowspan="3" class="text-center" colspan="1">
            {{ $t('message.vote_count') }}
          </td>
        </tr>

        <tr>
          <td class="text-center" rowspan="2">
            {{ $t('message.full_name_candidates') }}
          </td>
          <td class="text-center" colspan="2">
            {{ $t('message.place_of_work_and_position') }}
          </td>
          <td colspan="2" class="text-center">
            {{ $t('message.owned_shares') }}
          </td>
        </tr>

        <tr>
          <td class="text-center">{{ $t('message.place_of_work') }}</td>
          <td class="text-center">
            {{ $t('message.position_in_other_organizations') }}
          </td>
          <td class="text-center">{{ $t('message.quantity_shares') }}</td>
          <td class="text-center">{{ $t('message.type_shares') }}</td>
        </tr>

        <tr v-for="item in data.facts_candidate_info">
          <td style="padding: 8px 16px">{{ item.name }}</td>
          <td style="padding: 8px 16px">{{ item.job }}</td>

          <!-- backend da hali malumot yo'q -->
          <td style="padding: 8px 16px">-</td>
          <td style="padding: 8px 16px">{{ item.stock_count }}</td>
          <td class="text-center" style="padding: 8px 16px">
            {{
              item.stock_type === 1
                ? 'простая'
                : item.stock_type === 2
                  ? 'привилегированная'
                  : '-'
            }}
          </td>
          <td style="padding: 8px 16px">{{ item.vote_count }}</td>
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
      .get(`${url}/disclosure/fact6/${id.value}`, {
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
        return 'годовое'
      default:
        return 'внеочередное'
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
    padding: 8px 16px;
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
