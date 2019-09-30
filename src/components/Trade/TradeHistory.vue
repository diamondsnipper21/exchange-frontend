<template>
  <!-- Trade Panel -->
  <div class="cce-trade__panel">
    <div class="cce-trade__panel-title">
      {{ $t('TradeHistory.previous_trades') }}
    </div>

    <div class="cce-trade__table d-flex">
      <div class="cce-trade__table-content">
        <div class="cce-trade__table-header">
          <!-- Table Header -->
          <table class="cce-trade__table-table">
            <thead>
            <tr>
              <th class="cce-trade__table-th text-xs-left">
                {{ $t('TradeHistory.time') }}
              </th>
              <th class="cce-trade__table-th text-xs-right">
                {{ $t('TradeHistory.price') }} <span class="cce-uppercase">{{ marketType }}</span>
              <th class="cce-trade__table-th text-xs-right">
                {{ $t('TradeHistory.amount') }} <span class="cce-uppercase">{{ currency }}</span>
              </th>
            </tr>
            </thead>
          </table>
        </div>
        <div class="cce-trade__table__container">
          <!-- Table Content -->
          <table class="cce-trade__table-table">
            <tbody>
            <tr
              v-for="(item, index) in history"
              class="cce-trade__table-tr text-xs-left"

              :key="index"
              @click="setTradePrice(item.unitPrice)"
            >
              <td class="cce-trade__table-td cce-trade__table-activate nowrap text-xs-left">
                <span v-time="item.createdAt"></span>
              </td>
              <td
                class="cce-trade__table-td text-xs-right"
                :class="{
                  'cce-color__low': item.side === 'sell',
                  'cce-color__high': item.side === 'buy',
                }"
                v-tooltip.right="{
                  content: tooltipFallback(item)
                }"
              >
<!--                <span v-decimals="item.unitPrice"></span>-->
                <span v-decimals="{text: item.unitPrice, precision: marketTypePrecision}"></span>
              </td>
              <td class="cce-trade__table-td cce-trade__table-activate text-xs-right">
                <span v-if="item.filledAmount" v-decimals.include-zero-value="{text: item.filledAmount, precision: 4}"></span>
                <span v-else v-decimals.include-zero-value="{text: item.receivedAmount, precision: 4}"></span>
              </td>
            </tr>
            <tr v-if="noData">
              <td colspan="3" class="cce-trade__table-td">
                <span class="cce-trade__no-data">
                  {{ $t('TradeHistory.no_data') }}
                </span>
              </td>
            </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- Loader -->
    <div v-if="loading && marketReady">
      <progress-spinner />
    </div>
  </div>
</template>

<script>
  /* ============
   * Trade history
   * ============
   *
   * Trade history component to show market trading history
   */
  import ProgressSpinner from '@/components/UI/ProgressSpinner';
  import compare from '@/utils/compare';

  export default {
    name: 'trade-history',
    mounted() {
      // trade history socket event (initialized in the App.vue)
      this.$sockets.onMessage('tradeHistory', (message) => {
        this.$store.dispatch('market/addHistory', message.trade);
        // check for callbacks
        const cbAsk = this.$store.getters['app/tradeHistoryCallback'](message.trade.askOrderUid);
        if (cbAsk !== null) {
          cbAsk(message.trade);
        }
        const cbBid = this.$store.getters['app/tradeHistoryCallback'](message.trade.bidOrderUid);
        if (cbBid !== null) {
          cbBid(message.trade);
        }
      });
    },
    computed: {
      marketType() {
        return this.$store.getters['market/type'];
      },
      currency() {
        return this.$store.getters['market/currency'];
      },
      stats() {
        return this.$store.getters['market/info'] || {};
      },
      settings() {
        return this.$store.getters['market/settings'] || {};
      },
      marketTypePrecision() {
        let precision = (this.stats.lastPrice < 1) ? 6 : 2;
        if (this.settings && this.marketType && this.currency
          && this.settings[this.marketType][this.currency].marketPrecision) {
          precision = this.settings[this.marketType][this.currency].marketPrecision;
        }
        return precision;
      },
      currencyPrecision() {
        return this.currency ? this.$store.getters['market/currencies'][this.currency].precision : 0;
      },
      history() {
        const history = this.$store.getters['market/history'];
        const sortedHistory = [...history]
          .filter(order => order.liquidity === 'T')
          .sort((a, b) => compare(a, b, 'createdAt'));
        return sortedHistory || [];
      },
      marketReady() {
        return this.$store.getters['market/ready'];
      },
      loading() {
        return this.$store.getters['market/loadingHistory'];
      },
      noData() {
        return this.history.length === 0 && !this.loading;
      },
      exchangeRate() {
        return this.$store.getters['market/exchangeRate'] || 0;
      },
    },
    methods: {
      // set trade price for the trading form
      setTradePrice(val) {
        this.$store.dispatch('app/setTradePrice', val);
      },
      tooltipFallback(item) {
        if (this.marketType !== 'USDC') {
          if (item.rateUSDC) {
            return `$${this.convertToDecimal(item.rateUSDC * item.unitPrice)}`;
          }
          return `$${this.convertToDecimal(this.exchangeRate * item.unitPrice)}`;
        }
        return `$${this.convertToDecimal(item.unitPrice)}`;
      },
    },
    components: {
      ProgressSpinner,
    },
  };
</script>
