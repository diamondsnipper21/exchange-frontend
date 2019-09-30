<template>
  <div class="cce-admin__panel">
      <div class="cce-admin_panel-form-row pl-3 pr-3 pt-3">
        <v-layout row wrap>
            <v-flex sm4 xs12>
                <v-layout class="pb-4" row>
                    <v-flex d-flex xs4 class="cce-admin_panel-label-right">
                        <span class="pl-3">{{ $t('AdminManageUser.first_name') }}:</span>
                    </v-flex>
                    <v-flex d-flex xs8>
                        <input
                        class="cce-admin_panel-control-input-text"
                        v-model="first_name"
                        />
                    </v-flex>
                </v-layout>
                <v-layout class="pb-2" row>
                    <v-flex d-flex xs4 class="cce-admin_panel-label-right">
                        <span class="pl-3">{{ $t('AdminManageUser.email') }}:</span>
                    </v-flex>
                    <v-flex d-flex xs8>
                        <input
                        class="cce-admin_panel-control-input-text"
                        v-model.trim="email"
                        :class="{ 'cce-trade__trade-form-control-input--error': hasEmailError }"
                        />
                    </v-flex>
                </v-layout>
                <v-layout class="pb-3" row>
                    <v-flex d-flex xs4 class="cce-admin_panel-label-right">
                        <span class="pl-3">{{ $t('AdminManageUser.status') }}:</span>
                    </v-flex>
                    <v-flex d-flex xs8 sm8>
                        <v-select
                        :items="items"
                        class="cce-admin_panel-control-select"
                        single-line
                        dense
                        v-model="status"
                        />
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex sm4 xs12>
                <v-layout class="pb-4" row>
                    <v-flex d-flex xs4 class="cce-admin_panel-label-right">
                        <span class="pl-3">{{ $t('AdminManageUser.last_name') }}:</span>
                    </v-flex>
                    <v-flex d-flex xs8>
                        <input
                        class="cce-admin_panel-control-input-text"
                        v-model="last_name"
                        />
                    </v-flex>
                </v-layout>
                <v-layout class="pb-2" row>
                    <v-flex d-flex xs4 class="cce-admin_panel-label-right">
                        <span class="pl-3">{{ $t('AdminManageUser.phone') }}:</span>
                    </v-flex>
                    <v-flex d-flex xs8>
                        <input
                        class="cce-admin_panel-control-input-text"
                        v-model="phone"
                        />
                    </v-flex>
                </v-layout>
                <v-layout class="pb-3 pt-3" row>
                    <v-flex d-flex xs4 class="cce-admin_panel-label-right">
                        <span class="pl-3">{{ $t('AdminManageUser.two_factor') }}:</span>
                    </v-flex>
                    <v-flex d-flex xs8>
                        <div class="cce-admin_panel-2fa-container">
                            <div class="cce-admin_panel-2fa-sms cce-admin_panel-2fa-status"
                            :class="{ 'cce-admin_panel-2fa-active' : two_factor === 'sms' }">
                                <span>SMS</span>
                            </div>
                            <div class="cce-admin_panel-2fa-ga cce-admin_panel-2fa-status"
                            :class="{ 'cce-admin_panel-2fa-active' : two_factor === 'ga' }">
                                <span>GA</span>
                            </div>
                            <div class="cce-admin_panel-2fa-none cce-admin_panel-2fa-status"
                            :class="{ 'cce-admin_panel-2fa-active' : two_factor === '' }">
                                <span>NONE</span>
                            </div>
                        </div>
                    </v-flex>
                </v-layout>
                <v-layout class="pb-3 cce-admin_panel-save-row" row v-if="!isMobile">
                    <v-flex d-flex xs4 class="cce-admin_panel-label-right">
                        <span class="pl-3"></span>
                    </v-flex>
                    <v-flex d-flex xs8>
                        <v-btn class='cce-admin_panel-control-button cce-admin_panel-control-button-save'
                        @click="showModal()"
                        >
                        {{ $t('AdminManageUser.save_btn') }}
                        </v-btn>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex sm4 xs12>
                <v-layout class="pb-3" row>
                    <v-flex d-flex xs4 class="cce-admin_panel-label-right">
                        <span class="pl-3">{{ $t('AdminManageUser.kyc') }}:</span>
                    </v-flex>
                    <v-flex d-flex xs8>
                        <div class="cce-admin_panel-kyc-panel"></div>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex xs12>
              <v-layout class="pb-3 cce-admin_panel-save-row" row v-if="isMobile">
                  <v-flex d-flex xs4 class="cce-admin_panel-label-right">
                      <span class="pl-3"></span>
                  </v-flex>
                  <v-flex d-flex xs8>
                      <v-btn class='cce-admin_panel-control-button cce-admin_panel-control-button-save'
                      @click="showModal()"
                      >
                      {{ $t('AdminManageUser.save_btn') }}
                      </v-btn>
                  </v-flex>
              </v-layout>
            </v-flex>
        </v-layout>
      </div>
      <template>
        <widget-modal
          :title="$t('AdminManageUser.modal_save_title')"
          :message="$t('AdminManageUser.modal_save_message')"
          v-if="isModalVisible"
          @onClose="isModalVisible = !isModalVisible"
          @onConfirm="saveUser()"
        />
      </template>
  </div>
