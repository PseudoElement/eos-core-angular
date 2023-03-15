import { Directive, ViewContainerRef } from "@angular/core";

@Directive({
    selector: "[addControl]"
})

export class AddControlsDirective {
    constructor(public viewContainerRef: ViewContainerRef) {

    }
}