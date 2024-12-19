<template>
  <div class="footer">
    <div class="footer-wrapper">
      <div class="footer-left">
        <h4
          class="footer-logo__name"
          v-html="$t('message.footer_logo_name')"
        ></h4>
        <a
          href="https://t.me/openinfouz_bot"
          target="_blank"
          class="text-white"
        >
          <img
            class="tg-icon"
            src="/src/assets/images/icons/telegram.svg"
            alt="tg-icon"
          />
          openinfouz_bot
        </a>
        <p class="head-info__detail">
          <a class="text-white" href="tel:+998712317909">
            <img
              class="head-icon"
              src="/src/assets/images/icons/phone-call-white.svg"
            />
            +998 71 231 79 09
          </a>
        </p>
        <p>
          <a
            class="text-white"
            href="https://yandex.uz/maps/10335/tashkent/house/YkAYdA9iSEUPQFprfX54dXRqZw==/?ll=69.282108%2C41.294893&z=17"
          >
            <img class="head-icon" src="/src/assets/images/icons/map.svg" />
            {{ $t('message.header_location') }}
          </a>
        </p>

        <p>{{ $t('message.copy_write_footer') }}</p>
        <p>{{ $t('message.copy_write_footer1') }}</p>
      </div>
      <div class="footer-right">
        <div class="footer-contact-info">
          <div class="moderator-container">
            <div class="footer-text-justified">
              <div class="footer-icon-container">
                <img
                  src="/src/assets/images/icons/call-icon.svg"
                  class="icon-footer"
                />
                <span>{{ $t('message.phone_num_moderator') }}</span>
              </div>
              <a class="text-white" href="tel:+712311875">+998 71 231 18 75</a>
            </div>
            <div class="footer-text-justified">
              <div class="footer-icon-container">
                <img
                  src="/src/assets/images/icons/mailWhite.svg"
                  class="icon-footer"
                />
                <span>{{ $t('message.email_moderator') }}</span>
              </div>
              <div>
                <a class="text-white" href="mailto:s.khudayberdiev@napp.uz"
                  >info@napp.uz</a
                >
                <br />
              </div>
            </div>
            <div class="footer-text-justified">
              <div class="footer-icon-container">
                <img
                  src="/src/assets/images/icons/users.svg"
                  class="icon-footer"
                />
                <span>{{ $t('message.moderator') }}</span>
              </div>
              <span class="right">
                <a
                  href="https://napp.uz/uz"
                  style="color: #fff"
                  target="_blank"
                  >{{ $t('message.napp') }}</a
                ></span
              >
            </div>
          </div>

          <div class="tech-support">
            <!--      <div class="footer-text-justified">-->
            <!--        <div class="footer-icon-container">-->
            <!--          <img  src="/src/assets/images/icons/mailWhite.svg" class="icon-footer">-->
            <!--          <span>{{ $t("message.email_technician") }}</span>-->
            <!--        </div>-->
            <!--        <a class="text-white" href="mailto:admin@fondbozori.uz">admin@fondbozori.uz</a>-->
            <!--      </div>-->
            <div class="footer-text-justified">
              <div class="footer-icon-container">
                <img
                  src="/src/assets/images/icons/users.svg"
                  class="icon-footer"
                />
                <span>{{ $t('message.technical_support') }}</span>
              </div>
              <span class="right">
                <a href="https://www.kapitalbozori.uz/" style="color: #fff">{{
                  $t('message.technical_supporter')
                }}</a></span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
  .footer {
    background-image: url('.././assets/images/FooterBackground.png');
    background-size: cover;
    width: 100%;
    background-repeat: no-repeat;
    min-height: 250px;
    max-height: 1000px;
  }
  .footer-wrapper {
    display: flex;
    justify-content: space-between;
    color: #eeeeee;
    padding: 20px 60px;
    height: 100%;
    gap: 50px;
  }

  .footer-left,
  .footer-right {
    display: flex;
    flex-direction: column;
    flex: 1;
    max-width: 620px;
    gap: 6px;
  }

  .footer-contact-info {
    display: flex !important;
    flex-direction: column;
    gap: 10px;
  }

  .moderator-container {
    padding-bottom: 15px;
    border-bottom: 1px solid #ffffff73;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .tech-support {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  a {
    text-decoration: none;
  }

  .footer-text-justified {
    display: flex;
    gap: 15px;
    justify-content: space-between;
  }

  .footer-icon-container {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  .icon-footer {
    width: 20px;
    height: 20px;
  }

  .tg-icon {
    width: 28px;
  }

  .footer-logo__name {
    font-size: 1.2rem;
  }

  @media only screen and (max-width: 1020px) {
    .footer-wrapper {
      flex-direction: column;
      align-items: center;
    }
  }

  .right {
    text-align: right;
    width: 211px;
  }

  @media only screen and (max-width: 760px) {
    .footer-wrapper {
      flex-direction: column;
      padding: 20px;
      text-align: center;
    }

    .footer-text-justified {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .right {
      text-align: center;
      width: auto;
    }
  }
</style>
