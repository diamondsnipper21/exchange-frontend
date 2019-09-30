<template>
  <v-layout column fill-height>
    <widget-header @onChangeTab="changeTab">
      <template>
        <widget-pair-selector 
        @onChangePair="getOrdersByPair"
        v-if="(tab === tabNumber.open_orders) || (tab === tabNumber.completed_orders)"
        />
        <div class="mx-5">
          <timeline-controls
            :initialTimeframe="timeframeToFilterBy"
            @onChangeTimeframe="updateTimeframe"
            v-if="tab !== tabNumber.wallet"
             />
        </div>
      </template>
    </widget-header>
    <template v-if="tab === tabNumber.wallet">
      <widget-wallets-table
        :wallets="wallets"
        :currencies="currencies"
        :loading="loading"
      />
    </template>
    <template v-if="tab === tabNumber.open_orders">
      <widget-open-orders
        :orders="filteredOrders"
        :isTotalVisible="isTotalVisible"
        :totalSummary="totalSummary"
        :timeframeToFilterBy="timeframeToFilterBy"
        @reloadOpenOrders="reloadOpenOrders"
      />
    </template>
    <template v-if="tab === tabNumber.completed_orders">
      <widget-completed-orders
        :orders="filteredOrders"
        :isTotalVisible="isTotalVisible"
        :totalSummary="totalSummary"
        :timeframeToFilterBy="timeframeToFilterBy"
      />
    </template>
    <template v-if="tab === tabNumber.payments">
      <widget-payments
        :history="filterHistory"
        :timeframeToFilterBy="timeframeToFilterBy"
        :loading="loading"
      />
    </template>
    <template v-if="tab === tabNumber.logs">
      <widget-login-history-table
        :accessLogs="filterAccesses"
        :timeframeToFilterBy="timeframeToFilterBy"
        :loading="loading"
      />
    </template>
  </v-layout>
</template>

<script>
/* ============
 *  User Widget page
 *  ============
 *
 *  User Widget page for the admin account section : Orders, Payments, Logs
 */
import WidgetHeader from '@/components/Users/Widget/WidgetHeader';
import WidgetPairSelector from '@/components/Users/Widget/WidgetPairSelector';
import WidgetOpenOrders from '@/components/Users/Widget/WidgetOpenOrders';
import WidgetCompletedOrders from '@/components/Users/Widget/WidgetCompletedOrders';
import WidgetPayments from '@/components/Users/Widget/WidgetPayments';
import WidgetLoginHistoryTable from '@/components/Users/Widget/WidgetLoginHistoryTable';
import WidgetWalletsTable from '@/components/Users/Widget/WidgetWalletsTable';
import convertToNumbers from '@/utils/convertToNumbers';
import TimelineControls from '@/components/TimelineControls';
import compare from '@/utils/compare';
import Big from 'big.js';

const testUserUid = '473576d5-e8f1-4627-b80b-fb027ac2b745';

