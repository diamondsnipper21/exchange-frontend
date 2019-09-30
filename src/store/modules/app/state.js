/* ============
 * State of the app module
 * ============
 *
 * The initial state of the app module.
 */
export default {
  bottomNav: 'trade',
  chartType: 'price',
  tradePrice: '',
  tradeActionIntent: {
    type: 'limit',
    action: 'buy',
    price: undefined,
    amount: undefined,
  },
  tradePriceStatus: null,
  tradePriceStatusTm: null,
  tradeFormVisible: true,
  tradeUserOrdersVisible: false,
  tradePriceChartExpanded: false,
  tradeHistoryCallback: {},
  themeMode: true, /** theme mode, true = dark, false = light */
  themeName: 'cce',
  busyComponents: [], // keep track of components busy with applying themeMode changes
  ready: false,
  setting: {},
};
