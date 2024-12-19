<template>
  <div class="snowfall-container">
    <canvas ref="canvas" class="snowfall-canvas"></canvas>
  </div>
</template>

<script>
  import { ref, onMounted, onBeforeUnmount, reactive } from 'vue'

  export default {
    setup() {
      const canvas = ref(null)
      let ctx
      const COUNT = 70
      const snowflakes = reactive([])

      function Snowflake() {
        this.x = 0
        this.y = 0
        this.vy = 0
        this.vx = 0
        this.r = 0
        this.o = 0
        this.reset = () => {
          this.x = Math.random() * canvas.value.width
          this.y = Math.random() * -canvas.value.height
          this.vy = 1 + Math.random() * 2
          this.vx = 0.5 - Math.random()
          this.r = 2 + Math.random() // Size of the snowflake
          this.o = 0.1 + Math.random() * 0.2 // Opacity
          this.snowflakeChar = '❄' // Snowflake character
        }
        this.reset()
      }

      function onResize() {
        canvas.value.width = window.innerWidth - 20
        canvas.value.height = window.innerHeight - 50
        ctx.font = '30px Arial' // Font size for the snowflake character
      }

      function updateSnowflakes() {
        ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)

        snowflakes.forEach((snowflake) => {
          snowflake.y += snowflake.vy
          snowflake.x += snowflake.vx

          ctx.globalAlpha = snowflake.o
          ctx.fillText(snowflake.snowflakeChar, snowflake.x, snowflake.y)

          if (snowflake.y > canvas.value.height) {
            snowflake.reset()
          }
        })

        requestAnimationFrame(updateSnowflakes)
      }

      function createSnowflakes() {
        for (let i = 0; i < COUNT; i++) {
          snowflakes.push(new Snowflake())
        }
      }

      onMounted(() => {
        ctx = canvas.value.getContext('2d')
        ctx.fillStyle = '#FFF'
        ctx.font = '5px ' // Font size for the snowflake character

        onResize()
        createSnowflakes()
        updateSnowflakes()

        window.addEventListener('resize', onResize)
      })

      onBeforeUnmount(() => {
        window.removeEventListener('resize', onResize)
      })

      return {
        canvas,
      }
    },
  }
</script>

<style scoped>
  .snowfall-container {
    max-width: 100%;
  }
  .snowfall-canvas {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: -1; /* Ensure it's behind other content */
  }
</style>
