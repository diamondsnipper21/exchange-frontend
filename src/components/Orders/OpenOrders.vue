<template>
  <v-layout column fill-height justify-space-between>
    <table-container>
      <v-data-table
        :headers="tableHeaders"
        :items="ordersWithPercentage"
        :pagination.sync="pagination"
        :loading="loading"
        item-key="orderUid"
        hide-actions
      >
      <div slot="no-data" class="cce-nodata-center">
        <span class="cce-trade__table-td cce-opacity">
          {{ $t('TradeUserOrders.have_no_open_orders') }} ({{$t('TradeUserOrders.selected')}} {{ timeframeToFilterBy }})
        </span>
      </div>
        <template slot="headers" slot-scope="props">
          <tr id="openOrdersTableHeaderRow">
            <th
              class="cce-trade__table-th"
              :class="{ 'text-xs-left': header.align === 'left', 'text-xs-right': header.align === 'right' }"
              :style="{ cursor: header.sortable ? 'pointer' : 'default' }"
              v-for="header in props.headers"
              :key="header.text"
              @click="changeSort(header.value)"
            >
              <span v-html="header.text"></span>
              <span v-if="header.sortable" class="pl-1">
                <i
                  class="fas fa-caret-down cce-table__sort-icon"
                  :class="{ 'cce-table__sort-icon--asc': !pagination.descending && pagination.sortBy === header.value }"
                  :style="{ opacity: pagination.sortBy === header.value ? 1 : 0.3 }"
                ></i>
              </span>
            </th>
          </tr>
        </template>
        <template slot="items" slot-scope="props">
          <tr class="cce-trade__table-tr">
            <table-cell subheader>
              <span class="cce-uppercase">
                {{ props.item.market.replace('-', '/') }}
              </span>
            </table-cell>
            <table-cell subheader>
              <span v-date="props.item.createdAt"></span>
            </table-cell>
            <table-cell subheader>
              <span class="cce-capitalize">{{ props.item.type }}</span>
            </table-cell>
            <table-cell subheader>
              <span
                class="cce-trade__user-orders-ask-bid_"
                :class="[ props.item.side === 'buy' ? 'cce-color__high' : 'cce-color__low' ]"
              >
                {{
                  props.item.side === 'buy'
                    ? $t('Orders.buy')
                    : $t('Orders.sell')
                }}
              </span>
            </table-cell>
            <table-cell subheader>
              <div class="group">
                <span v-fixed-number="props.item.unitPrice"></span>
                <span v-if="Number(props.item.stopPrice) > 0">| <span v-fixed-number="Number(props.item.stopPrice)"></span></span>
                <span class="cce-opacity cce-uppercase">{{ props.item.marketType }}</span>
              </div>
            </table-cell>
            <table-cell subheader>
              <div class="group">
                <span v-fixed-number="props.item.amount"></span>
                <span class="cce-opacity cce-uppercase">{{ props.item.currency }}</span>
              </div>
            </table-cell>
            <table-cell subheader>
              <div class="group">
                <span v-fixed-number="props.item.fee"></span>
                <span class="cce-opacity cce-uppercase">{{ props.item.currency }}</span>
              </div>
            </table-cell>
            <table-cell subheader>
              {{ props.item.filledPercent }}%
            </table-cell>
            <table-cell subheader>
              <span class="cce-capitalize">{{ props.item.status }}</span>
            </table-cell>
            <table-cell subheader>
              <span
                @click="cancelOrder(props.item.orderUid, props.item.currency, props.item.marketType)"
                :class="{ 'cce-color__warning': busy[props.item.orderUid] !== true }"
              >
                Cancel
              </span>
            </table-cell>
          </tr>
        </template>
      </v-data-table>
      <template slot="footer" v-if="isTotalVisible">
        <v-layout px-2 class="cce-orders-total">
          <v-layout column py-3 class="cce-orders-total__content">
            <table>
              <tr id="openOrdersTotalRow">
                <td class="cce-trade__table-td">
                  <div class="cce-opacity">{{ $t('Orders.total') }}:</div>
                </td>
                <td class="cce-trade__table-td"></td>
                <td class="cce-trade__table-td"></td>
                <td class="cce-trade__table-td">
                  <span class="cce-opacity">{{ orders.length }}</span>
                </td>
                <td class="cce-trade__table-td"></td>
                <td class="cce-trade__table-td">
                  <div class="group cce-opacity no-wrap">
                    <span v-fixed-number="totalSummary.totalAmount"></span>
                    <span class="cce-uppercase">{{ totalSummary.currency }}</span>
                  </div>
                </td>
                <td class="cce-trade__table-td"></td>
                <td class="cce-trade__table-td"></td>
                <td class="cce-trade__table-td"></td>
                <td class="cce-trade__table-td"></td>
              </tr>
            </table>
          </v-layout>
        </v-layout>
      </template>
      <template slot="footer" v-else>
        <v-layout px-2 class="cce-orders-total">
          <v-layout row py-3 class="cce-orders-total__content">
            <div class="cce-trade__table-td cce-opacity">{{ $t('Orders.total') }}:</div>
            <div class="cce-trade__table-td cce-opacity cce-orders-total__content__info">{{ $t('Orders.select_pair') }}</div>
          </v-layout>
        </v-layout>
      </template>
    </table-container>
  </v-layout>
