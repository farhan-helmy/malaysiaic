import { isValidBirthplace } from './birthplace';

function randomNumberBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate() {
  const today = new Date();

  const start = new Date();
  start.setFullYear(start.getFullYear() - 99);

  return new Date(
    start.getTime() + Math.random() * (today.getTime() - start.getTime())
  );
}

function twoDigitFormat(num: number) {
  return `0${num}`.slice(-2);
}

function dateToCode(date: Date) {
  let code = '';

  code += date.getFullYear().toString().substr(2, 2);
  code += twoDigitFormat(date.getMonth() + 1);
  code += twoDigitFormat(date.getDate());

  return code;
}

function randomBirthplace() {
  let randomCode;

  do {
    randomCode = twoDigitFormat(randomNumberBetween(1, 99));
  } while (!isValidBirthplace(Number(randomCode)));

  return randomCode;
}

function randomSpecialNumber() {
  let code = '';
  for (let i = 0; i < 4; i += 1) {
    code += randomNumberBetween(0, 9);
  }

  return code;
}

export function generateRandom(): string {
  return dateToCode(randomDate()) + randomBirthplace() + randomSpecialNumber();
}
