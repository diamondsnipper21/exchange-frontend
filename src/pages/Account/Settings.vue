<template>
  <v-layout>
    <v-flex settings>
      <div class="title">{{ $t('Settings.settings') }}</div>

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
          {{ $t('Settings.account_settings_updated_successfully') }}
        </v-alert>

        <v-alert
          type="success"
          :value="smsCodeSent"
          class="mb-4"
        >
          {{ $t('Settings.sms_code_was_sent') }}
        </v-alert>

        <v-expansion-panel>

          <v-expansion-panel-content
            :key="0"
            :value="initSection === 'change-password'"
            :lazy="true"
          >
            <div slot="header">{{ $t('Settings.change_login_password') }}</div>
            <v-card>
              <v-card-text>
              <v-form
                class="cce-settings__update-user-form"
              >
                <div>
                  <v-text-field
                    :label="$t('Settings.old_password_label')"
                    required
                    color="teal lighten-2"
                    v-model="oldPassword"
                    :type="'password'"
                  ></v-text-field>
                </div>
                <div>
                  <v-text-field
                    :label="$t('Settings.new_password_label')"
                    required
                    color="teal lighten-2"
                    v-model="password"
                    :type="'password'"
                  ></v-text-field>
                </div>
                <div>
                  <v-text-field
                    :label="$t('Settings.repeat_new_password_label')"
                    required
                    color="teal lighten-2"
                    v-model="passwordAgain"
                    :type="'password'"
                  ></v-text-field>
                </div>
                <div v-if="otpEnabled">
                  <v-text-field
                    :label="$t('Settings.google_auth_code_label')"
                    required
                    color="teal lighten-2"
                    v-model="otpCode"
                  ></v-text-field>
                </div>
                <div>
                  <v-btn
                    class="cce-security-update-link"
                    @click="submitChangePassword"
                    :loading="busy"
                    :disabled="busy"
                  >
                    {{ $t('Settings.save') }}
                  </v-btn>
                </div>
              </v-form>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>

          <v-expansion-panel-content
            :key="1"
            :value="initSection === 'change-otp'"
            :lazy="true"
          >
            <div slot="header" v-if="!otpEnabled">{{ $t('Settings.enable_google_auth') }}</div>
            <div slot="header" v-if="otpEnabled">{{ $t('Settings.disable_google_auth') }}</div>
            <v-card>
              <v-card-text>
              <div v-if="!otpEnabled">
                <div>
                  {{ $t('Settings.please_scan_qr') }}
                </div>
                <div class="my-4">

                  <qrcode
                    v-if="isOtpSetupReady"
                    :value="otpKeyUrl"
                    :options="{ width: 128 }"
                  ></qrcode>
                </div>
                <div>
                  {{ $t('Settings.google_auth_secret') }}: {{otpKey}}
                </div>
              </div>
              <v-form
                class="cce-settings__update-user-form"
              >
                <div>
                  <v-text-field
                    :label="$t('Settings.google_auth_code_label')"
                    required
                    color="teal lighten-2"
                    v-model="otpCode"
                  ></v-text-field>
                </div>
                <div>
                  <v-text-field
                    :label="$t('Settings.current_password_label')"
                    required
                    color="teal lighten-2"
                    v-model="oldPassword"
                    :type="'password'"
                  ></v-text-field>
                </div>
                <div>
                  <v-btn
                    @click="submitChangeOTP"
                    :loading="busy"
                    :disabled="busy"
                  >
                    {{ $t('Settings.save') }}
                  </v-btn>
                </div>
              </v-form>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>

          <v-expansion-panel-content
            :key="2"
            :value="initSection === 'change-phishing'"
            :lazy="true"
          >
            <div slot="header" v-if="!antiPhishingEnabled">{{ $t('Settings.enable_anti_phishing_code') }}</div>
            <div slot="header" v-if="antiPhishingEnabled">{{ $t('Settings.disable_anti_phishing_code') }}</div>
            <v-card>
              <v-card-text>
              <v-form
                class="cce-settings__update-user-form"
              >
                <div v-if="antiPhishingEnabled">
                  <span color="teal lighten-2" > {{currentSettings.antiPhishingCode}} </span>
                </div>
                <div v-if="!antiPhishingEnabled">
                  <v-text-field
                    :label="$t('Settings.anti_phishing_code_label')"
                    required
                    color="teal lighten-2"
                    v-model="antiPhishingCode"
                  ></v-text-field>
                </div>
                <div>
                  <v-text-field
                    :label="$t('Settings.current_password_label')"
                    required
                    color="teal lighten-2"
                    v-model="oldPassword"
                    :type="'password'"
                  ></v-text-field>
                </div>
                <div>
                  <v-btn
                    @click="submitChangeAntiPhishing"
                    :loading="busy"
                    :disabled="busy"
                  >
                    {{ $t('Settings.save') }}
                  </v-btn>
                </div>
              </v-form>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>

          <v-expansion-panel-content
            :key="3"
            :value="initSection === 'change-sms'"
            :lazy="true"
          >
            <div slot="header" v-if="!phoneEnabled">{{ $t('Settings.enable_sms_auth') }}</div>
            <div slot="header" v-if="phoneEnabled">{{ $t('Settings.disable_sms_auth') }}</div>
            <v-card>
              <v-card-text>
              <v-form
                class="cce-settings__update-user-form"
              >
                <div v-if="!smsCodeSent && !phoneEnabled">
                  <phone-number-input v-on:phone-input="phoneInputChanged" />
                </div>
                <div v-if="smsCodeSent">
                  <v-text-field
                    :label="$t('Settings.sms_code_label')"
                    required
                    color="teal lighten-2"
                    v-model="smsCode"
                    :type="'tel'"
                  ></v-text-field>
                </div>
                <div>
                  <v-text-field
                    :label="$t('Settings.current_password_label')"
                    required
                    color="teal lighten-2"
                    v-model="oldPassword"
                    :type="'password'"
                  ></v-text-field>
                </div>
                <div>
                  <v-btn
                    @click="submitChangePhoneNumber"
                    :loading="busy"
                    :disabled="busy"
                  >
                    {{ $t('Settings.save') }}
                  </v-btn>
                </div>
              </v-form>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>

        </v-expansion-panel>

      </div>
    </v-flex>
  </v-layout>
