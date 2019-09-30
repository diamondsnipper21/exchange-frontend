<template>
  <v-tabs
    class="cce-users__tabs"
    v-model="tabIndex"
  >
    <v-tab
      v-for="(tab, index) in tabs"
      :key="index"
      @click="selectTab(index)"
    >
      {{ tab.name }}
    </v-tab>
    <v-spacer />
    <slot></slot>
  </v-tabs>
</template>

<script>
import tabMixin from '@/mixins/tab';

export default {
  name: 'widget-header',
  mixins: [tabMixin],
  data() {
    return {
      tabs: [
        { name: this.$t('AdminManageUser.Widget.user_wallets') },
        { name: this.$t('AdminManageUser.Widget.user_open_orders') },
        { name: this.$t('AdminManageUser.Widget.user_completed_orders') },
        { name: this.$t('AdminManageUser.Widget.user_payments') },
        { name: this.$t('AdminManageUser.Widget.user_logs') },
      ],
      tabIndex: '0',
    };
  },
  methods: {
    /**
     * Changes an active tab and emits `onChangeTab` event
     * @param {Number} index tab index in `tabs` array
     */
    selectTab(index) {
      this.tabIndex = String(index);
      this.$emit('onChangeTab', index);
      // remove unnecessary transform (vuetify bug) using `tabMixin`
      this.removeVuetifyTabsInitTransform();
    },
  },
};
</script>
