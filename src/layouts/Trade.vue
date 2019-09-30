<template>
  <v-app
    :class="{ 'cce-trade--mobile' : isMobile }"
    :dark="themeMode"
  >
    <!-- Header -->
    <trade-bar />

    <!-- Content -->
    <v-content
      :class="{ 'mt-1': isMobile }"
      :style="{ padding: isMobile ? '45px 0 52px 0' : '45px 0 0 0' }"
    >
      <v-container
        fluid
        fill-height
        :grid-list-xs="isMobile"
      >
        <v-layout row>
          <!-- Previous Trades -->
          <v-flex
            d-flex
            class="cce-trade__history"
            :class="{ 'pr-2' :  !isMobile }"
            v-if="((isMobile && bottomNavIs(['history'])) || !$vuetify.breakpoint.mdAndDown) && !tradePriceChartExpanded"
          >
            <trade-history />
          </v-flex>
          <!-- Charts / User Orders -->
          <v-flex
            d-flex
            :class="{ 'pr-2' :  !isMobile }"
            v-if="(isMobile && (bottomNavIs(['charts', 'orders']))) || !isMobile"
          >
            <!-- Charts -->
            <v-layout column>
              <v-flex
                d-flex
                class="cce-trade__charts"
                v-if="(isMobile && bottomNavIs(['charts'])) || !isMobile"
              >
                <trade-charts
                  :isResizable="!$vuetify.breakpoint.mdAndDown"
                  @resizeChart="rebuildLayout"
                />
              </v-flex>
              <!-- User Orders -->
              <v-flex
                d-flex class="cce-trade__user-orders"
                :class="{ 'pt-2' :  !isMobile, 'cce-trade__user-orders--hide' : ((!tradeUserOrdersVisibility && !isMobile)) }"
                v-if="
                  (isMobile && bottomNavIs(['orders']) ||       // up to SM and selected tab
                  (!isMobile && !tradePriceChartExpanded)) ||   // greater than SM and price chart is not expanded
                  ($vuetify.breakpoint.mdAndDown && !isMobile)  // between SM and MD breakpoints
                "
              >
                <trade-user-orders />
              </v-flex>
            </v-layout>
          </v-flex>
          <!-- Orders Book / Trade Form -->
          <v-flex
            d-flex
            class="cce-trade__orders-trade"
            v-if="(isMobile && (bottomNavIs(['book', 'trade']))) || !isMobile"
          >
            <v-layout column>
              <!-- Orders Book -->
              <v-flex
                class="cce-trade__order-book"
                d-flex
                v-if="(isMobile && bottomNavIs(['book'])) || !isMobile"
              >
                <trade-order-book v-if="!isBinance && !loading"/>
                <temp-order-book v-if="isBinance && !loading"/>
              </v-flex>
              <!-- Trade Form -->
              <v-flex
                class="cce-trade__form"
                :class="{ 'pt-2' :  !isMobile, 'cce-trade__form--hide' : ((!tradeFormVisibility && !isMobile) || (!authenticated && !isMobile))}"
                d-flex
                v-if="(isMobile && bottomNavIs(['trade'])) || !isMobile"
              >
                <trade-form @onOpenModal="openWalletModal"/>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <!-- Bottom Nav (for mobile) -->
    <trade-bottom-nav />
    <!-- Loader -->
    <div
      class="cce-overlay"
      v-if="loading"
    >
      <progress-spinner :width="3" color="blue" />
    </div>
    <notifications
      position="top center"
      :duration="7000"
      :width="350"
      :max="8"
      :speed="800"
      classes="cce-notification"
    />
    <wallets-modal
      v-if="isModalVisible"
      @onClose="isModalVisible = !isModalVisible"
      :wallet="selectedWallet"
      :modalTab="modalTab"
      isOpenedInTradeScreen
    />
  </v-app>
</template>

<script>
/* ============
 * Trade layout
 * ============
 *
 * Trade layout for the trading dashboard section
 */
import TradeBar from '@/components/Trade/TradeBar';
import TradeBottomNav from '@/components/Trade/TradeBottomNav';
import TradeHistory from '@/components/Trade/TradeHistory';
import TradeCharts from '@/components/Trade/TradeCharts';
import TradeUserOrders from '@/components/Trade/TradeUserOrders';
import TradeForm from '@/components/Trade/TradeForm';
import TradeOrderBook from '@/components/Trade/TradeOrderBook/TradeOrderBook';
import TempOrderBook from '@/components/Trade/TradeOrderBook/TempOrderBook';
import ProgressSpinner from '@/components/UI/ProgressSpinner';
import WalletsModal from '@/components/Wallet/WalletsModal';

import AnalyticsProxy from '@/proxies/AnalyticsProxy';

