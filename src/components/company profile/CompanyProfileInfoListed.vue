<template>
  <div v-loading="loading">
    <div class="graph-title mb-3">
      {{ $t('message.issuers_card') }}
    </div>
    <div class="all-wrapper">
      <!-- Left component -->
      <div class="left-component">
        <div class="img-container">
          <img
            v-if="data.detailinfo?.logo_file"
            :src="`${baseLogoUrl}${data.detailinfo?.logo_file}`"
            alt="logo"
            class="img"
          />
          <img
            v-else
            src="/src/assets/images/icons/company-blue.svg"
            alt="not found"
            class="broker-header__logo img"
          />
        </div>
        <div class="d-flex gap-1">
          <span class="contact">
            {{ data?.detailinfo?.phone_number || '--' }}
          </span>
          <a :href="`mailto:${data?.email}`" class="contact">
            {{ data.email || '--' }}
          </a>
        </div>
        <a :href="`http://${data?.web_site}`" class="web-link" target="_blank">
          {{ data.web_site || '--' }}
        </a>
      </div>

      <!-- Right component -->
      <div class="right-component">
        <h3 class="title">{{ data?.short_name_text }}</h3>
        <p class="info-text mb-2">
          {{ getInfoByLang(store.$state.currentLanguage) }}
        </p>

        <div class="d-flex gap-3">
          <p class="fw-bold sub-info-title">
            {{ $t('message.authorized_capital') }}:
          </p>
          <p class="value-text">
            {{ formatValue(data.info_rfb?.ustav_capitalization) }} UZS
          </p>
        </div>
        <div class="d-flex gap-3">
          <p class="fw-bold sub-info-title">{{ $t('message.market_cap') }} :</p>
          <p class="value-text">
            {{ formatValue(data?.uzse_info?.market_capitalization) }} UZS
          </p>
        </div>
        <div class="d-flex gap-3">
          <p class="fw-bold sub-info-title">
            {{ $t('message.registrations_date') }}
          </p>
          <p class="value-text">{{ data?.detailinfo?.created_at }}</p>
        </div>
        <div class="d-flex gap-3">
          <p class="fw-bold sub-info-title">{{ $t('message.director') }} -</p>
          <p>{{ data?.detailinfo?.director_name }}</p>
        </div>
        <div class="okpo">
          <div class="d-flex gap-1">
            <p class="fw-bold sub-info-title">{{ $t('message.OKPO') }}</p>
            <p class="value-text">{{ data?.okpo }}</p>
          </div>
          <div class="d-flex gap-1">
            <p class="fw-bold sub-info-title">{{ $t('message.KFS') }}</p>
            <p class="value-text">{{ data?.kfs }}</p>
          </div>
          <div class="d-flex gap-1">
            <p class="fw-bold sub-info-title">{{ $t('message.okonx') }}</p>
            <p class="value-text">{{ data?.okonx }}</p>
          </div>
          <div class="d-flex gap-1">
            <p class="fw-bold sub-info-title">{{ $t('message.ticker') }}</p>
            <p class="value-text">{{ data?.exchange_ticket_name }}</p>
          </div>
          <div class="d-flex gap-3">
            <p class="fw-bold sub-info-title">{{ $t('message.RFB_status') }}</p>
            <p class="value-text">
              {{
                data?.is_listing ? $t('message.listed') : $t('message.unlisted')
              }}
            </p>
          </div>
        </div>
      </div>

      <div class="shares_info">
        <div class="shares-info-item">
          <el-select
            class="dropdown-selector"
            v-model="selectedShare"
            @change="handleShareChange"
          >
            <el-option
              v-for="option in translatedShareOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </div>
        <div class="shares-info-item">
          <p class="fw-bold">{{ $t('message.list_shrs') }}:</p>
          <p class="value-text">
            {{ formatLocaleRU(selectedShareData?.list_shrs) }}
          </p>
        </div>
        <div class="shares-info-item">
          <p class="fw-bold">{{ $t('message.market_last_price') }}:</p>
          <p class="value-text">
            {{ formatValue(selectedShareData?.market_last_price) }} UZS
          </p>
        </div>
        <div class="shares-info-item">
          <p class="fw-bold">{{ $t('message.parval') }}:</p>
          <p class="value-text">
            {{ formatValue(selectedShareData?.parval) }} UZS
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import axios from 'axios'
  import { ElNotification } from 'element-plus'
  import { computed, onMounted, ref } from 'vue'
  import { useStore } from '@/stores/store'
  import { useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  const loading = ref(false)
  const data = ref({})
  const shareOptions = ref([])
  const selectedShare = ref(null)
  const selectedShareData = ref({})
  const baseLogoUrl = 'https://openinfo.uz/media/'
  const store = useStore()
  const route = useRoute()
  const { t } = useI18n()
  const url = import.meta.env.VITE_APP_SERVER_URL
  const id = computed(() => route.params.id)

  const getInfoByLang = (lang) => {
    switch (lang) {
      case 'en':
        return data.value.detailinfo?.short_info_en
      case 'uz':
        return data.value.detailinfo?.short_info_uz
      default:
        return data.value.detailinfo?.short_info_ru
    }
  }

  const getCompanyProfile = () => {
    loading.value = true
    axios
      .get(`${url}/home/organizations/${id.value}/`, {
        method: 'get',
      })
      .then((response) => {
        data.value = response.data
        store.setCurrentSuffix(data.value.name_suffix)
        store.setInn(data.value.inn)
        populateShareOptions()
        setDefaultShare()
      })
      .catch(({ response }) => {
        ElNotification({
          type: 'error',
          message: response?.data?.message || 'Error fetching data!',
        })
      })
      .finally(() => {
        loading.value = false
      })
  }

  const populateShareOptions = () => {
    if (data.value?.uzse_info?.shares) {
      shareOptions.value = data.value.uzse_info.shares.map((share) => ({
        label: share.type, // Original label
        value: share.isu_cd,
      }))
    }
  }

  const setDefaultShare = () => {
    const defaultShare = data.value?.info_rfb?.default_isu_cd
    if (defaultShare) {
      selectedShare.value = defaultShare
      handleShareChange(defaultShare)
    }
  }

  const handleShareChange = (value) => {
    const selected = data.value.uzse_info.shares.find(
      (share) => share.isu_cd === value,
    )
    selectedShareData.value = selected || {}
  }

  const formatValue = (value) => {
    return value
      ? parseFloat(value)
          .toFixed(2)
          .replace('.', ',')
          .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
      : '--'
  }

  const formatLocaleRU = (value) => {
    return value ? value.toLocaleString('ru-RU') : '--'
  }

  const translatedShareOptions = computed(() => {
    return shareOptions.value.map((option) => ({
      label: t(`message.shares.${option.label.toLowerCase()}`) || option.label,
      value: option.value,
    }))
  })

  onMounted(() => {
    getCompanyProfile()
  })
</script>

<style scoped>
  .shares_info {
    max-width: 25%;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: #ffffff;
    padding: 16px;
    border-radius: 8px;
  }

  .shares-info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .shares-info-item .fw-bold {
    color: #787878;
    font-weight: bold;
  }

  .okpo {
    display: flex;
    gap: 3px;
    justify-content: space-between;
    flex-wrap: wrap-reverse;
    width: 100%;
  }
  .graph-title {
    width: 100%;
    padding: 12px;
    text-align: center;
    background: #094580;
    border-radius: 8px;
    color: #ffffff;
  }

  .all-wrapper {
    padding-bottom: 28px;
    border-bottom: 1px solid #d7e1ff;
    display: flex;
    gap: 28px;
    margin-bottom: 32px;
  }

  .left-component {
    max-width: 372px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    height: 100%;
  }

  .img-container {
    width: 372px;
    height: 180px;
    display: flex;
    justify-content: center;
  }

  .img {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    object-fit: contain;
    padding: 20px;
    background: #f6f6f6;
  }

  .contact {
    background: #f6f6f6;
    color: #535353;
    border-radius: 8px;
    padding: 8px 12px;
    flex: 1;
    text-align: center;
    font-size: 14px;
  }

  .web-link {
    background: #1baa03;
    color: #ffffff;
    border-radius: 8px;
    padding: 8px 10px;
    width: 100%;
    text-align: center;
    min-height: 30px;
    text-decoration: none;
  }

  .right-component {
    display: flex;
    flex-direction: column;
    min-width: 500px;
    width: 100%;
    gap: 8px;
  }

  .title {
    color: #138600;
    font-weight: 700;
  }

  .info-text {
    color: #262626;
    line-height: 19px;
  }

  .sub-info-title {
    color: #787878;
    font-weight: 500;
  }

  .value-text {
    color: #262626;
  }

  .web-link:hover {
    background: #1d9e00;
  }

  .contact:hover {
    background: #e0e0e0;
  }
</style>
