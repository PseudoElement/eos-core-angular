import { RussianName, RussianNameProcessor } from './../utils/Declination';
import { Component, Injector, OnChanges, OnInit } from '@angular/core';
import { BaseCardEditComponent } from 'eos-dictionaries/card-views/base-card-edit.component';
import { FieldsDecline } from 'eos-dictionaries/interfaces/fields-decline.inerface';
import { IImage } from '../interfaces/image.interface';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { UPLOAD_IMG_FALLED, INFO_PERSONE_DONT_HAVE_CABINET } from '../consts/messages.consts';
import { Features } from 'eos-dictionaries/features/features-current.const';
import { BsModalService } from 'ngx-bootstrap';
import { StampBlobFormComponent } from 'eos-dictionaries/shablon-blob-form/stamp-blob-form.component';
import { EosUtils } from 'eos-common/core/utils';
import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';
import { IConfirmWindow2 } from 'eos-common/confirm-window/confirm-window2.component';
import { AbstractControl, Validators } from '@angular/forms';
// import { InputControlService } from 'eos-common/services/input-control.service';
import { BUTTON_RESULT_OK, CONFIRM_DEPARTMENTS_DATES_FIX, BUTTON_RESULT_YES } from 'app/consts/confirms.const';
import { CONFIRM_CHANGE_BOSS } from 'eos-dictionaries/consts/confirm.consts';
import { EosDepartmentsService } from 'eos-dictionaries/services/eos-department-service';
import { PipRX } from 'eos-rest';
import { OPEN_CLASSIF_DEPARTMENT } from 'eos-user-select/shered/consts/create-user.consts';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { REPLACE_REASONS } from 'eos-dictionaries/consts/dictionaries/department.consts';

interface IToDeclineFields {
    fio?: boolean;
    gender?: boolean;
    dep?: boolean;
    adv?: boolean;
    nomenative?: boolean;
}

@Component({
    selector: 'eos-departments-card-edit-person',
    templateUrl: 'departments-card-edit-person.component.html',
})
export class DepartmentsCardEditPersonComponent extends BaseCardEditComponent implements OnChanges, OnInit {
    // readonly fieldGroups: string[] = ['Основные данные', 'Дополнительные сведения', 'Отсутствие и замещение'];

    photo: any;
    isStampEnable = Features.cfg.departments.stamp;
    isShell: boolean = false;
    public hasLicenses: boolean = false;
    public fieldGroups: string[] = ['Основные данные', 'Дополнительные сведения'];

    private bossWarning: boolean;
    private _newDueReplace: string = null;
    private _tempReasonVal: string | number = REPLACE_REASONS[0].value;
    private _optionalTab = 'Отсутствие и замещение';

    constructor(
        private injector: Injector,
        private _msgSrv: EosMessageService,
        private _confirmSrv: ConfirmWindowService,
        private departMentService: EosDepartmentsService,
        private _apiSrv: PipRX,
        private _waitClassifSrv: WaitClassifService,
        //    private _intupControlSrv: InputControlService

    ) {
        super(injector);
    }

    get hasStamp(): boolean {
        return this.getValue('rec.ISN_STAMP');
    }
    get parentStart_Date() {
        const parent = this.dictSrv.currentNode.parent;
        if (parent && parent.data.rec.START_DATE) {
            return new Date(parent.data.rec.START_DATE);
        }
    }
    get parentEnd_Date() {
        const parent = this.dictSrv.currentNode.parent;
        if (parent && parent.data.rec.END_DATE) {
            return new Date(parent.data.rec.END_DATE);
        }
    }
    get isHistoryUpdated() {
        return !this.data.replace['REASON'] ||
        !this.data.replace['START_DATE'] || !this.data.replace['END_DATE'];
    }

