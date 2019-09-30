<template>
  <div class="cce-admin__panel">
    <v-layout row class="cce-admin-coin-select">
      <v-flex sm1 class="pt-3">
        <span>Market:</span>
      </v-flex>
      <v-flex sm3 xs6>
        <v-coin-select
          :items="filterMarketsForSelecotor"
          class="cce-account__select-coin-bar-item--wide"
          @input="onSelectCurrency"
          :value="selectMarket"
        >
        </v-coin-select>
      </v-flex>
      <v-flex sm2 class="pl-2 pt-3">
        <button
          type="button"
          @click="addNewMarket"
          style="text-decoration:underline;"
        >Add new market</button>
      </v-flex>
    </v-layout>
    <v-layout column fill-height justify-space-between>
      <table-container>
        <v-data-table
          :headers="tableHeaders"
          :items="filterMarketsForDatatable"
          :pagination.sync="pagination"
          :loading="loading"
          item-key="currency"
          hide-actions
        >
          <div slot="no-data" class="cce-nodata-center">
            <span class="cce-trade__table-td cce-opacity">
              {{ $t('TradeUserOrders.have_no_trade_history') }}
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
                <currency-image :currency="props.item.currency" />
                <span class="cce-uppercase">
                  {{ props.item.currency }}
                </span>
              </table-cell>
              <table-cell subheader>
                <span class="cce-uppercase">{{props.item.status}}</span>
              </table-cell>
              <table-cell subheader>
                <div class="group">
                  <span>{{ props.item.liquidity }}</span>
                </div>
              </table-cell>
              <table-cell subheader>
                <div class="group">
                  <span v-fixed-number:2="props.item.minOrderAmount"></span>
                </div>
              </table-cell>
              <table-cell subheader>
                <div class="group">
                  <span v-fixed-number="props.item.maxOrderAmount"></span>
                </div>
              </table-cell>
              <table-cell subheader>
                <div class="group">
                  <span v-fixed-number:2="props.item.minOrderUnitPrice"></span>
                </div>
              </table-cell>
              <table-cell subheader>
                <div class="group">
                  <span v-fixed-number="props.item.maxOrderUnitPrice"></span>
                </div>
              </table-cell>
              <table-cell subheader>
                <div class="group">
                  <span v-fixed-number="props.item.makerFee"></span>
                </div>
              </table-cell>
              <table-cell subheader>
                <div class="group">
                  <span v-fixed-number="props.item.takerFee"></span>
                </div>
              </table-cell>
              <table-cell subheader>
                <div class="group">
                  <v-btn
                  class="cce-wallets__button px-3 cce-uppercase"
                  depressed
                  small
                  @click="onShowMarketModal(props.item)"
                >
                  {{ $t('AdminManageSetting.edit_btn') }}
                </v-btn>
                </div>
              </table-cell>
            </tr>
          </template>
        </v-data-table>
      </table-container>
    </v-layout>
    <widget-markets-modal
      v-if="isModalVisible"
      @onClose="isModalVisible = !isModalVisible"
      :marketItem="marketItem"
      :currencies="filterCurrencies"
      @onSelectCurrency="onSelectCurrency"
      :selectMarket="selectMarket"
    />
  </div>
</template>

