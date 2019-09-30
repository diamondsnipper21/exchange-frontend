<template>
  <div class="cce-admin-modal">
    <div @click="$emit('onClose')" class="cce-admin-modal__backdrop"></div>
    <div class="cce-admin-modal__container" :style="{'width': !isMobile ? '700px': 'auto'}">
      <div class="cce-admin-modal-title">
        Add New Market Pair
      </div>
      <v-layout column class="cce-admin-modal__content cce-admin_panel-form-row" px-4 py-4>
        <v-progress-linear indeterminate class="cce-admin_panel-progress" height="1" v-if="loading"/>
        <v-layout align-center row class="pb-4">
            <v-flex d-flex xs4 class="text-xs-right pr-1">
              <span>{{ $t('AdminManageSetting.Markets.quote_currency') }}:</span>
            </v-flex>
            <v-flex d-flex xs8>
              <v-layout row align-center
                class="cce-account__select-coin-selected"
                v-if="marketItem"
              >
                <currency-image :currency="marketItem.quoteCurrency" />
                <span class="cce-account__select-coin-abbr">
                  {{ marketItem.quoteCurrency }}
                </span>
                &nbsp;
                <span class="cce-account__select-coin-name">
                  {{ marketItem.name }}
                </span>
              </v-layout>
              <v-coin-select
                v-if="!marketItem"
                :items="quoteCurrencies"
                class="cce-account__select-coin-bar-item--wide"
                @input="onSelectQuoteCurrency"
                :value="quoteCurrency"
              >
              </v-coin-select>
            </v-flex>
        </v-layout>
        <v-layout align-center row class="pb-4">
            <v-flex d-flex xs4 class="text-xs-right pr-1">
              <span>{{ $t('AdminManageSetting.Markets.base_currency') }}:</span>
            </v-flex>
            <v-flex d-flex xs8>
              <v-layout row align-center
                class="cce-account__select-coin-selected"
                v-if="marketItem"
              >
                <currency-image :currency="marketItem.baseCurrency" />
                <span class="cce-account__select-coin-abbr">
                  {{ marketItem.baseCurrency }}
                </span>
                &nbsp;
                <span class="cce-account__select-coin-name">
                  {{ marketItem.name }}
                </span>
              </v-layout>
              <v-coin-select
                v-if="!marketItem"
                :items="baseCurrencies"
                class="cce-account__select-coin-bar-item--wide"
                @input="onSelectBaseCurrency"
                :value="baseCurrency"
              >
              </v-coin-select>
            </v-flex>
        </v-layout>
        <v-layout align-center class="pb-4" row>
            <v-flex d-flex xs4 class="text-xs-right pr-1">
              <span>{{ $t('AdminManageSetting.Markets.min_order_amount') }}:</span>
            </v-flex>
            <v-flex d-flex xs8>
              <input
              class="cce-admin_panel-control-input-text"
              v-model="minOrderAmount"
              :class="{ 'cce-trade__trade-form-control-input--error': errorMinOrderAmount }"
              />
            </v-flex>
        </v-layout>
        <v-layout align-center class="pb-4" row>
            <v-flex d-flex xs4 class="text-xs-right pr-1">
              <span>{{ $t('AdminManageSetting.Markets.max_order_amount') }}:</span>
            </v-flex>
            <v-flex d-flex xs8>
              <input
              class="cce-admin_panel-control-input-text"
              v-model="maxOrderAmount"
              :class="{ 'cce-trade__trade-form-control-input--error': errorMaxOrderAmount }"
              />
            </v-flex>
        </v-layout>
        <v-layout align-center class="pb-4" row>
            <v-flex d-flex xs4 class="text-xs-right pr-1">
                <span>{{ $t('AdminManageSetting.Markets.min_order_unit_price') }}:</span>
            </v-flex>
            <v-flex d-flex xs8>
                <input
                class="cce-admin_panel-control-input-text"
                v-model="minOrderUnitPrice"
                :class="{ 'cce-trade__trade-form-control-input--error': errorMinOrderUnitPrice }"
                />
            </v-flex>
        </v-layout>
        <v-layout align-center class="pb-4" row>
            <v-flex d-flex xs4 class="text-xs-right pr-1">
                <span>{{ $t('AdminManageSetting.Markets.max_order_unit_price') }}:</span>
            </v-flex>
            <v-flex d-flex xs8>
                <input
                class="cce-admin_panel-control-input-text"
                v-model="maxOrderUnitPrice"
                :class="{ 'cce-trade__trade-form-control-input--error': errorMaxOrderUnitPrice }"
                />
            </v-flex>
        </v-layout>
        <v-layout align-center class="pb-4" row>
            <v-flex d-flex xs4 class="text-xs-right pr-1">
                <span>{{ $t('AdminManageSetting.Markets.maker_fee') }}:</span>
            </v-flex>
            <v-flex d-flex xs8>
                <input
                class="cce-admin_panel-control-input-text"
                v-model="makerFee"
                :class="{ 'cce-trade__trade-form-control-input--error': errorMakerFee }"
                />
            </v-flex>
        </v-layout>
        <v-layout align-center class="pb-4" row>
            <v-flex d-flex xs4 class="text-xs-right pr-1">
                <span>{{ $t('AdminManageSetting.Markets.taker_fee') }}:</span>
            </v-flex>
            <v-flex d-flex xs8>
                <input
                class="cce-admin_panel-control-input-text"
                v-model="takerFee"
                :class="{ 'cce-trade__trade-form-control-input--error': errorTakerFee }"
                />
            </v-flex>
        </v-layout>
        <v-layout align-center row>
            <v-flex d-flex xs4 class="text-xs-right pr-1">
              <span>{{ $t('AdminManageSetting.Markets.status') }}:</span>
            </v-flex>
            <v-flex d-flex xs8>
              <v-select
              :items="statuses"
              class="cce-admin_panel-control-select"
              single-line
              dense
              v-model="status"
              />
            </v-flex>
        </v-layout>
        <v-layout align-center row v-if="!marketItem">
            <v-flex d-flex xs4 class="text-xs-right pr-1">
              <span>{{ $t('AdminManageSetting.Markets.liquidity') }}:</span>
            </v-flex>
            <v-flex d-flex xs8>
              <v-select
              :items="liquidities"
              class="cce-admin_panel-control-select"
              single-line
              dense
              v-model="liquidity"
              />
            </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex d-flex offset-sm4 sm4>
            <v-btn
                class='cce-admin_panel-control-button cce-uppercase'
                @click="$emit('onClose')"
            >
            {{ $t('AdminManageSetting.cancel_btn') }}
            </v-btn>
          </v-flex>
          <v-flex d-flex sm4>
            <v-btn
                class='cce-admin_panel-control-button'
                @click="onSave"
            >
            {{ $t('AdminManageSetting.save_btn') }}
            </v-btn>
          </v-flex>
        </v-layout>
      </v-layout>
    </div>
  </div>
