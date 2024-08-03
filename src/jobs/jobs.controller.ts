import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { LoginGuard } from 'src/auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(createJobDto);
  }

  @Get()
  findAll() {
    return this.jobsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobsService.update(id, updateJobDto);
  }

  @Post('retry/:id')
  verifyStatus(@Param('id') jobId: string) {
    return this.jobsService.verifyStatus(jobId);
  }

  @Get('project/:projectid/mr/:id')
  changeMerge(
    @Param('projectid') projectId: number,
    @Param('id') mrId: number,
  ) {
    if (!mrId || !projectId) {
      return 400;
    }
    return this.jobsService.changeMerged(mrId, projectId);
  }

  @UseGuards(LoginGuard)
  @Post('cancel/:id')
  cancel(@Param('id') jobId: string) {
    return this.jobsService.cancel(jobId);
  }
}
