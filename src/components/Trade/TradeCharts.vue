<template>
  <!-- Trade Panel -->
  <div
    class="cce-trade__panel"
    :class="[ chartType === 'price' ? 'cce-trade__price-chart--show' : 'cce-trade__depth-chart--show' ]"
  >
    <div class="cce-trade__panel-title">
      <div class="cce-trade__price-chart-title">
        <span>
          <v-icon
            @click="resizePriceChart"
            v-if="isResizable"
            class="toggle-button"
          >
            {{ tradePriceChartExpanded ? 'keyboard_arrow_right' : 'keyboard_arrow_left' }}
          </v-icon>
          {{ $t('TradeCharts.price_chart') }}
        </span>
        <trade-volume/>
      </div>
      <div class="cce-trade__depth-chart-title">{{ $t('TradeCharts.market_depth_chart') }}</div>
      <v-spacer />
      <div class="cce-trade__charts-toggle">
        <v-btn-toggle
          mandatory
          v-model="chartType"
        >
          <v-btn
            flat
            small
            value="price"
          >
            {{ $t('TradeCharts.price_chart') }}
          </v-btn>
          <v-btn
            flat
            small
            value="depth"
          >
            {{ $t('TradeCharts.depth_chart') }}
          </v-btn>
        </v-btn-toggle>
      </div>
    </div>
    <v-layout column>
      <v-flex
        d-flex
        class="cce-trade__price-chart"
        :style="{ height: tradePriceChartExpanded && isResizable ? '45%' : 'auto' }"
      >
        <div class="cce-trade__panel">
          <!-- Price Chart -->
          <trade-chart-price/>
        </div>
      </v-flex>
      <!-- Insert TradeHistory & TradeUserOrders if the price chart is full-sized -->
      <!-- ====================================================================== -->
      <v-flex
        v-if="!isResizable || !tradePriceChartExpanded"
        d-flex
        class="cce-trade__depth-chart"
      >
        <div class="cce-trade__panel pt-1">
          <!-- Market Depth Chart -->
          <trade-chart-depth/>
        </div>
      </v-flex>
      <!-- ||||||||||||||||||||||||||||||||||||||||||||||||||||| -->
      <v-flex v-else :style="{ height: '55%' }" class="cce-bg-fill">
        <v-layout row>
          <v-layout class="cce-trade__history pr-2 pt-2">
            <!-- Trade History -->
            <trade-history />
          </v-layout>
          <v-layout column>
            <v-layout :style="{ minHeight: '50%', maxHeight: '80%' }" class="cce-trade__panel cce-trade__depth-chart">
              <!-- Market Depth Chart -->
              <trade-chart-depth/>
            </v-layout>
            <v-layout :class="{ 'pt-2': true, 'cce-trade__user-orders--hide' : !tradeUserOrdersVisibility }">
              <!-- Trade User Orders -->
              <trade-user-orders />
            </v-layout>
          </v-layout>
        </v-layout>
      </v-flex>
      <!-- ====================================================================== -->
    </v-layout>
  </div>
</template>

<script>
  /* ============
   * Charts holder
   * ============
   *
   * Charts holder component to render Price and Market Depth charts
   */

  import TradeChartPrice from '@/components/Trade/TradeChartPrice';
  import TradeChartDepth from '@/components/Trade/TradeChartDepth';
  import TradeVolume from '@/components/Trade/TradeVolume';

  import TradeHistory from '@/components/Trade/TradeHistory';
  import TradeUserOrders from '@/components/Trade/TradeUserOrders';

  export default {
    name: 'trade-charts',
    data() {
      return {
        chartType: 'price',
      };
    },
    components: {
      TradeChartPrice,
      TradeChartDepth,
      TradeVolume,
      TradeHistory,
      TradeUserOrders,
    },
    props: {
      isResizable: {
        type: Boolean,
      },
    },
    mounted() {
      // Check price chart state
      if (this.authenticated) {
        this.$store.dispatch('app/checkPriceChartExpanded');
        this.$emit('resizeChart', this.tradePriceChartExpanded);
      }
    },
    methods: {
      // Change price chart size
      resizePriceChart() {
        this.$store.dispatch('app/setPriceChartExpanded', !this.tradePriceChartExpanded);
        this.$emit('resizeChart', this.tradePriceChartExpanded);
      },
    },
    computed: {
      tradeUserOrdersVisibility() {
        return this.$store.getters['app/tradeUserOrdersVisible'];
      },
      tradePriceChartExpanded() {
        return this.$store.getters['app/tradePriceChartExpanded'];
      },
      authenticated() {
        return this.$store.getters['auth/authenticated'];
      },
    },
    watch: {
      // set visible chart type (for smaller screens)
      chartType(value) {
        this.$store.dispatch('app/setChartType', value);
      },
    },
  };
</script>

<style lang="scss" scoped>
.toggle-button {
  padding: 0;
  margin-left: -10px;
  margin-top: -3px;
  cursor: pointer;
}
</style>
