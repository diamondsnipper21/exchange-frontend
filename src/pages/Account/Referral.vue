<template>
    <v-layout referral__layout row wrap>
        <v-flex xs12 pa-1>
            <div class="title">{{ $t('Referral.referral_plan') }}</div>
            <div class="sub-title"><strong>{{ $t('Referral.comission_on_every_trade') }}</strong></div>

            <v-layout class="panel-link" row wrap grid-list-md text-xs-center mb-5>
                <v-flex class="text-xs-left referral-id" xs12 sm4 pa-3>
                    <span class="p__margin">{{ $t('Referral.my_referral_id') }}: </span>
                    <span style="font-weight:bold">{{referralCode}}</span>
                </v-flex>
                <v-flex class="text-xs-left referral-link" xs12 sm8 pa-3>
                    <span class="p__margin">{{ $t('Referral.your_referral_link') }}: </span>
                    <input id="referral-link" type="text" class="field ref__field" readonly="readonly" :value="refLink" placeholder="" />
                    <a @click="copyTestingCode"><i class="fa fa-clone" aria-hidden="true"></i></a>
                </v-flex>
                <v-flex class="text-xs-left referral-share" xs12 sm12 pa-3 v-if="socialNetworks">
                  <hr>
                  <span>{{ $t('Referral.share') }}:</span>
                  <social-sharing :url="refLink" :networks="socialNetworks" inline-template>
                    <div>
                      <network v-for="(network, name, index) in networks" :key="index" :network="name" >
                        <i :class="`fa fa-${name} font-awesome-4`" aria-hidden="true"></i>
                        <!-- <v-icon>{{ `fa fa-${name}` }}</v-icon> -->
                      </network>
                    </div>
                  </social-sharing>
                </v-flex>
            </v-layout>

            <v-layout row wrap grid-list-md text-xs-center>
                <v-flex xs6 sm3 pa-3>
                    <div class="circle-stat clicks-stat">
                        <strong>{{statistics.clicks}}</strong>
                    </div>
                    <span class="clicks-text stat-text">{{ $t('Referral.clicks') }}</span>
                </v-flex>
                <v-flex xs6 sm3 pa-3>
                    <div class="circle-stat regs-stat">
                        <strong>{{statistics.registrations}}</strong>
                    </div>
                    <span class="regs-text stat-text">{{ $t('Referral.registrations') }}</span>
                </v-flex>
                <v-flex xs6 sm3 pa-3>
                    <div class="circle-stat trades-stat">
                        <strong>{{statistics.trades}}</strong>
                        <!-- <infinite-loading
                        style="margin-top: -10px"
                          spinner="spiral"
                        >
                        </infinite-loading> -->
                    </div>
                    <span class="trades-text stat-text">{{ $t('Referral.trades') }}</span>
                </v-flex>
                <v-flex xs6 sm3 pa-3>
                    <div class="circle-stat total-stat">
                        <strong>{{statistics.tradesAmount/100000000}}</strong>
                        <!-- <img src="https://s3-eu-west-1.amazonaws.com/cce-resources/coins/32/color/btc.png"> -->
                        <!-- <infinite-loading
                                style="margin-top: -10px"
                                  spinner="spiral"
                                >
                                </infinite-loading> -->
                    </div>
                    <span class="total-text stat-text">{{ $t('Referral.total_earned') }}</span>
                </v-flex>
            </v-layout>

            <v-layout row wrap grid-list-md text-xs-center>
                <v-flex class="panel-chart py-3" xs12>
                    <line-chart :data="stats" />
                </v-flex>
            </v-layout>

            <v-layout row wrap grid-list-md text-xs-center>
                <v-flex class="cce-referral__table" xs12>
                    <div class="resp-tab">
                        <div class="cce-trade__table-content">
                            <v-data-table :headers="headers" :items="items" item-key="userId" :disable-initial-sort="true" hide-actions :loading="loading">
                                <template slot="items" slot-scope="props">
                                    <tr class="cce-trade__table-tr">
                                        <td class="cce-trade__table-td text-xs-left">
                                            {{props.item.userUid}}
                                        </td>
                                        <td class="cce-trade__table-td text-xs-left">
                                            {{props.item.createdAt}}
                                        </td>
                                        <td class="cce-trade__table-td text-xs-left">
                                            {{ props.item.totalTrades }}
                                        </td>
                                        <td class="cce-trade__table-td text-xs-left">
                                            <span v-fixed-number="props.item.value"></span>
                                        </td>
                                    </tr>
                                </template>
                                <div slot="no-data">
                                <span>
                                  {{ $t('Referral.no_data') }}
                                </span>
                                </div>
                            </v-data-table>
                        </div>
                    </div>
                </v-flex>
            </v-layout>

        </v-flex>
  </v-layout>
