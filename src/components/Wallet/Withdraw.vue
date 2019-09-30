<template>
  <v-layout column justify-space-between>
    <div>
      <v-coin-select
        :items="currencies"
        class="cce-account__select-coin-bar-item--wide"
        @input="selectCurrency"
        :value="wallet.currency"
        withBalance
      >
      </v-coin-select>
      <v-form class="cce-withdraw-form" :style="{ height: '100%' }">
        <div class="mt-3 cce-withdraw-address">
          <v-text-field
            :placeholder="formAddressLabel"
            required
            v-model.trim="address"
          ></v-text-field>
        </div>
        <v-layout row align-center mt-3 :style="{ width: '60%' }">
          <v-layout row justify-space-between align-center class="cce-withdraw-address">
            <button
              type="button"
              class="cce-withdraw-address__button"
              @click="fillMaxBalance"
            >Max</button>
            <div :style="{ width: '75%' }">
              <v-text-field
                class="cce-withdraw-address__input--right"
                placeholder="0.00000000"
                required
                v-model.trim="amount"
              ></v-text-field>
            </div>
          </v-layout>
          <div class="ml-3 cce-uppercase">
            {{ currency }}
          </div>
        </v-layout>
        <div class="my-3 cce-wallets-modal__text">
          <div class="cce-wallets-modal__text__header">Limits</div>
          <div
            class="cce-wallets-modal__text__description"
            v-html="$t('Withdrawals.between_min_max', { minWithdrawAmount, maxWithdrawAmount, currency })"
          ></div>
          <div class="cce-wallets-modal__text__description">
            <span>{{ $t('Withdrawals.fee') }}: {{ withdrawalFee }} <span class="cce-uppercase">{{ currency }}.</span></span>
            <span>{{ $t('Withdrawals.you_will_receive') }}: {{ finalAmount }} <span class="cce-uppercase">{{ currency }}</span></span>
          </div>
        </div>
        <v-layout row justify-end align-end>
          <v-flex xs6>
            <v-btn
              @click="submit"
              :loading="busy"
              :disabled="busy || !address || !currency || !amount"
              block
              class="cce-wallets__button px-3 cce-uppercase btn--no-shadow"
            >
              {{ $t('Withdrawals.send') }}
            </v-btn>
          </v-flex>
        </v-layout>
      </v-form>
    </div>
  </v-layout>
</template>

<script>
/**
 * ==================
 * Withdraw component
 * ==================
 *
 * Renders `Withdraw` tab inside wallet modal
 */
import VCoinSelect from '@/components/AccountCoinSelect';
import Wallet from '@/proxies/WalletProxy';
import Big from 'big.js';
import handleErrorMessage from '@/utils/handleErrorMessage';
import compare from '@/utils/compare';

export default {
  name: 'withdraw-modal',
  components: {
    VCoinSelect,
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
    };
  },
  mounted() {
    this.init();
  },
  computed: {
    /**
     * Returns `user` object from store
     */
    user() {
      return this.$store.getters['account/user'];
    },

    /**
     * Returns `address` field label depending on selected currency
     * @returns {String}
     */
    formAddressLabel() {
      const currenciesWithAccount = ['eos', 'xdac'];
      if (this.currency && currenciesWithAccount.includes(this.currency.toLowerCase())) {
        return this.$t('Withdrawals.account_name_input_label');
      }
      return this.$t('Withdrawals.address_input_label');
    },

    /**
     * Returns currency settings
     * @returns {Object}
     */
    currencySettings() {
      const currencies = this.$store.getters['market/currencies'];
      return currencies[this.currency];
    },

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
     * Returns withdrawal fee
     * @returns {Number}
     */
    withdrawalFee() {
      const currencySettings = this.currencySettings;
      if (this.currency !== null && currencySettings) {
        return currencySettings.withdrawalFee;
      }
      return 0;
    },

    /**
     * Returns formatted final amount
     * @returns {*}
     */
    finalAmount() {
      const finalAmount = new Big(this.amount || 0)
        .sub(this.withdrawalFee || 0)
        .toFixed(this.marketTypePrecision);

      return finalAmount < 0 ? 0 : finalAmount;
    },

    /**
     * Returns minimal withdaw amount
     * @returns {Number}
     */
    minWithdrawAmount() {
      const currencySettings = this.currencySettings;
      if (this.currency !== null && currencySettings) {
        return currencySettings.minWithdrawAmount;
      }
      return 0;
    },

    /**
     * Returns maximal withdaw amount
     * @returns {Number}
     */
    maxWithdrawAmount() {
      const currencySettings = this.currencySettings;
      if (this.currency !== null && currencySettings) {
        return currencySettings.maxWithdrawAmount;
      }
      return 0;
    },

    /** */
    requireKycAboveWithdrawAmount() {
      const currencySettings = this.currencySettings;
      if (this.currency !== null && currencySettings) {
        return currencySettings.requireKycAboveWithdrawAmount;
      }
      return 0;
    },

    /**
     * Returns sorted currencies by available balance
     * @returns {Array<Object>}
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
     * Sets available balance in amount field
     */
    fillMaxBalance() {
      let targetBalance = 0;
      this.currencies.forEach((item) => {
        if (item.currency === this.currency) {
          targetBalance = item.availableBalance;
        }
      });
      if (targetBalance > 0) {
        this.amount = new Big(targetBalance).toFixed(8);
      }
    },

    /**
     * Sends withdraw request
     */
    async submit() {
      this.error = null;
      this.success = false;

      // This currency requires KYC identification above a certain threshold
      if (this.requireKycAboveWithdrawAmount && this.requireKycAboveWithdrawAmount > 0) {
        const currentAmount = this.toBigInt(this.amount);
        if (currentAmount >= this.requireKycAboveWithdrawAmount) {
          this.modal = true;
        }
      }

      if (this.currency === null || this.amount === null || this.address === null || this.busy) {
        return;
      }
      this.busy = true;
      try {
        const data = {
          currency: this.currency,
          amount: parseFloat(this.amount),
          address: this.address,
          userUid: this.user.userUid,
        };
        const response = await new Wallet().addPayment(data);
        this.busy = false;
        this.amount = null;
        this.address = null;
        this.success = true;
        if (response && response.result && response.result.payment
          && response.result.payment.status === 'unconfirmed') {
          this.$notify({
            type: 'warn',
            text: this.$t('Withdrawals.requestSubmitted'),
            speed: 0,
            duration: -1,
          });
        } else {
          this.$notify({
            type: 'info',
            text: this.$t('Withdrawals.requestPending'),
            speed: 0,
            duration: -1,
          });
        }
      } catch (e) {
        this.$notify({
          type: 'warn',
          text: handleErrorMessage(e),
        });
        this.error = handleErrorMessage(e);
        this.busy = false;
        this.success = false;
      }
    },

    /**
     * Selects currency automatically
     */
    init() {
      if (this.isOpenedInTradeScreen) {
        this.selectCurrency(this.wallet.currency || this.defaultCurrency);
      } else if (this.ready) {
        this.selectCurrency(this.wallet.currency || this.defaultCurrency);
      }
    },

    /**
     * Selects curerncy by given name
     * @param {String} val currency name
     */
    selectCurrency(val) {
      if (val instanceof Event) val = val.target.value;
      if (val === null) return;
      this.amount = null;
      this.currency = val;
    },
  },
  watch: {
    /**
     * Runs `init` when `ready` state changes
     */
    ready() {
      this.init();
    },
  },
};
</script>
