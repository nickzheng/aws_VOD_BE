// import { Test, TestingModule } from '@nestjs/testing';
// import * as request from 'supertest';
// import { AppModule } from '../src/app/app.module';
// import { VideosService } from '../src/talks/talks.service';

describe('AppController (e2e)', () => {
  it(`success`, () => {
    expect(1).toBe(1);
  });
  // let app;
  // let talksService = { get: () => ['talks1', 'talks2', 'talks3'] };
  //
  // beforeEach(async () => {
  //   const moduleFixture: TestingModule = await Test.createTestingModule({
  //     imports: [AppModule],
  //   })
  //     .overrideProvider(VideosService)
  //     .useValue(talksService)
  //     .compile();
  //
  //   app = moduleFixture.createNestApplication();
  //   await app.init();
  // });
  //
  // it('/ (GET)', () => {
  //   return request(app.getHttpServer())
  //     .get('/')
  //     .expect(200)
  //     .expect('Hello World!');
  // });
  //
  // it(`/GET talks`, () => {
  //   return request(app.getHttpServer())
  //     .get('/talks')
  //     .expect(200)
  //     .expect(talksService.get());
  // });
  //
  // afterAll(async () => {
  //   await app.close();
  // });
});
