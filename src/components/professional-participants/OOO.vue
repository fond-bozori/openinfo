<template>
  <div class="header-name title">
    <p>{{ $t('message.llc') }}</p>
  </div>
  <div v-loading="loading" class="container">
    <el-empty v-if="!data.length" description="No Data" />
    <div v-for="data in data" class="broker-card">
      <div class="broker-card__header">
        <div class="img-container">
          <img
            v-if="data.detailinfo.logo_file"
            :src="`${baseLogoUrl}${data.detailinfo.logo_file}`"
            alt="logo"
            class="news-image"
          />
          <img
            v-else
            src="/src/assets/images/not-found.png"
            alt="not found"
            class="broker-header__logo news-image"
          />
        </div>

        <div class="broker-card__info">
          <h1 class="broker-name">
            {{ data.full_name_text }}
          </h1>
          <!--          <p class="broker-info__detail">{{data.detailinfo.short_info_ru}}</p>-->
          <div class="footer-info">
            <img
              class="broker-icon"
              src="/src/assets/images/icons/phone-call.svg"
            />{{
              data.detailinfo.phone_number
                ? data.detailinfo.phone_number
                : ' - '
            }}
          </div>
          <a :href="`http://${data.on_maps}`" class="footer-info"
            ><img
              class="broker-icon"
              src="/src/assets/images/icons/map-pin.svg"
            />
            {{ data.address }}
          </a>
          <a :href="`mailto:${data.email} `" class="footer-info"
            ><img class="broker-icon" src="/src/assets/images/icons/mail.svg" />
            {{ data.email }}
          </a>
          <p class="director-name">
            {{ $t('message.investment_intermediaries_ceo') }} :
            <b>
              {{
                data.detailinfo.director_name
                  ? data.detailinfo.director_name
                  : '-'
              }}
            </b>
          </p>
          <a :href="`http://${data.web_site}`" class="link-to__website">{{
            $t('message.investment_intermediaries_web')
          }}</a>
        </div>
      </div>
      <!--      <div class="broker-card__footer">-->
      <!--        <div class="footer-info"><img class="head-icon" src="/src/assets/images/icons/phone-call.svg" />{{data.detailinfo.phone_number}}</div>-->
      <!--       <div class="footer-info "> <img class="head-icon" src="/src/assets/images/icons/map-pin.svg"> {{data.address }} </div>-->
      <!--        <div class="footer-info"><img class="head-icon" src="/src/assets/images/icons/mail.svg"> {{data.email}}</div>-->
      <!--        <a :href="data.web_site" class="link-to__website">website</a>-->
      <!--      </div>-->
    </div>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :current-page="currentPage"
      :page-count="totalPages"
      @current-change="handleCurrentChange"
    />
  </div>

  <el-dialog
    v-model="centerDialogVisible"
    title="Форма"
    width="30%"
    align-center
    destroy-on-close
    @closed="clear"
  >
    <el-form
      ref="formRef"
      :model="form"
      status-icon
      class="login-form"
      label-position="top"
      size="large"
      :rules="rules"
      style="min-width: 360px"
    >
      <el-form-item label="email" prop="email">
        <el-input
          v-model="form.email"
          type="email"
          :prefix-icon="Message"
          placeholder="Email"
        />
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          autocomplete="off"
          :prefix-icon="Lock"
          show-password
          placeholder="Password"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="centerDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="subscribe(formRef)">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
  import { ref, onMounted, computed, reactive } from 'vue'
  import axios from 'axios'
  import { ElNotification } from 'element-plus'
  import { useRoute } from 'vue-router'
  import router from '../../router'
  import { BellFilled, Check, Lock, Message } from '@element-plus/icons-vue'

  const data = ref([])
  const baseLogoUrl = 'https://openinfo.uz/media/'
  const subscribed = ref(false)

  const url = import.meta.env.VITE_APP_SERVER_URL
  const loading = ref(false)
  const route = useRoute()

  const totalPages = ref(null)
  const total = ref(null)

  const centerDialogVisible = ref(false)
  const organizationId = ref(null)

  const form = reactive({
    email: null,
    password: null,
  })

  // const store = useStore()

  const formRef = ref()
  const rules = ref({
    email: [
      {
        required: true,
        message: 'Majburiy Email @example',
        trigger: 'blur',
        type: 'email',
      },
    ],
    password: [{ required: true, message: 'Majburiy maydon', trigger: 'blur' }],
  })

  const clear = () => {
    form.email = null
    form.password = null
  }

  const subscribe = (formRef) => {
    formRef.validate((valid) => {
      if (valid) {
        loading.value = true
        axios
          .post(`${import.meta.env.VITE_APP_SERVER_URL}/home/subscribe/`, {
            email: form.email,
            password: form.password,
            organization_id: organizationId.value,
          })
          .then(({ data }) => {
            // store.commit("authenticate", data);
            console.log('subscribed')
            console.log(data)
            // router.push('/')
          })
          .catch((e) => {
            console.log(e?.message)
          })
          .finally(() => {
            loading.value = false
            centerDialogVisible.value = false
          })
        // subscribed.value = !subscribed.value
      }
    })
  }

  const currentPage = ref(1)
  const handleCurrentChange = (val) => {
    currentPage.value = val
    getBrokersData()
  }

  const getBrokersData = () => {
    loading.value = true
    axios
      .get(
        `${url}/home/organizations/?org_type=llc&page=${currentPage.value}`,
        {
          method: 'get',
        },
      )
      .then((response) => {
        data.value = response.data.results
        totalPages.value = response.data.total_pages
        total.value = response.data.count
      })
      .catch(({ response }) => {
        ElNotification({
          type: 'error',
          message: response.data.message || 'Malumot olishda xatolik bor!',
        })
      })
      .finally(() => {
        loading.value = false
      })
  }

  onMounted(() => {
    getBrokersData()
  })

  // const  paginationChange = (e) => {
  // currentPage.value = e,
  //     console.log(currentPage.value, 'sss')
  // }
