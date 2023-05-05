import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsGatewayCardComponent } from './sms-gateway-card.component';

describe('SmsGatewayCardComponent', () => {
  let component: SmsGatewayCardComponent;
  let fixture: ComponentFixture<SmsGatewayCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmsGatewayCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsGatewayCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
