import { Injectable, INestApplication, Logger } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { PipesSetupService } from './pipes.setup.service';

@Injectable()
export class AppSetupService {
  private readonly logger = new Logger(AppSetupService.name);

  constructor(private readonly pipesSetupService: PipesSetupService) {}

  setup(app: INestApplication) {
    this.pipesSetupService.setup(app);
    app.use(cookieParser());
    this.logger.log('Application setup completed');
  }
}
