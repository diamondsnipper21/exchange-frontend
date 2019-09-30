<template>
  <v-layout>
    <router-view></router-view>
  </v-layout>
</template>

<script>
  /* ============
   * Account pages
   * ============
   *
   * Routes to account pages
   */
  import VLayout from '@/layouts/Account';

  export default {
    name: 'account-index',
    components: {
      VLayout,
    },
  };
</script>
