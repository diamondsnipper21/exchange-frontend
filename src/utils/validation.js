export const validation = {
  isNumber(val) {
    const pattern = /^\d+$/;
    return pattern.test(val);
  },
  isLowercase(val) {
    const pattern = /[a-z]/;
    return pattern.test(val);
  },
  isUppercase(val) {
    const pattern = /[A-Z]/;
    return pattern.test(val);
  },
  isSpecialChar(val) {
    const pattern = /^[!@#$%^&*)(+=._-]+$/g;
    return pattern.test(val);
  },
};

export function calculateRating(passwordArray, rating) {
  for (let i = 0; i < passwordArray.length; i += 1) {
    if (validation.isNumber(passwordArray[i])) {
      rating.number = 1;
    } else if (validation.isLowercase(passwordArray[i])) {
      rating.lowercase = 1;
    } else if (validation.isUppercase(passwordArray[i])) {
      rating.uppercase = 1;
    } else if (validation.isSpecialChar(passwordArray[i])) {
      rating.specialChar = 1;
    }
  }
  return rating;
}

export function assessTotalScore(ratingElement, calculatedRating) {
  calculatedRating.total = calculatedRating.number +
    calculatedRating.lowercase +
    calculatedRating.uppercase +
    calculatedRating.specialChar;

  if (calculatedRating.total === 0) {
    ratingElement.innerHTML = '';
    ratingElement.classList.remove('weakPassword', 'moderatePassword', 'strongPassword');
  } else
  if (calculatedRating.total === 1) {
    ratingElement.innerHTML = 'Weak';
    ratingElement.classList.remove('moderatePassword', 'strongPassword');
    ratingElement.classList.add('weakPassword');
  } else if (calculatedRating.total === 2) {
    ratingElement.innerHTML = 'Moderate';
    ratingElement.classList.remove('weakPassword', 'strongPassword');
    ratingElement.classList.add('moderatePassword');
  } else if (calculatedRating.total === 3) {
    ratingElement.innerHTML = 'Strong';
    ratingElement.classList.remove('weakPassword', 'moderatePassword');
    ratingElement.classList.add('strongPassword');
  }
}
