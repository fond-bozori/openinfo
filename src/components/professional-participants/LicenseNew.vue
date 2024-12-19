<template>
  <div class="title-container">
    <h3 class="header-title">
      {{ $t('message.license') }}
    </h3>
  </div>

  <div class="search-bar">
    <el-select
      v-model="serviceType"
      :placeholder="$t('message.all')"
      size="large"
      style="width: 750px"
      @change="selectChange"
    >
      <el-option
        v-for="item in serviceOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>

    <el-autocomplete
      v-model="orgSearch"
      :fetch-suggestions="querySearch"
      :trigger-on-focus="false"
      class="inline-input w-100"
      clearable
      :placeholder="$t('message.placeholder_for_search')"
      size="large"
      value-key="full_name_text"
    >
    </el-autocomplete>

    <el-input v-model="numberDoc" placeholder="Номер документа" size="large" />

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

  <div class="license-container">
    <div class="license-container-title">
      <div class="header-item">Организация</div>
      <div class="header-item">Название услуги</div>
      <div class="header-item">№ лицензии</div>
      <div class="header-item">Дата выдачи</div>
    </div>
    <div v-for="item in LicenseData" class="license-card">
      <img
        src="src/assets/images/icons/logoo%201.svg"
        class="license-logo"
        alt="logo"
      />
      <div class="org-name">
        <h5 class="license-text">{{ item.organization }}</h5>
      </div>
      <div class="org-name">
        <h5 class="license-text">
          {{
            item.activity_type === 'investment_manager'
              ? $t('message.investment_manager')
              : item.activity_type === 'investment_intermediary'
                ? $t('message.investment_intermediary')
                : '-'
          }}
        </h5>
      </div>
      <div class="org-name">
        <h5 class="license-text justify-content-center align-items-center">
          {{ item.license_number }}
        </h5>
      </div>
      <div class="org-name align-items-center">
        <h5 class="license-text justify-content-center">
          {{ item.issue_date }}
        </h5>
      </div>

      <div class="org-name text-center flex-grow-1 align-items-center">
        <a :href="`${url}/${item.pdf_file}`">
          <img
            style="width: 26px"
            src="/src/assets/images/icons/pdf-icon2.svg"
            alt="pdfIcon"
          />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { useStore } from '@/stores/store'
  import { Search, RefreshLeft } from '@element-plus/icons-vue'
  import { onMounted, ref } from 'vue'
  import axios from 'axios'
  import { ElNotification } from 'element-plus'

  const orgSearch = ref('')
  const url = import.meta.env.VITE_APP_SERVER_URL
  const numberDoc = ref('')
  const serviceType = ref('')
  const serviceOptions = ref([{}])
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
      .get(`${url}/brokers/licenses/`, {
        method: 'get',
      })
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

  const suggestionsList = ref([])

  const querySearch = (queryString, cb) => {
    axios
      .get(`${url}/home/autofill/?name=${queryString}`)
      .then((response) => {
        suggestionsList.value = response.data

        // call callback function to return suggestions
        cb(suggestionsList.value)
      })
      .catch((err) => {
        console.log(err, 'error')
      })
  }

  const selectChange = () => {
    currentPage.value = 1
  }

  const clearFields = () => {
    numberDoc.value = ''
    // serviceType.value =
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

  a {
    display: flex;
    text-decoration: none;
    color: #124483;
    flex-basis: auto;
    font-size: 18px;
    font-weight: 500;
  }

  p {
    color: #181818;
  }

  a:hover {
    color: #0093e9;
  }

  .license-container {
    padding: 4px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .license-container-title {
    display: flex;
    /*flex: 1;*/
    /*justify-content: space-between;*/
  }

  .header-item {
    /* Styles for the header items */
    color: #124483;
    padding: 0 6px;
    text-align: left; /* Or left, depending on your design */
  }

  .license-card {
    width: 100%;
    background: #f6f6f6;
    border-radius: 8px;
    box-shadow: rgba(0, 0, 0, 0.05) 0 0 0 1px;
    /*display: flex;*/
    /*align-items: stretch;*/
    padding: 8px;
    margin-bottom: 20px;
  }

  .license-card:first-child {
    margin-top: 20px; /* This adds space at the top of the first row */
  }

  .license-card {
    /* ... existing properties ... */
    margin-bottom: 20px; /* This adds space between rows */
  }

  .org-name {
    flex: 1;
    padding: 0 12px;
    display: flex;
    flex-direction: column;
    justify-content: center; /* This will vertically center the content */
    border-right: 2px solid #dad8d8ed; /* This will create the border */
  }

  /* Remove border from the last item */
  .org-name:last-child {
    border-right: none;
  }

  .license-text {
    font-size: 16px;
    font-weight: 500;
    color: #124483;
    display: flex;
  }

  .org-name span {
    color: #0f70cf;
    font-size: 12px;
    text-align: left;
  }

  .license-logo {
    width: 70px;
    margin: 0 10px;
  }
</style>
