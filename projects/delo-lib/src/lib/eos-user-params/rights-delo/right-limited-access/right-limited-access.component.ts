import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, RouterStateSnapshot } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { LimitedAccesseService } from '../../shared/services/limited-access.service';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { EosMessageService } from '../../../eos-common/services/eos-message.service';
import { SUCCESS_SAVE_MESSAGE_SUCCESS } from '../../../eos-common/consts/common.consts';
import { OPEN_CLASSIF_DOCGR } from '../../../eos-user-select/shered/consts/create-user.consts';
import { WaitClassifService } from '../../../app/services/waitClassif.service';
import { UserParamsService } from '../../shared/services/user-params.service';
import { IMessage } from '../../../eos-common/interfaces';
import { DOCGROUP_CL } from '../../../eos-rest';
import { ErrorHelperServices } from '../../shared/services/helper-error.services';
import { AppContext } from '../../../eos-rest/services/appContext.service';
import { GrifsFilesComponent } from './grifs-files/grifs-files-component';
import { GrifsComponent } from './grifs/grifs-component';
@Component({
    selector: 'eos-right-limited-access',
    styleUrls: ['right-limited-access.component.scss'],
    templateUrl: 'right-limited-access.component.html'
})

export class RightLimitedAccessComponent implements OnInit, OnDestroy {
    @ViewChild('eosgrifs') 'eosgrifs': GrifsComponent;
    @ViewChild('eosfiles') 'eosfiles': GrifsFilesComponent;
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
    public myElem: any[] = [];
    public myForm: FormGroup;
    public tabsForAccessLimited;
    public currTab = 0;
    public currentUser;
    public editFlag: boolean = false;
    public checkCB;
    public grifsFiles: any[] = [];
    public grifsFileForm: FormGroup;
    public myElemFiles: any[] = [];
    public flagFileGrifs: boolean = true;
    public initGrifs: any[];
    public initGrifsFiles: any[];
    grifInput: any[] = [];

    get title() {
        if (this.currentUser) {
            if (this.currentUser.isTechUser) {
                return this.currentUser.CLASSIF_NAME + '- Ограничение доступа';
            }
            return `${this.currentUser['DUE_DEP_SURNAME']} - Ограничение доступа`;
        }
        return '';
    }

