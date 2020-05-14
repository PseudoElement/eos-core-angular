import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { UserParamsService } from '../shared/services/user-params.service';
import { Router } from '@angular/router';
@Component({
    selector: 'eos-user-params-header',
    styleUrls: ['user-header.component.scss'],
    templateUrl: 'user-header.component.html'
})
export class UserHeaderComponent implements OnInit {
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
    get checkSegment() {
        const segmentsUrl = this._router.parseUrl(this._router.url).root.children.primary.segments;
        if (segmentsUrl.length && segmentsUrl.length > 2 && segmentsUrl[1].path === 'current-settings') {
            return true;
        }
        return false;
    }
    constructor(
        private _userServices: UserParamsService,
        private _router: Router
    ) {
        this.selfLink = this._router.url.split('?')[0];
        this.link = this._userServices.userContextId;
    }
    ngOnInit() {
        if (this.checkSegment) {
            setTimeout(() => {
                this.editMode  = true;
                this.editEmit.emit(this.editMode);
            });
        }
    }
    default() {
        this.defaultEmit.emit('');
    }

    cancel() {
        if (this.checkSegment) {
            window.opener.close();
            return;
        }
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
        if (this.checkSegment) {
            window.opener.close();
            return;
        }
        const queryRout = JSON.parse(localStorage.getItem('lastNodeDue'));
        let id;
        queryRout ? id = queryRout : id = '0.';
        this._router.navigate(['user_param', id]);
    }
}
