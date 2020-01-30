import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserParamsService } from '../shared/services/user-params.service';
import { Router } from '@angular/router';
@Component({
    selector: 'eos-user-params-header',
    styleUrls: ['user-header.component.scss'],
    templateUrl: 'user-header.component.html'
})
export class UserHeaderComponent {
    selfLink: any;
    link: any;
    @Input() editMode: boolean = false;
    @Input() title: string;
    @Input() disableBtn: boolean;
    @Input() defaultBtn?: boolean = false;
    @Input() errorSave: boolean = false;
    @Output() defaultEmit = new EventEmitter<any>();
    @Output() submitEmit = new EventEmitter<any>();
    @Output() cancelEmit = new EventEmitter<boolean>();
    @Output() editEmit = new EventEmitter<boolean>();
    constructor(
        private _userServices: UserParamsService,
        private _router: Router
    ) {
        this.selfLink = this._router.url.split('?')[0];
        this.link = this._userServices.userContextId;
    }
    default() {
        this.defaultEmit.emit('');
    }

    cancel() {
        this.editMode = false;
        this.cancelEmit.emit(false);
    }
    submit() {
        if (this.disableBtn) {
            this.cancel();
        } else {
            this.submitEmit.emit(false);
        }
    }
    edit() {
        this.editMode = !this.editMode;
        this.editEmit.emit(this.editMode);
    }
    close() {
        const queryRout = JSON.parse(localStorage.getItem('lastNodeDue'));
        let id;
        queryRout ? id = queryRout : id = '0.';
        this._router.navigate(['user_param', id]);
    }
}
