import { forwardRef, Module } from '@nestjs/common';
import { SfService } from './sf.service';
import { JobsModule } from 'src/jobs/jobs.module';
import { HttpModule } from '@nestjs/axios';
import { GitlabModule } from 'src/gitlab/gitlab.module';

@Module({
  imports: [forwardRef(() => JobsModule), HttpModule, GitlabModule],
  providers: [SfService],
  exports: [SfService],
})
export class SfModule {}
