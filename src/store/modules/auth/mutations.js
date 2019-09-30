/* ============
 * Mutations for the auth module
 * ============
 *
 * The mutations that are available on the
 * account module.
 */

import Vue from 'vue';
import {
  SAVE,
  CHECK,
  LOGOUT,
} from './mutation-types';

export default {
  [SAVE](state, token) {
    Vue.localStorage.set('authToken', token);
  },

  [CHECK](state) {
    const authToken = Vue.localStorage.get('authToken');
    state.authenticated = authToken && authToken !== '';
    if (state.authenticated) {
      // sets auth header token
      Vue.$http.defaults.headers.common['x-auth-token'] = encodeURIComponent(authToken);
    }
  },

  [LOGOUT](state) {
    state.authenticated = false;
    Vue.localStorage.remove('authToken');
    Vue.$http.defaults.headers.common['x-auth-token'] = '';
  },
};
