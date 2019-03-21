import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'eos-user-header',
    templateUrl: 'user-header.component.html',
    styleUrls: ['user-header.component.scss']
})
export class UserParamHeaderComponent {
    @Input() title: string;
    @Input() statusBtnSub;
    @Input() isDefault? = true;
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
