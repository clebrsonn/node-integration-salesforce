import { Module } from '@nestjs/common';
import { TasksService } from './task.service';
import { JobsModule } from 'src/jobs/jobs.module';
import { SfModule } from 'src/sf/sf.module';
import { GitlabModule } from 'src/gitlab/gitlab.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [JobsModule, SfModule, GitlabModule, HttpModule],
  providers: [TasksService],
  exports: [TasksService],
})
export class TaskModule {}
