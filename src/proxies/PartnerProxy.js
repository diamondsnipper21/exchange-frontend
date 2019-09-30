import Proxy from './Proxy';

class PartnerProxy extends Proxy {
  /**
   * The constructor for the PartnerProxy.
   *
   * @param {Object} parameters The query parameters.
   */
  constructor(parameters = {}) {
    super('partners', parameters);
  }

  /**
   * Gets partner overview data
   *
   * @returns {Promise} The result in a promise.
   */
  getOverview() {
    return this.submit('get', `${this.endpoint}/getOverview`);
  }

  /**
   * Gets partner overview data with specified resolution
   *
   * @param {Object} timeFrame Time bounds for data to get and resolution for charts
   *
   * @returns {Promise} The result in a promise.
   */
  getOverviewInterval(params) {
    if (params && params.timeFrame) {
      this.setParameters(params);
    }
    return this.submit('get', `${this.endpoint}/getOverviewInterval`);
  }

  /**
   * Gets partner project settings
   *
   * @returns {Promise} The result in a promise.
   */
  getProject() {
    return this.submit('get', `${this.endpoint}/project`);
  }

  /**
   * Gets order details
   *
   * @returns {Promise} The result in a promise.
   */
  getCurrencies() {
    return this.submit('get', `${this.endpoint}/currencies`);
  }

  /**
   * Gets partner earnings
   *
   * @param {Object} page specify page to get.
   *
   * @returns {Promise} The result in a promise.
   */
  getEarnings(page) {
    const data = {};
    if (page) data.page = page;

    return this.submit('post', `${this.endpoint}/earnings`, data);
  }

  /**
   * Gets last registered users
   *
   * @param {Object} count count users to to get.
   *
   * @returns {Promise} The result in a promise.
   */
  getNewUsers(count) {
    this.setParameters({ count });
    return this.submit('get', `${this.endpoint}/getNewUsers`);
  }

  /**
   * Gets last transactions
   *
   * @param {Object} count count transactions to to get.
   *
   * @returns {Promise} The result in a promise.
   */
  getRecentTrades({ count, skipMatches }) {
    this.setParameters({ count, skipMatches });
    return this.submit('get', `${this.endpoint}/getRecentTrades`);
  }

  /**
   * Create new partner
   *
   * @param {Object} params The query parameters.
   *
   * @returns {Promise} The result in a promise.
   */
  register({ exchangeName, email, password }) {
    const data = {
      exchangeName, email, password,
    };
    return this.submit('post', `${this.endpoint}/save`, data, this.requestConfig);
  }

}

export default PartnerProxy;
