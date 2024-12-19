<template>
  <div class="wrapper">
    <h3 class="news-title">
      {{ $t('message.new_in_portal') }}
    </h3>

    <div class="news-container">
      <div class="news-item">
        <div class="news-desc">
          <p class="web-news-text">
            <span style="color: #124483; font-style: italic">26.09.2023 </span>
            &nbsp;
            {{ $t('message.new_in_portal_3') }}
          </p>
        </div>
      </div>

      <div class="news-item">
        <div class="news-desc">
          <p class="web-news-text">
            <span style="color: #124483; font-style: italic">31.08.2023 </span>
            &nbsp;
            {{ $t('message.new_in_portal_2') }}
          </p>
        </div>
      </div>

      <div class="news-item">
        <div class="news-desc">
          <p class="web-news-text">
            <span style="color: #124483; font-style: italic">26.06.2023 </span>
            &nbsp; - {{ $t('message.new_in_portal_1') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { onBeforeMount, onMounted, ref } from 'vue'

  const data = ref([])
  const loading = ref(false)

  const url = import.meta.env.VITE_APP_SERVER_URL

  const news = [
    {
      date: '26.06.2023',
      news_content: 'new_in_portal_1',
    },
    {
      date: '31.08.2023',
      news_content: 'new_in_portal_2',
    },
    {
      date: '21.09.2023',
      news_content: 'new_in_portal_3',
    },
  ]
</script>

<style scoped>
  .wrapper {
    margin: 0;
  }

  .news-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  h3.news-title {
    background-color: #094580;
    height: 50px;
    border-radius: 10px 10px 0 0;
    text-align: center;
    width: 100%;
    color: #fff;
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
  }

  .news-item {
    text-decoration: none;
    display: flex;
    flex-direction: column;
    background: #ebf4ff;
    padding: 16px;
    gap: 8px;
    border-bottom: 1px solid #cfcfcf;
  }

  .news-item:last-child {
    border: none;
  }

  .news-name {
    font-weight: 600;
    color: #373737;
    font-size: 16px;
    line-height: 1.1;
    text-align: justify;
  }

  .news-desc {
    display: flex;
    gap: 12px;
    color: #696969;
  }

  .news-image {
    width: 146px;
    height: 87px;
    border-radius: 10px;
  }

  .web-news-text {
    font-size: 14px;
    text-align: justify;
    color: #292929;
    font-weight: 600;
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
