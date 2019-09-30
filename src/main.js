/* ============
 * Main File
 * ============
 *
 * Will initialize the application.
 */

import Vue from 'vue';

// import './plugins/rollbar';
import './plugins/vuex';
import './plugins/axios';
import { i18n } from './plugins/vue-i18n';
import { router } from './plugins/vue-router';
import './plugins/vuex-router-sync';
import './plugins/font-awesome';
import './plugins/vuetify';
import './plugins/charts';
import './plugins/tooltip';
import './plugins/localStorage';
import './plugins/sockets';
import './plugins/notify';
import './plugins/social-sharing';
import './plugins/scroll';
import './plugins/vue-tel-input';

import './mixins/global';
import './mixins/theme';

import './directives/decimals';
import './directives/time';
import './directives/date';
import './directives/fixed-number';
import './directives/txhash-link';

import './assets/sass/base.scss';
import './plugins/globals';
// import defaultProjectSettings from './defaultProjectSettings';
import App from './App';
import store from './store';

Vue.config.productionTip = false;

// Switch to the new CCE user authentication endpoints
Vue.$http.defaults.headers.common['x-auth-version'] = 'cce';

// Set PROJECT_ID header for every request
Vue.$http.defaults.headers.common['x-project-id'] = process.env.PROJECT_ID;

// Set Vue globals for CC
Vue.prototype.$projectId = process.env.PROJECT_ID;

const settingUrl = `${process.env.API_LOCATION}projects/settings`;

Vue.$http.get(settingUrl)
  .then((response) => {
    const defaultProjectSettings = response.data.result.project;
    // console.log(defaultProjectSettings);

    if (typeof defaultProjectSettings === 'object') {
      Vue.prototype.$appTitle = defaultProjectSettings.title;
      Vue.prototype.$appDomain = defaultProjectSettings.domain;
      Vue.prototype.$themeSettings = defaultProjectSettings.themeSettings || {};
      Vue.prototype.$themeName = defaultProjectSettings.themeName;
      /* eslint-disable */
      Vue.prototype.$appVersion = VERSION;
      /* eslint-enable */
      Vue.prototype.$setting = defaultProjectSettings || {};
    }

    store.dispatch('auth/check');

    /* eslint-disable no-new */
    new Vue({
      el: '#app',
      i18n,
      router,
      store,
      render: h => h(App),
    });
  })
  .catch(({ response }) => {
    if (response) {
      console.log(response.data);
    }
  });
