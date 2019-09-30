<template>
  <transition name="page" mode="out-in">
    <!-- Router -->
    <router-view></router-view>
  </transition>
</template>
<script>
  /* ============
   * Entry Point
   * ============
   *
   * The entry point of the application
   */
  import insertAndExecute from '@/utils/insertAndExecute';
  import scriptsToInsert from '@/utils/scriptsToInsert';
  import Vue from 'vue';

  export default {
    name: 'cce-frontend',
    data() {
      return {
        trade: true, // is trade section active
        themeAnalyticsGlobal: this.$themeSettings.themeAnalyticsGlobal,
        themeAnalyticsClient: this.$themeSettings.themeAnalyticsClient,
        themeHotjarClient: this.$themeSettings.themeHotjarClient,
      };
    },
    async created() {
      const uri = window.location.search.substring(1);
      const params = new URLSearchParams(uri);
      const token = params.get('st');
      if (!token) {
        return;
      }
      await this.$store.dispatch('auth/save', {
        result: {
          token,
        },
      });
      await this.$store.dispatch('auth/check');

      // Remove the 'st' query param after it was stored locally, and reload page
      params.delete('st');
      window.location = window.location.pathname + params.toString() + window.location.hash;
    },
    async mounted() {
      // init app
      await this.$store.dispatch('app/init');
      // init sockets
      this.$sockets.init();
      const self = this;
      if (this.authenticated && this.user !== null) {
        this.$sockets.subscribe(`/${this.user.privateTopic}`, 'private');
        this.$sockets.onMessage('private', (message) => {
          const actionType = message.side === 'sell' ? this.$t('App.sell') : this.$t('App.buy');
          // =========================================
          // Update all trade component dependencies
          // @TODO: refactor/optimize to avoid requests duplications
          // =========================================
          // this.$store.dispatch('market/orderBook', {
          //   marketType: message.quoteCurrency,
          //   currency: message.baseCurrency,
          //   actionType: message.side,
          //   init: false,
          // });
          // this.$store.dispatch('market/history', {
          //   marketType: message.quoteCurrency,
          //   currency: message.baseCurrency,
          // });
          const currency = message.baseCurrency;
          const marketType = message.quoteCurrency;
          this.$store.dispatch('market/refresh', { currency, marketType });
          // console.log(message)
          // console.log(message.status)

          if (message.status !== 'filled') {
            const params = {
              status: '%5B"open","partial",%20"scheduled","submitting","canceling"%5D',
              market: message.market,
              limit: 25,
              page: 1,
            };
            this.$store.dispatch('order/userOrders', params);
          }
          // =============================================

          if (
            !self.trade
            || (self.$store.getters['market/type'] === message.quoteCurrency
            && self.$store.getters['market/currency'] === message.baseCurrency)
          ) {
            // if (self.type === 'open') {
            if (['open', 'partial', 'scheduled', 'submitting', 'canceled', 'filled'].indexOf(message.status) > -1) {
              self.$store.dispatch('order/userOrdersNew', message);
            }
            if (message.status === 'canceled') {
              self.$store.dispatch('order/userOrdersRemove', message.orderUid);
              // this.$store.dispatch('market/refresh', {
              //   marketType,
              //   currency,
              // });
            }
            // }
            /* if (self.type === 'history') {
              if (msg.status === 'canceled' || msg.status === 'complete') {
                self.$store.dispatch('order/userOrdersNew', msg);
              }
            } */
          }
          /* eslint-disable */
          // if (msg.status === 'open') {
          //   self.$notify({
          //     type: 'success',
          //     text: `${actionType} order has been placed <br />
          //       ${this.toFixedNumber(msg.amount)} ${currency} @ ${this.toFixedNumber(msg.unitPrice)} ${marketType}`,
          //   });
          // }
          // if (msg.status === 'complete' || msg.status === 'partial') {
          // const cb = (trade) => { // get info from trade history event
          //   const text = `You ${action} ${this.toFixedNumber(trade.bidOrderReceivedAmount)} ${currency} for ${this.toFixedNumber(trade.askOrderReceivedAmount)} ${marketType}`;
          //   self.$notify({
          //     type: 'success',
          //     text,
          //   });
          // };
          // self.$store.dispatch('app/addTradeHistoryCb', { id: msg.orderUid, cb });
          // }
          /* eslint-enable */
          if (message.status === 'canceled') {
            self.$notify({
              type: 'success',
              text: this.$t('App.canceled_status_notification', {
                amount: this.toFixedNumber(message.amount),
                currency,
                unitPrice: this.toFixedNumber(message.unitPrice),
                actionType,
                marketType,
              }),
            });
          }
        });
      }

//      if (process.env.TRACK_SCRIPT === true) {
//        insertAndExecute('tracking_element', scriptsToInsert.sb());
//      }

      if (this.themeAnalyticsGlobal && this.themeAnalyticsGlobal !== 'null') {
        insertAndExecute('google_analytics_global', scriptsToInsert.gacc(this.themeAnalyticsGlobal));
      }

      if (this.themeAnalyticsClient && this.themeAnalyticsClient !== 'null') {
        insertAndExecute('google_analytics_client', scriptsToInsert.ga(this.themeAnalyticsClient));
      }

      if (this.themeHotjarClient && this.themeHotjarClient !== 'null') {
        insertAndExecute('hotjar_client', scriptsToInsert.hotjar(this.themeHotjarClient));
      }
    },
    computed: {
      authenticated() {
        return this.$store.getters['auth/authenticated'];
      },
      user() {
        return this.$store.getters['account/user'];
      },
      /**
      * Get project settings
      */
      appSetting() {
        return this.$store.getters['app/getAppSetting'];
      },
      themeMode() {
        return this.$store.getters['app/themeMode'];
      },
    },
    methods: {
      setTheme() {
        Vue.prototype.$themeSettings = this.appSetting.themeSettings;
        Vue.prototype.$setting = this.appSetting;
        this.setSettingToPartner(this.appSetting, this.themeMode);
      },
    },
    watch: {
      themeMode() {
        this.setTheme();
      },
      appSetting() {
        this.setTheme();
      },
    },
  };
</script>
