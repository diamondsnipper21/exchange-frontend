/* ============
 * Axios
 * ============
 *
 * Promise based HTTP client for the browser and node.js.
 * Because Vue Resource has been retired, Axios will now been used
 * to perform AJAX-requests.
 *
 * https://github.com/mzabriskie/axios
 */

import Vue from 'vue';
import Axios from 'axios';
import store from '@/store';

Axios.defaults.baseURL = process.env.API_LOCATION;
Axios.defaults.headers.common.Accept = 'application/json';
Axios.interceptors.response.use(
  response => response,
  (error) => {
    if (error.response.data.error && error.response.data.error.code === 'sessionNotFound') {
      store.dispatch('auth/logout');
    }
    return Promise.reject(error);
  });


Axios.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    config.withCredentials = true;
    return config;
  },
  error =>
    // Do something with request error
     Promise.reject(error),
);

// Bind Axios to Vue
Vue.$http = Axios;
Object.defineProperty(Vue.prototype, '$http', {
  get() {
    return Axios;
  },
});
