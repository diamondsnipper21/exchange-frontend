<template>
  <div class="cce-timeline-controls">
    <v-btn
      icon
      class="cce-timeline-controls-item"
      v-for="item in timeframes"
      :key="item.text"
      :class="{ 'cce-timeline-controls-item--active': isTimeframeActive(item) }"
      @click="selectTimeframe(item)"
    >
      {{ item.text }}
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'timeline-controls',
  props: {
    initialTimeframe: {
      type: String,
      default: '1M',
    },
  },
  data() {
    return {
      timeframes: [
        { text: '1D', resolution: '1' },
        { text: '1W', resolution: '7' },
        { text: '1M', resolution: '30' },
        { text: '1Y', resolution: '365' },
        { text: 'ALL', resolution: 'All' },
      ],
      selectedTimeframe: '',
    };
  },
  methods: {
    /**
     * Defines if a given timeframe is active
     * @param {Object} timeframe given timeframe
     * @returns {Boolean}
     */
    isTimeframeActive(timeframe) {
      if (this.selectedTimeframe) return this.selectedTimeframe === timeframe.text;
      return this.initialTimeframe === timeframe.text;
    },

    /**
     * Sets a given timeframe as active and emits `onChangeTimeframe` event
     * @param {String} timeframe given timeframe
     */
    selectTimeframe(timeframe) {
      this.selectedTimeframe = timeframe.text;
      this.$emit('onChangeTimeframe', timeframe.text);
    },
  },
};
</script>
