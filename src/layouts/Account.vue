<template>
  <v-app
    class="cce-account"
    :dark="themeMode"
  >
    <v-navigation-drawer
      v-model="drawer"
      static
      width="250"
      floating
      class="cce-account__navigation pt-5"
      app
    >
      <v-list class="cce-account__navigation-list">
        <v-layout show-mobile>
          <div class="user-profile-mobile">
            <div class="user-avatar"><v-icon>fas fa-user-circle</v-icon></div>
            <div class="user-info">
              <p><span>{{username}}</span></p>
              <v-btn
                      icon
                      @click="close"
              >
                <v-icon>fas fa-sign-out-alt</v-icon>
              </v-btn>
            </div>
          </div>
        </v-layout>
        <v-list-tile
          :to="{name: 'trade.index'}"
          :key="'Trade'"
          :class="{'cce-account__navigation-list-item': true}"
          @click="handleHref('/#/trade')"
        >
          <v-list-tile-content>
            <v-icon>fas fa-chart-line</v-icon>
            <v-list-tile-title>Trade<span></span></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <hr class="my-3">
        <v-list-tile
          v-for="item in navItems"
          :to="{ name: item.to }"
          :key="item.name"
          :inactive="item.inactive"
          :class="{
            'cce-account__navigation-list-item': true,
            'list__tile--link': item.inactive,
            // set custom active class when nested tabs are opened
            'custom__list__tile--active': item.activeTabs
              && item.activeTabs.includes($route.name)
              && $route.name !== item.name,
          }"
          @click="handleHref(item.href)"
        >
          <v-list-tile-content>
            <div v-if="isWarningVisible && item.name === 'Settings'" class="cce-warning__container">
              <v-icon>{{ item.icon }}</v-icon>
              <div class="cce-warning__container__icon">!</div>
            </div>
            <v-icon v-else>{{ item.icon }}</v-icon>
            <v-list-tile-title>{{ $t(`Navigation['${item.name}']`) }} <span>{{ item.special }}</span></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <hr v-if="isAdmin" class="my-3">
          <!-- :to="{name: 'account.admin'}" -->
        <v-list-tile
          v-if="isAdmin"
          :key="'Admin Portal'"
          :class="{'cce-account__navigation-list-item': true}"
          @click="isAdminSubmenuVisible = !isAdminSubmenuVisible"
        >
          <v-list-tile-content :style="{ position: 'relative' }">
            <v-icon>far fa-user-circle</v-icon>
            <v-list-tile-title>{{ $t('Navigation.admin_portal') }}</v-list-tile-title>
            <v-icon class="cce-account__navigation-list-icon--absolute">fas fa-chevron-down</v-icon>
          </v-list-tile-content>
        </v-list-tile>
        <template v-if="isAdmin && isAdminSubmenuVisible">
          <admin-sub-menu />
        </template>
        <v-spacer/>
        <v-layout d-flex class="cce-account__navigation__static-menu" fill-height mt-a>
          <ul class="static-menu">
            <li v-for="(item, index) in navStaticPages" :key="index">
              <a @click="handleHrefBlank(item.href)">{{ $t(`StaticPages['${item.name}']`) }}</a></li>
          </ul>
        </v-layout>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar
      app
      fixed
      flat
      class="cce-account__toolbar"
    >
      <a @click="handleHref(logoHref)" class="cce-account__logo">
        <img :src=logoUrlAccount :title="$appTitle" />
      </a>

      <v-layout justify-end>
        <v-btn
                icon
                @click="toggleThemeMode()"
                class="hidden-md-and-up"
        >
          <v-icon class="toolbar-icon">fas fa-adjust</v-icon>
        </v-btn>
        <cc-apps v-show="showAllApps" class="on-mobile" />
        <ul class="user-menu">
          <li>{{ $t('Account.welcome') }} <span>{{username}}</span></li>
          <li>
            <v-btn
               icon
               @click="toggleThemeMode()"
            >
               <v-icon class="toolbar-icon">fas fa-adjust</v-icon>
            </v-btn>
          </li>
          <li v-show="showAllApps">
            <cc-apps />
          </li>
          <li>
            <v-btn
                    icon
                    class="cce-trade__bar-icons-logout"
                    @click="close"
            >
              <v-icon class="toolbar-icon">fas fa-chart-line</v-icon>
            </v-btn>
          </li>
          <li>
            <v-btn
                    icon
                    class="cce-trade__bar-icons-logout"
                    @click="logout"
            >
              <v-icon class="toolbar-icon">fas fa-sign-out-alt</v-icon>
            </v-btn>
          </li>
        </ul>
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      </v-layout>

      <!-- <v-btn
        icon
        @click="close"
      >
        <v-icon large>close</v-icon>
      </v-btn> -->

    </v-toolbar>
    <v-content
      class="cce-account__content pt-5"
      v-show="ready"
    >
      <v-container
        fluid
      >
        <!-- INSERT CONTENT HERE -->
        <slot></slot>

      </v-container>
    </v-content>
    <notifications
      position="top center"
      :duration="7000"
      :width="350"
      :max="8"
      :speed="800"
      classes="cce-notification"
    />
    <!-- Loader -->
    <div
      class="cce-overlay"
      v-if="!ready"
    >
      <progress-spinner :width="3" color="blue" />
    </div>
  </v-app>
