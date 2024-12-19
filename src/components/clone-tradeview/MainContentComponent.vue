<template>
  <div class="tradingview-widget-container">
    <div id="tradingview_watchlist"></div>
  </div>
</template>

<script>
  export default {
    mounted() {
      const script = document.createElement('script')
      script.src = 'https://s3.tradingview.com/tv.js'
      script.async = true

      script.onload = () => {
        new TradingView.widget({
          container_id: 'tradingview_watchlist',
          width: '100%',
          height: '600',
          symbols: [
            ['TVC:DXY|1D', 'DXY'],
            ['INDEX:SPX|1D', 'S&P 500'],
            ['INDEX:NDX|1D', 'NASDAQ'],
            ['TVC:DJI|1D', 'Dow Jones'],
            ['TVC:VIX|1D', 'VIX'],
          ],
          show_symbol_logo: true,
          colorTheme: 'dark',
          isTransparent: false,
          locale: 'en',
        })
      }

      document.getElementById('tradingview_watchlist').appendChild(script)
    },
  }
</script>

<style scoped>
  .tradingview-widget-container {
    width: 100%;
    height: 600px;
  }
</style>
