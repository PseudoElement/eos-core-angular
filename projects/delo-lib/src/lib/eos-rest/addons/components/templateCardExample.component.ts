import { Component, ComponentFactoryResolver, Input, OnChanges, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { AddTemplateService } from '../extendTemplate.service';
@Component({
    selector: 'extension-template-component',
    template: `<ng-template extendTemplateComponent #dynamic></ng-template>`
  })
export class SpravochnikiTemplateComponent implements OnChanges {
    @Input() form: any;
    @ViewChild('dynamic', { read: ViewContainerRef }) private viewRef: ViewContainerRef;
    private component
    constructor(
      private resolver: ComponentFactoryResolver,
      private _uiLibExampleService: AddTemplateService
      ) { }
    ngAfterViewInit(): void {
      if (this._uiLibExampleService.dinamicTemplateElement) {
        const ExpandComponent = this.resolver.resolveComponentFactory(this._uiLibExampleService.dinamicTemplateElement);
        this.viewRef.clear();
        this.component = this.viewRef.createComponent(ExpandComponent);
        if (this.viewRef) {
          if (this.component) {
              this.component.instance['form'] = this.form;
          }
        }
      }
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (this.component) {
            this.component.instance['form'] = this.form;
        }
    }
  }