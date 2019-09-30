/* ============
 * Getters for the admin module
 * ============
 *
 * The getters that are available on the
 * admin module.
 */

export default {
  /** is admin data ready? */
  ready(state) {
    return state.ready;
  },
  overview(state) {
    return state.overview;
  },
  isAdmin(state) {
    return !!state.projectSettings;
  },
  statisticsCurrentTimeframe(state) {
    return state.statisticsCurrentTimeframe;
  },
  newUsers(state) {
    return state.newUsers;
  },
  recentTrades(state) {
    return state.recentTrades;
  },
};
