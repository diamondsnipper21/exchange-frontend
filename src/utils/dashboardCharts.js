/**
 * Returns chart options using theme variables
 * @param {Object} defaultThemeVars theme style variables
 * @returns {Object} chart options
 */
export default function dashboardCharts(defaultThemeVars) {
  return {
    chart: {
      type: 'area',
      zoomType: 'x',
      backgroundColor: defaultThemeVars.ChartBackgroundColor,
      events: {
        load: () => {
          // better init than flaky timeouts?
          // this.init(); // @TODO this should replace the timeout
          // once we figured out why it breaks the init.
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
}
