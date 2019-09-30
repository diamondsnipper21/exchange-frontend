<template>
  <td @click="$emit('selectAmount')" class="cce-trade__table-td cce-trade__table-activate table__cell cursor-pointer">
    <v-layout row class="table__cell__row" justify-space-between>
      <div v-if="max" class="table__cell__bar-wrapper">
        <div
          :class="{
            'table__cell__bar': true,
            'cce-trade__table-bar-ask': ask,
            'cce-trade__table-bar-bid': bid,
          }"
          :style="{ width: calcBarWidth(total, max) }"
        >
        </div>
      </div>
      <div v-decimals.include-zero-value="{ text: total, precision }" class="table__cell__value"></div>
    </v-layout>
  </td>
</template>

<script>
export default {
  name: 'order-book-amount-cell',
  props: {
    total: {
      type: [Number, String],
    },
    max: {
      type: Number,
    },
    precision: {
      type: Number,
      default: 4,
    },
    ask: {
      type: Boolean,
    },
    bid: {
      type: Boolean,
    },
  },
  methods: {
    calcBarWidth(amount, maxAmount) {
      const width = 40;
      const val = Math.ceil((amount / maxAmount) * width, 2);
      return `${val}px`;
    },
  },
};
</script>

<style lang="scss" scoped>
.table__cell {
  padding: 1px 10px 1px 0;
  width: 35%;

  &__bar-wrapper {
    position: relative;
    width: 40px;
    // margin-right: 10px;
    overflow: hidden;
  }

  &__bar {
    position: absolute;
    top: 0;
    bottom: 0;
    left: -3px;
    z-index: 1;
  }

  &__value {
    word-break: keep-all;
  }
}
</style>
