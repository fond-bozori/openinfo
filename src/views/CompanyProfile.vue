<template>
  <div class="company-wrapper">
    <template v-if="!loading">
      <CompanyProfileInfoListed v-if="isListing" />
      <CompanyProfileInfoUnlisted v-else />
    </template>
    <FinancialGraph />
    <KeyFinancialIndicator />
    <InfoCollapse />
    <Ustav />
    <MoreInfo />
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import axios from 'axios'
  import { ElNotification } from 'element-plus'
  import { useRoute } from 'vue-router'
  import { useStore } from '@/stores/store'

  import CompanyProfileInfoListed from '@/components/company profile/CompanyProfileInfoListed.vue'
  import CompanyProfileInfoUnlisted from '@/components/company profile/CompanyProfileInfoUnlisted.vue'
  import FinancialGraph from '@/components/company profile/FinancialGraph.vue'
  import MoreInfo from '@/components/company profile/MoreInfo.vue'
  import KeyFinancialIndicator from '@/components/company profile/KeyFinancialIndicator.vue'
  import Ustav from '@/components/company profile/Ustav.vue'
  import InfoCollapse from '@/components/company profile/InfoCollapse.vue'

  const loading = ref(true)
  const data = ref({})
  const isListing = ref(false)
  const store = useStore()
  const route = useRoute()

  const url = import.meta.env.VITE_APP_SERVER_URL
  const id = computed(() => route.params.id)

  const fetchCompanyProfile = async () => {
    try {
      const response = await axios.get(`${url}/home/organizations/${id.value}/`)
      data.value = response.data
      isListing.value = data.value.is_listing
      updateStoreWithProfileData(data.value)
    } catch (error) {
      handleError(
        error.response?.data?.message || 'Malumot olishda xatolik bor!',
      )
    } finally {
      loading.value = false
    }
  }

  const updateStoreWithProfileData = (profile) => {
    store.setCurrentSuffix(profile.name_suffix)
    store.setInn(profile.inn)
    profile.info_rfb.isin_codes.forEach((code) => {
      if (code.stock_type === '01') {
        store.setSimpleIsin(code.isu_cd)
      } else if (code.stock_type === '02') {
        store.setPrivilegedIsin(code.isu_cd)
      }
    })
  }

  const handleError = (message) => {
    ElNotification({
      type: 'error',
      message,
    })
  }

  onMounted(fetchCompanyProfile)
</script>

<style scoped>
  .company-wrapper {
    height: auto;
    margin-bottom: 32px;
    font-family: Montserrat;
    font-weight: 500;
  }
</style>
