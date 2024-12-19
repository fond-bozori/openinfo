<template>
  <el-table
    :data="Materials"
    class="certified-people"
    border
    stripe
    style="width: 100%; margin-top: 80px"
  >
    <el-table-column
      :index="indexMethod"
      align="center"
      label="№"
      type="index"
      width="50"
    />
    <el-table-column
      :label="$t('message.materials_for_tests')"
      align="center"
      prop="description"
    ></el-table-column>
    <el-table-column align="center" width="120">
      <template #default="scope">
        <a :href="`${scope.row.file}`" target="_blank">
          {{ $t('message.download') }}
        </a>
      </template>
    </el-table-column>
  </el-table>
  <!--  <div class="pagination d-flex justify-content-center mt-4">-->
  <!--    <el-pagination :current-page="currentPage" :page-count="totalPages" :total="total" background hide-on-single-page-->
  <!--                   layout="prev, pager, next" @current-change="handleCurrentChange"/>-->
  <!--  </div>-->
</template>

<script setup>
  import { computed, onMounted, ref, watch } from 'vue'
  import axios from 'axios'
  import { useStore } from '@/stores/store'
  import { useRoute, useRouter } from 'vue-router'
  import { ElNotification } from 'element-plus'

  const activeNames = ref(['1'])

  const loading = ref(false)
  const data = ref([])
  const store = useStore()

  const url = import.meta.env.VITE_APP_SERVER_URL
  const id = computed(() => route.params.id)

  const Materials = ref([])

  const dateValue = ref(null)
  const route = useRoute()
  const router = useRouter()
  const totalPages = ref(null)
  const total = ref(null)

  const currentPage = ref(1)
  const handleCurrentChange = (val) => {
    currentPage.value = val
    getFacts()
  }

  const indexMethod = (index) => {
    return index + 1
  }

  const getFacts = () => {
    loading.value = true
    axios
      .get(
        `${url}/reestr/material-files/?language=${store.$state.currentLanguage}`,
        {
          method: 'get',
        },
      )
      .then((response) => {
        Materials.value = response.data
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

  const currentLanguage = computed(() => store.$state.currentLanguage)
  watch(currentLanguage, () => {
    getFacts()
  })

  onMounted(() => {
    getFacts()
  })
</script>

<style scoped>
  .table-title p {
    width: 50%;
    text-align: center;
  }
</style>
