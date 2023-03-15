import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EosCommonDynamicComponent } from './eos-common-dynamic.component';

describe('EosCommonDynamicComponent', () => {
  let component: EosCommonDynamicComponent;
  let fixture: ComponentFixture<EosCommonDynamicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EosCommonDynamicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EosCommonDynamicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
