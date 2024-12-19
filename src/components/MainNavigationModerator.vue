<template>
  <div class="navbar-parent">
    <div class="menu-sm">
      <el-button @click="drawer = true">
        <el-icon color="124483" size="18">
          <Expand />
        </el-icon>
      </el-button>
    </div>
    <el-menu class="el-menu-demo navigation" mode="horizontal" router>
      <router-link to="/facts">
        <el-menu-item class="router-link">{{
          $t('message.essential_facts')
        }}</el-menu-item>
      </router-link>
      <el-sub-menu index="3">
        <template #title> {{ $t('message.quarterly_reports') }}</template>

        <router-link to="/reports/jsc/quarter">
          <el-menu-item class="router-link">
            {{ $t('message.join_stock_companies') }}</el-menu-item
          >
        </router-link>

        <router-link to="/reports/bank/quarter">
          <el-menu-item class="router-link">
            {{ $t('message.banks') }}</el-menu-item
          >
        </router-link>

        <router-link to="/reports/insurance/quarter">
          <el-menu-item class="router-link">
            {{ $t('message.insurance_companies') }}</el-menu-item
          >
        </router-link>

        <router-link to="/reports/msfo/quarter">
          <el-menu-item class="router-link">{{
            $t('message.ifrs')
          }}</el-menu-item>
        </router-link>
      </el-sub-menu>
      <el-sub-menu index="4">
        <template #title>
          {{ $t('message.annual_reports') }}
        </template>

        <router-link to="/reports/jsc/annual">
          <el-menu-item class="router-link">
            {{ $t('message.join_stock_companies') }}</el-menu-item
          >
        </router-link>

        <router-link to="/reports/bank/annual">
          <el-menu-item class="router-link">
            {{ $t('message.banks') }}</el-menu-item
          >
        </router-link>

        <router-link to="/reports/insurance/annual">
          <el-menu-item class="router-link">
            {{ $t('message.insurance_companies') }}</el-menu-item
          >
        </router-link>

        <router-link to="/reports/msfo/annual">
          <el-menu-item class="router-link">
            {{ $t('message.ifrs') }}</el-menu-item
          >
        </router-link>

        <router-link to="/reports/audition/annual">
          <el-menu-item class="router-link">
            {{ $t('message.audition_results') }}</el-menu-item
          >
        </router-link>
      </el-sub-menu>

      <el-sub-menu index="5">
        <template #title>
          {{ $t('message.announcements') }}
        </template>

        <router-link to="/announce/chart">
          <el-menu-item class="router-link">
            {{ $t('message.charter_of_jsc') }}</el-menu-item
          >
        </router-link>

        <router-link to="/announce/jobs">
          <el-menu-item class="router-link">
            {{ $t('message.vacancies_of_jscs') }}</el-menu-item
          >
        </router-link>

        <router-link to="/announce/meeting">
          <el-menu-item class="router-link">
            {{ $t('message.holding_a_gen_meeting_of_shrldrs') }}</el-menu-item
          >
        </router-link>

        <router-link to="/announce/corporal_management">
          <el-menu-item class="router-link">
            {{ $t('message.comply_or_explain') }}</el-menu-item
          >
        </router-link>

        <router-link to="/announce/tender">
          <el-menu-item class="router-link">
            {{ $t('message.competitions_and_tenders') }}</el-menu-item
          >
        </router-link>

        <router-link to="/announce/investments">
          <el-menu-item class="router-link">
            {{ $t('message.investments') }}</el-menu-item
          >
        </router-link>

        <router-link to="/announce/other">
          <el-menu-item class="router-link">
            {{ $t('message.other_announcements') }}</el-menu-item
          >
        </router-link>
      </el-sub-menu>
    </el-menu>

    <el-drawer v-model="drawer" class="menu-drawer" direction="ltr" size="100%">
      <el-menu class="el-menu--vertical sm-navigation show" router>
        <router-link to="/home">
          <el-menu-item class="router-link">
            {{ $t('message.home') }}</el-menu-item
          >
        </router-link>

        <el-sub-menu index="6">
          <template #title>
            {{ $t('message.information_disclosure') }}
          </template>

          <!--        <el-sub-menu index="8">-->
          <!--          <template #title>-->
          <!--            {{ $t("message.issuers") }}-->
          <!--          </template>-->

          <!--        -->

          <!--          <router-link to="/ooo">-->
          <!--            <el-menu-item class="router-link"> {{ $t("message.llc") }}</el-menu-item>-->
          <!--          </router-link>-->

          <!--        </el-sub-menu>-->

          <router-link to="/organizations">
            <el-menu-item class="router-link">
              {{ $t('message.issuers') }}
            </el-menu-item>
          </router-link>

          <router-link to="/brokers">
            <el-menu-item class="router-link">{{
              $t('message.investment_intermediaries')
            }}</el-menu-item>
          </router-link>

          <router-link to="/license">
            <el-menu-item class="router-link">{{
              $t('message.licensing')
            }}</el-menu-item>
          </router-link>

          <router-link to="/attestation">
            <el-menu-item class="router-link">{{
              $t('message.attestation')
            }}</el-menu-item>
          </router-link>

          <!--        <router-link to="/professional_participants">-->
          <!--          <el-menu-item class="router-link"> {{ $t("message.professional_participants_announcements") }}</el-menu-item>-->
          <!--        </router-link>-->

          <el-sub-menu class="router-link" index="2">
            <template #title class="router-link">{{
              $t('message.issue_of_secs')
            }}</template>

            <router-link to="/emission/jsc">
              <el-menu-item class="router-link">
                {{ $t('message.join_stock_companies') }}</el-menu-item
              >
            </router-link>

            <router-link to="/emission/banks">
              <el-menu-item class="router-link">
                {{ $t('message.banks') }}</el-menu-item
              >
            </router-link>

            <router-link to="/emission/llc">
              <el-menu-item class="router-link">
                {{ $t('message.private_companies') }}</el-menu-item
              >
            </router-link>
          </el-sub-menu>
        </el-sub-menu>

        <el-sub-menu index="1">
          <template #title>
            {{ $t('message.information_disclosure') }}
          </template>

          <router-link to="/facts">
            <el-menu-item class="router-link">{{
              $t('message.essential_facts')
            }}</el-menu-item>
          </router-link>

          <el-sub-menu index="3">
            <template #title> {{ $t('message.quarterly_reports') }}</template>

            <router-link to="/reports/jsc/quarter">
              <el-menu-item class="router-link">
                {{ $t('message.join_stock_companies') }}</el-menu-item
              >
            </router-link>

            <router-link to="/reports/bank/quarter">
              <el-menu-item class="router-link">
                {{ $t('message.banks') }}</el-menu-item
              >
            </router-link>

            <router-link to="/reports/insurance/quarter">
              <el-menu-item class="router-link">
                {{ $t('message.insurance_companies') }}</el-menu-item
              >
            </router-link>

            <router-link to="/reports/msfo/quarter">
              <el-menu-item class="router-link">{{
                $t('message.ifrs')
              }}</el-menu-item>
            </router-link>
          </el-sub-menu>
          <el-sub-menu index="4">
            <template #title>
              {{ $t('message.annual_reports') }}
            </template>

            <router-link to="/reports/jsc/annual">
              <el-menu-item class="router-link">
                {{ $t('message.join_stock_companies') }}</el-menu-item
              >
            </router-link>

            <router-link to="/reports/bank/annual">
              <el-menu-item class="router-link">
                {{ $t('message.banks') }}</el-menu-item
              >
            </router-link>

            <router-link to="/reports/insurance/annual">
              <el-menu-item class="router-link">
                {{ $t('message.insurance_companies') }}</el-menu-item
              >
            </router-link>

            <router-link to="/reports/msfo/annual">
              <el-menu-item class="router-link">
                {{ $t('message.ifrs') }}</el-menu-item
              >
            </router-link>

            <router-link to="/reports/audition/annual">
              <el-menu-item class="router-link">
                {{ $t('message.audition_results') }}</el-menu-item
              >
            </router-link>
          </el-sub-menu>

          <el-sub-menu index="5">
            <template #title>
              {{ $t('message.announcements') }}
            </template>

            <router-link to="/announce/chart">
              <el-menu-item class="router-link">
                {{ $t('message.charter_of_jsc') }}</el-menu-item
              >
            </router-link>

            <router-link to="/announce/jobs">
              <el-menu-item class="router-link">
                {{ $t('message.vacancies_of_jscs') }}</el-menu-item
              >
            </router-link>

            <router-link to="/announce/meeting">
              <el-menu-item class="router-link">
                {{
                  $t('message.holding_a_gen_meeting_of_shrldrs')
                }}</el-menu-item
              >
            </router-link>

            <router-link to="/announce/corporal_management">
              <el-menu-item class="router-link">
                {{ $t('message.comply_or_explain') }}</el-menu-item
              >
            </router-link>

            <router-link to="/announce/tender">
              <el-menu-item class="router-link">
                {{ $t('message.competitions_and_tenders') }}</el-menu-item
              >
            </router-link>

            <router-link to="/announce/investments">
              <el-menu-item class="router-link">
                {{ $t('message.investments') }}</el-menu-item
              >
            </router-link>

            <router-link to="/announce/other">
              <el-menu-item class="router-link">
                {{ $t('message.other_announcements') }}</el-menu-item
              >
            </router-link>
          </el-sub-menu>
        </el-sub-menu>
      </el-menu>
    </el-drawer>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { Expand } from '@element-plus/icons-vue'

  const drawer = ref(false)
