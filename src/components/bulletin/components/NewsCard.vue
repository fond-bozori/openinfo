<template>
  <el-card class="user-card">
    <div class="card-content">
      <div class="avatar">
        <el-avatar
          v-if="item.logo"
          shape="square"
          :size="120"
          :fit="fit"
          :src="getLogoUrl(item.logo)"
          style="background-color: #fff"
        />
        <img
          v-if="!item.logo"
          src="../../../assets/images/icons/company-blue.svg"
          class="avatar"
        />
      </div>
      <div class="text-content">
        <p class="custom-text">{{ date }}</p>
        <p class="custom-text-second">{{ headline }}</p>
        <p class="custom-text">{{ description }}</p>
      </div>
      <div class="action">
        <el-button
          class="custom-button"
          type="primary"
          @click="goToFacts(item)"
        >
          {{ buttonText }}
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<script setup>
  import { useRouter } from 'vue-router'
  import defaultLogo from '@/assets/images/icons/company-blue.svg'
  const router = useRouter()
  const props = defineProps({
    item: {
      type: Object,
      required: true,
    },
    fit: {
      type: String,
      default: 'contain',
    },
    url: {
      type: [String, Object], // Allow both String and Object types
      default: '',
    },
    date: {
      type: String,
      required: true,
    },
    headline: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    buttonText: {
      type: String,
      default: "$t('message.read_more')",
    },
  })

  const baseLogoUrl = 'https://openinfo.uz/media/'
  const getLogoUrl = (logo) => {
    return logo ? `${baseLogoUrl}${logo}` : defaultLogo
  }

  const handleImageError = (event) => {
    console.log(`Image failed to load: ${event.target.src}`)
    event.target.src = defaultLogo
  }

  const goToFacts = (item) => {
    router.push({
      name: 'facts-detailed',
      params: { id: item.fact_number, factId: item.object_id },
    })
  }
</script>

<style scoped>
  .user-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 5px;
  }

  .card-content {
    display: flex;
    align-items: center;
    width: 100%;
  }

  .avatar {
    flex: 0 0 auto;
    width: 120px;
    height: 120px;
    margin-right: 16px;
  }

  .text-content {
    flex: 1;
    margin-right: 16px;
  }

  .text-content p {
    margin: 4px 0;
  }

  .custom-text {
    font-family: Montserrat;
    font-size: 14px;
    font-weight: 500;
    line-height: 17.07px;
    text-align: left;
    color: #5a5858;
  }

  .custom-text-second {
    font-family: Montserrat;
    font-size: 18px;
    font-weight: 600;
    line-height: 21.94px;
    text-align: left;
    color: #282828;
    width: 1012px;
  }

  .action {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
  }

  .custom-button {
    background-color: #1b9206;
    border: 1px solid #e1e1e1;
    width: 114px;
    height: 33px;
    border-radius: 7px;
    border-width: 1px;
  }
</style>
