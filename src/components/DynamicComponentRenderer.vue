<template>
  <div class="bg-black">
    <component :is="getComponentName"></component>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue'

  const backendId = ref(0) // Default backend ID

  // Generate the component name based on the backend ID
  const getComponentName = computed(() => `facts${backendId.value}.vue`)
</script>
