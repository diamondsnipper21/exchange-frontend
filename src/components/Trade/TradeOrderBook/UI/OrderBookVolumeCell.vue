<template>
  <td class="cce-trade__table-td cce-trade__table-activate text-xs-right cell">
    <span v-decimals.include-zero-value="{ text: volume, precision }"></span>
  </td>
</template>

<script>
export default {
  name: 'order-book-volume-cell',
  props: {
    volume: {
      type: [Number, String],
    },
    precision: {
      type: Number,
      default: 4,
    },
  },
};
</script>

<style lang="scss" scoped>
.cell {
  width: 30%;
}
</style>
