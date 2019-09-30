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
      {{ $t('RegisterForm.account_successfully_created') }}
    </v-alert>


    <v-form
      class="cce-auth__register-form"
      v-if="!success"
      @submit.prevent="submit"
    >
      <div>
        <v-text-field
          :label="$t('RegisterForm.form_label_email')"
          required
          color="teal lighten-2"
          v-model.trim="email"
        ></v-text-field>
      </div>
      <div>
        <v-text-field
          :label="$t('RegisterForm.form_label_password')"
          id="passElement"
          required
          color="teal lighten-2"
          v-model="password"
          :type="'password'"
        ></v-text-field>
      </div>
      <div>
        <v-text-field
          :label="$t('RegisterForm.form_label_repeat_password')"
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
          {{ $t('RegisterForm.create_account') }}
        </v-btn>
      </div>
    </v-form>

  </div>
</template>

<script>
  /* ============
   * RegisterForm
   * ============
   *
   * Create user account form
   */
  import User from '@/proxies/UserProxy';
  import AnalyticsProxy from '@/proxies/AnalyticsProxy';
  import { calculateRating, assessTotalScore } from '@/utils/validation';
  import handleErrorMessage from '@/utils/handleErrorMessage';

  export default {
    name: 'register-form',
    data() {
      return {
        email: null,
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
        if (this.email === null || this.password === null || this.busy) {
          return;
        }
        if (this.password !== this.passwordAgain) {
          // this.error = 'Passwords don\'t match.';
          this.error = this.$t('RegisterForm.passwords_dont_match');
          return;
        }
        this.busy = true;
        try {
          const data = {
            email: this.email,
            password: this.password,
          };
          const user = await new User().register(data);
          this.busy = false;
          this.email = null;
          this.password = null;
          this.success = true;
          const referralCode = localStorage.getItem('referralCode');
          if (referralCode) {
            await new AnalyticsProxy().createStats(user.result.user.userUid, referralCode);
            await new AnalyticsProxy().register(referralCode);
          } else {
            await new AnalyticsProxy().createStats(user.result.user.userUid);
          }
          // create referral
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

        const passwordLevelText = {
          weak: this.$t('RegisterForm.password_message_weak'),
          moderate: this.$t('RegisterForm.password_message_moderate'),
          strong: this.$t('RegisterForm.password_message_strong'),
        };

        const calculatedRating = calculateRating(passwordArray, rating);
        const ratingElement = document.querySelector('.rating');
        assessTotalScore(ratingElement, calculatedRating, passwordLevelText);
      },
    },
  };
</script>
