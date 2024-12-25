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
    <template #title>
      <div class="d-flex justify-content-between align-items-center">
        <span>{{ t('message.notifications') }}</span>
        <el-button type="primary" @click="markAllAsRead">
          {{ t('message.mark_all_as_read') }}
        </el-button>
      </div>
    </template>

    <div
      class="card-container d-flex mt-3 gap-5 flex-wrap justify-content-between trade"
    >
      <el-table :data="cardData.results" :border="false" style="width: 100%">
        <!-- Expandable Row -->
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

        <!-- Main Columns -->
        <el-table-column
          :label="t('message.kotirovka.issuer_short_name')"
          prop="title"
        />
        <el-table-column :label="t('message.description')" prop="description">
          <template #default="scope">
            <span
              :class="{
                'text-muted': scope.row.is_read,
                'font-weight-bold': !scope.row.is_read,
              }"
            >
              {{ scope.row.description }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="Actions" align="center" width="150">
          <template #default="scope">
            <el-button
              size="small"
              type="success"
              v-if="!scope.row.is_read"
              @click="markAsRead(scope.row.id)"
            >
              {{ t('message.mark_as_read') }}
            </el-button>
            <el-tag v-else type="info">{{ t('message.read') }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script setup>
  import { ref, defineProps, defineEmits, reactive, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import http from '@/http/index.js'

  const { t } = useI18n()

  // Props and Emits
  const props = defineProps(['visible'])
  const emit = defineEmits(['update:visible'])

  // State
  const cardData = ref([])

  // Methods
  const closeDialog = () => {
    emit('update:visible', false)
  }

  const fetchNotifications = async () => {
    try {
      const response = await http.get(`/organizations/notifications/`)
      cardData.value = response.data
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const markAsRead = async (id) => {
    try {
      await http.post(`/organizations/notifications/${id}/mark-as-read/`)
      const notification = cardData.value.results.find((item) => item.id === id)
      if (notification) {
        notification.is_read = true
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await http.post(`/organizations/notifications/mark-all-as-read/`)
      cardData.value.results.forEach((item) => {
        item.is_read = true
      })
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  // Watch for visibility changes
  watch(
    () => props.visible,
    (newValue) => {
      if (newValue) {
        fetchNotifications()
      }
    },
  )
</script>

<style>
  .text-muted {
    color: #6c757d;
  }
  .font-weight-bold {
    font-weight: bold;
  }
</style>
