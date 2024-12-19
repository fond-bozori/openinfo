<template>
  <div class="header-name title">
    <p>{{ $t('message.issuer') }}</p>
  </div>
  <div class="search-bar">
    <el-autocomplete
      v-model="factSearchInput"
      :fetch-suggestions="querySearch"
      :trigger-on-focus="false"
      class="inline-input w-100"
      clearable
      :placeholder="$t('message.placeholder_for_search')"
      size="large"
      value-key="full_name_text"
      @clear="clearOrganizationField"
      @select="organizationSelect"
    >
    </el-autocomplete>
    <el-select
      v-model="isListedValue"
      :placeholder="$t('message.RFB_status')"
      size="large"
      style="width: 400px"
      @change="statusChange"
    >
      <el-option
        v-for="item in isListed"
        :key="item.value"
        :label="$t(`message.${item.label}`)"
        :value="item.value"
      />
    </el-select>
    <el-select
      v-model="selectedOrgType"
      :placeholder="$t('message.chooseOrgType')"
      size="large"
      style="width: 400px"
      @change="orgTypeChange"
    >
      <el-option
        v-for="item in organizationType"
        :key="item.value"
        :label="$t(`message.${item.label}`)"
        :value="item.value"
      />
    </el-select>
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
  <div
    v-loading="loading"
    class="d-flex flex-column gap-3 p-1 justify-content-center align-items-center mb-3"
  >
    <el-empty v-if="!data.length" description="No Data" />
    <div v-for="data in data" class="broker-card">
      <div class="broker-card__header">
        <div class="img-container">
          <img
            v-if="data.detailinfo.logo_file"
            :src="`${baseLogoUrl}${data.detailinfo.logo_file}`"
            alt="logo"
            class="news-image"
          />
          <img
            v-else
            src="/src/assets/images/icons/company-blue.svg"
            alt="not found"
            class="broker-header__logo news-image"
          />
        </div>

        <div class="broker-card__info">
          <h1 class="broker-name">
            {{ data.full_name_text }}
            <el-button
              :class="{
                'subscribed-btn': subscribed,
                'subscribe-btn': subscribe,
              }"
              type="success"
              style="background: #5cb85c"
              @click="showSubscribeDialog(data.id)"
            >
              <span>{{ $t('message.subscribe') }} </span>
              <el-icon class="subscribe">
                <BellFilled />
              </el-icon>
            </el-button>
          </h1>
          <!--          <p class="broker-info__detail">{{data.detailinfo.short_info_ru}}</p>-->
          <div class="footer-info">
            <img
              class="broker-icon"
              src="/src/assets/images/icons/phone-call.svg"
            />{{
              data.detailinfo.phone_number
                ? data.detailinfo.phone_number
                : ' - '
            }}
          </div>
          <a :href="`http://${data.on_maps}`" class="footer-info"
            ><img
              class="broker-icon"
              src="/src/assets/images/icons/map-pin.svg"
            />
            {{ data.address }}
          </a>
          <a :href="`mailto:${data.email} `" class="footer-info"
            ><img class="broker-icon" src="/src/assets/images/icons/mail.svg" />
            {{ data.email }}
          </a>
          <p class="director-name">
            {{ $t('message.investment_intermediaries_ceo') }} :
            <b>
              {{
                data.detailinfo.director_name
                  ? data.detailinfo.director_name
                  : '-'
              }}
            </b>
          </p>
          <!--          <a :href="`http://${data.web_site}`" class="link-to__website">{{ $t("message.investment_intermediaries_web") }}</a>-->
          <el-button
            :disabled="selectedOrgType === '8'"
            size="large"
            class="link-to__website"
            @click="
              router.push({ name: 'company-profile', params: { id: data.id } })
            "
            >{{ $t('message.more') }}</el-button
          >
        </div>
      </div>
    </div>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :current-page="currentPage"
      :page-count="totalPages"
      @current-change="handleCurrentChange"
    />
  </div>

  <el-dialog
    v-model="centerDialogVisible"
    title="Форма"
    width="30%"
    align-center
    destroy-on-close
    @closed="clear"
  >
    <el-form
      ref="formRef"
      :model="form"
      status-icon
      class="login-form"
      label-position="top"
      size="large"
      :rules="rules"
      style="min-width: 360px"
    >
      <el-form-item label="email" prop="email">
        <el-input
          v-model="form.email"
          type="email"
          :prefix-icon="Message"
          placeholder="Email"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="centerDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="subscribe(formRef)">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
  import { ref, onMounted, reactive } from 'vue'
  import axios from 'axios'
  import { ElNotification } from 'element-plus'
  import { useRoute, useRouter } from 'vue-router'
  import router from '../../router'
  import { BellFilled, Message, RefreshLeft } from '@element-plus/icons-vue'
  import { Search, Clock } from '@element-plus/icons-vue'

  const data = ref([])
  const baseLogoUrl = 'https://openinfo.uz/media/'
  const subscribed = ref(false)

  const url = import.meta.env.VITE_APP_SERVER_URL
  const loading = ref(false)
  const route = useRoute()

  const totalPages = ref(null)
  const total = ref(null)

  const centerDialogVisible = ref(false)
  const organizationId = ref(null)
  const currentPage = ref(1)
  const selectedOrgType = ref(null)
  const isListedValue = ref(null)
  const { currentRoute } = useRouter()
  const factSearchInput = ref('')
  const suggestionsList = ref([])

  const form = reactive({
    email: null,
    password: null,
  })

  const organizationType = [
    {
      value: ``,
      label: 'all',
    },
    {
      value: `1`,
      label: 'jsc',
    },
    {
      value: `5`,
      label: 'banks',
    },

    {
      value: `6`,
      label: 'insurance_companies',
    },
    {
      value: `8`,
      label: 'llc',
    },
  ]

  const isListed = [
    {
      value: ``,
      label: 'all',
    },
    {
      value: 'false',
      label: 'unlisted',
    },

    {
      value: 'true',
      label: 'listed',
    },
  ]

  const formRef = ref()
  const rules = ref({
    email: [
      {
        required: true,
        message: 'Majburiy Email @example',
        trigger: 'blur',
        type: 'email',
      },
    ],
    // password: [{required: true, message: "Majburiy maydon", trigger: "blur"}]
  })

  const clear = () => {
    form.email = null
    form.password = null
  }

  const subscribe = (formRef) => {
    formRef.validate((valid) => {
      if (valid) {
        loading.value = true
        axios
          .post(`${import.meta.env.VITE_APP_SERVER_URL}/home/subscribe/`, {
            email: form.email,
            organization_id: organizationId.value,
          })
          .then(({ data }) => {})
          .catch((e) => {
            console.log(e?.message)
          })
          .finally(() => {
            loading.value = false
            centerDialogVisible.value = false
          })
        // subscribed.value = !subscribed.value
      }
    })
  }

  const handleCurrentChange = (newPage) => {
    currentPage.value = newPage
    updateQueryParameters(
      {
        page: currentPage.value,
      },
      true,
    ) // Reset the page number to 1
      .then(getOrganizationsData)
      .catch((error) => {
        console.error('Error updating fact selection:', error)
      })
  }

  const querySearch = (queryString, cb) => {
    axios
      .get(`${url}/home/autofill/?name=${queryString}`)
      .then((response) => {
        suggestionsList.value = response.data
        cb(suggestionsList.value)
      })
      .catch((err) => {
        console.log(err, 'error')
      })
  }

  const organizationSelect = async (val) => {
    updateQueryParameters(
      {
        search: val?.full_name_text,
      },
      true,
    ) // Reset the page number to 1
      .then(getOrganizationsData)
      .catch((error) => {
        console.error('Error updating fact selection:', error)
      })
  }

  const getOrganizationsData = () => {
    loading.value = true
    axios
      .get(`${url}/home/organizations/`, {
        params: {
          name_suffix_id: selectedOrgType.value ? selectedOrgType.value : '',
          is_listing: isListedValue?.value,
          page: currentPage.value,
          page_size: 5,
          search: factSearchInput.value,
        },
      })
      .then((response) => {
        data.value = response.data.results
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

  const statusChange = () => {
    updateQueryParameters(
      {
        status: isListedValue.value,
      },
      true,
    ) // Reset the page number to 1
      .then(getOrganizationsData)
      .catch((error) => {
        console.error('Error updating fact selection:', error)
      })
  }

  const orgTypeChange = () => {
    updateQueryParameters(
      {
        'organization-type': selectedOrgType.value, // Keep the selected fact type
      },
      true,
    ) // Reset the page number to 1
      .then(getOrganizationsData)
      .catch((error) => {
        console.error('Error updating fact selection:', error)
      })
  }

  const clearOrganizationField = () => {
    updateQueryParameters(
      {
        search: '', // Keep the selected fact type
      },
      true,
    ) // Reset the page number to 1
      .then(getOrganizationsData)
      .catch((error) => {
        console.error('Error updating fact selection:', error)
      })
  }

  const clearFields = () => {
    factSearchInput.value = ''
    selectedOrgType.value = null
    isListedValue.value = null
    getOrganizationsData()
  }

  const makeSearch = () => {
    getOrganizationsData()
  }

  const showSubscribeDialog = (id) => {
    centerDialogVisible.value = true
    organizationId.value = id
  }

  const updateQueryParameters = async (changes, resetPage = true) => {
    const newQuery = {
      ...route.query, // Start with the existing query parameters
      ...(resetPage && { page: 1 }), // Override page to 1 if reset is needed
      ...changes, // Apply new changes
    }

    // Explicitly check if page should be removed when not resetting
    if (!resetPage) {
      delete newQuery.page // Remove page parameter if not resetting
    }

    try {
      await router.replace({
        path: route.path,
        params: route.params,
        query: newQuery,
      })
      console.log('Query parameters successfully updated:', newQuery)
    } catch (error) {
      console.error('Failed to update query parameters:', error)
    }
  }

  const updateQueryState = (parameter, value) => {
    router.push({
      query: {
        ...currentRoute.value.query,
        [parameter]: value,
      },
    })
  }

  onMounted(() => {
    factSearchInput.value = route.query.search ?? ''
    isListedValue.value = route.query['status'] ?? ''
    selectedOrgType.value = route.query['organization-type'] ?? ''

    const shouldResetPage = route.query.infotype && !route.query.page
    const page = +route.query.page
    currentPage.value = shouldResetPage || Number.isNaN(page) ? 1 : page
    getOrganizationsData()
  })
</script>

<style scoped>
  .container {
    min-height: 50vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
    /*min-height: 50vh;*/
    padding: 0 5px;
    margin: 20px 0;
  }

  .broker-card {
    background: #fefefe;
    box-shadow: 0px 0px 2px 3px rgba(148, 148, 148, 0.1);
    border-radius: 10px;
    display: flex;
    /*max-width: 1173px;*/
    width: 100%;
    flex-direction: column;
    color: #124483;
  }

  .broker-name {
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 29px;
    /* identical to box height */
    /*color: #2F2F2F;*/
    color: #124483;
    margin: 0;
  }

  .broker-card__header {
    display: flex;
    padding: 20px;
  }

  .img-container {
    border-radius: 20px;
    max-width: 200px;
    min-width: 200px;
    overflow: hidden;
    /*background: rgba(21, 78, 150, 0.7);*/
    box-shadow: var(--el-box-shadow-lighter);
    border: 1px solid #e6e8f0;
    background: #efefef;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }

  .news-image {
    width: 100%;
    height: 100%;
    max-height: 150px;
    object-fit: contain;
    transition: transform 0.4s ease;
    transform: scale(1);
  }

  .news-image:hover {
    transform: scale(1.05);
  }

  .broker-header__logo {
    width: 200px;
    max-width: 250px;
    max-height: 150px;
  }

  .broker-card__info {
    display: flex;
    flex-direction: column;
    gap: 15px;
    font-size: 16px;
    line-height: 19px;
    width: 100%;
    margin-left: 10px;
    border-left: 1px solid #e6e8f0;
    padding-left: 35px;
    /* background: #124483; */
  }

  .footer-info {
    color: #124483;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .link-to__website {
    /*background: #E6E8F0;*/
    background: rgb(92 183 92);
    color: #ffffff;
    /*border-radius: 0px 0px 10px 0px;*/
    /*color: #124483;*/
    text-align: center;
    padding: 10px 30px;
    text-decoration: none;
    border-radius: 8px;
  }

  .stars {
    width: 70px;
  }

  .broker-info__detail {
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    color: #5a5959;
    margin: 9px 0;
  }

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

  .subscribe {
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--el-color-success);
    font-size: 16px;
    border-radius: 50px;
    width: 25px;
    height: 25px;
    background: white;
    margin-left: 10px;
  }

  .subscribed-btn {
    display: flex;
    align-items: center;
    padding: 6px;
    background: white;
    color: var(--el-color-success);
    font-weight: bold;

    /*text-transform: uppercase;*/
  }

  .broker-icon {
    width: 20px;
  }

  @media only screen and (max-width: 600px) {
    .img-container {
      width: 100%;
      max-width: 100%;
    }

    .broker-card__header {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 20px;
    }

    .broker-card__info {
      flex-direction: column;
      border: none;
      padding: 0;
    }

    .broker-name {
      gap: 10px;
      font-size: 18px;
      text-align: center;
      flex-direction: column;
      justify-content: center;
    }
    .footer-info {
      text-align: center;
    }

    .director-name {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
    }
  }

  @media only screen and (max-width: 992px) {
    .broker-name {
      gap: 10px;
      text-align: center;
      flex-direction: column;
      justify-content: center;
    }
  }

  @media only screen and (max-width: 1720px) {
    /*.broker-card__header {*/
    /*  display: flex;*/
    /*  flex-direction: column;*/

    /*}*/
  }
</style>
