<template>
  <v-bottom-nav
    app
    absolute
    :value="true"
    :active.sync="active"
    v-if="isMobile"
  >
    <v-btn
      v-for="item in navItems"
      :value="item.value"
      :key="item.value"
    >
      <span>{{ item.name }}</span>
      <v-icon>{{ item.icon }}</v-icon>
    </v-btn>
  </v-bottom-nav>
</template>

<script>
  /* ============
   * Bottom navigation bar
   * ============
   *
   * Bottom navigation menu component for the mobile view
   */

  export default {
    name: 'trade-bottom-nav',
    data() {
      return {
        active: 'trade',
        navItems: [
          { name: this.$t('TradeBottomNav.trade'), value: 'trade', icon: 'fa fa-handshake-o' },
          { name: this.$t('TradeBottomNav.book'), value: 'book', icon: 'fa fa-compress' },
          { name: this.$t('TradeBottomNav.charts'), value: 'charts', icon: 'fa fa-bar-chart' },
          { name: this.$t('TradeBottomNav.orders'), value: 'orders', icon: 'fa fa-bars' },
          { name: this.$t('TradeBottomNav.history'), value: 'history', icon: 'fa fa-history' },
        ],
      };
    },
    computed: {
      isMobile() {
        return this.$vuetify.breakpoint.smAndDown;
      },
    },
    watch: {
      // set active nav item
      active(value) {
        this.$store.dispatch('app/setBottomNav', value);
      },
    },
  };
</script>
