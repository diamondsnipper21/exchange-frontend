<template>
  <v-menu
    lazy
    offset-y
    :full-width="true"
    :open-on-hover="!useCustomActivator"
    :open-on-click="useCustomActivator"
    :left="true"
    :close-on-content-click="close"
    class="cce-trade__market-menu"
    content-class="cce-trade__market-container"
    v-if="(marketType && currency) || useCustomActivator"
  >
    <div slot="activator" v-if="useCustomActivator" @click="hover">
        <slot name="custom" ></slot>
    </div>
    <v-btn
      v-if="!useCustomActivator"
      slot="activator"
      flat
      class="cce-trade__market-btn"
      @mouseover="hover"
    >
      {{ currency }}/{{ marketType }}
      <v-icon dark>arrow_drop_down</v-icon>
    </v-btn>
    <div class="cce-trade__market-content" @click="check">
      <v-tabs
        class="cce-trade__tabs cce-trade__tabs--line cce-trade__market-tabs"
        :v-model="active"
        :value="active"
      >
        <v-tab
          @click="changeMarket(key, index)"
          v-for="(item, key, index) in settings"
          :key="index"
        >
          <span class="cce-uppercase">{{ key }}</span>
        </v-tab>
        <v-spacer />
        <v-text-field
          class="cce-trade__market-search"
          append-icon="search"
          :label="$t('TradeMarket.search_input_label')"
          single-line
          hide-details
          v-model="search"
          solo
        />
        <v-tab-item
          v-for="(item, key, index) in settings"
          :key="index"
        >
          <div class="cce-trade__table cce-trade__datatable cce-trade__table--fixed">
            <v-data-table
              :headers="headers"
              :items="processFavorites(list[key])"
              :search="search"
              hide-actions
              v-bind:pagination.sync="pagination"
              :loading="loadingList"
              :custom-filter="filter"
            >
              <template
                slot="headerCell"
                slot-scope="{ header }"
              >
                {{header.text}}
                <div v-if="authenticated && header.value=='favorite'">
                  <v-btn  icon @click="toggleFavorites()">
                    <v-icon v-if="showFavorites" class="font-awesome-4">fa-star</v-icon>
                    <v-icon v-if="!showFavorites" class="font-awesome-4">fa-star-o</v-icon>
                  </v-btn>
                </div>
              </template>
              <template
                slot="items"
                slot-scope="props"
              >
                <tr class="cce-trade__table-hover">
                  <td @click="changeCurrency(key, props.item.baseCurrency)" class="cce-trade__table-td text-xs-left m-close">
                    <span class="cce-trade__market-currency">
                      <currency-image :currency="props.item.baseCurrency" />
                      <span class="cce-uppercase">{{ props.item.baseCurrency }}</span>
                    </span>
                  </td>
                  <td @click="changeCurrency(key, props.item.baseCurrency)" class="cce-trade__table-td text-xs-left m-close">
                    <span v-decimals="props.item.lastPrice"
                    ></span>
                  </td>
                  <td @click="changeCurrency(key, props.item.baseCurrency)" class="cce-trade__table-td text-xs-left m-close">
                    <span v-decimals="props.item.quoteVolume"></span>
                  </td>
                  <td @click="changeCurrency(key, props.item.baseCurrency)"
                    class="cce-trade__table-td text-xs-left m-close"
                    :class="{
                      'cce-color__low' : Number(props.item.growthDiff) < 0,
                      'cce-color__high' : Number(props.item.growthDiff) > 0,
                    }"
                  >
                    {{ addSign(Number(props.item.growthRatio)) }}
                  </td>
                  <td class="cce-trade__table-td color__high text-xs-left m-close datatable__action">
                    <v-btn v-if="authenticated" icon @click="toggleFavorite({currency: props.item.baseCurrency, marketType: key, isFavorite: props.item.isFavorite})">
                      <v-icon v-if="props.item.isFavorite" class="font-awesome-4">fa-star</v-icon>
                      <v-icon v-if="!props.item.isFavorite" class="font-awesome-4">fa-star-o</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </template>
              <div slot="no-results">
                {{ $t('TradeMarket.no_results') }}
              </div>
              <div slot="no-data">
               <!-- <span v-if="!loadingList">No data</span> -->
              </div>
            </v-data-table>
          </div>
        </v-tab-item>
      </v-tabs>
    </div>
  </v-menu>
</template>

