import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('jobs')
export class Job {
  @PrimaryColumn()
  jobId: string;

  @Column({ type: 'integer' })
  mrId!: number;

  @Column({ type: 'integer' })
  projectId!: number;

  @Column({ type: 'varchar' })
  token!: string;

  @Column({ type: 'varchar' })
  instanceURL!: string;

  @Column({ type: 'varchar', nullable: true })
  description!: string;

  @Column({ type: 'varchar', default: 'Waiting' })
  status!: string;

  @Column({ type: 'boolean', default: false })
  commented!: boolean;

  @Column({ type: 'varchar', nullable: true })
  discussionId!: string;

  @Column({ type: 'boolean', default: false })
  isMerged!: boolean;
}
