import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationAddressPlugComponent } from './notification-address-plug.component';

describe('EmailAddressPlugComponent', () => {
  let component: NotificationAddressPlugComponent;
  let fixture: ComponentFixture<NotificationAddressPlugComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationAddressPlugComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationAddressPlugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
