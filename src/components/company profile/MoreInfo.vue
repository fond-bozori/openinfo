<template>
  <el-collapse>
    <el-collapse-item :title="$t('message.additional_information')" name="1">
      <el-collapse v-model="isCollapseOpen">
        <el-collapse-item
          :title="$t('message.transaction-results')"
          name="7"
          @click="openCollapse"
        >
          <CompanyTradeResults />
        </el-collapse-item>

        <el-collapse-item
          :title="$t('message.legal_cases')"
          name="1"
          @click="openCollapse"
        >
          <div class="construction-component">
            <h1 class="construction-text">
              {{ $t('message.page_under_construction') }}
            </h1>
            <video width="800" height="450" autoplay loop muted>
              <source src="/src/assets/images/Web.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <h1 class="construction-text"></h1>
          </div>
        </el-collapse-item>

        <el-collapse-item
          :title="$t('message.government_procurements')"
          name="2"
        >
          <PublicProcurement v-if="store.$state.companyInn" />
        </el-collapse-item>
      </el-collapse>
    </el-collapse-item>
  </el-collapse>
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import axios from 'axios'
  import { useStore } from '@/stores/store'
  import { useRoute, useRouter } from 'vue-router'
  import options from '@/components/options'
  import { View, Search } from '@element-plus/icons-vue'
  import moment from 'moment/moment'
  import { ElNotification } from 'element-plus'
  import CompanyTradeResults from '@/components/company profile/CompanyTradeResults.vue'
  import PublicProcurement from '@/components/company profile/PublicProcurement.vue'
  const activeNames = ref(['1'])

  const loading = ref(false)
  const loading2 = ref(false)
  const data = ref([])
  const store = useStore()
  const isCollapseOpen = ref(false)

  const url = import.meta.env.VITE_APP_SERVER_URL
  const id = ref(8)

  const factLists = ref([])

  const dateValue = ref(null)
  const route = useRoute()
  const router = useRouter()
  const selectValue = ref(options[0].value)

  const totalPages = ref(null)
  const total = ref(null)

  const results = ref([])
  const factNumber = ref(1)

  const factSearchInput = ref('')
  const suggestionsList = ref([])
  const currentPage = ref(1)
  const handleCurrentChange = (val) => {
    currentPage.value = val
    getFacts()
  }

  const selectChange = () => {
    currentPage.value = 1
  }

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

  const getFacts = () => {
    loading.value = true
    axios
      .get(
        `${url}/announcement/main/?organization_id=${id.value}&page_size=5&page=${currentPage.value}${dateValue.value?.length ? `&pub_date__lte=${(dateValue.value?.[1]).toISOString()}&pub_date__gte=${moment(dateValue.value?.[0]).toISOString()}` : ''}&search=${factSearchInput.value}`,
        {
          method: 'get',
        },
      )
      .then((response) => {
        factLists.value = response.data.results
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

  const openCollapse = () => {
    // loading.value = !loading.value
  }
</script>

<style scoped>
  .xls-icon {
    width: 18px;
    margin: 0 8px;
  }

  .construction-component {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-size: cover;
    justify-content: center;
    width: 100%;
    height: 500px;
    background: #ffffff;
    padding: 32px;
    position: relative;
    border-radius: 8px;
  }

  .construction-text {
    font-weight: 800;
    font-size: 48px;
    color: #124483;
    position: absolute;
    top: 50px;
  }
</style>
