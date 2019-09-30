import Proxy from './Proxy';

class ProjectProxy extends Proxy {
  /**
   * The constructor for the ProjectProxy.
   *
   * @param {Object} parameters The query parameters.
   */
  constructor(parameters = {}) {
    super('projects', parameters);
  }

  /**
   * Gets project settings
   *
   * @returns {Promise} The result in a promise.
   */
  getSettings() {
    return this.submit('get', `${this.endpoint}/settings`);
  }

  /**
   * Update project setting
   *
   * @returns {Promise} The result in a promise.
   */
  updateSetting(params) {
    return this.submit('post', `${this.endpoint}/updateSetting`, params, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * Cancel host mapping change procedure.
   *
   * @returns {Promise} The result in a promise.
   */
  cancelHostMapping() {
    return this.submit('post', `${this.endpoint}/cancelHostMapping`);
  }
}

export default ProjectProxy;
