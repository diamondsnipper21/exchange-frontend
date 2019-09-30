<template>
  <td
    class="cce-trade__table-td cce-trade__table-td--tooltip text-xs-right cursor-pointer"
    v-tooltip.right="{
      content: tooltipFallback
    }"
    @click="$emit('onClick')"
    :style="{ position: 'relative' }"
  >
    <v-flex
      justify-end
      :class="colorClass"
      v-html="priceMod"
    >
    </v-flex>
    <div
      v-if="flag"
      class="price-cell__flag"
      :class="{
        'cce-background__low': ask,
        'cce-background__high': bid,
      }"
      :style="{ opacity: 0.5 }"
    ></div>
  </td>
</template>

<script>
export default {
  name: 'order-book-price-cell',
  props: {
    order: {
      type: Object,
    },
    exchangeRate: {
      type: Number,
    },
    priceMod: {
      type: String,
    },
    colorClass: {
      type: String,
    },
    flag: {
      type: Boolean,
    },
    ask: {
      type: Boolean,
    },
    bid: {
      type: Boolean,
    },
  },
  computed: {
    tooltipFallback() {
      return this.order.rateUSDC !== undefined
        ? `$${this.convertToDecimal(this.order.rateUSDC)}`
        : 'Updating...';
    },
  },
};
</script>

<style lang="scss" scoped>
.price-cell__flag {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  top: 50%;
  right: -8px;
  z-index: 10;
  transform: translateY(-50%);
}
</style>
