import { Module } from '@nestjs/common';
import { TasksService } from './task.service';
import { JobsModule } from 'src/jobs/jobs.module';
import { SfModule } from 'src/sf/sf.module';

@Module({
  imports: [JobsModule, SfModule],
  providers: [TasksService],
  exports: [TasksService],
})
export class TaskModule {}
