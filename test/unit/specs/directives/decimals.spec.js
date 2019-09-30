import { zeros, decimals } from '@/directives/decimals';

describe('`zeros` decimals function', () => {
  it('returns empty string when the value is not provided', () => {
    const result = zeros();
    expect(result).to.equal('');
  });

  it('returns stringified zero number if the value is zero', () => {
    const result = zeros(0);
    expect(result).to.equal('0');
  });

  it('returns stringified value if it is not float number', () => {
    const result = zeros(10);
    expect(result).to.equal('10');
  });
});

describe('`decimals` function', () => {
  it('returns zero with decimals if the value is zero', () => {
    const result = decimals({ text: 0 }, 8);
    expect(result).to.equal('0.00000000');
  });

  it('returns value back if it is not valid', () => {
    const result = decimals(Infinity, 8);
    expect(result).to.equal(Infinity);
  });

  it('returns stringified number with given precision', () => {
    const result = decimals(8.5, 8);
    expect(result).to.equal('8.50000000');
  });

  it('returns stringified number with 2-decimal precision', () => {
    const result = decimals(1);
    expect(result).to.equal('1.00');
  });

  it('returns stringified number with 6-decimal precision', () => {
    const result = decimals(0.5);
    expect(result).to.equal('0.500000');
  });
});
