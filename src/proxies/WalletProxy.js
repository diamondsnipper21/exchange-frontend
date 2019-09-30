import Proxy from './Proxy';

class WalletProxy extends Proxy {
  /**
   * The constructor for the WalletProxy.
   *
   * @param {Object} parameters The query parameters.
   */
  constructor(parameters = {}) {
    super('wallets', parameters);
  }

  /**
   * Lists all user wallets
   *
   * @param {Object} params The query parameters.
   *
   * @returns {Promise} The result in a promise.
   */
  listWallets(params) {
    this.setParameters(params);
    return this.submit('get', `${this.endpoint}/listWallets`);
  }

  // /**
  //  * Lists deposits
  //  *
  //  * @param {Object} params The query parameters.
  //  *
  //  * @returns {Promise} The result in a promise.
  //  */
  // listDeposits(params) {
  //   this.setParameters(params);
  //   return this.submit('get', `${this.endpoint}/listDeposits`);
  // }

  /**
   * Lists deopsits and payments
   * @param {Object} params the query parameters
   * @returns {Promise} the result in a promise
   */
  listTransactions(params) {
    this.setParameters(params);
    return this.submit('get', `${this.endpoint}/listTransactions`);
  }

  // /**
  //  * Lists payments
  //  *
  //  * @param {Object} params The query parameters.
  //  *
  //  * @returns {Promise} The result in a promise.
  //  */
  // listPayments(params) {
  //   this.setParameters(params);
  //   return this.submit('get', `${this.endpoint}/listPayments`);
  // }

  /**
   * Creates wallet deposit address
   *
   * @param {Object} params The query parameters.
   *
   * @returns {Promise} The result in a promise.
   */
  createWallet({ currency }) {
    const data = {
      currency,
    };
    return this.submit('post', `${this.endpoint}/create`, data);
  }

  /**
   * Submits withdraw request
   *
   * @param {Object} params The query parameters.
   *
   * @returns {Promise} The result in a promise.
   */
  addPayment({ currency, amount, address, userUid }) {
    const data = {
      currency,
      amount,
      address,
      userUid,
    };
    return this.submit('post', `${this.endpoint}/addPayment`, data);
  }

  /**
   * Confirms withdraw request
   *
   * @param {Object} params The query parameters.
   *
   * @returns {Promise} The result in a promise.
   */
  confirmPayment({ token }) {
    const data = {
      token,
    };
    return this.submit('post', `${this.endpoint}/confirmPayment`, data);
  }

  /**
   * Lists client wallets
   *
   * @param {Object} params The query parameters.
   *
   * @returns {Promise} The result in a promise.
   */
  listClients(params) {
    this.setParameters(params);
    return this.submit('get', `${this.endpoint}/listClients`);
  }

}

export default WalletProxy;
