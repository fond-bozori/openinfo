<template>
  <div class="test-container">
    <div class="status-container">
      <div class="time-left">
        <p>{{ t('message.time_left') }}</p>
        <div class="time d-flex align-items-center gap-2 fw-bold">
          <el-icon size="20"><Clock /></el-icon>
          <el-countdown :value="countdownValue" />
        </div>
      </div>
    </div>

    <div v-loading="loading" class="question-container">
      <div v-for="item in testCredentials.results?.question" class="test">
        <p class="test-question">{{ currentPage }}. {{ item.title }}</p>

        <div class="test-options">
          <el-radio-group
            v-model="answer.question_set[currentPage - 1].answer_id"
            style="text-wrap: wrap; max-width: 100%"
            class="d-flex flex-column justify-content-start align-items-start"
            @change="chooseAnswer(item)"
          >
            <el-radio
              v-for="answers in item?.answer"
              :label="answers?.id"
              size="large"
              class="radio-answer"
              style="max-width: 100%"
              >{{ answers?.title }}</el-radio
            >
          </el-radio-group>
        </div>
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

        <el-popconfirm
          :confirm-button-text="t('message.yes')"
          :cancel-button-text="t('message.no')"
          :icon="InfoFilled"
          icon-color="#626AEF"
          :title="t('message.finish_confirmation')"
          width="250"
          @confirm="sendUserAnswers"
        >
          <template #reference>
            <el-button type="danger">
              {{ t('message.finish_test') }}
            </el-button>
          </template>
        </el-popconfirm>
      </div>
    </div>
    <div class="d-flex flex-wrap mt-3 gap-2">
      <el-button
        v-for="(item, index) in testCredentials?.count"
        :key="index"
        :class="{
          activeButton: item === currentPage,
          unansweredButton: isAnswered[index],
        }"
        style="margin: 0; width: 40px"
        @click="handleCurrentChange(item)"
      >
        {{ item }}
      </el-button>
    </div>
  </div>

  <el-dialog
    v-model="showDialog"
    class=""
    center
    :show-close="false"
    align-center
    :close-on-click-modal="false"
    draggable
    style="border-radius: 8px; width: 40%"
    append-to-body
  >
    <div class="test-info-dialog">
      <div class="dialog-body">
        <img
          src="/src/assets/images/restults_image.png"
          alt="dialog-image"
          class="test-dialog-image"
        />

        <div class="test-description">
          <h4>{{ t('message.test_result') }}</h4>
          <div class="result-card ratio">
            <el-icon size="18" style="margin-right: 4px"><Finished /></el-icon>
            {{ results?.results?.percentage_correct }}%
          </div>
          <div class="result-card correct">
            <el-icon size="18" style="margin-right: 4px"><Check /></el-icon>
            {{ t('message.correct_answers') }}:
            {{ results?.results?.correct_count }}
          </div>
          <div class="result-card incorrect">
            <el-icon size="18" style="margin-right: 4px"><Close /></el-icon>
            {{ t('message.incorrect_answers') }}:
            {{ results?.results?.incorrect_count }}
          </div>
        </div>
      </div>
      <div class="flex">
        <el-button
          type="success"
          size="large"
          class="result_button"
          @click="startAgain"
        >
          {{ t('message.restart_test') }}</el-button
        >
        <el-button
          type="success"
          size="large"
          class="result_button"
          @click="goToResults"
        >
          {{ t('message.review_answers') }}
        </el-button>
        <el-button
          type="success"
          size="large"
          class="result_button"
          @click="goToAttestation"
        >
          {{ t('message.close_test') }}
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script setup>
  import {
    Back,
    Check,
    Clock,
    Close,
    Finished,
    InfoFilled,
    Right,
  } from '@element-plus/icons-vue'
  import { computed, onMounted, reactive, ref, watch } from 'vue'
  import http from '@/http'
  import { useStore } from '@/stores/store'
  import { emptyAnswer } from '@/components/attestation-test/Materials'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'

  const showDialog = ref(false)

  const answer = reactive({
    question_set:
      JSON.parse(localStorage.getItem('testAnswers')) ||
      emptyAnswer.map((item) => ({ ...item })),
  })

  const loading = ref(false)
  const currentPage = ref(1)
  const store = useStore()
  const testCredentials = ref({})
  const results = ref({})
  const { t } = useI18n()
  const countdownValue = ref(0)
  const sessionId = ref('')

  const calculateRemainingTime = (end) => {
    countdownValue.value = new Date(end).getTime()
  }

  const router = useRouter()

  const handleCurrentChange = (val) => {
    currentPage.value = val
    getQuestions()
  }
  const responseAfterAnswer = ref({})

  const getNext = () => {
    currentPage.value = currentPage.value + 1
    getQuestions()
  }

  const chooseAnswer = (val) => {
    answer.question_set[currentPage.value - 1].question_id = val.id
  }

  const finishQuiz = async () => {
    loading.value = true
    try {
      const response = await http.post(`reestr/finish-quiz/`)
      results.value = response.data
      showDialog.value = true
      countdownValue.value = Date.now()
      localStorage.removeItem('testAnswers')
      answer.question_set = emptyAnswer.map((item) => ({ ...item }))
    } catch (err) {
      console.log(err)
    } finally {
      loading.value = false
    }
  }

  const sendUserAnswers = async () => {
    try {
      const response = await http.post(`reestr/submit-all-answers/`, answer)
      responseAfterAnswer.value = response.data
      await finishQuiz()
    } catch (err) {
      console.log(err)
    }
  }

  watch(
    () => answer.question_set,
    (newVal) => {
      localStorage.setItem('testAnswers', JSON.stringify(newVal))
    },
    { deep: true },
  )

  function getCookie(name) {
    const value = '; ' + document.cookie
    const parts = value.split('; ' + name + '=')
    if (parts.length == 2) return parts.pop().split(';').shift()
  }

  const getPrevious = async () => {
    currentPage.value = currentPage.value - 1
    await getQuestions()
  }

  const checkExsistingTest = async () => {
    loading.value = true
    try {
      const response = await http.get('/reestr/questions/is_exist')
      if (
        response.data.is_exist === true &&
        response.data.is_completed === false
      ) {
        // Only fetch question time if the test exists and is not completed
        await getQuestionsTime()
      } else {
        // Start test if it does not exist or is already completed
        await startTest()
      }
    } catch (err) {
      console.log(err)
    }
  }

  const getQuestions = async () => {
    sessionId.value = getCookie('session_id')
    try {
      loading.value = true
      const response = await http.get(
        `/reestr/questions_paginated/?page=${currentPage.value}`,
      )
      testCredentials.value = response.data
      loading.value = false
    } catch (err) {
      console.log(err)
      loading.value = false
    }
  }

  const getQuestionsTime = async () => {
    try {
      loading.value = true
      const response = await http.get(`/reestr/questions_paginated/`)
      calculateRemainingTime(response.data?.results?.end_at)
      await getQuestions()
    } catch (err) {
      console.log(err)
      loading.value = false
    }
  }

  const isAnswered = computed(() => {
    return answer.question_set?.map((a) => a.answer_id !== null)
  })

  const startTest = async () => {
    currentPage.value = 1
    loading.value = true
    try {
      const response = await http.post('/reestr/questions/generate-quiz/', {
        language: store.$state.test_language,
        username: store.$state.name_test_taker,
      })
      await getQuestions()
      calculateRemainingTime(response.data?.end_at)
    } catch (err) {
      console.log(err)
    } finally {
      loading.value = false
    }
  }

  const goToResults = () => {
    router.push('/test-results')
  }
  const goToAttestation = () => {
    store.setTestTaker('')
    router.push('/attestation')
  }

  const startAgain = () => {
    showDialog.value = false
    startTest()
  }

  onMounted(() => {
    if (!localStorage.getItem('testAnswers')) {
      // Initialize localStorage if not already set
      localStorage.setItem('testAnswers', JSON.stringify(answer.question_set))
    }
    checkExsistingTest()
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

  .progress-container {
    width: 80%;
    display: flex;
    flex-direction: column;
    gap: 4px;
    color: #373737;
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
    z-index: 1;
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

  .test-info-dialog {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .dialog-body {
    padding: 0 32px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    gap: 40px;
    margin-bottom: 20px;
    height: 100%;
  }

  .test-dialog-image {
    width: 100%;
    flex: 1;
    height: auto;
    max-width: 320px;
    /*max-height: 300px;*/
    /* object-fit: scale-down; */
  }

  @media only screen and (max-width: 1400px) {
    .test-dialog-image {
      display: none;
    }
  }

  @media only screen and (max-width: 1550px) {
    .test-dialog-image {
      max-width: 200px;
      height: auto;
    }
  }

  .test-description {
    width: 100%;
    border-radius: 10px;
    height: 100%;
    margin-top: 32px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    flex: 1;
  }

  .test-dialog-header {
    color: #094580;
    font-size: 28px;
  }

  .result-card {
    display: flex;
    align-items: center;
    color: #fff;
    padding: 16px 20px;
  }

  .incorrect {
    background: #dc0028;
  }

  .correct {
    background: #0cb866;
  }

  .ratio {
    background: #0f70cf;
  }

  .congrats-text {
    width: 100%;
    font-size: 14px;
  }

  .radio-answer {
    max-width: 100%;
    line-height: 1.5;
    margin: 4px 0;
    white-space: wrap;
    word-wrap: break-word; /* For older browsers */
    overflow-wrap: break-word; /* For modern browsers */
  }

  .activeButton {
    background-color: #0f70cf; /* Active page button */
    color: #fff;
  }

  .unansweredButton {
    background-color: #0f70cf;
    color: #fff;
  }
</style>
