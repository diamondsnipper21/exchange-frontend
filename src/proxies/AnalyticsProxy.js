import Proxy from './Proxy';

class AnalyticsProxy extends Proxy {
  /**
   * The constructor for the AnalyticsProxy.
   *
   * @param {Object} parameters The query parameters.
   */
  constructor(parameters = {}) {
    super('stats', parameters);
    this.requestConfig = {
      baseURL: process.env.API_LOCATION_ANALYTICS,
    };
  }

  /**
   * Gets stats details
   *
   * @returns {Promise} The result in a promise.
   */
  getStats(userUid) {
    const data = {
      userUid,
    };
    return this.submit('post', `${this.endpoint}/get`, data, this.requestConfig);
  }

  /**
   *
   * @param {*} userUid
   * @param {*} referredBy
   */
  createStats(userUid, referredBy = null) {
    const data = {
      userUid,
    };
    if (referredBy) {
      data.referredBy = referredBy;
    }
    return this.submit('post', `${this.endpoint}/create`, data, this.requestConfig);
  }

  /**
   ** @param {*} referralCode
   */
  getGraph(referralCode) {
    const data = {
      referralCode,
    };
    return this.submit('post', `${this.endpoint}/getGraph`, data, this.requestConfig);
  }

  /**
   * Create stats object
   *
   * @param {Object} params The query parameters.
   *
   * @returns {Promise} The result in a promise.
   */
  create({ userUid, referredBy }) {
    const data = {
      userUid, referredBy,
    };
    return this.submit('post', `${this.endpoint}/create`, data, this.requestConfig);
  }

  click(referralCode) {
    const data = { referralCode };
    return this.submit('post', 'event/click', data, this.requestConfig);
  }

  register(referralCode) {
    const data = { referralCode };
    return this.submit('post', 'event/register', data, this.requestConfig);
  }

  trade({ referralCode, amount }) {
    const data = { referralCode, amount };
    return this.submit('post', 'event/trade', data, this.requestConfig);
  }

}

export default AnalyticsProxy;
