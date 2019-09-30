<template>
  <v-layout>
    <v-flex>
      <div class="title">{{ $t('RegisterPage.sign_up') }}</div>
      <v-register-form></v-register-form>
      <div>
        {{ $t('RegisterPage.already_a_member') }}
        <router-link :to="{name:'login'}" class="cce-trade__link">
          {{ $t('RegisterPage.log_in') }}
        </router-link>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
  /* ============
   * Register page
   * ============
   *
   * Create account page
   */
  import VLayout from '@/layouts/Auth';
  import VRegisterForm from '@/components/RegisterForm';

  export default {
    name: 'register',
    components: {
      VLayout,
      VRegisterForm,
    },
  };
</script>
