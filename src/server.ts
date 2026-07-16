import { createApp } from './app';
import { config } from './config';

const app = createApp();

app.listen(config.port, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`OrderVN Convertor API listening on http://0.0.0.0:${config.port}`);
  // eslint-disable-next-line no-console
  console.log(`Swagger UI available at http://0.0.0.0:${config.port}/api-docs`);
});
