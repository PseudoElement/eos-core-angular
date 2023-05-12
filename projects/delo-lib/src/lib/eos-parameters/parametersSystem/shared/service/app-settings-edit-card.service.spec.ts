import { TestBed } from '@angular/core/testing';

import { AppSettingsEditCardService } from './app-settings-edit-card.service';

describe('AppSettingsEditCardService', () => {
  let service: AppSettingsEditCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppSettingsEditCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