</script>

<style scoped>
  .container {
    min-height: 50vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
    /*min-height: 50vh;*/
    padding: 0 5px;
    margin: 20px 0;
  }

  .broker-card {
    background: #fefefe;
    box-shadow: 0px 0px 2px 3px rgba(148, 148, 148, 0.1);
    border-radius: 10px;
    display: flex;
    /*max-width: 1173px;*/
    width: 100%;
    flex-direction: column;
    color: #124483;
  }

  .broker-name {
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 29px;
    /* identical to box height */
    /*color: #2F2F2F;*/
    color: #124483;
    margin: 0;
  }

  .broker-card__header {
    display: flex;
    padding: 20px;
  }

  .img-container {
    border-radius: 20px;
    max-width: 200px;
    min-width: 200px;
    overflow: hidden;
    /*background: rgba(21, 78, 150, 0.7);*/
    box-shadow: var(--el-box-shadow-lighter);
    border: 1px solid #e6e8f0;
    background: #efefef;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }

  .news-image {
    width: 100%;
    height: 100%;
    max-height: 150px;
    object-fit: contain;
    transition: transform 0.4s ease;
    transform: scale(1);
    cursor: pointer;
  }

  .news-image:hover {
    transform: scale(1.05);
  }

  .broker-header__logo {
    width: 200px;
    max-width: 250px;
    max-height: 150px;
  }

  .broker-card__info {
    display: flex;
    flex-direction: column;
    gap: 15px;
    font-size: 16px;
    line-height: 19px;
    width: 100%;
    margin-left: 10px;
    border-left: 1px solid #e6e8f0;
    padding-left: 35px;
    /* background: #124483; */
  }

  .footer-info {
    color: #124483;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .link-to__website {
    /*background: #E6E8F0;*/
    /*border-radius: 0px 0px 10px 0px;*/
    background: rgb(92, 184, 92);
    color: #124483;
    text-align: center;
    padding: 10px 30px;
    text-decoration: none;
    border-radius: 8px;
  }

  .stars {
    width: 70px;
  }

  .broker-info__detail {
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    color: #5a5959;
    margin: 9px 0;
  }

  .header-name {
    /* background: #124483; */
    border-radius: 10px;
    text-transform: uppercase;
    color: #fff;
    text-align: center;
    height: 50px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #124483;
    gap: 20px;
  }

  .subscribe {
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--el-color-success);
    font-size: 16px;
    border-radius: 50px;
    width: 25px;
    height: 25px;
    background: white;
    margin-left: 10px;
  }

  .subscribed-btn {
    display: flex;
    align-items: center;
    padding: 6px;
    background: white;
    color: var(--el-color-success);
    font-weight: bold;

    /*text-transform: uppercase;*/
  }

  .broker-icon {
    width: 20px;
  }

  .check {
    justify-content: center;
    margin-right: 2px;
  }

  @media only screen and (max-width: 600px) {
    .img-container {
      width: 100%;
      max-width: 100%;
    }

    .broker-card__header {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 20px;
    }

    .broker-card__info {
      flex-direction: column;
      border: none;
      padding: 0;
    }

    .broker-name {
      gap: 10px;
      font-size: 18px;
      text-align: center;
      flex-direction: column;
      justify-content: center;
    }
    .footer-info {
      text-align: center;
    }

    .director-name {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
    }
  }

  @media only screen and (max-width: 992px) {
    .broker-name {
      gap: 10px;
      text-align: center;
      flex-direction: column;
      justify-content: center;
    }
  }

  @media only screen and (max-width: 1720px) {
    /*.broker-card__header {*/
    /*  display: flex;*/
    /*  flex-direction: column;*/

    /*}*/
  }

  /*.subscribe-btn {*/
  /*  padding: 6px;*/
  /*  display: flex;*/
  /*  align-items: center;*/
  /*  background: red;*/
  /*  color: #fff;*/
  /*  font-weight: bold;*/

  /*  !*text-transform: uppercase;*!*/
  /*}*/

  /*.subscribe-btn:hover {*/
  /*  background: white;*/
  /*  color: red;*/
  /*}*/

  /*.subscribe-btn:hover .subscribe {*/
  /*  background: red;*/
  /*  color: white;*/

  /*}*/

  /*.broker-card__footer {*/

  /*  height: 39px;*/
  /*  border-radius: 0px 0px 10px 10px;*/
  /*  display: flex;*/
  /*  justify-content: space-between;*/
  /*  align-items: center;*/
  /*  padding-left: 40px;*/
  /*}*/
</style>
