import { Component, OnInit, EventEmitter, Output, OnDestroy, Input } from '@angular/core';
import { SETTINGS_MANAGEMENT_INPUTS, CUT_RIGHTS_INPUTS } from 'eos-user-select/shered/consts/settings-management.const';
import { FormGroup } from '@angular/forms';
import { InputParamControlService } from 'eos-user-params/shared/services/input-param-control.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { OPEN_CLASSIF_USER_CL } from 'eos-user-select/shered/consts/create-user.consts';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { PipRX, USER_CL, LIST_ITEMS, DEPARTMENT } from 'eos-rest';
import { ALL_ROWS } from 'eos-rest/core/consts';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { SUCCESS_SAVE_MESSAGE_SUCCESS } from 'eos-common/consts/common.consts';
import { ErrorHelperServices } from 'eos-user-params/shared/services/helper-error.services';
import { ConfirmWindowService } from '../../../eos-common/confirm-window/confirm-window.service';
import { CONFIRM_COPY_USER, CONFIRM_CUT_USER } from '../../../eos-dictionaries/consts/confirm.consts';
import { AppContext } from '../../../eos-rest/services/appContext.service';
import { UserSelectNode } from '../user-node-select';
import { UserParamsService } from '../../../eos-user-params/shared/services/user-params.service';

@Component({
    selector: 'eos-setting-management',
    templateUrl: 'setting-management.component.html',
})
export class SettingManagementComponent implements OnInit, OnDestroy {
    @Output() closedModal = new EventEmitter();
    @Input() checkedUsers: UserSelectNode[];
    disabledSubmit: boolean = false;
    inputs: any;
    isLoading: boolean = false;
    isShell: boolean = false;
    isnCopyFrom: number;
    form: FormGroup;
    inputsCut: any;
    formCut: FormGroup;
    private _data: Map<string, any> = new Map();
    private _ngUnsubscribe: Subject<any> = new Subject();

    constructor(
        private _inputCtrlSrv: InputParamControlService,
        private _waitClassifSrv: WaitClassifService,
        private _pipeSrv: PipRX,
        private _msgSrv: EosMessageService,
        private _error_helper: ErrorHelperServices,
        private _errorSrv: ErrorHelperServices,
        private _userParamSrv: UserParamsService,
        private _confirmSrv: ConfirmWindowService,
        private _appCtx: AppContext,
    ) { }

    get disabledCopy(): boolean {
        return this.isnCopyFrom && this._checkForm(this.form) || this.form.get('USER_TEMPLATES').value;
    }

    get disabledCutRights(): boolean {
        return this._checkForm(this.formCut);
    }

    ngOnInit() {
        this._pipeSrv.read({
            USER_LISTS: {
                criteries: {
                    ISN_LCLASSIF: '-99',
                    NAME: '$USERTEMPLATES',
                    CLASSIF_ID: '104',
                    LIST_KIND: '1'
                }
            }, expand: 'LIST_ITEMS_List'
        }).then(list => {
            this.inputs = this._inputCtrlSrv.generateInputs(SETTINGS_MANAGEMENT_INPUTS);
            this.inputsCut = this._inputCtrlSrv.generateInputs(CUT_RIGHTS_INPUTS);
            this.formCut = this._inputCtrlSrv.toFormGroup(this.inputsCut, false);
            if (list.length && list[0]['LIST_ITEMS_List'].length) {
                let isnDepartments,
                    listI: LIST_ITEMS[],
                    mapDep: Map<number, any>;
                listI = list[0]['LIST_ITEMS_List'];
                isnDepartments = listI.map(_l => _l.REF_ISN);
                mapDep = new Map();
                this.loadUsersTemplats(isnDepartments, mapDep).then(_users => {
                    const options = [{ title: '...', value: '', disabled: false }];
                    listI.forEach(_l => {
                        const { userId } = mapDep.get(_l.REF_ISN);
                        options.push({ title: _l.NOTE, value: userId, disabled: userId === 'not_user' });
                    });
                    this.inputs['USER_TEMPLATES'].options = options;
                    this.form = this._inputCtrlSrv.toFormGroup(this.inputs, false);
                    this._subscribe();
                    this._pathForm(true);
                });
            } else {
                this.form = this._inputCtrlSrv.toFormGroup(this.inputs, false);
                this._subscribe();
                this._pathForm(true);
            }

        }).catch(e => {
            this._error_helper.errorHandler(e);
            this.closedModal.emit();
        });
    }
    delSelectUser($event?) {
        if ($event && $event.keyCode === 46 && this.isnCopyFrom) {
            this._data['USER_COPY'] = undefined;
            this.form.get('USER_COPY').patchValue('');
            this.isnCopyFrom = null;
        } else if (!$event) {
            this._data['USER_COPY'] = undefined;
            this.form.get('USER_COPY').patchValue('');
            this.isnCopyFrom = null;
        }
    }

