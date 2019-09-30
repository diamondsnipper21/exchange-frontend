<template>
  <v-layout fill-height column :style="{ minHeight: isMobile ? '250px' : '100%' }">
    <v-layout fill-height class="cce-admin__panel">
      <div v-if="title" class="cce-admin__panel-title">
        {{ title }}
      </div>
      <div class="cce-trade__table cce-trade__datatable">
        <div class="cce-trade__table-content">
          <div class="cce-trade__table-body cce-trade__table-body--with-scrollbar">
            <slot></slot>
          </div>
        </div>
      </div>
    </v-layout>
    <slot name="footer"></slot>
  </v-layout>
</template>

<script>
export default {
  name: 'table-container',
  props: {
    title: { type: String },
    noBorder: { type: Boolean },
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
};
</script>
