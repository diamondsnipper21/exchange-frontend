<template>
  <div class="cce-wallet-zero-balance">
    <div class="cce-wallet-zero-balance__header">
      <div class="cce-wallet-zero-balance__title">
        {{ $t('ZeroBalanceAssets.zero_balance_assets') }}
      </div>
    </div>
    <v-layout row wrap px-2 pt-3 pb-2 class="cce-wallet-zero-balance__content">
      <v-flex
        xs6 sm4 md3 lg2 px-1
        v-for="item in data"
        :key="item.currency"
      >
        <div
          class="cce-wallet-currency"
          @click="$emit('onClick', item)"
        >
          <currency-image :currency="item.currency" />
          <span>{{ item.name || item.currency.toUpperCase() }}</span>
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
/**
 * ===============
 * Zero Balance Assets component
 * ===============
 *
 * Contains all currencies (wallets) with zero balance
 */
import TableContainer from '@/components/UI/TableContainer';
import CurrencyImage from '@/components/UI/CurrencyImage';

export default {
  name: 'zero-balance-assets',
  components: {
    TableContainer,
    CurrencyImage,
  },
  props: {
    data: {
      type: Array,
    },
  },
};
</script>
