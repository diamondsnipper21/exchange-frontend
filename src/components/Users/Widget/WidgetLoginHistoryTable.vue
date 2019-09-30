<template>
  <table-container>
    <v-data-table
      :headers="headers"
      :items="accessLogs"
      item-key="logTime"
      hide-actions
      :loading="loading"
    >
      <template slot="items" slot-scope="props">
        <tr class="cce-trade__table-tr">
          <table-cell subheader dataLabel="Date">
            <span v-date.short="props.item.logTime"></span>
          </table-cell>
          <table-cell subheader dataLabel="Type">
            <span class="cce-capitalize">{{ props.item.logType }}</span>
          </table-cell>
          <table-cell subheader dataLabel="IP">
            <!-- using kryptostack alias -->
            {{
                props.item.logIp === '104.248.87.23'
                  ? 'www.kryptostack'
                  : props.item.logIp
            }}
          </table-cell>
          <table-cell subheader dataLabel="Location">
            <div class="location-wrap">
              <span v-if="props.item.logLocation && props.item.logLocation.locality">
                {{ props.item.logLocation.locality }},
              </span>
              <span v-if="props.item.logLocation && props.item.logLocation.country">
                {{ props.item.logLocation.country }}
              </span>
            </div>
          </table-cell>
        </tr>
      </template>
      <div slot="no-data" class="cce-nodata-center">
        <span class="cce-trade__table-td cce-opacity">
          {{ $t('UserLogsWidget.have_no_logs') }} ({{$t('TradeUserOrders.selected')}} {{ timeframeToFilterBy }})
        </span>
      </div>
    </v-data-table>
  </table-container>
</template>

<script>
/**
 * ===============================
 * Login History Table component
 * ===============================
 *
 * Renders user's login history data
 */
import TableContainer from '@/components/UI/TableContainer';

export default {
  name: 'widget-login-history-table',
  components: {
    TableContainer,
  },
  props: {
    accessLogs: {
      type: Array,
      default: [],
    },
    timeframeToFilterBy: {
      type: String,
    },
    loading: {
      type: Boolean,
    },
  },
  data() {
    return {
      headers: [
        {
          text: this.$t('RecentLogsTable.date'),
          align: 'left',
          value: 'logTime',
          sortable: false,
        },
        {
          text: this.$t('RecentLogsTable.type'),
          align: 'left',
          value: 'logType',
          sortable: false,
        },
        {
          text: this.$t('RecentLogsTable.ip'),
          align: 'left',
          value: 'logIp',
          sortable: false,
        },
        {
          text: this.$t('RecentLogsTable.location'),
          align: 'left',
          value: 'logLocation',
          sortable: false,
        },
      ],
      error: null,
    };
  },
  mounted() {
  },
  methods: {
  },
};
</script>
