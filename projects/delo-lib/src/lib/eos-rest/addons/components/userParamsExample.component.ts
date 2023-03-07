import { Component, ComponentFactoryResolver, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { RemasterEppService } from '../UserParamsRemasterEpp.service';
@Component({
    selector: 'remaster-epp',
    template: `<ng-template #dynamicBaseParam></ng-template>`
  })
export class UserParamsExample implements OnChanges {
    @Input() appMode: any;
    @Input() isCurrentSettings: any;
    @Input() userData: any;
    @Input() defaultValues: boolean;
    @Output() pushChange: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('dynamicBaseParam', { read: ViewContainerRef }) private viewRef: ViewContainerRef;
    private component
    constructor(
      private resolver: ComponentFactoryResolver,
      private _uiLibExampleService: RemasterEppService
      ) { }
      ngAfterViewInit(): void {
        if (this._uiLibExampleService.dinamicParams) {
          const ExpandComponent = this.resolver.resolveComponentFactory(this._uiLibExampleService.dinamicParams);
          this.viewRef.clear();
          this.component = this.viewRef.createComponent(ExpandComponent);
          if (this.viewRef) {
            if (this.component) {
              this.component.instance['appMode'] = this.appMode;
              this.component.instance['isCurrentSettings'] = this.isCurrentSettings;
              this.component.instance['userData'] = this.userData;
              this.component.instance['defaultValues'] = this.defaultValues;
              this.component.instance['pushChange'] = this.pushChange;
            }
          }
        }
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (this.component) {
            this.component.instance['userData'] = this.userData;
            this.component.instance['defaultValues'] = this.defaultValues;
        }
    }
  }