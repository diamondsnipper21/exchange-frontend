/**
 * Vuetify tabs component related methods
 */

export default {
  methods: {
    /**
     * Fixes a bug in Vuetify (1.0.9) v-tabs component by removing its style transform property
     * https://github.com/vuetifyjs/vuetify/issues/3294
     */
    removeVuetifyTabsInitTransform() {
      let tabsContainers = document.querySelectorAll('.tabs__container');
      tabsContainers = Array.from(tabsContainers);
      this.$nextTick(() => {
        tabsContainers.forEach((container) => {
          container.style.transform = '';
        });
      });
    },
  },
};
