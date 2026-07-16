import { TARGET_COLUMNS } from '../schema/targetSchema';

/** OpenAPI 3 spec served through Swagger UI at /api-docs. */
export const openapiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'OrderVN Convertor API',
    version: '1.0.0',
    description:
      'Uploads a CSV or XLSX order file and returns the rows converted to the target ' +
      'schema as a downloadable CSV. Target columns (in order): ' +
      TARGET_COLUMNS.map((c) => c.header.trim()).join(', ') +
      '.',
  },
  components: {
    securitySchemes: {
      basicAuth: {
        type: 'http',
        scheme: 'basic',
        description: 'HTTP Basic Auth. Use the API username and password.',
      },
    },
  },
  security: [{ basicAuth: [] }],
  paths: {
    '/api/convert': {
      post: {
        summary: 'Convert an order file to the target CSV schema',
        security: [{ basicAuth: [] }],
        description:
          'Accepts a `.csv` or `.xlsx` file, converts each row to the target schema, ' +
          'and responds with a UTF-8 (BOM) CSV attachment named `converted.csv`.',
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['file'],
                properties: {
                  file: {
                    type: 'string',
                    format: 'binary',
                    description: 'The source CSV or XLSX file.',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Converted CSV file.',
            content: {
              'text/csv': {
                schema: { type: 'string', format: 'binary' },
              },
            },
          },
          '400': {
            description: 'No file uploaded or unsupported file type.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { error: { type: 'string' } },
                },
              },
            },
          },
          '401': {
            description: 'Missing or invalid credentials.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { error: { type: 'string' } },
                },
              },
            },
          },
          '422': {
            description: 'File does not match the expected input schema.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string' },
                    missing: {
                      type: 'array',
                      items: { type: 'string' },
                      description: 'Expected columns absent from the uploaded file.',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
