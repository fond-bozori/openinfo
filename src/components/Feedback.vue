<template>
  <div class="feedback">
    <form
      id="Form"
      action="#"
      class="form-wrapper"
      @submit.prevent="postToGoogle"
    >
      <label for="feedback">{{ $t('message.send your feedback') }}</label>
      <textarea
        id="feedback"
        required
        name="entry.1933291303"
        class="feedback-textarea"
      ></textarea>

      <div class="submit-container">
        <input
          id="email_input_id"
          type="email"
          class="email-input"
          name="entry.19840669"
          required
          :placeholder="$t('message.E-mail address')"
        /><br /><br />
        <button type="submit" class="submit-feedback">
          {{ $t('message.Send') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
  import axios from 'axios'
  import { ElNotification } from 'element-plus'

  function postToGoogle() {
    const field1 = document.getElementById('feedback').value
    const field2 = document.getElementById('email_input_id').value

    axios
      .post(
        'https://docs.google.com/forms/u/0/d/e/1FAIpQLSenyy-vbSSOpqrKmc8iDwk9K3aTHdixjMNcbQfnLLzt-ByHsQ/formResponse',
        {
          'entry.1933291303': field1,
          'entry.19840669': field2,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      .then(() => {
        console.log('Success')
        ElNotification({
          type: 'success',
          message: 'Muvofaqqiyatli yuborildi',
        })
      })
      .catch((error) => {
        // console.error('Error:', error);
        // ElNotification({
        //   type: "error",
        //   message: error.data.message || "Malumot yuborishda xatolik bor!"
        // })
        ElNotification({
          type: 'success',
          message: 'Muvofaqqiyatli yuborildi',
        })
      })
      .finally(() => {
        document.getElementById('Form').reset()
      })
  }
</script>

<style scoped>
  .form-wrapper {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .feedback {
    background: rgba(18, 68, 131, 1);
    padding: 20px 16px 30px 16px;
    border-radius: 10px;
    margin-top: 28px;
    color: #fff;
    margin-bottom: 28px;
  }

  .feedback-textarea {
    border-radius: 10px;
    font-size: 14px;
    width: 100%;
    height: 156px;
    color: #000;
    padding: 12px 15px;

    outline: none;
  }

  .submit-feedback:focus,
  .submit-feedback:active {
    outline: none;
    border: 1px solid #3152c7;
  }

  .submit-container {
    display: flex;
    gap: 8px;
    color: #000;
    font-size: 14px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .submit-feedback {
    background: #5cb85c;
    border-radius: 10px;
    height: 45px;
    width: 110px;
    border: none;
    outline: none;
    color: #fff;
    transition: all 0.2s ease-out;
    box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
    flex: 1;
  }

  .submit-feedback:hover {
    opacity: 0.9;
    transform: scale(1);
  }
  .submit-feedback:active {
    opacity: 1;
    box-shadow: rgba(0, 0, 0, 0.06) 0 2px 4px;
    transform: scale(0.98);
  }

  .email-input {
    height: 45px;
    background: #ffffff;
    border-radius: 10px;
    border: none;
    outline: none;
    padding: 8px 13px;
    flex: 1;
  }
</style>
