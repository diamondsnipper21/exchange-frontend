<template>
  <v-layout column fill-height class="cce-admin_panel_settings">
    <widget-header @onChangeTab="changeTab">
    </widget-header>
    <template v-if="tab === tabNumber.branding">
      <widget-branding
      />
    </template>
    <template v-if="tab === tabNumber.markets">
      <widget-markets
      />
    </template>
    <template v-if="tab === tabNumber.other">
      <widget-other
      />
    </template>
  </v-layout>
</template>

<script>
  /* ============
   * Branding page
   * ============
   *
   * Branding page for the account admin portal section
   */
  import WidgetHeader from '@/components/Settings/WidgetHeader';
  import WidgetBranding from '@/components/Settings/Branding/WidgetBranding';
  import WidgetMarkets from '@/components/Settings/Markets/WidgetMarkets';
  import WidgetOther from '@/components/Settings/Other/WidgetOther';
  
  export default {
    name: 'account-admin-branding',
    components: {
      WidgetHeader,
      WidgetBranding,
      WidgetMarkets,
      WidgetOther,
    },
    mounted() {
    },
    data() {
      return {
        tab: 0,
        loading: false,
        wallets: {},
        tabNumber: {
          branding: 0,
          markets: 1,
          // admins: 2,
          other: 2,
        },
      };
    },
    computed: {
    },
    methods: {
      /**
     * Saves tab changing and executes functions depending on tab
     * @param {Number} tabIndex data comes with `onChangeTab` event from `orders-header` component
     */

      changeTab(tabIndex) {
        this.tab = tabIndex;
      },
    },
  };
</script>
