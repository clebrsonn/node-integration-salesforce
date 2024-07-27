import { Controller, Get, Render, Sse, UseFilters } from '@nestjs/common';
import { AppService } from './app.service';
import { JobsService } from './jobs/jobs.service';
import { Response } from 'express';
import { AuthExceptionFilter } from './auth-exception/auth-exception.filter';
import { map, Observable } from 'rxjs';
import { Job } from './jobs/entities/job.entity';

@Controller()
@UseFilters(AuthExceptionFilter)
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly jobsService: JobsService,
  ) {}

  @Get('login')
  @Render('login')
  async getLogin() {
    return;
  }

  @Get()
  @Render('index')
  async getHello() {
    const jobs = await this.jobsService.findAll();
    return { jobs };
  }
}
