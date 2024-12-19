<template>
  <div class="header-name title">{{ $t('message.attestation') }}</div>
  <CertifiedPeopleList />
  <TestMaterialsTable />

  <div class="take-test d-flex w-100 mt-5">
    <el-button
      type="success"
      size="large"
      class="w-100"
      @click="showDialog = true"
      ><el-icon color="white" style="margin-right: 4px" size="20px"
        ><Select
      /></el-icon>
      {{ $t('message.take_test') }}</el-button
    >
  </div>

  <el-dialog
    v-model="showDialog"
    v-loading="loading"
    class="w-50"
    center
    align-center
    draggable
    style="border-radius: 8px"
    append-to-body
  >
    <div v-if="isTestFinished" class="test-info-dialog">
      <h4 class="test-dialog-header">{{ t('message.test_dialog_title') }}</h4>
      <div class="dialog-body">
        <img
          src="/src/assets/images/test-image-dialog.png"
          alt="dialog-image"
          class="test-dialog-image"
        />

        <el-card class="test-description" shadow="never">
          <p v-html="$t('message.about_the_test')"></p>
          <el-divider />
          <div class="flex gap-5 mt-3 flex-column">
            <el-form label-position="top">
              <el-form-item :label="t('message.your_name')">
                <el-input
                  v-model="testTakerName"
                  :placeholder="t('message.your_name')"
                />
              </el-form-item>
              <el-form-item :label="t('message.test_questions_language')">
                <el-select v-model="testLanguage" placeholder="Select">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-form>
            <el-button
              type="success"
              size="large"
              :disabled="testTakerName <= 2"
              class="button-mor w-100"
              @click="setData"
            >
              {{ t('message.start_test') }}</el-button
            >
          </div>
        </el-card>
      </div>
    </div>
    <div v-if="!isTestFinished" class="test-info-dialog">
      <h4 class="test-dialog-header">{{ t('message.test_dialog_title') }}</h4>
      <div class="dialog-body align-items-center">
        <img
          src="/src/assets/images/test-image-dialog.png"
          alt="dialog-image"
          class="test-dialog-image"
        />
        <el-card class="test-description" shadow="never">
          <p class="Unfinished-text" v-html="t('message.unfinished_text')"></p>
          <div class="d-flex gap-4 mt-4">
            <el-button
              type="success"
              size="large"
              class="button-mor"
              @click="
                $router.push({ path: '/certificate-tests', replace: true })
              "
            >
              {{ t('message.continue_test') }}</el-button
            >
            <el-button
              type="success"
              size="large"
              class="button-mor"
              @click="startNewTest"
            >
              {{ t('message.new_test') }}</el-button
            >
          </div>
        </el-card>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
  import { useStore } from '@/stores/store'
  import CertifiedPeopleList from '@/components/professional-participants/CertifiedPeopleList.vue'
  import { onMounted, reactive, ref } from 'vue'
  import { Select } from '@element-plus/icons-vue'
  import http from '@/http/index'
  import TestMaterialsTable from '@/components/professional-participants/TestMaterialsTable.vue'
  import { emptyAnswer } from '@/components/attestation-test/Materials'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  const store = useStore()
  const { t } = useI18n()
  const isTestFinished = ref(true)
  const loading = ref(false)
  const showDialog = ref(false)
  const router = useRouter()
  const answer = reactive({ question_set: emptyAnswer })
  const testTakerName = ref('')

  const testLanguage = ref(store.$state.test_language)

  const options = [
    {
      value: 'uz',
      label: 'Uzbek',
    },
    {
      value: 'ru',
      label: 'Russian',
    },
  ]
  const checkExsistingTest = async () => {
    loading.value = true
    try {
      const response = await http.get('/reestr/questions/is_exist')
      isTestFinished.value = !(
        response.data.is_exist === true && response.data.is_completed === false
      )
    } catch (err) {
      console.log(err)
    } finally {
      loading.value = false
    }
  }

  const startNewTest = async () => {
    try {
      await http.post(`reestr/finish-quiz/`)
      localStorage.setItem('testAnswers', JSON.stringify(answer.question_set))
    } catch (err) {
      console.log(err)
    } finally {
      await router.push({ path: '/certificate-tests', replace: true })
    }
  }

  const setData = async () => {
    await store.setTestTaker(testTakerName.value)
    await store.setTestLanguage(testLanguage.value)
    await router.push({ path: '/certificate-tests', replace: true })
  }

  onMounted(() => {
    checkExsistingTest()
  })
</script>

<style scoped>
  .test-info-dialog {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .header-name {
    border-radius: 10px;
    text-transform: uppercase;
    color: #fff;
    text-align: center;
    height: 50px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #124483;
  }

  .dialog-body {
    padding: 0 32px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 20px;
  }

  .test-dialog-image {
    width: 100%;
    height: auto;
    /*max-width: 500px;*/
    max-width: 300px;
    /*max-height: 300px;*/
    object-fit: scale-down;
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
  }

  .test-dialog-header {
    color: #094580;
    font-size: 28px;
    text-align: center;
  }

  .Unfinished-text {
    font-size: 18px;
    color: #094580;
  }
</style>
