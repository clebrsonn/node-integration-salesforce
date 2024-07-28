import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobsModule } from './jobs/jobs.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { SfModule } from './sf/sf.module';
import { GitlabModule } from './gitlab/gitlab.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskModule } from './task/task.module';
import { AuthConfigModule } from './auth-config/auth-config.module';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      //type: 'postgres',
      type: 'sqlite',
      database: process.env.DB_ACCESS,
      // host: 'localhost',
      // port: 5432,
      // password: 'simform',
      // username: 'postgres',
      entities: [__dirname + '/**/*.entity.{ts,js}'],
      // database: 'pgWithNest',
      synchronize: true,
      logging: true,
    }),

    JobsModule,
    UsersModule,
    AuthModule,
    SfModule,
    GitlabModule,
    TaskModule,
    AuthConfigModule,
    SocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
