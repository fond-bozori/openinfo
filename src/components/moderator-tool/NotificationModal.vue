<!-- DialogComponent.vue -->
<template>
  <el-dialog
    :model-value="visible"
    width="80%"
    :show-close="true"
    closable
    draggable
    :close-on-click-modal="false"
    @close="closeDialog"
  >
    <div
      class="card-container d-flex mt-3 gap-5 flex-wrap justify-content-between trade"
    >
      <el-table :data="cardData.results" :border="false" style="width: 100%">
        <el-table-column type="expand">
          <template #default="props">
            <el-table :data="props.row.extra_data" :border="true">
              <el-table-column
                :label="t('message.trade.organization')"
                prop="full_name_text"
              >
                <template #default="scope">
                  <a
                    :href="`/organization/${scope.row.id}`"
                    style="color: #1256a0"
                    target="_blank"
                  >
                    {{ scope.row.full_name_text }}
                  </a>
                </template>
              </el-table-column>
              <el-table-column
                :label="t('message.TIN_KPP')"
                prop="inn"
                align="right"
                width="200"
              />
              <el-table-column
                :label="t('message.email')"
                prop="email"
                align="right"
                width="300"
              >
                <template #default="scope">
                  <a
                    style="color: #1256a0"
                    :href="`mailto:${scope.row.email}`"
                    >{{ scope.row.email }}</a
                  >
                  <span v-if="!scope.row.email">-</span>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
          :label="t('message.kotirovka.issuer_short_name')"
          prop="title"
        />
        <el-table-column :label="t('message.description')" prop="description" />
      </el-table>
    </div>
  </el-dialog>
</template>

<script setup>
  import {
    ref,
    defineProps,
    defineEmits,
    reactive,
    onMounted,
    watch,
  } from 'vue'
  import { ElMessage } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  import http from '@/http/index.js'

  const { t } = useI18n()
  // eslint-disable-next-line vue/require-prop-types
  const props = defineProps(['visible'])
  const emit = defineEmits(['update:visible'])

  const form = reactive({
    username: '',
    password: '',
  })

  const closeDialog = () => {
    emit('update:visible', false)
  }

  const cardData = ref([])
  const fetchNotifications = async () => {
    try {
      const response = await http.get(`/organizations/notifications/`, {})
      cardData.value = response.data
    } catch (error) {
      console.error('Error fetching trade data:', error)
      if (error.response && error.response.status === 401) {
        dialogVisible.value = true // Open modal on 401 error
      }

      console.log(error.response.status, 'status')
    }
  }

  watch(
    () => props.visible,
    (newValue) => {
      if (newValue) {
        fetchNotifications() // Fetch data when `visible` becomes `true`
      }
    },
  )
</script>
