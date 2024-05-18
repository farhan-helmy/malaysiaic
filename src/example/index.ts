import { parse } from '../index';

const icNum = '1910401052331';

try {
  parse(icNum);
} catch (error) {
  console.log(error);
}