</template>

<script>
/**
 * =======================
 * Markets Modal component
 * =======================
 *
 * Contains all modal tabs
 */
import CurrencyImage from '@/components/UI/CurrencyImage';
import VCoinSelect from '@/components/Settings/Markets/MarketsCoinSelect';
import MarketProxy from '@/proxies/MarketProxy';
import Big from 'big.js';

export default {
  name: 'widget-markets-modal',
  components: {
    CurrencyImage,
    VCoinSelect,
  },
  props: {
    marketItem: {
      type: Object,
    },
    currencies: {
      type: Array,
    },
    selectMarket: {
      type: String,
    },
  },
  data() {
    return {
      statuses: [
        'Live',
        'Disabled',
      ],
      liquidities: [
        'Own',
        'Shared',
      ],
      status: 'Disabled',
      liquidity: 'Own',
      minOrderAmount: '',
      maxOrderAmount: '',
      minOrderUnitPrice: '',
      maxOrderUnitPrice: '',
      quoteCurrency: '',
      baseCurrency: '',
      makerFee: '',
      takerFee: '',

      quoteCurrencies: [],
      baseCurrencies: [],
      loading: false,

      errorMinOrderAmount: false,
      errorMaxOrderAmount: false,
      errorMinOrderUnitPrice: false,
      errorMaxOrderUnitPrice: false,
      errorMakerFee: false,
      errorTakerFee: false,
    };
  },
  mounted() {
    document.addEventListener('keydown', this.closeModalByEsc);
    this.init();
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.closeModalByEsc);
  },
  methods: {
    /**
     * Closes modal by pressing `Esc` key
     * @param {Object} e event object
     */
    closeModalByEsc(e) {
      if (e.which === 27 || e.keyCode === 27) {
        this.$emit('onClose');
      }
    },

    init() {
      this.baseCurrencies = this.currencies;
      this.quoteCurrencies = this.currencies;

      if (this.marketItem) {
        this.quoteCurrency = this.marketItem.quoteCurrency;
        this.baseCurrency = this.marketItem.baseCurrency;
        this.status = this.marketItem.status.charAt(0).toUpperCase() +
                      this.marketItem.status.slice(1);
        this.minOrderAmount = this.marketItem.minOrderAmount;
        this.maxOrderAmount = this.marketItem.maxOrderAmount;
        this.minOrderUnitPrice = this.marketItem.minOrderUnitPrice;
        this.maxOrderUnitPrice = this.marketItem.maxOrderUnitPrice;
        this.makerFee = this.marketItem.makerFee;
        this.takerFee = this.marketItem.takerFee;
      } else {
        this.quoteCurrency = this.selectMarket;
        this.minOrderAmount = '0.00000001';
        this.maxOrderAmount = '1000000';
        this.minOrderUnitPrice = '0.00000001';
        this.maxOrderUnitPrice = '1000000';
        this.makerFee = '0.25';
        this.takerFee = '0.25';
        this.onSelectQuoteCurrency(this.quoteCurrency);
      }
    },

    onSelectQuoteCurrency(val) {
      if (val == null) {
        return;
      }
      this.quoteCurrency = val;
      this.baseCurrencies = this.currencies.filter(it => it.currency !== this.quoteCurrency);
      const marketKey = Object.keys(this.marketSettings).find(it => it === this.quoteCurrency);
      if (marketKey) {
        const market = this.marketSettings[marketKey];
        this.baseCurrencies = this.baseCurrencies.filter(
          it => Object.keys(market).indexOf(it.currency) === -1,
        );
      }

      this.baseCurrency = this.baseCurrencies[0].currency;
    },

    onSelectBaseCurrency(val) {
      if (val == null) {
        return;
      }
      this.baseCurrency = val;
    },

    async onSave() {
      if (this.minOrderAmount === '' || this.maxOrderAmount === '' || this.minOrderUnitPrice === '' || this.maxOrderUnitPrice === ''
        || this.takerFee === '' || this.makerFee === '') {
        this.errorMinOrderAmount = this.minOrderAmount === '';
        this.errorMaxOrderAmount = (this.maxOrderAmount === '');
        this.errorMinOrderUnitPrice = this.minOrderUnitPrice === '';
        this.errorMaxOrderUnitPrice = this.maxOrderUnitPrice === '';
        this.errorTakerFee = this.takerFee === '';
        this.errorMakerFee = this.makerFee === '';

        return;
      }

      try {
        this.loading = true;

        const data = {
          quoteCurrency: this.quoteCurrency,
          baseCurrency: this.baseCurrency,
          market: `${this.baseCurrency}-${this.quoteCurrency}`,
          status: this.status.toLowerCase(),
          minOrderAmount: new Big(this.minOrderAmount).toFixed(),
          maxOrderAmount: new Big(this.maxOrderAmount).toFixed(),
          maxOrderUnitPrice: new Big(this.maxOrderUnitPrice).toFixed(),
          minOrderUnitPrice: new Big(this.minOrderUnitPrice).toFixed(),
          takerFee: new Big(this.takerFee).toFixed(),
          makerFee: new Big(this.makerFee).toFixed(),
          liquidity: this.liquidity,
        };

        if (this.marketItem) {
          data.marketUid = this.marketItem.marketUid;
        }

        await new MarketProxy().saveMarket(data).then(async () => {
          await this.$store.dispatch('market/settings');
          this.loading = true;
          this.$emit('onClose');
          this.$emit('onSelectCurrency');
        });

        this.$notify({
          type: 'success',
          text: `Market ${this.baseCurrency} - ${this.quoteCurrency} 
                information has been saved.`,
        });
      } catch (e) {
        this.loading = false;
        this.$notify({
          type: 'error',
          text: 'Invalid input value.',
        });
        console.log(e);
      }
    },
  },
  computed: {
    /**
    * Returns if the window width is less than 960px
    * @returns {Boolean}
    */
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },

    /**
     * Returns markets from store
     * @returns {Object}
     */
    marketSettings() {
      return this.$store.getters['market/settings_all'] || {};
    },
  },
};
</script>