<script>
  /* ============
   * Trade Market Box
   * ============
   *
   * Trade market box component for the trade section navigation bar
   * Lists available markets / coins
   */
  import CurrencyImage from '@/components/UI/CurrencyImage';
  import compare from '@/utils/compare';
  import convertToNumbers from '@/utils/convertToNumbers';

  export default {
    name: 'trade-market',
    components: {
      CurrencyImage,
    },
    data() {
      return {
        precision: 8,
        active: -1,
        close: true,
        search: '',
        tm: null,
        // table headers
        headers: [
          {
            text: this.$t('TradeMarket.coin'),
            align: 'left',
            value: 'baseCurrency',
            sortable: true,
          },
          {
            text: this.$t('TradeMarket.last_price'),
            align: 'left',
            value: 'lastPrice',
            sortable: true,
          },
          {
            text: this.$t('TradeMarket.volume_24'),
            align: 'left',
            value: 'totalVolume',
            sortable: true,
          },
          {
            text: this.$t('TradeMarket.change'),
            align: 'left',
            value: 'growthRatio',
            sortable: true,
          },
          {
            text: '',
            align: 'left',
            value: 'favorite',
            sortable: false,
          },
        ],
        pagination: {
          sortBy: 'totalVolume',
          descending: true,
          rowsPerPage: -1,
        },
        showFavorites: false,
      };
    },
    props: {
      useCustomActivator: Boolean,
    },
    computed: {
      authenticated() {
        return this.$store.getters['auth/authenticated'];
      },
      settings() {
        return this.$store.getters['market/settings'] || {};
      },
      marketType() {
        return this.$store.getters['market/type'] || '';
      },
      currency() {
        return this.$store.getters['market/currency'] || '';
      },
      currencies() {
        return this.$store.getters['market/currencies'] || [];
      },
      list() {
        return this.$store.getters['market/list'] || [];
      },
      stats() {
        return this.$store.getters['market/info'];
      },
      loadingList() {
        return this.$store.getters['market/loadingList'] || false;
      },
      favoritePairs() {
        return this.$store.getters['market/favoritePairs'] || [];
      },
      defaultMarketPair() {
        return this.$store.getters['market/defaultMarketPair'];
      },
    },
    methods: {
      toggleFavorites() {
        this.showFavorites = !this.showFavorites;
      },
      // update user favorites list
      async toggleFavorite(item) {
        const pair = `${item.currency}-${item.marketType}`.toUpperCase();
        let res = this.favoritePairs;
        if (item.isFavorite) {
          res = res.filter(e => e !== pair);
        } else {
          res = [...res, pair];
        }
        await this.$store.dispatch('market/updateFavoritePairs', { favPairs: res });
      },

      // change table sorting state
      changeSort(value) {
        if (this.pagination.sortBy === value) {
          this.pagination.descending = !this.pagination.descending;
        } else {
          this.pagination.sortBy = value;
          this.pagination.descending = false;
        }
      },
      // switch markets
      changeMarket(type, index) {
        localStorage.setItem('tabIndex', index);
        localStorage.setItem('tabType', type);
        this.$store.dispatch('market/list', type);
      },
      hover() {
        this.search = '';
        setTimeout(() => {
          const active = localStorage.getItem('tabIndex');
          let type = localStorage.getItem('tabType');
          if (active !== null) {
            this.active = active.toString();
          } else {
            this.active = '0';
          }
          if (type === null) {
            this.active = '0';
            const defaultMarketPair = this.defaultMarketPair.split('-');
            // type = 'btc';
            type = defaultMarketPair[1];
            if (this.settings) {
              const keys = Object.keys(this.settings);
              if (keys[this.active]) {
                type = keys[this.active];
              }
            }
          }
          if (this.tm === null) {
            this.$store.dispatch('market/list', type);
          }
          this.tm = setTimeout(() => {
            this.tm = null;
          }, 3000);
        }, 100);
      },

      /**
       * Adds `isFavorite` prop if the pair is favorite
       * @param {Array<Object>} list list of currencies for given market
       * @returns {Array<Object>} processed list
       */
      processFavorites(list) {
        if (!list) return [];
        return list
          .map(item => ({
            ...convertToNumbers(item),
            isFavorite: this.favoritePairs.includes(`${item.baseCurrency}-${item.quoteCurrency}`),
          }))
          .sort((a, b) => compare(a, b, 'quoteVolume'));
      },

      /**
       * Checks if market menu should be closed
       * @param {Object} e event object
       */
      check(e) {
        const c = e.srcElement.classList;
        if (!c.contains('m-close')) e.stopPropagation();
      },

      /**
       * Changes market
       * @param {String} marketType selected market
       * @param {String} currency selected currency
       */
      changeCurrency(marketType, currency) {
        const market = `${currency}-${marketType}`;
        this.$router.push({
          name: 'trade.index',
          params: {
            market,
          },
        });
      },

      /**
       * Filters currencies using search input
       * @param {Array<Object>} items market currencies
       * @param {String} search entered text value
       * @returns {Array<Object>} filtered result
       */
      filter(items, search) {
        let res = items;
        // filter by favorites
        if (this.showFavorites) {
          res = res.filter(item => item.isFavorite);
        }
        // transform search value
        search = search.toString().toUpperCase();
        if (search.trim() !== '') {
          res = res.filter(item => item.baseCurrency.includes(search));
        }
        return res;
      },
    },
    watch: {
      stats(newStats) {
        if (this.list && this.list[this.marketType]) {
          // Update current market data by stats data
          this.list[this.marketType] = this.list[this.marketType].map((stat) => {
            if (stat.baseCurrency === newStats.baseCurrency) {
              return {
                ...stat,
                totalVolume: newStats.totalVolume,
                lastPrice: newStats.lastPrice,
                growthRatio: newStats.growthRatio,
              };
            }
            return stat;
          });
        }
      },
    },
  };
</script>
