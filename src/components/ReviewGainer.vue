<template>
  <div class="review-container">
    <div class="info-text">
      <p v-html="$t('message.ReviewGainer')"></p>
    </div>
    <a
      target="_blank"
      href="https://docs.google.com/forms/d/e/1FAIpQLSdD--RcFYFWUi1lVPW47nqMSuA3RLJ5UtPNBlESyye2QJM0JA/viewform?usp=sf_link"
      class="el-button success"
      style="padding: 20px"
      >{{ $t('message.submit_ideas') }}</a
    >
  </div>
</template>

<style scoped>
  .review-container {
    display: flex;
    gap: 16px;
    background: #3b7cb7;
    color: #ffffff;
    border-radius: 10px;
    align-items: center;
    font-size: 14px;
    padding: 12px 20px;
    margin-top: 16px;
    justify-content: space-between;
  }
</style>
