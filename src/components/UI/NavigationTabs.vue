<template>
  <v-list class="mb-3 cce-account__horizontal-tabs-list pb-0 pt-3">
    <v-list-tile
      v-for="tab in tabs"
      :to="{ name: tab.to}"
      :key="tab.name"
      :inactive="tab.inactive"
      :class="{
        'cce-account__horizontal-tabs-list-item': true,
        'list__tile--link': tab.inactive
      }"
    >
      <v-list-tile-content>
        <v-list-tile-title>{{ tab.name }}<span>{{ tab.special }}</span></v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
  </v-list>
</template>

<script>
  /* ============
   * Navigation tabs component
   * ============
   *
   * Component renders horizontal tabs
   */

  export default {
    name: 'navigation-tabs',
    props: {
      tabs: {
        type: Array,
        default: () => [{
          to: '',
          name: '',
          inactive: false,
          icon: '',
          special: '',
        }],
      },
    },
  };
</script>
<style lang="scss" scoped>
.tabs  {
  border: 1px solid red;
}
</style>
