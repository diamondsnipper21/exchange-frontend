<template>
  <v-layout column> 
    <recent-activity-table />
  </v-layout>
</template>

<script>
/* ============
* Dashboard page
* ============
*
* Dashboard page for the account section
*/

// @TODO: add user stats component instead existing banners
import RecentActivityTable from '@/components/Dashboard/RecentActivityTable';

export default {
  name: 'account-recent',
  data() {
    return {
      carouselItems: this.$themeSettings.carouselItems,
    };
  },
  components: {
    RecentActivityTable,
  },
  computed: {
    /**
     * Returns if window width is less than 960px
     * @returns {Boolean}
     */
    isTablet() {
      return this.$vuetify.breakpoint.smAndDown;
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
    /**
     * Handles `href` using given link
     * @param {String} param link
     */
    handleHref(param) {
      if (param !== undefined) {
        window.open(param, '_blank');
      }
    },
  },
};
</script>
