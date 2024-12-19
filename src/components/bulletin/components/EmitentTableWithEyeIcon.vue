<template>
  <div v-loading="loading" class="d-flex flex-column">
    <div class="emitent">
      <div class="emitent-title">
        {{ title }}
      </div>
    </div>
    <div class="top-emitent__container">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="top-emitent__item"
      >
        <div class="emitent-item__name">
          {{ index + 1 }}.&nbsp;
          <el-avatar
            shape="square"
            :fit="fit"
            :size="50"
            :src="item.logo || defaultLogo"
            class="avatar"
          />
          <p class="emitent-number">
            {{
              item.organization_short_name ||
              item.main_report__organization__short_name_text ||
              item.issuer_short_name ||
              item.industry
            }}
          </p>
        </div>
        <el-icon class="eye-icon" @click="viewDetails(item)">
          <View />
        </el-icon>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { defineProps } from 'vue'
  import { View } from '@element-plus/icons-vue'
  import { useRouter } from 'vue-router'
  import defaultLogo from '@/assets/images/icons/company-blue.svg'

  const props = defineProps({
    title: {
      type: String,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  })

  const router = useRouter()

  const viewDetails = (item) => {
    router.push({
      name: 'facts-detailed',
      params: { id: item.fact_number, factId: item.object_id },
    })
  }

  const handleImageError = (event) => {
    // console.log(`Image failed to load: ${event.target.src}`)
    // event.target.src = defaultLogo
  }

  const fit = 'contain'
</script>

<style scoped>
  .emitent-title {
    color: #ffffff;
  }
  .emitent {
    display: flex;
    justify-content: space-between;
    background-color: #094580;
    height: 56px;
    border-radius: 10px 10px 0 0;
    align-items: center;
    padding: 15px 20px;
    margin-top: 25px;
  }

  .top-emitent__container {
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 6px rgba(181, 181, 181, 0.25);
    border: 1px solid rgba(181, 181, 181, 0.25);
    border-radius: 0 0 10px 10px;
    margin-bottom: 10px;
    width: 100%;
  }

  .top-emitent__item {
    align-items: center;
    justify-content: space-between;
    text-decoration: none;
    gap: 10px;
    align-items: center;
    height: 60px;
    padding: 5px 15px;
    border-bottom: 1px dashed #9e9e9e;
    display: flex;
  }

  .top-emitent__item:last-child {
    border-bottom: none;
    border-radius: 0 0 10px 10px;
  }

  .top-emitent__item:hover {
    text-decoration: none;
    background-color: #e6f3ff;
  }

  .emitent-item__name {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #6b6969;
    font-weight: 700;
    flex: 2;
  }

  .emitent-number {
    justify-content: flex-end;
    float: right;
    margin: 0;
    color: #124483;
  }

  .eye-icon {
    cursor: pointer;
    color: #124483;
    font-size: 30px;
  }

  .avatar {
    margin: 10px;
    background-color: white;
    padding: 0;
    object-fit: contain;
  }
</style>
