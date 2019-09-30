<template>
  <v-select
    :label="$t('AccountCoinSelect.select_coin')"
    :items="items"
    :value="value"
    item-text="name"
    item-value="currency"
    @input="$emit('input_', $event)"
    @change="$emit('input', $event)"
    :search-input.sync="search"
    single-line
    :autocomplete="!withBalance"
    dense
    :clearable="clearable"
    :filter="customFilter"
    :color="colors"
    hide-details
  >
    <template
      slot="selection"
      slot-scope="data"
      v-if="!hide"
    >
      <v-layout row justify-space-between :style="{ width: '100%', cursor: 'pointer' }">
          <v-layout row align-center
            class="cce-account__select-coin-selected"
            v-if="data.item.currency"
          >
            <currency-image :currency="data.item.currency" />
            <span class="cce-account__select-coin-abbr">
              {{ data.item.currency }}
            </span>
            &nbsp;
            <span class="cce-account__select-coin-name">
              {{ data.item.name }}
            </span>
          </v-layout>
        <div v-if="withBalance && !!data.item.availableBalance !== undefined">
          <span v-decimals.include-zero-value="{ text: data.item.availableBalance, precision: 8 }"></span>
          <span class="cce-account__select-coin-abbr">{{ data.item.currency }}</span>
        </div>
      </v-layout>
    </template>
    <template
      slot="item"
      slot-scope="data"
    >
      <v-layout row justify-space-between align-center style="width: 100%;">
        <!-- <div> -->
          <v-layout row align-center
            class="cce-account__select-coin"
                v-if="data.item.currency"
          >
            <currency-image :currency="data.item.currency" />
            <span class="cce-account__select-coin-abbr">
              <template v-if="!data.item.type || data.item.type !== 'cash'">
                {{ data.item.currency }}
              </template>
            </span>
            &nbsp;
            <span class="cce-account__select-coin-name">
              {{ data.item.name }}
            </span>
          </v-layout>
        <!-- </div> -->
        <div v-if="withBalance && data.item.availableBalance !== undefined">
          <span v-decimals.include-zero-value="{ text: data.item.availableBalance, precision: 8 }"></span>
        </div>
      </v-layout>
    </template>
  </v-select>
</template>

<script>
  /* ============
   * Coin select component
   * ============
   *
   * Component will list coins for selection
   */
  import CurrencyImage from '@/components/UI/CurrencyImage';

  export default {
    name: 'coin-select',
    components: {
      CurrencyImage,
    },
    props: {
      value: {
        default: null,
      },
      items: {
        default: [],
      },
      clearable: {
        default: false,
      },
      withBalance: {
        type: Boolean,
        default: false,
      },
      colors: {
        type: String,
        default: 'teal lighten-2',
      },
    },
    data() {
      return {
        hide: false,
        search: null,
      };
    },
    methods: {
      // custom search filter
      customFilter(item, queryText) {
        const hasValue = (val) => {
          const res = val != null ? val : '';
          return res;
        };
        const name = hasValue(item.name);
        const abbr = hasValue(item.currency);
        const query = hasValue(queryText);
        const s1 = name.toString().toLowerCase().indexOf(query.toString().toLowerCase()) > -1;
        const s2 = abbr.toString().toLowerCase().indexOf(query.toString().toLowerCase()) > -1;
        return s1 || s2;
      },
    },
    watch: {
      // hide label if search is active
      search(val) {
        if (val !== '' && val !== null) {
          this.hide = true;
        } else {
          this.hide = false;
        }
      },
    },
  };
</script>