export default {
  name: 'user-widget',
  components: {
    WidgetHeader,
    WidgetPairSelector,
    WidgetCompletedOrders,
    WidgetOpenOrders,
    WidgetPayments,
    WidgetLoginHistoryTable,
    WidgetWalletsTable,
    TimelineControls,
  },
  mounted() {
    this.wallets = {};
    this.loadWallets();
  },
  data() {
    return {
      tab: 0,                   // (Open orders||Trade history||Wallets||Payments||Logs)
      settings: {},             // saved `marketType` and `currency` props
      userUid: testUserUid,
      accountUid: testUserUid,
      timeframeToFilterBy: '1M', // default timeframe to filter by
      loading: false,
      wallets: {},
      tabNumber: {
        wallet: 0,
        open_orders: 1,
        completed_orders: 2,
        payments: 3,
        logs: 4,
      },
    };
  },
  computed: {
    user() {
      return this.$store.getters['account/userByEmail'];
    },

    /**
     * Returns orders from store with converted numeric values
     * @returns {Array<Object>}
     */
    orders() {
      const orders = this.$store.getters['order/userFindOrders'];
      if (Array.isArray(orders)) {
        return orders.map((order) => {
          const [currency, marketType] = order.market.split('-');
          return {
            ...convertToNumbers(order),
            currency,
            marketType,
          };
        });
      }
      return [];
    },

    /**
     * Returns orders from store with converted numeric values
     * @returns {Array<Object>}
     */
    accessLogs() {
      return this.$store.getters['account/accessLogs'] || [];
    },

    /**
     * Returns wallets from store
     * @returns {Object}
     */
    getWallets() {
      return this.$store.getters['wallet/listByAccount'] || {};
    },

    /**
     * Returns all currencies from store
     * @returns {Array}
     */
    currencies() {
      return this.$store.getters['market/currenciesArr'] || [];
    },


    /**
     * Returns all payment history from store
     * @returns {Array}
     */
    history() {
      const currencies = this.$store.getters['market/currenciesArr'];
      const transactions = this.$store.getters['wallet/transactions'];

      if (transactions && transactions.payments) {
        return transactions.payments
          .map((payment) => {
            payment.balance = new Big(payment.balance).toFixed();
            const linkObj = currencies.filter(d => d.currency === payment.currency);

            let explorerLink = '';
            if (linkObj.length > 0) {
              explorerLink = linkObj[0].blockExplorer;
            }

            payment.explorerLink = explorerLink;
            return payment;
          })
          .sort((a, b) => compare(a, b, 'createdAt'));
      }
      return [];
    },

    /**
     * Returns if pair is selected and if `totalSummary` can be calculated
     * @returns {Boolean}
     */
    isTotalVisible() {
      return Boolean(
        this.filteredOrders.length > 0 &&
        this.settings.marketType &&
        this.settings.currency,
      );
    },

    /**
     * Returns sums of prop's values from `filteredOrders`
     * @returns {Object}
     */
    totalSummary() {
      const summary = this.createSummaryObject(this.isTotalVisible);
      let totalAmount = 0;
      let totalBuyAmount = 0;
      let totalSellAmount = 0;

      this.filteredOrders.forEach((order) => {
        totalAmount = new Big(totalAmount).plus(new Big(order.amount));
        if (order.side === 'buy') {
          totalBuyAmount = new Big(totalBuyAmount)
            .plus(new Big(order.amount).times(new Big(order.unitPrice)));
        } else {
          totalSellAmount = new Big(totalSellAmount)
            .plus(new Big(order.amount));
        }
      });

      summary.totalAmount = totalAmount;
      summary.totalBuyAmount = totalBuyAmount;
      summary.totalSellAmount = totalSellAmount;
      return summary;
    },

    /**
     * Returns orders filtered by `createdAt` prop
     * @returns {Array<Object>}
     */
    filteredOrders() {
      return this.filterOrdersByDate(this.orders, this.timeframeToFilterBy);
    },

    /**
     * Returns accesses filtered by `createdAt` prop
     * @returns {Array<Object>}
     */
    filterAccesses() {
      return this.filterAccessesByDate(this.accessLogs, this.timeframeToFilterBy);
    },

    /**
     * Returns history filtered by `createdAt` prop
     * @returns {Array<Object>}
     */
    filterHistory() {
      return this.filterHistoryByDate(this.history, this.timeframeToFilterBy);
    },
  },
  methods: {
    /**
     * Saves tab changing and executes `getOrdersByPair` depending on tab
     * @param {Number} tabIndex data comes with `onChangeTab` event from `orders-header` component
     */
    changeTab(tabIndex) {
      this.settings = {};
      this.tab = tabIndex;

      if (tabIndex === this.tabNumber.wallet) {
        this.loadWallets();
      } else if (tabIndex === this.tabNumber.open_orders) {
        this.getOrdersByPair(this.settings, true);
      } else if (tabIndex === this.tabNumber.completed_orders) {
        this.getOrdersByPair(this.settings, false);
      } else if (tabIndex === this.tabNumber.payments) {
        this.loadHistory();
      } else if (tabIndex === this.tabNumber.logs) {
        this.loadAccessLogs();
      }
    },

    /**
     * Creates object with props needed in `total` row
     * @param {Boolean} shouldCalculateSummary decision to calculate for selected pair or not
     * @returns {Object}
     */
    createSummaryObject(shouldCalculateSummary) {
      if (!shouldCalculateSummary) return {};
      const [currency, marketType] = this.orders[0].market.split('-');
      return {
        currency,
        marketType,
        tatalOrders: this.orders.length,
        totalAmount: 0,
        totalBuyAmount: 0,
        totalSellAmount: 0,
      };
    },

    /**
     * Updates `timeframeToFilterBy` value from event
     * @param {String} timeframe value received from event
     */
    updateTimeframe(timeframe) {
      this.timeframeToFilterBy = timeframe;
    },

    /**
     * Executes `changeCSVFileName` method and runs `getOrders` depending on active tab
     * @param {Object} settings contains data from `onChangePair` event
     */

    saveSettings(settings) {
      if (settings) this.settings = settings;
      else this.settings = {};
    },

    getOrdersByPair(settings) {
      this.saveSettings(settings);
      if (this.tab === this.tabNumber.open_orders) {
        // fetch opened orders
        this.getOrders(settings, true);
      } else if (this.tab === this.tabNumber.completed_orders) {
        // fetch trade history
        this.getOrders(settings, false);
      }
    },

    /**
     * Filters orders by given time period
     * @param {Array} orders time period to filter by
     * @param {String} timeframe time period to filter by
     * @returns {Array} filtered orders
     */
    filterOrdersByDate(orders, timeframe) {
      if (timeframe && this.periods[timeframe]) {
        const now = Date.now();
        const filteredOrders = orders.filter((item) => {
          if (new Date(item.createdAt).getTime() >= now - this.periods[timeframe]) return true;
          return false;
        });
        return filteredOrders;
      }
      return orders;
    },

     /**
     * Filters accesses by given time period
     * @param {Array} accesses time period to filter by
     * @param {String} timeframe time period to filter by
     * @returns {Array} filtered accesses
     */
    filterAccessesByDate(accesses, timeframe) {
      if (timeframe && this.periods[timeframe]) {
        const now = Date.now();
        const filteredAccesses = accesses.filter((item) => {
          if (new Date(item.logTime).getTime() >= now - this.periods[timeframe]) return true;
          return false;
        });
        return filteredAccesses;
      }
      return accesses;
    },

     /**
     * Filters accesses by given time period
     * @param {Array} accesses time period to filter by
     * @param {String} timeframe time period to filter by
     * @returns {Array} filtered accesses
     */
    filterHistoryByDate(history, timeframe) {
      if (timeframe && this.periods[timeframe]) {
        const now = Date.now();
        const filteredHistory = history.filter((item) => {
          if (new Date(item.createdAt).getTime() >= now - this.periods[timeframe]) return true;
          return false;
        });

        return filteredHistory;
      }
      return history;
    },

    reloadOpenOrders() {
      this.getOrders(this.settings, true);
    },

    /**
     * Fetches orders data from the API
     * @param {Object} setings contains `currency` and `marketType` params
     * @param {Boolean} shouldFetchOpened desicion to fetch opened orders or trade history
     * @returns {Array} response
     */
    async getOrders(settings, shouldFetchOpened) {
      let res = null;
      // fetch opened orders by default
      let status = '%5B"open","partial","scheduled","submitting","canceling"%5D';
      if (!shouldFetchOpened) {
        // fetch trade history
        status = '%5B"filled","canceled"%5D';
      }
      const params = {
        status,
        limit: 50,
        page: 1,
        findUserUid: this.userUid,
      };
      // set pair market param if it is selected
      if (settings && settings.currency) {
        params.market = settings.currency.toUpperCase();
      }
      if (settings && settings.marketType) {
        params.market += `-${settings.marketType.toUpperCase()}`;
      }

      if (!shouldFetchOpened) {
        params.skipMatches = true;
      }
      res = await this.$store.dispatch('order/userFindOrders', params);
      return res;
    },

    async loadAccessLogs() {
      this.loading = true;
      const params = {
        findUserUid: this.userUid,
      };
      await this.$store.dispatch('account/getAccessLog', params);
      this.loading = false;
    },

    /**
     * Makes a request to load wallets
     */
    async loadWallets() {
      let ret = null;
      this.loading = true;
      const params = {
        findAccountUid: this.accountUid,
      };
      ret = await this.$store.dispatch('wallet/listByAccount', params);
      this.loading = false;
      return ret;
    },

    /**
     * Makes a request to load wallets
     */
    async listClients() {
      await this.$store.dispatch('wallet/listClient', {});
    },

    /**
     * Makes request to get deposits and payments data
     */
    async loadHistory() {
      this.loading = true;
      const params = {
        limit: 500,
        page: 1,
        findAccountUid: this.accountUid,
      };
      await this.$store.dispatch('wallet/transactions', params);
      this.loading = false;
    },
  },

  watch: {
    user(next) {
      if (next == null) {
        this.userUid = testUserUid;
        this.accountUid = testUserUid;
      } else {
        this.userUid = next.userUid;
        this.accountUid = next.accountId;
      }

      this.changeTab(this.tab);
    },

    getWallets(w) {
      this.wallets = w;
    },
  },
};
</script>