    ngOnDestroy() {
        this._ngUnsubscribe.next();
        this._ngUnsubscribe.complete();
    }
    loadUsersTemplats(params: Array<number>, map: Map<number, any>): Promise<any> {
        const isns = params.join('|');
        return this._pipeSrv.read({
            DEPARTMENT: {
                criteries: {
                    ISN_NODE: isns
                }
            }
        }).then((_d: DEPARTMENT[]) => {
            return this._pipeSrv.read({
                USER_CL: {
                    criteries: {
                        DUE_DEP: _d.map(_d1 => _d1['DUE']).join('|')
                    }
                }
            }).then((_users: USER_CL[]) => {
                _d.forEach(department => {
                    const user = _users.filter(_u => _u.DUE_DEP === department.DUE)[0];
                    map.set(department.ISN_NODE, { userId: user ? user.ISN_LCLASSIF : 'not_user' });
                });
            });
        });
    }

    copySettings(): Promise<any> {
        const  isn = this.isnCopyFrom || this.form.controls['USER_TEMPLATES'].value;
        this.isLoading = true;
        return this._confirmSrv.confirm(CONFIRM_COPY_USER).then(res => {
            if (res) {
                if (isn) {
                    this._pipeSrv.batch([{
                        method: 'POST',
                        requestUri: this._createUrlForSop(this.form, isn, true),
                    }], '').then(() => {
                        this._msgSrv.addNewMessage(SUCCESS_SAVE_MESSAGE_SUCCESS);
                        this.sendProtocol();
                        this.resetForm();
                        this._pathForm(true);
                    }).catch(e => {
                        this._error_helper.errorHandler(e);
                        this.resetForm();
                    });
                }
            } else {
                this.isLoading = false;
                return;
            }
        }).catch((e) => {
            this._errorSrv.errorHandler(e);
            this.isLoading = false;
        });

    }
    close() {
        this.closedModal.emit();
    }

    resetForm() {
        this.form.reset();
        this._data.clear();
        this.isLoading = false;
        this.isnCopyFrom = null;
    }

    sendProtocol(changes?) {
        if (changes) {
            if (this.form.controls[7].value) {
                this.sendFinallyProtocol(6);
            }
            if (this.form.controls[1].value || this.form.controls[3].value) {
                this.sendFinallyProtocol(5);
            }
        } else {
            this.sendFinallyProtocol(5);
        }

    }
    sendFinallyProtocol(kind) {
        this.checkedUsers.forEach(user => {
            this._userParamSrv.ProtocolService(user.id, kind);
        });
    }
    selectUser(access) {
        if (!access) {
            this.isShell = true;
            this._waitClassifSrv.openClassif(OPEN_CLASSIF_USER_CL)
                .then(data => {
                    if (this.checkedUsers.some((u: UserSelectNode) => +u.data.ISN_LCLASSIF === +data)) {
                        this._msgSrv.addNewMessage({
                            type: 'warning',
                            title: 'Предупреждение',
                            msg: 'Пользователь находится в перечне адресатов копирования. Выберите другого пользователя',
                        });
                        return;
                    }
                    this.isnCopyFrom = +data;
                    return this._getUserCl(data);
                })
                .then((userData) => {
                    const limitedTech = userData && userData.length &&
                        this._appCtx.limitCardsUser && this._appCtx.limitCardsUser.length &&
                        this._appCtx.limitCardsUser.every((cardDue) => userData[0].DUE_DEP.indexOf(cardDue) === -1);
                    if (limitedTech) {
                        this._msgSrv.addNewMessage({
                            type: 'warning',
                            title: 'Предупреждение',
                            msg: 'Выберите пользователя, от которого необходимо скопировать права, относящегося к доступному подразделению для ограниченного технолога',
                        });
                        this.isnCopyFrom = null;
                        return;
                    }
                    this._pathForm();
                    return userData;
                })
                .then(data => {
                    this.isShell = false;
                    this.form.get('USER_COPY').patchValue(data[0]['SURNAME_PATRON']);
                })
                .catch((e) => {
                    console.warn(e);
                    this.isShell = false;
                });
        }
    }

    cutRights(): Promise<any> {
        if (this.formCut.controls['2'].value) {
            if (this._appCtx.limitCardsUser.length) {
                this._msgSrv.addNewMessage({
                    type: 'danger',
                    title: 'Ошибка',
                    msg: 'Нет неограниченного доступа к ведению справочника "Пользователи".',
                });
                return;
            }
        }
        const url = this._createUrlForSop(this.formCut);
        this.isLoading = true;
        return this._confirmSrv.confirm(CONFIRM_CUT_USER).then(res => {
            if (res) {
                return this._pipeSrv.read({
                    [url]: ALL_ROWS
                }).then(() => {
                    this._msgSrv.addNewMessage(SUCCESS_SAVE_MESSAGE_SUCCESS);
                    this.sendProtocol();
                    this.formCut.reset();
                    this.isLoading = false;
                });
            } else {
                this.isLoading = false;
                return;
            }
        }).catch((e) => {
            this._errorSrv.errorHandler(e);
            this.isLoading = false;
        });
    }

