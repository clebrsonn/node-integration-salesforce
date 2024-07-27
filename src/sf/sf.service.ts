import { HttpService } from '@nestjs/axios';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { Connection } from 'jsforce';
import {
  CodeCoverageResult,
  CodeCoverageWarning,
  DeployDetails,
  DeployResult,
} from 'jsforce/lib/api/metadata';
import { catchError, firstValueFrom } from 'rxjs';
import { GitlabService } from 'src/gitlab/gitlab.service';
import { UpdateJobDto } from 'src/jobs/dto/update-job.dto';
import { Job } from 'src/jobs/entities/job.entity';
import { JobsService } from 'src/jobs/jobs.service';

@Injectable()
export class SfService {
  private readonly logger = new Logger(SfService.name);

  constructor(
    @Inject(forwardRef(() => JobsService))
    private readonly jobsService: JobsService,
    private readonly httpService: HttpService,
    private readonly gitlabService: GitlabService,
  ) {}

  private connect(token: string, url: string): Connection {
    const connection = new Connection({
      instanceUrl: url,
      accessToken: token,
    });
    return connection;
  }

  deployAndMonitor(params: Job) {
    this.makeCall(params);
  }

  cancelDeploy = async (params: Job) => {
    let id = params.jobId;

    const instanceUrl = params.instanceURL;

    const response = await firstValueFrom(
      this.httpService
        .patch(
          `${instanceUrl}/services/data/v60.0/metadata/deployRequest/${id}`,
          { deployResult: { status: 'Canceling' } },
          {
            headers: {
              Authorization: `Bearer ${params.token}`,
            },
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );
    console.log('Deploy cancelado com sucesso: ', response.data);
    this.deployAndMonitor(params);
  };

  private makeCall = (params: Job) => {
    const id = params.jobId;

    this.connect(params.token, params.instanceURL)
      .metadata.checkDeployStatus(id, true)
      .then((result: DeployResult) => {
        this.callAgain(params, result);
      })
      .catch((error: any) => {
        let errorMsg = '';
        if (error.name !== 'sf:INVALID_SESSION_ID') {
          console.error('erro de conexão:');
          console.error(error);
          errorMsg = error.message;
        }
        console.error(JSON.stringify(error));
        if (typeof error === 'object') {
          errorMsg = JSON.stringify(error);
        }
        const dto = new UpdateJobDto();
        dto.status = 'Error';
        dto.description = errorMsg;
        console.log('dto', dto);

        this.jobsService.update(id, dto);
      });
  };

  private callAgain = (params: Job, result: DeployResult) => {
    console.log(result);
    const dto = new UpdateJobDto();
    dto.status = result.status;
    this.jobsService.update(params.jobId, dto);

    if (result && !result.done) {
      console.log(
        'em andamento',
        params.instanceURL,
        result.status,
        params.jobId,
      );
      return;
    }
    if (result) {
      const action = result.checkOnly ? ' Validate ' : ' Deploy ';

      const message = `${action} ${result?.status}! \n ${this.transform(result.details)}`;

      if (!params.commented) {
        this.gitlabService.createComment(params, message);
        //notifyTeams();
      }
    }
  };

  private transform(jsonToTransform: DeployDetails) {
    if (!jsonToTransform) {
      return '';
    }
    let str = '';
    if (
      jsonToTransform.componentFailures &&
      jsonToTransform.componentFailures.length > 0
    ) {
      str += '\n\r Component Failures \n\r';
      str += this.convertJsonToMarkdownTable(jsonToTransform.componentFailures);
    }
    if (
      jsonToTransform.runTestResult?.failures &&
      jsonToTransform.runTestResult?.failures.length > 0
    ) {
      str += '\n\r Test Failures \n\r';
      const columns = [
        'name',
        'packageName',
        'methodName',
        'message',
        'stackTrace',
      ];
      str += this.convertJsonToMarkdownTable(
        jsonToTransform.runTestResult.failures,
        columns,
      );
    }
    if (jsonToTransform.runTestResult?.codeCoverageWarnings) {
      try {
        const coverage =
          jsonToTransform.runTestResult?.codeCoverageWarnings?.filter(
            (elem: CodeCoverageWarning) =>
              jsonToTransform.componentSuccesses?.find(
                (el) => elem.name === el.fullName,
              ),
          );
        if (coverage?.length) {
          str += '\n\r Coverage Test Class < 75% \n\r';

          str += this.convertJsonToMarkdownTable(coverage);
        }
      } catch (e) {
        this.logger.error(
          'error when convertJsonToMarkdownTable',
          e.stackTrace,
        );
      }
    }
    if (jsonToTransform.runTestResult?.codeCoverage) {
      try {
        const coverage = jsonToTransform.runTestResult?.codeCoverage?.filter(
          (elem: CodeCoverageResult) =>
            jsonToTransform.componentSuccesses?.find(
              (el) => elem.name === el.fullName,
            ),
        );
        if (coverage) {
          const coverageNew = [];
          for (let index = 0; index < coverage.length; index++) {
            const element = coverage[index] as any;
            if (!element) {
              continue;
            }
            element['coveragePercent'] =
              (1 - element.numLocationsNotCovered / element.numLocations) * 100;
            if (element['coveragePercent'] < (process.env.COVERAGE || 85)) {
              coverageNew.push(element);
            }
          }
          if (coverageNew.length > 0) {
            str += `\n\r Coverage Test Class < ${process.env.COVERAGE || 85}% \n\r`;
            const columns = ['id', 'name', 'coveragePercent'];
            str += this.convertJsonToMarkdownTable(coverageNew, columns);
          }
        }
      } catch (e) {}
    }
    return str;
  }

  convertJsonToMarkdownTable(json: any[], columns?: string[]): string {
    if (json.length === 0) {
      return '';
    }

    const headers =
      columns && columns.length > 0 ? columns : Object.keys(json[0]);
    const tableHeaders = `| ${headers.join(' | ')} |`;
    const tableSeparators = `| ${headers.map(() => '---').join(' | ')} |`;

    const tableRows = json.map((row) => {
      const values = headers.map((header) =>
        row[header] !== undefined ? row[header] : '',
      );
      return `| ${values.join(' | ')} |`;
    });

    return [tableHeaders, tableSeparators, ...tableRows].join('\n');
  }
}
