<template>
<!-- @TODO: add translation -->
  <div class="cce-admin__panel">
    <div class="cce-admin__panel-title">
      <span>My Statistics</span>
      <div class="cce-admin__timeline-controls">
        <v-btn
          icon
          class="cce-admin__timeline-controls-item"
          v-for="item in timeFrames"
          :key="item.text"
          :class="{ 'cce-admin__timeline-controls-item--active': isTimeFrameActive(item) }"
          @click="setTimeFrame(item)"
        >
          {{item.text}}
        </v-btn>
      </div>
    </div>
    <v-layout class="pb-3 pt-3" row wrap>
      <!-- TRADES -->
      <v-flex class="cce-admin__overview-card pl-3 pr-3"  d-flex xs12 sm6 md3>
        <div class="cce-admin__overview-card-text">
          <h1>{{trades}}</h1>
          <span>Trades</span>
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
      <!-- Deposits -->
      <v-flex class="cce-admin__overview-card pl-3 pr-3" d-flex xs12 sm6 md3>
        <div class="cce-admin__overview-card-text">
          <h1>$ {{paymentCR}}</h1>
          <span>{{ $t('AdminStatistics.deposits') }}</span>
        </div>
        <div class="cce-admin__overview-chart">
          <highcharts v-resize="onResize" ref="paymentCR" :options="chartOptions.paymentCR" class="cce-admin__highcharts" />
        </div>
      </v-flex>
      <!-- Withdrawls -->
      <v-flex class="cce-admin__overview-card pl-3 pr-3" d-flex xs12 sm6 md3>
        <div class="cce-admin__overview-card-text">
          <h1>$ {{paymentDB}}</h1>
          <span>{{ $t('AdminStatistics.withdrawals') }}</span>
        </div>
        <div class="cce-admin__overview-chart">
          <highcharts v-resize="onResize" ref="paymentDB" :options="chartOptions.paymentDB" class="cce-admin__highcharts" />
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
import Big from 'big.js';
import merge from 'lodash.merge';
import dashboardCharts from '@/utils/dashboardCharts';

const ONE_DAY = 86400000;
const RESOLUTION_DAY = '1';
const RESOLUTION_WEEK = '7';
const RESOLUTION_MONTH = '30';
const RESOLUTION_YEAR = '365';

const timeFrames = [
  { text: '1D', resolution: RESOLUTION_DAY },
  { text: '1W', resolution: RESOLUTION_WEEK },
  { text: '1M', resolution: RESOLUTION_MONTH },
  { text: '1Y', resolution: RESOLUTION_YEAR },
  { text: 'ALL', resolution: 'All' },
];

