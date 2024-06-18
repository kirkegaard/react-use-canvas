export const getRandomIntegerBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomFloatBetween = (min, max) => {
  return Math.random() * (max - min) + min;
};
