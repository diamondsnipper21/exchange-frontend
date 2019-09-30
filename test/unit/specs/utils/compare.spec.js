import compare from '@/utils/compare';

describe('`compare` utility function', () => {
  it('is working correctly with given property', () => {
    const data = [
      { createdAt: Date.now(), id: 1 },
      { createdAt: Date.now() + 360000, id: 2 },
    ];
    const result = data.sort((a, b) => compare(a, b, 'createdAt'));
    expect(result[0].id).to.equal(2);
  });

  it('is working correctly without property arg', () => {
    const data = [10, 20, 30];
    const result = data.sort(compare);
    expect(result).to.deep.equal([30, 20, 10]);
  });
});
