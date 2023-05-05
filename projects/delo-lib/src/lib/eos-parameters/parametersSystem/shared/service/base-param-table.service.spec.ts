import { TestBed } from '@angular/core/testing';

import { BaseParamTableService } from './base-param-table.service';

describe('BaseParamTableService', () => {
  let service: BaseParamTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BaseParamTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
