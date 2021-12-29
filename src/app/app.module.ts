import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmOptions } from '../config/typeorm.config';
import { AppController } from './app.controller';
import { AuthModule } from '../auth/auth.module';
import { VideosModule } from '../video/videos.module';
@Module({
  imports: [
    // TypeOrmModule
    TypeOrmModule.forRoot(typeOrmOptions),
    // auth
    AuthModule,
    VideosModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
