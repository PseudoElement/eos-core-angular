import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { LimitedAccesseService } from '../../shared/services/limited-access.service';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { SUCCESS_SAVE_MESSAGE_SUCCESS } from 'eos-common/consts/common.consts';
import { OPEN_CLASSIF_DOCGR } from '../../../eos-user-select/shered/consts/create-user.consts';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { UserParamsService } from '../../shared/services/user-params.service';
import { IMessage } from 'eos-common/interfaces';
import { DOCGROUP_CL } from 'eos-rest';
import { ErrorHelperServices } from '../../shared/services/helper-error.services';
@Component({
    selector: 'eos-right-limited-access',
    styleUrls: ['right-limited-access.component.scss'],
    templateUrl: 'right-limited-access.component.html'
})

export class RightLimitedAccessComponent implements OnInit, OnDestroy {
    public isLoading = false;
    public statusBtnSub: boolean = true;
    public umailsInfo: Array<any>;
    public currentIndex: number;
    public delitedSetStore = new Set();
    public saveParams: any;
    public currentParams: string;
    public activeLink: boolean;
    public flagGrifs: boolean;
    public flagLinks: boolean;
    public bacgHeader: boolean;
    public grifsForm: FormGroup;
    public LinksForm: FormGroup;
    public myForm: FormGroup;
    public tabsForAccessLimited = ['Группы документов', 'Грифы', /* 'Связки' */];
    public currTab = 0;
    titleHeader: string;
    public editFlag: boolean = false;

    get checkGriffs() {
        if (this.grifsForm) {
            const checkG = this.grifsForm.value.some(el => {
                return (el.action === 'unset' && el.checkbox === true) || (el.action === 'create' && el.checkbox === true);
            });
            if (checkG) {
                return true;
            } else {
                return false;
            }
        } else {
            if (this.checkGrifs.length) {
                return true;
            } else {
                return false;
            }
        }
    }
    private checkUserCard;
    private checkGrifs;
    private ArrayForm: FormArray;
    private _ngUnsubscribe: Subject<any> = new Subject();
    constructor(
        private _limitservise: LimitedAccesseService,
        private _msgSrv: EosMessageService,
        private _waitClassifSrv: WaitClassifService,
        private _userServices: UserParamsService,
        private _router: Router,
        private _errorSrv: ErrorHelperServices,
    ) {
        this.activeLink = true;
        this.flagGrifs = true;
        this.flagLinks = true;
        this.bacgHeader = false;
        this._userServices.saveData$
            .pipe(
                takeUntil(this._ngUnsubscribe)
            )
            .subscribe(() => {
                this._userServices.submitSave = this.saveAllForm();
            });
    }
    async ngOnInit() {
        await this._userServices.getUserIsn();
        this.titleHeader = `${this._userServices.curentUser.SURNAME_PATRON} - Ограничение доступа`;
        this.checkUserCard = this._userServices['_userContext']['USERCARD_List'];
        this.isLoading = false;
        this._limitservise.getInfoGrifs().then(result => {
            this.checkGrifs = result[0][0]['USERSECUR_List'];
        });
        this._limitservise.getAccessCode()
            .then((result) => {
                this.umailsInfo = result.slice();
                this.sortArray(this.umailsInfo);
                this.saveParams = this.umailsInfo.slice();
                this.umailsInfo.length > 0 ? this.currentIndex = 0 : this.currentIndex = null;
                this.createForm(false, false);
                this.ArrayForm = <FormArray>this.myForm.controls['groupForm'];
                this.myForm.valueChanges.subscribe(data => {
                    this.checkChanges(data);
                });
                this.editModeForm();
                this.isLoading = true;
            });
    }
    clearForm(): void {
        sessionStorage.removeItem(String(this._userServices.userContextId));
        this.umailsInfo.splice(0, this.umailsInfo.length);
        this.resetForm();
        this.umailsInfo = this.saveParams.slice();
        this.sortArray(this.umailsInfo);
        this.sortArray(this.saveParams);
        this.ArrayForm = <FormArray>this.myForm.controls['groupForm'];
        this.flagGrifs = true;
        this.statusBtnSub = true;
    }
    resetForm() {
        // this.myForm.removeControl('groupForm');
        // this.myForm.setControl('groupForm', this.createGroup(false, false, true));
        this.createForm(false, false, true);
        this.ArrayForm = <FormArray>this.myForm.controls['groupForm'];
        this.myForm.valueChanges.subscribe(data => {
            this.checkChanges(data);
        });
    }
    saveAllForm($event?): Promise<any> {
        if (!this.checkGriffs) {
            this.editFlag = true;
            this.warning('warning', 'Предупреждение', 'Не заданы грифы доступа');
            return;
        }
        this.isLoading = false;
        const promise_all = [];
        sessionStorage.removeItem(String(this._userServices.userContextId));
        sessionStorage.removeItem(String('links'));
        promise_all.push(this._limitservise.preAddNewDocument(this.ArrayForm), this._limitservise.preDelite(this.delitedSetStore), this._limitservise.preEdit(this.ArrayForm));
        if (this.grifsForm) {
            promise_all.push(this._limitservise.postGrifs(this.grifsForm), this._limitservise.deliteGrifs(this.grifsForm));
        }
        // if (this.LinksForm) {
        //     const valueEdit = this.LinksForm.get('links').value;
        //     // this._limitservise.createLinksNpUserLInk(valueEdit),
        //     promise_all.push(this._limitservise.deliteLinksFromNpUserLink(valueEdit), this._limitservise.createLinksNpUserLInk(valueEdit));
        // }
        return Promise.all([...promise_all])
            .then(result => {
                this._limitservise.getAccessCode()
                    .then((params) => {
                        if (params) {
                            this.umailsInfo.splice(0, this.umailsInfo.length);
                            this.saveParams = params.slice();
                            this.sortArray(this.saveParams);
                            this.delitedSetStore.clear();
                            this.resetForm();
                            this.umailsInfo = this.saveParams.slice();
                            this.statusBtnSub = true;
                            this.flagGrifs = true;
                            this.editFlag = false;
                            this.isLoading = true;
                            this.grifsForm = null;
                            this.ArrayForm = <FormArray>this.myForm.controls['groupForm'];
                            this.editModeForm();
                            this._pushState();
                            this._limitservise.subscribe.next(false);
                            if (!this.checkUserCard.length) {
                                this._router.navigate(['user-params-set/', 'card-files'],
                                    {
                                        queryParams: { isn_cl: this._userServices.userContextId }
                                    });
                                this.warning('warning', 'Предупреждение', 'Не определена главная картотека', 6000);
                            }
                            this._msgSrv.addNewMessage(SUCCESS_SAVE_MESSAGE_SUCCESS);
                        }
                    });
            }).catch(error => {
                this._errorSrv.errorHandler(error);
                this.backForm();
                this.isLoading = true;
            });
    }
    backForm($event?): void {
        this._limitservise.getInfoGrifs().then(result => {
            this.checkGrifs = result[0][0]['USERSECUR_List'];
        }).then(() => {
            this.delitedSetStore.clear();
            this.clearForm();
            this.editFlag = $event;
            this.editModeForm();
            this._pushState();
            this.grifsForm = null;
            this._limitservise.subscribe.next(true);
        });
    }

