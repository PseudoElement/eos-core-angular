import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EosBackgraundTasksComponent } from './eos-backgraund-tasks.component';

describe('EosBackgraundTasksComponent', () => {
  let component: EosBackgraundTasksComponent;
  let fixture: ComponentFixture<EosBackgraundTasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EosBackgraundTasksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EosBackgraundTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
