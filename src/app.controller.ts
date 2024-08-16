import { Controller, Get, Render, Request, UseFilters } from '@nestjs/common';
import { AppService } from './app.service';
import { JobsService } from './jobs/jobs.service';
import { AuthExceptionFilter } from './auth-exception/auth-exception.filter';
@Controller()
@UseFilters(AuthExceptionFilter)
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly jobsService: JobsService,
  ) {}

  @Get('login')
  @Render('login')
  async getLogin(@Request() req) {
    return { message: req.flash('loginError') };
  }

  @Get()
  @Render('index')
  async getIndex() {
    const jobs = await this.jobsService.findAll();
    return { jobs };
  }
}
