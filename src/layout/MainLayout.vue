<template>
  <!--  <Snowfall/>-->
  <div class="wrapper">
    <el-container class="container-layout">
      <el-header class="sticky-navbar">
        <el-affix :offset="0">
          <Header />
          <MainNavigation />
        </el-affix>
      </el-header>
      <el-container class="layout-content">
        <el-main class="main-section">
          <router-view :key="$route.path"></router-view>
        </el-main>

        <router-view name="SideComponent"></router-view>
      </el-container>
      <el-footer><Footer /></el-footer>
      <!--<CompanyProfile/>-->
    </el-container>
  </div>
  <DialogNotification />
</template>

<script setup>
  import { RouterView } from 'vue-router'
  import Footer from '../components/Footer.vue'
  import MainNavigation from '../components/MainNavigation.vue'
  import Header from '../components/Header.vue'
</script>

<style scoped>
  .container-layout {
    position: relative;
    min-height: 100vh;
  }

  .sticky-navbar {
    position: sticky;
    top: 0 /* Height of your Header component */;
    z-index: 999; /* Adjust the z-index as needed */
  }
</style>
