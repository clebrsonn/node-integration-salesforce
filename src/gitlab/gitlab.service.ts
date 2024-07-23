import { HttpService } from '@nestjs/axios';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { UpdateJobDto } from 'src/jobs/dto/update-job.dto';
import { Job } from 'src/jobs/entities/job.entity';
import { JobsService } from 'src/jobs/jobs.service';

@Injectable()
export class GitlabService {
  constructor(
    @Inject(forwardRef(() => JobsService))
    private readonly jobsService: JobsService,
    private configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}
  private readonly gitlabApiUrl = 'https://gitlab.com/api/v4'; // URL da API do GitLab

  private readonly gitlabToken = this.configService.get<string>('GITLAB_TOKEN'); // Substitua pelo seu token de acesso do GitLab
  private readonly logger = new Logger(GitlabService.name);

  createComment = async (params: Job, status: string) => {
    // Cria o comentário na solicitação de merge especificada
    const { jobId, projectId, mrId, discussionId } = params;
    console.log('status', status);
    const URL = discussionId
      ? `${this.gitlabApiUrl}/projects/${projectId}/merge_requests/${mrId}/discussions/${discussionId}/notes`
      : `${this.gitlabApiUrl}/projects/${projectId}/merge_requests/${mrId}/discussions`;

    const response = await firstValueFrom(
      this.httpService
        .post(
          URL,
          {
            body: status,
          },
          {
            headers: {
              'Private-Token': this.gitlabToken,
            },
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.message);
            throw 'An error happened!';
          }),
        ),
    );
    console.info('comentario criado', projectId, mrId);
    const dto = new UpdateJobDto();
    dto.commented = true;
    dto.discussionId = response.data.id;
    this.jobsService.update(jobId, dto);
  };

  getMrAddress = async (projectId: number, mergeRequestId: number) => {
    const response = await firstValueFrom(
      this.httpService
        .get(
          `${this.gitlabApiUrl}/projects/${projectId}/merge_requests/${mergeRequestId}`,
          {
            headers: {
              'Private-Token': this.gitlabToken,
            },
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.message);
            throw 'An error happened!';
          }),
        ),
    );
    if (response.data.state != 'opened') {
      this.jobsService.changeMerged(mergeRequestId, projectId);
    }
    return response;
  };
}
