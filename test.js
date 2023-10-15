import {
  generateExample,
  generateArrayExample,
  generateStringExample,
  generateIntegerExample,
  generateNumberExample,
  generateBooleanExample,
} from './index';

(function () {
  'use strict';

  const testSchemaMock = {
    type: 'object',

    properties: {
      id: {
        type: 'integer',
      },
      name: {
        type: 'string',
      },
      age: {
        type: 'integer',
      },
    },
    required: ['id', 'name'],
  };

  /**
   * test function
   * @param {string} desc
   * @param {function} fn
   */
  function it(desc, fn) {
    try {
      fn();
      console.log('\x1b[32m%s\x1b[0m', '\u2714 ' + desc);
    } catch (error) {
      console.log('\n');
      console.log('\x1b[31m%s\x1b[0m', '\u2718 ' + desc);
      console.error(error);
    }
  }

  function expect(actualValue) {
    return {
      toHaveProperty: function (propertyName) {
        const hasProperty = Object.prototype.hasOwnProperty.call(
          actualValue,
          propertyName
        );
        if (!hasProperty) {
          throw new Error(`Expected object to have property '${propertyName}'`);
        }
      },
      toBe: function (expectedValue) {
        const areEqual = actualValue === expectedValue;
        if (!areEqual) {
          throw new Error(`Expected ${actualValue} to be ${expectedValue}`);
        }
      },

      toBeGreaterThanOrEqual: function (expectedValue) {
        const isGreaterThanOrEqual = actualValue >= expectedValue;
        if (!isGreaterThanOrEqual) {
          throw new Error(
            `Expected ${actualValue} to be greater than or equal to ${expectedValue}`
          );
        }
      },
      toBeLessThanOrEqual: function (expectedValue) {
        const isLessThanOrEqual = actualValue <= expectedValue;
        if (!isLessThanOrEqual) {
          throw new Error(
            `Expected ${actualValue} to be less than or equal to ${expectedValue}`
          );
        }
      },
    };
  }

  it('generates an example based on the schema mock', function () {
    const example = generateExample(testSchemaMock);
    const requiredProperties = ['id', 'name'];
    expect(typeof example).toBe('object');
    for (const prop of requiredProperties) {
      expect(example).toHaveProperty(prop);
    }
  });

  it('generates an array based on JSON schema items definition', () => {
    const items = {
      $ref: '#users',
    };
    const definitions = {
      users: {
        type: 'integer',
        $id: '#users',
      },
    };

    const minItems = 1;

    const generatedArray = generateArrayExample(items, definitions, minItems);
    expect(Array.isArray(generatedArray)).toBe(true);
    expect(generatedArray.length >= 1).toBe(true);
  });

  it('generates a random string', () => {
    const randomString = generateStringExample();
    expect(typeof randomString).toBe('string');
  });

  it('generates a random integer within specified range', () => {
    const randomInteger = generateIntegerExample(1, 100);
    expect(Number.isInteger(randomInteger)).toBe(true);
    expect(randomInteger).toBeGreaterThanOrEqual(1);
    expect(randomInteger).toBeLessThanOrEqual(100);
  });

  it('generates a random number within specified range', () => {
    const randomNumber = generateNumberExample(1, 100);
    expect(typeof randomNumber).toBe('number');
    expect(randomNumber).toBeGreaterThanOrEqual(1);
    expect(randomNumber).toBeLessThanOrEqual(100);
  });

  it('generates a random boolean value', () => {
    const randomBoolean = generateBooleanExample();
    expect(typeof randomBoolean).toBe('boolean');
  });
})();
