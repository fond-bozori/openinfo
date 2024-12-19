<template>
  <el-button class="chat-bot" @click="drawer = true"
    ><img src="/src/assets/images/icons/chatgpt.png" class="chatgpt"
  /></el-button>

  <el-drawer v-model="drawer" class="drawer" title="ChatGPT">
    <div v-loading="loading" class="chatContainer">
      <div class="message">
        <p v-if="!messages.length" class="default-message">
          {{ $t('message.chatgpt_greetings1') }}<br />
          {{ $t('message.chatgpt_greetings2') }}
        </p>

        <div v-if="!messages.length" class="example-questions">
          <el-button
            v-for="(exampleQuestion, index) in exampleQuestions"
            class="example-question"
            @click="submitForm($t(`message.chatgpt_default_questions${index}`))"
            v-html="$t(`message.chatgpt_default_questions${index}`)"
          >
          </el-button>
        </div>

        <p
          v-for="(message, index) in messages"
          class="question-message"
          :class="{ answer: index % 2 !== 0 }"
        >
          <img
            v-if="index % 2 !== 0"
            src="../assets/images/icons/chatgpticon.jpg"
            class="chat-icon"
          />
          {{ message }}
        </p>
      </div>

      <div class="footer-part">
        <el-form status-icon class="demo-ruleForm" :model="form">
          <el-form-item prop="question" class="w-100">
            <el-input
              v-model="form.prompt"
              type="textarea"
              autosize
              class="w-50 input-question"
              :placeholder="$t('message.chatgpt_write_here')"
              @keydown.enter.exact.prevent="submitForm(form.prompt)"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary send"
              :disabled="!form.prompt"
              circle
              @click="submitForm(form.prompt)"
            >
              <el-icon size="22"><Right /></el-icon>
            </el-button>
          </el-form-item>
        </el-form>

        <div class="disclaimer">
          {{ $t('message.chatgpt_disclaimer') }}
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
  import { reactive, ref } from 'vue'
  import { Right } from '@element-plus/icons-vue'
  import axios from 'axios'
  import { ElNotification } from 'element-plus'

  const drawer = ref(true)

  const form = reactive({
    prompt: null,
  })

  const messages = ref([])
  const loading = ref(false)
  const exampleQuestions = [
    'Что такое рынок капитала?',
    'Каковы риски инвестирования в рынок капитала?',
    'Какие факторы влияют на цены на фондовом рынке?',
  ]

  const submitForm = (data) => {
    loading.value = true
    axios
      .post(`${import.meta.env.VITE_APP_SERVER_URL}/chatgpt/v2/`, {
        prompt: data,
      })
      .then((response) => {
        messages.value.push(response.data.response)
      })
      .catch(({ response }) => {
        ElNotification({
          type: 'error',
          message: response.data.message || 'Malumot olishda xatolik bor!',
        })
        messages.value.push('При получении произошла ошибка.')
      })
      .finally(() => {
        loading.value = false
      })
    messages.value.push(data)
    form.prompt = null
  }
</script>

<style>
  .drawer.el-drawer.rtl {
    height: 570px;
    width: 400px !important;
    bottom: 20px;
    top: auto;
    right: 20px;
    border-radius: 10px;
    padding: 0;
  }

  .drawer .el-drawer__header {
    background: #124483;
    margin-bottom: 0;
    padding: 20px;
    color: white;
  }

  .el-drawer__body {
    padding: 0;
  }

  .footer-part .el-form-item {
    margin: 5px;
    padding: 0 14px;
  }

  .input-question .el-textarea__inner {
    padding-right: 30px;
  }

  @media only screen and (max-width: 768px) {
    .drawer.el-drawer.rtl {
      right: 0;
    }
  }
</style>

<style scoped>
  .wrapper {
    position: relative;
  }

  .chatContainer {
    height: 100%;
    position: relative;
    display: flex;
    justify-content: space-between;
    flex-direction: column;

    /*background: green;*/
  }

  .chat-bot {
    z-index: 99;
    font-size: 14px;
    right: 0;
    position: fixed;
    bottom: 30px;
    margin-right: 20px;
    padding: 20px;
  }

  .footer-part {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .input-question {
    position: relative;
    width: 100%;
    margin: 0 auto;
  }

  .message {
    height: 405px;
    overflow-y: scroll;
    padding: 15px 20px 0 20px;
  }
  .send {
    color: white;
    height: 25px;
    width: 25px;
    position: absolute;
    bottom: 9px;
    right: 5px;
  }

  .disclaimer {
    text-align: center;
    width: 100%;
    background: #124483;
    color: #eeeeee;
    height: 55px;
    padding: 10px;
    border-bottom-left-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
  }

  .question-message {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    background: #124483;
    padding: 8px;
    color: white;
    border-radius: 8px 8px 0 8px;
    font-size: 14px;
    margin: 10px 0 10px 30px;
  }

  .answer {
    background: #0093e9;
    border-radius: 8px 8px 8px 0;
    margin: 10px 30px 10px 0px;
  }

  .chatgpt {
    width: 100px;
    background: transparent;
  }

  .default-message {
    background-color: #eee;
    padding: 10px;
    font-size: 14px;
    border-radius: 8px;
    margin-bottom: 20px;
  }

  .chat-icon {
    width: 25px;
  }

  .example-question {
    font-size: 12px;
    display: flex;
    margin: 6px 0;
    white-space: normal;
    max-width: 350px;
    text-align: left;
    line-height: 1.2;
  }
</style>