    changeCheckbox(event, checkbox) {
        if (!event.target.checked) {
            checkbox.patchValue(event.target.checked);
        }
    }
    cleanUser(): void {
        this.form.controls['USER_COPY'].patchValue('');
        this._pathForm(true);
        this.isnCopyFrom = null;
    }
    private _checkForm(form: FormGroup): boolean {
        let flag = false;
        Object.keys(form.controls).forEach(key => {
            if (key !== 'USER_COPY' && form.controls[key].value) {
                flag = true;
            }
        });
        return flag;
    }
    private _createUrlForSop(form: FormGroup, isn?: string,  copy?: boolean): string {
        let url;
        let rigths = '';
        if (this.form.controls['USER_TEMPLATES'].value && copy) {
            rigths = '1010111100';
        } else {
            rigths = this._getRightsData(form);
        }
        if (copy) {
            url = 'UserRightsCopy?';
        } else {
            url = 'UserRightsReset?';
        }

        url += `users='${this.checkedUsers.map(u => u.data.ISN_LCLASSIF).join('|')}'`;

        if (copy) {
            url += `&user=${+isn}`;
        }
        url += `&rights='${rigths}'`;
        return url;
    }

    // private copyShablon(users: UserSelectNode[], idFromCopy: number): Array<any> | null {
    //     //   const alertUsers = [];
    //     const changesList = [];
    //     // const checkedUsers = users.filter((user: UserSelectNode) => {
    //     //     if (user.unread || user.data.USERTYPE === -1 || !user.oracle_id) {
    //     //         alertUsers.push(user.data.CLASSIF_NAME);
    //     //     } else {
    //     //         return user;
    //     //     }
    //     // });
    //     // if (alertUsers.length) {
    //     //     this._msgSrv.addNewMessage({
    //     //         type: 'warning',
    //     //         title: 'Предупреждение',
    //     //         msg: `Пользователям ${alertUsers.join(',') } нельзя применить шаблон (у ассоциированного ДЛ или его подразделения включен флаг «не проверено»)`,
    //     //     });
    //     // }
    //     users.forEach((u: UserSelectNode) => {
    //         changesList.push({
    //             method: 'POST',
    //             requestUri: `AssignRole?userId=${+u.data.ISN_LCLASSIF}&roleId=${+idFromCopy}`,
    //         });
    //     });
    //     if (changesList.length) {
    //         return changesList;
    //     } else {
    //         return null;
    //     }
    // }

    private _getRightsData(form: FormGroup): string {
        let str = '';
        Object.keys(form.controls).forEach(key => {
            if (key !== 'USER_COPY') {
                str += form.controls[key].value ? '1' : '0';
            }
        });
        return str;
    }

    private _subscribe() {
        this.form.valueChanges
            .pipe(
                takeUntil(this._ngUnsubscribe)
            )
            .subscribe(() => {
                Object.keys(this.inputs).forEach(input => {
                    if (this.inputs[input].value !== this.form.controls[input].value) {
                        this._data.set(input, this.form.controls[input].value);
                    } else {
                        this._data.delete(input);
                    }
                });
            });

            this.form.controls['USER_TEMPLATES'].valueChanges.subscribe((data) => {
                if (this.checkedUsers.some((u: UserSelectNode) => +u.data.ISN_LCLASSIF === +data)) {
                    this._msgSrv.addNewMessage({
                        type: 'warning',
                        title: 'Предупреждение',
                        msg: 'Пользователь находится в перечне адресатов копирования. Выберите другого пользователя',
                    });
                    this.form.controls['USER_TEMPLATES'].patchValue('', {emitEvent: false});
                    return;
                }
            });
    }

    private _getUserCl(isn) {
        const queryUser = {
            USER_CL: {
                criteries: {
                    ISN_LCLASSIF: isn
                }
            }
        };
        return this._pipeSrv.read<USER_CL>(queryUser);
    }

    private _pathForm(init?: boolean): void {
        Object.keys(this.form.controls).forEach(key => {
            if (key === '2' || key === '4' || key === '9') {
                this.form.controls[key].patchValue(false, { emitEvent: false });
                if (init) {
                    this.form.controls[key].disable();
                } else {
                    this.form.controls[key].enable();
                }
            } else if (key === 'USER_COPY' || key === 'USER_TEMPLATES') {
                if (init) {
                    this.form.controls[key].patchValue('', { emitEvent: false });
                }
            } else {
                if (init) {
                    this.form.controls[key].patchValue(false, { emitEvent: false });
                    this.form.controls[key].disable();
                } else {
                    this.form.controls[key].patchValue(true, { emitEvent: false });
                    this.form.controls[key].enable();
                }
            }
        });
    }

}
