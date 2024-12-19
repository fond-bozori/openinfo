<template>
  <div :class="customClass">{{ customTitle }}</div>
</template>

<script>
  export default {
    name: 'CustomTitle',
    props: {
      customTitle: {
        type: String,
        required: true,
      },
      customClass: {
        type: String,
        default: 'title',
      },
    },
  }
</script>

<style scoped>
  .title {
    color: #124483;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 28px;
  }
</style>
