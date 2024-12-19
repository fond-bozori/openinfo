<template>
  <div>
    <component :is="currentComponent" />
  </div>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue'
  import Fact1 from '../components/facts-table/facts1.vue'
  import Fact2 from '../components/facts-table/facts2.vue'
  import Fact3 from '../components/facts-table/facts3.vue'
  import Fact4 from '../components/facts-table/facts4.vue'
  import Fact5 from '../components/facts-table/facts5.vue'
  import Fact6 from '../components/facts-table/facts6.vue'
  import Fact7 from '../components/facts-table/facts7.vue'
  import Fact8 from '../components/facts-table/facts8.vue'
  import Fact9 from '../components/facts-table/facts9.vue'
  import Fact10 from '../components/facts-table/facts10.vue'
  import Fact11 from '../components/facts-table/facts11.vue'
  import Fact12 from '../components/facts-table/facts12.vue'
  import Fact13 from '../components/facts-table/facts13.vue'
  import Fact14 from '../components/facts-table/facts14.vue'
  import Fact15 from '../components/facts-table/facts15.vue'
  import Fact16 from '../components/facts-table/facts16.vue'
  import Fact17 from '../components/facts-table/facts17.vue'
  import Fact18 from '../components/facts-table/facts18.vue'
  import Fact19 from '../components/facts-table/facts19.vue'
  import Fact20 from '../components/facts-table/facts20.vue'
  import Fact21 from '../components/facts-table/facts21.vue'
  import Fact22 from '../components/facts-table/facts22.vue'
  import Fact23 from '../components/facts-table/facts23.vue'
  import Fact24 from '../components/facts-table/facts24.vue'
  import Fact25 from '../components/facts-table/facts25.vue'
  import Fact26 from '../components/facts-table/facts26.vue'
  import Fact27 from '../components/facts-table/facts27.vue'
  import Fact28 from '../components/facts-table/facts28.vue'
  import Fact29 from '../components/facts-table/facts29.vue'
  import Fact30 from '../components/facts-table/facts30.vue'
  import Fact31 from '../components/facts-table/facts31.vue'
  import Fact32 from '../components/facts-table/facts32.vue'
  import Fact33 from '../components/facts-table/facts33.vue'
  import Fact34 from '../components/facts-table/facts34.vue'
  import Fact35 from '../components/facts-table/facts35.vue'
  import Fact36 from '../components/facts-table/facts36.vue'
  import Fact37 from '../components/facts-table/facts37.vue'
  import Fact38 from '../components/facts-table/facts38.vue'
  import Fact39 from '../components/facts-table/facts39.vue'
  import Fact40 from '../components/facts-table/facts40.vue'
  import Fact41 from '../components/facts-table/facts41.vue'
  import Fact42 from '../components/facts-table/facts42.vue'
  import Fact43 from '../components/facts-table/facts43.vue'
  import Fact44 from '../components/facts-table/facts44.vue'
  import Fact45 from '../components/facts-table/facts45.vue'

  const Component = [
    Fact1,
    Fact2,
    Fact3,
    Fact4,
    Fact5,
    Fact6,
    Fact7,
    Fact8,
    Fact9,
    Fact10,
    Fact11,
    Fact12,
    Fact13,
    Fact14,
    Fact15,
    Fact16,
    Fact17,
    Fact18,
    Fact19,
    Fact20,
    Fact21,
    Fact22,
    Fact23,
    Fact24,
    Fact25,
    Fact26,
    Fact27,
    Fact28,
    Fact29,
    Fact30,
    Fact31,
    Fact32,
    Fact33,
    Fact34,
    Fact35,
    Fact36,
    Fact37,
    Fact38,
    Fact39,
    Fact40,
    Fact41,
    Fact42,
    Fact43,
    Fact44,
    Fact45,
  ]
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const currentComponent = ref(null)

  const ComponentNumber = computed(() => route.params.id)

  onMounted(async () => {
    currentComponent.value = Component[Number(ComponentNumber.value) - 1]
  })
</script>
