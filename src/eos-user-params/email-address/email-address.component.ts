import { Component, OnInit, TemplateRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { EmailAddressService } from '../shared/services/email-address.service';
import { UserParamsService } from '../shared/services/user-params.service';
import { NTFY_USER_EMAIL } from 'eos-rest';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { SUCCESS_SAVE_MESSAGE_SUCCESS } from 'eos-common/consts/common.consts';
import { IMessage } from 'eos-common/interfaces';
import { RestError } from 'eos-rest/core/rest-error';
import { ErrorHelperServices } from '../shared/services/helper-error.services';
import { takeUntil } from 'rxjs/operators';
import { NavParamService } from 'app/services/nav-param.service';
import { Subject } from 'rxjs';
@Component({
    selector: 'eos-params-email-address',
    styleUrls: ['email-address.component.scss'],
    templateUrl: './email-address.component.html'
})

export class ParamEmailAddressComponent implements OnInit, OnDestroy {
    @Output() emailAddres = new EventEmitter<any>();
    @Output() redactEmail = new EventEmitter<any>();
    public isDefault = false;
    public statusBtnSub: boolean = true;
    public username: string;
    public umailsInfo: Array<any> = [];
    public currentIndex: number;
    public prevIndex: number;
    public dismissible: boolean = true;
    public defaultAlerts: Map<string, any> = new Map();
    public alerts = Array.from(this.defaultAlerts);
    public modalRef: BsModalRef;
    public delitedSetStore = new Set();
    public seveForm: Set<any>;
    public editFalg: boolean;
    public updateEmail: boolean;
    public editedEmail: string;
    public saveParams: any;
    public newEmail: string;
    public CODE: Map<string, string>;
    public currentParams: string;
    public childParams: Set<string> = new Set();
    public myForm: FormGroup;
    public storeParams = new Set();
    public inputsInfo: any;
    public showRigth: boolean = false;
    public isLoading: boolean = false;
    public changeWeight: boolean = false;
    selfLink;
    link;
    flagEdit: boolean = false;
    currentUser;
    private _ngUnsubscribe: Subject<any> = new Subject();
    get titleHeader() {
        if (this.currentUser) {
            if (this.currentUser.isTechUser) {
                return this.currentUser.CLASSIF_NAME + '- Ведение адресов электронной почты';
            }
            return `${this.currentUser['DUE_DEP_SURNAME']} - Ведение адресов электронной почты`;
        }
        return '';
    }
    private ArrayForm: FormArray;
    constructor(
        private _emailService: EmailAddressService,
        private modalService: BsModalService,
        private _userServices: UserParamsService,
        private _msgSrv: EosMessageService,
        private _errorSrv: ErrorHelperServices,
        private _navSrv: NavParamService,
    ) { }
    ngOnInit() {
        this._navSrv.StateSandwichRight$
            .pipe(
                takeUntil(this._ngUnsubscribe)
            )
            .subscribe((state: boolean) => {
                this.showRigth = state;
            });
        this._userServices.getUserIsn({
            expand: 'NTFY_USER_EMAIL_List'
        }).then(() => {
            this.currentParams = '';
            this.currentUser = this._userServices.curentUser;
            this.CODE = null;
            this.editFalg = false;
            this.username = this._userServices.curentUser['SURNAME_PATRON'];
            // для работы с формой создание, удаление, редакт.
            this.umailsInfo = this._userServices.curentUser['NTFY_USER_EMAIL_List'].slice();
            // для хранения первоночального состояния формы.
            this.saveParams = this.umailsInfo.slice();
            this.sortArray(this.umailsInfo);
            this.sortArray(this.saveParams);
            this.umailsInfo.length > 0 ? this.currentIndex = 0 : this.currentIndex = null;
            this.prevIndex = 0;
            this.umailsInfo.length > 0 ? this.newEmail = this.umailsInfo[0].EMAIL : this.newEmail = '';
            this.init();
        })
            .catch((err: boolean) => {

            })
            .catch(error => {
                this.cathError(error);
            });


    }
    init() { // возможно лучше переименовать по другому
        this._emailService.getCode2()
            .then((map: Map<string, string>) => {
                this.sortArray(this.umailsInfo);
                this.sortArray(this.saveParams);
                this._emailService.Decode(this.umailsInfo, map);
                this.CODE = map;
                this.createForm(false, false);
                this.ArrayForm = <FormArray>this.myForm.controls['groupForm'];
                this.myForm.valueChanges.subscribe(data => {
                    this.checkChanges(data);
                });
                this.editMode();
                if (this.currentIndex !== null || undefined) {
                    this.chooseCurrentField();
                }
            }).catch(error => {
            error.message = 'Ошибка сервера';
            this.cathError(error);
        });
    }
    ngOnDestroy() {
        this._ngUnsubscribe.next();
        this._ngUnsubscribe.complete();
    }

    hideToolTip() {
        const element = document.querySelector('.tooltip');
        if (element) {
            element.setAttribute('style', 'display: none');
        }
    }
    clearForm(): void {
        this.umailsInfo.splice(0, this.umailsInfo.length);
        this.resetForm();
        this.umailsInfo = this.saveParams.slice();
        this.sortArray(this.umailsInfo);
        this.sortArray(this.saveParams);
        if (this.saveParams.length > 0) {
            this.currentIndex = 0;
        } else {
            this.currentIndex = null;
        }
        this.ArrayForm = <FormArray>this.myForm.controls['groupForm'];
        this.flagEdit = false;
        this.redactEmail.emit(this.flagEdit);
        this.editMode();
    }
    resetForm() {
        this.myForm.removeControl('groupForm');
        this.myForm.setControl('groupForm', this.createGroup(false, false, true));
    }
    saveAllForm(event): Promise<any> {
        this.isLoading = true;
        return Promise.all([
            this._emailService.preAddEmail(this.ArrayForm),
            this._emailService.preDeliteEmail(this.delitedSetStore),
            this._emailService.preEditEmail(this.ArrayForm, this.umailsInfo)])
            .then(result => {
                return this._userServices.getUserIsn({
                    expand: 'NTFY_USER_EMAIL_List'
                })
                    .then((flag: boolean) => {
                        if (flag) {
                            this._userServices.ProtocolService(this._userServices.curentUser.ISN_LCLASSIF, 4);
                            this.umailsInfo.splice(0, this.umailsInfo.length);
                            this.saveParams = this._userServices.curentUser['NTFY_USER_EMAIL_List'].slice();
                            this.saveParams = this._emailService.Decode(this.saveParams, this.CODE).slice();
                            this.delitedSetStore.clear();
                            this.sortArray(this.umailsInfo);
                            this.sortArray(this.saveParams);
                            this.resetForm();
                            this.umailsInfo = this.saveParams.slice();
                            this.statusBtnSub = true;
                            this.ArrayForm = <FormArray>this.myForm.controls['groupForm'];
                            this._msgSrv.addNewMessage(SUCCESS_SAVE_MESSAGE_SUCCESS);
                        }
                        this.flagEdit = false;
                        this.redactEmail.emit(this.flagEdit);
                        this.editMode();
                        this.isLoading = false;
                    });
            }).catch(error => {
                this._errorSrv.errorHandler(error);
                this.backForm(false);
            });
    }
    backForm(event): void {
        this.delitedSetStore.clear();
        this.clearForm();
        this.chooseCurrentField();
        this.ngOnInit();
    }
    openModal(template: TemplateRef<any>, edit?: boolean) {
        this.defaultAlerts.clear();
        this.childParams.clear();
        this.editFalg = false;
        this.newEmail = '';
        if (edit) {
            this.ArrayForm.length > 0 ? this.newEmail = this.ArrayForm.controls[this.currentIndex].value['email'] : this.newEmail = '';
            const params = this.ArrayForm.controls[this.currentIndex].value['params'];
            params === null || '' ? this.currentParams = null : this.currentParams = params;
            this.editFalg = true;

        }
        this.modalRef = this.modalService.show(template);

    }
    openModalRedact(template: TemplateRef<any>) {
        if (this.currentIndex !== null && this.currentIndex !== undefined) {
            this.updateEmail = true;
            this.newEmail = this.umailsInfo[this.currentIndex].EMAIL;
            this.modalRef = this.modalService.show(template);
        }
    }
    chooseCurrentField(index?: number): void {
        if (index !== undefined ) {
            this.currentIndex = index;
        }
        if (this.currentIndex !== null || undefined) {
            const params = this.myForm.get('groupForm').get(String(this.currentIndex)).value['params'];
            params === null || '' ? this.currentParams = null : this.currentParams = params;
            this.ArrayCh();
        } else {
            this.inputsInfo = [];
        }
        this.emailAddres.emit(this.inputsInfo);
    }
    deliteEmailFild(): void {
        if (this.currentIndex !== null || undefined) {
            this.preDelite();
            this.searchNeddedField();
        }
        if (this.myForm.controls['groupForm'].get(String(this.currentIndex)) === null) {
            this.currentIndex = null;
        }
        this.chooseCurrentField();
    }

    preDelite() {
        const delitedField = this.ArrayForm.get(String(this.currentIndex));
        if (delitedField) {
            if (delitedField.value.newField !== true) {
                // в map добавлены только поля для удаления без флага true в форме, в свойсттве newField
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
    createNewField(email: string): void {
        if (this.validEmail(email)) {
            this.createOrEdit(this.editFalg, email);
        } else {
            const m: IMessage = {
                type: 'warning',
                title: 'Предупреждение',
                msg: 'Неверный формат адреса электронной почты. Введите другой адрес.',
            };
            this._msgSrv.addNewMessage(m);
        }
    }

    getChildParams(event: Set<string>) {
        this.childParams = event;
    }
    saveParamsCode(event, name) {
        this.inputsInfo.forEach(element => {
            if (element.name === name) {
                element.check = !element.check;
            }
        });
        let str = '';
        this.inputsInfo.forEach(element => {
            if (!element.check) {
                if (str === '') {
                    str = element.name;
                } else {
                    str = str + (';' + element.name);
                }
            }
        });
        this.myForm.get('groupForm').get(String(this.currentIndex)).patchValue({ params: str === '' ? null : str });
    }
    parseParams() {
        this.storeParams.clear();
        if (this.currentParams !== null || '') {
                this.currentParams.split(';').forEach(el => {
                this.storeParams.add(el.trim());
            });
        }

        return this.storeParams;
    }
    ArrayCh() {
        const newArr = [];
        let newOb = {};
        const setr = this.parseParams();
        const codeFrom = Array.from(this.CODE);
        codeFrom.forEach(el => {
            newOb['name'] = el[1];
            if ( setr.has(el[1])) {
                newOb['check'] = false;
            } else {
                newOb['check'] = true;
            }
            newArr.push(newOb);
            newOb = {};
        });
        this.inputsInfo = newArr;
    }
    createOrEdit(flag: boolean, email: string) {
        if (flag) {
            this.editEmail();
        } else {
            if (!this.updateEmail) {
                this.checkMail_PreSave(email);
            } else {
                this.upEmaileditEmail(email);
            }
        }
    }
    upEmaileditEmail(email: string) {
        if (email !== this.umailsInfo[this.currentIndex].EMAIL) {
            this._emailService.getAllEmails(email)
                .then(result => {
                    if (!result && !this.checkEmailCurrentfields(email)) {
                        this.updateEmail = false;
                        this.statusBtnSub = true;
                        const newElem = this.ArrayForm.controls[this.currentIndex].value;
                        const old = this.umailsInfo[this.currentIndex].EMAIL;
                        this.umailsInfo[this.currentIndex].prevEMAIL = old;
                        this.umailsInfo[this.currentIndex].EMAIL = email;
                        newElem['email'] = email;
                        this.updateForm(newElem);
                        this.emailAddres.emit(this.inputsInfo);
                        this.modalRef.hide();
                    } else {
                        const m: IMessage = {
                            type: 'warning',
                            title: 'Предупреждение',
                            msg: 'Такая почта уже существует',
                        };
                        this._msgSrv.addNewMessage(m);
                    }
                }).catch(error => {
                error.message = 'Ошибка сервера';
                this.cathError(error);
            });
        } else {
            this.modalRef.hide();
        }
    }
    updateForm(upElem) {
        this.ArrayForm.controls[this.currentIndex].setValue(upElem);
    }
    editEmail() {
        this.setEditEmail();
        // предполаголось редактирование почты с проверкой на уникальность
        // this._emailService.getAllEmails(email)
        // .then(result => {
        //         if (!result) {
        //         } else {
        //             this.setErrorEmail();
        //         }
        // });
    }
    setEditEmail() {
        this.myForm.get('groupForm').get(String(this.currentIndex)).patchValue({ params: this.parseChildParams() === '' ? null : this.parseChildParams() });
        this.modalRef.hide();
    }
    parseChildParams() {
        this.childParams.delete('');
        return Array.from(this.childParams).join(';');
    }

    checkMail_PreSave(email: string): void {
        this._emailService.getAllEmails(email)
            .then(result => {
                if (!result && !this.checkEmailCurrentfields(email)) {
                    const newFieldEmail = {
                        ISN_USER: this._userServices.curentUser['ISN_LCLASSIF'],
                        EMAIL: email,
                        IS_ACTIVE: 0,
                        WEIGHT: this._emailService.getMaxWeigth(this.umailsInfo) + 1,
                        EXCLUDE_OPERATION: ''
                    };
                    this.statusBtnSub = true;
                    this.umailsInfo.push(newFieldEmail);
                    this.addFormControls(newFieldEmail, false, true);
                    this.currentIndex = this.umailsInfo.length - 1;
                    this.modalRef.hide();
                    this.chooseCurrentField();
                    this.showNav();
                } else {
                    const m: IMessage = {
                        type: 'warning',
                        title: 'Предупреждение',
                        msg: 'Такая почта уже существует',
                    };
                    this._msgSrv.addNewMessage(m);
                }
            }).catch(error => {
            error.message = 'Ошибка сервера';
            this.cathError(error);
        });
    }

    showNav(): void {
        if (this.myForm.controls['groupForm'].value.length === 1) {
            this._navSrv.showRightSandwich(true);
            this._navSrv.changeStateRightSandwich(true);
            this._navSrv.blockChangeStateRightSandwich(false);
        }
    }

    validEmail(email: string): boolean {
        const regul = '^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$';
        const regexp = RegExp(regul).test(email);
        return regexp;
    }

    onClosed(type): void {
        this.defaultAlerts.delete(type);
        this.alerts = Array.from(this.defaultAlerts);
    }

    createForm(changedField: boolean, newField: boolean, flagBackForm?: boolean) {
        this.myForm = new FormGroup({ 'groupForm': this.createGroup(changedField, newField, flagBackForm) });
    }

    createGroup(changedField: boolean, newField: boolean, flagBackForm?: boolean): FormArray {
        let arrayField;
        const group = new FormArray([]);
        flagBackForm ? arrayField = this.saveParams : arrayField = this.umailsInfo;
        arrayField.forEach(element => {
            group.push(new FormGroup(this.createFormControls(element, changedField, newField)));
        });
        return group;
    }
    createFormControls(element: NTFY_USER_EMAIL, bool1, bool2): { [key: string]: FormControl } {
        const controls = {};
        controls['email'] = new FormControl(element.EMAIL);
        controls['checkbox'] = new FormControl(Number(element.IS_ACTIVE));
        controls['weigth'] = new FormControl(Number(element.WEIGHT));
        controls['params'] = new FormControl(element.EXCLUDE_OPERATION);
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
                if (checkedData['prevEMAIL'] && checkedField['email'] !== checkedData['prevEMAIL'] || Number(checkedField['checkbox']) !== Number(checkedData['IS_ACTIVE'])
                    || checkedField['params'] !== checkedData['EXCLUDE_OPERATION'] || checkedField['newField'] === true) {
                    this.statusBtnSub = false;
                    if (checkedData['prevEMAIL'] && checkedField['email'] !== checkedData['prevEMAIL']) {
                        this.myForm.get('groupForm')
                            .get(String(index))
                            .patchValue({ changeEmail: true }, { emitEvent: false });
                    } else {
                        this.myForm.get('groupForm')
                            .get(String(index))
                            .patchValue({ change: true }, { emitEvent: false });
                    }
                    count_error++;
                } else {
                    this.statusBtnSub = true;
                    this.myForm.get('groupForm')
                        .get(String(index))
                        .patchValue({ change: false }, { emitEvent: false });
                    this.myForm.get('groupForm')
                        .get(String(index))
                        .patchValue({ changeEmail: false }, { emitEvent: false });
                }
            }
        });
        if (this.delitedSetStore.size || this.changeWeight) {
            count_error++;
        }
        count_error > 0 ? this.statusBtnSub = false : this.statusBtnSub = true;
        this._pushState();
        count_error = 0;
        this.changeWeight = false;
    }

    addFormControls(newFieldEmail: NTFY_USER_EMAIL, change: boolean, newField: boolean) {
        this.ArrayForm.push(new FormGroup(this.createFormControls(newFieldEmail, change, newField)));
    }

    upWeight() {
        this.currentIndex = this.currentIndex - 1;
        this.prevIndex = this.currentIndex + 1;
        this.getSetValues();
    }

    downWeight() {
        this.currentIndex = this.currentIndex + 1;
        this.prevIndex = this.currentIndex - 1;
        this.getSetValues();
    }
    getSetValues() {
        this.changeWeight = true;
        const current = this.ArrayForm.controls[this.currentIndex].value;
        const prev = this.ArrayForm.controls[this.prevIndex].value;
        this.reWeight(current, prev);
        const controlInfo = this.arrChangesValues(current, prev);
        this.changeCurrentWeight(controlInfo);
        this.umailsChanges();
    }

    reWeight(current, prev) {
        const curWeight = current.weigth;
        const prevWeight = prev.weigth;
        current.weigth = prevWeight;
        prev.weigth = curWeight;
    }

    umailsChanges () {
        if (this.currentIndex < this.prevIndex) {
            const current = this.umailsInfo.splice(this.currentIndex, 1, ...this.umailsInfo.splice(this.prevIndex, 1));
            this.umailsInfo.splice(this.prevIndex, 0, ...current);
        } else {
            const current = this.umailsInfo.splice(this.prevIndex, 1, ...this.umailsInfo.splice(this.currentIndex, 1));
            this.umailsInfo.splice(this.currentIndex, 0, ...current);
        }
    }

    arrChangesValues(current, prev): Array<Array<any>> {
        const T = [[], []];
        let CurrentParams = {};
        let PrevParams = {};
        const params = this.constParams();
        const length = this.constParams().length;
        for (let i = 0; i < length; i += 1) {
            CurrentParams[params[i]] = current[params[i]];
            PrevParams[params[i]] = prev[params[i]];
            T[0].push(CurrentParams);
            T[1].push(PrevParams);
            PrevParams = {};
            CurrentParams = {};
        }
        return T;
    }
    changeCurrentWeight(controlsInfo) {
        const countArray = controlsInfo[0].length - 1;
        for (let i = 0; i <= countArray; i += 1) {
            if (i !== countArray) {
                this.myForm.get('groupForm')
                    .get(String(this.currentIndex))
                    .patchValue(controlsInfo[1][i], { emitEvent: false });
                this.myForm.get('groupForm')
                    .get(String(this.prevIndex))
                    .patchValue(controlsInfo[0][i], { emitEvent: false });
            } else {
                this.myForm.get('groupForm')
                    .get(String(this.prevIndex))
                    .patchValue(controlsInfo[0][i], { emitEvent: false });
                this.myForm.get('groupForm')
                    .get(String(this.currentIndex))
                    .patchValue(controlsInfo[1][i]);
            }
        }
    }

    constParams(): Array<string> {
        return ['email', 'checkbox', 'params', 'change', 'newField', 'weigth'];
    }

    checkEmailCurrentfields(email: string): boolean {
        if (this.umailsInfo.length > 0) {
            return this.umailsInfo.some(element => {
                return element.EMAIL === email;
            });
        }
        return false;
    }

    get getaccess() {
        return this.umailsInfo.length <= 0 ? true : false;
    }

    sortArray(array: NTFY_USER_EMAIL[]) {
        array.sort(function (a, b) {
            return a.WEIGHT - b.WEIGHT;
        });
    }
    edit($event) {
        this.flagEdit = $event;
        this.redactEmail.emit(this.flagEdit);
        this.editMode();
    }
    default(event?) {
        return;
    }

    closeModal() {
        this.updateEmail = false;
        this.modalRef.hide();
    }

    private cathError(e) {
        if (e instanceof RestError && (e.code === 434 || e.code === 0)) {
            return undefined;
        } else {
            const errMessage = e.message ? e.message : e;
            this._msgSrv.addNewMessage({
                type: 'danger',
                title: 'Ошибка обработки. Ответ сервера:',
                msg: errMessage
            });
            return null;
        }
    }
    private editMode() {
        if (this.flagEdit) {
            this.myForm.enable({ emitEvent: false });
        } else {
            this.myForm.disable({ emitEvent: false });
        }
    }
    private _pushState() {
        this._userServices.setChangeState({ isChange: !this.statusBtnSub });
    }

}