</script>

<style>
  .menu-drawer .el-drawer__header {
    color: #ffffff;
    background: #124483;
    margin-bottom: 0;
  }

  .menu-drawer .el-drawer__body {
    background: #124483;
  }

  .menu-drawer .el-menu {
    border: none;
  }

  .el-menu--horizontal > .el-sub-menu .el-sub-menu__title {
    color: white;
  }

  .el-menu--horizontal > .el-sub-menu .el-sub-menu__title:hover {
    background-color: rgba(39, 140, 245, 0.8);
    color: white;
  }

  .el-menu--popup {
    background-color: #124483;
    color: white;
  }

  .el-menu--horizontal .el-menu .el-menu-item,
  .el-menu--horizontal .el-menu .el-sub-menu__title {
    background-color: #124483;
    color: white;
    font-family: Avenir, Helvetica, Arial, sans-serif;
  }

  .el-sub-menu__title {
    font-size: 16px;
    color: white;
  }

  .el-sub-menu__title:hover {
    background-color: rgba(39, 140, 245, 0.8);
  }

  .el-menu-item:not(.is-disabled):hover {
    background-color: rgba(39, 140, 245, 0.8);
    color: white;
  }

  el-menu-item:not(.is-disabled):active {
    background-color: rgba(39, 140, 245, 0.8);
    color: white;
  }

  el-menu-item:not(.is-disabled):focus {
    background-color: rgba(39, 140, 245, 0.8);
    color: white;
  }

  .el-sub-menu .el-menu {
    background-color: rgba(39, 140, 245, 0.8);
  }

  .el-menu--horizontal .el-menu-item:not(.is-disabled):focus,
  .el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
    background-color: rgba(39, 140, 245, 0.8);
    color: #fff !important;
  }
