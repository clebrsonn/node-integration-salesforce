import { Test, TestingModule } from '@nestjs/testing';
import { SfService } from './sf.service';

describe('SfService', () => {
  let service: SfService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SfService],
    }).compile();

    service = module.get<SfService>(SfService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
