import { Component, ComponentFactoryResolver, Input, OnChanges, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { UpdateUserBaseService } from '../extendUserBase.service';
@Component({
    selector: 'extension-user-params',
    template: `<ng-template #dynamicBaseParam></ng-template>`
  })
export class UserBaseParamsComponent implements OnChanges {
    @Input() value: any;
    @Input() editMode: boolean;
    @Input() techUser: any;
    @Input() form: any;
    @ViewChild('dynamicBaseParam', { read: ViewContainerRef }) private viewRef: ViewContainerRef;
    private component
    constructor(
      private resolver: ComponentFactoryResolver,
      private _uiLibExampleService: UpdateUserBaseService
      ) { }
    ngAfterViewInit(): void {
      /* if(this._uiLibExampleService.dinamicUserParam) {
        const ExpandComponent = this.resolver.resolveComponentFactory(this._uiLibExampleService.dinamicUserParam);
        this.viewRef.clear();
        this.component = this.viewRef.createComponent(ExpandComponent);
        if (this.viewRef) {
          if (this.component) {
              this.component.instance['editMode'] = this.editMode;
              this.component.instance['value'] = this.value;
              this.component.instance['techUser'] = this.techUser;
              this.component.instance['form'] = this.form;
          }
        }
      } */
    }
    ngOnChanges(changes: SimpleChanges): void {
      if(this._uiLibExampleService.dinamicUserParam && this.viewRef) {
        const ExpandComponent = this.resolver.resolveComponentFactory(this._uiLibExampleService.dinamicUserParam);
        this.viewRef.clear();
        this.component = this.viewRef.createComponent(ExpandComponent);
      }
      if (this.component) {
          this.component.instance['editMode'] = this.editMode;
          this.component.instance['value'] = this.value;
          this.component.instance['techUser'] = this.techUser;
          this.component.instance['form'] = this.form;
          this.component.instance['ngOnChanges'](changes);
      }
    }
  }