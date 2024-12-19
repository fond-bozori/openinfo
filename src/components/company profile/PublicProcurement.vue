<template>
  <el-tabs v-model="activeName" class="demo-tabs">
    <el-tab-pane :label="t('message.tender')" name="tender">
      <XtXarid
    /></el-tab-pane>
    <el-tab-pane :label="t('message.selection')" name="selection">
      <XtXaridSelection
    /></el-tab-pane>
    <el-tab-pane :label="t('message.auction')" name="auction">
      <XtXaridAuction />
    </el-tab-pane>

    <el-tab-pane label="Uzex E-tender" name="second"
      ><PublicProcurementComponent
    /></el-tab-pane>
  </el-tabs>
</template>

<script setup>
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  const activeName = ref('tender')

  const { t } = useI18n()
</script>
