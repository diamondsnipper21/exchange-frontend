/* ============
 * Getters for the account module
 * ============
 *
 * The getters that are available on the
 * account module.
 */

export default {
  /** is account data ready? */
  ready(state) {
    return state.ready;
  },

  /** gets user details */
  user(state) {
    return state.user;
  },

  /** gets user details by Email */
  userByEmail(state) {
    return state.userByEmail;
  },

  accessLogs(state) {
    return state.logs;
  },

  overview(state) {
    return state.overview;
  },
};