    ngOnInit() {
        // super.ngOnInit();
        // if (this.isCBBase && this.isNewRecord) {
        //     this.inputs['rec.START_DATE'].required = true;
        //     this.form.controls['rec.START_DATE'].setValidators(
        //         [this.form.controls['rec.START_DATE'].validator, Validators.required]
        //     );
        // }
        // this.data
        this._checkLicense();

        if (!this.isNewRecord && this.editMode) {
            const changes = [];
            const inObj: any = {};
            let fio;
            if (this.data.rec['SURNAME'] && !this.data.printInfo['NAME'] && !this.data.printInfo['SURNAME'] && !this.data.printInfo['PATRON']) {

                fio = this.data.rec['SURNAME'].replace(/\./g, ' ');
                changes.push('Фамилия, имя, отчество');
                inObj.fio = true;

                changes.push('Дополнительные сведения (склонения ФИО)');
                inObj.nomenative = true;
            } else {
                fio = this.data.printInfo['SURNAME'] + ' ' + this.data.printInfo['NAME'] + ' ' + this.data.printInfo['PATRON'];
            }

            if (this.data.printInfo['GENDER'] === null) {
                inObj.gender = true;
            }

            if (this.data.rec['DUTY'] && !this.data.printInfo['DUTY_RP'] && !this.data.printInfo['DUTY_DP'] && !this.data.printInfo['DUTY_VP']) {
                inObj.dep = true;
                changes.push('Дополнительные сведения (склонение должности)');
            }

            if (!EosUtils.isObjEmpty(inObj)) {
                this.fillDeclineFields(inObj, fio);
                if (inObj.gender && this.getValue('printInfo.GENDER') !== null && changes.length) {
                    changes.push('Пол');
                }
                if (changes.length) {
                    const warn: IConfirmWindow2 = {
                        title: 'Ведение справочников',
                        body: 'Новые поля карточки ДЛ:',
                        bodyList: changes,
                        bodyAfterList: 'Были заполнены автоматически. Проверьте и сохраните эти данные в БД',
                        buttons: [{ title: 'OK', result: BUTTON_RESULT_OK, isDefault: true }],
                    };
                    setTimeout(() => {
                        this._confirmSrv.confirm2(warn);
                    }, 10);
                }
            }
            this._newDueReplace = this.data.replace['DUE_REPLACE'];
        }

        this.prevValues = this.makePrevValues(this.data);
        this.tabsToArray(this.fieldGroups);
        if (this.form) {
            this.updateValidators();
            this.unsubscribe();
            this.formChanges$ = this.form.valueChanges.subscribe((formChanges) => {
                this.updateForm(formChanges);
                this.updateValidTabs();
            });
        }

    }
    inputPersonElem($event, flag?) {
        if (+$event === 13 || flag) {
            if (this.form.controls['rec.SURNAME'].value && !this.form.controls['printInfo.PATRON'].value && !this.form.controls['printInfo.SURNAME'].value && !this.form.controls['printInfo.NAME'].value) {
                const surnameFIO = this.form.controls['rec.SURNAME'].value;
                const fio = this.form.controls['rec.SURNAME'].value.trim().replace(/\s{2,}/g, ' ');
                let patron, name, surname;
                if (fio.length > 6 && fio.lastIndexOf('.') === fio.length - 1 && fio[fio.length - 3] === '.') {
                    patron = fio.substr(fio.length - 2, 1);
                    this.form.controls['printInfo.PATRON'].setValue(patron);
                }
                if (fio.length > 2  && fio.lastIndexOf('.') === fio.indexOf('.') && fio[fio.length - 1] === '.' ) {
                    name = fio.substr(fio.length - 2, 1);
                    this.form.controls['printInfo.NAME'].setValue(name);
                } else if (fio.length > 2 && patron && fio.lastIndexOf('.') === fio.length - 1 && fio[fio.length - 3] === '.' && this.checkSpaceStr(surnameFIO, fio, patron) ) {
                    name = fio.substr(fio.length - 4, 1);
                    this.form.controls['printInfo.NAME'].setValue(name);
                }

                if (!patron && name) {
                    surname = fio.substring(0, fio.length - 2);
                } else if (patron && name) {
                    surname = fio.substring(0, fio.length - 4);
                } else {
                    surname = fio;
                }
                this.form.controls['printInfo.SURNAME'].setValue(surname);
            }
        }
    }
    checkSpaceStr(str: string, strTrim: string, patron: string): boolean {
        if (patron === strTrim.substr(strTrim.length - 4, 1)) {
            str = str.substring(0, str.length - 2);
        }
        return str[(str.lastIndexOf(strTrim.substr(strTrim.length - 4, 1)) - 1)] === ' ';
    }
    ngOnChanges() {
        if (this.isNewRecord) {
            this.currTab = 0;
        }
        if (this.data.photo && this.data.photo.url) {
            this.photo = this.data.photo.url;
        } else {
            this.photo = null;
        }
        this._setReplaceReason();
    }
    updateValidators() {
        const extensibleValidators = this.form.controls['rec.START_DATE'].validator;
        this.form.controls['rec.START_DATE'].setValidators(
            Validators.compose([extensibleValidators, this.validatorsStartToEnd('rec.END_DATE')]));
        const extensibleValidators1 = this.form.controls['rec.END_DATE'].validator;
        this.form.controls['rec.END_DATE'].setValidators(Validators.compose([extensibleValidators1, this.validatorsStartToEnd('rec.START_DATE')]));
        this.form.updateValueAndValidity();
    }
    // dateEmptyValidator(): ValidatorFn {
    //     return (control: AbstractControl): { [key: string]: any } => {
    //         const value = control.value;
    //         if (!value) {
    //             if (this.parentStart_Date) {
    //                 const errMessage = 'Дата должна быть больше ' + EosUtils.dateToStringValue(new Date(this.parentStart_Date));
    //                 control.setErrors({ 'dateCompare': errMessage });
    //                 return { 'dateCompare': errMessage };
    //             }
    //         }
    //         return null;
    //     };
    // }

