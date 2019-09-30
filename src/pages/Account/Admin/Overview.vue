<template>
  <v-layout column fill-height>
    <v-layout class="pb-2" :style="{ maxHeight: !isMobile ? '300px' : '100%' }">
      <admin-statistics />
    </v-layout>
    <v-layout row wrap fill-height>
      <v-flex xs12 md6 :class="{ 'pr-2': !isMobile, 'pb-2': isMobile }">
        <admin-recent-trades />
      </v-flex>
      <v-flex xs12 md6 >
        <admin-new-users />
      </v-flex>
    </v-layout>
  </v-layout>
</template>

<script>
/* ============
* Overview page
* ============
*
* Overview page for the account admin portal section
*/
import AdminNewUsers from '@/components/AdminPortal/AdminNewUsers';
import AdminRecentTrades from '@/components/AdminPortal/AdminRecentTrades';
import AdminStatistics from '@/components/AdminPortal/AdminStatistics';

export default {
  name: 'account-admin-overview',
  components: {
    AdminNewUsers,
    AdminRecentTrades,
    AdminStatistics,
  },
  mounted() {
    this.init();
  },
  computed: {
    /**
     * Returns if the window width is less than 960px
     * @returns {Boolean}
     */
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },

    /**
     * Returns if the current user is an admin
     * @returns {Boolean}
     */
    isAdmin() {
      return this.$store.getters['admin/isAdmin'];
    },
  },
  methods: {
    /**
     * Makes requests to fetch users and trades data
     */
    init() {
      this.$store.dispatch('admin/newUsers', 35);
      this.$store.dispatch('admin/recentTrades', { count: 35, skipMatches: true });

      setTimeout(() => {
        this.init();
      }, 8000);
    },
  },
  watch: {
    /**
     * Runs `init` method when `isAdmin` state changes
     * @param {Boolean} next new value
     */
    isAdmin(next) {
      if (next) this.init();
    },
  },
};
</script>
