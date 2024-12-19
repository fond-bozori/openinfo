<template>
  <div class="wrapper">
    <!--   <h3 class="news-title">-->
    <!--    {{$t("message.news")}}-->
    <!--   </h3>-->

    <div class="news-container">
      <a v-for="item in data" :href="item.url_link" class="news-item">
        <div class="news-head">
          <div class="img-container">
            <img :src="item.image_link" class="news-image" />
          </div>
          <div class="news-title-container">
            <div class="news-name">
              {{ item.title }}
            </div>
            <span class="data-news">{{
              new Date(item.pub_date).toLocaleDateString('ru-RU', options)
            }}</span>
          </div>
        </div>
        <p class="news-description-text">
          {{ item.content }}
        </p>
      </a>
    </div>
  </div>
</template>

<script setup>
  import {
    computed,
    onBeforeMount,
    onMounted,
    ref,
    watch,
    watchEffect,
  } from 'vue'
  import axios from 'axios'
  import { useStore } from '@/stores/store'

  const selectedQuarter = ref('all')

  const data = ref([])
  const loading = ref(false)

  const url = import.meta.env.VITE_APP_SERVER_URL
  const store = useStore()
  const currentLanguage = ref(store.$state.currentLanguage)

  const getNews = (lang) => {
    loading.value = true
    axios
      .get(`${url}/home/news/?lang=${lang}`, {
        method: 'get',
      })
      .then((response) => {
        data.value = response.data.results
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        loading.value = false
      })
  }

  watch(
    () => store.$state.currentLanguage,
    (newValue, oldValue) => {
      getNews(newValue) // Call getNews with the new language parameter
    },
  )

  onMounted(() => {
    getNews(currentLanguage.value)
  })
</script>

<style scoped>
  .news-title-container {
    display: flex;
    flex-direction: column;
  }

  .wrapper {
    margin-bottom: 20px;
  }

  .news-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
    align-items: center;

    /*padding: 15px 20px;*/
  }

  h3.news-title {
    background-color: #094580;
    height: 50px;
    border-radius: 10px;
    text-align: center;
    width: 100%;
    color: #fff;
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    text-transform: uppercase;
  }

  .news-item {
    text-decoration: none;
    display: flex;
    flex-direction: column;
    background: #ebf4ff;
    border-radius: 10px;
    padding: 16px;
    gap: 4px;
  }

  .news-head {
    display: flex;
    gap: 8px;
  }

  .news-name {
    font-weight: 600;
    color: #373737;
    font-size: 16px;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    /* Number of lines to show before truncating */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    /*text-align: justify;*/
  }

  .news-image {
    width: 80px !important;
    height: 65px !important;
    border-radius: 10px;
  }

  .data-news {
    font-size: 14px;
    color: #124483;
  }

  .news-description-text {
    color: #696969;
    font-size: 14px;
    text-align: justify;

    display: -webkit-box;
    -webkit-line-clamp: 4;
    /* Number of lines to show before truncating */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: 767px) {
    html {
      font-size: 14px;
    }
  }

  @media (max-width: 767px) {
    html {
      font-size: 14px;
    }
  }
</style>
