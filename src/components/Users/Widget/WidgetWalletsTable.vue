<template>
  <v-layout column fill-height justify-space-between>
    <table-container class="cce-admin-payment-widget">
      <v-data-table
        :headers="tableHeaders"
        :items="walletsArray"
        :pagination.sync="pagination"
        :loading="loading"
        item-key="currency" 
        hide-actions
      >
        <template slot="headers" slot-scope="props">
          <tr class="cce-wallets__header">
            <th
              class="cce-wallets__header__text"
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
          <tr class="cce-wallets__spacer"></tr>
          <tr class="cce-wallets__table-row" @click="$emit('onClickDeposit', props.item)">
            <table-cell subheader>
              <div class="cce-wallets__currency">
                <currency-image :currency="props.item.currency" />
                <span>{{ props.item.name }}</span>
              </div>
            </table-cell>
          <table-cell subheader>
              <span v-decimals.include-zero-value="{ text: props.item.availableBalance, precision }"></span>
            </table-cell>
          <table-cell subheader>
              <span v-decimals.include-zero-value="{ text: props.item.lockedBalance, precision }"></span>
            </table-cell>
          <table-cell subheader>
              <span>{{ props.item.address }}</span>
            </table-cell>
          <table-cell subheader>
              <span v-date="props.item.createdAt"></span>
            </table-cell>
          </tr>
        </template>
        <div slot="no-data" class="cce-nodata-center">
          <span class="cce-trade__table-td cce-opacity">
            {{ $t('UserWalletWidget.have_no_wallets') }}
          </span>
        </div>
      </v-data-table>
   </table-container>
  </v-layout>
</template>

<script>
/**
 * =======================
 * Wallets Table component
 * =======================
 *
 * Renders all wallets with non-zero balance
 */
import CurrencyImage from '@/components/UI/CurrencyImage';
import TableContainer from '@/components/UI/TableContainer';
import TableCell from '@/components/UI/TableCell';
import tableMixin from '@/mixins/table';

export default {
  name: 'widget-wallets-table',
  components: {
    CurrencyImage,
    TableCell,
    TableContainer,
  },
  mixins: [tableMixin],
  props: {
    wallets: {
      type: Object,
    },
    currencies: {
      type: Array,
    },
    loading: {
      type: Boolean,
    },
  },
  data() {
    return {
      precision: 8,
      pagination: {                     // data-table settings
        sortBy: 'availableBalance',     // initial sort column
        descending: true,               // sort order
        page: 1,                        // table page
        rowsPerPage: -1,                // 'auto' mode shows as much rows as possible
      },
      tableHeaders: [
        {
          text: this.$t('WalletsTable.currency'),
          align: 'left',
          value: 'name',
          sortable: true,
        },
        {
          text: this.$t('WalletsTable.available'),
          align: 'left',
          value: 'availableBalance',
          sortable: true,
        },
        {
          text: this.$t('WalletsTable.in_orders'),
          align: 'left',
          value: 'lockedBalance',
          sortable: true,
        },
        {
          text: this.$t('WalletsTable.address'),
          align: 'left',
          value: 'address',
          sortable: true,
        },
        {
          text: this.$t('WalletsTable.createdAt'),
          align: 'left',
          value: 'createdAt',
          sortable: true,
        },
      ],
    };
  },
  computed: {
    /**
     * Returs mapped wallets with additional props
     * @returns {Array<Object>}
     */
    walletsArray() {
      return Object.keys(this.wallets)
        .map((key) => {
          const wallet = this.wallets[key];
          return {
            ...wallet,
            name: this.currenciesObject[wallet.currency].name,
            total: Number(wallet.availableBalance) + Number(wallet.lockedBalance),
          };
        });
    },

    /**
     * Returns transformer currencies array as an object
     * @returns {Object}
     */
    currenciesObject() {
      const currencies = {};
      this.currencies.forEach((item) => {
        currencies[item.currency] = item;
      });

      return currencies;
    },
  },
  methods: {
    /**
     * Changes sort column by given column name
     * @param {String} column name of selected column
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

<style>
</style>