</template>

<script>
  /* ============
   * Account layout
   * ============
   *
   * Account layout for the account section
   */

  import User from '@/proxies/UserProxy';
  import CcApps from '@/components/CcApps';
  import ProgressSpinner from '@/components/UI/ProgressSpinner';
  import AdminSubMenu from '@/components/AdminPortal/AdminSubMenu';

  export default {
    name: 'account-layout',
    components: {
      CcApps,
      ProgressSpinner,
      AdminSubMenu,
    },
    data() {
      return {
        logoUrlAccount: '',
        logoHref: this.$themeSettings.logoHref,
        showAllApps: this.$themeSettings.showAllApps,
        drawer: false,
        navItems: this.$themeSettings.navItems,
        navStaticPages: this.$themeSettings.navStaticPages,
        isAdminSubmenuVisible: false,
        isMobile: false,
      };
    },
    mounted() {
      this.init();
      this.throwWarning();

      window.addEventListener('resize', this.resizeWindow);
    },
    computed: {
      /**
       * Returns `ready` state from store
       * @returns {Boolean}
       */
      ready() {
        return this.$store.getters['app/ready'] && this.$store.getters['account/ready'];
      },

      /**
       * Returns current user object from store
       * @returns {Object}
       */
      currentUser() {
        const user = this.$store.getters['account/user'];
        return user || false;
      },

      /**
       * Returns if current user is an admin
       * @returns {Boolean}
       */
      isAdmin() {
        return this.$store.getters['admin/isAdmin'];
      },

      /**
       * Returns user account status
       * @returns {Boolean}
       */
      unconfirmedAccount() {
        return this.currentUser && this.currentUser.status === 'unconfirmed';
      },

      /**
       * Returns user account status
       * @returns {Boolean}
       */
      betaAccount() {
        return this.currentUser && this.currentUser.status === 'beta';
      },

      /**
       * Returns username extracted from email address
       * @returns {String}
       */
      username() {
        const user = this.$store.getters['account/user'];
        if (!user) return '';
        return user.email.substr(0, user.email.indexOf('@'));
      },

      /**
       * Returns OTP setting status
       * @returns {Boolean}
       */
      otpDisabled() {
        return this.currentUser && this.currentUser.otpEnabled === false;
      },

      /**
       * Returns theme mode
       * @returns {Boolean}
       */
      themeMode() {
        return this.$store.getters['app/themeMode'];
      },

      /**
       * Returns if account has any warning
       * @returns {Boolean}
       */
      isWarningVisible() {
        return this.unconfirmedAccount || this.betaAccount || this.otpDisabled;
      },

      /**
      * Return project settings
      */
      appSetting() {
        return this.$store.getters['app/getAppSetting'];
      },
    },
    methods: {
      resizeWindow() {
        const node = document.querySelector('.show-mobile');
        if (node) {
          const display = getComputedStyle(node).display;
          if (display === 'none') {
            this.isMobile = false;
          } else {
            this.isMobile = true;
          }

          this.setLogoUrl(this.appSetting);
        }
      },

      init() {
        this.$store.dispatch('account/init');
        document.title = this.$appTitle;
        this.drawer = !this.$vuetify.breakpoint.mdAndDown;
        this.$store.dispatch('admin/init');
        this.setLogoUrl(this.appSetting);
      },

      /**
       * Shows warning notifications
       */
      throwWarning() {
        if (this.otpDisabled) {
          this.$notify({
            type: 'warn',
            speed: 0,
            duration: -1,
            text: this.$t('Account.enable_2fa_auth'),
          });
        }
        if (this.unconfirmedAccount) {
          this.$notify({
            type: 'warn',
            speed: 0,
            duration: -1,
            text: this.$t('Account.check_email_and_confirm'),
          });
        }
        if (this.betaAccount) {
          this.$notify({
            type: 'warn',
            speed: 0,
            duration: -1,
            text: this.$t('Account.trading_is_disabled'),
          });
        }
      },

      /**
       * Changes theme mode
       */
      toggleThemeMode() {
        this.$store.dispatch('app/toggleThemeMode');
      },

      /**
       * Logs user out
       */
      async logout() {
        await new User().logOut();
        this.$store.dispatch('auth/logout');
      },

      /**
       * Redirects to the Trade page
       */
      close() {
        this.$router.push({
          name: 'trade.index',
        });
      },

      /**
       * Handles `href` clicking and opens it in the current window
       * @param {String} link given link
       */
      handleHref(link) {
        if (link !== undefined) {
          window.open(link, '_self');
        }
      },

      /**
       * Handles `href` clicking and opens it in the separate window
       * @param {String} link given link
       */
      handleHrefBlank(link) {
        if (link !== undefined) {
          window.open(link, '_blank');
        }
      },

      setLogoUrl(setting) {
        if (!('themeSettings' in setting)) {
          setTimeout(() => {
            this.setLogoUrl(this.appSetting);
          }, 1000);
          return;
        }

        if (this.themeMode) {
          if (this.isMobile) {
            this.logoUrlAccount = `${setting.themeSettings.s3_endpoint}/${setting.assetsBucket}${setting.themeSettings.logoUrlAccountMobileDark}?rnd=${Math.random()}`;
          } else {
            this.logoUrlAccount = `${setting.themeSettings.s3_endpoint}/${setting.assetsBucket}${setting.themeSettings.logoUrlAccount}?rnd=${Math.random()}`;
          }
        } else if (this.isMobile) {
          this.logoUrlAccount = `${setting.themeSettings.s3_endpoint}/${setting.assetsBucket}${setting.themeSettings.logoUrlAccountMobileLight}?rnd=${Math.random()}`;
        } else {
          this.logoUrlAccount = `${setting.themeSettings.s3_endpoint}/${setting.assetsBucket}${setting.themeSettings.logoUrlAccountLight}?rnd=${Math.random()}`;
        }

        this.logoHref = setting.themeSettings.logoHref;

        this.navStaticPages = setting.themeSettings.navStaticPages;
      },
    },
    watch: {
      /**
       * Resets warning notifications to avoid duplications on `Settings` page
       * @param {Object} newRoute updated route data
       */
      $route(newRoute) {
        if (newRoute.name === 'account.settings') {
          this.$notify({ clean: true });
          this.throwWarning();
        }
      },

      /**
       * reset logo url account
       */
      appSetting(next) {
        this.setLogoUrl(next);
      },

      themeMode() {
        this.setLogoUrl(this.appSetting);
      },
    },
  };
</script>
