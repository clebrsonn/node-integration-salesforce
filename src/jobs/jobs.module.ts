import { forwardRef, Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { Job } from './entities/job.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SfModule } from 'src/sf/sf.module';
import { SocketModule } from 'src/socket/socket.module';
import { GitlabModule } from 'src/gitlab/gitlab.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Job]),
    forwardRef(() => SfModule),
    forwardRef(() => GitlabModule),
    SocketModule,
  ],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}
