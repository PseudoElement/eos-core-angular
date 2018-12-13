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
            this.formChanges$ = this.form.valueChanges.subscribe((formChanges) => {
                if (this.data.rec.POST_H * 1 !== 1 && !this.data.cabinet) {
                    if (formChanges['rec.POST_H'] * 1 === 1) {
                        if (!this.bossWarning) {
                            this.bossWarning = true;
                            this._msgSrv.addNewMessage(INFO_PERSONE_DONT_HAVE_CABINET);
                        }
                    } else {
                        this.bossWarning = false;
                    }
                }
            });
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
                if (res) {
                    Object.keys(res).forEach((key) => {
                        if (key !== 'PRINT_DEPARTMENT') {
                            this.setValue('printInfo.' + key, res[key]);
                        }
                    });
                }
            });

        this.setValue('printInfo.PRINT_DEPARTMENT', this.dictSrv.currentNode.parent.data.rec['CLASSIF_NAME']);
    }
}
