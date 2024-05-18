import {
  isValidIc,
  parseIc,
  formatIc,
  unformatIc,
  generateRandomIc,
} from '../src';

interface BirthPlace {
  region: string | null;
  country: string;
  state: string | null;
}

interface DataPair {
  birthDate: Date;
  birthPlace: BirthPlace;
  gender: 'male' | 'female';
}

const numDataPairs: { [key: string]: DataPair } = {
  '460911021389': {
    birthDate: new Date(1946, 8, 11),
    birthPlace: { region: 'SOUTHEAST_ASIA', country: 'MY', state: 'KDH' },
    gender: 'male',
  },
  '001103049627': {
    birthDate: new Date(2000, 10, 3),
    birthPlace: { region: 'SOUTHEAST_ASIA', country: 'MY', state: 'MLK' },
    gender: 'male',
  },
  '880527637345': {
    birthDate: new Date(1988, 4, 27),
    birthPlace: { region: 'SOUTHEAST_ASIA', country: 'LA', state: null },
    gender: 'male',
  },
  '440807724018': {
    birthDate: new Date(1944, 7, 7),
    birthPlace: { region: null, country: 'FOREIGN_UNKNOWN', state: null },
    gender: 'female',
  },
  '921105789014': {
    birthDate: new Date(1992, 10, 5),
    birthPlace: { region: 'SOUTH_ASIA', country: 'LK', state: null },
    gender: 'female',
  },
  '640101829913': {
    birthDate: new Date(1964, 0, 1),
    birthPlace: {
      region: 'SOUTHEAST_ASIA',
      country: 'MY',
      state: 'UNKNOWN_STATE',
    },
    gender: 'male',
  },
  '850215902166': {
    birthDate: new Date(1985, 1, 15),
    birthPlace: {
      region: 'MIDDLE_AMERICA',
      country:
        'BS|BB|BZ|CR|CU|DM|DO|SV|GD|GT|HT|HN|' +
        'JM|MQ|MX|NI|PA|PR|KN|LC|VC|TT|TC|VI',
      state: null,
    },
    gender: 'female',
  },
  '880717932209': {
    birthDate: new Date(1988, 6, 17),
    birthPlace: {
      region: 'MISCELLANEOUS',
      country:
        'AF|AD|AQ|AG|AZ|BJ|BM|BT|IO|BF|CV|KY|KM|DY|GQ|TF|GI|GW|HK|' +
        'IS|CI|KZ|KI|KG|LS|LY|LI|MO|MG|MV|MU|MN|MS|NR|NP|MP|PW|PS|' +
        'PN|SH|LC|VC|WS|SM|ST|SC|SB|SJ|TJ|TM|TV|HV|UZ|VU|VA|VG|YU',
      state: null,
    },
    gender: 'male',
  },
  '890405983319': {
    birthDate: new Date(1989, 3, 5),
    birthPlace: { region: null, country: 'STATELESS', state: null },
    gender: 'male',
  },
  '931030990123': {
    birthDate: new Date(1993, 9, 30),
    birthPlace: { region: null, country: 'UNSPECIFIED', state: null },
    gender: 'male',
  },
};

