<template>
  <v-layout column fill-height class="cce-admin_panel_user">
    <v-layout class="pb-2" :style="{ maxHeight: !isMobile ? '90px' : '100%' }">
      <manage-user/>
    </v-layout>

    <v-layout class="pb-2" :style="{ maxHeight: !isMobile ? '260px' : '100%' }">
      <user-detail/>
    </v-layout>

    <v-layout class="pb-2" style="width:100%; overflow:auto;">
      <user-widget/>
    </v-layout>
  </v-layout>
</template>

<script>
  import ManageUser from '@/components/Users/ManageUser';
  import UserDetail from '@/components/Users/UserDetail';
  import UserWidget from '@/components/Users/UserWidget';
  /* ============
   * Users page
   * ============
   *
   * Users page for the account admin portal section
   */

  export default {
    name: 'account-admin-users',
    components: {
      ManageUser,
      UserDetail,
      UserWidget,
    },
    mounted() {
    },
    data() {
      return {
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
    },
  };
</script>
