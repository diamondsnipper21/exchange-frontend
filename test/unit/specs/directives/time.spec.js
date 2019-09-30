import convert from '@/directives/time';

describe('`convert` time function', () => {
  it('returns correct UTC time string', () => {
    const baseDateString = '2000/03/30 23:59:59';
    // Convert to UTC: Thu, 30 Mar 2000 20:59:59 GMT
    const utcDateString = new Date(baseDateString).toUTCString();
    const utcParts = utcDateString.split(' ');
    // Extract time: 20:59:59
    const utcTime = utcParts[utcParts.length - 2];
    // Convert basedate to milliseconds
    const result = convert(new Date(baseDateString).getTime());
    expect(result).to.equal(utcTime);
  });
});
