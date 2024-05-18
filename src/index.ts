import { isValidBirthplace, parseBirthplace } from './birthplace';
import { generateRandomIc } from './random';

// Check if date is before disregarding year.
function dateIsBefore(before: Date, max: Date) {
  const bNorm = new Date(0, before.getMonth(), before.getDate());
  const mNorm = new Date(0, max.getMonth(), max.getDate());

  return bNorm < mNorm;
}

function codeToDate(year: number, month: number, day: number) {
  const today = new Date();
  const birthDate = new Date(year, month - 1, day);

  const age = today.getFullYear() - birthDate.getFullYear();

  // Works for now. Update this in year 2099.
  // For same year, checks if date has passed.
  if (age > 100 || (age == 100 && dateIsBefore(birthDate, today))) {
    birthDate.setFullYear(birthDate.getFullYear() + 100);
  }

  // Check valid date.
  return birthDate.getDate() == day && birthDate.getMonth() == month - 1
    ? birthDate
    : NaN;
}

function codeToGender(code: number) {
  return code % 2 === 0 ? 'female' : 'male';
}

function extractParts(icNum: string) {
  const regex = /^(\d{2})(\d{2})(\d{2})-?(\d{2})-?(\d{3})(\d{1})$/;
  const parts = regex.exec(icNum);

  if (!parts) {
    throw new Error('Invalid MyKad number format');
  }

  return parts;
}

function isValidIc(icNum: string): boolean {
  let parts;
  let intParts;

  try {
    parts = extractParts(icNum);
    intParts = parts.map(Number);
  } catch (error) {
    return false;
  }

  const birthDate = codeToDate(intParts[1], intParts[2], intParts[3]);
  return !isNaN(birthDate as number) && isValidBirthplace(intParts[4]);
}

function parseIc(
  icNum: string,
  cb?: (error: Error | null, parsedData: any) => void
): any {
  let parts;
  let intParts;

  try {
    parts = extractParts(icNum);
    intParts = parts.map(Number);
  } catch (error) {
    if (!cb) throw new Error('Invalid MyKad number format');
    return cb(new Error('Invalid MyKad number format'), null);
  }

  const parsedData = {
    birthDate: codeToDate(intParts[1], intParts[2], intParts[3]),
    birthPlace: parseBirthplace(intParts[4]),
    gender: codeToGender(intParts[6]),
  };

  if (cb) {
    return cb(null, parsedData);
  }

  return parsedData;
}

function formatIc(
  icNum: string,
  cb?: (error: Error | null, parsedData: any) => void
): string | void {
  let parts;

  try {
    parts = extractParts(icNum);
  } catch (error) {
    if (!cb) throw new Error('Invalid MyKad number format');
    return cb(Error('Invalid MyKad number format'), null);
  }

  const formatted = `${parts[1]}${parts[2]}${parts[3]}-${parts[4]}-${parts[5]}${parts[6]}`;

  if (cb) {
    return cb(null, formatted);
  }

  return formatted;
}

function unformatIc(
  icNum: string,
  cb?: (error: Error | null, parsedData: any) => void
): string | void {
  if (!cb) {
    const formatted = formatIc(icNum) as string;
    return formatted.replace(/-/g, '');
  }

  formatIc(icNum, (err, formatted: string) => {
    if (err) {
      return cb(err, null);
    }

    return cb(null, formatted.replace(/-/g, ''));
  });
}

export { isValidIc, parseIc, formatIc, unformatIc, generateRandomIc };
