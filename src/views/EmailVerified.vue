<template>
  <div class="verification-success-page">
    <el-card class="success-card">
      <h2>{{ $t('message.successfullyVerified') }}</h2>
      <p>{{ $t('message.thankYouEmailVerified') }}</p>
      <el-button type="primary" @click="goToHome" class="home-button">
        {{ $t('message.goToHomePage') }}
      </el-button>
    </el-card>
  </div>
</template>

<script setup>
  import { useRouter } from 'vue-router'

  const router = useRouter()

  // Navigate to the home page or another desired page after verification
  const goToHome = () => {
    router.push('/') // Change '/' to the actual route of your home or dashboard page
  }
</script>

<style scoped>
  .verification-success-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f3f4f6;
  }

  .success-card {
    max-width: 400px;
    padding: 2rem;
    text-align: center;
  }

  .home-button {
    margin-top: 1.5rem;
  }
</style>
