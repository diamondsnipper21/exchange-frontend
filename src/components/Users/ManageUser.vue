<template>
  <div class="cce-admin__panel">
    <div class="cce-admin__panel-title">
      <span>{{ $t('AdminManageUser.manage_user') }}</span>
    </div>
    <div class="cce-admin_panel-form-row">
        <v-layout row wrap>
            <v-flex d-flex xs3 sm1>
                <span style="text-align:right">{{ $t('AdminManageUser.user_email') }}:</span>
            </v-flex>
            <v-flex d-flex xs9 sm7 class="pl-2">
                <input
                class="cce-admin_panel-control-input-text"
                v-model="user_email"
                :class="{ 'cce-trade__trade-form-control-input--error': hasError }"
                @blur="blur"
                />
            </v-flex>
            <v-flex d-flex xs12 sm3 :class="{ 'pt-2': isMobile }">
                <v-btn
                  class='cce-admin_panel-control-button'
                  @click="findUser"
                >
                {{ $t('AdminManageUser.search') }}
                </v-btn>
            </v-flex>
        </v-layout>
    </div>
  </div>
</template>

<script>
  /* ============
   * Users page
   * ============
   *
   * Users page for the account admin portal section
   */

  export default {
    name: 'manage-user',
    mounted() {
    },
    data() {
      return {
        user_email: '',
        hasError: false,
      };
    },
    computed: {
      /**
      * Returns if the window width is less than 960px
      * @returns {Boolean}
      */
      isMobile() {
        return this.$vuetify.breakpoint.smAndDown;
      },
    },
    methods: {
      async findUser() {
        if (this.user_email === '') {
          this.hasError = true;
          return;
        }
        try {
          await this.$store.dispatch('account/getUserByEmail', { email: this.user_email });
        } catch (err) {
          this.$notify({
            type: 'warn',
            text: err.error.code,
          });
        }
      },

      blur() {
        this.hasError = false;
      },
    },
  };
</script>
