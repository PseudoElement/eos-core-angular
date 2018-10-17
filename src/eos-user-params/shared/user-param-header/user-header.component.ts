import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'eos-user-header',
    templateUrl: 'user-header.component.html'
})
export class UserParamHeaderComponent {
    @Input() title: string;
    @Input() statusBtnSub;
    @Output() submitForm = new EventEmitter();
    @Output() cancelForm = new EventEmitter();
    @Output() defaultForm = new EventEmitter();
    submit() {
        this.submitForm.emit();
    }
    cancel() {
        this.cancelForm.emit();
    }
    default() {
        this.defaultForm.emit();
    }
}
