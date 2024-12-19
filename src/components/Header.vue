<template>
  <div class="header">
    <div
      class="bottom-header__left logo"
      @click="$router.push({ path: '/home', replace: true })"
    >
      <img
        src="/src/assets/images/icons/logo.svg"
        class="logo-icon"
        alt="logo-image"
        style="width: 45px"
      />
      <h1 class="logo-name" v-html="$t('message.logoName')"></h1>
    </div>

    <el-autocomplete
      v-model="factSearchInput"
      :fetch-suggestions="querySearch"
      :placeholder="$t('message.placeholder_for_search')"
      :trigger-on-focus="false"
      class="inline-input w-50"
      clearable
      size="large"
      value-key="full_name_text"
      @select="organizationSelect"
    >
      <template #append>
        <el-button :icon="Search" />
      </template>
      <template #default="{ item }">
        <div class="suggestion-item">
          <img
            v-if="item.logo"
            :src="item.logo"
            alt="logo"
            class="autocomplete-logo"
          />
          <img
            v-if="!item.logo"
            src="../assets/images/icons/company-blue.svg"
            alt="logo"
            class="autocomplete-logo"
          />
          <span>{{ item.full_name_text }}</span>
        </div>
      </template>
    </el-autocomplete>

    <!--    <el-select-->
    <!--      v-model="selectedLanguage"-->
    <!--      placeholder="Select Language"-->
    <!--      style="width: 120px"-->
    <!--      @change="changeLang"-->
    <!--    >-->
    <!--      &lt;!&ndash; Loop through the languages array for dropdown options &ndash;&gt;-->
    <!--      <el-option v-for="lang in languages" key="lang" :value="lang.value">-->
    <!--        <img-->
    <!--          class="lang-icon"-->
    <!--          :src="lang.img"-->
    <!--          alt="lang-img"-->
    <!--          style="width: 20px; height: 20px"-->
    <!--        />-->
    <!--      </el-option>-->
    <!--    </el-select>-->

    <div class="lang-container">
      <a
        class="enter-profile"
        :href="`https://openinfo.uz/${store.$state.currentLanguage}/admin/`"
        target="_blank"
        >{{ $t('message.personal_cabinet')
        }}<el-icon size="20"><UserFilled /></el-icon
      ></a>
      <a
        class="enter-profile"
        :href="`https://invest.openinfo.uz/`"
        target="_blank"
        >{{ $t('message.investor_cabinet')
        }}<el-icon size="20"><Histogram /></el-icon
      ></a>

      <img
        class="lang-icon"
        src="/src/assets/images/language_images/ru.png"
        alt="lang-img"
        @click="changeLang('ru')"
      />
      <img
        class="lang-icon"
        src="/src/assets/images/language_images/uz.png"
        alt="lang-img"
        @click="changeLang('uz')"
      />
      <img
        class="lang-icon"
        src="/src/assets/images/language_images/en.png"
        alt="lang-img"
        @click="changeLang('en')"
      />
    </div>
  </div>
</template>

<script setup>
  import { UserFilled, Histogram } from '@element-plus/icons-vue'
  import { Search } from '@element-plus/icons-vue'

  import { changeGoogleTranslateLanguage, i18n } from '../i18n/translate.js'
  import { useStore } from '@/stores/store'
  import http from '@/http'
  import { useRouter } from 'vue-router'
  import { ref } from 'vue'

  const store = useStore()

  // Languages array
  const languages = [
    {
      label: 'Russian',
      value: 'ru',
      img: '/src/assets/images/language_images/ru.png',
    },
    {
      label: 'English',
      value: 'en',
      img: '/src/assets/images/language_images/en.png',
    },
    {
      label: 'Uzbek',
      value: 'uz',
      img: '/src/assets/images/language_images/uz.png',
    },
  ]

  const router = useRouter()
  const changeLang = (lang) => {
    store.setActiveLanguage(lang)
    i18n.global.locale.value = lang
  }

  const organizationSelect = async (val) => {
    factSearchInput.value = ''
    await router.push({
      name: 'company-profile',
      params: { id: val.id },
    })
    // await updateQueryState('page', currentPage.value);
    // factSearchInput.value = val.full_name_text
    //  updateQueryState('search', val.full_name_text )
    // getFacts()
  }

  const getSelectedLangImage = (value) => {
    const selectedLang = languages.find((lang) => lang.value === value)
    return selectedLang ? selectedLang.img : ''
  }

  const factSearchInput = ref('')
  const suggestionsList = ref([])
  const querySearch = (queryString, cb) => {
    http
      .get(`/home/autofill/?name=${queryString}`)
      .then((response) => {
        suggestionsList.value = response.data
        cb(suggestionsList.value)
      })
      .catch((err) => {
        console.log(err, 'error')
      })
  }
</script>

<style scoped>
  .header {
    padding: 10px 60px 10px 60px;
    display: flex;
    justify-content: space-between;
    /*flex-wrap: wrap;*/
    background: #ffffff;
    gap: 14px;
    align-items: center;
  }

  .lang-container {
    display: flex;
    gap: 10px;
    padding: 5px 0;
    align-items: center;
  }

  .lang-icon {
    width: 26px;
    height: 26px;
    border-bottom: 1px solid transparent;
    cursor: pointer;
  }

  .bottom-header__left {
    text-decoration: none;
    display: flex;
    gap: 25px;
  }

  .logo-icon {
    width: 40px;
  }

  .logo {
    cursor: pointer;
  }

  .logo-name {
    color: rgb(30 64 116);
    font-size: 16px;
    /*line-height: 1.5;*/
    font-weight: 500;
    margin: 0;
  }

  .enter-profile {
    padding: 6px 12px;
    background: #ebf4ff;
    font-size: 12px;
    text-transform: uppercase;
    color: #373737;
    font-weight: bold;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /*{*/
  /*  xs: '480px',*/
  /*  sm: '576px',*/
  /*  md: '768px',*/
  /*  lg: '992px',*/
  /*  xl: '1200px',*/
  /*  xxl: '1600px',*/
  /*}*/

  @media only screen and (max-width: 1200px) {
  }

  @media only screen and (max-width: 768px) {
    .bottom-header__left {
      flex-direction: column;
      align-items: center;
      gap: 5px;
    }
  }

  .suggestion-item {
    display: flex;
    align-items: center;
  }

  .suggestion-item .autocomplete-logo {
    width: 45px; /* Adjust the size as needed */
    height: 45px;
    object-fit: contain;
    margin-right: 8px;
  }
</style>

<style>
  .suggestion-item {
    display: flex;
    align-items: center;
  }

  .suggestion-item .autocomplete-logo {
    width: 45px; /* Adjust the size as needed */
    height: 45px;
    object-fit: contain;
    margin-right: 8px;
  }
</style>
