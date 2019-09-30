<template>
  <v-toolbar app flat fixed>
    <v-toolbar-items class="cce-trade__market">
      <a
        class="cce-trade__logo"
        @click="handleHref(logoHref)"
        :title="$appTitle"
      >
        <!-- Header logo -->
        <logo-mobile v-if="isMobile" />
        <!-- <img :src="logoUrlTrade" v-if="isMobile" /> -->
        <logo-trade v-else />
      </a>
      <!-- Markets -->
      <trade-market />
    </v-toolbar-items>
    <v-toolbar-items class="hidden-xs-only">
      <trade-favorites />
    </v-toolbar-items>
    <v-spacer/>
    <!-- Auth -->
    <v-toolbar-items v-if="!authenticated">
      <v-btn
              icon
              class="cce-trade__bar-icons-item"
              @click="toggleThemeMode()"
              :disabled="hasBusyComponents"
      >
        <v-icon class="toolbar-icon">fas fa-adjust</v-icon>
      </v-btn>
      <router-link to=""  v-show="showAllApps">
        <v-cc-apps />
      </router-link>
      <v-btn flat @click="loginWL(customLogin)">
        Log In
      </v-btn>
      <!--<v-btn
        flat
        @click="register"
      >
        Sign up
      </v-btn>-->
    </v-toolbar-items>
    <!-- Actions -->
    <v-toolbar-items v-if="authenticated" class="cce-trade__bar-icons">
      <v-btn
        icon
        class="cce-trade__bar-icons-item"
        @click="toggleThemeMode()"
        :disabled="hasBusyComponents"
      >
        <v-icon class="toolbar-icon">fas fa-adjust</v-icon>
      </v-btn>
      <router-link to="" v-show="showAllApps">
        <v-cc-apps />
      </router-link>
      <v-btn
        icon
        class="cce-trade__bar-icons-item"
        :to="{ name: 'account.dashboard' }"
      >
        <div v-if="isWarningVisible" class="cce-warning__container">
          <v-icon class="toolbar-icon">fas fa-user-circle</v-icon>
          <div class="cce-warning__container__icon cce-warning__container__icon--small">!</div>
        </div>
        <v-icon v-else class="toolbar-icon">fas fa-user-circle</v-icon>
      </v-btn>
      <v-btn
        icon
        class="cce-trade__bar-icons-logout"
        @click="logout"
      >
        <v-icon class="toolbar-icon">fas fa-sign-out-alt</v-icon>
      </v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
  /* ============
   * Top navigation bar
   * ============
   *
   * Top navigation bar component for the trade section
   * Includes Stats and Market components
   */

  import TradeFavorites from '@/components/Trade/TradeFavorites';
  import TradeMarket from '@/components/Trade/TradeMarket';
  import VCcApps from '@/components/CcApps';
  import LogoTrade from '@/components/UI/LogoTrade';
  import LogoMobile from '@/components/UI/LogoMobile';
  import User from '@/proxies/UserProxy';

  export default {
    name: 'trade-bar',
    components: {
      TradeFavorites,
      TradeMarket,
      VCcApps,
      LogoTrade,
      LogoMobile,
    },
    data() {
      return {
        logoHref: this.$themeSettings.logoHref,
        showAllApps: this.$themeSettings.showAllApps,
        customLogin: this.$themeSettings.customLogin,
      };
    },
    computed: {
      authenticated() {
        return this.$store.getters['auth/authenticated'];
      },
      themeMode() {
        return this.$store.getters['app/themeMode'];
      },
      isMobile() {
        return this.$vuetify.breakpoint.smAndDown;
      },
      hasBusyComponents() {
        return this.$store.getters['app/hasBusyComponents'];
      },
      currentUser() {
        const user = this.$store.getters['account/user'];
        return user || false;
      },
      unconfirmedAccount() {
        return this.currentUser && this.currentUser.status === 'unconfirmed';
      },
      betaAccount() {
        return this.currentUser && this.currentUser.status === 'beta';
      },
      otpDisabled() {
        return this.currentUser && this.currentUser.otpEnabled === false;
      },
      isWarningVisible() {
        return this.unconfirmedAccount || this.betaAccount || this.otpDisabled;
      },
      /**
      * Get project settings
      */
      appSetting() {
        return this.$store.getters['app/getAppSetting'];
      },
    },
    methods: {
      login() {
        this.$router.push({ name: 'login' });
      },
      loginWL(param) {
        if (param !== undefined) {
          window.open(param, '_self');
        }
      },
      register() {
        this.$router.push({ name: 'register' });
      },
      async logout() {
        await new User().logOut();
        this.$store.dispatch('auth/logout');
      },
      toggleThemeMode() {
        if (!this.hasBusyComponents) {
          this.$store.dispatch('app/toggleThemeMode');
        }
      },
      handleHref(param) {
        if (param !== undefined) {
          window.open(param, '_self');
        }
      },
    },
  };
</script>
