import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job } from './entities/job.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SfService } from 'src/sf/sf.service';
import { SocketGateway } from 'src/socket/socket.gateway';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job) private readonly jobRepository: Repository<Job>,
    @Inject(forwardRef(() => SfService))
    private readonly sfService: SfService,
    private readonly socketService: SocketGateway
  ) {}

  async create(createJobDto: CreateJobDto) {
    const job: Job = new Job();
    job.jobId = createJobDto.jobId;
    job.instanceURL = createJobDto.instanceURL;
    job.mrId = createJobDto.mrId;
    job.projectId = createJobDto.projectId;
    job.token = createJobDto.token;
    const jobCreated = await this.jobRepository.save(job);
    this.sfService.deployAndMonitor(jobCreated);
    return jobCreated;
  }

  findAll() {
    return this.jobRepository.find({ where: { isMerged: false } });
  }

  find(where: FindManyOptions) {
    return this.jobRepository.find(where);
  }

  findOne(jobId: string) {
    return this.jobRepository.findOneBy({ jobId: jobId });
  }

  async update(id: string, updateJobDto: UpdateJobDto) {
    const job = new Job();
    job.status = updateJobDto.status;
    job.description = updateJobDto.description;
    job.jobId = id;
    const jobUpdated = await this.jobRepository.save(job);
    this.socketService.sendEventUpdate('job-updated', null);

    return jobUpdated;
  }

  changeMerged(mrId: number, projectID: number) {
    return this.jobRepository.update(
      { mrId: mrId, projectId: projectID },
      { isMerged: true },
    );
  }

  async verifyStatus(jobId: string) {
    return this.sfService.deployAndMonitor(await this.findOne(jobId));
  }

  async cancel(jobId: string) {
    const job = await this.findOne(jobId);
    if (!job) {
      throw new NotFoundException();
    }
    this.sfService.cancelDeploy(job);
  }
}
