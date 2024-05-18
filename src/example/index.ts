import { parseIc } from '../index';

const icNum = '1910401052331';

try {
  parseIc(icNum);
} catch (error) {
  console.log(error);
}
