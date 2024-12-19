<template>
  <div class="emitent">
    <div class="emitent-title">{{ $t('message.top') }} 5</div>
    <el-select
      v-model="selectedOption"
      style="width: 85%"
      :placeholder="$t('message.issuers by income')"
      size="large"
      @change="changeSelection"
    >
      <el-option
        key="income"
        :label="$t('message.issuers by income')"
        value="income"
      />
      <el-option
        key="information-disclosure"
        :label="$t('message.issuers by information disclosure')"
        value="information-disclosure"
      >
      </el-option>
    </el-select>
  </div>

  <div v-if="param === 'income'" class="top-emitent__container">
    <div class="top-emitent__item" style="background-color: #e6f3ff">
      <div class="emitent-item__name">
        <p style="font-size: 14px; color: #124483" class="fw-bold">
          2023 {{ $t('message.q') }}3
        </p>
      </div>
      <p style="font-size: 14px; color: #124483" class="fw-bold">
        {{ $t('message.ths sum') }}
      </p>
    </div>

    <div v-for="(item, index) in data" class="top-emitent__item">
      <div class="emitent-item__name">
        {{ index + 1 }}.&nbsp;
        <p class="emitent-number">
          {{ item.main_report__organization__short_name_text }}
        </p>
      </div>
      <p class="emitent-number">{{ item.value3.toLocaleString('ru') }}</p>
    </div>
  </div>

  <div v-if="param === 'information-disclosure'" class="top-emitent__container">
    <div class="top-emitent__item" style="background-color: #e6f3ff">
      <div class="emitent-item__name">
        <p style="font-size: 14px; color: #124483" class="fw-bold">
          2023 {{ $t('message.q') }}3
        </p>
      </div>
      <p style="font-size: 14px; color: #124483" class="fw-bold">
        {{ $t('message.count') }}
      </p>
    </div>

    <a v-for="(item, index) in data" target="_blank" class="top-emitent__item">
      <div class="emitent-item__name">
        {{ index + 1 }}. &nbsp;
        <p class="emitent-number">
          {{ item.organization__short_name_text }}
        </p>
      </div>
      <p class="emitent-number">{{ item.fact_count }}</p>
    </a>
  </div>
</template>

<script setup>
  import { onBeforeMount, onMounted, ref } from 'vue'
  import axios from 'axios'
  import TestComponent from '@/components/TestComponent.vue'
  import Emitent from '@/components/Emitent.vue'

  const selectedQuarter = ref('all')

  const data = ref(null)

  const loading = ref(false)

  const yearOptions = [
    {
      value: 'income',
      label: 'issuers by income',
    },
    {
      value: 'information-disclosure',
      label: 'issuers by information discolsure',
    },
  ]

  const selectedOption = ref(yearOptions[0].value)

  const param = ref('income')

  const url = import.meta.env.VITE_APP_SERVER_URL

  const getTopEmitents = () => {
    loading.value = true

    axios
      .get(`${url}/home/top-issuers/?top_by=${param.value}`, {
        method: 'get',
      })
      .then((response) => {
        data.value = response.data.result
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        loading.value = false
      })
  }

  const changeSelection = () => {
    param.value = selectedOption.value
    getTopEmitents()
  }

  onMounted(() => {
    getTopEmitents()
  })
</script>

<style scoped>
  h1 {
    text-align: center;
    margin: 2rem 0;
    font-size: 2.5rem;
  }

  .emitent-title {
    color: #ffffff;
  }
  .emitent {
    display: flex;
    justify-content: space-between;
    background-color: #094580;
    height: 56px;
    border-radius: 10px 10px 0 0;
    align-items: center;
    padding: 15px 20px;
    margin-top: 25px;
  }

  /* Remove focus outline */
  option:focus {
    outline: none;
  }

  /* Remove IE arrow */
  option::-ms-expand {
    display: none;
  }

  @media (max-width: 767px) {
    html {
      font-size: 14px;
    }
  }

  .top-emitent__container {
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 6px rgba(181, 181, 181, 0.25);
    border: 1px solid rgba(181, 181, 181, 0.25);
    border-radius: 0 0 10px 10px;
    margin-bottom: 10px;
  }

  .top-emitent__item {
    align-items: center;
    justify-content: space-between;
    text-decoration: none;
    gap: 10px;
    align-items: center;
    height: 60px;
    padding: 5px 15px;
    border-bottom: 1px dashed #9e9e9e;
    display: flex;

    /* justify-content: space-between; */
  }

  .top-emitent__item:last-child {
    border-bottom: none;
    border-radius: 0 0 10px 10px;
  }

  .top-emitent__item:hover {
    text-decoration: none;
    background-color: #e6f3ff;
  }

  .emitent-item__name {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #6b6969;
    font-weight: 700;
    flex: 2;

    /* justify-content: space-between; */
  }

  .emitent-number {
    justify-content: flex-end;
    float: right;
    margin: 0;
    color: #124483;
  }

  @media (max-width: 767px) {
    html {
      font-size: 14px;
    }
  }
</style>
