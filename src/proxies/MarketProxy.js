import Proxy from './Proxy';

class MarketProxy extends Proxy {
  /**
   * The constructor for the MarketProxy.
   *
   * @param {Object} parameters The query parameters.
   */
  constructor(parameters = {}) {
    super('markets', parameters);
  }

  /**
   * Gets market settings
   *
   * @returns {Promise} The result in a promise.
   */
  getSettings(params = {}) {
    this.setParameters(params);
    return this.submit('get', `${this.endpoint}/getSettings`);
  }

  /**
   * Gets all available coins
   *
   * @returns {Promise} The result in a promise.
   */
  getCurrencies() {
    return this.submit('get', `${this.endpoint}/getCurrencies`);
  }

  /**
   * Gets market stats
   *
   * @param {Object} params The query parameters.
   *
   * @returns {Promise} The result in a promise.
   */
  getMarketSummary(params) {
    this.setParameters(params);
    return this.submit('get', `${this.endpoint}/getMarketSummary`);
  }

  /**
   * Lists market summaries
   *
   * @param {Object} params The query parameters.
   *
   * @returns {Promise} The result in a promise.
   */
  listMarkets(params) {
    this.setParameters(params);
    return this.submit('get', `${this.endpoint}/listMarkets`);
  }

  /**
   * Lists pairs summaries
   *
   * @param {Object} params The query parameters.
   *
   * @returns {Promise} The result in a promise.
   */
  listPairs(data) {
    return this.submit('post', `${this.endpoint}/listPairs`, data);
  }

  // /**
  //  * Lists trade tickers
  //  *
  //  * @param {Object} params The query parameters.
  //  *
  //  * @returns {Promise} The result in a promise.
  //  */
  getLastPrice(params) {
    this.setParameters(params);
    return this.submit('get', `${this.endpoint}/getLastPrice`);
  }

  /**
   * Lists trade tickers
   *
   * @param {Object} params The query parameters.
   *
   * @returns {Promise} The result in a promise.
   */
  getTickers(params) {
    this.setParameters(params);
    return this.submit('get', `${this.endpoint}/tickers`);
  }

  /**
   * Lists trade history
   *
   * @param {Object} params The query parameters.
   *
   * @returns {Promise} The result in a promise.
   */
  listTradeHistory(params) {
    this.setParameters(params);
    return this.submit('get', `${this.endpoint}/listTradeHistory`);
  }

  /**
   * Gets order book
   *
   * @param {Object} params The query parameters.
   *
   * @returns {Promise} The result in a promise.
   */
  listOrderBook(params) {
    this.setParameters(params);
    return this.submit('get', `${this.endpoint}/listOrderBook`);
  }

  /**
   * Gets order book chart data
   *
   * @param {Object} params The query parameters.
   *
   * @returns {Promise} The result in a promise.
   */
  listOrderBookChart(params) {
    this.setParameters(params);
    return this.submit('get', `${this.endpoint}/udf/listDepth`);
  }

  /**
   *
   * @param {*} userUid
   * @param {*} referredBy
   */
  saveMarket(data) {
    return this.submit('post', `${this.endpoint}/save`, data, this.requestConfig);
  }
}

export default MarketProxy;
