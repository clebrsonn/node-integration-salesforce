import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { GitlabService } from 'src/gitlab/gitlab.service';
import { JobsService } from 'src/jobs/jobs.service';
import { SfService } from 'src/sf/sf.service';
import { In, Not } from 'typeorm';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private readonly jobsService: JobsService,
    private readonly sfService: SfService,
   // private readonly gitlabService: GitlabService,
  ) {}

  @Cron('*/3 * * * *')
  handleCron() {
    this.jobsService
      .find({
        where: {
          status: Not(In(['Succeeded', 'Failed', 'Cancelled', 'Error'])),
        },
      })
      .then((jobs) => jobs?.forEach((j) => this.sfService.deployAndMonitor(j)));
  }

  //@Cron('*/3 * * * *')
  //handleJobs() {
  //  this.jobsService
  //    .find({
  //      where: {
  //        isMerged: false,
  //      },
  //    })
  //    .then((jobs) =>
        //jobs?.forEach((j) => this.gitlabService.verifyIsMerged(j)),
  //    );
  //}
}
