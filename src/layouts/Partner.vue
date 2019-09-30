<template>
  <v-app
    class="cce-auth"
    light
  >
    <v-content class="cce-auth__content">
      <v-container>
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
 * Partner layout
 * ============
 *
 * Partner layout
 */
export default {
  name: 'partner-layout',
  data() {
    return {
      isMobile: false,
    };
  },
};
</script>
