import Proxy from './Proxy';

class AccountProxy extends Proxy {
  /**
   * The constructor for the AccountProxy.
   *
   * @param {Object} parameters The query parameters.
   */
  constructor(parameters = {}) {
    super('api/account', parameters);
  }
}

export default AccountProxy;
