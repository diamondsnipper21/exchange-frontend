/* ============
 * State of the market module
 * ============
 *
 * The initial state of the market module.
 */

export default {
  types: [],
  activeType: null,
  activeCurrency: null,
  info: {},
  list: [],
  favoritePairs: [],
  defaultMarketPair: 'BTC-USDC',
  defaultFavoritePairs: [],
  favoritePairsSummaries: [],
  tradeHistory: [],
  settings: {},
  settings_all: {},
  currencies: {},
  currenciesArr: [],
  loading: false,
  loadingArray: {
    orderBook_ask: false,
    orderBook_bid: false,
    orderBookChart: false,
  },
  loadingList: false,
  loadingDefaultFavoritePairs: false,
  loadingFavoritePairs: false,
  loadingfavoritePairsSummaries: false,
  loadingHistory: false,
  ready: false,
  exchangeRate: 0,
  markets: [],
  // orderBook: {
  //   ask: [],
  //   bid: [],
  // },
  orderBookAsk: [],
  orderBookBid: [],
  orderBookChart: {},
};
