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
import { BUTTON_RESULT_OK, CONFIRM_DEPARTMENTS_DATES_FIX, BUTTON_RESULT_YES } from 'app/consts/confirms.const';


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
    readonly fieldGroups: string[] = ['Основные данные', 'Дополнительные сведения'];

    photo: any;
    isStampEnable = Features.cfg.departments.stamp;

    private bossWarning: boolean;

    constructor(
        private injector: Injector,
        private _msgSrv: EosMessageService,
        private _confirmSrv: ConfirmWindowService,
    ) {
        super(injector);
    }

    get hasStamp(): boolean {
        return this.getValue('rec.ISN_STAMP');
    }

    ngOnInit () {
        // super.ngOnInit();
        // if (this.isCBBase && this.isNewRecord) {
        //     this.inputs['rec.START_DATE'].required = true;
        //     this.form.controls['rec.START_DATE'].setValidators(
        //         [this.form.controls['rec.START_DATE'].validator, Validators.required]
        //     );
        // }
        // this.data

        if (!this.isNewRecord && this.editMode) {
            const changes = [];
            const inObj: any = {};
            let fio;
            if (this.data.rec['SURNAME'] && !this.data.printInfo['NAME'] && !this.data.printInfo['SURNAME'] && !this.data.printInfo['PATRON'] ) {

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

            if (this.data.rec['DUTY'] && !this.data.printInfo['DUTY_RP'] && !this.data.printInfo['DUTY_DP'] && !this.data.printInfo['DUTY_VP'] ) {
                inObj.dep = true;
                changes.push('Дополнительные сведения (склонение должности)');
            }

            if (!EosUtils.isObjEmpty(inObj)) {
                this.fillDeclineFields(inObj, fio);
                if (inObj.gender && this.getValue('printInfo.GENDER') !== null) {
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


        }

        this.prevValues = this.makePrevValues(this.data);
        this.tabsToArray(this.fieldGroups);
        if (this.form) {
            this.unsubscribe();
            this.formChanges$ = this.form.valueChanges.subscribe((formChanges) => {
                this.updateForm(formChanges);
                this.updateValidTabs();
            });
        }

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


    }


    stampClick() {
        this.tooltipsHide();
        const isn = this.data.rec['ISN_STAMP'];
        const _modalSrv = this.injector.get(BsModalService);
        const modalWindow = _modalSrv.show(StampBlobFormComponent, { class: 'department-stamp-form' });
        (<StampBlobFormComponent>modalWindow.content).init(isn);

        if (modalWindow) {
            const hideWaitSubscr = _modalSrv.onHide.subscribe( () => {
                this.tooltipsRestore();
                hideWaitSubscr.unsubscribe();
            });

            const subscription = (<StampBlobFormComponent>modalWindow.content).onClose.subscribe((savedisn) => {
                subscription.unsubscribe();
                this.setValue('rec.ISN_STAMP', savedisn);
            });
        }
    }

    makePrevValues (data: any) {
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
        let isNeedCorrectStart = false;
        let isNeedCorrectEnd = false;
        if (this.dictSrv.currentNode.parent.data.rec['START_DATE']) {
            if (!this.data.rec['START_DATE']) {
                isNeedCorrectStart = true;
            } else {
                const sd1 = new Date(this.data.rec['START_DATE']);
                const sd2 = new Date(this.dictSrv.currentNode.parent.data.rec['START_DATE']);
                if (sd1 < sd2) {
                    isNeedCorrectStart = true;
                }
            }
        }
        if (this.dictSrv.currentNode.parent.data.rec['END_DATE']) {
            if (!this.data.rec['END_DATE']) {
                isNeedCorrectEnd = true;
            } else {
                const sd1 = new Date(this.data.rec['END_DATE']);
                const sd2 = new Date(this.dictSrv.currentNode.parent.data.rec['END_DATE']);
                if (sd1 > sd2) {
                    isNeedCorrectEnd = true;
                }
            }
        }

        if (isNeedCorrectEnd || isNeedCorrectStart) {
            return this._confirmSrv.confirm2(CONFIRM_DEPARTMENTS_DATES_FIX).then((button) => {
                if (button.result === BUTTON_RESULT_YES) {
                    if (isNeedCorrectStart) {
                        this.setValue('rec.START_DATE', new Date(this.dictSrv.currentNode.parent.data.rec['START_DATE']));
                        this.data.rec['START_DATE'] = this.dictSrv.currentNode.parent.data.rec['START_DATE'];

                    }
                    if (isNeedCorrectEnd) {
                        this.setValue('rec.END_DATE', new Date(this.dictSrv.currentNode.parent.data.rec['END_DATE']));
                        this.data.rec['START_DATE'] = this.dictSrv.currentNode.parent.data.rec['END_DATE'];
                    }
                    return true;
                }
                return false;
            });
        }
        return Promise.resolve(true);
    }

    public fillDeclineFields(opt: IToDeclineFields, fio: string = null): void {
        const gender = this.getValue('printInfo.GENDER');
        const field: FieldsDecline = {
            DUTY: this.getValue('rec.DUTY') || '',
            NAME: this.getValue('printInfo.NAME') || '',
            PATRON: this.getValue('printInfo.PATRON') || '',
            SURNAME: this.getValue('printInfo.SURNAME') || '',
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
                                (opt.adv && (key === 'PRINT_DEPARTMENT' || key === 'PRINT_DUTY' ))

                            ) {
                                this.setValue('printInfo.' + key, res[key]);
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
                        this.setValue('printInfo.' + key, data[key]);
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
        if (/*(this.data.rec.POST_H * 1 === 1) &&*/ !(this.data.cabinet && Object.keys(this.data.cabinet).length !== 0)) {
            if (formChanges['rec.POST_H'] * 1 === 1) {
                if (!this.bossWarning) {
                    this.bossWarning = true;
                    this._msgSrv.addNewMessage(INFO_PERSONE_DONT_HAVE_CABINET);
                }
            } else {
                this.bossWarning = false;
            }
        }
        let setSurname = null;
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
            this.fillDeclineFields({fio: true});

        }

        if (this.prevValues['printInfo.GENDER'] !== formChanges['printInfo.GENDER']) {
            this.prevValues['printInfo.GENDER'] = formChanges['printInfo.GENDER'];
            this.fillDeclineFields({fio: true});
        }


        if (setSurname) {
            this.setValue('rec.SURNAME', setSurname);
        } else if (this.prevValues['rec.SURNAME'] !== formChanges['rec.SURNAME']) {
            this.prevValues['rec.SURNAME'] = formChanges['rec.SURNAME'];
            let fio: string = this.prevValues['rec.SURNAME'];
            if (fio) { fio = fio.replace(/\./g, ' '); }

            this.fillDeclineFields({fio: true}, fio);
        }

        this.prevValues = formChanges;

    }
}
