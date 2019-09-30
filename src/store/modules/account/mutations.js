/* ============
 * Mutations for the account module
 * ============
 *
 * The mutations that are available on the
 * account module.
 */
import {
  READY,
  USER,
  USERBYEMAIL,
  USERACCESS,
  OVERVIEW,
  LOADING_OVERVIEW,
} from './mutation-types';

export default {
  [READY](state, val) {
    state.ready = val;
  },

  [USER](state, value) {
    state.user = value;
  },

  [USERBYEMAIL](state, value) {
    state.userByEmail = value;
  },

  [USERACCESS](state, value) {
    state.logs = value;
  },

  [OVERVIEW](state, val) {
    state.overview = val;
  },

  [LOADING_OVERVIEW](state, val) {
    state.overviewLoading = val;
  },
};
