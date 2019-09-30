<template>
  <div class="cce-wallets-modal">
    <div @click="$emit('onClose')" class="cce-wallets-modal__backdrop"></div>
    <div class="cce-wallets-modal__container">      
      <v-tabs class="cce-wallets-modal__tabs" v-model="tabIndex">
        <v-tab
          v-for="(tab, index) in tabs"
          :key="index"
          @click="selectTab(index)"
        >
          {{ tab }}
        </v-tab>
        <v-spacer />
        <v-icon
          class="cce-wallets-modal__close-btn"
          @click="$emit('onClose')"
        >
          fas fa-times
        </v-icon>
      </v-tabs>
      <v-layout column class="cce-wallets-modal__content" px-4 py-4>
        <deposit-modal
          v-if="tabIndex === '0'"
          :wallet="wallet"
          :isOpenedInTradeScreen="isOpenedInTradeScreen"
        />
        <withdraw-modal
          v-if="tabIndex === '1'"
          :wallet="wallet"
          :isOpenedInTradeScreen="isOpenedInTradeScreen"
        />
        <history-modal
          v-if="tabIndex === '2'"
          :wallet="wallet"
          :isOpenedInTradeScreen="isOpenedInTradeScreen"
        />
      </v-layout>
    </div>
  </div>
</template>

<script>
/**
 * =======================
 * Wallets Modal component
 * =======================
 *
 * Contains all modal tabs
 */
import DepositModal from '@/components/Wallet/Deposit';
import WithdrawModal from '@/components/Wallet/Withdraw';
import HistoryModal from '@/components/Wallet/History';

export default {
  name: 'wallets-modal',
  components: {
    DepositModal,
    WithdrawModal,
    HistoryModal,
  },
  props: {
    wallet: {
      type: Object,
    },
    modalTab: {
      type: String,
    },
    isOpenedInTradeScreen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tabs: [
        this.$t('WalletsModal.deposit'),
        this.$t('WalletsModal.withdraw'),
        this.$t('WalletsModal.history'),
      ],
      tabIndex: this.modalTab || '0',
      selectedTab: this.$t('WalletsModal.deposit'),
    };
  },
  mounted() {
    document.addEventListener('keydown', this.closeModalByEsc);
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.closeModalByEsc);
  },
  methods: {
    /**
     * Changes active tab
     * @param {Number} index tab index in `tabs` array
     */
    selectTab(index) {
      this.tabIndex = String(index);
    },

    /**
     * Closes modal by pressing `Esc` key
     * @param {Object} e event object
     */
    closeModalByEsc(e) {
      if (e.which === 27 || e.keyCode === 27) {
        this.$emit('onClose');
      }
    },
  },
};
</script>
