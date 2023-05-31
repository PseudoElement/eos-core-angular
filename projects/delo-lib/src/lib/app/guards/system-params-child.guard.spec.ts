import { TestBed } from '@angular/core/testing';

import { SystemParamsChildGuard } from './system-params-child.guard';

describe('SystemParamsChildGuard', () => {
  let guard: SystemParamsChildGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SystemParamsChildGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
