<template>
  <div class="title-container">
    <h3 class="header-title">
      {{ $t('message.license') }}
    </h3>
  </div>

  <div class="search-bar">
    <!--  <el-link :underline="false" type="primary" href="https://license.gov.uz/auth" > <el-button size="large" >   {{$t('message.getLicense')}} &nbsp;<el-icon  size="14" ><Right/></el-icon> </el-button></el-link>-->
    <a
      href="https://license.gov.uz/auth"
      target="_blank"
      class="btn btn-outline-primary text-nowrap d-flex align-items-center gap-1"
      ><el-icon size="14"><Right /></el-icon> {{ $t('message.getLicense') }}</a
    >
    <el-select
      v-model="serviceType"
      :placeholder="$t('message.ServiceName')"
      size="large"
      style="width: 850px"
      @change="selectChange"
    >
      <el-option
        v-for="item in serviceOptions"
        :key="item.value"
        :label="$t(`message.${item.label}`)"
        :value="item.value"
      />
    </el-select>

    <el-input
      v-model="orgSearch"
      :placeholder="$t('message.Organization')"
      size="large"
      style="width: 550px"
    />
    <el-input
      v-model="numberDoc"
      :placeholder="$t('message.DocumentNumber')"
      size="large"
      style="width: 250px"
    />

    <el-button
      size="large"
      style="background-color: #124483; color: #ffffff"
      @click="makeSearch"
    >
      <el-icon size="14" style="vertical-align: middle">
        <Search />
      </el-icon>
      <span style="vertical-align: middle"> {{ $t('message.Search') }} </span>
    </el-button>
    <el-button
      type="danger"
      size="large"
      style="background-color: red; padding: 10px; color: #ffffff; margin: 0"
      @click="clearFields"
    >
      <el-icon size="16" style="vertical-align: middle">
        <RefreshLeft />
      </el-icon>
      <span style="vertical-align: middle"> {{ $t('message.Clear') }} </span>
    </el-button>
  </div>

  <table v-loading="loading" class="table-main">
    <thead>
      <tr>
        <th>{{ $t('message.Organization') }}</th>
        <th>{{ $t('message.ServiceName') }}</th>
        <th>{{ $t('message.LicenseNumber') }}</th>
        <th>{{ $t('message.IssueDate') }}</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in LicenseData" class="license-card">
        <td class="table-cell border-left">
          <div class="table-title-cell org-name" style="width: 350px">
            <img
              v-if="item.logo_file"
              :src="`https://openinfo.uz/ru/media/${item.logo_file}`"
              class="license-logo"
              alt="logo"
            />
            <img
              v-else
              src="/src/assets/not-found.png"
              class="license-logo"
              alt="logo"
            />
            <p class="" style="font-weight: 600">{{ item.organization }}</p>
          </div>
        </td>
        <td class="table-cell" style="width: 450px">
          <div class="table-title-cell">
            {{ getServiceName(item?.activity_type) }}
          </div>
        </td>
        <td class="table-cell" style="width: 300px">
          <div class="table-title-cell text-center">
            {{ item.license_number }}
          </div>
        </td>
        <td class="table-cell" style="width: 300px">
          <div class="table-title-cell text-center">
            {{ item.issue_date }}
          </div>
        </td>
        <td class="table-cell border-right text-center" style="width: 100px">
          <div class="table-title-cell">
            <a
              :href="`https://openinfo.uz/ru/media/${item.pdf_file}`"
              target="_blank"
            >
              <img
                style="width: 22px"
                src="/src/assets/images/icons/pdf-icon2.svg"
                alt="pdfIcon"
              />
            </a>
          </div>
        </td>
      </tr>
    </tbody>
  </table>

  <div
    class="pagination d-flex justify-content-center mb-4 gap-3 align-items-end"
  >
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :hide-on-single-page="true"
      :current-page="currentPage"
      :page-count="totalPages"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
  import { useStore } from '@/stores/store'
  import { Search, Right, RefreshLeft } from '@element-plus/icons-vue'
  import { onMounted, ref } from 'vue'
  import axios from 'axios'
  import { ElNotification } from 'element-plus'
  import { useI18n } from 'vue-i18n'

  const orgSearch = ref('')
  const url = import.meta.env.VITE_APP_SERVER_URL
  const numberDoc = ref('')
  const serviceType = ref(null)
  const serviceOptions = ref([
    {
      value: '',
      label: 'all',
    },

    {
      value: 'investment_intermediary',
      label: 'investment_intermediary',
    },
    {
      value: 'investment_manager',
      label: 'investment_manager',
    },
    {
      value: 'investment_consultant',
      label: 'investment_consultant',
    },
  ])
  const store = useStore()
  const LicenseData = ref([])
  const totalPages = ref(null)
  const total = ref(null)
  const currentPage = ref(1)
  const startDate = ref(null)
  const endDate = ref(null)
  const loading = ref(false)
  const getLicenses = () => {
    loading.value = true
    axios
      .get(
        `${url}/brokers/licenses/?page=${currentPage.value}&activity_type=${serviceType.value ? serviceType.value : ''}&organization__icontains=${orgSearch.value}&license_number__icontains=${numberDoc.value}`,
        {
          method: 'get',
        },
      )
      .then((response) => {
        LicenseData.value = response.data.results
        totalPages.value = response.data.total_pages
        total.value = response.data.count
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

  const { t } = useI18n()
  const getServiceName = (type) => {
    switch (type) {
      case 'investment_intermediary':
        return t('message.investment_intermediary')
      case 'investment_manager':
        return t('message.investment_manager')
      case 'investment_consultant':
        return t('message.investment_consultant')
      default:
        return ''
    }
  }

  // const suggestionsList = ref([]);
  //
  // const querySearch = (queryString, cb) => {
  //   axios.get(`${url}/home/autofill/?name=${queryString}`).then((response) => {
  //     suggestionsList.value = response.data
  //
  //     // call callback function to return suggestions
  //     cb(suggestionsList.value);
  //
  //   }).catch((err) => {
  //     console.log(err, 'error')
  //   })
  //
  // };

  const selectChange = () => {
    currentPage.value = 1
  }

  const handleCurrentChange = (val) => {
    currentPage.value = val
    getLicenses()
  }

  const clearFields = () => {
    numberDoc.value = ''
    orgSearch.value = ''
    serviceType.value = null
    getLicenses()
  }

  const makeSearch = () => {
    currentPage.value = 1
    getLicenses()
  }

  onMounted(() => {
    getLicenses()
  })
</script>

<style scoped>
  .title-container {
    background: #094580;
    padding: 12px;
    width: 100%;
    text-align: center;
    border-radius: 8px;
    color: #ffffff;
  }

  .header-title {
    font-size: 18px;
    font-weight: 400;
    color: #ffffff;
    margin: 0;
  }

  table {
    color: #181818 !important;
    width: 100%;
    border-spacing: 0 16px;
    border-collapse: separate;
  }

  .license-card {
    width: 100%;
    background: #f6f6f6;
    border-radius: 8px;
    box-shadow: rgba(0, 0, 0, 0.05) 0 0 0 1px;
    /*display: flex;*/
    /*align-items: stretch;*/
    padding: 12px;
  }

  h5 {
    font-size: 14px;
    font-weight: 500;
    color: #124483;
    display: flex;
  }

  .license-logo {
    height: 70px;
    object-fit: contain;
    width: 70px;
    margin-right: 12px;
  }

  .border-left {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }

  .border-right {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }

  td {
    padding: 10px 12px;
  }

  .org-name {
    display: flex;
    align-items: center;
  }

  .table-cell {
    border-left: 1px solid rgba(229, 229, 229, 0.93);
    font-size: 14px;
    font-weight: 500;
    color: #124483;
    line-height: 1.4;
    vertical-align: middle;
  }

  .table-cell:first-child {
    border: none;
  }

  .table-main thead th {
    padding: 0 12px;
    font-size: 13px;
    color: #124483;
    font-weight: bold;
  }

  .table-title-cell {
    height: 100%;
  }

  .table-cell:not(:last-child):before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 1px;
    height: 48px;
    border-right: 1px dashed #eee;
  }
</style>
