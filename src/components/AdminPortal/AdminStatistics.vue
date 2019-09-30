<template>
  <div class="cce-admin__panel">
    <div class="cce-admin__panel-title">
      <span>{{ $t('AdminStatistics.exchange_statistics') }}</span>
      <div class="cce-admin__timeline-controls">
        <v-btn
          icon
          class="cce-admin__timeline-controls-item"
          v-for="item in timeFrames"
          :key="item.text"
          :class="{'cce-admin__timeline-controls-item--active': isTimeframeActive(item)}"
          @click="setTimeframe(item)"
        >
          {{item.text}}
        </v-btn>
      </div>
    </div>
    <v-layout class="pb-3 pt-3" row wrap>
      <!-- Registrations -->
      <v-flex class="cce-admin__overview-card pl-3 pr-3" d-flex xs12 sm6 md3>
        <div class="cce-admin__overview-card-text">
          <h1>{{registrations}}</h1>
          <span>{{ $t('AdminStatistics.registrations') }}</span>
        </div>
        <div class="cce-admin__overview-chart">
          <highcharts v-resize="onResize" ref="registrations" :options="chartOptions.registrations" class="cce-admin__highcharts" />
        </div>
      </v-flex>
      <!-- Trades -->
      <v-flex class="cce-admin__overview-card pl-3 pr-3" d-flex xs12 sm6 md3>
        <div class="cce-admin__overview-card-text">
          <h1>{{trades}}</h1>
          <span>{{ $t('AdminStatistics.trades') }}</span>
        </div>
        <div class="cce-admin__overview-chart">
          <highcharts v-resize="onResize" ref="trades" :options="chartOptions.trades" class="cce-admin__highcharts" />
        </div>
      </v-flex>
      <!-- Trading Volume -->
      <v-flex class="cce-admin__overview-card pl-3 pr-3" d-flex xs12 sm6 md3>
        <div class="cce-admin__overview-card-text">
          <h1>$ {{tradeVolume}}</h1>
          <span>{{ $t('AdminStatistics.trading_volume') }}</span>
        </div>
        <div class="cce-admin__overview-chart">
          <highcharts v-resize="onResize" ref="tradeVolume" :options="chartOptions.tradeVolume" class="cce-admin__highcharts" />
        </div>
      </v-flex>
      <!-- Estimated Earnings -->
      <v-flex class="cce-admin__overview-card pl-3 pr-3" d-flex xs12 sm6 md3>
        <div class="cce-admin__overview-card-text">
          <h1>$ {{earnings}}</h1>
          <span>{{ $t('AdminStatistics.estimated_earnings') }}</span>
        </div>
        <div class="cce-admin__overview-chart">
          <highcharts v-resize="onResize" ref="earnings" :options="chartOptions.earnings" class="cce-admin__highcharts" />
        </div>
      </v-flex>
    </v-layout>
    <!-- Loader -->
    <div v-if="loading">
      <div class="cce-overlay__content">
        <v-progress-circular indeterminate :size="70" :width="1" color="#9baed3"/>
      </div>
    </div>
  </div>
</template>

