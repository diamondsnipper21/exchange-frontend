import format from '@/directives/fixed-number';

describe('`format` fixed-number function', () => {
  it('returns value back if it\'s not valid', () => {
    const result = format(Infinity);
    expect(result).to.equal(Infinity);
  });

  it('returns a stringified number with 2-decimal precision', () => {
    const result = format(1);
    expect(result).to.equal('1.00');
  });

  it('returns stringified number with 6-decimal precision', () => {
    const result = format(0.5);
    expect(result).to.equal('0.500000');
  });
});