export default {
  name: 'user-stats',
  data() {
    const defaultThemeVars = this.getThemeChartVars(this.themeMode);
    const options = dashboardCharts(defaultThemeVars);
    return {
      chartOptions: {
        trades: options,
        tradeVolume: options,
        paymentCR: options,
        paymentDB: options,
      },
      charts: {
        trades: null,
        tradeVolume: null,
        paymentCR: null,
        paymentDB: null,
      },
      timeFrames, // @TODO: USE TimelineControls.vue component instead
      currentTimeFrame: timeFrames[2],
    };
  },
  mounted() {
    this.setTimeFrame(this.timeFrames[2]);
    this.init();
    this.updateTheme(this.themeMode);
  },
  computed: {
    loading() {
      return this.$store.getters['account/overviewLoaing'];
    },
    themeMode() {
      return this.$store.getters['app/themeMode'];
    },
    stats() {
      return this.$store.getters['account/overview'] || {};
    },
    trades() {
      return this.stats.trades || '0';
    },
    tradeVolume() {
      return this.stats.tradeVolume || '0';
    },
    paymentCR() {
      if (this.stats.payments) {
        return this.stats.payments.CR;
      }

      return '0';
    },
    paymentDB() {
      if (this.stats.payments) {
        return this.stats.payments.DB;
      }

      return '0';
    },
    tradesChartData() {
      if (this.stats && this.stats.tradesChart) {
        return this.stats.tradesChart;
      }
      return [];
    },
    tradeVolumeChartData() {
      if (this.stats && this.stats.tradeVolumeChart) {
        return this.stats.tradeVolumeChart;
      }
      return [];
    },
    paymentCRChartData() {
      if (this.stats && this.stats.payments && this.stats.payments.CRChart) {
        return this.stats.payments.CRChart;
      }
      return [];
    },
    paymentDBChartData() {
      if (this.stats && this.stats.payments && this.stats.payments.DBChart) {
        return this.stats.payments.DBChart;
      }
      return [];
    },
  },
  methods: {
    init() {
      Object.keys(this.charts).forEach((chartKey) => {
        this.charts[chartKey] = this.$refs[chartKey].chart;
        this.charts[chartKey].update({
          tooltip: {
            formatter() {
              const round = (n) => {
                if (n >= 1) {
                  return n.toFixed(2);
                }

                return n.toFixed(6);
              };
              const y = round(new Big(parseFloat(this.y)));
              return `${y}`;
            },
          },
        });
        this.charts[chartKey].reflow();
      });
      /* eslint-enable */
    },
    setTimeFrame(value) {
      this.currentTimeFrame = value;
      this.$store.dispatch('account/overview', this.currentTimeFrame.resolution);
    },
    isTimeFrameActive(value) {
      return this.currentTimeFrame.text === value.text;
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
      if (this.currentTimeFrame.resolution === RESOLUTION_DAY) {
        interval = 4;
      } else if (this.currentTimeFrame.resolution === RESOLUTION_WEEK) {
        interval = 1;
      } else if (this.currentTimeFrame.resolution === RESOLUTION_MONTH) {
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

              if (self.currentTimeFrame.resolution === RESOLUTION_DAY) {
                offset = (24 - this.value) * (ONE_DAY / 24);
              } else if (self.currentTimeFrame.resolution === RESOLUTION_WEEK) {
                offset = (6 - this.value) * ONE_DAY;
              } else if (self.currentTimeFrame.resolution === RESOLUTION_MONTH) {
                offset = (30 - this.value) * ONE_DAY;
              } else if (self.currentTimeFrame.resolution === RESOLUTION_YEAR) {
                offset = (12 - this.value) * ONE_DAY * 30;
              }

              const targetDate = new Date(currentDate.getTime() - offset);
              let targetString = '';

              if (self.currentTimeFrame.resolution === RESOLUTION_DAY) {
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
      const self = this;
      const currentDate = new Date();

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
          tickInterval: 3,  // Selected 30 days as default
          labels: {
            style: {
              color: theme.xAxisLabelsColor,
            },
            formatter() {
              let offset = 1;
              if (self.currentTimeFrame.resolution === RESOLUTION_DAY) {
                offset = (24 - this.value) * (ONE_DAY / 24);
              } else if (self.currentTimeFrame.resolution === RESOLUTION_WEEK) {
                offset = (6 - this.value) * ONE_DAY;
              } else if (self.currentTimeFrame.resolution === RESOLUTION_MONTH) {
                offset = (30 - this.value) * ONE_DAY;
              } else if (self.currentTimeFrame.resolution === RESOLUTION_YEAR) {
                offset = (12 - this.value) * ONE_DAY * 30;
              }

              const targetDate = new Date(currentDate.getTime() - offset);
              let targetString = '';

              if (self.currentTimeFrame.resolution === RESOLUTION_DAY) {
                targetString = `${targetDate.getUTCHours()}:${targetDate.getMinutes()}`;
              } else {
                targetString = `${targetDate.toLocaleString('en-us', { month: 'short' })} ${targetDate.getDate()}`;
              }
              return targetString;
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
    paymentCRChartData(val) {
      if (this.charts.paymentCR && this.charts.paymentCR.series) {
        this.charts.paymentCR.series[0].setData(val);
        this.updateChart(this.charts.paymentCR);
      }
    },
    paymentDBChartData(val) {
      if (this.charts.paymentDB && this.charts.paymentDB.series) {
        this.charts.paymentDB.series[0].setData(val);
        this.updateChart(this.charts.paymentDB);
      }
    },
  },
};
</script>