    chooseCurrentField(index: number): void {
        this.currentIndex = index;
    }
    deliteEmailFild(): void {
        if (this.currentIndex !== (null || undefined) && this.currentIndex !== 0) {
            this.preDelite();
            this.searchNeddedField();
        }
    }

    preDelite() {
        const delitedField = this.ArrayForm.get(String(this.currentIndex));
        if (delitedField) {
            if (delitedField.value.newField !== true) {
                //  в map добавлены только поля для удаления без флага true в форме, в свойсттве newField
                this.delitedSetStore.add(delitedField.value);
            }
        }
        this.ArrayForm.removeAt(this.currentIndex);
        this.umailsInfo.splice(this.currentIndex, 1);
    }

    searchNeddedField() {
        this.umailsInfo = this.umailsInfo.filter((el, index) => {
            if (el[index] !== this.currentIndex) {
                return el;
            }
        });
        if (this.umailsInfo.length > 0) {
            this.currentIndex = 0;
        }
    }

    OpenClassiv(): void {
        this.bacgHeader = true;
        this._waitClassifSrv.openClassif(OPEN_CLASSIF_DOCGR)
            .then(result_classif => {
                const newClassif = result_classif !== '' || null || undefined ? result_classif : '0.';
                this._limitservise.getCodeNameDOCGROUP(String(newClassif))
                    .then(result => {
                        let arrData = this.checkfield(result);
                        arrData = this.checkDeletedStore(arrData);
                        arrData.forEach(el => {
                            const newField = {
                                NAME: el.CLASSIF_NAME,
                                DUE: el.DUE,
                                ALLOWED: false
                            };
                            this.umailsInfo.push(newField);
                            this.statusBtnSub = false;
                            this.addFormControls(newField, false, el['_grif'] === 'old' ? false : true);
                        });
                        this.currentIndex = this.umailsInfo.length - 1;
                        this.bacgHeader = false;
                    });
            }).catch(error => {
                this.bacgHeader = false;
            });
    }

