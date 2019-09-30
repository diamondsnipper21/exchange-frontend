import Proxy from './Proxy';

class OrderProxy extends Proxy {
  /**
   * The constructor for the OrderProxy.
   *
   * @param {Object} parameters The query parameters.
   */
  constructor(parameters = {}) {
    super('orders', parameters);
  }


  /**
   * Gets order details
   *
   * @param {Object} params The query parameters.
   *
   * @returns {Promise} The result in a promise.
   */
  getOrder(params) {
    this.setParameters(params);
    return this.submit('get', `${this.endpoint}/getOrder`);
  }

  /**
   * Lists orders
   *
   * @param {Object} params The query parameters.
   *
   * @returns {Promise} The result in a promise.
   */
  listOrders(params) {
    this.setParameters(params);
    return this.submit('get', `${this.endpoint}/listOrders`);
  }

  /**
   * Lists user orders
   *
   * @param {Object} params The query parameters.
   *
   * @returns {Promise} The result in a promise.
   */
  listUserOrders(params) {
    this.setParameters(params);
    return this.submit('get', `${this.endpoint}/listMyOrders`);
  }

  /**
   * Submits user order
   *
   * @param {Object} params The query parameters.
   *
   * @returns {Promise} The result in a promise.
   */
  addOrder({ orderType, actionType, market, amount, unitPrice, stopPrice, ratio }) {
    const data = {
      type: orderType,
      side: actionType,
      market,
      amount,
      unitPrice,
    };
    if (orderType === 'stop') {
      data.stopPrice = stopPrice;
    }
    if (ratio) {
      data.ratio = ratio;
    }
    return this.submit('post', `${this.endpoint}/addOrder`, data);
  }

  /**
   * Cancels user order
   *
   * @param {Object} params The query parameters.
   *
   * @returns {Promise} The result in a promise.
   */
  cancelOrder({ orderUid }) {
    return this.submit('post', `${this.endpoint}/cancelOrder`, { orderUid });
  }
}

export default OrderProxy;
