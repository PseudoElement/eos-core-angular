import { Component, ComponentFactoryResolver, Input, OnChanges, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { ExtendsLinkedSearch } from './linked-search-default/linked-search-default.component';
import { UserParamsRegistrationService } from '../userParamRegistrationExample.service';
@Component({
    selector: 'extension-user-params-registration',
    template: `<ng-template #dynamicUserParams></ng-template>`
  })
export class UserParamsRegistration implements OnChanges {
    @Input() appMode: any;
    @Input() isCurrentSettings: boolean;
    @Input() input: any;
    @Input() form: any;
    @ViewChild('dynamicUserParams', { read: ViewContainerRef }) private viewRef: ViewContainerRef;
    private component
    constructor(
      private resolver: ComponentFactoryResolver,
      private _uiLibExampleService: UserParamsRegistrationService
      ) { }
    ngAfterViewInit(): void {
      if(this._uiLibExampleService.userParamsRegistrationService && this.viewRef) {
        const ExpandComponent = this.resolver.resolveComponentFactory(this._uiLibExampleService.userParamsRegistrationService);
        this.viewRef.clear();
        this.component = this.viewRef.createComponent(ExpandComponent);
      } else if(this.viewRef) {
        const ExpandComponent = this.resolver.resolveComponentFactory(ExtendsLinkedSearch);
        this.viewRef.clear();
        this.component = this.viewRef.createComponent(ExpandComponent);
      }
      if (this.component) {
        this.component.instance['appMode'] = this.appMode;
        this.component.instance['isCurrentSettings'] = this.isCurrentSettings;
        this.component.instance['input'] = this.input;
        this.component.instance['form'] = this.form;
      }
    }
    ngOnChanges(changes: SimpleChanges): void {
      if(this._uiLibExampleService.userParamsRegistrationService && this.viewRef) {
        const ExpandComponent = this.resolver.resolveComponentFactory(this._uiLibExampleService.userParamsRegistrationService);
        this.viewRef.clear();
        this.component = this.viewRef.createComponent(ExpandComponent);
      } else if(this.viewRef) {
        const ExpandComponent = this.resolver.resolveComponentFactory(ExtendsLinkedSearch);
        this.viewRef?.clear();
        this.component = this.viewRef.createComponent(ExpandComponent);
      }
      if (this.component) {
        this.component.instance['appMode'] = this.appMode;
        this.component.instance['isCurrentSettings'] = this.isCurrentSettings;
        this.component.instance['input'] = this.input;
        this.component.instance['form'] = this.form;
      }
  }
}