    // dateCompareValidator(): ValidatorFn {
    //     return (control: AbstractControl): { [errKey: string]: any } => {
    //         let valid = true;
    //         let errMessage: string = null;
    //         const value = control.value;
    //         if (value && value instanceof Date) {
    //             if (this.parentStart_Date && this.parentStart_Date instanceof Date) {
    //                 if (value.getTime() < this.parentStart_Date.getTime()) {
    //                     valid = false;
    //                     errMessage = 'Дата должна быть больше ' + EosUtils.dateToStringValue(this.parentStart_Date);
    //                 }
    //             }
    //             if (this.parentEnd_Date && this.parentEnd_Date instanceof Date) {
    //                 if (value.getTime() > this.parentEnd_Date.getTime()) {
    //                     valid = false;
    //                     errMessage = 'Дата должна быть меньше ' + EosUtils.dateToStringValue(this.parentEnd_Date);
    //                 }
    //             }
    //         }
    //         return (valid ? null : { dateCompare: errMessage });
    //     };
    // }
    validatorsStartToEnd(field: string) {
        return (control: AbstractControl): { [errKey: string]: any } => {
            let valid = true;
            const  errMessage = `Неверно заданны даты начала/окончания действия`;
            const value = control.value;
            const comparedField = this.getValue(field);
            if (value && value instanceof Date) {
                switch (field) {
                    case 'rec.START_DATE':
                    if (comparedField && comparedField instanceof Date) {
                        if (value.getTime() < comparedField.getTime()) {
                            valid = false;
                        }
                    }
                    break;
                    case 'rec.END_DATE':
                        if (comparedField && comparedField instanceof Date) {
                            if (value.getTime() > comparedField.getTime()) {
                                valid = false;
                            }
                        }
                        break;
                }
            }
            return (valid ? null : { dateCompare: errMessage });
        };
    }

stampClick() {
    this.tooltipsHide();
    const isn = this.data.rec['ISN_STAMP'];
    const _modalSrv = this.injector.get(BsModalService);
    const modalWindow = _modalSrv.show(StampBlobFormComponent, { class: 'department-stamp-form' });
    (<StampBlobFormComponent>modalWindow.content).init(isn);

    if (modalWindow) {
        const hideWaitSubscr = _modalSrv.onHide.subscribe(() => {
            this.tooltipsRestore();
            hideWaitSubscr.unsubscribe();
        });

        const subscription = (<StampBlobFormComponent>modalWindow.content).onClose.subscribe((savedisn) => {
            subscription.unsubscribe();
            this.setValue('rec.ISN_STAMP', savedisn);
        });
    }
}

makePrevValues(data: any) {
    const res = [];
    for (const key1 in data) {
        if (data.hasOwnProperty(key1)) {
            const element1 = data[key1];

            for (const key2 in element1) {
                if (element1.hasOwnProperty(key2)) {
                    const element2 = element1[key2];
                    res[key1 + '.' + key2] = element2;
                }
            }


        }
    }
    return res;
}
onBeforeModalPhoto($event) {
    this.tooltipsHide();
}
onAfterModalPhoto($event) {
    this.tooltipsRestore();
}
newImage(img: IImage) {
    this.photo = img.url;
    this.dictSrv.uploadImg(img)
        .then((photoId: number) => {
            if (photoId) {
                this.setValue('rec.ISN_PHOTO', photoId['ID']);
            } else {
                this.photo = null;
                this._msgSrv.addNewMessage(UPLOAD_IMG_FALLED);
            }
        });
}

removePhoto() {
    this.setValue('rec.ISN_PHOTO', null);
    this.photo = null;
}

formatSurname(fam: string, name: string, patron: string): string {
    let res = '';
    fam = fam ? fam.trim() : '';
    if (fam) { fam = fam.replace(/./g, (c, i) => i === 0 ? c.toUpperCase() : c); }
    name = name ? name.trim() : '';
    patron = patron ? patron.trim() : '';

    res = (fam ? fam : '') + (fam && (name || patron) ? ' ' : '') +
        (name ? name[0].toUpperCase() + '.' : '') +
        (patron ? patron[0].toUpperCase() + '.' : '');
    return res;
}


