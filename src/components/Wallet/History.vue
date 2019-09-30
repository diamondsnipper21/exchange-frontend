<template>
  <v-layout column justify-space-between fill-height>
    <div class="cce-wallet-history">
      <v-coin-select
        :items="currencies"
        class="cce-account__select-coin-bar-item--wide mb-3"
        @input="selectCurrency"
        :value="wallet.currency"
        withBalance
      >
      </v-coin-select>
      <v-layout :style="{ height: '250px' }">
        <table-container>
          <v-data-table
            :items="history"
            item-key="createdAt"
            :disable-initial-sort="true"
            hide-actions
            :loading="false"
          >
            <template
              slot="items"
              slot-scope="props"
            >
              <tr class="cce-account__table-tr">
                <td class="cce-wallet-history__table-td text-xs-left no-wrap">
                  <span v-date="props.item.createdAt"></span>
                </td>
                <td class="cce-wallet-history__table-td text-xs-left">
                  <span v-fixed-number="props.item.amount"></span>
                  <span class="cce-uppercase">{{ props.item.currency }}</span>
                </td>
                <td
                  class="cce-wallet-history__table-td text-xs-left"
                  v-html="props.item.paymentType === 'DB'
                    ? $t('WalletHistory.sent')
                    : $t('WalletHistory.received')
                  "
                >
                </td>
                <td class="cce-wallet-history__table-td text-xs-right">
                  <a
                    v-if="props.item.txHash"
                    v-txhash-link.with-icon="{ explorerLink: props.item.explorerLink, txHash: props.item.txHash, currency: props.item.currency.toLowerCase(), breakHash: true }"
                    :style="{ color: 'transparent' }"
                  >
                    <v-icon :style="{ fontSize: '15px' }">fas fa-external-link-alt</v-icon>
                  </a>
                </td>
                <td class="cce-wallet-history__table-td text-xs-left no-wrap">
                  <span class="cce-uppercase">{{ props.item.status }}</span>
                </td>
              </tr>
            </template>
          </v-data-table>
        </table-container>
      </v-layout>
    </div>
  </v-layout>  
</template>

<script>
/**
 * ==================
 * History component
 * ==================
 *
 * Renders `History` tab inside wallet modal
 */
import VCoinSelect from '@/components/AccountCoinSelect';
import TableContainer from '@/components/UI/TableContainer';
import compare from '@/utils/compare';

export default {
  name: 'history-modal',
  components: {
    VCoinSelect,
    TableContainer,
  },
  props: {
    wallet: {
      type: Object,
    },
    isOpenedInTradeScreen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      modal: false,
      defaultCurrency: 'btc',
      currency: null,
      hasAddress: false,
      address: null,
      amount: null,
      error: null,
      busy: false,
      success: false,
      history: [],
    };
  },
  mounted() {
    this.init();
  },
  computed: {
    /**
     * Returns currency name
     * @returns {String}
     */
    currencyName() {
      const currencySettings = this.currencySettings;
      if (this.currency !== null && currencySettings) {
        return currencySettings.name;
      }
      return '';
    },
    /**
     * Returns currencies from store with `availableBalance` prop
     * @returns {Array<Orbect>}
     */
    currencies() {
      const currencies = this.$store.getters['market/currenciesArr'];
      let currenciesWithBalance = [];
      if (currencies) {
        currenciesWithBalance = currencies
          .map(item => ({
            ...item,
            availableBalance: this.wallets[item.currency]
              ? this.wallets[item.currency].availableBalance
              : 0,
          }))
          .sort((a, b) => compare(a, b, 'availableBalance'));
      }
      return currenciesWithBalance;
    },

    /**
     * Returns wallets from store
     * @returns {Object}
     */
    wallets() {
      return this.$store.getters['wallet/list'] || {};
    },

    /**
     * Returns `ready` state from store
     * @returns {Boolean}
     */
    ready() {
      return this.$store.getters['account/ready'];
    },
  },
  methods: {
    /**
     * Selects currency automatically
     */
    init() {
      if (this.isOpenedInTradeScreen) {
        this.selectCurrency(this.wallet.currency || this.defaultCurrency);
        this.getHistory();
      } else if (this.ready) {
        this.selectCurrency(this.wallet.currency || this.defaultCurrency);
        this.getHistory();
      }
    },

    /**
     * Selects currency and runs `getHistory` method
     * @param {String} val selected currency name
     */
    selectCurrency(val) {
      if (val instanceof Event) val = val.target.value;
      if (val === null) return;
      this.amount = null;
      this.currency = val;
      this.getHistory();
    },

    /**
     * Makes request to get deposits and payments data
     */
    async getHistory() {
      const params = {
        currency: this.currency,
        limit: 25,
        page: 1,
      };
      const currencies = this.$store.getters['market/currenciesArr'];
      const linkObj = currencies.filter(d => d.currency === this.currency);

      let explorerLink = '';
      if (linkObj.length > 0) {
        explorerLink = linkObj[0].blockExplorer;
      }

      const transactions = await this.$store.dispatch('wallet/transactions', params);
      if (transactions.result && transactions.result.payments) {
        this.history = transactions.result.payments
          .map((payment) => {
            payment.explorerLink = explorerLink;
            return payment;
          })
          .sort((a, b) => compare(a, b, 'createdAt'));
      }
    },
  },
  watch: {
    /**
     * Executes `init` when `ready` state changes
     */
    ready() {
      this.init();
    },
  },
};
</script>
