import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'eos-rights-delo-header',
    templateUrl: 'rights-delo-header.component.html'
})
export class RightsDeloHeaderComponent {
    @Input() title: string;
    @Input() statusBtnSub;
    @Output() submitForm = new EventEmitter();
    @Output() cancelForm = new EventEmitter();
    @Output() defaultForm = new EventEmitter();
    @Output() choosingMainCheckboxForm = new EventEmitter();
    path;
    constructor(private router: Router) {
        this.path = this.router.url;
      }
    submit() {
        this.submitForm.emit();
    }
    cancel() {
        this.cancelForm.emit();
    }
    default() {
        this.defaultForm.emit();
    }
    choosingMainCheckbox() {
        this.choosingMainCheckboxForm.emit();
    }
    showOrHideButtonMain() {
        if (this.path === '/user-params-set/rights-delo/card-files') {
            return true;
        } else {
            return false;
        }
    }
}
