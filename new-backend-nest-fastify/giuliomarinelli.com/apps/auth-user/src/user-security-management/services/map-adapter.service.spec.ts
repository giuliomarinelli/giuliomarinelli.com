import { Test, TestingModule } from '@nestjs/testing';
import { MapAdapterService } from './map-adapter.service';

describe('MapAdapterService', () => {
  let service: MapAdapterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MapAdapterService],
    }).compile();

    service = module.get<MapAdapterService>(MapAdapterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