<script>
  /* ============
   * Markets page
   * ============
   *
   * Markets page for the account admin portal section
   */
  import CurrencyImage from '@/components/UI/CurrencyImage';
  import VCoinSelect from '@/components/Settings/Markets/MarketsCoinSelect';
  import TableContainer from '@/components/UI/TableContainer';
  import TableCell from '@/components/UI/TableCell';
  import tableMixin from '@/mixins/table';
  import WidgetMarketsModal from '@/components/Settings/Markets/WidgetMarketsModal';

  export default {
    name: 'widget-markets',
    components: {
      CurrencyImage,
      VCoinSelect,
      TableCell,
      TableContainer,
      WidgetMarketsModal,
    },
    mixins: [tableMixin],
    mounted() {
      this.init();
    },
    data() {
      return {
        error: null,
        marketItem: null,
        selectMarket: '',
        loading: false,
        isModalVisible: false,
        pagination: {             // data-table settings
          sortBy: 'createdAt',    // initial sort column
          descending: true,       // sort order
          page: 1,                // table page
          rowsPerPage: -1,        // 'auto' mode shows as much rows as possible
        },
        tableHeaders: [
          {
            text: this.$t('AdminManageSetting.Markets.currency'),
            align: 'left',
            value: 'currency',
            sortable: true,
          },
          {
            text: this.$t('AdminManageSetting.Markets.status'),
            align: 'left',
            value: 'status',
            sortable: true,
          },
          {
            text: this.$t('AdminManageSetting.Markets.liquidity'),
            align: 'left',
            value: 'liquidity',
            sortable: true,
          },
          {
            text: this.$t('AdminManageSetting.Markets.min_order_amount'),
            align: 'left',
            value: 'minOrderAmount',
            sortable: true,
          },
          {
            text: this.$t('AdminManageSetting.Markets.max_order_amount'),
            align: 'left',
            value: 'maxOrderAmount',
            sortable: true,
          },
          {
            text: this.$t('AdminManageSetting.Markets.min_order_unit_price'),
            align: 'left',
            value: 'minOrderUnitPrice',
            sortable: true,
          },
          {
            text: this.$t('AdminManageSetting.Markets.max_order_unit_price'),
            align: 'left',
            value: 'maxOrderUnitPrice',
            sortable: true,
          },
          {
            text: this.$t('AdminManageSetting.Markets.maker_fee'),
            align: 'left',
            value: 'makerFee',
            sortable: true,
          },
          {
            text: this.$t('AdminManageSetting.Markets.taker_fee'),
            align: 'left',
            value: 'takerFee',
            sortable: true,
          },
          {
            text: '',
            align: 'right',
            value: '',
            sortable: false,
          },
        ],
      };
    },
    computed: {
      /**
       * Returns selected markets from store
       * @returns {Object}
       */
      markets() {
        return this.$store.getters['market/markets'] || {};
      },
      /**
       * Returns markets from store
       * @returns {Object}
       */
      marketSettings() {
        return this.$store.getters['market/settings_all'] || {};
      },
      /**
       * Returns currencies from store
       * @returns {Object}
       */
      currencies() {
        return this.$store.getters['market/currencies'] || {};
      },
      /**
       * Filter markets for dropdown
       * @returns {Object}
       */
      filterMarketsForSelecotor() {
        const arr = [];
        const that = this;

        Object.keys(this.marketSettings).forEach((key) => {
          const cur = Object.keys(that.currencies).find(item => item === key);
          arr.push(that.currencies[cur]);
        });
        return arr;
      },
      /**
       * Filter markets for datatable
       * @returns {Object}
       */
      filterMarketsForDatatable() {
        const arr = [];
        Object.keys(this.markets).forEach((key) => {
          const data = this.markets[key];

          Object.keys(data).forEach((key1) => {
            arr.push(data[key1]);
          });
        });
        return arr;
      },

      filterCurrencies() {
        const arr = [];
        Object.keys(this.currencies).forEach((key) => {
          arr.push(this.currencies[key]);
        });
        return arr;
      },
    },
    methods: {
      init() {
        this.selectMarket = this.filterMarketsForSelecotor[0].currency || 'BTC';
        this.onSelectCurrency(this.selectMarket);
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
       * Fetches market coins data from the API
       * @returns {Array} response
       */
      async onSelectCurrency(val) {
        if (val) {
          this.selectMarket = val;
        }

        let res = null;
        this.loading = true;

        const params = {
          market: this.selectMarket,
        };

        res = await this.$store.dispatch('market/getMarkets', params);
        this.loading = false;
        return res;
      },

      addNewMarket() {
        this.isModalVisible = true;
        this.marketItem = null;
      },

      onShowMarketModal(item) {
        this.marketItem = item;
        this.isModalVisible = true;
      },
    },
  };
</script>
