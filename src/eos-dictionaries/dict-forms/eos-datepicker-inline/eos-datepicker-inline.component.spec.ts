import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EosDatepickerInlineComponent } from './eos-datepicker-inline.component';

describe('EosDatepickerInlineComponent', () => {
  let component: EosDatepickerInlineComponent;
  let fixture: ComponentFixture<EosDatepickerInlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EosDatepickerInlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EosDatepickerInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