    checkDeletedStore(arrData: DOCGROUP_CL[]): DOCGROUP_CL[] {
        if (this.delitedSetStore.size) {
            arrData.forEach((doc: DOCGROUP_CL) => {
                this.checkNewOrOld(doc);
            });
        }
        return arrData;
    }
    checkNewOrOld(doc: DOCGROUP_CL) {
        const arraySet = Array.from(this.delitedSetStore);
        const find = arraySet.filter((value) => {
            return doc.DUE === value.due;
        });
        if (find.length) {
            doc['_grif'] = 'old';
            this.delitedSetStore.delete(find[0]);
        } else {
            doc['_grif'] = 'new';
        }
    }

    checkfield(param) {
        const arrach = this.umailsInfo;
        const filter = param.filter(function (el) {
            return !arrach.some(elenemt => {
                return elenemt.DUE === el.DUE;
            });
        });
        return filter;
    }
    editModeForm() {
        if (this.editFlag) {
            this.myForm.enable({ emitEvent: false });
        } else {
            this.myForm.disable({ emitEvent: false });
        }
    }

    createForm(changedField: boolean, newField: boolean, flagBackForm?: boolean) {
        this.myForm = new FormGroup({ 'groupForm': this.createGroup(changedField, newField, flagBackForm) });
    }

    createGroup(changedField: boolean, newField: boolean, flagBackForm?: boolean): FormArray {
        let arrayField;
        const group = new FormArray([]);
        flagBackForm ? arrayField = this.saveParams : arrayField = this.umailsInfo;
        arrayField.forEach((element, index) => {
            group.push(new FormGroup(this.createFormControls(element, changedField, newField, index)));
        });
        return group;
    }
    createFormControls(element, bool1, bool2, index?): { [key: string]: FormControl } {
        const controls = {};
        controls['name'] = new FormControl(element.NAME);
        controls['due'] = new FormControl(element.DUE);
        controls['checkbox'] = new FormControl(Boolean(element.ALLOWED));
        controls['change'] = new FormControl(bool1);
        controls['newField'] = new FormControl(bool2);
        return controls;
    }
    checkChanges(data?: { [key: string]: Array<any> }) {
        let count_error = 0;
        this.umailsInfo.forEach((element, index) => {
            const checkedField = data.groupForm[index];
            const checkedData = element;
            if (checkedField) {
                if (Number(checkedField['checkbox']) !== Number(checkedData['ALLOWED']) || checkedField['newField'] === true) {
                    this.statusBtnSub = false;
                    this.myForm.get('groupForm')
                        .get(String(index))
                        .patchValue({ change: true }, { emitEvent: false });
                    count_error++;
                } else {
                    this.statusBtnSub = true;
                    this.myForm.get('groupForm')
                        .get(String(index))
                        .patchValue({ change: false }, { emitEvent: false });
                }
            }
        });
        if (this.delitedSetStore.size) {
            count_error++;
        }
        count_error > 0 ? this.statusBtnSub = false : this.statusBtnSub = true;
        this._pushState();
        count_error = 0;
    }

    addFormControls(newFieldEmail, change: boolean, newField: boolean) {
        this.ArrayForm.push(new FormGroup(this.createFormControls(newFieldEmail, change, newField)));
    }

    sortArray(array) {
        array.sort(function (a, b) {
            return a.DUE - b.DUE;
        });
    }

    changeActivelink(tab: number) {
        // this.activeLink = !this.activeLink;
        this.currTab = tab;
    }
    SubscribtGrifs(event) {
        this.flagGrifs = event.flag;
        this.grifsForm = event.form;
        this._pushState();
    }
    // SubscribLInks(event) {
    //     this.flagLinks = event.flag;
    //     this.LinksForm = event.form;
    //     this._pushState();
    // }
    ngOnDestroy() {
        //   this._limitservise.LinksFrom = undefined;
        sessionStorage.removeItem(`${this._userServices.userContextId}`);
        sessionStorage.removeItem('links');
        this._ngUnsubscribe.next();
        this._ngUnsubscribe.complete();
    }
    edit($event) {
        this.editFlag = $event;
        this.editModeForm();
        this._limitservise.editEmit.next();
    }
    get getBtn() {
        if (!this.statusBtnSub || !this.flagGrifs) {
            return false;
        }
        return true;
    }
    private _pushState() {
        this._userServices.setChangeState({ isChange: !this.getBtn });
    }
    private warning(type: any, title: string, msg: string, dismissOnTimeout?: any) {
        const m: IMessage = {
            type: type,
            title: title,
            msg: msg,
        };
        if (dismissOnTimeout) {
            m['dismissOnTimeout'] = dismissOnTimeout;
        }
        this._msgSrv.addNewMessage(m);
    }

}
