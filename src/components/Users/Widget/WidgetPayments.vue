<template>
  <v-layout column fill-height justify-space-between>
    <table-container class="cce-admin-payment-widget">
      <v-data-table
        :headers="tableHeaders"
        :items="history"
        item-key="createdAt"
        :disable-initial-sort="true"
        hide-actions
        :loading="loading"
        :pagination.sync="pagination"
      >
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
        <template
          slot="items"
          slot-scope="props"
        >
          <tr class="cce-trade__table-tr">
            <table-cell subheader>
              <span v-date="props.item.createdAt"></span>
            </table-cell>
            <table-cell subheader>
              <span v-fixed-number="props.item.amount"></span>
            </table-cell>
            <table-cell subheader>
              <span class="cce-uppercase">{{ props.item.currency }}</span>
            </table-cell>
            <table-cell subheader>
              <span class="cce-uppercase">{{ props.item.fee }}</span>
            </table-cell>
            <table-cell subheader>
              <span class="cce-uppercase">{{ props.item.balance }}</span>
            </table-cell>
            <table-cell subheader>
            <span
              class="cce-wallet-history__table-td text-xs-left"
              v-html="props.item.paymentType === 'DB'
                ? $t('WalletHistory.sent')
                : $t('WalletHistory.received')
              "
            ></span>
              <a
                v-if="props.item.txHash"
                v-txhash-link.with-icon="{ explorerLink: props.item.explorerLink, txHash: props.item.txHash, currency: props.item.currency.toLowerCase(), breakHash: true }"
                :style="{ color: 'transparent' }"
              >
                <v-icon :style="{ fontSize: '10px', paddingLeft: '5px' }">fas fa-external-link-alt</v-icon>
              </a>
            </table-cell>
            <table-cell subheader>
              <span class="cce-uppercase">{{ props.item.status }}</span>
            </table-cell>
          </tr>
        </template>
        <div slot="no-data" class="cce-nodata-center">
          <span class="cce-trade__table-td cce-opacity">
            {{ $t('UserPaymentWidget.have_no_payments') }} ({{$t('TradeUserOrders.selected')}} {{ timeframeToFilterBy }})
          </span>
      </div>
      </v-data-table>
    </table-container>
  </v-layout>
</template>

<script>
  /* ============
   * User Payments page
   * ============
   *
   * User Payments page for the account admin portal section
   */
  import TableContainer from '@/components/UI/TableContainer';
  import TableCell from '@/components/UI/TableCell';
  import tableMixin from '@/mixins/table';

  export default {
    name: 'widget-payments',
    components: {
      TableCell,
      TableContainer,
    },
    props: {
      history: {
        type: Array,
        default: [],
      },
      timeframeToFilterBy: {
        type: String,
      },
      loading: {
        type: Boolean,
      },
    },
    mounted() {
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
            text: this.$t('UserPaymentWidget.date'),
            align: 'left',
            value: 'createdAt',
            sortable: true,
          },
          {
            text: this.$t('UserPaymentWidget.amount'),
            align: 'left',
            value: 'amount',
            sortable: true,
          },
          {
            text: this.$t('UserPaymentWidget.currency'),
            align: 'left',
            value: 'currency',
            sortable: true,
          },
          {
            text: this.$t('UserPaymentWidget.fee'),
            align: 'left',
            value: 'fee',
            sortable: true,
          },
          {
            text: this.$t('UserPaymentWidget.balance'),
            align: 'left',
            value: 'balance',
            sortable: true,
          },
          {
            text: this.$t('UserPaymentWidget.paymentType'),
            align: 'right',
            value: 'paymentType',
            sortable: true,
          },
          {
            text: this.$t('UserPaymentWidget.status'),
            align: 'left',
            value: 'status',
            sortable: true,
          },
        ],
      };
    },
    methods: {
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
    },
  };
</script>
