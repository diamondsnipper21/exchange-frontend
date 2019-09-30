<template>
  <div>
    <div
      id="tradingView"
      class="cce-trade__trading-view"
      :style="{ visibility: chartReady ? 'visible' : 'hidden' }"
    >
    </div>
    <!-- Loader -->
    <div
      v-if="!chartReady && marketReady"
    >
      <progress-spinner />
    </div>
  </div>
</template>
<script>
  /* ============
   * Price chart
   * ============
   *
   * Price chart component for the trade chart section
   * Using tradingview charting library: https://www.tradingview.com/HTML5-stock-forex-bitcoin-charting-library/
   */
  import merge from 'lodash.merge';
  import ProgressSpinner from '@/components/UI/ProgressSpinner';

  const TradingView = require('../../../static/js/tradingview/charting_library/charting_library.min');
  const DataFeeds = require('../../../static/js/tradingview/datafeeds/udf/dist/bundle');

  export default {
    name: 'trade-chart-price',
    data() {
      return {
        themeVars: this.getThemeChartVars(),
        chart: null,
        datafeed: null,
        symbolInfo: null,
        chartReady: false,
        // when updating chart colors: do not wait for chart to be ready on first draw
        isFirstChartDraw: true,
        // tradingview chart options
        options: {
          container_id: 'tradingView',
          locale: 'en', // TODO: switch locale
          width: '100%',
          height: '100%',
          fullscreen: false,
          datafeed: null,
          symbol: 'BTC-USDC',
          interval: '1',
          library_path: '/static/js/tradingview/charting_library/',
          /* eslint-disable */
          custom_css_url: `chart.css?${VERSION}`,
          /* eslint-enable */
          drawings_access: {
            type: 'black',
            tools: [{
              name: 'Regression Trend',
            }],
          },
          // theme: 'dark',
          disabled_features: [
            'save_chart_properties_to_local_storage',
            'chart_crosshair_menu',
            'header_symbol_search',
          ],
          enabled_features: [
            'keep_left_toolbar_visible_on_small_screens',
          ],
          client_id: 'chaincreator.org',
          user_id: 'public_user',
          widgetbar: {
            details: false,
          },
          autosize: true,
          time_frames: [{
            text: '5Y',
            resolution: 'W',
          }, {
            text: '1Y',
            resolution: 'D',
          }, {
            text: '6M',
            resolution: '120',
          }, {
            text: '3M',
            resolution: '60',
          }, {
            text: '1M',
            resolution: '30',
          }, {
            text: '5D',
            resolution: '5',
          }, {
            text: '1D',
            resolution: '1',
          }],
          debug: false,
        },
      };
    },
    mounted() {
      this.overrideStyle();
      this.initMobile();
    },
    computed: {
      isMobile() {
        return this.$vuetify.breakpoint.smAndDown;
      },
      themeMode() {
        return this.$store.getters['app/themeMode'];
      },
      marketReady() {
        return this.$store.getters['market/ready'];
      },
      marketType() {
        return this.$store.getters['market/type'] || '';
      },
      currency() {
        return this.$store.getters['market/currency'] || '';
      },
      symbol() {
        return `${this.currency}-${this.marketType}`.toUpperCase();
      },
      bottomNav() {
        return this.$store.getters['app/bottomNav'];
      },
      defaultMarketPair() {
        return this.$store.getters['market/defaultMarketPair'];
      },
      /**
      * Get project settings
      */
      appSetting() {
        return this.$store.getters['app/getAppSetting'];
      },
    },
    methods: {
      create() {
        this.chartReady = false;
        if (!TradingView) {
          setTimeout(() => {
            this.create();
          }, 1000);
          return;
        }
        this.$store.dispatch('app/addBusyComponent', this.$options.name);
        if (this.chart !== null) {
          this.destroy();
        }
        this.datafeed = new DataFeeds.UDFCompatibleDatafeed(
          `${process.env.API_LOCATION}markets/udf`, 1e4);
        /* eslint new-cap: 0 */
        this.options.datafeed = this.datafeed;
        this.options.symbol = this.symbol.toUpperCase();
        this.chart = new TradingView.widget(this.options);
        if (this.defaultMarketPair) {
          this.options.symbol = this.defaultMarketPair;
        }
        this.chart.onChartReady(() => {
          // chart ready
          this.chartReady = true;
          this.isFirstChartDraw = false;
          this.$store.dispatch('app/removeBusyComponent', this.$options.name);

          this.ready = true;
          this.chart.chart().createStudy('Moving Average', false, false, [7, 'close'], null, {
            'plot.color': '#6D9EEB',
          });
          this.chart.chart().createStudy('Moving Average', false, false, [25, 'close'], null, {
            'plot.color': '#f3ba2e',
          });


          if (this.isMobile === true) {
            this.chart.chart().removeAllStudies();
          }

          this.saveSymbolInfo(this.requestBarsData);
        });
      },

      /**
       * Saves symbol info object
       * @param {Function} cb callback function runs after symbol data is resolved
       */
      saveSymbolInfo(cb) {
        this.datafeed.resolveSymbol(
          this.symbol,
          (resolvedSymbol) => {
            this.symbolInfo = resolvedSymbol;
            cb();
          },
          () => { this.symbolInfo = null; },
        );
      },

      /**
       * Gets bars data
       * @param {String} resolution optional resolution param
       */
      requestBarsData(resolution = '1') {
        if (!this.symbolInfo) return;
        // Substract 1 days in milliseconds from `now` and convert to unix time
        const from = Math.round((Date.now() - 86400000) / 1000);
        const to = Math.round(Date.now() / 1000);
        this.datafeed.getBars(
          this.symbolInfo,
          resolution,
          from,
          to,
          this.checkHistoryResponse,
          this.handleHistoryResponseError,
        );
      },

      /**
       * Checks history response and changes resolution if needed
       * @param {Array} bars `getBars` response bars data
       * @param {Object} meta `getBars` response meta object
       */
      checkHistoryResponse(bars) {
        // if (meta.noData) return;
        if (bars && bars.length < 100) {
          // Switch to 1 hour chart instead of 1 minute
          const resolutionToChange = '60';
          // Check if current symbol supports resolution we need
          if (this.symbolInfo.supported_resolutions.includes(resolutionToChange)) {
            this.chart.chart().setResolution(resolutionToChange);
          } else {
            // Select the pre-last available resolution
            const resLength = this.symbolInfo.supported_resolutions.length;
            const resolutionFallback = this.symbolInfo.supported_resolutions[resLength - 1];
            this.chart.chart().setResolution(resolutionFallback);
          }
        } else if (this.chart) {
          this.chart.chart().setResolution('1');
        }
      },

      /**
       * Handles error when gets bars
       */
      handleHistoryResponseError(error) {
        console.log('error', error);
      },

      destroy() {
        this.chart.remove();
        this.chart = null;
      },
      maybeRedraw() {
        // Chart draw depends on: marketType, currency, user theme mode,
        // AND on chartReady to be true (if NOT first draw)

        if (
          this.marketType
          && this.currency && (
            (!this.isFirstChartDraw && this.chartReady)
            || (this.isFirstChartDraw && !this.chartReady)
          )) {
          this.create();

          // @TODO try not to re-create entire object, instead use `applyOverrides(overrides)` & co. to update styles: https://github.com/tradingview/charting_library/wiki/Widget-Methods#applyoverridesoverrides
//          if (!this.isFirstChartDraw && this.chartReady && this.chart) {
//            if (this.themeMode) {
//              this.chart.changeTheme('Dark');
//            } else {
//              this.chart.changeTheme('Light');
//            }
//            this.chart.applyOverrides(this.options.overrides);
//            this.chart.applyStudiesOverrides(this.options.studies_overrides);
//          } else {
//            this.create();
//          }
        }
      },
      initMobile() {
        if (this.bottomNav === 'charts') {
          this.create();
        }
      },
      fetchThemeVars(mode) {
        if (!mode) {
          mode = this.themeMode;
        }
        if (mode) {
          return this.getThemeChartDarkVars();
        }
        return this.getThemeChartLightVars();
      },
      overrideStyle(theme) {
        const mode = this.themeMode;
        if (!this.$themeSettings) {
          return false;
        }
        if (!theme) {
          theme = this.fetchThemeVars();
        }

        const updateData = {
          overrides: {
            'paneProperties.background': mode ? this.$themeSettings.darkContainerBackgroundColor
              : this.$themeSettings.lightContainerBackgroundColor,
            'paneProperties.vertGridProperties.color': theme.PanePropertiesVertGridPropertiesColor,
            'paneProperties.horzGridProperties.color': theme.PanePropertiesHorzGridPropertiesColor,
            'symbolWatermarkProperties.transparency': 90,
            'scalesProperties.textColor': theme.ScalesPropertiesTextColor,
            'scalesProperties.lineColor': theme.ScalesPropertiesLineColor,
            'mainSeriesProperties.candleStyle.drawBorder': false,
            'paneProperties.crossHairProperties.color': mode ? this.$themeSettings.darkBuyColor
              : this.$themeSettings.lightBuyColor,
            'mainSeriesProperties.candleStyle.upColor': mode ? this.$themeSettings.darkBuyColor
              : this.$themeSettings.lightBuyColor,
            'mainSeriesProperties.candleStyle.downColor': mode ? this.$themeSettings.darkSellColor
              : this.$themeSettings.lightSellColor,
            'mainSeriesProperties.candleStyle.borderUpColor': mode ? this.$themeSettings.darkBuyColor
              : this.$themeSettings.lightBuyColor,
            'mainSeriesProperties.candleStyle.borderDownColor': mode ? this.$themeSettings.darkSellColor
              : this.$themeSettings.lightSellColor,
          },
          toolbar_bg: mode ? this.$themeSettings.darkContainerBackgroundColor
            : this.$themeSettings.lightContainerBackgroundColor, // @TODO Only works with HEX colors (no 'red', no rgba()) ~ this doesn't seem to work, related issue? https://github.com/tradingview/charting_library/issues/3551 ~
          loading_screen: {
            backgroundColor: mode ? this.$themeSettings.darkContainerBackgroundColor
            : this.$themeSettings.lightContainerBackgroundColor,
          },
          studies_overrides: {
            'volume.volume.color.0': mode ? this.$themeSettings.darkSellColor
              : this.$themeSettings.lightSellColor,
            'volume.volume.color.1': mode ? this.$themeSettings.darkBuyColor
              : this.$themeSettings.lightBuyColor,
          },
        };
        this.options = merge(this.options, updateData);
        return true;
      },

      setTheme() {
        this.overrideStyle();
        this.maybeRedraw();
      },
    },
    watch: {
      symbol(val) {
        if (val !== '-') {
          this.maybeRedraw();
        }
      },
      themeMode() {
        this.setTheme();
      },
      appSetting() {
        this.setTheme();
      },
    },
    components: {
      ProgressSpinner,
    },
  };
</script>
