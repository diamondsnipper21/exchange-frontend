<template>
  <v-app
    class="cce-blank"
    light
  >
    <v-toolbar
      app
      fixed
      flat
      class="cce-blank__toolbar"
    >
      <div class="cce-blank__logo">
        <img :src=logoUrlBlank />
      </div>
      <v-spacer></v-spacer>
      <v-btn
        icon
        @click="close"
      >
        <v-icon large>close</v-icon>
      </v-btn>
    </v-toolbar>

    <v-content class="cce-blank__content">
      <v-container
        fluid
      >
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
 * Blank layout
 * ============
 *
 * Blank layout
 */
export default {
  name: 'blank-layout',
  data() {
    return {
      logoUrlBlank: this.$themeSettings.logoUrlBlank,
    };
  },
  methods: {
    /**
     * Redirects to the Trade page
     */
    close() {
      this.$router.push({
        name: 'trade.index',
      });
    },
  },
};
</script>
