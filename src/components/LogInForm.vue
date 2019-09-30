<template>
  <div class="my-5">
  <v-tabs
  v-if="showOTPCode && showSMSCode"
  fixed-tabs
  grow
  dark
  style="margin-bottom: 20px;"
  slider-color="transparent"
  color="transparent"
  v-model="model">
    <v-tab
      key="password"
      href="#password"
      class="login__tab"
    >
      {{ $t('LogInForm.otp') }}
    </v-tab>
    <v-tab
      key="phone"
      href="#phone"
      class="login__tab"
    >
      {{ $t('LogInForm.sms') }}
    </v-tab>
  </v-tabs>

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
      {{ $t('LogInForm.successfully_logged_in') }}
    </v-alert>
    <v-alert
      type="success"
      :value="textSent"
      class="mb-4"
    >
      {{ $t('LogInForm.sms_code_was_sent') }}
    </v-alert>

    <v-tabs-items v-model="model">
      <v-tab-item
        id="password"
        key="password"
      >
    <v-form
      class="cce-auth__register-form"
      @submit.prevent="submit"
      v-if="!success"
    >
      <div v-if="showEmailPass">
        <div>
          <v-text-field
            :label="$t('LogInForm.form_label_email')"
            required
            color="teal lighten-2"
            v-model.trim="email"
          ></v-text-field>
        </div>
        <div>
          <v-text-field
            :label="$t('LogInForm.form_label_password')"
            required
            color="teal lighten-2"
            v-model="password"
            :type="'password'"
          ></v-text-field>
        </div>
      </div>
      <div v-if="showOTPCode">
        <v-text-field
          :label="$t('LogInForm.form_label_google_auth_code')"
          required
          color="teal lighten-2"
          v-model="otpCode"
        ></v-text-field>
      </div>
      <div>
        <v-btn
          :loading="busy"
          :disabled="busy"
          type="submit"
        >
          {{ $t('LogInForm.log_in') }}
        </v-btn>
      </div>
    </v-form>
      </v-tab-item>
      <v-tab-item
        id="phone"
        key="phone"
      >
    <v-form
      class="cce-auth__register-form"
      @submit.prevent="submit"
      v-if="!success"
    >
      <div>
        <div>
          <!-- <int-tel-input></int-tel-input> -->
          <!-- <v-text-field
            :label="$t('LogInForm.form_label_phone_number')"
            required
            type="tel"
            color="teal lighten-2"
            v-model="phone"
          ></v-text-field> -->
        </div>
        <div>
          <v-text-field
            :label="$t('LogInForm.form_label_sms_code')"
            required
            color="teal lighten-2"
            v-model="smsCode"
            :type="'password'"
          ></v-text-field>
        </div>
      </div>
      <div>
        <v-btn
          :disabled="busy"
          @click="sendSMS"
        >
          {{ $t('LogInForm.send_sms') }}
        </v-btn>
        <v-btn
          :loading="busy"
          :disabled="busy"
          type="submit"
        >
          {{ $t('LogInForm.log_in') }}
        </v-btn>
      </div>
    </v-form>
      </v-tab-item>
    </v-tabs-items>

  </div>
</template>

<script>
  /* ============
   * LogForm
   * ============
   *
   * Log in user form
   */
  import User from '@/proxies/UserProxy';
  import handleErrorMessage from '@/utils/handleErrorMessage';

  export default {
    name: 'log-in-form',
    props: {
      routeToGo: {
        type: Object,
        required: false,
        default: { name: 'trade.index' },
      },
    },
    data() {
      return {
        defaultRoute: { name: 'trade.index' },
        email: null,
        password: null,
        otpCode: undefined,
        smsCode: undefined,
        error: null,
        busy: false,
        success: false,
        showOTPCode: false,
        showEmailPass: true,
        model: 'password',
        textSent: false,
        showSMSCode: false,
        phone: null,
      };
    },
    methods: {
      async submit() {
        this.error = null;
        this.success = false;
        this.textSent = false;
        if (this.email === null || this.password === null || this.busy) {
          return;
        }
        this.busy = true;
        try {
          const data = {
            email: this.email,
            password: this.password,
          };
          if (this.smsCode && this.showSMSCode) {
            data.smsCode = this.smsCode;
          }
          if (this.otpCode && this.showOTPCode) {
            data.otpCode = this.otpCode;
          }
          const res = await new User().logIn(data);
          await this.$store.dispatch('auth/save', res);
          await this.$store.dispatch('auth/check');
          const route = this.routeToGo || this.defaultRoute;
          this.$router.replace(route);
          window.location.reload();
          this.busy = false;
          this.email = null;
          this.password = null;
          this.success = true;
        } catch (e) {
          if (e.error.code === 'invalidOTPCode' || e.error.code === 'invalidSMSCode') {
            if (this.showOTPCode || this.showSMSCode) {
              this.error = handleErrorMessage(e);
            }
            this.showOTPCode = e.error.security.otpEnabled;
            this.showSMSCode = e.error.security.smsEnabled;
            if (!this.showOTPCode && this.showSMSCode) {
              this.model = 'phone';
            }
            if (!this.showOTPCode && !this.showSMSCode) {
              this.model = 'password';
            }
            this.showEmailPass = false;
          } else {
            this.error = handleErrorMessage(e);
          }
          this.busy = false;
          this.success = false;
        }
      },
      async sendSMS() {
        this.error = null;
        this.success = false;
        if (this.email === null || this.busy) {
          return;
        }
        this.busy = true;
        try {
          const data = {
            email: this.email,
          };
          await new User().smsCode(data);
          this.busy = false;
          this.textSent = true;
          return;
        } catch (e) {
          this.busy = false;
          this.success = false;
          this.textSent = false;
        }
      },
    },
    components: {
    },
  };
</script>

<style>
.login__tab {
  background-color: #0BD2BD;
  color: white !important;
  font-family: 'Poppins';
  border-bottom: none;
}
</style>
