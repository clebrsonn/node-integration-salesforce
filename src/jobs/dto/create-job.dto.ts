export class CreateJobDto {
  jobId: string;
  mrId!: number;
  projectId!: number;
  token!: string;
  instanceURL!: string;
}
