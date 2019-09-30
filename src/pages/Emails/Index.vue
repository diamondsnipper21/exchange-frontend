<template>
  <v-layout>
    <router-view></router-view>
  </v-layout>
</template>

<script>
  /* ============
   * Emails pages
   * ============
   *
   * Routes to emails pages
   */
  import VLayout from '@/layouts/Blank';

  export default {
    name: 'blank-index',
    components: {
      VLayout,
    },
  };
</script>
