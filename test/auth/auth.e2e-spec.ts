import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { appSetup } from '../../src/setup/app.setup';

describe('auth controller (e2e)', () => {
  let app: INestApplication;
  let atCreatedUser: string;
  let rtCreatedUser: string;
  let authJwtUser: any;
  let createdUserId: string;
  let atUpdatedCreatedUser: string;
  let rtUpdatedCreatedUser: string;

  const authBearer = {
    authorization: 'Basic YWRtaW46cXdlcnR5',
  };

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    appSetup(app);
    await app.init();
  });
  afterAll(async () => {
    await app.close();
  });

  it('/delete all', async () => {
    await request(app.getHttpServer()).delete('/testing/all-data').expect(204);
  });

  it('/reg', async () => {
    const userRes = await request(app.getHttpServer())
      .post('/auth/registration')
      .send({
        password: 'qwerty1',
        email: 'vantreytest1@yandex.com',
        login: 'uldsogin45',
        age: 25,
        description: 'asdasdasdasd',
      })
      .expect(204);

    createdUserId = userRes.body._id;
  });

  /*  it('/login (POST) should return 401 for invalid password', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ loginOrEmail: 'vantreytest1@yandex.com', password: 'qw' })
      .expect(401);
  });*/

  it('/login (POST) should return accessToken', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ loginOrEmail: 'vantreytest1@yandex.com', password: 'qwerty1' })
      .expect(200);

    atCreatedUser = res.body.accessToken;
    rtCreatedUser = res.headers['set-cookie'];
    authJwtUser = { Authorization: `Bearer ${atCreatedUser}` };

    expect(res.body).toHaveProperty('accessToken');
  });

  it('/me (GET) with valid token should return 200', async () => {
    await request(app.getHttpServer())
      .get('/auth/me')
      .set(authJwtUser)
      .expect(200);
  });

  it('/refresh-token (POST) with RT cookie should return 200', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/refresh-token')
      .set('Cookie', rtCreatedUser)
      .expect(200);

    atUpdatedCreatedUser = res.body.accessToken;
    rtUpdatedCreatedUser = res.headers['set-cookie'];
  });

  it('/logout (POST) with updated RT cookie should return 204', async () => {
    await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Cookie', rtUpdatedCreatedUser)
      .expect(204);
  });

  it('/refresh-token (POST) after logout should return 401', async () => {
    await request(app.getHttpServer())
      .post('/auth/refresh-token')
      .set('Cookie', rtUpdatedCreatedUser)
      .expect(401);
  });
});
