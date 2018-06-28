import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'eos-param-header',
    templateUrl: 'header.component.html'
})
export class ParamHeaderComponent {
    @Input() title: string;
    @Input() statusBtnSub;
    @Output() submitForm = new EventEmitter();
    @Output() cancelForm = new EventEmitter();
    submit() {
        this.submitForm.emit();
    }
    cancel() {
        this.cancelForm.emit();
    }
}
