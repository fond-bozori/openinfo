<template>
  <div v-loading="loading" class="container trade">
    <el-table
      v-loading="loading"
      stripe
      border
      :data="tradeData"
      style="width: 100%"
      height="900"
      element-loading-background="rgba(0, 0, 0, 0.4)"
      :header-cell-style="{
        color: '#124483',
        'text-transform': 'uppercase',
        padding: '4px 0',
      }"
      empty-text="Malumotlar Topilmadi"
    >
      <el-table-column
        type="index"
        header-align="center"
        align="center"
        label="№"
        width="80"
      />
      <el-table-column :label="$t('message.nam_of_issuer')">
        <template #default="scope">
          <a :href="scope.row.on_maps">{{ scope.row.short_name_text }} </a>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :current-page="currentPage"
        :page-count="totalPages"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, computed } from 'vue'
  import axios from 'axios'
  import { ElNotification } from 'element-plus'
  import { Search } from '@element-plus/icons-vue'
  import { useRoute } from 'vue-router'
  import router from '../router'

  const tradeData = ref([])

  const loading = ref(false)

  const route = useRoute()
  const currentPage = computed(() =>
    route.query.page ? parseInt(route.query.page, 10) : 1,
  )
  const totalPages = ref(null)
  const total = ref(null)
  const url = import.meta.env.VITE_APP_SERVER_URL
  const page_size = 22

  const value = ref('Option2')

  const handleCurrentChange = (val) => {
    router
      .replace({
        query: { page: val },
      })
      .then(() => {
        currentPage.value = val
        getTradeResults()
      })
      .catch((response) => {
        ElNotification({
          type: 'error',
          message: response.data.message || 'Malumot olishda xatolik bor!',
        })
      })
  }

  const getTradeResults = () => {
    loading.value = true
    axios
      .get(
        `${url}/home/organizations/?page=${currentPage.value}&page_size=${page_size}&all=true`,
        {
          method: 'get',
        },
      )
      .then((response) => {
        tradeData.value = response.data.results
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
  onMounted(() => {
    getTradeResults()
  })
</script>

<style scoped>
  .trade {
    min-height: 100vh;
    padding-bottom: 20px;
    display: flex;
    height: 100%;
    flex-direction: column;
  }

  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
</style>