</template>

<script>
  /* ============
   * Users page
   * ============
   *
   * Users page for the account admin portal section
   */
  import WidgetModal from '@/components/Users/Widget/WidgetModal';
  import UserProxy from '@/proxies/UserProxy';

  export default {
    name: 'user-detail',
    components: {
      WidgetModal,
    },
    mounted() {
    },
    data() {
      return {
        isModalVisible: false,
        two_factor: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        status: '',
        busy: false,
        hasEmailError: false,

        userUid: '',
        accountId: '',

        items: ['unconfirmed', 'active', 'blocked', 'noKYC', 'beta', 'newIPLocked', 'countryBlocked', 'closed'],
      };
    },
    computed: {
      user() {
        return this.$store.getters['account/userByEmail'];
      },

      /**
      * Returns if the window width is less than 960px
      * @returns {Boolean}
      */
      isMobile() {
        return this.$vuetify.breakpoint.smAndDown;
      },
    },
    methods: {
      async saveUser() {
        try {
          this.busy = true;
          this.isModalVisible = false;

          const data = {
            firstName: this.first_name,
            lastName: this.last_name,
            email: this.email,
            phone: this.phone,
            status: this.status,
            findUserUid: this.userUid,
          };
          await new UserProxy().updateUserByAdmin(data);
          this.$notify({
            type: 'success',
            text: 'User information is updated.',
          });

          this.busy = false;
        } catch (err) {
          this.$notify({
            type: 'warn',
            text: (err.error && err.error.code) || err,
          });
          this.busy = false;
        }
      },
      showModal() {
        if (this.busy) {
          return;
        }

        if (this.email === '') {
          this.hasEmailError = true;
          return;
        }

        this.isModalVisible = true;
      },
    },
    watch: {
      user(next) {
        if (next) {
          this.first_name = next.firstName == null ? '' : next.firstName;
          this.last_name = next.lastName == null ? '' : next.lastName;
          this.email = next.email;
          this.phone = next.phone == null ? '' : next.phone;
          this.status = next.status;
          this.userUid = next.userUid;
          this.accountUid = next.accountUid;

          if (next.smsKey && next.phone && (next.smsKey !== '') && (next.phone !== '')) {
            this.two_factor = 'sms';
          } else if (next.otpKey && (next.otpKey !== '')) {
            this.two_factor = 'ga';
          } else {
            this.two_factor = '';
          }
        }
      },
    },
  };
</script>
