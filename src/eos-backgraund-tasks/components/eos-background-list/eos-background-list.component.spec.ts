import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EosBackgroundListComponent } from './eos-background-list.component';

describe('EosBackgroundListComponent', () => {
  let component: EosBackgroundListComponent;
  let fixture: ComponentFixture<EosBackgroundListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EosBackgroundListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EosBackgroundListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
