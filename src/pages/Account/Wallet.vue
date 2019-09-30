<template>
  <v-layout column justify-space-between fill-height>
    <div class="pb-2">
      <wallets-table
        :wallets="wallets"
        :currencies="currencies"
        :usdTotal="usdTotal"
        @onClickDeposit="openDepositModal"
        @onClickWithdraw="openWithdrawModal"
      />
    </div>
    <div>
      <zero-balance-assets
        v-if="zeroBalanceAssets.length > 0"
        :data="zeroBalanceAssets"
        @onClick="openDepositModal"
      />
    </div>
    <wallets-modal
      v-if="isModalVisible"
      @onClose="isModalVisible = !isModalVisible"
      :wallet="selectedWallet"
      :modalTab="modalTab"
    />
  </v-layout>
</template>

<script>
  /* ============
   * Wallet page
   * ============
   *
   * User Wallet page for the account section
   */
  import Big from 'big.js';
  import Market from '@/proxies/MarketProxy';
  import WalletsTable from '@/components/Wallet/WalletsTable';
  import ZeroBalanceAssets from '@/components/Wallet/ZeroBalanceAssets';
  import WalletsModal from '@/components/Wallet/WalletsModal';

  export default {
    name: 'account-wallet',
    components: {
      WalletsTable,
      ZeroBalanceAssets,
      WalletsModal,
    },
    data() {
      return {
        isModalVisible: false,
        modalTab: '0',
        // btcTotal: 0,
        // btcInUse: 0,
        usdTotal: 0,
        usdInUse: 0,
        selectedWallet: null,
        headers: [
          {
            text: this.$t('Wallet.coin'),
            align: 'left',
            value: 'coin',
          },
          {
            text: this.$t('Wallet.available_amount'),
            align: 'left',
            value: 'amount',
          },
          {
            text: this.$t('Wallet.in_orders'),
            align: 'left',
            value: 'orders',
          },
          {
            text: this.$t('Wallet.total'),
            align: 'left',
            value: 'total',
          },
          {
            text: this.$t('Wallet.operation'),
            align: 'right',
            value: 'operation',
            sortable: false,
          },
        ],
        walletsDataInterval: null,
      };
    },
    mounted() {
      if (this.ready) {
        this.total();
        this.loadWallets();
        this.listClients();
      }
      if (!this.walletsDataInterval) {
        // Update wallets every 20 seconds while Wallets page is active
        this.walletsDataInterval = setInterval(() => {
          this.loadWallets();
        }, 20000);
      }
    },
    beforeDestroy() {
      // Stop updating wallets to avoid unnecessary HTTP requests
      if (this.walletsDataInterval) {
        clearInterval(this.walletsDataInterval);
      }
    },
    computed: {
      /**
       * Returns settings for all markets from store
       * @returns {Object}
       */
      settings() {
        return this.$store.getters['market/settings'] || {};
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
      clients() {
        return this.$store.getters['wallet/listClient'] || {};
      },

      /**
       * Returns all currencies from store
       * @returns {Array}
       */
      currencies() {
        return this.$store.getters['market/currenciesArr'] || [];
      },

      /**
       * Filters all zero-balance wallets
       * @returns {Array<Object>}
       */
      zeroBalanceAssets() {
        const settingCurrencies = [];

        Object.keys(this.settings).map((marketType) => {
          if (settingCurrencies.indexOf(marketType) === -1) {
            settingCurrencies.push(marketType);
          }
          return Object.keys(this.settings[marketType]).map(currency =>
            (settingCurrencies.indexOf(currency) === -1 ? settingCurrencies.push(currency) : 0),
          );
        });

        if (this.wallets && this.currencies.length > 0) {
          const zeroBalanceAssets = this.currencies.filter(item =>
            settingCurrencies.includes(item.currency)
            && (
              !this.wallets[item.currency]
              || Number(this.wallets[item.currency].availableBalance) <= 0
            ));
          return zeroBalanceAssets;
        }
        return [];
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
       * Opens deposit component inside wallet modal
       * @param {Object} wallet selected wallet
       */
      openDepositModal(wallet) {
        this.selectedWallet = wallet;
        this.isModalVisible = true;
        this.modalTab = '0';
      },

      /**
       * Opens withdraw component inside wallet-modal
       * @param {Object} wallet selected wallet
       */
      openWithdrawModal(wallet) {
        this.selectedWallet = wallet;
        this.isModalVisible = true;
        this.modalTab = '1';
      },

      /**
       * Makes a request to load wallets
       */
      loadWallets() {
        this.$store.dispatch('wallet/list', {});
      },

      /**
       * Makes a request to load wallets
       */
      listClients() {
        this.$store.dispatch('wallet/listClient', {});
      },

      /**
       * Calculates total balance
       */
      total() {
        const quoteCurrency = 'USDC';
        let usdTotal = 0;
        let usdInUse = 0;
        // Fetch all USDC-based pairs
        new Market().getTickers({ quoteCurrency }).then((res) => {
          const w = this.wallets;
          Object.keys(w).forEach((key) => {
            const wallet = w[key];
            // Calculate balance for current wallet
            const balance = Number(wallet.availableBalance) + Number(wallet.lockedBalance);
            if (balance > 0) {
              if (wallet.currency === 'USDC') {
                // If wallet is USDC
                usdTotal += balance;
                usdInUse += Number(wallet.lockedBalance);
              } else {
                // If wallet is NOT USDC
                const walletSelector = `${key}-USDC`;
                if (walletSelector in res) {
                  // Calculate non-USDC wallet balance using its USD price
                  usdTotal += Number(res[walletSelector].lastPrice) * Number(wallet.availableBalance);
                  usdInUse += Number(res[walletSelector].lastPrice) * Number(wallet.lockedBalance);
                }
                this.usdTotal = new Big(usdTotal).toPrecision(8);
                this.usdInUse = new Big(usdInUse).toPrecision(8);
              }
            }
          });
        });

        if (this.usdTotal !== usdTotal) {
          this.usdTotal = usdTotal;
        }
        if (this.usdInUse !== usdInUse) {
          this.usdInUse = usdInUse;
        }
      },
    },
    watch: {
      /**
       * Executes `total` method when `ready` state is changed
       * @param {Boolean} next `ready` next state
       */
      ready(next) {
        if (next) {
          this.total();
        }
      },
    },
  };
</script>
