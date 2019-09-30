<template>
  <tr class="text-xs-left" :style="{ height: '20px' }">
    <td
      v-if="isNoDataVisible"
      colspan="3"
      class="cce-trade__table-td"
    >
      <span class="cce-trade__no-data">
        {{ $t('OrderBookFakeRow.no_data') }}
      </span>
    </td>
    <td v-else></td>
    <td></td>
    <td></td>
  </tr>
</template>

<script>
/* ============
* Order Book Fake Row
* ============
*
* Empty table row component for TradeOrderBook and TempOrderBook components
* Renders empty row or `No data` string
*/
export default {
  name: 'order-book-fake-row',
  props: {
    isNoDataVisible: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