    public confirmSave(): Promise<boolean> {
        // const parent = this.dictSrv.treeNode || this.dictSrv.currentNode.parent;
        const parent = this.dictSrv.currentNode && this.dictSrv.currentNode.parent || this.dictSrv.treeNode;
        let isNeedCorrectStart = false;
        let isNeedCorrectEnd = false;
        if (!this.data.replace['DUE']) {
            this.data.replace['DUE'] = this.data.rec['DUE'];
        }
        this.data.replace['DUE_REPLACE'] = this._newDueReplace;
        if (parent.data.rec['START_DATE']) {
            if (!this.data.rec['START_DATE']) {
                isNeedCorrectStart = true;
            } else {
                const sd1 = new Date(this.data.rec['START_DATE']);
                const sd2 = new Date(parent.data.rec['START_DATE']);
                if (sd1 < sd2) {
                    isNeedCorrectStart = true;
                }
            }
        }
        if (parent.data.rec['END_DATE']) {
            if (!this.data.rec['END_DATE']) {
                isNeedCorrectEnd = true;
            } else {
                const sd1 = new Date(this.data.rec['END_DATE']);
                const sd2 = new Date(parent.data.rec['END_DATE']);
                if (sd1 > sd2) {
                    isNeedCorrectEnd = true;
                }
            }
        }

        if (isNeedCorrectEnd || isNeedCorrectStart) {
            return this._confirmSrv.confirm2(CONFIRM_DEPARTMENTS_DATES_FIX).then((button) => {
                if (button.result === BUTTON_RESULT_YES) {
                    if (isNeedCorrectStart) {
                        this.setValue('rec.START_DATE', new Date(parent.data.rec['START_DATE']));
                        this.data.rec['START_DATE'] = parent.data.rec['START_DATE'];

                    }
                    if (isNeedCorrectEnd) {
                        this.setValue('rec.END_DATE', new Date(parent.data.rec['END_DATE']));
                        this.data.rec['END_DATE'] = parent.data.rec['END_DATE'];
                    }
                    return true;
                }
                return false;
            });
        }   else {
            if (this.data.rec.IS_NODE) {
                this.departMentService.addDuty(this.data.rec.DUTY);
                this.departMentService.addFullname(this.data.rec.FULLNAME);
                if (1 * this.data.rec.POST_H === 1) {
                    // tslint:disable-next-line: no-shadowed-variable
                    // if (this._treeNode && ((!this.data.rec.PARENT_DUE) || (this._treeNode.id === this.data.rec.PARENT_DUE))) {
                    //     parent = this._treeNode;
                    // }
                    return this.dictSrv.currentDictionary.getBoss(this.data, parent)
                        .then((boss) => {
                            if (boss && boss.id !== this.data.rec.DUE) {
                                const changeBoss = Object.assign({}, CONFIRM_CHANGE_BOSS);
                                const CLASSIF_NAME = this.data.rec['SURNAME'] + ' - ' + this.data.rec['DUTY'];
                                changeBoss.body = changeBoss.body.replace('{{persone}}', boss.data.rec['CLASSIF_NAME']);
                                changeBoss.body = changeBoss.body.replace('{{newPersone}}', CLASSIF_NAME);
                                return this._confirmSrv.confirm(changeBoss)
                                    .then((confirm: boolean) => {
                                        if (confirm) {
                                            boss.data.rec['POST_H'] = 0;
                                            return this._apiSrv.batch([{
                                                method: 'MERGE',
                                                requestUri: `DEPARTMENT('${boss.data.rec.DUE}')`,
                                                data: {
                                                    POST_H: 0
                                                }
                                            }], '').then(() => {
                                                return true;
                                            });
                                        } else {
                                            //    this.data.rec['POST_H'] = 0;
                                            return false;
                                        }
                                    });
                            }   else {
                                return true;
                            }
                        });
                }
            } else {
                Promise.resolve(true);
            }
        }
        return Promise.resolve(true);
    }

