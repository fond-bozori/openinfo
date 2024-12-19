<template>
  <div class="title-container">
    <h3 class="header-title">
      {{ $t('message.attestation') }}
    </h3>
  </div>
  <div class="info">
    <p class="text">
      Физические лица, имеющие квалификационный сертификат, <br />
      на право осуществления операций на фондовом рынке
    </p>
  </div>

  <el-table :data="factLists" border style="width: 100%" stripe>
    <el-table-column
      prop="fact_number"
      :label="$t('message.fact_number')"
      align="center"
      width="100"
    />
    <el-table-column
      prop="approved_date"
      :label="$t('message.date_recognized')"
      align="center"
      width="200"
    />
  </el-table>
</template>

<script setup>
  import { useStore } from '@/stores/store'

  const store = useStore()
</script>

<style scoped>
  .title-container {
    background: #094580;
    padding: 12px;
    width: 100%;
    text-align: center;
    border-radius: 8px;
    color: #ffffff;
  }

  .header-title {
    font-size: 18px;
    font-weight: 400;
    color: #ffffff;
    margin: 0;
  }

  a {
    text-decoration: none;
    color: #124483;
    flex-basis: auto;
  }

  h2,
  h1,
  h3,
  h4,
  p {
    color: #181818;
  }

  .info {
    background: #ddd403;
    color: #ffffff;
    padding: 10px;
    border-radius: 10px;
    margin: 20px 0;
  }

  .info .text {
    color: #ffffff;
    text-align: center;
  }

  h4 {
    font-size: 18px;
  }
</style>
