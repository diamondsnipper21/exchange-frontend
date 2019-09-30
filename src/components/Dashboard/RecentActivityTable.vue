<template>
  <table-container :title="$t('RecentActivityTable.recent_activity')">
    <v-data-table
      :headers="tableHeaders"
      :items="reverseOrders"
      hide-actions
      :disable-initial-sort="true"
      :loading="loading"
      item-key="orderUid"
    >
      <template
        slot="items"
        slot-scope="props"
      >
        <tr class="cce-trade__table-tr">
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
                  ? $t('RecentActivityTable.buy')
                  : $t('RecentActivityTable.sell')
              }}
            </span>
          </table-cell>
          <table-cell subheader>
            <span v-decimals="{ text: props.item.unitPrice }"></span>
            <span class="cce-uppercase"> {{ props.item.market.split('-')[1] }}</span>
          </table-cell>
          <table-cell subheader>
            <span v-decimals="{ text: props.item.amount }"></span>
            <span class="cce-uppercase"> {{ props.item.market.split('-')[0] }}</span>
          </table-cell>
          <table-cell subheader>
            <span class="cce-capitalize">{{ props.item.status }}</span>
          </table-cell>
        </tr>
      </template>
      <div slot="no-data">
        <span class="cce-trade__no-data text-subheader-color" v-if="!loading">
          {{ $t('RecentActivityTable.no_orders') }}
        </span>
      </div>
    </v-data-table>
  </table-container>
</template>

<script>
/**
 * ===============================
 * Recent Activity Table component
 * ===============================
 *
 * Renders trade activity data
 */
import TableContainer from '@/components/UI/TableContainer';

export default {
  name: 'recent-activity-table',
  components: {
    TableContainer,
  },
  data() {
    return {
      tableHeaders: [
        {
          text: this.$t('RecentActivityTable.date'),
          align: 'left',
          value: 'createdAt',
          sortable: false,
        },
        {
          text: this.$t('RecentActivityTable.type'),
          align: 'left',
          value: 'orderType',
          sortable: false,
        },
        {
          text: this.$t('RecentActivityTable.buy_sell'),
          align: 'left',
          value: 'actionType',
          sortable: false,
        },
        {
          text: this.$t('RecentActivityTable.price'),
          align: 'left',
          value: 'price',
          sortable: false,
        },
        {
          text: this.$t('RecentActivityTable.amount'),
          align: 'left',
          value: 'amount',
          sortable: false,
        },
        {
          text: this.$t('RecentActivityTable.status'),
          align: 'left',
          value: 'status',
          sortable: false,
        },
      ],
    };
  },
  mounted() {
    this.getOrders();
  },
  computed: {
    /**
     * Returns orders `loading` state
     * @returns {Boolean}
     */
    loading() {
      return this.$store.getters['order/loading']('userOrders');
    },

    /**
     * Returns orders from store
     * @returns {Array<Object>}
     */
    orders() {
      return this.$store.getters['order/userOrders'] || [];
    },
    reverseOrders() {
      return [...this.orders].reverse();
    },
  },
  methods: {
    /**
     * Gets trade activity data
     * @returns {Array} response
     */
    async getOrders() {
      const status = '%5B"open","partial","scheduled","submitting","canceling"%5D';
      const params = {
        status,
        limit: 50,
        page: 1,
      };
      const res = await this.$store.dispatch('order/userOrders', params);
      return res;
    },
  },
};
</script>
