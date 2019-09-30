import Proxy from './Proxy';

class UserProxy extends Proxy {
  /**
   * The constructor for the UserProxy.
   *
   * @param {Object} parameters The query parameters.
   */
  constructor(parameters = {}) {
    super('users', parameters);
    this.requestConfig = {
      baseURL: process.env.API_LOCATION_AUTH,
    };
  }

  /**
   * Gets user details
   *
   * @returns {Promise} The result in a promise.
   */
  getUser() {
    return this.submit('get', `${this.endpoint}/getUser`, this.requestConfig);
  }

  /**
   * Create user account
   *
   * @param {Object} params The query parameters.
   *
   * @returns {Promise} The result in a promise.
   */
  register({ email, password }) {
    const data = {
      email, password,
    };
    return this.submit('post', `${this.endpoint}/register`, data, this.requestConfig);
  }

  /**
   * Authenticate user
   *
   * @param {Object} params The query parameters.
   *
   * @returns {Promise} The result in a promise.
   */
  logIn({ email, password, otpCode, smsCode }) {
    const data = {
      email, password, otpCode, smsCode,
    };
    return this.submit('post', `${this.endpoint}/logIn`, data, this.requestConfig);
  }

  /**
   * User logout
   */
  logOut() {
    return this.submit('post', `${this.endpoint}/logOut`, {}, this.requestConfig);
  }

  /**
   * Authenticate user
   *
   * @param {Object} params The query parameters.
   *
   * @returns {Promise} The result in a promise.
   */
  smsCode(data) {
    return this.submit('post', `${this.endpoint}/sendSMS`, data, this.requestConfig);
  }

  /**
   * Authenticate users by tokens
   *
   * @param {Object} params The query parameters.
   *
   * @returns {Promise} The result in a promise.
   */
  logInWithToken({ token, type }) {
    const data = {
      token, type,
    };
    return this.submit('post', `${this.endpoint}/logInWithToken`, data, this.requestConfig);
  }

  /**
   * Update user settings
   *
   * @param {Object} user New user data.
   *
   * @returns {Promise} The result in a promise.
   */
  updateUser(user) {
    const data = {
      user,
    };
    return this.submit('post', `${this.endpoint}/updateUser`, data, this.requestConfig);
  }

  /**
   * Lists user access logs
   *
   * @param {Object} params The query parameters.
   *
   * @returns {Promise} The result in a promise.
   */
  listAccessLogs(params = {}) {
    this.setParameters(params);
    return this.submit('get', `${this.endpoint}/listAccess`, this.requestConfig);
  }

  /**
   * Sends a recover password email
   *
   * @param {Object} params The query parameters.
   *
   * @returns {Promise} The result in a promise.
   */
  recoverPassword(data) {
    return this.submit('post', `${this.endpoint}/recoverPassword`, data, this.requestConfig);
  }

  /**
   * Sends an update password request
   *
   * @param {Object} params The query parameters.
   *
   * @returns {Promise} The result in a promise.
   */
  updatePassword(data) {
    return this.submit('post', `${this.endpoint}/updatePassword`, data, this.requestConfig);
  }
  /**
   * Sends a register phone number request
   *
   * @param {Object} data The query parameters.
   *
   * @returns {Promise} The result in a promise.
   */
  registerPhone(data) {
    return this.submit('post', `${this.endpoint}/registerPhone`, data, this.requestConfig);
  }

  /**
   * Lists favoritePairs summaries
   *
   * @returns {Promise} The result in a promise.
   */
  getFavoritePairs() {
    return this.submit('get', `${this.endpoint}/getUserFavPairs`, this.requestConfig);
  }

  /**
   * Lists favoritePairs summaries
   *
   * @returns {Promise} The result in a promise.
   */
  updateFavoritePairs(favPairs) {
    const data = {
      user: favPairs,
    };
    return this.submit('post', `${this.endpoint}/updateUserFavPairs`, data, this.requestConfig);
  }

  /**
   * Gets partner overview data with specified resolution
   *
   * @param {Object} timeFrame Time bounds for data to get and resolution for charts
   *
   * @returns {Promise} The result in a promise.
   */
  stats(params) {
    if (params && params.timeFrame) {
      this.setParameters(params);
    }
    return this.submit('get', `${this.endpoint}/stats`);
  }

  /**
 * Gets partner overview data
 *
 * @returns {Promise} The result in a promise.
 */
  statsOverView() {
    return this.submit('get', `${this.endpoint}/statsOverview`);
  }

  /**
   * Gets user details by email
   *
   * @returns {Promise} The result in a promise.
   */
  getUserByEmail(params) {
    if (params && params.email) {
      this.setParameters(params);
    }

    return this.submit('get', `${this.endpoint}/getUserByEmail`);
  }

  /**
   * Update user details by admin
   *
   * @returns {Promise} The result in a promise.
   */
  updateUserByAdmin(params) {
    return this.submit('post', `${this.endpoint}/updateUserByAdmin`, params, this.requestConfig);
  }
}

export default UserProxy;
