import Vue from 'vue';
import CurrencyImage from '@/components/UI/CurrencyImage';

describe('`CurrencyImage.vue` component', () => {
  // it('renders correct content using props', () => {
  //   const propsData = { currency: 'USDC' };
  //   const Constructor = Vue.extend(CurrencyImage);
  //   const vm = new Constructor({ propsData }).$mount();
  //   expect(vm.$el.src).to.include(propsData.currency.toLowerCase());
  // });

  it('has `onError` method', () => {
    expect(typeof CurrencyImage.methods.onError).to.equal('function');
  });

  it('uses changes src when `onError` runs', (done) => {
    const propsData = { currency: '' };
    const Constructor = Vue.extend(CurrencyImage);
    const vm = new Constructor({ propsData }).$mount();
    const event = { target: vm.$el };
    vm.onError(event);
    Vue.nextTick(() => {
      expect(vm.$el.src).to.include('unknown-currency');
      done();
    });
  });
});
