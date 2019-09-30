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
      <div v-if="isLoadingAddress">
        <progress-spinner />
      </div>
      <div v-else>
        <div v-if="hasAddress">
          <template v-if="isDepositDisabled">
            <div class="my-4">
              The deposits are currently <strong>unavailable</strong> for <span class="cce-color__high">{{ currencyName }}</span>.
            </div>
          </template>

          <template v-else>
            <v-layout row justify-space-between align-center class="mt-3 cce-deposit-address">
              <input
                id="depositAddress"
                :value="address"
                :style="{width: '100%'}"
                readonly
              >
              <div
                class="cce-deposit-address__icon"
                @click="copyDepositAddress"
                v-tooltip="{
                  content: $t('Deposit.copied_to_clipboard'),
                  show: isTooltipVisible,
                  trigger: 'manual',
                  placement: 'bottom',
                }"
              >
                <v-icon>far fa-clone</v-icon>
              </div>
            </v-layout>
            <div v-if="memo">
              <div v-if="memo" class="mt-3 cce-color__high">
                Memo: {{ memo }} (required)
              </div>
              <div v-if="error" class="cce-wallets-modal__text cce-wallets-modal__text__header mt-2">{{ error }}</div>
              <div class="my-3">
                <qrcode :value="address" :options="{ width: error ? 56 : 84 }" />
              </div>
            </div>
            <div v-else>
              <div v-if="error" class="cce-wallets-modal__text cce-wallets-modal__text__header mt-2">{{ error }}</div>
              <div class="my-3">
                <qrcode :value="address" :options="{ width: error ? 84 : 120 }" />
              </div>
            </div>
          </template>
        </div>
        <div v-if="!hasAddress && error" class="cce-wallets-modal__text cce-wallets-modal__text__header mt-2">
          {{ error }}
        </div>
      </div>
    </div>
    <div class="cce-wallets-modal__text">
      <div class="cce-wallets-modal__text__header">{{ $t('Deposit.processing_time') }}</div>
      <div
        class="cce-wallets-modal__text__description"
        v-html="$t('Deposit.processing_time_description', { currency }, { minConfirmations })"
      ></div>
    </div>
  </v-layout>
</template>

<script>
/**
 * ==================
 * Deposit component
 * ==================
 *
 * Renders `Deposit` tab inside wallet modal
 */
import VCoinSelect from '@/components/AccountCoinSelect';
import Qrcode from '@chenfengyuan/vue-qrcode';
import Wallet from '@/proxies/WalletProxy';
import ProgressSpinner from '@/components/UI/ProgressSpinner';
import handleErrorMessage from '@/utils/handleErrorMessage';
import compare from '@/utils/compare';

export default {
  name: 'deposit-modal',
  components: {
    VCoinSelect,
    Qrcode,
    ProgressSpinner,
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
      defaultCurrency: 'btc',
      currency: null,
      hasAddress: false,
      address: null,
      memo: null,
      error: null,
      isTooltipVisible: false,
      isLoadingAddress: false,
    };
  },
  mounted() {
    this.init();
  },
  computed: {
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
     * Returns currency name
     * @returns {String}
     */
    currencyName() {
      const currencies = this.$store.getters['market/currencies'];
      let name = '';
      if (this.currency !== null && this.currency in currencies) {
        name = currencies[this.currency].name;
      }
      return name;
    },

    /**
     * Returns deposit enable state
     * @returns {Boolean}
     */
    isDepositDisabled() {
      const currencies = this.$store.getters['market/currencies'];
      if (!currencies) return false;
      if (!currencies[this.currency]) return false;
      if (currencies[this.currency].depositDisabled) return true;
      return false;
    },

    /**
     * Returns wallets from store
     * @returns {Object}
     */
    wallets() {
      return this.$store.getters['wallet/list'] || {};
    },

    /**
     * Returns wallets from store
     * @returns {Object}
     */
    minConfirmations() {
      const settings = this.$store.getters['wallet/listClient'] || {};
      let v = 6;
      if (settings) {
        const setting = settings[this.wallet.currency];
        if (setting) {
          v = setting.minConfirmations;
        }
      }
      return v;
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
      } else if (this.ready) {
        this.selectCurrency(this.wallet.currency || this.defaultCurrency);
      }
    },

    /**
     * Selects currency and creates a wallet if needed
     * @param {String} val selected currency
     */
    async selectCurrency(val) {
      this.isLoadingAddress = false;
      if (val === null) {
        return;
      }
      if (val instanceof Event) {
        return;
      }
      this.error = null;
      this.hasAddress = false;
      this.currency = val;
      if (val in this.wallets && this.wallets[val].address) {
        this.hasAddress = true;
        this.address = this.wallets[val].address;
        const { address, memo } = this.splitComposedAddress(this.wallets[val].address);
        this.address = address;
        this.memo = memo;
      } else { // create new;
        this.isLoadingAddress = true;
        try {
          const res = await new Wallet().createWallet({ currency: val.toUpperCase() });
          const wallet = (res && res.result && res.result.wallet) ? res.result.wallet : null;
          if (wallet && wallet.address) {
            this.hasAddress = true;
            const { address, memo } = this.splitComposedAddress(wallet.address);
            this.address = address;
            this.memo = memo;
          }
          this.isLoadingAddress = false;
        } catch (e) {
          let error = e;
          if (e && e.error.code && e.error.code === 'cryptoClientConnErr') {
            error = { error: { message: 'This currency is currently disabled.' } };
          }
          this.error = handleErrorMessage(error);
          this.hasAddress = false;
          this.isLoadingAddress = false;
        }
      }
    },

    /**
     * Split a composed wallet address in 2 parts (ie. address + memo)
     * @param composedAddress
     * @returns {*}
     */
    splitComposedAddress(composedAddress) {
      // If not a composed address, return unchanged address
      if (composedAddress.indexOf('.') === -1) {
        return { address: composedAddress, memo: null };
      }
      // Otherwise, return a 2-component object, { address: '..', memo: '..' }
      const [address, memo] = composedAddress.split('.');
      return { address, memo };
    },

    /**
     * Adds deposit address to clipboard using 'copy' command
     */
    copyDepositAddress() {
      const depositAddress = document.getElementById('depositAddress');
      depositAddress.select();
      document.execCommand('copy');
      // Show `copied` tooltip
      this.isTooltipVisible = true;
      setTimeout(() => {
        // Hide `copied` tooltip manually
        this.isTooltipVisible = false;
      }, 2000);
    },
  },
};
</script>
