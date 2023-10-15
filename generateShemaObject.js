class JsonSchemaKeyword {
  static ID = '$id';
  static TYPE = 'type';
  static PROPERTIES = 'properties';
  static REQUIRED = 'required';
  static MINIMUM = 'minimum';
  static MAXIMUM = 'maximum';
  static DEFINITIONS = 'definitions';
  static REF = '$ref';
  static ITEMS = 'items';
  static ANY_OF = 'anyOf';
  static ENUM = 'enum';
}

class DataType {
  static INTEGER = 'integer';
  static STRING = 'string';
  static BOOLEAN = 'boolean';
  static NUMBER = 'number';
  static NULL = 'null';
  static OBJECT = 'object';
  static ARRAY = 'array';
}

export function generateExample(jsonSchema) {
  if (!jsonSchema) {
    throw new Error('Expected a JSON schema, none found!');
  }
  const type = jsonSchema[JsonSchemaKeyword.TYPE];
  let result;
  if (type === DataType.STRING) {
    result = generateStringExample();
  } else if (type === DataType.INTEGER) {
    result = generateIntegerExample();
  } else if (type === DataType.NUMBER) {
    result = generateNumberExample();
  } else if (type === DataType.BOOLEAN) {
    result = generateBooleanExample();
  } else if (type === DataType.ARRAY) {
    result = generateArrayExample(
      jsonSchema[JsonSchemaKeyword.ITEMS],
      jsonSchema[JsonSchemaKeyword.DEFINITIONS]
    );
  } else if (type === DataType.OBJECT) {
    result = generateObjectExample(
      jsonSchema[JsonSchemaKeyword.PROPERTIES],
      jsonSchema[JsonSchemaKeyword.DEFINITIONS]
    );
  }
  return result;
}

export function generateStringExample() {
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const stringLength = Math.floor(Math.random() * 10) + 1; // Generates random length between 1 and 10 characters

  const randomStringArray = Array.from({ length: stringLength }, () => {
    const randomIndex = Math.floor(Math.random() * charset.length);
    return charset[randomIndex];
  });

  return randomStringArray.join('');
}

export function generateIntegerExample(min = 0, max = 100000) {
  if (min > max) {
    [min, max] = [max, min];
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateNumberExample(min = 0, max = 100000) {
  if (min > max) {
    [min, max] = [max, min];
  }
  return Math.random() * (max - min) + min;
}

export function generateBooleanExample() {
  return Math.random() < 0.5;
}

export function generateArrayExample(
  items,
  definitions,
  minItems = 0,
  uniqueItems = false
) {
  const itemCount = Math.max(getRandomElement([0, 1, 2, 3]), minItems);
  const value = [];

  for (let i = 0; i < itemCount; i++) {
    let generatedValue = generateValueByType(items, definitions);

    if (uniqueItems && value.includes(generatedValue)) {
      i--;
    } else {
      value.push(generatedValue);
    }
  }

  return value;
}

export function generateObjectExample(properties, definitions) {
  const value = {};
  for (let [key, prop] of Object.entries(properties)) {
    value[key] = generateValueByType(prop, definitions);
  }
  return value;
}

export function generateValueByType(item, definitions) {
  if (JsonSchemaKeyword.ANY_OF in item && item[JsonSchemaKeyword.ANY_OF]) {
    item = getRandomElement(item[JsonSchemaKeyword.ANY_OF]);
  }

  let type = item[JsonSchemaKeyword.TYPE] || DataType.NULL;
  let props = null;

  if (JsonSchemaKeyword.REF in item && item[JsonSchemaKeyword.REF]) {
    const schema = resolveRef(item[JsonSchemaKeyword.REF], definitions);
    type = schema[JsonSchemaKeyword.TYPE];
    props = schema[JsonSchemaKeyword.PROPERTIES] || null;
  }

  if (JsonSchemaKeyword.ENUM in item && item[JsonSchemaKeyword.ENUM]) {
    return getRandomElement(item[JsonSchemaKeyword.ENUM]);
  }

  if (type === DataType.STRING) {
    return generateStringExample();
  } else if (type === DataType.INTEGER) {
    return generateIntegerExample(item?.minimum, item?.maximum);
  } else if (type === DataType.NUMBER) {
    return generateNumberExample();
  } else if (type === DataType.BOOLEAN) {
    return generateBooleanExample();
  } else if (type === DataType.ARRAY) {
    return item[JsonSchemaKeyword.ITEMS]
      ? generateArrayExample(
          item[JsonSchemaKeyword.ITEMS],
          definitions,
          item?.minItems
        )
      : [];
  } else if (type === DataType.OBJECT) {
    return props || item[JsonSchemaKeyword.PROPERTIES]
      ? generateObjectExample(
          props || item[JsonSchemaKeyword.PROPERTIES],
          definitions
        )
      : {};
  }
}

function resolveRef(ref, definitions) {
  const refName = ref.split('#').pop();
  return definitions[refName] || null;
}

function getRandomElement(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}