describe('MalaysiaIC', () => {
  describe('#isValidIc()', () => {
    it('should return true for valid unformatIcted MyKad number', () => {
      expect(isValidIc('910401052331')).toBe(true);
      expect(isValidIc('000401052331')).toBe(true);
    });

    it('should return true for valid formatIcted MyKad number', () => {
      expect(isValidIc('910223-08-1274')).toBe(true);
      expect(isValidIc('000223-08-1274')).toBe(true);
    });

    it('should return false for invalid input', () => {
      expect(isValidIc('loooool')).toBe(false);
    });

    it('should return false for MyKad with too many numbers', () => {
      expect(isValidIc('27812121293451')).toBe(false);
    });

    it('should return false for MyKad with too little numbers', () => {
      expect(isValidIc('8705')).toBe(false);
    });

    it('should return false for MyKad with invalid date of birth', () => {
      expect(isValidIc('110234013324')).toBe(false);
      expect(isValidIc('110200013324')).toBe(false);
    });

    it('should return false for MyKad with invalid month of birth', () => {
      expect(isValidIc('541324013324')).toBe(false);
      expect(isValidIc('540024013324')).toBe(false);
    });

    it('should return false for MyKad with invalid month and date of birth', () => {
      expect(isValidIc('541352013324')).toBe(false);
      expect(isValidIc('540000013324')).toBe(false);
    });

    it('should return false for MyKad with invalid place of births', () => {
      const invalidBirthPlaceCodes = [
        '00',
        '17',
        '18',
        '19',
        '20',
        '69',
        '70',
        '73',
        '80',
        '81',
        '94',
        '95',
        '96',
        '97',
      ];

      invalidBirthPlaceCodes.forEach(code => {
        expect(isValidIc(`560714${code}3094`)).toBe(false);
      });
    });
  });

  describe('#parseIc()', () => {
    it('should return correct data object for valid MyKad numbers', () => {
      Object.keys(numDataPairs).find((key: string) => {
        parseIc(key, (_, data) => {
          expect(data).toEqual(numDataPairs[key]);
        });
      });
    });

    it('should return correct data object for valid formatted MyKad number (async)', done => {
      const icNum = '460911-02-1389';
      parseIc(icNum, (err, data) => {
        expect(data).toEqual({
          birthDate: new Date(1946, 8, 11),
          birthPlace: { region: 'SOUTHEAST_ASIA', country: 'MY', state: 'KDH' },
          gender: 'male',
        });
        done();
      });
    });

    it('should return correct data object for valid formatted MyKad number (sync)', () => {
      const icNum = '460911-02-1389';
      const parseIcdData = parseIc(icNum);
      expect(parseIcdData).toEqual({
        birthDate: new Date(1946, 8, 11),
        birthPlace: { region: 'SOUTHEAST_ASIA', country: 'MY', state: 'KDH' },
        gender: 'male',
      });
    });

    it('should throw error for MyKad number with wrong format (async)', done => {
      const icNum = '1910401052331';
      parseIc(icNum, (error, data) => {
        expect(() => {
          throw error;
        }).toThrow('Invalid MyKad number format');
        expect(data).toBeNull();
        done();
      });
    });

    it('should throw error for MyKad number with wrong formatIc (sync)', () => {
      const icNum = '1910401052331';
      try {
        parseIc(icNum);
      } catch (error) {
        expect(() => {
          throw error;
        }).toThrow('Invalid MyKad number format');
      }
    });

    it('should throw error for invalid input', done => {
      const icNum = 'lololz';
      parseIc(icNum, (error, data) => {
        expect(() => {
          throw error;
        }).toThrow('Invalid MyKad number format');
        expect(data).toBeNull();
        done();
      });
    });
  });

  describe('#formatIc()', () => {
    it('should return formatIcted MyKad number (async)', done => {
      formatIc('670822073459', (err, formatIcted) => {
        expect(formatIcted).toEqual('670822-07-3459');
        expect(err).toBeNull();
        done();
      });
    });

    it('should return formatIcted MyKad number (sync)', () => {
      const formatIcted = formatIc('670822073459');
      expect(formatIcted).toEqual('670822-07-3459');
    });

    it('should throw error for invalid MyKad number (async)', done => {
      formatIc('67a642019435', (error, formatIcted) => {
        expect(() => {
          throw error;
        }).toThrow('Invalid MyKad number format');
        expect(formatIcted).toBeNull();
        done();
      });
    });

    it('should throw error for invalid MyKad number (sync)', () => {
      try {
        formatIc('67a642019435');
      } catch (error) {
        expect(() => {
          throw error;
        }).toThrow('Invalid MyKad number format');
      }
    });
  });

  describe('#unformatIc()', () => {
    it('should return unformatIcted MyKad number (async)', done => {
      unformatIc('450312-09-4387', (_, unformatIcted) => {
        expect(unformatIcted).toEqual('450312094387');
        done();
      });
    });

    it('should do nothing for already unformatIcted MyKad number (async)', done => {
      unformatIc('450312094387', (err, unformatIcted) => {
        expect(unformatIcted).toEqual('450312094387');
        done();
      });
    });

    it('should return unformatIcted MyKad number (sync)', () => {
      const unformatIcted = unformatIc('450312-09-4387');
      expect(unformatIcted).toEqual('450312094387');
    });

    it('should do nothing for unformatIcted MyKad number (sync)', () => {
      const unformatIcted = unformatIc('450312094387');
      expect(unformatIcted).toEqual('450312094387');
    });

    it('should throw error for invalid MyKad number (async)', done => {
      unformatIc('95303132094287', (error, formatIcted) => {
        expect(() => {
          throw error;
        }).toThrow('Invalid MyKad number format');
        expect(formatIcted).toBeNull();
        done();
      });
    });

    it('should throw error for invalid MyKad number (sync)', () => {
      try {
        const unformatIcted = unformatIc('95303132094287');
        expect(unformatIcted).toEqual('450312094387');
      } catch (error) {
        expect(() => {
          throw error;
        }).toThrow('Invalid MyKad number format');
      }
    });
  });

  describe('#generateRandomIc()', () => {
    it('should return valid randomized MyKad number', () => {
      const randomNo = generateRandomIc();

      expect(randomNo).toHaveLength(12);
      expect(isValidIc(randomNo)).toEqual(true);
    });
  });
});
