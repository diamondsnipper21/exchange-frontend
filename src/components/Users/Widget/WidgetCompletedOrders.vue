<template>
  <v-layout column fill-height justify-space-between>
    <table-container>
      <v-data-table
        :headers="tableHeaders"
        :items="filteredOrders"
        :pagination.sync="pagination"
        :loading="loading"
        item-key="orderUid"
        hide-actions
      >
      <div slot="no-data" class="cce-nodata-center">
        <span class="cce-trade__table-td cce-opacity">
          {{ $t('UserTradeHistoryWidget.have_no_trade_history') }} ({{$t('TradeUserOrders.selected')}} {{ timeframeToFilterBy }})
        </span>
      </div>
        <template slot="headers" slot-scope="props">
          <tr id="historyTableHeaderRow">
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
              <span
                class="cce-trade__user-orders-ask-bid_"
                :class="[ props.item.side === 'buy' ? 'cce-color__high' : 'cce-color__low' ]"
              >
                {{
                  props.item.side === 'buy'
                    ? $t('History.buy')
                    : $t('History.sell')
                }}
              </span>
            </table-cell>
            <table-cell subheader>
              <div class="group">
                <span v-fixed-number="props.item.unitPrice"></span>
                <span v-if="Number(props.item.stopPrice)">
                | <span v-fixed-number="Number(props.item.stopPrice)"></span>
                </span>
                <span class="cce-opacity cce-uppercase">{{ props.item.unitPriceCurrency }}</span>
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
                <span v-fixed-number="props.item.filledAmount"></span>
                <span class="cce-opacity cce-uppercase">{{ props.item.filledAmountCurrency }}</span>
              </div>
            </table-cell>
            <table-cell subheader>
              <div class="group">
                <span v-fixed-number="calculateFilledUSDC(props.item)"></span>
              </div>
            </table-cell>
            <table-cell subheader>
              <div class="group">
                <span v-fixed-number="calculateFeeUSDC(props.item)"></span>
              </div>
            </table-cell>
            <table-cell subheader>
              <div class="group">
                <span class="cce-opacity cce-capitalize">{{ props.item.status }}</span>
              </div>
            </table-cell>
          </tr>
        </template>
      </v-data-table>
      <template slot="footer">
        <v-layout px-2 class="cce-orders-total">
          <v-layout column py-3 class="cce-orders-total__content">
            <table>
              <tr id="historyTotalRow">
                <td class="cce-trade__table-td">
                  <div class="cce-opacity">{{ $t('Orders.total') }}:</div>
                </td>
                <td class="cce-trade__table-td"></td>
                <td class="cce-trade__table-td">
                  <span class="cce-opacity">{{ orders.length }}</span>
                </td>
                <td class="cce-trade__table-td"></td>
                <td class="cce-trade__table-td"></td>
                <td class="cce-trade__table-td"></td>
                <td class="cce-trade__table-td">
                  <span class="cce-opacity" v-fixed-number="getTotalAmount().filledSum"></span>
                </td>
                <td class="cce-trade__table-td">
                  <span class="cce-opacity" v-fixed-number="getTotalAmount().feeSum"></span>
                </td>
                <td class="cce-trade__table-td"></td>
              </tr>
            </table>
          </v-layout>
        </v-layout>
      </template>
    </table-container>
  </v-layout>
</template>

<script>
import TableContainer from '@/components/UI/TableContainer';
import TableCell from '@/components/UI/TableCell';
import tableMixin from '@/mixins/table';
import Big from 'big.js';

export default {
  name: 'widget-completed-orders',
  components: {
    TableCell,
    TableContainer,
  },
  props: {
    orders: {
      type: Array,
      default: [],
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
      tableHeaders: [
        {
          text: this.$t('History.market'),
          align: 'left',
          value: 'market',
          sortable: true,
        },
        {
          text: this.$t('History.date'),
          align: 'left',
          value: 'createdAt',
          sortable: true,
        },
        {
          text: this.$t('History.buy_sell'),
          align: 'left',
          value: 'side',
          sortable: true,
        },
        {
          text: this.$t('History.filled_price'),
          align: 'left',
          value: 'unitPrice',
          sortable: true,
        },
        {
          text: this.$t('History.amount'),
          align: 'left',
          value: 'amount',
          sortable: true,
        },
        {
          text: this.$t('History.filled'),
          align: 'left',
          value: 'filled',
          sortable: true,
        },
        {
          text: this.$t('History.filled_usdc'),
          align: 'left',
          value: 'filled',
          sortable: true,
        },
        {
          text: this.$t('History.fee_usdc'),
          align: 'left',
          value: 'fee',
          sortable: true,
        },
        {
          text: this.$t('History.status'),
          align: 'left',
          value: 'status',
          sortable: true,
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
     * Filters partially filled but canceled orders
     * @returns {Array<Object>}
     */
    filteredOrders() {
      return this.orders.filter((order) => {
        if (order.status !== 'canceled') return true;
        else if (order.status === 'canceled' && order.filledAmount > 0) return true;
        return false;
      });
    },

    /**
     * Returns loading state from store
     * @returns {Boolean}
     */
    loading() {
      return this.$store.getters['order/loading']('userFindOrders');
    },
  },
  methods: {
    /**
     * Executes `calculateCellsWidthByHeaders` method using table mixin
     */
    calculateCellSizes() {
      this.calculateCellsWidthByHeaders('historyTableHeaderRow', 'historyTotalRow');
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
     * Calculate Filled USDC
     */
    calculateFilledUSDC(item) {
      return new Big(item.filledAmount)
        .times(new Big(item.rateUSDC))
        .times(new Big(item.unitPrice));
    },

    /**
     * Calculate Fee USDC
     */
    calculateFeeUSDC(item) {
      if (item.side === 'buy') {
        return new Big(item.fee).times(new Big(item.rateUSDC)).times(new Big(item.unitPrice));
      }
      return new Big(item.fee).times(new Big(item.rateUSDC));
    },

    /**
     * Calculate Total Amount
     */
    getTotalAmount() {
      let filledSum = 0;
      let feeSum = 0;

      this.orders.forEach((item) => {
        filledSum = new Big(filledSum).plus(new Big(this.calculateFilledUSDC(item)));
        feeSum = new Big(feeSum).plus(new Big(this.calculateFeeUSDC(item)));
      });
      return {
        filledSum,
        feeSum,
      };
    },
  },
  watch: {
    /**
     * Re-calculates cell widths
     * @param {Boolean} next next loading state
     * @param {Boolean} prev previous loading state
     */
    loading(next, prev) {
      if (next === false && prev === true && this.orders.length > 0) {
        this.$nextTick(() => {
          this.calculateCellSizes();
        });
      }
    },
  },
};
</script>
