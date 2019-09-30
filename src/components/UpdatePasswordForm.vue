<template>
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
      {{ $t('UpdatePasswordForm.password_updated_successfully') }}
    </v-alert>


    <v-form
      class="cce-auth__register-form"
      v-if="!success"
      @submit.prevent="submit"
    >
      <div>
        <v-text-field
          :label="$t('UpdatePasswordForm.form_label_password')"
          id="passElement"
          required
          color="teal lighten-2"
          v-model="password"
          :type="'password'"
        ></v-text-field>
      </div>
      <div>
        <v-text-field
          :label="$t('UpdatePasswordForm.form_label_repeat_password')"
          required
          color="teal lighten-2"
          v-model="passwordAgain"
          :type="'password'"
        ></v-text-field>
        <div class="rating" style="float:right"></div>
      </div>
      <div>
        <v-btn
          type="submit"
          :loading="busy"
          :disabled="busy"
        >
          {{ $t('UpdatePasswordForm.update_password') }}
        </v-btn>
      </div>
    </v-form>

  </div>
</template>

<script>
  /* ============
   * UpdatePasswordForm
   * ============
   *
   * Create user account form
   */
  import User from '@/proxies/UserProxy';
  import { calculateRating, assessTotalScore } from '@/utils/validation';
  import handleErrorMessage from '@/utils/handleErrorMessage';

  export default {
    name: 'update-password-form',
    data() {
      return {
        password: null,
        passwordAgain: null,
        error: null,
        busy: false,
        success: false,
      };
    },
    methods: {
      async submit() {
        this.error = null;
        this.success = false;
        if (this.password === null || this.busy) {
          return;
        }
        if (this.password !== this.passwordAgain) {
          this.error = this.$t('UpdatePasswordForm.passwords_dont_match');
          return;
        }
        this.busy = true;
        try {
          const data = {
            user: {
              password: this.password,
            },
          };
          await new User().updatePassword(data);
          this.busy = false;
          this.email = null;
          this.password = null;
          this.success = true;
          this.$store.dispatch('auth/logout');
          window.location.replace('/#/login');
          window.location.reload();
        } catch (e) {
          this.error = handleErrorMessage(e);
          this.busy = false;
          this.success = false;
        }
      },
    },
    watch: {
      password() {
        const password = document.getElementById('passElement');
        // TODO: create a proper password strength component

        const passwordArray = password.value.split('');
        const rating = {
          number: 0,
          lowercase: 0,
          uppercase: 0,
          specialChar: 0,
          total: 0,
        };

        const calculatedRating = calculateRating(passwordArray, rating);
        const ratingElement = document.querySelector('.rating');
        assessTotalScore(ratingElement, calculatedRating);
      },
    },
  };
</script>