</template>

<script>
import Order from '@/proxies/OrderProxy';
import handleErrorMessage from '@/utils/handleErrorMessage';
import TableContainer from '@/components/UI/TableContainer';
import TableCell from '@/components/UI/TableCell';
import tableMixin from '@/mixins/table';

export default {
  name: 'open-orders',
  components: {
    TableCell,
    TableContainer,
  },
  props: {
    orders: {
      type: Array,
      default: [],
    },
    isTotalVisible: {
      type: Boolean,
    },
    totalSummary: {
      type: Object,
    },
    timeframeToFilterBy: {
      type: String,
    },
  },
  mixins: [tableMixin],
  data() {
    return {
      pagination: {             // data-table settings
        sortBy: 'createdAt',    // initial sort column
        descending: true,       // sort order
        page: 1,                // table page
        rowsPerPage: -1,        // 'auto' mode shows as much rows as possible
      },
      busy: {},
      tableHeaders: [
        {
          text: this.$t('Orders.market'),
          align: 'left',
          value: 'market',
          sortable: true,
        },
        {
          text: this.$t('Orders.date'),
          align: 'left',
          value: 'createdAt',
          sortable: true,
        },
        {
          text: this.$t('Orders.type'),
          align: 'left',
          value: 'type',
          sortable: true,
        },
        {
          text: this.$t('Orders.buy_sell'),
          align: 'left',
          value: 'side',
          sortable: true,
        },
        {
          text: this.$t('Orders.price'),
          align: 'left',
          value: 'unitPrice',
          sortable: true,
        },
        {
          text: this.$t('Orders.amount'),
          align: 'left',
          value: 'amount',
          sortable: true,
        },
        {
          text: this.$t('Orders.fee'),
          align: 'left',
          value: 'fee',
          sortable: true,
        },
        {
          text: this.$t('Orders.filled'),
          align: 'left',
          value: 'filledPercent',
          sortable: true,
        },
        {
          text: this.$t('Orders.status'),
          align: 'left',
          value: 'status',
          sortable: true,
        },
        {
          text: this.$t('Orders.action'),
          align: 'left',
          value: 'operation',
          sortable: false,
        },
      ],
    };
  },
  mounted() {
    window.addEventListener('resize', this.calculateCellSizes);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.calculateCellSizes);
  },
  computed: {
    /**
     * Maps orders array and adds `filledPercent` prop
     * @returns {Array<Object>}
     */
    ordersWithPercentage() {
      return this.orders.map(order => ({
        ...order,
        filledPercent: this.filledPercentage(order),
      }));
    },

    /**
     * Calculates total received amount by filtered orders
     * @returns {Number}
     */
    totalReceivedAmount() {
      return this.orders.reduce((acc, cur) => Number(cur.receivedAmount) + acc, 0);
    },

    /**
     * Returns loading state from store
     * @returns {Boolean}
     */
    loading() {
      return this.$store.getters['order/loading']('userOrders');
    },
  },
  methods: {
    /**
     * Executes `calculateCellsWidthByHeaders` method from global mixin
     */
    calculateCellSizes() {
      this.calculateCellsWidthByHeaders('openOrdersTableHeaderRow', 'openOrdersTotalRow');
    },

    /**
     * Changes sort by given column name
     * @param {String} column column name
     */
    changeSort(column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending;
      } else {
        this.pagination.sortBy = column;
        this.pagination.descending = false;
      }
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
        this.page -= 1;
        this.getOrders();
      } catch (e) {
        this.$notify({
          type: 'warn',
          text: handleErrorMessage(e),
        });
        this.busy[orderUid] = false;
      }
    },

    /**
     * Calculates percentage for given order
     * @param {Object} order given order
     * @returns {Number}
     */
    filledPercentage(order) {
      return Math.round((order.filledAmount / order.amount) * 100);
    },
  },
  watch: {
    /**
     * Re-calculates cell widths
     * @param {Boolean} next next loading state
     * @param {Boolean} prev previous loading state
     */
    loading(next, prev) {
      if (next === false && prev === true && this.isTotalVisible && this.orders.length > 0) {
        this.$nextTick(() => {
          this.calculateCellSizes();
        });
      }
    },
  },
};
</script>
