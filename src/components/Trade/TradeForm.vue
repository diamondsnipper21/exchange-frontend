<template>
  <div class="cce-trade__panel">
    <!-- Order type -->
    <v-tabs class="cce-trade__tabs" v-model="orderTypeIndex">
      <v-tab v-for="(tabOrderType, key) in tradeTabsOrder"
             :key="key"
             :disabled="!authorization.canPerformOrderType(tabOrderType)"
             @click="setOrderType(tabOrderType)">
        {{tText[tabOrderType]}}
      </v-tab>
      <v-spacer />
      <!-- <v-icon
        class="cce-trade__panel-hide"
        @click="toggleVisibility"
        v-if="!isMobile"
      >
        {{ isVisible ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}
      </v-icon> -->
    </v-tabs>
    <!-- Action type -->
    <div class="cce-trade__trade-form">
      <div class="cce-trade__trade-form-row">
        <v-btn-toggle
          v-model="tradeAction"
          mandatory
          class="cce-trade__trade-form-toggle btn--no-shadow"
        >
          <v-btn
            depressed
            small
            block
            value="buy"
            :class="tradeBtnClassBuy"
            @click="restoreVisibility"
            :disabled="!authorization.canPerformTradeAction('buy', orderType)"
          >
            {{ $t('TradeForm.buy') }}
          </v-btn>
          <v-btn
            depressed
            small
            block
            value="sell"
            :class="tradeBtnClassSell"
            @click="restoreVisibility"
            :disabled="!authorization.canPerformTradeAction('sell', orderType)"
          >
            {{ $t('TradeForm.sell') }}
          </v-btn>
        </v-btn-toggle>
      </div>
      <!-- Balance -->
      <div class="cce-trade__trade-form-row">
        <v-layout row>
          <v-flex
            sm3
            class="cce-trade__trade-form-name"
            no-wrap
          >
            <span class="cce-capitalize">{{ $t('TradeForm.trade_action', { tradeAction }) }}</span>
            <span class="cce-uppercase">{{ currency }}</span>
          </v-flex>
          <v-flex
            sm9
            class="cce-trade__trade-form-balance cce-trade_clickable"
            @click="setAmount"
          >
            {{ balance(tradeAction === 'buy' ? marketType : currency) }}
            <span class="cce-trade__trade-form-balance-label cce-uppercase">
              {{ tradeAction === 'buy' ? marketType : currency }}
            </span>
          </v-flex>
          <v-icon @click="openWalletModal" class="pl-2 cce-trade__trade-form__deposit-icon">
            far fa-plus-square
          </v-icon>
        </v-layout>
      </div>
      <!-- Price / Limit -->
      <div class="cce-trade__trade-form-row cce-trade__trade-form-price">
        <v-layout row>
          <v-flex
            d-flex
            sm3
          >
            {{ orderType === 'stop' ? $t('TradeForm.limit') : $t('TradeForm.price') }}:
          </v-flex>
          <v-flex
            d-flex
            sm9
          >
            <div v-if="orderType === 'market'">
              <span class="cce-trade__trade-form-price-label">{{ $t('TradeForm.market_price') }}</span>
              <!--<template v-if="stats.topBid && stats.topAsk">
                <span v-if="tradeAction === 'buy'">{{stats.topBid || '&mdash;'}}</span>
                <span v-if="tradeAction === 'sell'">{{stats.topAsk || '&mdash;'}}</span>
                <span class="cce-uppercase">{{ marketType }}</span>
                <v-icon
                  :dark="themeMode === true"
                  :light="themeMode === false"
                  small
                  v-tooltip="'The final price may differ due to market fluctuations'">info</v-icon>
              </template>
              <template v-else>&mdash;</template>-->
            </div>
            <!-- @TODO: use `marketTypePrecision` instead of 8 when it'll be fixed -->
            <trade-form-input
              v-model="price"
              v-if="orderType !== 'market'"
              :symbol="marketType"
              :precision="8"
              :disabled="orderType === 'market'"
              :hasError="priceError"
            />
          </v-flex>
        </v-layout>
      </div>
      <!-- Stop -->
      <div
        class="cce-trade__trade-form-row cce-trade__trade-form-price"
        v-if="orderType === 'stop'"
      >
        <v-layout row>
          <v-flex d-flex sm3>
            {{ $t('TradeForm.stop') }}:
          </v-flex>
          <v-flex d-flex sm9>
            <trade-form-input
              v-model="stop"
              :symbol="marketType"
              :precision="marketTypePrecision"
              :hasError="stopError"
            />
          </v-flex>
        </v-layout>
      </div>
      <!-- Amount -->
      <div class="cce-trade__trade-form-row cce-trade__trade-form-amount">
        <v-layout row>
          <v-flex d-flex sm3>
            {{ $t('TradeForm.amount') }}:
          </v-flex>
          <v-flex
            d-flex
            sm9
          >
            <!--<trade-form-input
              v-model="amount"
              :symbol="tradeAction === 'sell' && orderType === 'market' ? marketType : currency"
              :precision="currencyPrecision"
              :hasError="amountError"
            />-->
            <trade-form-input
              v-model="amount"
              :onInput="this.resetRatioValue"
              :symbol="currency"
              :precision="currencyPrecision"
              :hasError="amountError"
            />
          </v-flex>
        </v-layout>
      </div>
      <!-- RATIO BUTTONS -->
      <div class="cce-trade__trade-form-row cce-trade__trade-form-volume">
        <v-layout row>
          <v-flex d-flex sm3>
          <span class="cce-trade__trade-form-volume-label">
            {{ $t('TradeForm.ratio') }}:
            <v-icon
              :dark="themeMode === true"
              :light="themeMode === false"
              small
              v-tooltip="tradeAction === 'buy'
                ? $t('TradeForm.tooltip_buy', { marketType: marketType.toUpperCase(), currency: currency.toUpperCase() })
                : $t('TradeForm.tooltip_sell', { currency: currency.toUpperCase(), marketType: marketType.toUpperCase() })"
            >info</v-icon>
          </span>
          </v-flex>
          <v-flex d-flex sm9 v-tooltip.bottom="price === ''
            ? `Set the ${orderType === 'stop' ? 'limit' : 'price'}`
            : null
          ">
            <ratio-button @press="ratio" :value="25" :isDisabled="!canCalculateRatio" />
            <ratio-button @press="ratio" :value="50" :isDisabled="!canCalculateRatio" />
            <ratio-button @press="ratio" :value="75" :isDisabled="!canCalculateRatio" />
            <ratio-button @press="ratio" :value="100" :isDisabled="!canCalculateRatio" />
          </v-flex>
        </v-layout>
      </div>
      <!-- RATIO BUTTONS END -->
      <div
        class="cce-trade__trade-form-row cce-trade__trade-form-space"
        v-if="orderType === 'limit' || orderType === 'market'"
      ></div>
      <div
        class="cce-trade__trade-form-row cce-trade__trade-form-space"
        v-if="orderType === 'market'"
      ></div>
      <div
        class="cce-trade__trade-form-row"
        v-if="orderType !== 'market'"
      >
        <v-layout row>
          <v-flex d-flex sm3>
          <span class="cce-trade__trade-form-total-label">
            {{ $t('TradeForm.total') }}:
          </span>
          </v-flex>
          <v-flex d-flex sm9>
            <div class="cce-trade__trade-form-total">
              <span class="cce-trade__trade-form-total-value">
                <span v-decimals="total"></span>
              </span>
              <span class="cce-trade__trade-form-total-symbol">
                <span class="cce-uppercase">
                  {{ marketType }}
                </span>
              </span>
            </div>
          </v-flex>
        </v-layout>
      </div>
      <div class="cce-trade__trade-form-row cce-trade__trade-form-action">
        <v-btn
          depressed
          block
          class="cce-trade__btn"
          :color="tradeAction === 'buy' ? 'cce-trade__trade-form-action-bid' : 'cce-trade__trade-form-action-ask'"
          :disabled="!authorization.canPerformTradeAction(tradeAction, orderType) || hasNegativeBalance"
          @click="submit"
        >
          <v-progress-circular
            indeterminate
            :size="24"
            :width="3"
            color="#fff"
            v-if="busy"
          />
          {{ $t('TradeForm.place_tradeaction_order', { tradeAction }) }}
        </v-btn>
      </div>
    </div>
    <trade-form-overlay
      :authenticated="authenticated"
      :loading="loading"
    />
  </div>
</template>

<script>
  /* ============
   * Trading form
   * ============
   *
   * Trading form component to place buy/sell orders for the trade section
   * Uses TradeFormInput component
   */

  import Big from 'big.js';
  import TradeFormInput from '@/components/Trade/TradeFormInput';
  import Order from '@/proxies/OrderProxy';
  import CCAuthorization from '@/utils/CCAuthorization';
  import RatioButton from '@/components/UI/RatioButton';
  import TradeFormOverlay from '@/components/Trade/TradeFormOverlay';
  import handleErrorMessage from '@/utils/handleErrorMessage';

  export default {
    name: 'trade-form',
    components: {
      TradeFormInput,
      RatioButton,
      TradeFormOverlay,
    },
    data() {
      return {
        defaultPrecision: 2,
        ratioValue: null,
        selected: undefined,
        authorization: new CCAuthorization(),
        defaultOrderTypes: ['market', 'limit', 'stop'],
        defaultTradeActions: ['buy', 'sell'],
        busy: false,
        price: '',
        stop: '',
        amount: '',
        priceError: false,
        stopError: false,
        amountError: false,
        tradeAction: 'buy',
        orderType: this.$themeSettings.tradeTabsOrder[0],
        orderTypeIndex: 0,
        tradeTabsOrder: this.$themeSettings.tradeTabsOrder,
        tText: {
          limit: this.$t('TradeForm.tab_limit'),
          market: this.$t('TradeForm.tab_market'),
          stop: this.$t('TradeForm.tab_stop_limit'),
        },
        currencyPrecision: 0,
        walletsDataInterval: null,
      };
    },
    mounted() {
      if (this.authenticated) {
        this.$store.dispatch('app/checkTradeFormVisibility');
        this.loadWallets(this.authenticated);
      }
      this.setOrderType(this.tradeTabsOrder[0]);
      // Update wallets every minute while TradeForm is mounted
      if (!this.walletsDataInterval) {
        this.walletsDataInterval = setInterval(() => {
          this.loadWallets(this.authenticated);
        }, 20000);
      }
    },
    beforeDestroy() {
      // Stop to update wallets to avoid unnecessary HTTP requests
      if (this.walletsDataInterval) {
        clearInterval(this.walletsDataInterval);
      }
    },
    computed: {
      currentMarket() {
        return this.$store.getters['market/current'] || '';
      },
      user() {
        return this.$store.getters['account/user'];
      },
      themeMode() {
        return this.$store.getters['app/themeMode'];
      },
      marketType() {
        const marketType = this.$store.getters['market/type'];
        if (marketType) return marketType.toUpperCase();
        return '';
      },
      stats() {
        return this.$store.getters['market/info'] || {};
      },
      currency() {
        const currency = this.$store.getters['market/currency'];
        if (currency) return currency.toUpperCase();
        return '';
      },
      tradePrice() {
        return this.$store.getters['app/tradePrice'] || '';
      },
      tradeActionIntent() {
        return this.$store.getters['app/tradeActionIntent'] || '';
      },
      wallets() {
        return this.$store.getters['wallet/list'] || {};
      },
      authenticated() {
        return this.$store.getters['auth/authenticated'];
      },
      marketTypePrecision() {
        return this.marketType && this.$store.getters['market/currencies'][this.marketType]
          ? this.$store.getters['market/currencies'][this.marketType].precision
          : this.defaultPrecision;
        // *********************************
        // @TODO: CHANGE HARDCODED PRECISION
        // return 4;
        // *********************************
      },
      defaultCurrencyPrecision() {
        // if (this.currency) {
          // return this.$store.getters['market/currencies'][this.currency].precision;
        // }
        // return this.defaultPrecision;
        // @TODO: CHANGE HARDCODED PRECISION
        return 4;
        // *********************************
      },
      marketReady() {
        return this.$store.getters['market/ready'];
      },
      loading() {
        if (!this.marketReady || !this.authenticated) {
          return false;
        }
        return !this.$store.getters['wallet/ready'];
      },
      exchangeRate() {
        return this.$store.getters['market/exchangeRate'] || 0;
      },
      total() {
        return new Big(parseFloat(Number(this.price) * Number(this.amount)))
          .toFixed(this.marketTypePrecision);
      },
      isMobile() {
        return this.$vuetify.breakpoint.smAndDown;
      },
      isVisible() {
        return this.$store.getters['app/tradeFormVisible'];
      },
      canCalculateRatio() {
        let balance = 0;
        if (this.tradeAction === 'buy') {
          balance = this.balance(this.marketType);
        } else {
          balance = this.balance(this.currency);
        }
        if (!balance || balance <= 0) {
          return false;
        }

        if (this.tradeAction === 'buy') {
          return this.stats.bid && this.stats.bid > 0;
        } else if (this.tradeAction === 'sell') {
          return this.stats.ask && this.stats.ask > 0;
        }
        return false;
      },
      tradeBtnClassBuy() {
        return {
          'cce-trade__btn': true,
          'cce-trade__btn-disabled': this.tradeAction === 'sell',
          'cce-trade__trade-form-toggle-ask': this.tradeAction !== 'sell',
        };
      },
      tradeBtnClassSell() {
        return {
          'cce-trade__btn': true,
          'cce-trade__btn-disabled': this.tradeAction === 'buy',
          'cce-trade__trade-form-toggle-bid': this.tradeAction !== 'buy',
        };
      },
      hasNegativeBalance() {
        const currency = this.tradeAction === 'buy' ? this.marketType : this.currency;
        const balance = parseFloat(this.balance(currency));

        return balance <= 0;
      },
    },
    methods: {
      // user available balance
      balance(currency) {
        if (!currency) {
          return 0;
        }
        // let precision;
        // if (this.tradeAction === 'buy') {
        //   precision = this.marketTypePrecision;
        // } else {
        //   precision = this.defaultCurrencyPrecision;
        // }
        const precision = this.marketTypePrecision;
        const w = this.wallets;
        const balance = w[currency] ? (w[currency].availableBalance) : 0;
        return new Big(balance).toFixed(precision);
      },
      openWalletModal() {
        const wallet = this.tradeAction === 'buy'
          ? this.wallets[this.marketType]
          : this.wallets[this.currency] || this.wallets.btc;
        this.$emit('onOpenModal', wallet);
      },
      // buy or sell
      setOrderType(type, defaultPrice) {
        this.restoreVisibility();
        if (type === 'market') {
          this.setMarketOrderPrice(this.stats);
        } else {
          this.price = '';
          this.setLimitOrderPrice(this.stats, type);
        }
        if (defaultPrice) {
          this.price = defaultPrice;
        }
        this.amount = '';
        this.stop = '';
        this.priceError = false;
        this.amountError = false;
        this.stopError = false;
        this.orderType = type;
        // Reset focus on first available trading action, if needed
        let faAction = 'buy';
        if (!this.authorization.canPerformTradeAction(faAction, type)) {
          faAction = 'sell';
        }
        if (this.tradeAction !== faAction) {
          this.tradeAction = faAction;
        }
      },
      // Set price for Market Order from stats
      setMarketOrderPrice(stats) {
        if (stats) {
          // Attempt to fetch price from stats stream
          if (this.tradeAction === 'sell') {
            this.price = stats.ask;
          }
          if (this.tradeAction === 'buy') {
            this.price = stats.bid;
          }
        } else if (this.tradePrice) {
          // Fallback on tradePrice, if any
          this.price = this.tradePrice;
        } else {
          // Give up
          this.price = '';
        }
        // If this is an market buy order (BN), add % margin to price
        if (this.currentMarket && stats &&
          this.tradeAction === 'buy' && this.currentMarket.liquidityProvider === 'binance') {
          const absGrowthRatio = Math.abs(parseFloat(stats.growthRatio));
          if (absGrowthRatio > 0) {
            this.price += parseFloat(new Big(this.price).times(absGrowthRatio).div(100));
          }
        }
      },
      // Set 'last price' as 'Price' by default in limit orders when no price is set
      setLimitOrderPrice(stats, orderType) {
        if (!orderType) {
          orderType = this.orderType;
        }
        if (!stats) {
          stats = this.stats;
        }
        if (orderType === 'limit' || orderType === 'stop') {
          if (stats && stats.lastPrice) {
            if (!this.price || this.price === '' || this.price === 0) {
              this.price = stats.lastPrice;
            }
          }
        }
      },
      // set amount by percentage
      ratio(val) {
        if (!this.price || this.price === '') {
          return;
        }
        let amount = 0;
        if (this.tradeAction === 'buy') {
          amount = this.balance(this.marketType) / this.price;
        } else {
          amount = this.balance(this.currency);
        }
        // if (this.orderType === 'market' && this.tradeAction === 'sell') {
          // currency only switches on sell for market orders
          // amount *= this.price;
        // }

        if (val <= 100) {
          this.setPrecision(new Big(parseFloat((amount / 100) * val))
            .toFixed(this.defaultCurrencyPrecision));
          this.ratioValue = val;
        }
      },
      toggleVisibility() {
        this.$store.dispatch('app/setTradeFormVisibility', !this.isVisible);
      },
      restoreVisibility() {
        // small workaround to reset amount
        this.amount = '';
        this.$store.dispatch('app/setTradeFormVisibility', true);
      },
      // submit user order
      async submit() {
        if (this.orderType === 'market') {
          this.price = this.actionType === 'sell'
            ? this.stats.ask
            : this.stats.bid;
        }
        if (this.busy || this.price === '' || this.amount === '') {
          this.priceError = this.price === '';
          this.amountError = this.amount === '';
          this.stopError = this.stop === '';
          return;
        }
        this.busy = true;
        const data = {
          orderType: this.orderType,
          actionType: this.tradeAction,
          market: `${this.currency.toUpperCase()}-${this.marketType.toUpperCase()}`,
          amount: parseFloat(this.amount),
          unitPrice: parseFloat(this.price),
          ratio: this.ratioValue,
        };
        if (this.orderType === 'stop') {
          data.stopPrice = parseFloat(this.stop);
        }
        try {
          await new Order().addOrder(data);
          const action = this.tradeAction.toLowerCase();
          const orderType = this.orderType.charAt(0).toUpperCase() + this.orderType.slice(1);
          this.$notify({
            type: 'success',
            text: `${orderType} ${action} order has been submitted`,
          });
          this.resetRatioValue();
          this.price = '';
          this.stop = '';
          this.amount = '';
          this.priceError = false;
          this.amountError = false;
          this.stopError = false;
          this.busy = false;
          if (this.walletsDataInterval) {
            clearInterval(this.walletsDataInterval);
          }
          this.walletsDataInterval = setInterval(() => {
            this.loadWallets(this.authenticated);
          }, 5000);
        } catch (e) {
          const err = handleErrorMessage(e);
          this.$notify({
            type: 'warn',
            text: err,
          });
          this.busy = false;
        }
      },
      // Set the calculated amount upon clicking
      // Available Balance
      setAmount() {
        if (!this.price || this.price === '') {
          return;
        }
        const currency = this.tradeAction === 'buy' ? this.marketType : this.currency;
        const balance = parseFloat(this.balance(currency));
        const amount = this.tradeAction === 'buy' ? balance / this.price : balance;
        // if (this.orderType === 'market' && this.tradeAction === 'sell') {
          // amount currency only switches on sell for market orders
          // amount *= this.price;
          // console.log('amount II', amount);
        // }
        // this.amount = new Big(amount).toFixed(this.tradeAction === 'buy'
          // ? this.currencyPrecision
          // : this.marketTypePrecision);
        // this.amount = new Big(amount).toFixed(this.defaultCurrencyPrecision);
        this.amount = new Big(amount).toFixed(this.marketTypePrecision);
        this.ratioValue = 100;
      },
      // load balance
      loadWallets(auth) {
        if (auth === true) {
          this.$store.dispatch('wallet/list', {});
        }
      },
      setPrecision(value) {
        // USD / Permitted decimals
        // 1000+/0.12345
        // <1000/0.1234
        // <100/0.123
        // <10/0.12
        // <5/0.1
        // <1/1
        let precision = 0;
        if (this.exchangeRate !== 0 && value) {
          if (this.exchangeRate < 1) precision = 0;
          else if (this.exchangeRate < 5) precision = 1;
          else if (this.exchangeRate < 10) precision = 2;
          else if (this.exchangeRate < 100) precision = 3;
          else if (this.exchangeRate < 1000) precision = 4;
          else precision = 5;
        } else {
          // if there is no `this.exchangeRate` for current market
          precision = this.defaultCurrencyPrecision;
        }

        this.currencyPrecision = precision;
        this.$nextTick(() => {
          const stringifiedValue = String(value).split('.');
          if (stringifiedValue.length > 1) {
            const decimals = stringifiedValue[1].length > precision
              ? stringifiedValue[1].slice(0, precision)
              : stringifiedValue[1];

            this.amount = `${stringifiedValue[0]}.${decimals}`;
          } else {
            this.amount = value;
          }
        });
      },
      resetRatioValue() {
        this.ratioValue = null;
      },
    },
    watch: {
      currentMarket() {
        this.authorization.updateTradePermissionMatrix(
          this.defaultTradeActions,
          this.defaultOrderTypes,
          this.currentMarket.restrictTrade,
          this.user,
        );
        // Check for trade restrictions and update UI accordingly.
        // First accessible order type: focus on first tab (order type) that user has access to.
        let faOrderType;
        this.tradeTabsOrder.forEach((tabOrderType) => {
          if (!faOrderType && this.authorization.canPerformOrderType(tabOrderType)) {
            faOrderType = tabOrderType;
          }
        });
        if (!faOrderType) {
          faOrderType = this.tradeTabsOrder[0];
        }
        this.orderTypeIndex = String(this.tradeTabsOrder.indexOf(faOrderType));
        this.setOrderType(faOrderType);
      },
      stats(stats) {
        if (this.orderType === 'market') {
          this.setMarketOrderPrice(stats);
        }
      },
      tradePrice(val) {
        if (this.orderType !== 'market') {
          this.price = val;
        }
      },
      tradeActionIntent({ type, action, price, amount }) {
        const orderType = type || 'limit';
        if (!this.authorization.canPerformTradeAction(action, orderType)) {
          return;
        }
        this.orderTypeIndex = String(this.tradeTabsOrder.indexOf(orderType));
        this.setOrderType(orderType, price);
        this.tradeAction = action;
        this.amount = amount;
      },
      authenticated(val) {
        this.loadWallets(val);
      },
      amount(newAmount) {
        if (newAmount) {
          this.setPrecision(newAmount);
        }
      },
    },
  };
</script>
