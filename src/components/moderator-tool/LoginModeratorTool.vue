<!-- DialogComponent.vue -->
<template>
  <el-dialog
    :model-value="visible"
    title="Login"
    width="500"
    append-to-body
    align-center
    :show-close="false"
    center
    draggable
    :close-on-click-modal="false"
    @close="closeDialog"
  >
    <el-form
      ref="formRef"
      :model="form"
      label-width="80px"
      label-position="top"
    >
      <el-form-item label="Username" required>
        <el-input v-model="form.username" placeholder="Enter username" />
      </el-form-item>
      <el-form-item label="Password" required>
        <el-input
          v-model="form.password"
          type="password"
          show-password
          placeholder="Enter password"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeDialog">Cancel</el-button>
        <el-button type="primary" @click="submitForm">Confirm</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
  import { ref, defineProps, defineEmits, reactive } from 'vue'
  import { ElMessage } from 'element-plus'
  import http from '@/http'

  const props = defineProps(['visible'])
  const emit = defineEmits(['update:visible'])

  const form = reactive({
    username: '',
    password: '',
  })

  const closeDialog = () => {
    emit('update:visible', false)
  }

  const sendUserLogin = async () => {
    try {
      const response = await http.post(`/userprofile/jwt/create/custom/`, form)
      ElMessage.success(`Welcome, ${form.username}!`)
      emit('update:visible', false)
    } catch (err) {
      ElMessage.warning(` ${err.response.data.detail}!`)
      console.log(err)
    }
  }
  const submitForm = () => {
    if (!form.username || !form.password) {
      ElMessage.error('Please fill in both fields.')
      return
    }
    sendUserLogin()
  }
</script>
