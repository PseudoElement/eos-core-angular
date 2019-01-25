import { RussianName, RussianNameProcessor } from './../utils/Declination';
import { Component, Injector, OnChanges } from '@angular/core';
import { BaseCardEditComponent } from 'eos-dictionaries/card-views/base-card-edit.component';
import { FieldsDecline } from 'eos-dictionaries/interfaces/fields-decline.inerface';
import { IImage } from '../interfaces/image.interface';
import { DEFAULT_PHOTO } from 'eos-dictionaries/consts/common';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { UPLOAD_IMG_FALLED, INFO_PERSONE_DONT_HAVE_CABINET } from '../consts/messages.consts';

@Component({
    selector: 'eos-departments-card-edit-person',
    templateUrl: 'departments-card-edit-person.component.html',
})
export class DepartmentsCardEditPersonComponent extends BaseCardEditComponent implements OnChanges {
    readonly fieldGroups: string[] = ['Основные данные', 'Контактная информация', 'Дополнительные сведения'];

    photo = DEFAULT_PHOTO;

    private currentNodeId: string;
    private bossWarning: boolean;

    constructor(
        injector: Injector,
        private _msgSrv: EosMessageService
    ) {
        super(injector);
        this.currentNodeId = this.nodeId;
    }

    ngOnChanges() {
        if (this.currentNodeId !== this.nodeId) { // todo: re-factor condition
            this.currTab = 0;
        }
        if (this.data.photo && this.data.photo.url) {
            this.photo = this.data.photo.url;
        } else {
            this.photo = DEFAULT_PHOTO;
        }
        if (this.form) {
            this.unsubscribe();
            this.formChanges$ = this.form.valueChanges.subscribe((formChanges) => this.updateForm(formChanges));
        }
    }

    newImage(img: IImage) {
        this.photo = img.url;
        this.dictSrv.uploadImg(img)
            .then((photoId: number) => {
                if (photoId) {
                    this.setValue('rec.ISN_PHOTO', photoId['ID']);
                } else {
                    this.photo = DEFAULT_PHOTO;
                    this._msgSrv.addNewMessage(UPLOAD_IMG_FALLED);
                }
            });
    }

    removePhoto() {
        this.setValue('rec.ISN_PHOTO', null);
        this.photo = DEFAULT_PHOTO;
    }

    public fillDeclineFields(): void {
        const field: FieldsDecline = {
            DUTY: this.getValue('rec.DUTY') || '',
            GENDER: this.getValue('printInfo.GENDER') * 1,
            NAME: this.getValue('printInfo.NAME') || '',
            PATRON: this.getValue('printInfo.PATRON') || '',
            SURNAME: this.getValue('printInfo.SURNAME') || '',
            // PRINT_SURNAME_DP: 'test PRINT SURNAME_DP'
        };

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

                // const rn = new RussianName('Петрова Зоя Сергеевна');
                const rn = new RussianName(res['SURNAME'], res['NAME'], res['PATRON'],
                    res['gender'] ? RussianNameProcessor.sexM : RussianNameProcessor.sexF
                    );
                res.NAME_DP = rn.firstName(rn.gcaseDat);
                res.NAME_PP = rn.firstName(rn.gcasePred);
                res.NAME_RP = rn.firstName(rn.gcaseRod);
                res.NAME_TP = rn.firstName(rn.gcaseTvor);
                res.NAME_VP = rn.firstName(rn.gcaseVin);
                res.PATRON_DP = rn.middleName(rn.gcaseDat);
                res.PATRON_PP = rn.middleName(rn.gcasePred);
                res.PATRON_RP = rn.middleName(rn.gcaseRod);
                res.PATRON_TP = rn.middleName(rn.gcaseTvor);
                res.PATRON_VP = rn.middleName(rn.gcaseVin);
                res.SURNAME_DP = rn.lastName(rn.gcaseDat);
                res.SURNAME_PP = rn.lastName(rn.gcasePred);
                res.SURNAME_RP = rn.lastName(rn.gcaseRod);
                res.SURNAME_TP = rn.lastName(rn.gcaseTvor);
                res.SURNAME_VP = rn.lastName(rn.gcaseVin);

                res.PRINT_SURNAME = this._genIOFamily(rn, rn.gcaseIm);
                res.PRINT_SURNAME_DP = this._genFamilyIO(rn, rn.gcaseDat);
                res.PRINT_SURNAME_RP = this._genFamilyIO(rn, rn.gcaseRod);
                if (res) {
                    Object.keys(res).forEach((key) => {
                        if (key !== 'PRINT_DEPARTMENT') {
                            this.setValue('printInfo.' + key, res[key]);
                        }
                    });
                }
            });

        if (this.dictSrv.currentNode) {
            this.setValue('printInfo.PRINT_DEPARTMENT', this.dictSrv.currentNode.parent.data.rec['CLASSIF_NAME']);
        } else {
            this.setValue('printInfo.PRINT_DEPARTMENT', this.dictSrv.treeNodeTitle);
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
    }
}
