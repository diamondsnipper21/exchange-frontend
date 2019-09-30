<template>
  <v-layout>
    <v-flex>
      <div class="title">{{ $t('PartnerRegister.start') }}</div>
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
            {{ $t('PartnerRegister.account_successfully_created') }}
          </v-alert>

          <v-form
            class="cce-auth__register-form"
            v-if="!success"
            @submit.prevent="submit"
          >
            <div>
              <v-text-field
                :label="$t('PartnerRegister.form_label_exchange')"
                required
                color="teal lighten-2"
                v-model.trim="exchangeName"
              ></v-text-field>
            </div>
            <div>
              <v-text-field
                :label="$t('PartnerRegister.form_label_email')"
                required
                color="teal lighten-2"
                v-model.trim="email"
              ></v-text-field>
            </div>
            <div>
              <v-text-field
                :label="$t('PartnerRegister.form_label_password')"
                id="passElement"
                required
                color="teal lighten-2"
                v-model="password"
                :type="'password'"
              ></v-text-field>
            </div>
            <div>
              <v-text-field
                :label="$t('PartnerRegister.form_label_repeat_password')"
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
                {{ $t('PartnerRegister.create_exchange') }}
              </v-btn>
            </div>
          </v-form>

        </div>
      </template>

    </v-flex>
  </v-layout>
</template>

<script>
  /* ============
   * Partner Register Form
   * ============
   *
   * Create partner register form
   */
  import VLayout from '@/layouts/Partner';
  import Partner from '@/proxies/PartnerProxy';
  import { calculateRating, assessTotalScore } from '@/utils/validation';
  import handleErrorMessage from '@/utils/handleErrorMessage';

  export default {
    name: 'register-form',
    components: {
      VLayout,
    },
    data() {
      return {
        exchangeName: null,
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
        if (this.email === null || this.email === ''
         || this.password === null || this.password === ''
         || this.passwordAgain === null || this.passwordAgain === ''
         || this.exchangeName === null || this.exchangeName === ''
         || this.busy) {
          return;
        }

        const regex = /[\da-zA-Z-\s]+/g;
        const exchangeNameStr = this.exchangeName.match(regex).join('');

        if (exchangeNameStr !== this.exchangeName) {
          this.error = this.$t('PartnerRegister.exchange_name_not_correct');
          return;
        }

        if (this.password !== this.passwordAgain) {
          this.error = this.$t('PartnerRegister.passwords_dont_match');
          return;
        }

        this.busy = true;
        try {
          const data = {
            email: this.email,
            password: this.password,
            exchangeName: this.exchangeName,
          };

          const partner = await new Partner().register(data);
          const domain = `http://${partner.result[0].domain}/#/login`;
          this.busy = false;
          this.email = null;
          this.password = null;
          this.exchangeName = null;
          this.success = true;

          setTimeout(() => {
            window.location.href = domain;
          }, 5000);
        } catch (e) {
          console.log(e);
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
          weak: this.$t('PartnerRegister.password_message_weak'),
          moderate: this.$t('PartnerRegister.password_message_moderate'),
          strong: this.$t('PartnerRegister.password_message_strong'),
        };

        const calculatedRating = calculateRating(passwordArray, rating);
        const ratingElement = document.querySelector('.rating');
        assessTotalScore(ratingElement, calculatedRating, passwordLevelText);
      },
    },
  };
</script>
