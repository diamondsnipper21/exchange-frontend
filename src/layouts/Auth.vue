<template>
  <v-app
    class="cce-auth"
    light
  >
    <v-toolbar
      app
      fixed
      flat
      class="cce-auth__toolbar"
    >
      <div class="cce-account__logo">
        <img :src="logoUrlAccount" />
      </div>
      <v-spacer></v-spacer>
      <v-btn
        icon
        @click="close"
      >
      </v-btn>
    </v-toolbar>

    <v-content class="cce-auth__content">
      <div class="cce-auth-bg-image"></div>
      <v-container>
        <div class="main-logo">
          <img :src=logoUrlAuth />
        </div>
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
  </v-app>
</template>

<script>
/* ============
 * Auth layout
 * ============
 *
 * Auth layout
 */
export default {
  name: 'auth-layout',
  data() {
    return {
      logoUrlAuth: '',
      logoUrlAccount: '',
      isMobile: false,
    };
  },
  methods: {
    /**
     * Redirects to the Trade page
     */
    close() {
      this.$router.push({
        name: 'trade.index',
      });
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

      this.logoUrlAuth = `${setting.themeSettings.s3_endpoint}/${setting.assetsBucket}${setting.themeSettings.logoUrlAuth}?rnd=${Math.random()}`;
    },
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
  },
  mounted() {
    this.setLogoUrl(this.appSetting);
    window.addEventListener('resize', this.resizeWindow);
  },
  computed: {
    /**
    * Return project settings
    */
    appSetting() {
      return this.$store.getters['app/getAppSetting'];
    },
    themeMode() {
      return this.$store.getters['app/themeMode'];
    },
  },
  watch: {
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
