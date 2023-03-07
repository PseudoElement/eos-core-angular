import { Component, ComponentFactoryResolver, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { NodeAbsoluteRight } from '../../../eos-user-params/rights-delo/rights-delo-absolute-rights/node-absolute';
import { IParamUserCl } from '../../../eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { AddAbsOrganizationService } from '../addAbsOrganization.service';
@Component({
    selector: 'extension-organization',
    template: `<ng-template extendAbsComponent #dynamic></ng-template>`
  })
export class AbsolutRigthExampleComponent implements OnChanges {
    @Input() editMode: boolean;
    @Input() selectedNode: NodeAbsoluteRight;
    @Input() curentUser: IParamUserCl;
    @Output() Changed: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('dynamic', { read: ViewContainerRef }) private viewRef: ViewContainerRef;
    private component
    constructor(
      private resolver: ComponentFactoryResolver,
      private _uiLibExampleService: AddAbsOrganizationService
      ) { }
    ngAfterViewInit(): void {
        const ExpandComponent = this.resolver.resolveComponentFactory(this._uiLibExampleService.dinamicOrganizEdit);
        this.viewRef.clear();
        this.component = this.viewRef.createComponent(ExpandComponent);
        if (this.viewRef) {
            if (this.component) {
                this.component.instance['editMode'] = this.editMode;
                this.component.instance['selectedNode'] = this.selectedNode;
                this.component.instance['curentUser'] = this.curentUser;
                this.component.instance['Changed'] = this.Changed;
            }
          }
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (this.component) {
            this.component.instance['editMode'] = this.editMode;
            this.component.instance['selectedNode'] = this.selectedNode;
            this.component.instance['curentUser'] = this.curentUser;
        }
    }
  }