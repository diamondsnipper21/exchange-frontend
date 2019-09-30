<template>
  <v-layout column>
    <!-- ===================== BANNERS ==================== -->
    <!-- <div class="pb-2">
      <v-carousel 
        class="dashboard-carousel"
        hide-controls
        interval="7000"
      >
        <v-carousel-item
          v-for="(item,i) in carouselItems"
          :key="i"
          :src="item.src"
          :class="item.class"
        >
          <h3 v-html="$t(`CarouselItems['${item.h3}'].h3`)"></h3>
          <p v-html="$t(`CarouselItems['${item.h3}'].p_1`)"></p>
          <p v-html="$t(`CarouselItems['${item.h3}'].p_2`)"></p>
          <v-btn
            :key="item.btnName"
            :to="item.to"
            @click="handleHref(item.href)"
          >
            {{ $t(`CarouselItems['${item.h3}'].btnName`) }}
          </v-btn>
          <img class="right-img" :src="item.secondImage">
        </v-carousel-item>
      </v-carousel>
    </div> -->
  <!-- ===================== BANNERS end ==================== -->

 
    <v-layout class="pb-2" :style="{ maxHeight: !isMobile ? '300px' : '100%' }">
      <user-stats />
    </v-layout>
    <v-layout row wrap fill-height>
      <v-flex xs12 md6 :class="{ 'pr-2': !isTablet, 'pb-2': isTablet }">
        <recent-activity-table />
      </v-flex>
      <v-flex xs12 md6 >
        <login-history-table />
      </v-flex>
    </v-layout>
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
import UserStats from '@/components/Dashboard/UserStats';
import RecentActivityTable from '@/components/Dashboard/RecentActivityTable';
import LoginHistoryTable from '@/components/Dashboard/LoginHistoryTable';

export default {
  name: 'account-dashboard',
  data() {
    return {
      carouselItems: this.$themeSettings.carouselItems,
    };
  },
  components: {
    UserStats,
    RecentActivityTable,
    LoginHistoryTable,
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
