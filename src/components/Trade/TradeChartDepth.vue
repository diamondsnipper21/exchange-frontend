<template>
  <highcharts v-resize="onResize" ref="chart" :options="options" class="cce-trade__highcharts" />
</template>

<script>
  /* ============
   * Market depth chart
   * ============
   *
   * Market depth chart component for the trade chart section
   * Using highcharts library: https://www.highcharts.com
   */

  import Big from 'big.js';
  import merge from 'lodash.merge';

  export default {
    name: 'trade-chart-depth',
    data() {
      const defaultThemeVars = this.getThemeChartVars(this.themeMode);
      return {
        chart: null,
        hasBidData: false,
        hasAskData: false,
        xAxisStart: 0,
        xAxisEnd: 1,
        // highcharts options
        options: {
          chart: {
            type: 'area',
            zoomType: 'x',
            backgroundColor: this.themeMode ? this.$themeSettings.darkContainerBackgroundColor
              : this.$themeSettings.lightContainerBackgroundColor,
            ignoreHiddenSeries: false,
            legend: {
              enabled: false,
            },
          },
          credits: {
            enabled: false,
          },
          title: {
            text: null,
          },
          xAxis: {
            allowDecimals: true,
            valueDecimals: 'default',
            gridLineWidth: 1,
            gridLineColor: defaultThemeVars.xAxisGridLineColor,
            lineColor: defaultThemeVars.xAxisLineColor,
            tickColor: defaultThemeVars.xAxisTickColor,
            labels: {
              style: {
                color: defaultThemeVars.xAxisLabelsColor,
              },
              formatter() {
                return this.value;
              },
            },
          },
          yAxis: {
            gridLineWidth: 1,
            valueDecimals: 'default',
            gridLineColor: defaultThemeVars.yAxisGridLineColor,
            lineColor: defaultThemeVars.yAxisLineColor,
            tickColor: defaultThemeVars.yAxisTickColor,
            title: {
              text: null,
            },
            labels: {
              align: 'left',
              x: 0,
              style: {
                color: defaultThemeVars.yAxisLabelsColor,
              },
              formatter() {
                return this.value;
              },
            },
            showFirstLabel: false,
          },
          tooltip: {
            headerFormat: '',
            backgroundColor: defaultThemeVars.tooltipBackgroundColor,
            borderColor: defaultThemeVars.tooltipBorderColor,
            valueDecimals: 'default',
            style: {
              color: defaultThemeVars.tooltipColor,
            },
          },
          legend: {
            itemStyle: {
              color: defaultThemeVars.legendItemStyleColor,
            },
            itemHoverStyle: {
              color: defaultThemeVars.legendItemHoverStyleColor,
            },
            itemHiddenStyle: {
              color: defaultThemeVars.legendItemHiddenStyleColor,
            },
          },
          plotOptions: {
            area: {
              marker: {
                enabled: !1,
                symbol: 'circle',
                radius: 2,
                states: {
                  hover: {
                    enabled: !0,
                  },
                },
              },
            },
            series: {
              showInLegend: false,
            },
          },
          series: [{
            name: this.$t('TradeChartDepth.buy_orders'),
            color: this.themeMode ? this.$themeSettings.darkBuyColor
              : this.$themeSettings.lightBuyColor,
            data: [],
            lineWidth: 1,
            fillOpacity: 0.15,
          }, {
            name: this.$t('TradeChartDepth.sell_orders'),
            color: this.themeMode ? this.$themeSettings.darkSellColor
              : this.$themeSettings.lightSellColor,
            data: [],
            lineWidth: 1,
            fillOpacity: 0.15,
          }],
        },
      };
    },
    mounted() {
      if (this.isMobile) {
        this.initMobile();
      } else {
        this.init();
      }
      this.updateTheme(this.themeMode);
    },
    computed: {
      isMobile() {
        return this.$vuetify.breakpoint.smAndDown;
      },
      themeMode() {
        return this.$store.getters['app/themeMode'];
      },
      marketType() {
        return this.$store.getters['market/type'] || '';
      },
      currency() {
        return this.$store.getters['market/currency'] || '';
      },
      askData() {
        const asks = this.$store.getters['market/chartAsk'];
        return asks || [];
      },
      bidData() {
        const bids = this.$store.getters['market/chartBid'];
        return bids || [];
      },
      chartData() {
        return {
          asks: this.askData,
          bids: this.bidData,
        };
      },
      bottomNav() {
        return this.$store.getters['app/bottomNav'];
      },
      chartType() {
        return this.$store.getters['app/chartType'];
      },
      marketTypePrecision() {
        return this.marketType ? this.$store.getters['market/currencies'][this.marketType].precision : 0;
      },
      currencyPrecision() {
        return this.currency ? this.$store.getters['market/currencies'][this.currency].precision : 0;
      },
      marketReady() {
        return this.$store.getters['market/ready'];
      },
      isUserOrdersVisible() {
        return this.$store.getters['app/tradeUserOrdersVisible'];
      },
      /**
      * Get project settings
      */
      projectSetting() {
        return this.$store.getters['app/setting'] || {};
      },
    },
    methods: {
      init() {
        if (!this.$refs.chart.chart) {
          setTimeout(() => {
            this.init();
          }, 1000);
          return;
        }
        const self = this;
        this.chart = this.$refs.chart.chart;
        // this.chart.destroy();
        this.chart.update({
          tooltip: {
            formatter() {
              /* eslint-disable */
              const round = (n) => (n >= 1) ? n.toFixed(2) : n.toFixed(6);
              /* eslint-enable */

              let str = '';
              if (this.series.name === 'Sell Orders') {
                str = self.$t('TradeChartDepth.can_be_bought');
              } else {
                str = self.$t('TradeChartDepth.can_be_sold');
              }
              const x = round(new Big(parseFloat(this.x)));
              const y = round(new Big(parseFloat(this.y)));
              const sum = round(new Big(parseFloat(this.y * this.x)));
              return `<strong> ${x} ${self.marketType.toUpperCase()} </strong><br/>${str}: ${y} ${self.currency.toUpperCase()}<br/> ${self.$t('TradeChartDepth.for_total_of')}: ${sum} ${self.marketType.toUpperCase()}`;
            },
          },
        });
        if (!this.hasBidData || !this.hasAskData) {
          this.updateData();
        }
        this.chart.reflow();
      },
      updateData() {
        const { bids, asks } = this.chartData;
        if (bids && asks) {
          this.hasBidData = true;
          this.hasAskData = true;
          this.updateExtremePoints(bids, asks);
          this.updateSeries(bids, asks);
          this.chart.redraw();
        }
      },
      // Dynamically set chart start/end points to center all data
      updateExtremePoints(bids, asks) {
        const bidXValues = bids.map(bid => bid[0]);
        const askXValues = asks.map(ask => ask[0]);

        const bidMin = Math.min(...bidXValues);
        const bidMax = Math.max(...bidXValues);
        const askMin = Math.min(...askXValues);
        const askMax = Math.max(...askXValues);

        if (!isFinite(bidMax) || !isFinite(askMax)) {
          if (isFinite(bidMax)) {
            // draw bids from center
            this.chart.xAxis[0].update({
              min: bidMin,
              max: bidMax + (bidMax - bidMin),
            }, true);
          } else {
            // draw asks from center
            let min = askMin - (askMax - askMin);
            if (min < 0) {
              min = 0;
            }
            this.chart.xAxis[0].update({
              min,
              max: askMax,
            }, true);
          }
        } else {
          if (asks.length > 1 && bids.length > 1) {
            const lowestSpread = this.findLowestSpread(bids, asks);
            this.xAxisStart = bidMax - lowestSpread;
            this.xAxisEnd = askMin + lowestSpread;
          } else if (askMax - askMin > bidMax - bidMin) {
            this.xAxisEnd = askMax;
            const min = bidMax - (askMax - askMin);
            if (min < 0) this.xAxisStart = bidMin;
            else this.xAxisStart = min;
          } else {
            this.xAxisStart = bidMin;
            this.xAxisEnd = askMin + (bidMax - bidMin);
          }

          this.chart.xAxis[0].update({
            min: this.xAxisStart,
            max: this.xAxisEnd,
          }, true);
        }
      },
      updateSeries(bids, asks) {
        const { min, max } = this.chart.xAxis[0].getExtremes();
        if (bids.length > 1) {
          const pointOutOfBounds = [min - 0.1, bids[0][1]];
          this.chart.series[0].setData([pointOutOfBounds, ...bids]);
        } else {
          this.chart.series[0].setData(bids);
        }
        if (asks.length > 1) {
          const pointOutOfBounds = [max + 0.1, asks[asks.length - 1][1]];
          this.chart.series[1].setData([...asks, pointOutOfBounds]);
        } else {
          this.chart.series[1].setData(asks);
        }
      },
      findLowestSpread(bids, asks) {
        const bidSpread = bids[bids.length - 1][0] - bids[0][0];
        const askSpread = asks[asks.length - 1][0] - asks[0][0];
        return bidSpread < askSpread ? bidSpread : askSpread;
      },
      initMobile() {
        if (this.bottomNav === 'charts') {
          this.init();
        }
      },
      onResize() {
        if (this.chart !== null) {
          this.chart.reflow();
        }
      },
      updateTheme(themeMode) {
        if (!this.$themeSettings) {
          return;
        }
        if (!themeMode) {
          themeMode = this.themeMode;
        }

        let theme = this.getThemeChartLightVars();
        if (themeMode) {
          theme = this.getThemeChartDarkVars();
        }
        const updateData = {
          chart: {
            backgroundColor: themeMode ? this.$themeSettings.darkContainerBackgroundColor
              : this.$themeSettings.lightContainerBackgroundColor,
          },
          xAxis: {
            gridLineColor: theme.xAxisGridLineColor,
            lineColor: theme.xAxisLineColor,
            tickColor: theme.xAxisTickColor,
            labels: {
              style: {
                color: theme.xAxisLabelsColor,
              },
            },
          },
          yAxis: {
            gridLineColor: theme.yAxisGridLineColor,
            lineColor: theme.yAxisLineColor,
            tickColor: theme.yAxisTickColor,
            labels: {
              style: {
                color: theme.yAxisLabelsColor,
              },
            },
          },
          tooltip: {
            backgroundColor: theme.tooltipBackgroundColor,
            borderColor: theme.tooltipBorderColor,
            style: {
              color: theme.tooltipColor,
            },
          },
          legend: {
            itemStyle: {
              color: theme.legendItemStyleColor,
            },
            itemHoverStyle: {
              color: theme.legendItemHoverStyleColor,
            },
            itemHiddenStyle: {
              color: theme.legendItemHiddenStyleColor,
            },
          },

          series: [
            {
              color: this.themeMode ? this.$themeSettings.darkBuyColor
              : this.$themeSettings.lightBuyColor,
            },
            {
              color: this.themeMode ? this.$themeSettings.darkSellColor
              : this.$themeSettings.lightSellColor,
            }],
        };
        if (!this.chart) {
          this.options = merge(this.options, updateData);
          return;
        }

        this.chart.update(updateData);
      },
    },
    watch: {
      isUserOrdersVisible() {
        if (this.chart !== null) {
          this.chart.reflow();
        }
      },
      currency(val, old) {
        if (!this.chart) this.init();
        if (val !== old) {
          if (this.chart !== null) {
            this.chart.redraw();
          }
        }
        this.updateData();
      },
      marketType(val, old) {
        if (!this.chart) this.init();
        if (val !== old) {
          if (this.chart !== null) {
            this.chart.redraw();
          }
        }
        this.updateData();
      },
      chartType(val) {
        if (val === 'depth') {
          if (this.chart !== null) {
            this.chart.reflow();
          } else {
            this.init();
          }
        }
      },
      chartData() {
        this.updateData();
      },
      themeMode(val) {
        this.updateTheme(val);
      },
      projectSetting() {
        this.updateTheme();
      },
    },
  };
</script>
