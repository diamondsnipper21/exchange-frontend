/* eslint-disable no-undef */
import Vue from 'vue';
import Rollbar from 'vue-rollbar';

if (process.env.ROLLBAR_CLIENT_ACCESS_TOKEN) {
  Vue.use(Rollbar, {
    accessToken: process.env.ROLLBAR_CLIENT_ACCESS_TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true,
    enabled: true,
    // level: 'info',
    source_map_enabled: true,
    environment: process.env.NODE_ENV,
    payload: {
      client: {
        javascript: {
          code_version: VERSION,
        },
        projectId: process.env.PROJECT_ID,
        environment: process.env.NODE_ENV,
      },
    },
  });
  Vue.config.errorHandler = (err) => {
    Vue.rollbar.error(err);
    throw err;
  };
}

