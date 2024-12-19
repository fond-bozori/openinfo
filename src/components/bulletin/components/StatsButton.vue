<template>
  <el-button class="custom-button">
    <div style="flex-direction: column">
      <p class="custom-paragraph">{{ buttonText }}</p>
      <h1 class="custom-heading">{{ amount }}</h1>
    </div>
  </el-button>
</template>

<script setup>
  import { ElButton } from 'element-plus'
  import 'element-plus/dist/index.css'

  const props = defineProps({
    buttonText: {
      type: String,
      default: 'Button 1',
    },
    amount: {
      type: String,
      default: '183,23 млрд',
    },
  })
</script>

<style scoped>
  .custom-button {
    width: 280px;
    height: 70px;
    background-color: #136a03;
    color: white;
    border: 1px solid #e1e1e1;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0;
    transition:
      background-color 0.3s,
      border-color 0.3s,
      transform 0.1s;
  }

  .custom-button:hover {
    background-color: #90d084;
    border-color: #c1c1c1;
  }

  .custom-button:active {
    transform: scale(0.95);
    background-color: #0b4a02;
  }

  .custom-paragraph {
    font-family: Montserrat;
    font-size: 16px;
    font-weight: 500;
    line-height: 19.5px;
    text-align: center;
    margin: 0;
  }

  .custom-heading {
    font-family: Montserrat;
    font-size: 20px;
    font-weight: 700;
    line-height: 31.69px;
    text-align: center;
    margin: 0;
  }
</style>
