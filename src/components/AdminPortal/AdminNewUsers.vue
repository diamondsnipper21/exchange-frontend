<template>
  <table-container :title="$t('AdminNewUsers.new_users')">
    <v-data-table
      :headers="tableHeaders"
      :items="newUsers"
      hide-actions
      :disable-initial-sort="true"
      :loading="!usersReady"
      item-key="email"
    >
      <template
        slot="items"
        slot-scope="props"
      >
        <tr class="cce-trade__table-tr">
          <table-cell subheader>
            <span v-date.short="props.item.createdAt"></span>
          </table-cell>
          <table-cell subheader>
            {{ props.item.email }}
          </table-cell>
          <table-cell subheader>
            <!-- add an alias for kryptostack IP -->
            {{
                props.item.ip === '104.248.87.23'
                  ? 'www.kryptostack'
                  : props.item.signupIp || 'n/a'
            }}
          </table-cell>
        </tr>
      </template>
      <div slot="no-data">
        <span class="cce-trade__no-data text-subheader-color" v-if="!usersReady">
          {{ $t('AdminNewUsers.no_users') }}
        </span>
      </div>
    </v-data-table>
  </table-container>
</template>

<script>
/* ============
 * Admin new users component
 * ============
 *
 * Renders new users for admin portal owerview
 */
import TableContainer from '@/components/UI/TableContainer';

export default {
  name: 'admin-new-users',
  components: {
    TableContainer,
  },
  data() {
    return {
      tableHeaders: [
        {
          text: this.$t('AdminNewUsers.date'),
          align: 'left',
          value: 'createdAt',
          sortable: false,
        },
        {
          text: this.$t('AdminNewUsers.email'),
          align: 'left',
          value: 'email',
          sortable: false,
        },
        {
          text: this.$t('AdminNewUsers.ip'),
          align: 'left',
          value: 'signupIp',
          sortable: false,
        },
      ],
    };
  },
  computed: {
    /**
     * Returns if users data is loading
     * @returns {Boolean}
     */
    usersReady() {
      return !(this.$store.getters['admin/newUsers'] == null);
    },

    /**
     * Returns users data from store
     * @returns {Array}
     */
    newUsers() {
      const newUsers = this.$store.getters['admin/newUsers'];
      // sort by createdAt from recent to older
      if (newUsers) return [...newUsers];
      return [];
    },
  },
};
</script>
