<template>
  <div class="tradingview-widget-container">
    <div id="tradingview_watchlist"></div>
    <h1>Hellos</h1>
  </div>
</template>

<script setup>
  import { onMounted } from 'vue'

  onMounted(() => {
    const loadTradingViewScript = () => {
      if (window.TradingView) {
        // Initialize the widget if the TradingView script is already loaded
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
    }

    // Load the script if it's not already loaded, then initialize the widget
    loadTradingViewScript()
      .then(() => {
        console.log('TradingView script loaded')
      })
      .catch((error) => {
        console.error('Failed to load TradingView script:', error)
      })
  })
</script>

<style scoped>
  .tradingview-widget-container {
    width: 100%;
    height: 600px;
    background-color: #f9f9f9;
  }
</style>
