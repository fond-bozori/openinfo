<template>
  <div class="title-container">
    <h3 class="header-title">
      {{ $t('message.Legislation on professional stock market participants') }}
    </h3>
  </div>

  <div class="container">
    <div class="law-wrapper">
      <a href="https://lex.uz/docs/2662539" target="_blank" class="link-to-law"
        ><img
          src="/src/components/icons/arrow-icon.svg"
          class="arrow-link"
          alt="arrow"
        />{{ $t('message.law2') }}</a
      >
      <span class="name-of-law">{{
        $t('message.legislation_law_on_sec')
      }}</span>
    </div>
    <div class="law-wrapper">
      <a href="https://lex.uz/docs/5511879" target="_blank" class="link-to-law">
        <img
          src="/src/components/icons/arrow-icon.svg"
          class="arrow-link"
          alt="arrow"
        />{{ $t('message.law1') }}</a
      >
      <span class="name-of-law">{{
        $t('message.legislation_law_on_licesing')
      }}</span>
    </div>

    <div class="law-wrapper">
      <a href="https://lex.uz/acts/108854" target="_blank" class="link-to-law"
        ><img
          src="/src/components/icons/arrow-icon.svg"
          class="arrow-link"
          alt="arrow"
        />{{ $t('message.law3') }}</a
      >
      <span class="name-of-law">{{
        $t('message.legislation_law_on_exchange')
      }}</span>
    </div>

    <div class="law-wrapper">
      <a href="https://lex.uz/docs/2731863" target="_blank" class="link-to-law"
        ><img
          src="/src/components/icons/arrow-icon.svg"
          class="arrow-link"
          alt="arrow"
        />{{ $t('message.law4') }}</a
      >
      <span class="name-of-law">{{
        $t('message.legislation_on_investment')
      }}</span>
    </div>

    <div class="law-wrapper">
      <a href="https://lex.uz/docs/5870213" target="_blank" class="link-to-law"
        ><img
          src="/src/components/icons/arrow-icon.svg"
          class="arrow-link"
          alt="arrow"
        />{{ $t('message.law5') }}</a
      >
      <span class="name-of-law">{{
        $t('message.legislation_resolution_of_the_cabinet')
      }}</span>
    </div>

    <div class="law-wrapper">
      <a href="https://lex.uz/docs/5877863" target="_blank" class="link-to-law"
        ><img
          src="/src/components/icons/arrow-icon.svg"
          class="arrow-link"
          alt="arrow"
        />{{ $t('message.law6') }}</a
      >
      <span class="name-of-law">{{
        $t('message.legislation_cabinet_of_ministers')
      }}</span>
    </div>

    <!--    <div class="law-wrapper">-->
    <!--      <a href="https://lex.uz/docs/6049427" target="_blank" class="link-to-law"><img src="/src/components/icons/arrow-icon.svg" class="arrow-link" alt="arrow"/>{{$t('message.law7') }}</a>-->
    <!--      <span class="name-of-law">{{$t('message.legislation_cabine_of_ministers_no_304') }}</span>-->
    <!--    </div>-->

    <div class="law-wrapper">
      <a href="https://lex.uz/docs/244717" class="link-to-law" target="_blank"
        ><img
          src="/src/components/icons/arrow-icon.svg"
          class="arrow-link"
          alt="arrow"
        />{{ $t('message.law8') }}</a
      >
      <span class="name-of-law">{{
        $t('message.legislation_resolution__of_the_no_189')
      }}</span>
    </div>

    <div class="law-wrapper">
      <a href="https://lex.uz/docs/306777" class="link-to-law" target="_blank"
        ><img
          src="/src/components/icons/arrow-icon.svg"
          class="arrow-link"
          alt="arrow"
        />{{ $t('message.law9') }};</a
      >
      <span class="name-of-law">{{
        $t('message.legislation_regulation_of_the_cabinet')
      }}</span>
    </div>

    <div class="law-wrapper">
      <a
        href="https://lex.uz/uz/docs/4566059"
        class="link-to-law"
        target="_blank"
        ><img
          src="/src/components/icons/arrow-icon.svg"
          class="arrow-link"
          alt="arrow"
        />{{ $t('message.law10') }}</a
      >
      <span class="name-of-law">{{
        $t('message.legislation_on_amendments_and_addition')
      }}</span>
    </div>

    <div class="law-wrapper">
      <a href="https://lex.uz/docs/4236507" class="link-to-law" target="_blank"
        ><img
          src="/src/components/icons/arrow-icon.svg"
          class="arrow-link"
          alt="arrow"
        />{{ $t('message.law11') }}</a
      >
      <span class="name-of-law">{{
        $t('message.legislation_on_amending_clause_1')
      }}</span>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
  .container {
    min-height: 80vh;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    padding: 0;
    width: 100%;
    max-width: 100%;
    box-sizing: content-box;
    margin-top: 20px;
    margin-bottom: 60px;
    border-radius: 8px;
    /*background: #F6F6F6;*/
  }

  .title-container {
    background: #094580;
    padding: 12px;
    width: 100%;
    text-align: center;
    border-radius: 8px;
    color: #ffffff;
  }

  .header-title {
    font-size: 18px;
    font-weight: 400;
    color: #ffffff;
  }

  .law-wrapper {
    padding: 16px;

    border-radius: 8px;
    margin: 6px 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    background: #f6f6f6;
  }

  a {
    display: flex;
    text-decoration: none;
    color: #124483;
    flex-basis: auto;
    font-size: 16px;
    font-weight: 500;
  }

  a:hover {
    color: #0093e9;
  }

  .arrow-link {
    color: #124483;
    margin-right: 8px;
  }

  /*.link-to-law::before {*/
  /*  content: "\2BC8";*/
  /*  color: #124483;*/
  /*  margin-right: 8px;*/
  /*}*/

  h2,
  h1,
  h3,
  h4,
  p {
    color: #181818;
  }

  .law-wrapper .name-of-law {
    font-size: 12px;
    color: #124483;
    border-radius: 10px;
    margin-left: 22px;
    background: #ececec;
    padding: 4px 12px;
  }

  h4 {
    font-size: 18px;
  }
</style>