</style>

<style scoped>
  .navigation {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    background: #124483;
    /*border-radius: 10px;*/
    width: 100%;
    color: #fff;
    height: 60px;
    flex-wrap: wrap;
    padding: 0 60px;
  }

  .router-link {
    text-decoration: none;
    color: #fff;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
  }

  .sm-navigation {
    height: auto;
    background: #124483;
    display: none;
  }

  .menu-sm {
    background: #124483;
    width: 100%;
    height: 60px;
    border-radius: 10px;
    align-items: center;
    padding: 0 20px;
    display: none;
  }

  .el-menu--popup-container {
    font-size: 16px;
    background: #124483;
  }

  .el-menu-item:not(.is-disabled):hover {
    background-color: rgba(39, 140, 245, 0.8);
    color: white;
  }

  el-menu-item:not(.is-disabled):active {
    background-color: rgba(39, 140, 245, 0.8);
    color: white;
  }

  .el-menu--horizontal.el-menu {
    border-bottom: none;
  }

  a {
    text-decoration: none;
    color: white;
  }

  .el-drawer__body.menu-drawer {
    padding: 0;
    margin: 0;
  }

  .menu-drawer {
    padding: 0;
  }

  @media only screen and (max-width: 1600px) {
  }

  @media only screen and (max-width: 1200px) {
    .navigation {
      flex-direction: column !important;
      height: auto;
      display: none;
    }

    .sm-navigation {
      display: block;
    }

    .menu-sm {
      display: flex;
    }
  }
</style>
