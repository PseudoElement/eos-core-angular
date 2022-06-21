import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EosBackgraundSingleComponent } from './eos-backgraund-single.component';

describe('EosBackgraundSingleComponent', () => {
  let component: EosBackgraundSingleComponent;
  let fixture: ComponentFixture<EosBackgraundSingleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EosBackgraundSingleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EosBackgraundSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