</template>

<script>
    /* ============
     * Referral page
     * ============
     *
     * Referral dashboard
     */

    // import User from '@/proxies/UserProxy';
    import AnalyticsProxy from '@/proxies/AnalyticsProxy';
    import InfiniteLoading from 'vue-infinite-loading';
    import SocialSharing from 'vue-social-sharing';
    import Vue from 'vue';

    const allowedSocialNetworks = SocialSharing.data().baseNetworks;
    const defaultSocialNetworks = ['facebook', 'twitter', 'reddit', 'telegram'];
    let socialNetworkNames = defaultSocialNetworks;
    if (Vue.prototype.$themeSettings && Vue.prototype.$themeSettings.socialNetworks) {
      socialNetworkNames = Vue.prototype.$themeSettings.socialNetworks;
    }
    // const socialNetworkNames = Vue.prototype.$themeSettings.socialNetworks || defaultSocialNetworks;
    const socialNetworks = {};
    socialNetworkNames.forEach((name) => {
      /* eslint-disable */
      if (allowedSocialNetworks.hasOwnProperty(name)) {
        socialNetworks[name] = allowedSocialNetworks[name];
      }
      /* eslint-enable */
    });
    export default {
      name: 'account-referral',
      data() {
        return {
          socialNetworks,
          showFacebook: false,
          stats: [{
            name: 'Clicks',
            data: {},
          },
          {
            name: 'Registrations',
            data: {},
          },
          {
            name: 'Trades',
            data: {},
          },
          ],
          loading: true,
          page: 1,
          headers: [{
            text: this.$t('Referral.user_id'),
            align: 'left',
            value: 'userId',
            sortable: false,
          },
          {
            text: this.$t('Referral.date'),
            align: 'left',
            value: 'createdAt',
            sortable: false,
          },
          {
            text: this.$t('Referral.total_trades'),
            align: 'left',
            value: 'order',
            sortable: false,
          },
          {
            text: this.$t('Referral.earns'),
            align: 'left',
            value: 'earns',
            sortable: false,
          },
          ],
          statistics: {
            clicks: 0,
            registrations: 0,
            trades: 0,
            tradesAmount: 0,
          },
          referralCode: '',
          graphData: [],
          items: [],
        };
      },
      mounted() {
        this.fetchStats();
      },
      computed: {
        currentSettings() {
          return this.$store.getters['account/user'] || {};
        },
        origin() {
          return window.location.origin;
        },
        refLink() {
          return `${this.origin}/#/trade?referral=${this.referralCode}`;
        },
      },
      methods: {
        copyTestingCode() {
          const testingCodeToCopy = document.querySelector('#referral-link');
          testingCodeToCopy.select();

          try {
            const successful = document.execCommand('copy');
            const msg = successful
              ? this.$t('Referral.successfully')
              : this.$t('Referral.unsuccessfully');
            this.$notify({
              type: 'success',
              text: this.$t('Referral.referral_link_copy_success', { msg }),
            });
          } catch (err) {
            this.$notify({
              type: 'error',
              text: this.$t('Referral.referral_link_copy_fail', { msg: err }),
            });
          }

          window.getSelection().removeAllRanges();
        },
        async fetchStats() {
          const stats = await new AnalyticsProxy().getStats(this.currentSettings.userUid);
          if (stats.result.referral) {
            const ref = stats.result.referral;
            const {
                        clicks,
                        registrations,
                        trades,
                        tradesAmount,
                    } = ref;
            this.statistics = {
              clicks,
              registrations,
              trades,
              tradesAmount,
            };
            this.referralCode = ref.referralCode;
            const graph = await new AnalyticsProxy().getGraph(ref.referralCode);
            const dataList = graph.result.referral;
            // const offsetInMilliseconds = new Date().getTimezoneOffset() * -60000;
            // for (let i = 0; i < dataList.length; i += 1) {
            //   dataList[i].createdAt = new Date(new Date(dataList[i].createdAt).getTime());
            // }
            const lastWeek = new Date().getTime() - (7 * 24 * 3600 * 1000);
            let oldestDate = dataList[0] && dataList[0].createdAt ? dataList[0].createdAt : lastWeek;
            if (new Date(oldestDate).getTime() > new Date(lastWeek).getTime()) {
              oldestDate = lastWeek;
            }
            const clickEvents = dataList.filter(element => element.type === 'clicks');
            const registrationEvents = dataList.filter(element => element.type === 'registrations');
            const tradeEvents = dataList.filter(element => element.type === 'trades');

            const statsCopy = [...this.stats];
            let dataPoints = {};

// fill in the gaps
// Returns an array of dates between the two dates
            const getDates = (startDate, endDate) => {
              const yates = [];
              let currentDate = startDate;
              const addDays = (days) => {
                const date = new Date(this.valueOf());
                date.setDate(date.getDate() + days);
                return date;
              };
              while (currentDate <= endDate) {
                yates.push(currentDate.toLocaleDateString('en-GB'));
                currentDate = addDays.call(currentDate, 1);
              }
              return yates;
            };

// Usage
            const inbetweens = getDates(new Date(oldestDate), new Date());
            inbetweens.forEach((date) => {
              dataPoints[date] = 0;
            });

            clickEvents.forEach((element) => {
              const createdAt = new Date(element.createdAt).toLocaleDateString('en-GB');
              if (!dataPoints[createdAt]) {
                dataPoints[createdAt] = 1;
              } else if (dataPoints[createdAt]) {
                dataPoints[createdAt] += 1;
              }
            });
            statsCopy[0].data = { ...dataPoints,
            };
            // qqq
            dataPoints = {};
            inbetweens.forEach((date) => {
              dataPoints[date] = 0;
            });

            registrationEvents.forEach((element) => {
              const createdAt = new Date(element.createdAt).toLocaleDateString('en-GB');
              if (!dataPoints[createdAt]) {
                dataPoints[createdAt] = 1;
              } else if (dataPoints[createdAt]) {
                dataPoints[createdAt] += 1;
              }
            });
            statsCopy[1].data = { ...dataPoints,
            };
            // ///

            dataPoints = {};
            inbetweens.forEach((date) => {
              dataPoints[date] = 0;
            });

            // ///
            const tradeCounts = {};
            tradeEvents.forEach((element) => {
              const createdAt = new Date(element.createdAt).toLocaleDateString('en-GB');
              if (!dataPoints[createdAt]) {
                dataPoints[createdAt] = 1;
              } else if (dataPoints[createdAt]) {
                dataPoints[createdAt] += 1;
              }

              if (!tradeCounts[element.userUid]) {
                tradeCounts[element.userUid] = 1;
              } else {
                tradeCounts[element.userUid] += 1;
              }
            });

            tradeEvents.forEach((element) => {
              element.totalTrades = tradeCounts[element.userUid];
              element.value /= 100000000;
              const formattedDate = new Date(element.createdAt).toLocaleDateString('en-GB');
              const formattedTime = new Date(element.createdAt).toLocaleTimeString('en-GB');
              element.createdAt = `${formattedDate} ${formattedTime}`;
            });
            this.items = [...tradeEvents];


            statsCopy[2].data = { ...dataPoints,
            };
            this.stats = [...statsCopy];
          }
        },
        async createStats() {
          await new AnalyticsProxy().createStats(this.currentSettings.userUid);
        },
      },
      watch: {
        currentSettings() {
          this.createStats();
          this.fetchStats();
        },
      },
      components: {
        InfiniteLoading,
      },
    };
</script>

<style>

    .circle-stat > img {
      width: 25px;
      height: 25px;
    }
</style>

