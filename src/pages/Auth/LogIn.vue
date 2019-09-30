<template>
  <v-layout>
    <v-flex>
      <div class="title">{{ $t('LogInPage.log_in') }}</div>
      <v-login-form :routeToGo="previousRoute"></v-login-form>
      <div>
        {{ $t('LogInPage.not_a_member') }}
        <router-link :to="{name:'register'}" class="cce-trade__link">
          {{ $t('LogInPage.sign_up') }}
        </router-link>
      </div>
      <div>
        {{ $t('LogInPage.forgot_password') }}
        <router-link :to="{name:'recover'}" class="cce-trade__link">
          {{ $t('LogInPage.send_recovery_email') }}
        </router-link>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
  /* ============
   * Login page
   * ============
   *
   * User login page
   */
  import VLayout from '@/layouts/Auth';
  import VLoginForm from '@/components/LogInForm';

  export default {
    name: 'logIn',
    components: {
      VLayout,
      VLoginForm,
    },
    data() {
      return {
        previousRoute: { name: 'trade.index' },
      };
    },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        vm.previousRoute = { ...from };
      });
    },
  };
</script>
