<template>
    <div class="cce-trade__panel" style="width: 100%">
      <v-layout column fluid>
        <!-- Orderbook socket -->
        <order-book-socket />
        <!-- Orders Book BN -->
        <order-book-header
          @decrease="decreasePrecision"
          @increase="increasePrecision"
          @restoreScroll="restoreScroll"
          :decreaseDisabled="decreaseDisabled"
          :increaseDisabled="increaseDisabled"
          :isResetScrollBtnActive="isResetScrollBtnActive"
        />
        <!-- Sell Orders -->
        <order-book-table-header :currency="currency" :marketType="marketType" />
        <!-- SCROLLABLE TABLE CONTAINER -->
        <div
          class="cce-trade__table__container"
          v-scroll="scrollHandler"
          ref="scroll"
        >
          <div class="cce-trade__table__container__table cce-trade__table__container__table--flex-end">
            <!-- Table Content -->
            <table class="cce-trade__table-table cce-trade__table-table--no-padding-left cce-trade__table-table--align-bottom">
              <tbody>
                <template v-if="askOrdersFakeRows > 0">
                  <order-book-fake-row
                    v-for="rowNumber in askOrdersFakeRows"
                    :key="`${rowNumber}__askOrdersFakeRows`"
                    :isNoDataVisible="noDataAsk && rowNumber === askOrdersFakeRows"
                  />
                </template>
                <tr
                  class="cce-trade__table-tr cce-trade__table-tr--no-pointer"
                  v-for="(item, index) in processedAsks"
                  :key="`${index}__askOrders`"
                >
                  <order-book-amount-cell
                    :total="item.totalAmount"
                    :max="maxAskAmount"
                    ask
                    @selectAmount="marketCalculateAmount(index, processedAsks, 'ask')"
                  />
                  <order-book-price-cell
                    :order="askOrders[index]"
                    :exchangeRate="exchangeRate"
                    :priceMod="item.priceMod"
                    colorClass="cce-color__low"
                    @onClick="setTradeActionIntent('limit', 'sell', item.unitPrice)"
                    :flag="item.flag"
                    ask
                  />
                  <order-book-volume-cell :volume="item.totalVolume" />
                </tr>
              </tbody>
            </table>
            <!-- Loader -->
            <div v-if="loadingAsk && marketReady">
              <progress-spinner :customStyle="{ top: '75%' }" />
            </div>
          </div>
          <!-- Orders Status Bar -->
          <order-book-status-bar :priceStatus="priceStatus" :stats="stats" :marketPrecision="marketTypePrecision"/>
          <!-- Buy Orders -->
          <div class="cce-trade__table__container__table">
            <!-- Table Content -->
            <table class="cce-trade__table-table cce-trade__table-table--no-padding-left">
              <tbody>
                <tr
                  class="cce-trade__table-tr cce-trade__table-tr--no-pointer"
                  v-for="(item, index) in processedBids"
                  :key="`${index}__bidOrders`"
                >
                  <order-book-amount-cell
                    :total="item.totalAmount"
                    :max="maxBidAmount"
                    bid
                    @selectAmount="marketCalculateAmount(index, processedBids, 'bid')"
                  />
                  <order-book-price-cell
                    :order="bidOrders[index]"
                    :exchangeRate="exchangeRate"
                    :priceMod="item.priceMod"
                    colorClass="cce-color__high"
                    @onClick="setTradeActionIntent('limit', 'buy', item.unitPrice)"
                    :flag="item.flag"
                    bid
                  />
                  <order-book-volume-cell :volume="item.totalVolume" />
                </tr>
                <template v-if="bidOrdersFakeRows > 0">
                  <order-book-fake-row
                    v-for="rowNumber in bidOrdersFakeRows"
                    :key="`${rowNumber}__bidOrdersFakeRows`"
                    :isNoDataVisible="noDataBid && rowNumber === 1"
                  />
                </template>
              </tbody>
            </table>
            <!-- Loader -->
            <div v-if="loadingBid && marketReady">
              <progress-spinner :customStyle="{ top: '25%' }" />
            </div>
          </div>
        </div>
      </v-layout>
    </div>

</template>

