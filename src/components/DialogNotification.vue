<template>
  <el-dialog
    v-if="showModal"
    v-model="dialogVisible"
    class="dialog-notification w-50"
    append-to-body
    align-center
    center
    style="border-radius: 8px"
  >
    <h3 v-if="activeLang === 'ru'" class="notification-header">
      <b>Уважаемые пользователи! </b>
    </h3>
    <h3 v-if="activeLang === 'uz'" class="notification-header">
      <b>Hurmatli foydalanuvchilar!.</b>
    </h3>
    <h3 v-if="activeLang === 'en'" class="notification-header">
      <b>Dear Users!</b>
    </h3>

    <p v-if="activeLang === 'ru'" class="dialog-text text-center p-3">
      <span style="font-weight: 600">
        Наша команда проводит опрос по порталу Openinfo, чтобы лучше понять ваши
        потребности и улучшить наши услуги.
      </span>

      <br />
      <br />
      Пожалуйста, пройдите опрос по
      <a href="https://forms.gle/7baLypaCQ3vm6D6EA">ссылке</a>.
      <br />
      Опрос займет всего несколько минут. Все ответы будут анонимны.
      <br />
      <br />
      <span style="font-weight: 600"> Ваше мнение очень важно для нас! </span>
    </p>

    <p v-if="activeLang === 'uz'" class="dialog-text text-center p-3">
      <span style="font-weight: 600">
        Bizning jamoa Openinfo portali bo'yicha sizlarning ehtiyojlaringizni
        yaxshiroq tushunish va xizmatlarimizni takomillashtirish maqsadida
        so'rovnoma o'tkazmoqda.
      </span>

      <br />
      <br />
      Iltimos, <a href="https://forms.gle/7baLypaCQ3vm6D6EA">havola</a> orqali
      so'rovnomani o'ting.
      <br />
      So'rovnoma atigi bir necha daqiqa vaqt oladi. Barcha javoblar anonim
      bo'ladi.

      <br />
      <br />
      <span style="font-weight: 600">
        Sizning fikringiz biz uchun juda muhim!
      </span>
      <br />
    </p>
    <p v-if="activeLang === 'en'" class="dialog-text text-center p-3">
      <span style="font-weight: 600">
        Our team is conducting a survey on the Openinfo portal to better
        understand your needs and improve our services.
      </span>

      <br /><br />
      Please take the survey via the
      <a href="https://forms.gle/7baLypaCQ3vm6D6EA">link</a>
      <br />
      The survey will only take a few minutes. All responses will remain
      anonymous.
      <br />
      <br />
      <span style="font-weight: 600">
        Your opinion is very important to us!
      </span>
    </p>

    <div class="lang-container">
      <img
        class="lang-icon"
        src="/src/assets/images/language_images/ru.png"
        alt="lang-img"
        @click="activeLang = 'ru'"
      />
      <img
        class="lang-icon"
        src="/src/assets/images/language_images/uz.png"
        alt="lang-img"
        @click="activeLang = 'uz'"
      />
      <img
        class="lang-icon"
        src="/src/assets/images/language_images/en.png"
        alt="lang-img"
        @click="activeLang = 'en'"
      />
    </div>
  </el-dialog>
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  const dialogVisible = ref(true)
  const activeLang = ref('ru')

  const showModal = ref(false)

  onMounted(() => {
    const hasEnteredData = localStorage.getItem('Enter')

    if (!hasEnteredData) {
      // First visit
      showModal.value = true
      localStorage.setItem(
        'Enter',
        JSON.stringify({ timestamp: new Date().getTime() }),
      )
    }
  })
</script>

<style scoped>
  .dialog-text {
    font-size: 18px;
    text-align: justify;
    font-family: Montserrat;
  }

  .notification-header {
    text-align: center;
    font-size: 24px;
    color: #124483;
  }

  .lang-container {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
  }

  .lang-icon {
    width: 26px;
    border-bottom: 1px solid transparent;
    cursor: pointer;
  }
</style>