    private checkUserCard;
    // private checkGrifs;
    private ArrayForm: FormArray;
    private _ngUnsubscribe: Subject<any> = new Subject();
    constructor(
        private _limitservise: LimitedAccesseService,
        private _msgSrv: EosMessageService,
        private _waitClassifSrv: WaitClassifService,
        private _userServices: UserParamsService,
        private _router: Router,
        private _errorSrv: ErrorHelperServices,
        private _snap: ActivatedRoute,
        private _appContext: AppContext,
    ) {
        this.activeLink = true;
        this.flagGrifs = true;
        this.flagLinks = true;
        this.bacgHeader = false;
        this.tabsForAccessLimited = /* _appContext.cbBase ?  */['Группы документов', 'Грифы РК/РКПД', 'Грифы файлов'] /* : ['Группы документов', 'Грифы'] */;
        this._snap.queryParams
        .pipe(
            takeUntil(this._ngUnsubscribe)
        )
        .subscribe((data: Object) => {
            if (data.hasOwnProperty('flag')) {
                this.currTab = 1;
            }
        });
    }
    ngOnInit() {
        /* this.checkCB = this._appContext.cbBase; */
        const query = /* this.checkCB ?  */'USERCARD_List,USERSECUR_List,USER_FILESECUR_List'/*  : 'USERCARD_List,USERSECUR_List' */;
        this._userServices.getUserIsn({
            expand: query
        })
        .then(() => {
            this.currentUser = this._userServices.curentUser;
            this.checkUserCard = this.currentUser['USERCARD_List'];
            this.isLoading = false;
            const getGrifsName = this._limitservise.getGrifsName();
            const getAccessCode = this._limitservise.getAccessCode();
            /* обрабатываем и запускаем показываем страницу только после получения 2 запросов */
            Promise.all([getGrifsName, getAccessCode]).then(values => {
                if (this.currentUser['USER_FILESECUR_List']) {
                    this.grifsFiles[0] = this.currentUser['USER_FILESECUR_List'];
                    this.grifsFiles[1] = values[0];
                }
                this.grifInput[1] = values[0];
                this.grifInput[0] = this.currentUser['USERSECUR_List'];
                this.initGrifs = this.initValueGrifs(this.grifInput);
                this.initGrifsFiles = this.initValueGrifs(this.grifsFiles);
                // getAccessCode
                this.umailsInfo = values[1].slice();
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
        })
        .catch(err => {

        });
        this._userServices.canDeactivateSubmit$
        .pipe(
            takeUntil(this._ngUnsubscribe)
            )
        .subscribe((rout: RouterStateSnapshot) => {
            this._userServices.submitSave = this.saveAllForm(true);
        });
    }

    checkGriffs(): boolean {
        let flagRk, flagFile;
        const flagGroups = this.checkedGroupForm();
        if (this.eosgrifs) {
            flagRk = this.checkedFlagForm(this.eosgrifs.fields);
        }
        if (this.eosfiles) {
            flagFile = this.checkedFlagForm(this.eosfiles.fields);
        }
        if (flagGroups) {
            this.editFlag = true;
            this.warning('warning', 'Предупреждение', 'Не назначен доступ к Группам документов');
            return true;
        }
        if (!flagRk && !flagFile) {
            this.editFlag = true;
            this.warning('warning', 'Предупреждение', 'Не заданы грифы доступа. Назначьте Грифы РК/РКПД, Грифы файлов');
            return true;
        }
        if (!flagRk) {
            this.editFlag = true;
            this.warning('warning', 'Предупреждение', 'Не заданы грифы доступа. Назначьте Грифы РК/РКПД');
            return true;
        }
        if (!flagFile) {
            this.editFlag = true;
            this.warning('warning', 'Предупреждение', 'Не заданы грифы доступа. Назначьте Грифы файлов');
            return true;
        }
        // if (!this.grifsForm && !this.grifsFiles) {
        //     if (this.checkGrifs.length) {
        //         return true;
        //     } else {
        //         return false;
        //     }
        // }
        return false;
    }

    checkedFlagForm(data: any): boolean {
        let flag = false;
        const checkVal = data.filter(item => item.value);
        if (checkVal.length) {
            flag = true;
        }

        return flag;
    }

    checkedGroupForm(): boolean {
        let flag = false, count = 0;
        const groupForm = this.myForm.value.groupForm;
        groupForm.forEach(item => {
            if (!item.checkbox) {
                count++;
            }
        });
        if (groupForm.length && groupForm.length === count) {
            flag = true;
        }
        return flag;
    }

    initValueGrifs(inputs: any[]): any[] {
        const result = inputs;
        const arr = [];
        const checkGrifs = result[0];
        result[1].forEach(elem => {
            arr.push(this._limitservise.createElemGrif(elem));
        });
        const fields = this._limitservise.writeValue(arr, checkGrifs);
        return fields;
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
        if (this.checkGriffs()) {
            return Promise.resolve('error');
        }
        this.isLoading = false;
        const promise_all = [];
        sessionStorage.removeItem(String(this._userServices.userContextId));
        sessionStorage.removeItem(String('links'));
        this._limitservise.preAddNewDocument(this.ArrayForm).forEach((d) => {
            promise_all.push(d);
        });
        this._limitservise.preDelite(this.delitedSetStore).forEach((d) => {
            promise_all.push(d);
        });
        this._limitservise.preEdit(this.ArrayForm).forEach((d) => {
            promise_all.push(d);
        });
        if (this.myElem.length > 0) {
            this._limitservise.postGrifs(this.myElem).forEach((d) => {
                promise_all.push(d);
            });
            this._limitservise.deliteGrifs(this.myElem).forEach((d) => {
                promise_all.push(d);
            });
        }
        if (this.myElemFiles.length > 0) {
            this._limitservise.postGrifsFiles(this.myElemFiles).forEach((d) => {
                promise_all.push(d);
            });
            this._limitservise.deliteGrifsFiles(this.myElemFiles).forEach((d) => {
                promise_all.push(d);
            });
        }
        return this._limitservise.allElementBatchData(promise_all)
            .then(result => {
                if ($event) {
                    this._msgSrv.addNewMessage(SUCCESS_SAVE_MESSAGE_SUCCESS);
                    return this._userServices.ProtocolService(this._userServices.userContextId, 5);
                } else {
                    this._userServices.ProtocolService(this._userServices.userContextId, 5);
                    this._limitservise.getDataGrifs()
                    .then(res => {
                        this.grifInput[0] = res[0]['USERSECUR_List'];
                        // this.checkGrifs = res[0]['USERSECUR_List'];
                        if (res[0]['USER_FILESECUR_List']) {
                            this.grifsFiles[0] = res[0]['USER_FILESECUR_List'];
                        }
                    });
                    this._limitservise.getAccessCode()
                    .then((params) => {
                        if (params) {
                            this.flagFileGrifs = true;
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
                            if (this.grifsForm) {
                                const elem: any[] = [];
                                Object.keys(this.grifsForm.value).forEach(element => {
                                    if (this.grifsForm.get(element).value) {
                                        elem.push(element);
                                    }
                                });
                                // this.checkGrifs = elem;
                            }
                            this.grifsFileForm = null;
                            this.grifsForm = null;
                            this.myElem = [];
                            this.myElemFiles = [];
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
                }
            }).catch(error => {
                this._errorSrv.errorHandler(error);
                this.backForm();
                this.isLoading = true;
            });
    }
    backForm($event?): void {
        this.editFlag = $event;
        this.myElem = [];
        this.myElemFiles = [];
        this._limitservise.getDataGrifs()
        .then(result => {
            this.flagFileGrifs = true;
            this.grifInput[0] = result[0]['USERSECUR_List'];
            // this.checkGrifs = result[0]['USERSECUR_List'];
            if (result[0]['USER_FILESECUR_List']) {
                this.grifsFiles[0] = result[0]['USER_FILESECUR_List'];
            }
        })
        .then(() => {
            this.delitedSetStore.clear();
            this.clearForm();
            this.editModeForm();
            this._pushState();
            this.grifsForm = null;
            this.grifsFileForm = null;
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
                //  в map добавлены только поля для удаления без флага true в форме, в свойстве newField
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
        const find = arraySet.filter((value: any) => {
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
        controls['DELETED'] = new FormControl(element['DUE'] !== '0.' && element['DELETED'] === 1);
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
        this.myElem = event.data;
        this._pushState();
    }
    SubscribFiles(event) {
        this.flagFileGrifs = event.flag;
        this.grifsFileForm = event.form;
        this.myElemFiles = event.data;
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
        this.editFlag = $event && this.checkAccess;
        this.editModeForm();
        this._limitservise.editEmit.next();
    }
    get getBtn() {
        if ((!this.statusBtnSub || !this.flagGrifs || !this.flagFileGrifs) && this.checkAccess) {
            return false;
        }
        return true;
    }
    get checkAccess() {
        return !this._appContext.limitCardsUser.length || this._appContext.limitCardsUser.indexOf(this.currentUser['DEPARTMENT_DUE']) !== -1;
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
