import Vue from 'vue';

export function mount(Component, propsData = {}) {
  const Constructor = Vue.extend(Component);
  const vm = new Constructor({ propsData }).$mount();
  return vm;
}
