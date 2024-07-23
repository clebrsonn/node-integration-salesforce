import { PartialType } from '@nestjs/mapped-types';
import { CreateJobDto } from './create-job.dto';

export class UpdateJobDto extends PartialType(CreateJobDto) {
  status!: string;
  description!: string;
  commented!: boolean;
  discussionId!: string;

}
