<template>
  <div class="container">
    <el-tabs
      v-model="activeTab"
      type="card"
      class="sticky-tabs demo-tabs"
      tab-position="right"
      style="margin-left: 20px"
    >
      <el-tab-pane label="Tab 1" name="tab1">
        <template #label>
          <span
            class="sticky-tab-label"
            style="display: flex; flex-direction: column; align-items: center"
          >
            <el-icon><Plus /></el-icon> Tab 1
          </span>
        </template>

        <News />
        <!--      <MarqueEffect/>-->
      </el-tab-pane>

      <el-tab-pane label="Tab 2" name="tab2" class="side-tab">
        <template #label>
          <span
            class="sticky-tab-label"
            style="display: flex; flex-direction: column; align-items: center"
          >
            <el-icon><Plus /></el-icon> Tab 1
          </span>
        </template>

        <Generalstatistics />
      </el-tab-pane>

      <el-tab-pane label="Tab 3" name="tab3" class="side-tab">
        <template #label>
          <span
            class="sticky-tab-label"
            style="display: flex; flex-direction: column; align-items: center"
          >
            <el-icon><Plus /></el-icon> Tab 1
          </span>
        </template>

        <WebsiteNews />
      </el-tab-pane>

      <!-- Add more tab panes as needed -->
    </el-tabs>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { View, Search, Plus } from '@element-plus/icons-vue'
  import Generalstatistics from './generalstatistics.vue'
  import News from './News.vue'
  import WebsiteNews from './Website-news.vue'
  import MarqueEffect from '@/components/MarqueEffect.vue'

  const activeTab = ref('tab1')
</script>

<style scoped>
  .container {
    max-width: 470px;
    border: 1px solid #bfd3ec;
    border-radius: 8px;
    margin-left: 32px;
    padding: 20px 0;
    display: flex;
    flex-direction: column;
    /*background: #eee;*/
    overflow: hidden; /* Hide horizontal overflow */
  }

  .el-tabs--right.el-tabs--card .el-tabs__item.is-right.is-active {
    border: 1px solid #e4e7ed;
  }

  .sticky-tabs {
    overflow-x: auto; /* Enable horizontal scrolling for tabs */
  }

  .el-tabs__item {
    padding: 0;
  }

  .sticky-tab-label {
    display: inline-flex;
    align-items: center;
    position: sticky;
    top: 0;
    padding: 10px; /* Adjust padding as needed */
    z-index: 1;
  }
</style>
