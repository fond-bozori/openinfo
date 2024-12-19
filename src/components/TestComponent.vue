<template></template>

<script setup>
  import axios from 'axios'
  import { onMounted, ref } from 'vue'

  const url = 'https://new-api.openinfo.uz/api/v2/home/test/'
  const data = ref([])

  const getRequest = () => {
    axios
      .get(`${url}`, {
        method: 'get',
      })
      .then((response) => {
        data.value = response.data.result
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {})
  }

  const deleteRequest = () => {
    axios
      .delete(`${url}`, {
        method: 'delete',
      })
      .then((response) => {
        data.value = response.data.result
        console.log(response.data, 'deleteRequest')
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {})
  }

  const postRequest = () => {
    axios
      .post(`${url}`, {
        method: 'post',
      })
      .then((response) => {
        data.value = response.data.result
        console.log(response.data, 'postRequest')
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {})
  }
  const putRequest = () => {
    axios
      .put(`${url}`, {
        method: 'put',
      })
      .then((response) => {
        data.value = response.data.result
        console.log(response.data, 'putRequest')
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {})
  }

  const patchRequest = () => {
    axios
      .patch(`${url}`, {
        method: 'patch',
      })
      .then((response) => {
        data.value = response.data.result
        console.log(response.data, 'patchRequest')
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {})
  }

  onMounted(() => {
    getRequest()
    postRequest()
    deleteRequest()
    patchRequest()
    putRequest()
  })
</script>

<style scoped></style>