</template>

<script>
  /* ============
   * Settings page
   * ============
   *
   * User Settings page for the account section
   */
  import speakeasy from 'speakeasy';
  import Qrcode from '@chenfengyuan/vue-qrcode';
  import User from '@/proxies/UserProxy';
  import PhoneNumberInput from '@/components/PhoneNumberInput';
  import handleErrorMessage from '@/utils/handleErrorMessage';

  export default {
    name: 'account-settings',
    data() {
      return {
        oldPassword: null,
        password: null,
        passwordAgain: null,
        otpKey: undefined,
        otpKeyUrl: undefined,
        otpKeyHex: undefined,
        otpCode: undefined,
        error: null,
        busy: false,
        success: false,
        phoneNumber: null,
        antiPhishingCode: null,
        smsCodeSent: false,
        smsCode: undefined,
        googleAuthName: this.$themeSettings.googleAuthName || 'ChainCreator.exchange',
      };
    },
    mounted() {
      // @TODO this shouldn't be called here because the Store is not loaded atm;
      // rely on isOtpSetupReady() instead
      this.generateOTPKey();
    },
    computed: {
      isOtpSetupReady() {
        if (!this.currentSettings || !this.currentSettings.email) {
          return false;
        }
        this.generateOTPKey();
        return true;
      },
      currentSettings() {
        return this.$store.getters['account/user'] || {};
      },
      otpEnabled() {
        return !!this.currentSettings.otpEnabled;
      },
      phoneEnabled() {
        return !!this.currentSettings.phoneEnabled;
      },
      antiPhishingEnabled() {
        return !!this.currentSettings.antiPhishingCode;
      },
      initSection() {
        return this.$route.params.section;
      },
    },
    methods: {
      async submitChangePassword() {
        this.error = null;
        this.success = false;
        if (this.password === null || this.busy) {
          return;
        }
        if (this.password !== this.passwordAgain) {
          this.error = this.$t('Settings.passwords_dont_match');
          return;
        }
        this.busy = true;
        try {
          const data = {
            oldPassword: this.oldPassword,
            password: this.password,
            otpCode: this.otpCode,
          };
          await new User().updateUser(data);
          await this.$store.dispatch('account/getUser');
          this.busy = false;
          this.oldPassword = null;
          this.password = null;
          this.passwordAgain = null;
          this.otpCode = undefined;
          this.success = true;
        } catch (e) {
          this.error = handleErrorMessage(e);
          this.busy = false;
          this.success = false;
        }
      },

      async submitChangeOTP() {
        this.error = null;
        this.success = false;

        if (!this.otpEnabled && this.otpKey) {
          const validOtpCode = speakeasy.totp.verify({
            secret: this.otpKeyHex,
            encoding: 'hex',
            token: this.otpCode,
            window: 2,
          });
          if (!validOtpCode) {
            this.error = this.$t('Settings.incorrect_otp_code');
            return;
          }
        }

        this.busy = true;

        try {
          const data = {
            oldPassword: this.oldPassword,
            otpKey: this.otpEnabled ? 'disabled' : this.otpKey,
            otpCode: this.otpCode,
          };
          await new User().updateUser(data);
          await this.$store.dispatch('account/getUser');
          this.busy = false;
          this.oldPassword = null;
          this.otpCode = undefined;
          this.otpKey = undefined;
          this.otpKeyHex = undefined;
          this.otpKeyUrl = undefined;
          this.success = true;
          this.generateOTPKey();
        } catch (e) {
          this.error = handleErrorMessage(e);
          this.busy = false;
          this.success = false;
        }
      },

      generateOTPKey() {
        if (!this.otpKey && this.currentSettings.email) {
          const res = speakeasy.generateSecret({
            length: 20,
            name: `${this.googleAuthName} (${this.currentSettings.email})`,
            issuer: this.googleAuthName,
          });
          this.otpKey = res.base32;
          this.otpKeyHex = res.hex;
          this.otpKeyUrl = res.otpauth_url;
        }
      },
      async submitChangeAntiPhishing() {
        this.error = null;
        this.success = false;

        this.busy = true;

        try {
          const data = {
            oldPassword: this.oldPassword,
            antiPhishingCode: !this.antiPhishingCode ? 'disabled' : this.antiPhishingCode,
          };
          if (this.otpEnabled) {
            data.otpCode = this.otpCode;
          }
          await new User().updateUser(data);
          await this.$store.dispatch('account/getUser');
          this.busy = false;
          this.oldPassword = null;
          this.success = true;
        } catch (e) {
          this.error = e
            ? (handleErrorMessage(e))
            : this.$t('Settings.generel_error');
          this.busy = false;
          this.success = false;
        }
      },
      async submitChangePhoneNumber() {
        this.error = null;
        this.success = false;

        this.busy = true;

        try {
          const data = {
            password: this.oldPassword,
            phone: !this.phoneNumber ? 'disabled' : this.phoneNumber,
          };
          if (this.smsCode) {
            data.smsCode = this.smsCode;
          }
          if (this.phoneNumber) {
            await new User().registerPhone(data);
          } else {
            await new User().updateUser({
              phone: 'disabled',
              oldPassword: this.oldPassword,
            });
          }
          await this.$store.dispatch('account/getUser');
          this.busy = false;
          this.oldPassword = null;
          this.success = !!this.smsCode || data.phone === 'disabled';
          this.smsCodeSent = this.phoneNumber && !this.smsCode;
          this.smsCode = null;
        } catch (e) {
          this.error = handleErrorMessage(e);
          this.busy = false;
          this.success = false;
        }
      },
      phoneInputChanged(val) {
        this.phoneNumber = val;
      },
    },
    components: {
      Qrcode,
      PhoneNumberInput,
    },
  };
</script>
