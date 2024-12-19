<template>
  <div class="text-center mt-4 mb-4 w-100 marque-container">
    <h3 class="partners-title">{{ $t('message.our_partners') }}</h3>

    <el-carousel
      trigger="click"
      height="100px"
      arrow="never"
      indicator-position="outside"
    >
      <el-carousel-item>
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
      </el-carousel-item>

      <el-carousel-item>
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
              {{
                $t('message.Information - resource center of capital market')
              }}
            </div>
          </a>
        </div>
      </el-carousel-item>

      <el-carousel-item>
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
      </el-carousel-item>
      <el-carousel-item>
        <div class="organization-link-container">
          <a
            href="https://deponet.uz/"
            target="_blank"
            class="organization-links"
          >
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
      </el-carousel-item>
      <el-carousel-item>
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
      </el-carousel-item>

      <el-carousel-item>
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
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
  export default {
    name: 'MarqueEffect',
  }
</script>

<style scoped>
  .marque-container {
    display: flex;
    flex-direction: column;
  }

  .personal-cabinet__container {
    /*height : 570px;*/
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    gap: 20px;
  }

  h3.partners-title {
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
    margin-bottom: 12px;
  }

  .organization-link-container {
    box-shadow: 0px 1px 3px 2px rgba(207, 207, 207, 0.35);
    border-radius: 10px;
    background: linear-gradient(to right, #124483 50%, white 50%);
    background-size: 200% 100%;
    background-position: right bottom;
    transition: all 0.5s ease-out;
    color: #266184;
    width: 400px;
    margin: 8px 0;
    overflow-x: visible;
    -webkit-box-shadow: 0px 1px 3px 2px rgba(207, 207, 207, 0.35);
    -moz-box-shadow: 0px 1px 3px 2px rgba(207, 207, 207, 0.35);
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
    display: -webkit-box;
    -webkit-line-clamp: 2;
    /* Number of lines to show before truncating */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
