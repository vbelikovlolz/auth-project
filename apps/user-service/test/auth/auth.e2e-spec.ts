import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { appSetup } from '../../../../libs/shared/src/setup/app.setup';

describe('auth controller (e2e)', () => {
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

  let app: INestApplication;
  let atCreatedUser: string = '';
  let rtCreatedUser: string;
  let authJwtUser: any;
  // let createdUserId: string;
  // let atUpdatedCreatedUser: string;
  let rtUpdatedCreatedUser: string = '';

  /*const authBearer = {
    authorization: 'Basic YWRtaW46cXdlcnR5',
  };*/

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

  it('/reg user1', async () => {
    await request(app.getHttpServer())
      .post('/auth/registration')
      .send({
        password: 'qwerty1',
        email: 'vantreytest1@yandex.com',
        login: 'uldsogin45',
        age: 25,
        description: 'asdasdasdasd',
      })
      .expect(204);
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

    let authJwtUser = {};
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ loginOrEmail: 'vantreytest2@yandex.com', password: 'qwerty2' })
      .expect(200);

    atCreatedUser = (res as AuthResponse).body.accessToken;
    rtCreatedUser = res.headers['set-cookie'];
    authJwtUser = { Authorization: `Bearer ${atCreatedUser}` };

    await request(app.getHttpServer())
      .post('/users/upload-photo')
      .set('Content-Type', 'multipart/form-data')
      .set(authJwtUser)
      .attach('file', 'pic.jpg')
      .expect(201);

    await request(app.getHttpServer())
      .post('/users/upload-photo')
      .set('Content-Type', 'multipart/form-data')
      .set(authJwtUser)
      .attach('file', 'pic.jpg')
      .expect(201);
    await request(app.getHttpServer())
      .post('/users/upload-photo')
      .set('Content-Type', 'multipart/form-data')
      .set(authJwtUser)
      .attach('file', 'pic.jpg')
      .expect(201);
  });
  it('/reg user3', async () => {
    await request(app.getHttpServer())
      .post('/auth/registration')
      .send({
        password: 'qwerty3',
        email: 'vantreytest3@yandex.com',
        login: 'uldsogin3',
        age: 15,
        description: '',
      })
      .expect(204);

    let authJwtUser = {};
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ loginOrEmail: 'vantreytest3@yandex.com', password: 'qwerty3' })
      .expect(200);

    atCreatedUser = (res as AuthResponse).body.accessToken;
    rtCreatedUser = res.headers['set-cookie'];
    authJwtUser = { Authorization: `Bearer ${atCreatedUser}` };

    await request(app.getHttpServer())
      .post('/users/upload-photo')
      .set('Content-Type', 'multipart/form-data')
      .set(authJwtUser)
      .attach('file', 'pic.jpg')
      .expect(201);

    request(app.getHttpServer())
      .post('/users/upload-photo')
      .set('Content-Type', 'multipart/form-data')
      .set(authJwtUser)
      .attach('file', 'pic.jpg')
      .expect(201);
    request(app.getHttpServer())
      .post('/users/upload-photo')
      .set('Content-Type', 'multipart/form-data')
      .set(authJwtUser)
      .attach('file', 'pic.jpg')
      .expect(201);
  });

  it('/reg user4', async () => {
    await request(app.getHttpServer())
      .post('/auth/registration')
      .send({
        password: 'qwerty4',
        email: 'vantreytest4@yandex.com',
        login: 'uldsogin4',
        age: 20,
        description: '',
      })
      .expect(204);
  });
  it('/reg user5', async () => {
    await request(app.getHttpServer())
      .post('/auth/registration')
      .send({
        password: 'qwerty5',
        email: 'vantreytest5@yandex.com',
        login: 'uldsogin5',
        age: 21,
        description: 'fdfdsdfdfssssssssssss',
      })
      .expect(204);

    let authJwtUser = {};
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ loginOrEmail: 'vantreytest5@yandex.com', password: 'qwerty5' })
      .expect(200);

    atCreatedUser = (res as AuthResponse).body.accessToken;
    rtCreatedUser = res.headers['set-cookie'];
    authJwtUser = { Authorization: `Bearer ${atCreatedUser}` };

    await request(app.getHttpServer())
      .post('/users/upload-photo')
      .set('Content-Type', 'multipart/form-data')
      .set(authJwtUser)
      .attach('file', 'pic.jpg')
      .expect(201);

    await request(app.getHttpServer())
      .post('/users/upload-photo')
      .set('Content-Type', 'multipart/form-data')
      .set(authJwtUser)
      .attach('file', 'pic.jpg')
      .expect(201);
    await request(app.getHttpServer())
      .post('/users/upload-photo')
      .set('Content-Type', 'multipart/form-data')
      .set(authJwtUser)
      .attach('file', 'pic.jpg')
      .expect(201);
  });

  it('/reg user6', async () => {
    await request(app.getHttpServer())
      .post('/auth/registration')
      .send({
        password: 'qwerty6',
        email: 'vantreytest6@yandex.com',
        login: 'uldsogin6',
        age: 30,
        description: 'fdfdsdfdfssssssssssss',
      })
      .expect(204);
  });

  it('/reg user7', async () => {
    await request(app.getHttpServer())
      .post('/auth/registration')
      .send({
        password: 'qwerty7',
        email: 'vantreytest7@yandex.com',
        login: 'uldsogin7',
        age: 32,
        description: 'fdfdsdfdfssssssssssss',
      })
      .expect(204);
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

    atCreatedUser = (res as AuthResponse).body.accessToken;
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

    // atUpdatedCreatedUser = res.body.accessToken;
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

  it('/get top active users', async () => {
    await request(app.getHttpServer()).get('/users/top').expect(200);
  });
});
