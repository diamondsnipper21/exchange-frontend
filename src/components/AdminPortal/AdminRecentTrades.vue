<template>
  <table-container :title="$t('AdminRecentTrades.recent_trades')">
    <v-data-table
      :headers="tableHeaders"
      :items="recentTrades"
      hide-actions
      :disable-initial-sort="true"
      :loading="!recentTradesReady"
      item-key="orderUid"
    >
      <template
        slot="items"
        slot-scope="props"
      >
        <tr>
          <table-cell subheader>
            <span v-date.short="props.item.createdAt"></span>
          </table-cell>
          <table-cell subheader>
            <span class="cce-capitalize">{{ props.item.type }}</span>
          </table-cell>
          <table-cell>
            <span
              class="cce-trade__user-orders-ask-bid"
              :class="[ props.item.side === 'buy' ? 'cce-color__high' : 'cce-color__low' ]"
            >
              {{
                  props.item.side === 'buy'
                    ? $t('AdminRecentTrades.buy')
                    : $t('AdminRecentTrades.sell')
              }}
            </span>
          </table-cell>
          <table-cell subheader>
            <span v-decimals.include-zero-value="{ text: props.item.unitPrice }"></span>
            <span class="cce-uppercase"> {{ props.item.quoteCurrency }}</span>
          </table-cell>
          <table-cell subheader>
            <span v-decimals.include-zero-value="{ text: props.item.amount }"></span>
            <span class="cce-uppercase"> {{ props.item.baseCurrency }}</span>
          </table-cell>
          <table-cell subheader>
            <span v-decimals.include-zero-value="{ text: props.item.fee, precision: 6 }"></span>
            <span class="cce-uppercase"> {{ props.item.feeCurrency }}</span>
          </table-cell>
          <table-cell subheader>
            <span class="cce-capitalize">{{ props.item.status }}</span>
          </table-cell>
        </tr>
      </template>
      <div slot="no-data">
        <span class="cce-trade__no-data text-subheader-color" v-if="!recentTradesReady">
          {{ $t('AdminRecentTrades.no_orders') }}
        </span>
      </div>
    </v-data-table>
  </table-container>
</template>

<script>
/* ============
 * Admin recent trades component
 * ============
 *
 * Renders recent trades for admin portal overview
 */
import TableContainer from '@/components/UI/TableContainer';

export default {
  name: 'admin-recent-trades',
  components: {
    TableContainer,
  },
  data() {
    return {
      tableHeaders: [
        {
          text: this.$t('AdminRecentTrades.date'),
          align: 'left',
          value: 'createdAt',
          sortable: false,
          class: 'hidden-sm-and-down',
        },
        {
          text: this.$t('AdminRecentTrades.type'),
          align: 'left',
          value: 'type',
          sortable: false,
        },
        {
          text: this.$t('AdminRecentTrades.buy_sell'),
          align: 'left',
          value: 'side',
          sortable: false,
        },
        {
          text: this.$t('RecentActivityTable.price'),
          align: 'left',
          value: 'price',
          sortable: false,
        },
        {
          text: this.$t('AdminRecentTrades.amount'),
          align: 'left',
          value: 'amount',
          sortable: false,
          class: 'hidden-xs-only',
        },
        {
          text: this.$t('AdminRecentTrades.commision'),
          align: 'left',
          value: 'fee',
          sortable: false,
        },
        {
          text: this.$t('AdminRecentTrades.status'),
          align: 'left',
          value: 'status',
          sortable: false,
        },
      ],
    };
  },
  computed: {
    /**
     * Returns if data is loading
     * @returns {Boolean}
     */
    recentTradesReady() {
      return !(this.$store.getters['admin/recentTrades'] == null);
    },

    /**
     * Returns recent trades data from store
     * @returns {Array}
     */
    recentTrades() {
      return this.$store.getters['admin/recentTrades'] || [];
    },
  },
};
</script>
