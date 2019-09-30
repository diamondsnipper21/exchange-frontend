<template>
  <v-layout>
    <v-flex>
      <div class="title">{{ $t('RecoverPasswordPage.reset_password') }}</div>
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
          {{ $t('RecoverPasswordPage.requiest_successfully_proceeded') }}
        </v-alert>
        <div
          v-if="success"
        >
          <v-update-password-form></v-update-password-form>
        </div>
        <div
          v-if="busy"
        >
          {{ $t('RecoverPasswordPage.processing_request') }}
        </div>
        <div v-if="busy">
          <progress-spinner :width="7" color="blue-grey" noOverlay />
        </div>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
  /* ============
   * recoverPassword page
   * ============
   *
   * Account confirmation page
   */
  import User from '@/proxies/UserProxy';
  import VUpdatePasswordForm from '@/components/UpdatePasswordForm';
  import handleErrorMessage from '@/utils/handleErrorMessage';
  import ProgressSpinner from '@/components/UI/ProgressSpinner';

  export default {
    name: 'recoverPassword',
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
        const type = 'recoverPassword';
        const token = this.$route.params.token;
        this.busy = true;
        try {
          const res = await new User().logInWithToken({ token, type });
          await this.$store.dispatch('auth/save', res);
          await this.$store.dispatch('auth/check');
          this.busy = false;
          this.success = true;
        } catch (e) {
          this.error = handleErrorMessage(e);
          this.busy = false;
          this.success = false;
        }
      },
    },
    components: {
      VUpdatePasswordForm,
      ProgressSpinner,
    },
  };
</script>
