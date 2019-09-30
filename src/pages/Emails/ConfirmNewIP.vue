<template>
  <v-layout>
    <v-flex>
      <div class="title">{{ $t('ConfirmNewIPPage.login_from_new_ip') }}</div>
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
          {{ $t('ConfirmNewIPPage.account_successfully_unlocked') }}
        </v-alert>
        <div
          v-if="busy"
        >
          {{ $t('ConfirmNewIPPage.unlocking_account') }}
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
   * ConfirmNewIP page
   * ============
   *
   * New IP confirmation page
   */
  import ProgressSpinner from '@/components/UI/ProgressSpinner';
  import User from '@/proxies/UserProxy';
  import handleErrorMessage from '@/utils/handleErrorMessage';

  export default {
    name: 'confirmNewIP',
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
        const type = 'confirmNewIP';
        const token = this.$route.params.token;
        this.busy = true;
        try {
          const res = await new User().logInWithToken({ token, type });
          await this.$store.dispatch('auth/save', res);
          await this.$store.dispatch('auth/check');
          window.location.replace('/#/account/dashboard');
          window.location.reload();
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
      ProgressSpinner,
    },
  };
</script>
