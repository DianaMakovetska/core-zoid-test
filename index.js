import { generateExample } from './generateShemaObject';

const shemaMock = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  definitions: {
    attendees: {
      type: 'object',
      $id: '#attendees',
      properties: {
        userId: {
          type: 'integer',
        },
        access: {
          enum: ['view', 'modify', 'sign', 'execute'],
        },
        formAccess: {
          enum: ['view', 'execute', 'execute_view'],
        },
      },
      required: ['userId', 'access'],
    },
  },
  type: 'object',
  properties: {
    id: {
      anyOf: [
        {
          type: 'string',
        },
        {
          type: 'integer',
        },
      ],
    },
    title: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    startDate: {
      type: 'integer',
    },
    endDate: {
      type: 'integer',
    },
    attendees: {
      type: 'array',
      items: {
        $ref: '#attendees',
      },
      default: [],
    },
    parentId: {
      anyOf: [
        {
          type: 'null',
        },
        {
          type: 'string',
        },
        {
          type: 'integer',
        },
      ],
    },
    locationId: {
      anyOf: [
        {
          type: 'null',
        },
        {
          type: 'integer',
        },
      ],
    },
    process: {
      anyOf: [
        {
          type: 'null',
        },
        {
          type: 'string',
          pattern:
            'https:\\/\\/[a-z]+\\.corezoid\\.com\\/api\\/1\\/json\\/public\\/[0-9]+\\/[0-9a-zA-Z]+',
        },
      ],
    },
    readOnly: {
      type: 'boolean',
    },
    priorProbability: {
      anyOf: [
        {
          type: 'null',
        },
        {
          type: 'integer',
          minimum: 0,
          maximum: 100,
        },
      ],
    },
    channelId: {
      anyOf: [
        {
          type: 'null',
        },
        {
          type: 'integer',
        },
      ],
    },
    externalId: {
      anyOf: [
        {
          type: 'null',
        },
        {
          type: 'string',
        },
      ],
    },
    tags: {
      type: 'array',
      items: {
        anyOf: [
          {
            type: 'number',
          },
          {
            type: 'string',
          },
        ],
      },
      minItems: 1,
    },
    form: {
      type: 'object',
      properties: {
        id: {
          type: 'integer',
        },
        viewModel: {
          type: 'object',
        },
      },
      required: ['id'],
    },
    formValue: {
      type: 'object',
    },
  },
  required: ['id', 'title', 'description', 'startDate', 'endDate', 'attendees'],
};

console.log(generateExample(shemaMock));
