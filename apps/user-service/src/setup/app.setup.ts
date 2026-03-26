import { INestApplication } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { pipesSetup } from './pipes.setup';
export function appSetup(app: INestApplication) {
  pipesSetup(app);
  app.use(cookieParser());
}
