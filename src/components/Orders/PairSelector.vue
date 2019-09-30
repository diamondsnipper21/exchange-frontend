<template>
  <v-menu
    lazy
    offset-y
    :full-width="true"
    :open-on-hover="true"
    :open-on-click="true"
    :left="true"
    :close-on-content-click="true"
    class="cce-pair-selector-menu"
  >
    <v-btn
      slot="activator"
      class="cce-pair-selector__activator"
      depressed
      @mouseenter="openMenu"
    >
      <v-layout row justify-space-between align-center>
        {{ currency && marketType ? `${currency}/${marketType}` : 'ALL' }}
        <v-icon dark right class="cce-opacity-5">arrow_drop_down</v-icon>
      </v-layout>
    </v-btn>
    <div class="cce-pair-selector-content" @click="shouldBeClosed">
      <v-tabs
        class="cce-pair-selector__tabs cce-pair-selector__tabs--line cce-pair-selector-tabs"
        :value="!activeTab ? initialTabIndex : activeTab"
        @input="changeTab"
        ref="vTabs"
      >
        <v-tab
          @click="changeMarket(key)"
          v-for="(item, key) in settings"
          :key="key"
        >
          <span class="cce-uppercase">{{ key }}</span>
        </v-tab>
        <v-tab @click="changeMarket('all')">
          <span class="cce-uppercase">All</span>
        </v-tab>
      </v-tabs>
      <template v-if="selectedMarket !== ''">
        <v-btn
          v-for="(value, key) in settings[selectedMarket]"
          :key="key"
          class="cce-uppercase mx-0 my-0"
          small
          flat
          depressed
          @click="selectCurrency(value, key)"
        >
          {{ settings[selectedMarket][key].currency }}
        </v-btn>
      </template>
    </div>
  </v-menu>
</template>

<script>
import tabMixin from '@/mixins/tab';

export default {
  name: 'pair-selector',
  mixins: [tabMixin],
  data() {
    return {
      activeTab: '',
      selectedMarket: '',
      marketType: '',
      currency: '',
    };
  },
  computed: {
    /**
     * Returns settings for all markets from store
     * @returns {Object}
     */
    settings() {
      return this.$store.getters['market/settings'] || {};
    },

    /**
     * Dynamically sets initial tab index to the last one
     * @returns {String}
     */
    initialTabIndex() {
      return String(Object.keys(this.settings).length);
    },

    /**
     * Returns all available currencies from store
     * @returns {Array}
     */
    currencies() {
      return this.$store.getters['market/currencies'] || [];
    },
  },
  methods: {
    /**
     * Opens menu and executes `selectFirstTab` method
     */
    openMenu() {
      if (!this.activeTab || this.activeTab === this.initialTabIndex) {
        this.selectFirstTab();
      }
    },

    /**
     * Changes active tab
     * @param {String} tab stringified tab index
     */
    changeTab(tab) {
      this.removeVuetifyTabsInitTransform();
      if (tab === this.initialTabIndex) {
        this.$nextTick(() => {
          this.selectFirstTab();
        });
      }
      this.activeTab = tab;
    },

    /**
     * Changes 'ALL' tab to first tab
     */
    selectFirstTab() {
      this.$refs.vTabs.inputValue = '0';
      this.changeMarket(Object.keys(this.settings)[0]);
    },

    /**
     * Switches market by given type
     * @param {String} type stringified key from `this.settings` object
     */
    changeMarket(type) {
      if (type === 'all') {
        this.selectedMarket = '';
        this.marketType = '';
        this.currency = '';
        this.changePair();
      } else {
        this.selectedMarket = type;
      }
    },

    /**
     * Sets pair values and runs `changePair` method
     * @param {Object} value selected object from `this.settings`
     * @param {String} key selected currency name
     */
    selectCurrency(value, key) {
      this.currency = key;
      this.marketType = value.marketType;
      this.changePair({
        marketType: value.marketType,
        currency: this.currency,
      });
    },

    /**
     * Changes pair when the currency is selected and emits `onChangePair` event
     * @param {Object} pair contains `marketType` and `currency` props
     */
    changePair(pair) {
      if (pair) {
        this.$emit('onChangePair', pair);
      } else {
        this.$emit('onChangePair');
      }
    },

    /**
     * Checks if menu needs to be closed
     * @param {Object} e event object
     */
    shouldBeClosed(e) {
      const c = e.srcElement.classList;
      if (!c.contains('m-close')) {
        e.stopPropagation();
      }
    },
  },
};
</script>