    public selectDL(status: boolean) {
        if (status) {
            this._selectDL();
        }
    }

    public deleteDL() {
        if (this._newDueReplace) {
            this.form.controls['replace.DUE_REPLACE_NAME'].patchValue('');
            this._newDueReplace = null;
        }
    }

    public clearReplaceFields() {
        if (this.form) {
            const defaultReason = REPLACE_REASONS[0].value;
            this.form.controls['replace.START_DATE'].patchValue(null);
            this.form.controls['replace.END_DATE'].patchValue(null);
            this.form.controls['replace.REASON'].patchValue(defaultReason);
            this.deleteDL();
        }
    }

    /**
     * override 'setTab' method
     * ADD change REASON input value from 'null' to '0'
     * if edit mode is true
     * @param {i: number} tab number
     */
    public setTab(i: number) {
        this._fixInvaliddate(i);
        super.setTab(i);
        this._setReplaceReason();
    }

    public fillDeclineFields(opt: IToDeclineFields, fio: string = null): void {
    const gender = this.getValue('printInfo.GENDER');
    // нет смысла отсылать все поля если они больше чем максимальное число
    const dutyR = !this.getValue('rec.DUTY') || this.getValue('rec.DUTY').length > 260 ?  '' : this.getValue('rec.DUTY');
    const nameR = !this.getValue('printInfo.NAME') || this.getValue('printInfo.NAME').length > 70 ? '' : this.getValue('printInfo.NAME');
    const patronR = !this.getValue('printInfo.PATRON') || this.getValue('printInfo.PATRON').length > 70 ? '' : this.getValue('printInfo.PATRON');
    const surnameR = !this.getValue('printInfo.SURNAME') || this.getValue('printInfo.SURNAME').length > 70 ? '' : this.getValue('printInfo.SURNAME');
    const field: FieldsDecline = {
        DUTY: dutyR,
        NAME: nameR,
        PATRON: patronR,
        SURNAME: surnameR,
    };

    if (opt.dep || opt.adv) {
    if (gender !== null) {
        field['GENDER'] = gender;
    }

    this.dictSrv.inclineFields(field)
        .then(([res]: any) => {
            const name = res['NAME'];
            if (name && name.length === 1) {
                res['NAME_DP'] = name;
                res['NAME_PP'] = name;
                res['NAME_RP'] = name;
                res['NAME_TP'] = name;
                res['NAME_VP'] = name;
            }

            if (res) {
                Object.keys(res).forEach((key) => {
                    if (key !== 'PRINT_DEPARTMENT') {
                        if ((opt.dep && (key === 'DUTY_RP' || key === 'DUTY_DP' || key === 'DUTY_VP' || key === 'DEPARTMENT_RP')) ||
                            (opt.adv && (key === 'PRINT_DEPARTMENT' || key === 'PRINT_DUTY'))
                                ) {
                                    const updatedValue = res[key] && res[key].length > 255 ? res[key].substring(0, 255) : res[key];
                                    this.setValue('printInfo.' + key, updatedValue);
                                    this.setDirty('printInfo.' + key);
                                }
                   }
                });
            }
        });

    if (opt.adv) {
        if (this.dictSrv.currentNode) {
            this.setValue('printInfo.PRINT_DEPARTMENT', this.dictSrv.currentNode.parent.data.rec['CLASSIF_NAME']);
        } else {
            this.setValue('printInfo.PRINT_DEPARTMENT', this.dictSrv.treeNodeTitle);
        }
    }
}

if (opt.fio || opt.gender || opt.nomenative) {
    if (gender !== null) {
        field['GENDER'] = gender;
    }

    const data: any = Object.assign(field);
    // const rn = new RussianName('Петрова Зоя Сергеевна');
    if (data['SURNAME'] + data['NAME'] + data['PATRON'] === '') {
        const sn = this.getValue('rec.SURNAME');
        data['SURNAME'] = (sn || '').replace(/\./g, ' ');
    }
    let rn = null;
    if (fio === null) {
        rn = new RussianName(data['SURNAME'], data['NAME'], data['PATRON'],
            data['GENDER'] === 1 ? RussianNameProcessor.sexM :
                data['GENDER'] === 2 ? RussianNameProcessor.sexF :
                    null
        );
    } else {
        rn = new RussianName(fio, '', '',
            data['GENDER'] === 1 ? RussianNameProcessor.sexM :
                data['GENDER'] === 2 ? RussianNameProcessor.sexF :
                    null
        );
    }

    if (opt.gender) {
        data['GENDER'] = rn.sex === RussianNameProcessor.sexF ? 2 :
            rn.sex === RussianNameProcessor.sexM ? 1 : null;
    }

    if (opt.fio) {
        data.NAME_DP = rn.firstName(rn.gcaseDat);
        data.NAME_PP = rn.firstName(rn.gcasePred);
        data.NAME_RP = rn.firstName(rn.gcaseRod);
        data.NAME_TP = rn.firstName(rn.gcaseTvor);
        data.NAME_VP = rn.firstName(rn.gcaseVin);
        data.PATRON_DP = rn.middleName(rn.gcaseDat);
        data.PATRON_PP = rn.middleName(rn.gcasePred);
        data.PATRON_RP = rn.middleName(rn.gcaseRod);
        data.PATRON_TP = rn.middleName(rn.gcaseTvor);
        data.PATRON_VP = rn.middleName(rn.gcaseVin);
        data.SURNAME_DP = rn.lastName(rn.gcaseDat);
        data.SURNAME_PP = rn.lastName(rn.gcasePred);
        data.SURNAME_RP = rn.lastName(rn.gcaseRod);
        data.SURNAME_TP = rn.lastName(rn.gcaseTvor);
        data.SURNAME_VP = rn.lastName(rn.gcaseVin);

        data.PRINT_SURNAME = this._genIOFamily(rn, rn.gcaseIm);
        data.PRINT_SURNAME_DP = this._genFamilyIO(rn, rn.gcaseDat);
        data.PRINT_SURNAME_RP = this._genFamilyIO(rn, rn.gcaseRod);

        delete data.DUTY;

        delete data.SURNAME;
        delete data.NAME;
        delete data.PATRON;
    }

    if (opt.nomenative) {
        data.NAME = rn.firstName(rn.gcaseNom);
        data.SURNAME = rn.lastName(rn.gcaseNom);
        data.PATRON = rn.middleName(rn.gcaseNom);
    }
    if (data) {
        Object.keys(data).forEach((key) => {
            if (key !== 'PRINT_DEPARTMENT') {
                const updatedValue = data[key] && data[key].length > 64 ? data[key].substring(0, 64) : data[key];
                this.setValue('printInfo.' + key, updatedValue);
                this.setDirty('printInfo.' + key);
            }
        });
    }

}

    }
    private _genFamilyIO(rn: RussianName, gcase): string {
    let res = rn.lastName(gcase);

    const s1 = rn.firstName(gcase);
    const s2 = rn.middleName(gcase);
    if (s1 || s2) {
        res += ' ';
    }
    if (s1) {
        res += s1[0] + '.';
    }
    if (s2) {
        res += s2[0] + '.';
    }
    return res;
}

