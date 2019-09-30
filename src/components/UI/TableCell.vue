<template>
  <td
    :class="{
      'cce-trade__table-td': true,
      'low-padding': lowPadding,
      'nowrap': true,
      'text-xs-left': left,
      'text-xs-right': right,
      'text-subheader-color': subheader,
      hiddenClass,
    }"
    :data-label="dataLabel"
  >
    <slot></slot>
  </td>
</template>

<script>
export default {
  name: 'table-cell',
  props: {
    lowPadding: { type: Boolean },
    left: { type: Boolean, default: true },
    right: { type: Boolean, default: false },
    subheader: { type: Boolean },
    dataLabel: { type: String, default: null },
    hiddenClass: { type: String, default: null },
  },
};
</script>
