<template>
  <v-layout vouchers row wrap>
    <v-flex>
      <div class="title">{{ $t('Vouchers.your_vouchers') }}</div>

      <div class="sub-title" v-html="$t('Vouchers.congrats')"></div>

      <v-layout row wrap grid-list-md text-xs-center mb-5>
        <v-flex xs12 sm4 md3 pa-3 v-for="item in biletCadou" :key="item.id">
          <div class="ticket-number green">
            <div class="ticket-corners-top"></div>
            <v-flex pa-3>
              <div class="content">
                <v-card-text class="px-0"> {{ item.number }} {{ $t('Vouchers.usd_worth_of_tc') }}</v-card-text>
              </div>
            </v-flex>
            <div class="ticket-corners-bottom"></div>
          </div>
        </v-flex>
      </v-layout>

      <div class="title">{{ $t('Vouchers.your_tickets') }}</div>
      <div class="gold-title">{{ $t('Vouchers.win_1_million_usd') }}</div>
      <div class="sub-title">{{ $t('Vouchers.rules') }}</div>

      <v-layout row wrap grid-list-md text-xs-center>
        <v-flex xs12 sm4 md3 pa-3 v-for="item in biletDePapagal" :key="item.id">
          <div class="ticket-number golden">
            <div class="ticket-corners-top"></div>
            <v-flex pa-3>
              <div class="content">
                <i aria-hidden="true" class="icon fa fa-star"></i>
                <v-card-text class="px-0">Nº {{ item.number }} </v-card-text>
                <i aria-hidden="true" class="icon fa fa-star"></i>
              </div>
            </v-flex>
            <div class="ticket-corners-bottom"></div>
          </div>
        </v-flex>
      </v-layout>

    </v-flex>
  </v-layout>


</template>

<script>
  /* ============
   * Dashboard page
   * ============
   *
   * Dashboard page for the account section
   */

  export default {
    name: 'account-vouchers',
    mounted() {
    },
    data() {
      return {
        biletCadou: [
          { number: '50' },
        ],
        biletDePapagal: [
          // { number: '245 765' },
          // { number: '645 906' },
          // { number: '454 889' },
          // { number: '984 278' },
        ],
      };
    },
    computed: {
    },
    methods: {
    },
  };
</script>
