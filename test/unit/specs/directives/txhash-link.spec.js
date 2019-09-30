/* eslint-disable no-template-curly-in-string */
import { renderLink, breakTxHash } from '@/directives/txhash-link';

describe('`renderLink` function', () => {
  it('returns correct link for currency', () => {
    const btcUrl = 'https://blockexplorer.com/tx/${txHash}';
    const hash = 'ASdasdzxcZXCasdWQe123';
    const result = renderLink(hash, 'btc', btcUrl);
    expect(result).to.be.a('string').that.includes(btcUrl.replace('${txHash}', ''));
    expect(result).to.be.a('string').that.includes(hash);
  });
});

describe('`breakTxHash` function', () => {
  let hash;
  let result;
  beforeEach(() => {
    hash = 'ASdasdzxcZXCasdWQe123mnbasdKAJSHDKKAJShdnbnxc';
    result = breakTxHash(hash);
  });

  it('has 3 dots', () => {
    expect(result).to.be.a('string').that.includes('...');
  });

  it('contains parts of hash', () => {
    expect(result).to.be.a('string').that.includes(hash.slice(0, 10));
    expect(result).to.be.a('string').that.includes(hash.slice(hash.length - 10));
  });

  it('has correct length', () => {
    expect(result.length).to.equal(23);
  });
});
