<template>
  <div class="personal-cabinet__container">
    <a
      :href="`https://openinfo.uz/${store.$state.currentLanguage}/admin/`"
      target="_blank"
      class="header-name title"
    >
      <el-icon size="22"><Back /></el-icon>
      <p>{{ $t('message.personal_cabinet') }}</p></a
    >

    <div class="organization-link-container">
      <a
        href="https://napp.uz/uz#zero-220"
        target="_blank"
        class="organization-links"
      >
        <img
          src="https://napp.uz/img/logo.png"
          alt=""
          class="organization-icon"
        />
        <div class="organization-link-text">{{ $t('message.napp') }}</div>
      </a>
    </div>

    <div class="organization-link-container">
      <a
        href="http://www.fondbozori.uz/"
        target="_blank"
        class="organization-links"
      >
        <img
          src="/src/assets/images/home-images/capitallogo.png"
          alt=""
          class="organization-icon"
        />
        <div class="organization-link-text">
          {{ $t('message.Information - resource center of capital market') }}
        </div>
      </a>
    </div>

    <div class="organization-link-container">
      <a href="https://uzse.uz/" target="_blank" class="organization-links">
        <img
          src="/src/assets/images/home-images/lg2.png"
          alt=""
          class="organization-icon"
        />
        <div class="organization-link-text">
          {{ $t('message.Republican stock exchange') }}
        </div>
      </a>
    </div>

    <div class="organization-link-container">
      <a href="https://deponet.uz/" target="_blank" class="organization-links">
        <img
          src="/src/assets/images/home-images/lg3.png"
          alt=""
          class="organization-icon"
        />
        <div class="organization-link-text">
          {{ $t('message.The state enterprise central securities') }}
        </div>
      </a>
    </div>

    <div class="organization-link-container">
      <a
        href="https://www.uzrvb.uz/"
        target="_blank"
        class="organization-links"
      >
        <img
          src="/src/assets/images/home-images/lg4.png"
          alt=""
          class="organization-icon"
        />
        <div class="organization-link-text">
          {{ $t('message.Uzbek republican currency exchange') }}
        </div>
      </a>
    </div>

    <div class="organization-link-container">
      <a
        href="https://www.kapitalbozori.uz/"
        target="_blank"
        class="organization-links"
      >
        <img
          src="/src/assets/images/home-images/kapital-logo.png"
          alt=""
          class="organization-icon"
        />
        <div class="organization-link-text">
          {{ $t('message.Information resource of capital market') }}
        </div>
      </a>
    </div>
  </div>
  <Emitent />
  <Feedback />
</template>

<script setup>
  import Emitent from './EmitentOld.vue'
  import { Back } from '@element-plus/icons-vue'
  import { useStore } from '@/stores/store'

  const store = useStore()
</script>

<style scoped>
  .header-name {
    /* background: #124483; */
    border-radius: 10px;
    color: #fff;
    text-align: center;
    height: 50px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #124483;
    gap: 20px;
    text-transform: uppercase !important;
  }

  .personal-cabinet__container {
    /*height : 570px;*/
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    gap: 20px;
  }

  .organization-link-container {
    box-shadow: 0px 1px 3px 2px rgba(207, 207, 207, 0.35);
    border-radius: 10px;
    background: linear-gradient(to right, #124483 50%, white 50%);
    background-size: 200% 100%;
    background-position: right bottom;
    transition: all 0.5s ease-out;
    color: #266184;
  }

  .organization-link-container:hover {
    color: #fff;
    background-position: left bottom;
  }

  a.organization-links {
    text-decoration: none;
    color: #124483;
    transition: all 0.6s ease-out;
    font-weight: 600;
  }

  a.organization-links:hover {
    color: #fff;
    text-decoration: none;
  }

  .organization-links {
    position: relative;
    display: flex;
    align-items: center;
    padding: 20px 20px 20px 25px;
    gap: 20px;
  }

  .organization-links:before {
    content: ' ';
    background: #124483;
    padding: 0.5rem;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }

  .organization-icon {
    width: 60px;
  }

  .organization-link-text {
    text-transform: uppercase;
    font-size: 14px;
    font-weight: 500 !important;
  }

  .news-container {
    margin-top: 20px;
    box-shadow: 0px 1px 3px 2px rgba(207, 207, 207, 0.35);
    border-radius: 10px;
  }

  .banner {
    border-radius: 10px;
    box-shadow: 0px 3px 6px 5px rgb(207 207 207 / 37%);
  }

  .login-button-container {
    display: flex;
    gap: 10px;
  }

  .login-icon {
    font-size: 16px;
    margin-right: 10px;
  }
</style>
