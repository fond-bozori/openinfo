<template>
  <div v-loading="loading" class="d-flex flex-column">
    <div class="emitent">
      <div class="emitent-title">
        {{ title }}
      </div>
      <el-button v-if="buttonText && routePath" @click="navigate">
        {{ buttonText }}
      </el-button>
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
            :src="getLogoUrl(item.logo)"
            class="avatar"
            v-if="item.logo"
            @error="handleImageError"
          />
          <img
            v-if="!item.logo"
            src="../../../assets/images/icons/company-blue.svg"
            class="avatar"
            style="width: 50px"
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
        <el-tag>{{ item.ticker }}</el-tag>
        <p class="emitent-number">
          {{
            formatNumber(
              item.watched ||
                item.value3 ||
                item.total_transactions ||
                item.total_volume ||
                item.value,
            )
          }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { useRouter } from 'vue-router'
  import { ElAvatar } from 'element-plus'

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
    buttonText: {
      type: String,
      default: '',
    },
    routePath: {
      type: String,
      default: '',
    },
    buttonKey: {
      type: String,
      default: '',
    },
  })

  const emits = defineEmits(['viewFullList'])

  const router = useRouter()

  const navigate = () => {
    if (props.routePath) {
      router.push(props.routePath)
      emits('viewFullList', props.buttonKey)
    }
  }

  const baseLogoUrl = 'https://openinfo.uz/media/'

  const getLogoUrl = (logo) => {
    return `${baseLogoUrl}${logo}`
  }

  const formatNumber = (number) => {
    if (typeof number === 'number') {
      return number.toLocaleString('ru-RU')
    }
    return number ? parseInt(number).toLocaleString('ru-RU') : number
  }

  const fit = 'contain'

  const handleImageError = (event) => {
    // event.target.src = defaultLogo
    console.log(`Image failed to load: ${event.target.src}`)
  }
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

  .emitent-button {
    margin-left: auto;
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

  .avatar {
    margin: 10px;
    background-color: white;
    padding: 0;
    object-fit: contain;
  }
</style>
