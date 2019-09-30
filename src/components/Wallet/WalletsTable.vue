<template>
  <div class="cce-wallets">
    <v-data-table
      :headers="tableHeaders"
      :items="walletsArray"
      :pagination.sync="pagination"
      :loading="false"
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
          <td class="">
            <div class="cce-wallets__currency">
              <currency-image :currency="props.item.currency" />
              <span>{{ props.item.name }}</span>
            </div>
          </td>
          <td class="cce-uppercase text-xs-right">
            <span v-decimals.include-zero-value="{ text: props.item.availableBalance, precision }"></span>
          </td>
          <td class="cce-uppercase text-xs-right">
            <span v-decimals.include-zero-value="{ text: props.item.lockedBalance, precision }"></span>
          </td>
          <td class="cce-uppercase text-xs-right">
            <span v-decimals.include-zero-value="{ text: props.item.total, precision }"></span>
          </td>
          <td class="text-xs-right">

            <v-btn
              class="cce-wallets__button px-3 cce-uppercase"
              depressed
              small
              @click="$emit('onClickDeposit', props.item)"
            >
              {{ $t('WalletsTable.deposit') }}
            </v-btn>

            <v-btn
              class="cce-wallets__button px-3 cce-uppercase mr-0"
              depressed
              small
              @click="e => onClickWithdraw(e, props.item)"
            >
              {{ $t('WalletsTable.withdraw') }}
            </v-btn>
          </td>
        </tr>
      </template>
      <div slot="no-data">
        <span class="cce-trade__no-data text-subheader-color" v-if="false">
          {{ $t('WalletsTable.no_data') }}
        </span>
      </div>
    </v-data-table>
  </div>
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

export default {
  name: 'wallets-table',
  components: {
    CurrencyImage,
  },
  props: {
    wallets: {
      type: Object,
    },
    currencies: {
      type: Array,
    },
    usdTotal: {
      type: [Number, String],
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
    };
  },
  computed: {
    /**
     * Returns table headers with calculated `usdTotal` value
     * @returns {Array<Object>}
     */
    tableHeaders() {
      return [
        {
          text: this.$t('WalletsTable.name'),
          align: 'left',
          value: 'name',
          sortable: true,
        },
        {
          text: this.$t('WalletsTable.available'),
          align: 'right',
          value: 'availableBalance',
          sortable: true,
        },
        {
          text: this.$t('WalletsTable.in_orders'),
          align: 'right',
          value: 'lockedBalance',
          sortable: true,
        },
        {
          text: this.$t('WalletsTable.total'),
          align: 'right',
          value: 'total',
          sortable: true,
        },
        {
          text: `
            <span class="cce-wallets__header--transparent">${this.$t('WalletsTable.estimated_value')}: </span>
            <span>$${(Number(this.usdTotal)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} USD</span>`,
          align: 'right',
          value: '',
          sortable: false,
        },
      ];
    },

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
        })
        .filter(wallet => Number(wallet.availableBalance) > 0);
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
     * Registers clicking on 'withdraw' button
     * @param {Object} e event object
     * @param {Object} item selected wallet
     */
    onClickWithdraw(e, item) {
      e.stopPropagation();
      this.$emit('onClickWithdraw', item);
    },

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
