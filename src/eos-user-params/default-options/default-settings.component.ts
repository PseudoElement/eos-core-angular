import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import { NavParamService } from 'app/services/nav-param.service';
import { ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { SUB_PARAMS_LIST_NAV } from 'eos-user-params/shared/consts/user-param.consts';
import { FormHelperService } from 'eos-user-params/shared/services/form-helper.services';
import { PipRX, USER_PARMS } from 'eos-rest';
import { IUserSetChanges } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';

@Component({
    selector: 'eos-default-settings',
    styleUrls: ['default-settings.component.scss'],
    templateUrl: './default-settings.component.html'
})

export class DefaultSettingsComponent implements OnInit, OnDestroy {
    listSettings = SUB_PARAMS_LIST_NAV;
    defaultUser: any;
    disableSave: boolean;
    paramId: string;
    isWide: boolean = true;
    private _isChanged: boolean;
    private ngUnsubscribe: Subject<any> = new Subject();

    constructor(
        private _navSrv: NavParamService,
        private _route: ActivatedRoute,
        private formHelp: FormHelperService,
        private _pipRx: PipRX,
        private _userParamService: UserParamsService,
    ) {
        this._route.params.subscribe(params => (this.paramId = params['id']));
        this._navSrv.StateSandwich$
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((state: boolean) => {
                this.isWide = state;
            });
        this._userParamService.hasChanges$
        .pipe(
            takeUntil(this.ngUnsubscribe)
        )
        .subscribe(({ isChange }: IUserSetChanges) => {
            this._isChanged = isChange;
            //    this._disableSave = disableSave;
        });
    }
    ngOnInit() {
        const prep = this.formHelp.getObjQueryInputsField();
        this._pipRx.read(prep).then((data) => {
            this.defaultUser = this.formHelp.createhash(data);
        });
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
    @HostListener('window:beforeunload', ['$event'])
    canWndUnload(evt: BeforeUnloadEvent): any {
        if (this._isChanged) {
            evt.returnValue = '';
            return false;
        }
    }

    canDeactivate(nextState?: RouterStateSnapshot): Promise<boolean> | boolean {
        if (this._isChanged) {
            return new Promise((res, rej) => {
                if (confirm('Возможно, внесенные изменения не сохранятся.')) {
                    this._isChanged = false;
                    return res(true);
                } else {
                    return res(false);
                }
            });
        } else {
            return Promise.resolve(true);
        }
    }

    DefaultSubmitEmit(updateUser: USER_PARMS[]): any {
        if (updateUser[1] !== undefined) {
            const dataUsers = updateUser[0];
            Object.keys(dataUsers).forEach((key) => {
                let value = dataUsers[key].value;
                if (value !== undefined) {
                    if (value === true) {
                        value = 'YES';
                    }
                    if (value === false) {
                        value = 'NO';
                    }
                    this.defaultUser[key] = value;
                }
            });
        } else {
            Object.keys(updateUser).forEach((key) => {
                const dot = key.charAt(3);
                let value = updateUser[key];
                if (value !== undefined) {
                    if (value === true) {
                        value = 'YES';
                    }
                    if (value === false) {
                        value = 'NO';
                    }
                    if (dot === '.') {
                        key = key.substr(4);
                    }
                    this.defaultUser[key] = value;
                }
            });
        }
        return this.defaultUser;
    }
}
