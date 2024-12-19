<template>
  <div>
    <el-collapse v-model="activeNames" accordion>
      <el-collapse-item title="Title 1" name="1">
        <div>Content for the first section</div>
      </el-collapse-item>
      <el-collapse-item title="Title 2" name="2">
        <div>Content for the second section</div>
      </el-collapse-item>
      <el-collapse-item title="Title 3" name="3">
        <div>Content for the third section</div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
  import { ref } from 'vue'

  export default {
    name: 'AccordionComponent',
    setup() {
      const activeNames = ref('1')

      return {
        activeNames,
      }
    },
  }
</script>

<style scoped></style>
