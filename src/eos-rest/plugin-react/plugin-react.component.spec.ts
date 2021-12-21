import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PluginReactComponent } from './plugin-react.component';

describe('PluginReactComponent', () => {
  let component: PluginReactComponent;
  let fixture: ComponentFixture<PluginReactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PluginReactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PluginReactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