<script>
  /* ============
   * Admin statistics component
   * ============
   *
   * Component will list exchange statistics for admin portal owerview
   */
  import Big from 'big.js';
  import merge from 'lodash.merge';

  const ONE_DAY = 86400000;
  const RESOLUTION_DAY = '1';
  const RESOLUTION_WEEK = '7';
  const RESOLUTION_MONTH = '30';
  const RESOLUTION_YEAR = '365';

  export default {
    name: 'admin-statistics',
    mounted() {
      if (this.isAdmin) {
        this.setTimeframe(this.timeFrames[2]);
        this.init();
        this.updateTheme(this.themeMode);
      }
    },
    data() {
      const defaultThemeVars = this.getThemeChartVars(this.themeMode);
      const options = {
        chart: {
          type: 'area',
          zoomType: 'x',
          backgroundColor: defaultThemeVars.ChartBackgroundColor,
          events: {
            load: () => { // event
              // better init than flaky timeouts?
              // this.init(); // @TODO this should replace the timeout once
              // we figured out why it breaks the init.
            },
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
          enabled: false,
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
        },
        series: [{
          name: 'value',
          color: defaultThemeVars.seriesBuyColor,
          data: [],
          lineWidth: 1,
          fillOpacity: 0.15,
        }],
      };

      return {
        chartOptions: {
          registrations: options,
          trades: options,
          tradeVolume: options,
          earnings: options,
        },
        charts: {
          registrations: null,
          trades: null,
          tradeVolume: null,
          earnings: null,
        },
        timeFrames: [{
          text: '1D',
          resolution: RESOLUTION_DAY,
        },
        {
          text: '1W',
          resolution: RESOLUTION_WEEK,
        },
        {
          text: '1M',
          resolution: RESOLUTION_MONTH,
        },
        {
          text: '1Y',
          resolution: RESOLUTION_YEAR,
        },
        {
          text: 'ALL',
          resolution: 'All',
        }],
      };
    },
    computed: {
      loading() {
        return this.$store.getters['admin/overviewLoaing'];
      },
      overview() {
        return this.$store.getters['admin/overview'] || {};
      },
      isAdmin() {
        return this.$store.getters['admin/isAdmin'];
      },
      currentTimeframe() {
        return this.$store.getters['admin/statisticsCurrentTimeframe'] || this.timeFrames[2];
      },
      registrations() {
        return this.overview.registrations;
      },
      trades() {
        return this.overview.trades;
      },
      tradeVolume() {
        return this.overview.tradeVolume;
      },
      earnings() {
        return this.overview.earnings;
      },
      themeMode() {
        return this.$store.getters['app/themeMode'];
      },
      tradesChartData() {
        if (this.overview && this.overview.tradesChart) {
          return this.overview.tradesChart;
        }
        return [];
      },
      tradeVolumeChartData() {
        if (this.overview && this.overview.tradeVolumeChart) {
          return this.overview.tradeVolumeChart;
        }
        return [];
      },
      earningsChartData() {
        if (this.overview && this.overview.earningsChart) {
          return this.overview.earningsChart;
        }
        return [];
      },
      registrationsChartData() {
        if (this.overview && this.overview.registrationsChart) {
          return this.overview.registrationsChart;
        }
        return [];
      },
    },
    methods: {
      init() {
        /* eslint-disable */
        for (const chartKey of Object.keys(this.charts)) {
          if (!this.$refs[chartKey].chart) {
            setTimeout(() => {
              this.init();
            }, 1000);
            return;
          }
        }

        this.$store.dispatch('admin/overview', this.currentTimeframe.resolution);

        setTimeout(() => {
          this.init();
        }, 10000);

        for (const chartKey of Object.keys(this.charts)) {
          const self = this;
          this.charts[chartKey] = this.$refs[chartKey].chart;
          this.charts[chartKey].update({
            tooltip: {
              formatter() {
                const round = (n) => (n >= 1) ? n.toFixed(2) : n.toFixed(6);

                const x = round(new Big(parseFloat(this.x)));
                const y = round(new Big(parseFloat(this.y)));
                return `${y}`;
              },
            },
          });
          this.charts[chartKey].reflow();
        }
        /* eslint-enable */
      },
      isTimeframeActive(item) {
        return this.currentTimeframe && this.currentTimeframe.text === item.text;
      },
      setTimeframe(val) {
        this.$store.dispatch('admin/setStatisticsCurrentTimeframe', val);
      },
      onResize() {
        Object.keys(this.charts).forEach((chartKey) => {
          if (this.charts[chartKey]) {
            this.charts[chartKey].reflow();
          }
        });
      },
      updateChart(chartObj) {
        const currentDate = new Date();

        let interval = 4;
        if (this.currentTimeframe.resolution === RESOLUTION_DAY) {
          interval = 4;
        } else if (this.currentTimeframe.resolution === RESOLUTION_WEEK) {
          interval = 1;
        } else if (this.currentTimeframe.resolution === RESOLUTION_MONTH) {
          interval = 3;
        } else {
          interval = 2;
        }

        const self = this;
        chartObj.update({
          xAxis: {
            tickInterval: interval,
            labels: {
              formatter() {
                let offset = 1;
                if (self.currentTimeframe.resolution === RESOLUTION_DAY) {
                  offset = (24 - this.value) * (ONE_DAY / 24);
                } else if (self.currentTimeframe.resolution === RESOLUTION_WEEK) {
                  offset = (6 - this.value) * ONE_DAY;
                } else if (self.currentTimeframe.resolution === RESOLUTION_MONTH) {
                  offset = (30 - this.value) * ONE_DAY;
                } else if (self.currentTimeframe.resolution === RESOLUTION_YEAR) {
                  offset = (12 - this.value) * ONE_DAY * 30;
                }

                const targetDate = new Date(currentDate.getTime() - offset);
                let targetString = '';
                if (self.currentTimeframe.resolution === RESOLUTION_DAY) {
                  targetString = `${targetDate.getUTCHours()}:${targetDate.getMinutes()}`;
                } else {
                  targetString = `${targetDate.toLocaleString('en-us', { month: 'short' })} ${targetDate.getDate()}`;
                }
                return targetString;
              },
            },
          },
        });
        chartObj.reflow();
      },
      updateTheme(themeMode) {
        if (!themeMode) {
          themeMode = this.themeMode;
        }
        let theme = this.getThemeChartLightVars();
        if (themeMode) {
          theme = this.getThemeChartDarkVars();
        }
        const updateData = {
          chart: {
            // backgroundColor: theme.ChartBackgroundColor,
            backgroundColor: themeMode ? this.$themeSettings.darkContainerBackgroundColor
              : this.$themeSettings.lightContainerBackgroundColor,
          },
          xAxis: {
            // gridLineColor: theme.xAxisGridLineColor,
            // lineColor: theme.xAxisLineColor,
            gridLineColor: themeMode ? this.$themeSettings.darkBrandColor
              : this.$themeSettings.lightBrandColor,
            lineColor: themeMode ? this.$themeSettings.darkBrandColor
              : this.$themeSettings.lightBrandColor,
            tickColor: theme.xAxisTickColor,
            labels: {
              style: {
                color: theme.xAxisLabelsColor,
              },
            },
          },
          yAxis: {
            // gridLineColor: theme.yAxisGridLineColor,
            // lineColor: theme.yAxisLineColor,
            gridLineColor: themeMode ? this.$themeSettings.darkBrandColor
              : this.$themeSettings.lightBrandColor,
            lineColor: themeMode ? this.$themeSettings.darkBrandColor
              : this.$themeSettings.lightBrandColor,
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
            enabled: false,
          },
          series: [{
            color: theme.seriesBuyColor,
          },
          {
            color: theme.seriesSellColor,
          }],
        };

        Object.keys(this.charts).forEach((chartKey) => {
          if (!this.charts[chartKey]) {
            this.chartOptions[chartKey] = merge(this.options, updateData);
          } else {
            this.charts[chartKey].update(updateData);
          }
        });
      },
    },
    watch: {
      themeMode(val) {
        this.updateTheme(val);
      },
      currentTimeframe(timeFrame) {
        this.$store.dispatch('admin/overview', timeFrame.resolution);
      },
      tradesChartData(val) {
        if (this.charts.trades && this.charts.trades.series) {
          this.charts.trades.series[0].setData(val);
          this.updateChart(this.charts.trades);
        }
      },
      tradeVolumeChartData(val) {
        if (this.charts.tradeVolume && this.charts.tradeVolume.series) {
          this.charts.tradeVolume.series[0].setData(val);
          this.updateChart(this.charts.tradeVolume);
        }
      },
      earningsChartData(val) {
        if (this.charts.earnings && this.charts.earnings.series) {
          this.charts.earnings.series[0].setData(val);
          this.updateChart(this.charts.earnings);
        }
      },
      registrationsChartData(val) {
        if (this.charts.registrations && this.charts.registrations.series) {
          this.charts.registrations.series[0].setData(val);
          this.updateChart(this.charts.registrations);
        }
      },
      isAdmin(val) {
        if (val) {
          this.setTimeframe(this.timeFrames[2]);
          this.init();
          this.updateTheme(this.themeMode);
        }
      },
    },
  };
</script>
