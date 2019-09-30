<template>
  <v-layout column fill-height>
    <orders-header @onChangeTab="changeTab">
      <template>
        <pair-selector @onChangePair="getOrdersByPair" />
        <div class="mx-5">
          <timeline-controls
            :initialTimeframe="timeframeToFilterBy"
            @onChangeTimeframe="updateTimeframe" />
        </div>
        <v-icon
          class="cce-orders-header-icon"
          :class="{ 'cce-orders-header-icon--disabled': filteredOrders.length === 0 }"
          @click="downloadCSV"
          v-tooltip.top="filteredOrders.length === 0 ? $t('Orders.no_data_to_download') : $t('Orders.download_csv_file')"
        >
          fas fa-download
        </v-icon>
      </template>
    </orders-header>
    <template v-if="tab === 0">
      <open-orders
        :orders="filteredOrders"
        :isTotalVisible="isTotalVisible"
        :totalSummary="totalSummary"
        :timeframeToFilterBy="timeframeToFilterBy"
      />
    </template>
    <template v-if="tab === 1">
      <completed-orders
        :orders="filteredOrders"
        :isTotalVisible="isTotalVisible"
        :totalSummary="totalSummary"
        :timeframeToFilterBy="timeframeToFilterBy"
      />
    </template>
  </v-layout>
</template>

<script>
/* ============
 *  Orders page
 *  ============
 *
 *  User Orders page for the account section
 */
import OrdersHeader from '@/components/Orders/OrdersHeader';
import PairSelector from '@/components/Orders/PairSelector';
import OpenOrders from '@/components/Orders/OpenOrders';
import CompletedOrders from '@/components/Orders/CompletedOrders';
import TimelineControls from '@/components/TimelineControls';
import csvMixin from '@/mixins/csv';
import convertToNumbers from '@/utils/convertToNumbers';

export default {
  name: 'account-orders',
  components: {
    OrdersHeader,
    PairSelector,
    TimelineControls,
    OpenOrders,
    CompletedOrders,
  },
  mixins: [csvMixin],
  mounted() {
    this.getOrdersByPair();
  },
  data() {
    return {
      tab: 0,                         // active tab (Open orders || Trade history)
      csvFileName: 'all-orders.csv',  // file name that will be downloaded
      settings: {},                   // saved `marketType` and `currency` props
      isCSVDisabled: false,           // should CSV button be active or not
      timeframeToFilterBy: '1M',      // default timeframe to filter by
    };
  },
  computed: {
    /**
     * Returns orders from store with converted numeric values
     * @returns {Array<Object>}
     */
    orders() {
      const orders = this.$store.getters['order/userOrders'];
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
      this.filteredOrders.forEach((order) => {
        summary.totalAmount += order.amount;
      });
      return summary;
    },

    /**
     * Returns orders filtered by `createdAt` prop
     * @returns {Array<Object>}
     */
    filteredOrders() {
      return this.filterOrdersByDate(this.orders, this.timeframeToFilterBy);
    },
  },
  methods: {
    /**
     * Saves `currency` and `marketType` in local state
     * @param {Object} settings contains `currency` and `marketType` props
     */
    saveSettings(settings) {
      if (settings) this.settings = settings;
      else this.settings = {};
    },

    /**
     * Saves tab changing and executes `getOrdersByPair` depending on tab
     * @param {Number} tabIndex data comes with `onChangeTab` event from `orders-header` component
     */
    changeTab(tabIndex) {
      this.tab = tabIndex;
      if (tabIndex === 0) {
        this.getOrdersByPair(this.settings, true);
      } else {
        this.getOrdersByPair(this.settings, false);
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
        totalPrice: 0,
        totalAmount: 0,
        totalFee: 0,
      };
    },

    /**
     * Downloads the CSV file using `buildCSV` and `downloadFile` csv mixins
     */
    downloadCSV() {
      if (this.filteredOrders.length === 0) return;
      const ordersCSV = this.buildCSV(this.filteredOrders);
      this.downloadFile(ordersCSV, this.csvFileName, 'text/csv;encoding:utf-8');
    },

    /**
     * Changes CSV file name by given pair for future download
     * @param {Object} settings contains `marketType` and `currency` props
     */
    changeCSVFileName(settings) {
      if (settings && settings.currency && settings.marketType) {
        const { marketType, currency } = settings;
        this.csvFileName = `${currency}-${marketType}-orders.csv`;
      } else {
        this.csvFileName = 'all-orders.csv';
      }
    },

    /**
     * Updates `timeframeToFilterBy` value from event
     * @param {String} timeframe value received from event
     */
    updateTimeframe(timeframe) {
      this.timeframeToFilterBy = timeframe;
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
     * Executes `changeCSVFileName` method and runs `getOrders` depending on active tab
     * @param {Object} settings contains data from `onChangePair` event
     */
    getOrdersByPair(settings) {
      this.changeCSVFileName(settings);
      this.saveSettings(settings);
      if (this.tab === 0) {
        // fetch opened orders
        this.getOrders(settings, true);
      } else {
        // fetch trade history
        this.getOrders(settings, false);
      }
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
      res = await this.$store.dispatch('order/userOrders', params);
      return res;
    },
  },
};
</script>
