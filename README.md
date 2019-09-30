# ChainCreator Exchange Frontend (vuejs + vuetifyjs)


- `npm run dev`: Development.
  - Webpack + `vue-loader` for single file Vue components.
  - State preserving hot-reload
  - State preserving compilation error overlay
  - Lint-on-save with ESLint
  - Source maps

- `npm run build`: Production ready build. (add `ENV_CONFIG=staging` to specify build config file per environment)
  - JavaScript minified with [UglifyJS](https://github.com/mishoo/UglifyJS2).
  - HTML minified with [html-minifier](https://github.com/kangax/html-minifier).
  - CSS across all components extracted into a single file and minified with [cssnano](https://github.com/ben-eb/cssnano).
  - All static assets compiled with version hashes for efficient long-term caching, and a production `index.html` is auto-generated with proper URLs to these generated assets.

- `npm run unit`: start the Karma Test Runner.
  - Unit Tests are provided by Karma, Mocha, Chai and Sinon-Chai.
  - The testing files should be place under **test/unit/specs**.
  - Make sure every test file ends in `.spec.js`

- `npm run e2e`: start the Nightwatch Test Runner.
  - End to End (e2e) Tests are provided by Nightwatch, Selenium and PhantomJS.
  - The testing files should be place under **test/e2e/specs**.

## 3rd party documentation
TradingView Charting Library
  - JS API: https://github.com/tradingview/charting_library/wiki/JS-Api
  - CSS Overrides: https://github.com/tradingview/charting_library/wiki/Overrides
  - Examples: https://github.com/tradingview/charting_library

## Useful Links
  - CCE staging: http://staging-trade.chaincreator.exchange
  - CCE production: https://trade.chaincreator.exchange

  - Whitelabel deploy shortcut script example: ["/cc-devops/deploy/cce/staging/"] `./frontend-xbase.sh` (bastion stg, bastion prod)
