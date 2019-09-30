import TimelineControls from '@/components/TimelineControls';
import { mount } from '../../testUtils';

describe('`TimelineControls.vue` component', () => {
  describe('rendering', () => {
    it('has timeframes data', () => {
      expect(Array.isArray(TimelineControls.data().timeframes)).to.equal(true);
    });

    it('renders correct amount of timeframes', () => {
      const component = mount(TimelineControls);
      const { timeframes } = TimelineControls.data();
      const buttons = Array.from(component.$el.querySelectorAll('.cce-timeline-controls-item'));
      expect(buttons.length).to.equal(timeframes.length);
    });

    it('renders correctly with different props', () => {
      let component = mount(TimelineControls, { initialTimeframe: '1M' });
      let buttons = Array.from(
        component.$el.querySelectorAll('.cce-timeline-controls-item'))
        .filter(btn => btn.innerHTML.includes('1M'));
      expect(buttons.length).to.equal(1);
      expect(buttons[0].className).to.be.a('string').that.includes('cce-timeline-controls-item--active');

      component = mount(TimelineControls, { initialTimeframe: '1D' });
      buttons = Array.from(
        component.$el.querySelectorAll('.cce-timeline-controls-item'))
        .filter(btn => btn.innerHTML.includes('1D'));
      expect(buttons.length).to.equal(1);
      expect(buttons[0].className).to.be.a('string').that.includes('cce-timeline-controls-item--active');
    });
  });

  describe('`selectTimeframe` method', () => {
    it('is working correctly', () => {
      const timeframe = { text: '1Y', resolution: '1' };
      const component = mount(TimelineControls);
      component.selectTimeframe(timeframe);
      expect(component.selectedTimeframe).to.equal(timeframe.text);
    });
  });

  describe('`isTimeframeActive` method', () => {
    const defaultTimeframe = { text: '1D', restriction: '1' };
    let component;
    beforeEach(() => {
      component = mount(TimelineControls, { initialTimeframe: '1D' });
    });

    it('is working correctly with props', () => {
      expect(component.isTimeframeActive(defaultTimeframe)).to.equal(true);
    });

    it('is working correctly with state', () => {
      const timeframe = { text: '1Y', resolution: '1' };
      component.selectTimeframe(timeframe);
      expect(component.isTimeframeActive(timeframe)).to.equal(true);
      expect(component.isTimeframeActive(defaultTimeframe)).to.equal(false);
    });
  });
});
