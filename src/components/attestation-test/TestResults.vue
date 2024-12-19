<template>
  <div class="test-container">
    <div class="status-container">
      <div class="time-left">
        <p>{{ t('message.time_left') }}</p>
        <div class="time d-flex align-items-center gap-2 fw-bold">
          <el-icon size="20"><Clock /></el-icon>
          <el-countdown />
        </div>
      </div>
    </div>

    <div v-loading="loading" class="question-container">
      <div v-for="item in ViewResults.results?.question" class="test">
        <p class="test-question">{{ currentPage }}. {{ item.title }}</p>

        <div class="test-options">
          <el-radio-group
            v-model="answer"
            disabled
            style="text-wrap: wrap; max-width: 100%; margin-bottom: 28px"
            class="d-flex flex-column justify-content-start align-items-start"
          >
            <el-radio
              v-for="answers in item?.answer"
              :label="answers?.id"
              size="large"
              class="radio-answer"
              style="max-width: 100%"
            >
              {{ answers?.title }}</el-radio
            >
          </el-radio-group>
        </div>
        <el-tag
          v-if="ViewResults.results?.user_answers[0].is_correct"
          effect="dark"
          size="large"
          type="success"
        >
          <p class="result-info">
            {{ t('message.answer-correct') }}
            <el-icon size="18"><SuccessFilled /></el-icon></p
        ></el-tag>
        <el-tag
          v-if="!ViewResults.results?.user_answers[0].is_correct"
          effect="dark"
          size="large"
          type="danger"
          class=""
        >
          <p class="result-info">
            {{ t('message.answer-incorrect') }}
            <el-icon size="18"><CircleCloseFilled /></el-icon></p
        ></el-tag>
      </div>
    </div>

    <div
      class="d-flex button-container flex-column gap-4 align-items-start w-100"
    >
      <div
        class="before-after w-100 d-flex gap-3 align-items-start justify-content-between"
      >
        <div class="flex gap-5">
          <el-button :disabled="currentPage === 1" @click="getPrevious">
            <el-icon style="margin-right: 6px"><Back /></el-icon>
            {{ t('message.previous') }}
          </el-button>
          <el-button
            :disabled="currentPage === testCredentials?.count"
            @click="getNext()"
          >
            {{ t('message.next') }}
            <el-icon style="margin-left: 6px"><Right /></el-icon>
          </el-button>
        </div>
        <el-button type="success" @click="$router.push('/attestation')">
          {{ t('message.attestation') }}
          <el-icon style="margin-left: 4px"><TopRight /></el-icon>
        </el-button>
      </div>
    </div>
    <div class="d-flex flex-wrap mt-3 gap-2">
      <el-button
        v-for="(item, index) in ViewResults?.count"
        :key="index"
        :class="{ activeButton: item === currentPage }"
        style="margin: 0; width: 40px"
        @click="handleCurrentChange(item)"
      >
        {{ item }}
      </el-button>
    </div>
  </div>
</template>
<script setup>
  import {
    Clock,
    Right,
    Back,
    Check,
    InfoFilled,
    TopRight,
    SuccessFilled,
    CircleCloseFilled,
  } from '@element-plus/icons-vue'
  import { computed, onMounted, reactive, ref, watch } from 'vue'
  import http from '@/http'
  import { useStore } from '@/stores/store'
  import { emptyAnswer } from '@/components/attestation-test/Materials'
  import { useI18n } from 'vue-i18n'

  const answer = ref(null)

  const loading = ref(false)
  const currentPage = ref(1)
  const testCredentials = ref({})

  const { t } = useI18n()

  const ViewResults = ref([])
  const sessionId = ref('')

  const handleCurrentChange = (val) => {
    currentPage.value = val
    getResults()
  }

  const getNext = () => {
    currentPage.value = currentPage.value + 1
    getResults()
  }

  function getCookie(name) {
    const value = '; ' + document.cookie
    const parts = value.split('; ' + name + '=')
    if (parts.length == 2) return parts.pop().split(';').shift()
  }

  const getPrevious = async () => {
    if (currentPage.value >= currentPage.value) {
      currentPage.value = 1
      await getResults()
    } else {
      currentPage.value = currentPage.value - 1
      await getResults()
    }
  }

  const getResults = async () => {
    try {
      loading.value = true
      const response = await http.get(
        `reestr/api/session/answers/?session_id=${sessionId.value}&page=${currentPage.value}`,
      )
      ViewResults.value = response.data
      answer.value = response.data.results?.user_answers[0].answer_id
    } catch (err) {
      console.log(err)
      loading.value = false
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    sessionId.value = getCookie('session_id')
    getResults()
  })
</script>

<style scoped>
  .test-container {
    background: url('../../assets/images/test-background.png');
    background-size: cover;
    width: 100%;
    min-height: 70vh;
    padding: 20px 90px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: 20px;
    border-radius: 10px;
  }

  .title-test h3 {
    color: #373737;
    font-size: 22px;
  }

  .status-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
    margin-bottom: 20px;
    gap: 30px;
  }

  .time-left {
    display: flex;
    flex-direction: column;
    color: #373737;
    gap: 4px;
  }

  .time-left .time {
    background: #d9ecff;
    padding: 4px 50px;
    border-radius: 8px;
  }

  .question-container {
    min-height: 250px;
    height: auto;
    background: #ffffff;
    padding: 24px;
    border-radius: 10px;
    border: 2px solid #d2d2d2;
    width: 100%;
    margin-bottom: 22px;
    /*height: 100vh;*/
  }

  .test-question {
    color: #373737;
  }

  .test-options {
    margin-top: 4px;
  }

  .question-container .test-options {
    margin-top: 12px;
    padding: 0 40px;
  }

  .activeButton {
    background: #0f70cf;
    color: #fff;
  }

  .result-info {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 16px;
    color: #fff;
  }

  .radio-answer {
    max-width: 100%;
    line-height: 1.5;
    margin: 4px 0;
    text-wrap: pretty;
    white-space: normal;
  }

  .radio-answer .el-radio__label {
    white-space: normal;
  }

  .activeButton {
    background-color: #0f70cf; /* Active page button */
    color: #fff;
  }
</style>
