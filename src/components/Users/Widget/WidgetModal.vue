<template>
    <div class="cce-admin-modal">
        <div @click="$emit('onClose')" class="cce-admin-modal__backdrop"></div>
        <div class="cce-admin-modal__container">
            <div class="cce-admin-modal-title">
                <span>{{ title }}</span>
                <v-icon
                    class="cce-admin-modal__close-btn"
                    @click="$emit('onClose')"
                >
                    fas fa-times
                </v-icon>
            </div>
            <v-layout column class="cce-admin-modal__content" px-4 py-4>
                <span class="cce-admin-modal-message">{{ message }}</span>
                <v-layout row>
                    <v-flex d-flex sm4>
                    </v-flex>
                    <v-flex d-flex sm4>
                        <v-btn
                            class='cce-admin_panel-control-button'
                            @click="$emit('onClose')"
                        >
                        {{ $t('AdminManageUser.cancel_btn') }}
                        </v-btn>
                    </v-flex>
                    <v-flex d-flex sm4>
                        <v-btn
                            class='cce-admin_panel-control-button'
                            @click="$emit('onConfirm')"
                        >
                        {{ $t('AdminManageUser.ok_btn') }}
                        </v-btn>
                    </v-flex>
                </v-layout>
            </v-layout>
        </div>
    </div>
</template>

<script>
  /* ============
   * Cancel Modal
   * ============
   */

  export default {
    name: 'widget-modal',
    props: {
      title: {
        type: String,
      },
      message: {
        type: String,
      },
    },
    mounted() {
    },
    data() {
      return {
      };
    },
    computed: {
    },
    methods: {
    },
  };
</script>
