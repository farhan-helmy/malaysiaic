import { isValid, parse, format, unformat, generateRandom } from '../src';

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
  describe('#isValid()', () => {
    it('should return true for valid unformatted MyKad number', () => {
      expect(isValid('910401052331')).toBe(true);
      expect(isValid('000401052331')).toBe(true);
    });

    it('should return true for valid formatted MyKad number', () => {
      expect(isValid('910223-08-1274')).toBe(true);
      expect(isValid('000223-08-1274')).toBe(true);
    });

    it('should return false for invalid input', () => {
      expect(isValid('loooool')).toBe(false);
    });

    it('should return false for MyKad with too many numbers', () => {
      expect(isValid('27812121293451')).toBe(false);
    });

    it('should return false for MyKad with too little numbers', () => {
      expect(isValid('8705')).toBe(false);
    });

    it('should return false for MyKad with invalid date of birth', () => {
      expect(isValid('110234013324')).toBe(false);
      expect(isValid('110200013324')).toBe(false);
    });

    it('should return false for MyKad with invalid month of birth', () => {
      expect(isValid('541324013324')).toBe(false);
      expect(isValid('540024013324')).toBe(false);
    });

    it('should return false for MyKad with invalid month and date of birth', () => {
      expect(isValid('541352013324')).toBe(false);
      expect(isValid('540000013324')).toBe(false);
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
        expect(isValid(`560714${code}3094`)).toBe(false);
      });
    });
  });

  describe('#parse()', () => {
    it('should return correct data object for valid MyKad numbers', () => {
      Object.keys(numDataPairs).find((key: string) => {
        parse(key, (_, data) => {
          expect(data).toEqual(numDataPairs[key]);
        });
      });
    });

    it('should return correct data object for valid formatted MyKad number (async)', done => {
      const icNum = '460911-02-1389';
      parse(icNum, (err, data) => {
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
      const parsedData = parse(icNum);
      expect(parsedData).toEqual({
        birthDate: new Date(1946, 8, 11),
        birthPlace: { region: 'SOUTHEAST_ASIA', country: 'MY', state: 'KDH' },
        gender: 'male',
      });
    });

    it('should throw error for MyKad number with wrong format (async)', done => {
      const icNum = '1910401052331';
      parse(icNum, (error, data) => {
        expect(() => {
          throw error;
        }).toThrow('Invalid MyKad number format');
        expect(data).toBeNull();
        done();
      });
    });

    it('should throw error for MyKad number with wrong format (sync)', () => {
      const icNum = '1910401052331';
      try {
        parse(icNum);
      } catch (error) {
        expect(() => {
          throw error;
        }).toThrow('Invalid MyKad number format');
      }
    });

    it('should throw error for invalid input', done => {
      const icNum = 'lololz';
      parse(icNum, (error, data) => {
        expect(() => {
          throw error;
        }).toThrow('Invalid MyKad number format');
        expect(data).toBeNull();
        done();
      });
    });
  });

  describe('#format()', () => {
    it('should return formatted MyKad number (async)', done => {
      format('670822073459', (err, formatted) => {
        expect(formatted).toEqual('670822-07-3459');
        expect(err).toBeNull();
        done();
      });
    });

    it('should return formatted MyKad number (sync)', () => {
      const formatted = format('670822073459');
      expect(formatted).toEqual('670822-07-3459');
    });

    it('should throw error for invalid MyKad number (async)', done => {
      format('67a642019435', (error, formatted) => {
        expect(() => {
          throw error;
        }).toThrow('Invalid MyKad number format');
        expect(formatted).toBeNull();
        done();
      });
    });

    it('should throw error for invalid MyKad number (sync)', () => {
      try {
        format('67a642019435');
      } catch (error) {
        expect(() => {
          throw error;
        }).toThrow('Invalid MyKad number format');
      }
    });
  });

  describe('#unformat()', () => {
    it('should return unformatted MyKad number (async)', done => {
      unformat('450312-09-4387', (_, unformatted) => {
        expect(unformatted).toEqual('450312094387');
        done();
      });
    });

    it('should do nothing for already unformatted MyKad number (async)', done => {
      unformat('450312094387', (err, unformatted) => {
        expect(unformatted).toEqual('450312094387');
        done();
      });
    });

    it('should return unformatted MyKad number (sync)', () => {
      const unformatted = unformat('450312-09-4387');
      expect(unformatted).toEqual('450312094387');
    });

    it('should do nothing for unformatted MyKad number (sync)', () => {
      const unformatted = unformat('450312094387');
      expect(unformatted).toEqual('450312094387');
    });

    it('should throw error for invalid MyKad number (async)', done => {
      unformat('95303132094287', (error, formatted) => {
        expect(() => {
          throw error;
        }).toThrow('Invalid MyKad number format');
        expect(formatted).toBeNull();
        done();
      });
    });

    it('should throw error for invalid MyKad number (sync)', () => {
      try {
        const unformatted = unformat('95303132094287');
        expect(unformatted).toEqual('450312094387');
      } catch (error) {
        expect(() => {
          throw error;
        }).toThrow('Invalid MyKad number format');
      }
    });
  });

  describe('#generateRandom()', () => {
    it('should return valid randomized MyKad number', () => {
      const randomNo = generateRandom();

      expect(randomNo).toHaveLength(12);
      expect(isValid(randomNo)).toEqual(true);
    });
  });
});
