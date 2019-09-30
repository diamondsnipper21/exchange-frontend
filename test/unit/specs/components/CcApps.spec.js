import CcApps from '@/components/CcApps';
import { mount } from '../../testUtils';

describe('`CcApps.vue` component', () => {
  let component;
  beforeEach(() => {
    component = mount(CcApps);
  });

  it('does not render menu if `menu` state is `false`', () => {
    expect(component.$el.querySelector('.cc-apps-menu').style.display).to.equal('none');
  });

  it('`toggleMenu` method is working correctly', () => {
    expect(component.menu).to.equal(false);
    component.toggleMenu();
    expect(component.menu).to.equal(true);
  });
});
