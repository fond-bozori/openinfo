<template>
  <div v-loading="loading">
    <div class="graph-title mb-3">
      {{ $t('message.issuers_card') }}
    </div>
    <div class="all-wrapper">
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
          <span class="contact">{{
            data?.detailinfo?.phone_number
              ? data?.detailinfo?.phone_number
              : '--'
          }}</span>
          <a :href="`mailto:${data?.email}`" class="contact">{{
            data.email ? data.email : '--'
          }}</a>
        </div>
        <a :href="`http://${data?.web_site}`" class="web-link" target="_blank"
          >{{ data.web_site ? data.web_site : '--' }}
        </a>
      </div>

      <div class="right-component">
        <h3 class="title">{{ data?.short_name_text }}</h3>
        <p class="info-text mb-2">
          {{ getInfoByLang(store.$state.currentLanguage) }}
        </p>

        <div class="d-flex gap-3">
          <p class="fw-bold sub-info-title">{{ $t('message.mfo') }}</p>
          <p>{{ data.mfo }}</p>
        </div>
        <div class="d-flex gap-3">
          <p class="fw-bold sub-info-title">{{ $t('message.TIN_KPP') }}</p>
          <p>{{ data?.inn }}</p>
        </div>
        <div class="d-flex gap-3">
          <p class="fw-bold sub-info-title">
            {{ $t('message.registrations_date') }}
          </p>
          <p>{{ data?.detailinfo?.created_at }}</p>
        </div>
        <div class="d-flex gap-3">
          <p class="fw-bold sub-info-title">
            {{ $t('message.legal_address') }}
          </p>
          <p>{{ data?.address }}</p>
        </div>
        <div class="d-flex gap-3">
          <p class="fw-bold sub-info-title">{{ $t('message.director') }} -</p>
          <p>{{ data?.detailinfo?.director_name }}</p>
        </div>
        <div class="d-flex gap-3 justify-content-between flex-wrap">
          <div class="d-flex gap-1">
            <p class="fw-bold sub-info-title">{{ $t('message.OKPO') }}</p>
            <p>{{ data?.okpo }}</p>
          </div>
          <div class="d-flex gap-1">
            <p class="fw-bold sub-info-title">{{ $t('message.KFS') }}</p>
            <p>{{ data?.kfs }}</p>
          </div>
          <div class="d-flex gap-1">
            <p class="fw-bold sub-info-title">{{ $t('message.okonx') }}</p>
            <p>{{ data?.okonx }}</p>
          </div>
          <div class="d-flex gap-1">
            <p class="fw-bold sub-info-title">{{ $t('message.ticker') }}</p>
            <p>{{ data?.exchange_ticket_name }}</p>
          </div>
          <div class="d-flex gap-3">
            <p class="fw-bold sub-info-title">{{ $t('message.RFB_status') }}</p>
            <p>
              {{
                data?.is_listing ? $t('message.listed') : $t('message.unlisted')
              }}
            </p>
          </div>
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

  const loading = ref(false)
  const data = ref([])
  const baseLogoUrl = 'https://openinfo.uz/media/'
  const store = useStore()
  const route = useRoute()

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
        for (let i = 0; i < data.value.info_rfb.isin_codes.length; i++) {
          data.value.info_rfb.isin_codes[i].stock_type === '01'
            ? store.setSimpleIsin(data.value.info_rfb.isin_codes[i].isu_cd)
            : data.value.info_rfb.isin_codes[i].stock_type === '02'
              ? store.setPrivilegedIsin(
                  data.value.info_rfb.isin_codes[i].stock_type === '02',
                )
              : ''
        }
      })
      .catch(({ response }) => {
        ElNotification({
          type: 'error',
          message: response?.data?.message || 'Malumot olishda xatolik bor!',
        })
      })
      .finally(() => {
        loading.value = false
      })
  }

  onMounted(() => {
    getCompanyProfile()
  })
</script>

<style scoped>
  .graph-title {
    width: 100%;
    padding: 12px;
    text-align: center;
    background: #094580;
    border-radius: 8px;
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
  }

  .img-container {
    width: 372px;
    height: 180px;
  }

  .img {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    object-fit: contain;
    padding: 20px;
    background: #f6f6f6;
  }

  p {
    color: #535353;
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
    min-height: 20px;
  }

  .right-component {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .title {
    color: #138600;
    font-weight: 700;
  }

  p {
    color: #262626;
  }

  p.info-text {
    color: #262626;
    line-height: 19.5px;
    font-weight: 500;
    text-align: justify;
  }

  .sub-info-title {
    color: #535353;
    font-weight: 700;
  }
</style>
