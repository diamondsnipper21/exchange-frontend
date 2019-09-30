<template>
  <div>
    <v-list-tile
      v-for="item in navItems"
      :to="{ name: item.to }"
      :key="item.name"
      class="cce-admin-submenu__list-item"
    >
      <v-list-tile-content class="cce-admin-submenu__list-item__content">
        <v-list-tile-title class="cce-admin-submenu__list-item__content__text">
          {{ item.name }}
        </v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
  </div>
</template>

<script>
/**
 * =======================
 * Admin Submenu component
 * =======================
 *
 * Renders admin portal navigation
 */
export default {
  name: 'admin-sub-menu',
  data() {
    return {
      navItems: [
        {
          to: 'account.admin.overview',
          name: this.$t('AdminSubMenu.overview'),
          href: '/#/account/admin/overview',
        },
        {
          to: 'account.admin.users',
          name: this.$t('AdminSubMenu.users'),
          href: '/#/account/admin/users',
        },
        // {
        //   to: 'account.admin.orders',
        //   name: this.$t('AdminSubMenu.orders'),
        //   href: '/#/account/admin/orders',
        // },
        // {
        //   to: 'account.admin.earnings',
        //   name: this.$t('AdminSubMenu.earnings'),
        //   href: '/#/account/admin/earnings',
        // },
        // {
        //   to: 'account.admin.wallets',
        //   name: this.$t('AdminSubMenu.wallets'),
        //   href: '/#/account/admin/wallets',
        // },
        {
          to: 'account.admin.settings',
          name: this.$t('AdminSubMenu.settings'),
          href: '/#/account/admin/settings',
        },
      ],
    };
  },
};
</script>

<style lang="scss">
.cce-admin-submenu__list-item {
  &__content {
    font-weight: 400;

    &__text {
      padding-left: 62px;
    }
  }
  .list__tile--link {
    &:hover {
      background: $transparent-white-6;
    }
  }
  &.list__tile--link {
    &:hover {
      background: $transparent-white-6;
    }
  }
  .list__tile--active {
    background: $transparent-white-5;
  }
}
</style>