    private _genIOFamily(rn: RussianName, gcase): string {
    let res = '';
    let s = rn.firstName(gcase);
    if (s) {
        res += s[0] + '.';
    }
    s = rn.middleName(gcase);
    if (s) {
        res += s[0] + '.';
    }
    if (res.length > 1) {
        res += ' ';
    }

    res += rn.lastName(gcase);

    return res;
}

    private updateForm(formChanges: any) {
        let setSurname = null;
        if (this.prevValues['rec.DUTY'] !== formChanges['rec.DUTY']) {
            this.prevValues['rec.DUTY'] = formChanges['rec.DUTY'];
            this.fillDeclineFields({ dep: true });
        }
        if (this.prevValues['printInfo.NAME'] !== formChanges['printInfo.NAME'] ||
            this.prevValues['printInfo.SURNAME'] !== formChanges['printInfo.SURNAME'] ||
            this.prevValues['printInfo.PATRON'] !== formChanges['printInfo.PATRON']
        ) {
            this.prevValues['printInfo.NAME'] = formChanges['printInfo.NAME'];
            this.prevValues['printInfo.SURNAME'] = formChanges['printInfo.SURNAME'];
            this.prevValues['printInfo.PATRON'] = formChanges['printInfo.PATRON'];
            setSurname = this.formatSurname(formChanges['printInfo.SURNAME'],
                formChanges['printInfo.NAME'],
                formChanges['printInfo.PATRON']);
            this.fillDeclineFields({ fio: true });

        }
        if (setSurname) {
            this.setValue('rec.SURNAME', setSurname);
        } else if (this.prevValues['rec.SURNAME'] !== formChanges['rec.SURNAME']) {
            this.prevValues['rec.SURNAME'] = formChanges['rec.SURNAME'];
            let fio: string = this.prevValues['rec.SURNAME'];
            if (fio) { fio = fio.replace(/\./g, ' '); }

            this.fillDeclineFields({ fio: true }, fio);
        }
        if (/*(this.data.rec.POST_H * 1 === 1) &&*/ !(this.data.cabinet && Object.keys(this.data.cabinet).length !== 0)) {
            if (formChanges['rec.POST_H'] * 1 === 1) {
                if (!this.bossWarning) {
                    this.bossWarning = true;
                    this._msgSrv.addNewMessage(INFO_PERSONE_DONT_HAVE_CABINET);
                }
            } else {
                this.bossWarning = false;
            }
            if (this.prevValues['printInfo.GENDER'] !== formChanges['printInfo.GENDER']) {
                this.prevValues['printInfo.GENDER'] = formChanges['printInfo.GENDER'];
                this.fillDeclineFields({ fio: true });
            }
            this.prevValues = formChanges;
        }
    }

