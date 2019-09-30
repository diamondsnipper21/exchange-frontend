import Vue from 'vue';
import { validation, calculateRating, assessTotalScore } from '@/utils/validation';

describe('`validation` object methods', () => {
  it('tests `isNumber` value correctly', () => {
    const truthyResult = validation.isNumber('45');
    const falsyResult = validation.isNumber('45a');
    expect(truthyResult).to.equal(true);
    expect(falsyResult).to.equal(false);
  });

  it('tests `isLowercase` value correctly', () => {
    const lower = validation.isLowercase('example');
    const capital = validation.isLowercase('Example');
    const upper = validation.isLowercase('EXAMPLE');
    expect(lower).to.equal(true);
    expect(capital).to.equal(true);
    expect(upper).to.equal(false);
  });

  it('tests `isUppercase` value correctly', () => {
    const upper = validation.isUppercase('EXAMPLE');
    const capital = validation.isUppercase('Example');
    const lower = validation.isUppercase('example');
    expect(upper).to.equal(true);
    expect(capital).to.equal(true);
    expect(lower).to.equal(false);
  });

  it('tests `isSpecialChar` value correctly', () => {
    const truthyResult = validation.isSpecialChar('$');
    const falsyResult = validation.isSpecialChar('10');
    expect(truthyResult).to.equal(true);
    expect(falsyResult).to.equal(false);
  });
});

describe('`calculateRating` validation function', () => {
  it('calculates rating correctly', () => {
    const rating = {
      number: 0,
      lowercase: 0,
      uppercase: 0,
      specialChar: 0,
      total: 0,
    };
    const weakPassword = calculateRating('aaaaaaaa', rating);
    const moderatePassword = calculateRating('AAAaaaaa', rating);
    const strongPassword = calculateRating('AAAAaa22', rating);
    const strongerPassword = calculateRating('AAAAaa22$', rating);
    expect(weakPassword.lowercase).to.equal(1);
    expect(moderatePassword.uppercase).to.equal(1);
    expect(strongPassword.number).to.equal(1);
    expect(strongerPassword.specialChar).to.equal(1);
  });
});

describe('`assertTotalScore` validation function', () => {
  let Constructor;
  let vm;
  let rating;
  beforeEach(() => {
    Constructor = Vue.extend({
      template: '<div class="password-rating"></div>',
    });
    vm = new Constructor().$mount();
    rating = {
      number: 0,
      lowercase: 0,
      uppercase: 0,
      specialChar: 0,
      total: 0,
    };
  });

  it('inserts \'weak\' text for weak password', () => {
    const password = 'aaaaaaaa';
    const calculatedRating = calculateRating(password, rating);
    assessTotalScore(vm.$el, calculatedRating);
    expect(vm.$el.innerHTML).to.include('Weak');
    expect(Array.from(vm.$el.classList)).to.include('weakPassword');
  });

  it('inserts \'moderate\' text for moderate password', () => {
    const password = 'AAAAaaaa';
    const calculatedRating = calculateRating(password, rating);
    assessTotalScore(vm.$el, calculatedRating);
    expect(vm.$el.innerHTML).to.include('Moderate');
    expect(Array.from(vm.$el.classList)).to.include('moderatePassword');
  });

  it('inserts \'strong\' text for strong password', () => {
    const password = 'AAAAaaaa222';
    const calculatedRating = calculateRating(password, rating);
    assessTotalScore(vm.$el, calculatedRating);
    expect(vm.$el.innerHTML).to.include('Strong');
    expect(Array.from(vm.$el.classList)).to.include('strongPassword');
  });
});