export default {
  name: 'trade-layout',
  components: {
    TradeBar,
    TradeBottomNav,
    TradeHistory,
    TradeCharts,
    TradeUserOrders,
    TradeOrderBook,
    TempOrderBook,
    TradeForm,
    ProgressSpinner,
    WalletsModal,
  },
  data() {
    return {
      isTradeHistoryVisible: true,
      isModalVisible: false,
      modalTab: '0',
      selectedWallet: null,
      favPairsInterval: null,
    };
  },
  mounted() {
    this.$store.dispatch('market/notReady');
    this.identifyMarket();
    this.identifyReferral();
    // update favorite pairs interval
    if (!this.favPairsInterval) {
      this.favPairsInterval = setInterval(() => {
        this.$store.dispatch('market/favoritePairsSummaries');
      }, 60000);
    }
  },
  beforeDestroy() {
    if (this.favPairsInterval) {
      clearInterval(this.favPairsInterval);
    }
  },
  computed: {
    /**
     * Returns if the window width is less than 960px
     * @returns {Boolean}
     */
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },

    /**
     * Returns bottom navigation active tab
     * @returns {String}
     */
    bottomNav() {
      return this.$store.getters['app/bottomNav'];
    },

    /**
     * Returns trade form visibility state
     * @returns {Boolean}
     */
    tradeFormVisibility() {
      return this.$store.getters['app/tradeFormVisible'];
    },

    /**
     * Returns price chart mode state
     * @returns {Boolean}
     */
    tradePriceChartExpanded() {
      return this.$store.getters['app/tradePriceChartExpanded'];
    },

    /**
     * Returns user orders visibility state
     * @returns {Boolean}
     */
    tradeUserOrdersVisibility() {
      return this.$store.getters['app/tradeUserOrdersVisible'];
    },

    /**
     * Returns market loading state from store
     * @returns {Boolean}
     */
    loading() {
      return this.$store.getters['market/loading'];
    },

    /**
     * Returns auth state
     * @returns {Boolean}
     */
    authenticated() {
      return this.$store.getters['auth/authenticated'];
    },

    /**
     * Returns user data object
     * @returns {Object}
     */
    user() {
      return this.$store.getters['app/user'];
    },

    /**
     * Returns current market settings from store
     * @returns {Object}
     */
    activeMarketSettings() {
      return this.$store.getters['market/current'];
    },

    /**
     * Returns is provider is Binance
     * @returns {Boolean}
     */
    isBinance() {
      return this.activeMarketSettings.liquidityProvider !== 'cce';
    },

    /**
     * Returns active theme mode
     * @returns {Boolean}
     */
    themeMode() {
      return this.$store.getters['app/themeMode'];
    },

    /**
     * Returns default market pair from store
     * @returns {String}
     */
    defaultMarketPair() {
      return this.$store.getters['market/defaultMarketPair'];
    },
  },
  methods: {
    /**
     * Opens wallet modal
     * @param {Object} wallet selected wallet
     */
    openWalletModal(wallet) {
      this.selectedWallet = wallet;
      this.isModalVisible = true;
      this.modalTab = '0';
    },

    /**
     * Triggers layout changing depending on price chart mode
     * @param {Boolean} isChartFullSized current price chart state
     */
    rebuildLayout(isChartFullSized) {
      this.isTradeHistoryVisible = !isChartFullSized;
    },

    /**
     * Changes active theme
     */
    toggleThemeMode() {
      this.themeMode = !this.themeMode;
    },

    /**
     * Defines the last selected market
     */
    identifyMarket() {
      // const marketDefault = 'eth_btc';
      const marketDefault = this.defaultMarketPair.replace('-', '_');
      let market = marketDefault;
      if (this.$route.params.market !== undefined) {
        market = this.$route.params.market.replace('-', '_');
      } else {
        const ls = localStorage.getItem('lastMarket');
        if (ls) {
          market = ls;
        }
      }
      const marketInfo = market.split('_');
      if (marketInfo.length !== 2) {
        market = marketDefault;
      }
      this.setMarket(marketInfo[0], marketInfo[1]);
    },

    /**
     * Extracts refferal data from query
     */
    async identifyReferral() {
      let referral = '';
      if (this.$route.query.referral !== undefined) {
        referral = this.$route.query.referral;
        // do referral stuff
        await new AnalyticsProxy().click(referral);
        localStorage.setItem('referralCode', referral);
      }
    },

    /**
     * Sets selected market
     * @param {String} currency selected currency
     * @param {String} marketType selected market type
     */
    async setMarket(currency, marketType) {
      const success = await this.$store.dispatch('market/init', {
        marketType: marketType.toUpperCase(),
        currency: currency.toUpperCase(),
      });
      if (success) {
        this.subTopics(currency, marketType);
      } else {
        setTimeout(() => {
          const defaultMarketPair = this.defaultMarketPair.split('-');
          this.setMarket(defaultMarketPair[0], defaultMarketPair[1]);
          this.$router.push({
            name: 'trade.index',
            params: {
              // market: 'eth-btc',
              market: this.defaultMarketPair,
            },
          });
        }, 1000);
      }
    },

    /**
     * Subscribes through sockets using given pair
     * @param {String} currency selected currency
     * @param {String} marketType selected market type
     */
    subTopics(currency, marketType) {
      const market = `${this.$projectId}_${marketType}_${currency}`;
      this.$sockets.subscribe(`/marketSummary-${market}`, 'marketSummary');
      this.$sockets.subscribe(`/tradeHistory-${market}`, 'tradeHistory');
      this.$sockets.subscribe(`/orderBook-${market}`, 'orderBook');
    },

    /**
     * Defines current active navigation tab
     * @param {Array<String>} arr list of tabs
     */
    bottomNavIs(arr) {
      return arr.indexOf(this.bottomNav) > -1;
    },
  },
  watch: {
    /**
     * Catches redirections to teh Trade page and init market and refferal stuff
     * @param {Object} to next route data object
     */
    $route(to) {
      if (to.name === 'trade.index') {
        this.identifyMarket();
        this.identifyReferral();
      }
    },
  },
};
</script>
