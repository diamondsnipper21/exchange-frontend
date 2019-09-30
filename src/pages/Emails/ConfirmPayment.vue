<template>
  <v-layout>
    <v-flex>
      <div class="title">{{ $t('ConfirmPaymentPage.payment_confirmation') }}</div>
      <div class="my-5">
        <v-alert
          type="error"
          :value="error"
          class="mb-4"
        >
          {{ error }}
        </v-alert>
        <v-alert
          type="success"
          :value="success"
          class="mb-4"
        >
          {{ $t('ConfirmPaymentPage.payment_successfully_confirmed') }}
        </v-alert>
        <div
          v-if="success"
        >
          Return to <router-link :to="{name: 'account.wallet'}" class="cce-trade__link">{{ $t('Navigation.Wallet')}}</router-link> {{ $t('Common.or')}} <router-link :to="{name: 'account.dashboard'}" class="cce-trade__link">{{ $t('Navigation.Dashboard')}}</router-link>.
        </div>
        <div
          v-if="busy"
        >
          {{ $t('ConfirmPaymentPage.confirming_payment') }}
        </div>
        <div v-if="busy">
          <progress-spinner :width="7" color="blue-grey" />
        </div>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
  /* ============
   * ConfirmPayment page
   * ============
   *
   * Payment confirmation page
   */
  import ProgressSpinner from '@/components/UI/ProgressSpinner';
  import Wallet from '@/proxies/WalletProxy';
  import handleErrorMessage from '@/utils/handleErrorMessage';

  export default {
    name: 'confirmPayment',
    data() {
      return {
        error: null,
        busy: false,
        success: false,
      };
    },
    mounted() {
      this.init();
    },
    methods: {
      async init() {
        const type = 'confirmPayment';
        const token = this.$route.params.token;
        this.busy = true;
        try {
          await this.$store.dispatch('auth/check');
          await new Wallet().confirmPayment({ token, type });
          this.busy = false;
          this.success = true;
          setTimeout(() => {
            this.$router.push({ name: 'account.wallet' });
            // window.location.replace('/#/account/wallet');
            // window.location.reload();
          }, 6000);
        } catch (e) {
          if (e.error && e.error.code === 'loginRequired') {
            this.$router.push({ name: 'login' });
          } else {
            this.error = handleErrorMessage(e, 'Errors.withdrawal_request_confirmation_failed');
            this.busy = false;
            this.success = false;
          }
        }
      },
    },
    components: {
      ProgressSpinner,
    },
  };
</script>
