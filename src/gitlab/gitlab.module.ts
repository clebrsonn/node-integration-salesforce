import { forwardRef, Module } from '@nestjs/common';
import { GitlabService } from './gitlab.service';
import { JobsModule } from 'src/jobs/jobs.module';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [forwardRef(() => JobsModule), ConfigModule, HttpModule],
  providers: [GitlabService],
  exports: [GitlabService],
})
export class GitlabModule {}