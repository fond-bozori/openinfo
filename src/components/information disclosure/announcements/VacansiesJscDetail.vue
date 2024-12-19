<template>
  <div v-loading="loading" class="main-wrapper">
    <div class="header-name title">
      <p>{{ data.title }}</p>
    </div>
    <div class="name-of-fact justify-content-between">
      <div class="d-flex gap-2 align-items-end">
        <img
          src="/src/assets/images/icons/calendarwhite.svg"
          alt="iconCalendar"
          class="calendar"
        />
        {{ $t('message.date_recognized') }}
        <i
          >{{ new Date(data.pub_date).toLocaleDateString('ru-RU', options) }}
        </i>
      </div>
      <div class="d-flex gap-2 align-items-end">
        <img
          src="/src/assets/images/icons/calendarwhite.svg"
          alt="iconCalendar"
          class="calendar"
        />
        {{ $t('message.data_approved') }}
        <i v-if="data.approved_date">{{
          new Date(data.approved_date).toLocaleDateString('ru-RU', options)
        }}</i>
        <i v-else
          >{{ new Date(data.pub_date).toLocaleDateString('ru-RU', options) }}
        </i>
      </div>
    </div>
    <div ref="htmlContainer" class="renderedHtml"></div>
  </div>

  <div class="social-links">
    <a :href="`https://openinfo.uz/ru/announce/to_pdf/${id}/`" download>
      <img src="/src/assets/images/icons/pdf.svg" alt="pdfIcon"
    /></a>
    <!--      <img src="/src/assets/images/icons/facebook.svg" alt="facebookIcon"/>-->
    <!--      <img src="/src/assets/images/icons/twitter.svg" alt="twitterIcon"/>-->
  </div>
</template>

<script setup>
  import { ref, onMounted, computed } from 'vue'
  import axios from 'axios'
  import { useRoute } from 'vue-router'

  const data = ref([])

  const url = import.meta.env.VITE_APP_SERVER_URL
  const dateValue = ref([])
  const loading = ref(false)
  const route = useRoute()
  const id = computed(() => route.params.id)

  const htmlContainer = ref(null)

  const getFactsById = () => {
    loading.value = true
    axios
      .get(`${url}/announcement/main/${id.value}`, {
        method: 'get',
      })
      .then((response) => {
        data.value = response.data
        htmlContainer.value.innerHTML = data.value.body
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        loading.value = false
      })
  }

  onMounted(() => {
    window.scrollTo(0, 0)
    getFactsById()
  })
</script>

<style scoped>
  .main-wrapper {
    /*min-height: 100vh;*/
  }

  .renderedHtml {
    color: #181818;
    padding: 24px;
    list-style: none;
    min-height: 55vh;
    border: 1px solid #ddd;
    border-radius: 10px;
  }

  ol {
    list-style: none;
  }

  .header-name {
    /* background: #124483; */
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
    gap: 20px;
  }

  .table-footer {
    background: #831234;
    height: 59px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 20px;
  }

  .social-links {
    display: flex;
    /*justify-content: center;*/
    align-items: center;
    margin: 20px 0;
    gap: 10px;
  }

  .name-of-fact {
    background: green;
    height: 50px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    margin: 20px 0 20px 0;
    padding: 20px;
    justify-content: center;
  }

  .table-footer {
    margin-top: 20px;
  }
</style>