    private _selectDL() {
        this.isShell = true;
        OPEN_CLASSIF_DEPARTMENT.skipDeleted = true;
        this._waitClassifSrv.openClassif(OPEN_CLASSIF_DEPARTMENT)
            .then((due: string) => {
                if (!due) {
                    this.isShell = false;
                    throw new Error('Не выбран ДЛ!');
                } else if (due === this.data.rec['DUE']) {
                    this.isShell = false;
                    this._msgSrv.addNewMessage({
                        type: 'warning',
                        title: 'Предупреждение: ',
                        msg: 'Должностное лицо не может замещать само себя',
                    });
                    throw new Error('Должностное лицо не может замещать само себя');
                }
                this._apiSrv.read({
                    DEPARTMENT: {
                        criteries: { DUE: String(due) },
                    },
                })
                    .then(deps => {
                        if (!deps.length || !deps[0]['CLASSIF_NAME']) {
                            this.isShell = false;
                            throw new Error('Выбранный ДЛ не найден!');
                        }
                        const chosenDep = deps[0];
                        const limitDeps = this.appctx.CurrentUser.USER_TECH_List.filter(techItem => techItem['FUNC_NUM'] === 10);
                        let isAvailableDL = false;
                        let sortedDeps = limitDeps;

                        if (sortedDeps.length > 1) {
                            sortedDeps = sortedDeps.sort((techItemA, techItemB) => techItemB['DUE'].length - techItemA['DUE'].length);
                        }
                        const relatedDep = sortedDeps.find((techItem) => chosenDep['DUE'].indexOf(techItem['DUE']) !== -1);
                        isAvailableDL = relatedDep && relatedDep['ALLOWED'] === 1;
                        if (isAvailableDL) {
                            this._newDueReplace = due;
                            this.form.controls['replace.DUE_REPLACE_NAME'].patchValue(chosenDep['CLASSIF_NAME']);
                        } else {
                            this._msgSrv.addNewMessage({
                                type: 'warning',
                                title: 'Предупреждение: ',
                                msg: 'Должностное лицо не принадлежит доступным Подразделениям',
                            });
                        }
                        this.isShell = false;
                    });
            })
            .catch(error => {
                this.isShell = false;
                const msg = error && error.message ? error.message : 'Ошибка выбора ДЛ';
                console.error('error message: ', msg);
            });
    }

