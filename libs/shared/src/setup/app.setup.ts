import { INestApplication } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { pipesSetupService } from '@app/shared/setup/pipes.setup';
export function appSetup(app: INestApplication) {
  pipesSetupService(app);
  app.use(cookieParser());
}
