<template>
  <div class="cce-overlay" v-if="!authenticated || loading">
    <div class="cce-overlay__content" v-if="!authenticated">
      <a v-if="customLoginUrl" :href="customLoginUrl" class="cce-trade__link">
        {{ $t('TradeForm.log_in') }}
      </a>
      <router-link v-else :to="{ name: 'login' }" class="cce-trade__link">
        {{ $t('TradeForm.log_in') }}
      </router-link>
      {{ $t('TradeForm.or') }}
      <a v-if="customSignUpUrl" :href="customSignUpUrl" class="cce-trade__link">
        {{ $t('TradeForm.sign_up') }}
      </a>
      <router-link v-else :to="{ name: 'register' }" class="cce-trade__link">
        {{ $t('TradeForm.sign_up') }}
      </router-link>
      <br /> {{ $t('TradeForm.to_access_trading_options') }}
    </div>
    <!-- Loader -->
    <div v-if="loading">
      <progress-spinner />
    </div>
  </div>
</template>

<script>
/**
 * ===================
 * Trade Form Overlay component
 * ===================
 *
 * Renders singin/signup links overlay on top of the trade form
 */
import ProgressSpinner from '@/components/UI/ProgressSpinner';

export default {
  name: 'trade-form-overlay',
  components: {
    ProgressSpinner,
  },
  props: {
    authenticated: {
      type: Boolean,
    },
    loading: {
      type: Boolean,
    },
  },
  data() {
    return {
      customLoginUrl: this.$themeSettings.customLogin,
      customSignUpUrl: this.$themeSettings.customSignUp,
    };
  },
};
</script>
