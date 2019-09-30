<template>
  <v-layout>
    <v-flex>
      <div class="title">{{ $t('ForgotPasswordPage.reset_password') }}</div>
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
      {{ $t('ForgotPasswordPage.password_recovery_link_sent') }}
    </v-alert>


    <v-form
      class="cce-auth__register-form"
      @submit.prevent="submit"
      v-if="!success"
    >
        <div>
          <v-text-field
            :label="$t('ForgotPasswordPage.form_label_email')"
            required
            color="teal lighten-2"
            v-model.trim="email"
          ></v-text-field>
        </div>
      <div>
        <v-btn
          :loading="busy"
          :disabled="busy"
          type="submit"
        >
          {{ $t('ForgotPasswordPage.send_recovery_link') }}
        </v-btn>
      </div>
    </v-form>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
  /* ============
   * Forgot Password
   * ============
   *
   */
  import VLayout from '@/layouts/Auth';
  import User from '@/proxies/UserProxy';
  import handleErrorMessage from '@/utils/handleErrorMessage';

  export default {
    name: 'forgot-password',
    components: {
      VLayout,
    },
    data() {
      return {
        email: null,
        error: null,
        busy: false,
        success: false,
      };
    },
    methods: {
      async submit() {
        if (!this.email || this.email.length < 1) {
          this.error = this.$t('ForgotPasswordPage.email_field_is_empty');
          return;
        }
        this.error = null;
        this.success = false;
        try {
          const data = {
            email: this.email,
          };
          await new User().recoverPassword(data);
          this.success = true;
        } catch (e) {
          this.error = handleErrorMessage(e);
        }
      },
    },
  };
</script>