<script>
  /* ============
   * Trade Order Book
   * ============
   *
   * Trade order book component for the trade section
   * Renders sell/buy order book
   */

  import Big from 'big.js';
  import OrderBookSocket from '@/components/Trade/TradeOrderBook/OrderBookSocket';
  import OrderBookHeader from '@/components/Trade/TradeOrderBook/UI/OrderBookHeader';
  import OrderBookTableHeader from '@/components/Trade/TradeOrderBook/UI/OrderBookTableHeader';
  import OrderBookFakeRow from '@/components/Trade/TradeOrderBook/UI/OrderBookFakeRow';
  import ProgressSpinner from '@/components/UI/ProgressSpinner';
  import OrderBookAmountCell from '@/components/Trade/TradeOrderBook/UI/OrderBookAmountCell';
  import OrderBookVolumeCell from '@/components/Trade/TradeOrderBook/UI/OrderBookVolumeCell';
  import OrderBookPriceCell from '@/components/Trade/TradeOrderBook/UI/OrderBookPriceCell';
  import OrderBookStatusBar from '@/components/Trade/TradeOrderBook/UI/OrderBookStatusBar';
  import { zeros } from '@/utils/ui';

  export default {
    name: 'temp-order-book',
    components: {
      OrderBookSocket,
      OrderBookFakeRow,
      ProgressSpinner,
      OrderBookAmountCell,
      OrderBookHeader,
      OrderBookTableHeader,
      OrderBookVolumeCell,
      OrderBookPriceCell,
      OrderBookStatusBar,
    },
    data() {
      return {
        maxAskAmount: 0,
        maxBidAmount: 0,
        groups: { val: null },
        changeTm: {},
        marketRefreshTimeout: null,
        currentPrecisionIndex: 0,
        isResetScrollBtnActive: false,
        initialScrollPosition: 0,
        currentScrollPosition: 0,
        askOrdersFakeRows: 0,
        bidOrdersFakeRows: 0,
      };
    },
    mounted() {
      // order book event (initialized in the App.vue)
      // this.$sockets.onMessage('orderBook', (message) => {
        // console.log({ message });
        // setTimeout(() => {
        //   this.$store.dispatch('market/orderBook', {
        //     marketType: message.market.marketType,
        //     currency: message.market.currency,
        //     actionType: 'sell',
        //     init: false,
        //   });
        //   this.$store.dispatch('market/orderBook', {
        //     marketType: message.market.marketType,
        //     currency: message.market.currency,
        //     actionType: 'buy',
        //     init: false,
        //   });
        // }, 1000);
        // } else {
        //   if (message.actionTypes && message.actionTypes.includes('sell')) {
        //     this.$store.dispatch('market/orderBook', {
        //       marketType: message.market.marketType,
        //       currency: message.market.currency,
        //       actionType: 'sell',
        //       init: false,
        //     });
        //   }
        //   if (message.actionTypes && message.actionTypes.includes('buy')) {
        //     this.$store.dispatch('market/orderBook', {
        //       marketType: message.market.marketType,
        //       currency: message.market.currency,
        //       actionType: 'buy',
        //       init: false,
        //     });
        //   }
        // }
      // });
      // set initial scroll position
      const { scroll } = this.$refs;
      const initialScrollPosition = Math.floor(
        (scroll.scrollHeight / 2) - (scroll.clientHeight / 2),
      );
      scroll.scrollTop = initialScrollPosition;
      this.initialScrollPosition = initialScrollPosition;
      this.currentScrollPosition = initialScrollPosition;
    },
    computed: {
      // change precision
      groupsItems() {
        const res = [];
        const a = this.marketTypePrecision;
        let b = 1;

        if (this.stats.lastPrice >= 1) {
          b = -this.lastPriceDecimalsCount + 1;
        }

        for (let i = a; i >= b; i -= 1) {
          res.push({
            name: `${i} decimals`,
            val: i,
          });
        }
        this.groups = res[0];
        return res;
      },
      increaseDisabled() {
        return this.currentPrecisionIndex <= 0;
      },
      decreaseDisabled() {
        return this.currentPrecisionIndex >=
          (this.marketTypePrecision + this.lastPriceDecimalsCount) -
          (this.stats.lastPrice >= 1 ? 1 : this.lastPriceZeroesAfterPointCount + 2);
      },
      lastPriceZeroesAfterPointCount() {
        if (!this.stats.lastPrice) return 0;
        let price = this.stats.lastPrice;
        if (price.toString().includes('e')) {
          const maxPrecision = 18;
          price = price.toFixed(maxPrecision);
        }
        const decimals = price.toString().split('.')[1].split('');

        // calculate zeroes before any other decimal
        for (let i = 0; i < decimals.length; i += 1) {
          if (decimals[i] !== '0') {
            return i;
          }
        }
        return decimals;
      },
      lastPriceDecimalsCount() {
        if (!this.stats.lastPrice) {
          return 0;
        }
        return this.stats.lastPrice.toString().split('.')[0].length;
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
      marketType() {
        return this.$store.getters['market/type'];
      },
      currency() {
        return this.$store.getters['market/currency'];
      },
      exchangeRate() {
        return this.$store.getters['market/exchangeRate'] || 0;
      },
      marketReady() {
        return this.$store.getters['market/ready'];
      },
      askOrders() {
        const data = this.$store.getters['market/ask'];
        if (Array.isArray(data)) return data;
        return [];
      },
      bidOrders() {
        const data = this.$store.getters['market/bid'];
        if (Array.isArray(data)) return data;
        return [];
      },
      loadingAsk() {
        return this.$store.getters['market/loadingArray']('orderBook_ask');
      },
      loadingBid() {
        return this.$store.getters['market/loadingArray']('orderBook_bid');
      },
      noDataAsk() {
        return this.askOrders.length === 0 && !this.loadingAsk;
      },
      noDataBid() {
        return this.bidOrders.length === 0 && !this.loadingBid;
      },
      stats() {
        return this.$store.getters['market/info'] || {};
      },
      // marketTypePrecision() {
      //   return this.marketType
      //     ? this.$store.getters['market/currencies'][this.marketType].precision
      //     : 0;
      // },
      currencyPrecision() {
        return this.currency ? this.$store.getters['market/currencies'][this.currency].precision : 0;
      },
      priceStatus() {
        return this.$store.getters['app/tradePriceStatus'];
      },
      orderBookBuffer() {
        return this.$store.getters.orderBookBuffer;
      },
      processedAsks() {
        return this.process(this.askOrders, this.groups.val, 'askOrdersFakeRows');
      },
      processedBids() {
        return this.process(this.bidOrders, this.groups.val, 'bidOrdersFakeRows');
      },
    },
    methods: {
      scrollHandler(e, position) {
        if (position.scrollTop === this.initialScrollPosition) {
          this.currentScrollPosition = this.initialScrollPosition;
          this.isResetScrollBtnActive = false;
        } else {
          this.isResetScrollBtnActive = true;
          this.currentScrollPosition = position.scrollTop;
        }
      },
      restoreScroll() {
        this.$nextTick(() => {
          this.$refs.scroll.scrollTop = this.initialScrollPosition;
          this.isResetScrollBtnActive = false;
        });
      },
      marketCalculateAmount(index, arr, type) {
        let amount;
        if (type === 'bid') {
          amount = arr.slice(0, index + 1).reduce((prev, curr) => prev + curr.totalAmount, 0);
          this.setTradeActionIntent('market', 'sell', undefined, amount);
        } else {
          amount = arr.slice(index).reduce((prev, curr) => prev + curr.totalAmount, 0);
          this.setTradeActionIntent('market', 'buy', undefined, amount);
        }
      },
      setTradeActionIntent(type, action, price, amount = '') {
        if (price) {
          price = new Big(parseFloat(price)).toFixed(8);
        }
        this.$store.dispatch('app/setTradeActionIntent', { type, action, price, amount });
      },
      // process order book items
      process(arr, groups, fakeRowsSelector) {
        let precision = 8;
        let len = arr.length;
        if (len === 0) {
          return [];
        }

        // recalculate precision (if changed)
        let res = [];

        if (precision !== groups) {
          if (groups == null) {
            precision = this.marketTypePrecision;
          } else {
            precision = groups;
          }
          const idx = {};

          for (let i = 0; i < len; i += 1) {
            const currentArr = arr[i];
            const price = +new Big(currentArr.unitPrice).round(precision, 1);

            if (price in idx) {
              res[idx[price]].totalAmount += currentArr.totalAmount;
              res[idx[price]].totalVolume += currentArr.totalVolume;
            } else {
              idx[price] = res.length;
              res.push({
                ...currentArr,
                unitPrice: price,
                totalAmount: currentArr.totalAmount,
                totalVolume: currentArr.totalVolume,
              });
            }
          }
        } else {
          res = arr;
        }
        // add opacity
        len = res.length;

        // set fake rows
        this[fakeRowsSelector] = 25 - len;

        for (let i = 0; i < len; i += 1) {
          res[i].unitPriceP = this.processDec(res[i].unitPrice, precision);
          res[i].priceMod = zeros(res[i].unitPriceP);
        }
        return res;
      },
      refreshMarket() {
        if (this.marketRefreshTimeout === null) {
          this.marketRefreshTimeout = setTimeout(() => {
            this.$store.dispatch('market/refresh', {
              marketType: this.marketType.toUpperCase(),
              currency: this.currency.toUpperCase(),
            });
            this.marketRefreshTimeout = null;
          }, 5000);
        }
      },
      decreasePrecision() {
        const cpi = this.currentPrecisionIndex + 1;
        if (this.decreaseDisabled || !this.groupsItems[cpi]) {
          this.restoreScroll();
          return;
        }
        this.currentPrecisionIndex = cpi;
        this.groups = {
          val: this.groupsItems[cpi].val,
        };
        this.restoreScroll();
      },
      increasePrecision() {
        const cpi = this.currentPrecisionIndex - 1;
        if (this.increaseDisabled || !this.groupsItems[cpi]) {
          this.restoreScroll();
          return;
        }
        this.currentPrecisionIndex = cpi;
        this.groups = {
          val: this.groupsItems[cpi].val,
        };
        this.restoreScroll();
      },
      // set number of empty rows for each table to fix dynamic size of tables
      setFakeRows(currentData, selector) {
        // 25 - the limit of orders set in @/store/modules/orderbook/orderbook.js
        if (currentData && currentData.length < 25) {
          this[selector] = 25 - currentData.length;
        } else {
          this[selector] = 0;
        }
      },
    },
    watch: {
      askOrders(arr) {
        this.setFakeRows(arr, 'askOrdersFakeRows');
        this.maxAskAmount = Math.max(...arr.map(o => o.totalAmount));
      },
      bidOrders(arr) {
        this.setFakeRows(arr, 'bidOrdersFakeRows');
        this.maxBidAmount = Math.max(...arr.map(o => o.totalAmount));
      },
      orderBookBuffer() {
        // throttled market summary and trade history
        this.refreshMarket();
      },
      loadingAsk(newState) {
        if (newState === false) {
          this.restoreScroll();
        }
      },
    },
  };
</script>
