import { TestBed } from '@angular/core/testing';

import { FonTasksService } from './fon-tasks.service';

describe('FonTasksService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FonTasksService = TestBed.get(FonTasksService);
    expect(service).toBeTruthy();
  });
});
