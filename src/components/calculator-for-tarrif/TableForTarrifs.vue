<template>
  <div class="calculator">
    <el-collapse v-model="activeNames" class="mt-5">
      <el-collapse-item :title="t('message.calculator.table_tariffs')" name="1">
        <div class="d-flex w-100 justify-content-between gap-3 mt-3">
          <el-image
            border
            style="width: 100%; height: auto; border-radius: 8px"
            :src="
              store.$state.currentLanguage === 'uz'
                ? srcList1_uz
                : store.$state.currentLanguage === 'en'
                  ? srcList1_en
                  : srcList1_ru
            "
            :zoom-rate="1.2"
            :max-scale="7"
            :min-scale="0.2"
            :preview-src-list="
              store.$state.currentLanguage === 'uz'
                ? srcList1_uz
                : store.$state.currentLanguage === 'en'
                  ? srcList1_en
                  : srcList1_ru
            "
            :initial-index="1"
            fit="cover"
            z-index="99999999"
            close-on-press-escape
            hide-on-click-modal
          />
          <el-image
            style="width: 100%; height: auto; border-radius: 8px"
            :src="
              store.$state.currentLanguage === 'uz'
                ? srcList2_uz
                : store.$state.currentLanguage === 'en'
                  ? srcList2_en
                  : srcList2_ru
            "
            :zoom-rate="1.2"
            :max-scale="7"
            :min-scale="0.2"
            :preview-src-list="
              store.$state.currentLanguage === 'uz'
                ? srcList2_uz
                : store.$state.currentLanguage === 'en'
                  ? srcList2_en
                  : srcList2_ru
            "
            :initial-index="4"
            fit="cover"
            z-index="99999999"
            close-on-press-escape
            hide-on-click-modal
          />
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup>
  import TableImage1_ru from '/src/assets/images/calculator-images/table1.png'
  import TableImage1_en from '/src/assets/images/calculator-images/eng-table1.png'
  import TableImage2_en from '/src/assets/images/calculator-images/eng-table2.png'
  import TableImage1_uz from '/src/assets/images/calculator-images/uzb-table1.png'
  import TableImage2_uz from '/src/assets/images/calculator-images/uzb-table2.png'
  import TableImag2_ru from '/src/assets/images/calculator-images/table2.png'

  import { ref } from 'vue'
  import './calculator.css'
  import { useI18n } from 'vue-i18n'
  import { useStore } from '@/stores/store'

  const { t } = useI18n()

  const store = useStore()

  const srcList2_ru = [TableImag2_ru]

  const srcList1_uz = [TableImage1_uz]

  const srcList1_ru = [TableImage1_ru]

  const srcList1_en = [TableImage1_en]

  const srcList2_uz = [TableImage2_uz]

  const srcList2_en = [TableImage2_en]
  const activeNames = ref(['1'])
</script>

<style scoped></style>
