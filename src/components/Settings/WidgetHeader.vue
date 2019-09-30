<template>
  <v-tabs
    class="cce-settings__tabs"
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
        { name: this.$t('AdminManageSetting.Tab.settings_branding') },
        { name: this.$t('AdminManageSetting.Tab.settings_markets') },
        // { name: this.$t('AdminManageSetting.Tab.settings_admins') },
        { name: this.$t('AdminManageSetting.Tab.settings_other') },
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
