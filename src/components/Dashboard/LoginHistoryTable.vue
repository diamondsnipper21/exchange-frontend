<template>
  <table-container :title="$t('RecentLogsTable.recent_logs')">
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
      <div slot="no-data">
        <span>
          {{ $t('RecentLogsTable.have_no_recent_logs') }}
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
import User from '@/proxies/UserProxy';
import TableContainer from '@/components/UI/TableContainer';
import handleErrorMessage from '@/utils/handleErrorMessage';

export default {
  name: 'login-history-table',
  components: {
    TableContainer,
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
      accessLogs: [],
      error: null,
      loading: false,
    };
  },
  mounted() {
    this.loadAccessLogs();
  },
  methods: {
    /**
     * Makes a request to get login history data
     */
    async loadAccessLogs() {
      this.loading = true;
      try {
        const result = await new User().listAccessLogs();
        this.accessLogs = result.result.accessLogs;
        console.log(this.accessLogs)
        this.loading = false;
      } catch (e) {
        this.error = handleErrorMessage(e);
        this.loading = false;
      }
    },
  },
};
</script>
