import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Socket, io } from 'socket.io-client';
import { NotificationGateway } from './notification.gateway';
import { appSetup } from '../../../../../libs/shared/src/setup/app.setup';
import { NotificationServiceModule } from '../../notification-service.module';
import request from 'supertest';
import { AppModule } from '../../../../user-service/src/app.module';

async function createNestApp(...gateways: any): Promise<INestApplication> {
  const testingModule = await Test.createTestingModule({
    imports: [NotificationServiceModule, AppModule],
    providers: gateways,
  }).compile();
  return testingModule.createNestApplication();
}

describe('NotificationGateway', () => {
  let gateway: NotificationGateway;
  let app: INestApplication;
  let ioClient: Socket;
  let atCreatedUser: string = '';
  let rtCreatedUser: string;
  let authJwtUser: any;

  interface AuthResponse {
    body: {
      accessToken: string;
      refreshToken?: string;
      user?: {
        id: string;
        email: string;
      };
    };
    status: number;
  }

  beforeAll(async () => {
    app = await createNestApp(NotificationGateway);
    appSetup(app);

    // Получаем HTTP-сервер из приложения
    const httpServer = app.getHttpServer();
    const address = httpServer.address();
    const port = typeof address === 'string' ? 3000 : address?.port || 3000;

    ioClient = io(`http://localhost:${port}`, {
      autoConnect: false,
      extraHeaders: {
        authorization: 'your-auth-token',
      },
      transports: ['websocket', 'polling'],
    });

    gateway = app.get<NotificationGateway>(NotificationGateway);

    await app.init();
    await app.listen(port);
  });

  afterAll(async () => {
    if (ioClient && ioClient.connected) {
      ioClient.disconnect();
      ioClient.close();
    }
    if (app) {
      await app.close();
    }
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('should emit "pong" on "ping"', (done) => {
    // Сначала подключаемся
    ioClient.connect();

    ioClient.on('connect', () => {
      console.log('connected');
      // После подключения отправляем ping
      ioClient.emit('ping', 'Hello world!');
    });

    ioClient.on('pong', (data) => {
      expect(data).toBe('Wrong data that will make the test fail');
      ioClient.disconnect();
      done(); // Завершаем тест
    });

    // Таймаут на случай, если событие не придет
    setTimeout(() => {
      ioClient.disconnect();
      done.fail('Timeout: pong event not received');
    }, 5000);
  });

  it('/reg user2', async () => {
    await request(app.getHttpServer())
      .post('/auth/registration')
      .send({
        password: 'qwerty2',
        email: 'vantreytest2@yandex.com',
        login: 'uldsogin2',
        age: 18,
        description: 'fhfdhfghfghfghfg',
      })
      .expect(204);

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ loginOrEmail: 'vantreytest2@yandex.com', password: 'qwerty2' })
      .expect(200);

    atCreatedUser = (res as AuthResponse).body.accessToken;
    rtCreatedUser = res.headers['set-cookie'];
    authJwtUser = { Authorization: `Bearer ${atCreatedUser}` };
    console.log(authJwtUser);
  });
});
