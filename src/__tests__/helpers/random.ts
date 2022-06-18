export const randomString = (length: number) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const randomInt = (min: number = 0, max: number = 10000) => {
  // eslint-disable-next-line no-mixed-operators
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const randomFloat = (places: number = 2, min: number = 0, max: number = 10000) => {
  // eslint-disable-next-line no-mixed-operators
  const rand = Math.random() * (max - min) + min;
  const power = Math.pow(10, places);
  return Math.floor(rand * power) / power;
};
