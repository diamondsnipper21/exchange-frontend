<template>
  <v-flex
    d-flex
    class="cce-trade__panel-orders-stats cce-trade__panel-orders-stats--sticky status-bar"
  >
    <div class="cce-trade__panel-orders-stats-change status-bar__column">
      <span
        class="cce-trade__panel-orders-stats-change-value"
        :class="{ 'cce-color__low' : stats.growthDiff < 0,  'cce-color__high' : stats.growthDiff > 0 }"
      >
        {{ addSign(stats.growthRatio) }}
      </span>
    </div>
    <div class="cce-trade__panel-orders-stats-price text-xs-right status-bar__column">
      <span :class="{ 'cce-color__high' : priceStatus === 'up', 'cce-color__low' : priceStatus === 'down' }">
        <i
          class="cce-trade__panel-orders-stats-arrow material-icons"
          v-if="priceStatus"
        >
          {{ priceStatus === 'up' ? 'arrow_upward' : 'arrow_downward' }}
        </i>
        <span v-decimals.include-zero-value="stats && stats.lastPrice !== null ? { text: stats.lastPrice, precision: marketPrecision } : '-'"></span>
      </span>
    </div>
    <div class="cce-trade__panel-orders-stats-value status-bar__column text-xs-right">
      {{ priceUSDC() }}
    </div>
  </v-flex>
</template>

<script>
export default {
  name: 'order-book-status-bar',
  props: {
    stats: {
      type: Object,
      default: {},
    },
    priceStatus: {
      type: String,
    },
    marketPrecision: {
      type: Number,
    },
  },
  methods: {
    priceUSDC() {
      if (this.stats.quoteCurrency !== 'USDC') {
        if (this.stats && (this.stats.lastPrice !== null)) {
          return `$${this.convertToDecimal(this.exchangeRate * this.stats.lastPrice)}`;
        }
        return '-';
      }
      return `$${this.convertToDecimal(this.exchangeRate)}`;
    },
  },
  computed: {
    /**
     * Returns rate value based on USD
     * @returns {Number}
     */
    exchangeRate() {
      return this.$store.getters['market/exchangeRate'];
    },
  },
};
</script>

<style lang="scss" scoped>
.status-bar__column {
  width: 30%;

  &:first-child {
    width: 32%;
  }
}
</style>
