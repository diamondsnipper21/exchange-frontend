<template>
  <div class="cce-trade__favorites" v-if="marketReady">
    <div class="cce-trade__favorites-row">
      <!-- 24h Change -->
      <button
        v-for="(item, key, index) in marketTopValue"
        @click="changeCurrency(item.quoteCurrency, item.baseCurrency)"
        :key="index"
        class="cce-trade__favorites-item hidden-sm-and-down btn btn--flat"
        v-bind:class="{ 'btn--active': isActive(item.quoteCurrency, item.baseCurrency) }"
      >
        <div class="btn__content">
          <div class="cce-trade__favorites-item-wrap">
            <div class="cce-trade__favorites-item-label">
              <span class="cce-uppercase">{{ item.baseCurrency }}</span>
              /
              <span class="cce-uppercase">{{ item.quoteCurrency }}</span>
            </div>
            <div
              class="cce-trade__favorites-item-value"
              :class="{ 'cce-color__low' : item.growthDiff < 0,  'cce-color__high' : item.growthDiff > 0 }"
            >
              <span>{{ item.lastPrice || 0 }}</span>
              <span
                class="cce-trade__favorites-item-value--sub"
                v-if="item && item.growthRatio !== null"
              >{{ addSign(item.growthRatio) }}</span>
            </div>
          </div>
        </div>
      </button>
    </div>
  </div>
</template>

<script>
/* ============
 * Market Favorites
 * ============
 *
 * Trade market favorites component for the trade section navigation bar
 * Show user favorite pairs stats
 */
import compare from '@/utils/compare';

export default {
  name: 'trade-favorites',
  data() {
    return {
      precision: 6,
      precisionUsd: 2,
      windowWidth: window.innerWidth,
    };
  },
  mounted() {
    // markets summary event (initialized in the App.vue)
    this.$sockets.onMessage('marketSummary', (message) => {
      this.$store.dispatch('market/setInfo', message.marketSummary);
    });
    window.addEventListener('resize', this.updateWindowWidth);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateWindowWidth);
  },
  computed: {
    pairsCount() {
      // max count of favorite pairs that can contain header bar in current viewport width
      const otherContentWidth = 16 + 302 + 189 + 36;
      const pairWidth = 152;
      return Math.floor((this.windowWidth - otherContentWidth) / pairWidth);
    },
    currency() {
      return this.$store.getters['market/currency'] || '';
    },

    /**
     * Sorts favorite pairs by volume
     * @returns {Array<Object>} sorted favorite pairs
     */
    marketTopValue() {
      if (!this.favoritePairsSummaries) return [];
      const sortedByVolume = [...this.favoritePairsSummaries];
      return sortedByVolume
        .filter(it => (typeof (it) !== 'undefined'))
        .sort((a, b) => compare(a, b, 'baseVolume'))
        .slice(0, this.pairsCount);
    },
    stats() {
      return this.$store.getters['market/info'] || {};
    },
    marketTypePrecision() {
      return this.marketType
        ? this.$store.getters['market/currencies'][this.marketType].precision
        : 0;
    },
    currencyPrecision() {
      return this.currency
        ? this.$store.getters['market/currencies'][this.currency].precision
        : 0;
    },
    favoritePairs() {
      return this.$store.getters['market/favoritePairs'];
    },
    loadingFavoritePairs() {
      return this.$store.getters['market/loadingFavoritePairs'];
    },
    marketType() {
      return this.$store.getters['market/type'] || '';
    },
    marketReady() {
      return this.$store.getters['market/ready'];
    },
    priceStatus() {
      return this.$store.getters['app/tradePriceStatus'];
    },
    favoritePairsSummaries() {
      return this.$store.getters['market/favoritePairsSummaries'] || [];
    },
  },
  methods: {
    updateWindowWidth() {
      this.windowWidth = window.innerWidth;
    },
    isActive(type, currency) {
      return type.toLowerCase() === this.marketType.toLowerCase() &&
        currency.toLowerCase() === this.currency.toLowerCase();
    },
    changeCurrency(type, currency) {
      const market = `${currency}-${type}`;
      this.$router.push({
        name: 'trade.index',
        params: {
          market,
        },
      });
    },
    currencyName(currency) {
      return this.currencies[currency] ? this.currencies[currency].name : '';
    },
  },
  watch: {
    stats(val, old) {
      // add arrow and color for the last price
      if ('lastPrice' in val) {
        if (
          'lastPrice' in val &&
          old.marketType === val.marketType &&
          old.currency === val.currency
        ) {
          let priceStatus = null;
          if (val.lastPrice > old.lastPrice) {
            priceStatus = 'up';
          }
          if (val.lastPrice < old.lastPrice) {
            priceStatus = 'down';
          }
          this.$store.dispatch('app/setTradePriceStatus', priceStatus);
        }
        const market = `${this.currency}/${this.marketType}`.toUpperCase();
        document.title = `${this.processDec(val.lastPrice)} ${market} | ${this.$appTitle}`;
      }
    },
  },
};
</script>
