import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'eos-param-header',
    templateUrl: 'header.component.html'
})
export class ParamHeaderComponent implements OnInit {
    public editMode;
    public flag: boolean = false;
    public selfLink: string;
    @Input() title: string;
    @Input() editBtn: boolean;
    @Input() statusBtnSub;
    @Input() stayEdit: boolean = false;
    @Output() submitForm = new EventEmitter();
    @Output() cancelForm = new EventEmitter();
    @Output() editForm = new EventEmitter();
    constructor(
        private _router: Router,
        ) {}
    ngOnInit() {
        if (this.editBtn && this.editBtn === true) {
            this.editMode = false;

        } else {
            this.editMode = true;
        }
        if (this.editBtn && this.editBtn === true) {
            this.flag = true;
        }
        this.selfLink = this._router.url.split('?')[0];
    }
    edit() {
        this.editMode = true;
        this.editForm.emit();
    }
    submit() {
        if (this.flag) {
            this.editMode = false;
        }
        this.submitForm.emit();
    }
    cancel() {
        /* отменить изменения можно всегда
        if (this.flag) { */
            this.editMode = false;
        /* } */
        this.cancelForm.emit();
    }
}
