<template>
  <!-- Trade Panel -->
  <div class="cce-trade__panel">
    <v-tabs class="cce-trade__tabs" v-model="active_tab">
      <v-tab
        key="openOrders"
        @click="changeType('open')"
      >
        {{ $t('TradeUserOrders.open_orders') }}
      </v-tab>
      <v-tab
        key="tradeHistory"
        @click="changeType('history')"
      >
        {{ $t('TradeUserOrders.trade_history') }}
      </v-tab>
      <v-spacer />
      <v-icon
        class="cce-trade__panel-hide"
        @click="toggleVisibility"
        v-if="!isMobile"
      >
        {{ isVisible ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}
      </v-icon>
    </v-tabs>
    <!-- Orders -->

    <div class="cce-trade__table cce-trade__datatable">
      <div class="cce-trade__table-content">
        <div class="cce-trade__table-body cce-trade__table-body--with-scrollbar">
          <v-data-table
            :headers="ordersHeaders"
            :items="orders"
            hide-actions
            :disable-initial-sort="true"
            :loading="loading"
            :pagination.sync="pagination"
            item-key="orderUid"
          >
            <template
              slot="items"
              slot-scope="props"
            >
              <td class="cce-trade__table-td nowrap text-xs-left hidden-sm-and-down">
                <span v-date="props.item.createdAt"></span>
              </td>
              <td class="cce-trade__table-td text-xs-left cce-capitalize">
                {{ props.item.type }}
              </td>
              <td class="cce-trade__table-td text-xs-left">
                <span
                  class="cce-trade__user-orders-ask-bid"
                  :class="[ props.item.side === 'buy' ? 'cce-color__high' : 'cce-color__low' ]"
                >
                  {{ props.item.side === 'buy' ? $t('TradeUserOrders.buy') : $t('TradeUserOrders.sell') }}
                </span>
              </td>
              <td class="cce-trade__table-td text-xs-left">
                <span v-fixed-number="props.item.unitPrice"></span>
                <span v-if="Number(props.item.stopPrice) !== 0">
                | <span v-fixed-number="Number(props.item.stopPrice)"></span>
                </span>
              </td>
              <td class="cce-trade__table-td text-xs-left hidden-xs-only">
                <span v-fixed-number="props.item.amount || 0"></span>
              </td>
              <td class="cce-trade__table-td text-xs-left hidden-sm-and-down">
                <span v-fixed-number="props.item.filledAmount || 0"></span>
              </td>              
              <td class="cce-trade__table-td text-xs-left">
                <span v-fixed-number="props.item.fee || 0"></span>
              </td>
              <td class="cce-trade__table-td text-xs-left text-xs-left cce-capitalize">
                {{ $t('TradeUserOrders.status_line', { status: props.item.status }) }}
              </td>
              <td
                class="cce-trade__table-td text-xs-right cce-color__warning cce-trade__user-orders-cancel"
                v-if="type === 'open'">
                <div
                  v-if="['open', 'partial', 'scheduled', 'submitting'].indexOf(props.item.status) > -1"
                  @click="cancelOrder(props.item.orderUid)">
                  <span :class="{ 'cce-color__warning': busy[props.item.orderUid] !== true }">
                    {{ $t('TradeUserOrders.cancel') }}
                  </span>
                </div>
              </td>
            </template>
            <div slot="no-data">
              <span class="cce-trade__no-data" v-if="!loading">
                {{ type === 'open'
                  ? $t('TradeUserOrders.have_no_open_orders')
                  : $t('TradeUserOrders.have_no_trade_history')
                }}
              </span>
            </div>
          </v-data-table>
          <infinite-loading
            v-if="!firstLoad"
            @infinite="infiniteHandler"
            force-use-infinite-wrapper="true"
            spinner="spiral"
          >
            <span slot="no-results">
            </span>
            <span slot="no-more">
            </span>
          </infinite-loading>
        </div>
      </div>
    </div>
    <!--<div class="cce-overlay__content">
      <a href class="cce-trade__link">Log in</a> or <a href class="cce-trade__link">Sign up</a> <br /> to access the trading options
    </div>-->
  </div>
</template>

<script>
  /* ============
   * User open orders / history
   * ============
   *
   * User orders component to list open orders / history for the trade section
   */

  import Order from '@/proxies/OrderProxy';
  import InfiniteLoading from 'vue-infinite-loading';
  import handleErrorMessage from '@/utils/handleErrorMessage';

  export default {
    name: 'trade-user-orders',
    data() {
      return {
        active_tab: '0',
        firstLoad: true,
        page: 1,
        busy: {},
        type: 'open',
        pagination: {             // data-table settings
          sortBy: 'createdAt',    // initial sort column
          descending: true,       // sort order
          page: 1,                // table page
          rowsPerPage: -1,        // 'auto' mode shows as much rows as possible
        },
      };
    },
    mounted() {
      if (this.authenticated) {
        this.$store.dispatch('app/checkUserOrdersVisibility');
      }
    },
    computed: {
      // table headers
      ordersHeaders() {
        const headers = [
          {
            text: this.$t('TradeUserOrders.date'),
            align: 'left',
            value: 'createdAt',
            sortable: false,
            class: 'hidden-sm-and-down',
          },
          {
            text: this.$t('TradeUserOrders.type'),
            align: 'left',
            value: 'type',
            sortable: false,
          },
          {
            text: this.$t('TradeUserOrders.buy_sell'),
            align: 'left',
            value: 'side',
            sortable: false,
          },
          {
            text: `${this.$t('TradeUserOrders.price')} ${this.marketType.toUpperCase()}`,
            align: 'left',
            value: 'unitPrice',
            sortable: false,
          },
          {
            text: `${this.$t('TradeUserOrders.amount')} ${this.currency.toUpperCase()}`,
            align: 'left',
            value: 'amount',
            sortable: false,
            class: 'hidden-xs-only',
          },
          {
            text: this.$t('TradeUserOrders.filled'),
            align: 'left',
            value: 'filledAmount',
            sortable: false,
            class: 'hidden-sm-and-down',
          },
          {
            text: this.$t('TradeUserOrders.fee'),
            align: 'left',
            value: 'fee',
            sortable: false,
            class: 'hidden-sm-and-down',
          },
          {
            text: this.$t('TradeUserOrders.status'),
            align: 'left',
            value: 'status',
            sortable: false,
          },
        ];
        if (this.type === 'open') {
          headers.push({
            text: this.$t('TradeUserOrders.action'),
            align: 'right',
            value: 'action',
            sortable: false,
          });
        }
        return headers;
      },
      orders() {
        return this.$store.getters['order/userOrders'] || [];
      },

      action() {
        return this.$store.getters['order/action'] || [];
      },

      loading() {
        return this.$store.getters['order/loading']('userOrders');
      },
      marketType() {
        return this.$store.getters['market/type'] || '';
      },
      currency() {
        return this.$store.getters['market/currency'] || '';
      },
      marketTypePrecision() {
        return this.marketType ? this.$store.getters['market/currencies'][this.marketType].precision : 0;
      },
      currencyPrecision() {
        return this.currency ? this.$store.getters['market/currencies'][this.currency].precision : 0;
      },
      marketReady() {
        return this.$store.getters['market/ready'];
      },
      authenticated() {
        return this.$store.getters['auth/authenticated'];
      },
      isMobile() {
        return this.$vuetify.breakpoint.smAndDown;
      },
      isVisible() {
        return this.$store.getters['app/tradeUserOrdersVisible'];
      },
      activeMarketInfo() {
        return this.$store.getters['market/info'];
      },
    },
    methods: {
      changeType(type) {
        this.active_tab = type === 'history' ? '1' : '0';
        this.page = 1;
        this.firstLoad = true;
        this.getOrders(type);
        this.restoreVisibility();
      },
      async getOrders(type, more) {
        more = more === undefined ? false : more;
        this.type = type;
        let res = null;
        if (this.authenticated) {
          // "submitting", "open", "partial", "complete", "canceled"
          // %5B"open","partial",%20"scheduled","canceled","submitting"%5D
          let status = '%5B"open","partial",%20"scheduled","submitting","canceling"%5D';
          if (this.type === 'history') {
            status = '%5B"filled","canceled"%5D';
          }

          const params = {
            // type,
            status,
            market: `${this.currency}-${this.marketType}`,
            limit: 25,
            page: this.page,
          };
          if (more) {
            res = await this.$store.dispatch('order/userOrdersAdd', params);
          } else {
            this.firstLoad = true;
            res = await this.$store.dispatch('order/userOrders', params);
            if (res.result.orders.length > 24) {
              this.firstLoad = false;
            }
            this.page += 1;
          }
        }
        return res;
      },

      /**
       * Makes a request to cancel selected order
       * @param {String} orderUid order unique ID
       */
      async cancelOrder(orderUid) {
        if (orderUid in this.busy) {
          return;
        }
        this.$set(this.busy, orderUid, true);
        try {
          await new Order().cancelOrder({ orderUid });
          this.busy[orderUid] = false;
          this.page = this.page > 1 ? this.page - 1 : this.page;
          this.getOrders(this.type);
        } catch (e) {
          this.$notify({
            type: 'warn',
            text: handleErrorMessage(e),
          });
          this.busy[orderUid] = false;
        }
      },
      toggleVisibility() {
        this.$store.dispatch('app/setUserOrdersVisibility', !this.isVisible);
      },
      restoreVisibility() {
        this.$store.dispatch('app/setUserOrdersVisibility', true);
      },
      infiniteHandler($state) {
        setTimeout(() => {
          this.getOrders(this.type, true)
            .then((res) => {
              if (res.result.orders.length > 0) {
                $state.loaded();
                this.page += 1;
              } else {
                $state.complete();
              }
            });
        }, 100);
      },
    },
    watch: {
      currency() {
        this.page = 1;
        this.active_tab = '0';
        this.firstLoad = true;
        this.getOrders(this.type);
      },

      action(newVal) {
        if (newVal === 'new') {
          this.active_tab = '0';
        }
      },
    },
    components: {
      InfiniteLoading,
    },
  };
</script>