    private _setReplaceReason() {
        const controlVal = this.form.controls['replace.REASON'].value;
        const defaultVisibleReason = REPLACE_REASONS[1].value;

        if (this.editMode && this.currTab === 2 && !controlVal) {
            const reasonVal = this._tempReasonVal ? this._tempReasonVal : defaultVisibleReason;
            this.form.controls['replace.REASON'].setValue(reasonVal, { eventEmit: false });
        } else if (this.editMode && this.currTab !== 2 && controlVal) {
            const startVal = this.form.controls['replace.START_DATE'].value;
            const endVal = this.form.controls['replace.END_DATE'].value;
            const isDefaultReason = controlVal === defaultVisibleReason;

            if (!startVal && !endVal && isDefaultReason && !this._newDueReplace) {
                this._tempReasonVal = controlVal;
                this.form.controls['replace.REASON'].setValue(REPLACE_REASONS[0].value, { eventEmit: false });
            }
        }
    }

    private _checkLicense() {
        try {
            this.hasLicenses = this.appctx.SysParms['_more_json'].licensed.some(license => license === 39);
        } catch (error) {
            this.hasLicenses = false;
        }
        if (this.hasLicenses && this.fieldGroups.length < 3) {
            this.fieldGroups.push(this._optionalTab);
        }
    }
    private _fixInvaliddate(i: number) {
        if (i !== 0) {
            const stDate = this.form.controls['rec.START_DATE'].value;
            const endDate = this.form.controls['rec.END_DATE'].value;
            if (stDate && isNaN(stDate.getTime())) {
                this.form.controls['rec.START_DATE'].patchValue(null);
            }
            if (endDate && isNaN(endDate.getTime())) {
                this.form.controls['rec.END_DATE'].patchValue(null);
            }
        }
        if (i !== 2) {
            const stRepDate = this.form.controls['replace.START_DATE'].value;
            const endRepDate = this.form.controls['replace.END_DATE'].value;
            if (stRepDate && isNaN(stRepDate.getTime())) {
                this.form.controls['replace.START_DATE'].patchValue(null);
            }
            if (endRepDate && isNaN(endRepDate.getTime())) {
                this.form.controls['replace.END_DATE'].patchValue(null);
            }
        }
    }
}
