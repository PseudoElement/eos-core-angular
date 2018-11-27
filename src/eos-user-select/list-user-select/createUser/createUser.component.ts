import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { InputParamControlService } from 'eos-user-params/shared/services/input-param-control.service';
import { CREATE_USER_INPUTS, OPEN_CLASSIF_DEPARTMENT } from 'eos-user-select/shered/consts/create-user.consts';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { PipRX, DEPARTMENT } from 'eos-rest';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { ALL_ROWS } from 'eos-rest/core/consts';
import { Router } from '@angular/router';

@Component({
    selector: 'eos-param-create-user',
    templateUrl: 'createUser.component.html'
})
export class CreateUserComponent implements OnInit, OnDestroy {
    @Output() closedModal = new EventEmitter();
    isLoading: boolean = true;
    data = {
        SELECT_ROLE: '',
        classifName: '',
        dueDL: '',
        isn_user_copy_from: '3611'
    };
    fields = CREATE_USER_INPUTS;
    inputs;
    form: FormGroup;
    titleHeader = 'Новый пользователь';
    btnDisabled: boolean = true;
    isShell: Boolean = false;
    private ngUnsubscribe: Subject<any> = new Subject();
    constructor (
        private _router: Router,
        private _inputCtrlSrv: InputParamControlService,
        private _waitClassifSrv: WaitClassifService,
        private _apiSrv: PipRX,
    ) {}

    ngOnInit() {
        this.inputs = this._inputCtrlSrv.generateInputs(this.fields);
        this.inputs['SELECT_ROLE'].options = [];
        this.isLoading = true;
        this._apiSrv.read({USER_PARMS: {criteries: {
            ISN_USER_OWNER: '-99',
            PARM_NAME: 'CATEGORIES_FOR_USER'
        }}})
        .then(data => {
            const d = data[0];
            d['PARM_VALUE'].split(';').forEach(i => {
                this.inputs['SELECT_ROLE'].options.push({title: i, value: i});
            });
            this.form = this._inputCtrlSrv.toFormGroup(this.inputs, false);
            this.isLoading = false;
            this._subscribe();
        });
    }
    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    submit() {
        this.btnDisabled = true;
        const url = this._createUrlForSop();

        this._apiSrv.read({
            [url]: ALL_ROWS,
        })
        .then(data => {
            this.closedModal.emit();
            this._router.navigate(['user-params-set'], {
                queryParams: {isn_cl: data[0]}
            });
        });
    }
    cancel() {
        this.closedModal.emit();
    }

    selectDepartment(status) {
        if (status) {
            this._showDepartment();
        }
    }

    private _showDepartment() {
        this.isShell = true;
        this._waitClassifSrv.openClassif(OPEN_CLASSIF_DEPARTMENT)
        .then((data: string) => {
            return this._getDepartmentFromUser(data);
        })
        .then((data: DEPARTMENT[]) => {
            this.isShell = false;
            const dep: DEPARTMENT = data[0];
            this.data['dueDL'] = dep['DUE'];
            this.form.get('DUE_DEP_NAME').patchValue(dep['CLASSIF_NAME']);
        })
        .catch(() => {
            this.isShell = false;
        });
    }

    private _getDepartmentFromUser (dueDep) {
        const queryDueDep = {
            DEPARTMENT: {
                criteries: {
                    DUE: dueDep
                }
            }
        };
        return this._apiSrv.read<DEPARTMENT>(queryDueDep);
    }
    private _createUrlForSop() {
        const d = this.data;
        let url = 'CreateUserCl?';
            url += `classifName='${d['classifName'] ? encodeURI(d['classifName']) : ''}'`;
            url += `&dueDL='${d['dueDL'] ? d['dueDL'] : ''}'`;
            url += `&role='${d['SELECT_ROLE'] ? encodeURI(d['SELECT_ROLE']) : ''}'`;
            url += `&isn_user_copy_from=${d['isn_user_copy_from'] ? d['isn_user_copy_from'] : ''}`;
        return url;
    }

    private _subscribe() {
        const f = this.form;
        f.get('teсhUser').valueChanges
        .takeUntil(this.ngUnsubscribe)
        .subscribe(data => {
            if (data) {
                f.get('DUE_DEP_NAME').patchValue('');
                f.get('DUE_DEP_NAME').disable();
            } else {
                f.get('DUE_DEP_NAME').enable();
            }
        });
        f.valueChanges
        .takeUntil(this.ngUnsubscribe)
        .subscribe(d => {
            for (const c in d) {
                if (c !== 'teсhUser') {
                    this.data[c] = d[c];
                }
            }
            this.btnDisabled = this.form.invalid;
        });
    }
}
