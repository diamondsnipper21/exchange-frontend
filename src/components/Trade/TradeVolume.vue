<template>
  <div v-if="marketReady">
    <span v-decimals="stats.quoteVolume !== null ? stats.quoteVolume : '-'"></span>
    <span class="cce-uppercase">{{ marketType }}</span>
    <span class="cce-trade__stats-item-label">
      &nbsp;{{ $t('TradeVolume.24h_volume') }}
    </span>
  </div>
</template>

<script>
/* ============
 * Market Volume
 * ============
 *
 * Trade market volume component for the charts section header
 * Show market value
 */
export default {
  name: 'trade-volume',
  data() {
    return {
      precision: 6,
      precisionUsd: 2,
    };
  },
  mounted() {
    // markets summary event (initialized in the App.vue)
    this.$sockets.onMessage('marketSummary', (message) => {
      this.$store.dispatch('market/setInfo', message.marketSummary);
    });
  },
  computed: {
    /**
     * Returns selected market type from store
     * @returns {String}
     */
    marketType() {
      return this.$store.getters['market/type'] || '';
    },

    /**
     * Returns selected currency from store
     * @returns {String}
     */
    currency() {
      return this.$store.getters['market/currency'] || '';
    },

    /**
     * Returns current market info
     * @returns {Object}
     */
    stats() {
      return this.$store.getters['market/info'] || {};
    },

    /**
     * Returns market `ready` state
     * @returns {Boolean}
     */
    marketReady() {
      return this.$store.getters['market/ready'];
    },

    /**
     * Returns trade price status from store
     * @returns {String}
     */
    priceStatus() {
      return this.$store.getters['app/tradePriceStatus'];
    },
  },
  watch: {
    stats(val, old) {
      // add arrow and color for the last price
      if ('lastPrice' in val) {
        if ('lastPrice' in val && old.marketType === val.marketType && old.currency === val.currency) {
          let priceStatus = null;
          if (val.lastPrice > old.lastPrice) priceStatus = 'up';
          if (val.lastPrice < old.lastPrice) priceStatus = 'down';
          this.$store.dispatch('app/setTradePriceStatus', priceStatus);
        }
        const market = `${this.currency}/${this.marketType}`.toUpperCase();
        document.title = `${this.processDec(val.lastPrice)} ${market} | ${this.$appTitle}`;
      }
    },
  },
};
</script>
