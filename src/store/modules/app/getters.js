/* ============
 * Getters for the app module
 * ============
 *
 * The getters that are available on the
 * app module.
 */

export default {
  bottomNav(state) {
    return state.bottomNav;
  },

  chartType(state) {
    return state.chartType;
  },

  tradePrice(state) {
    return state.tradePrice;
  },

  tradeActionIntent(state) {
    return state.tradeActionIntent;
  },

  tradePriceStatus(state) {
    return state.tradePriceStatus;
  },

  tradeFormVisible(state) {
    return state.tradeFormVisible;
  },

  tradeUserOrdersVisible(state) {
    return state.tradeUserOrdersVisible;
  },

  tradePriceChartExpanded(state) {
    return state.tradePriceChartExpanded;
  },

  tradeHistoryCallback(state) {
    return (id) => {
      let result = null;
      if (id in state.tradeHistoryCallback) {
        result = state.tradeHistoryCallback[id];
      }
      return result;
    };
  },

  /** theme mode, true = dark, false = light */
  themeMode(state) {
    return state.themeMode;
  },

  /** cce | xBase | kryptostack */
  themeName(state) {
    return state.themeName;
  },

  hasBusyComponents(state) {
    return state.busyComponents.length > 0;
  },

  ready(state) {
    return state.ready;
  },

  getAppSetting(state) {
    return state.setting;
  },
};
