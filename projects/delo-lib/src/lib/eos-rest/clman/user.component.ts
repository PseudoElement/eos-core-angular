import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { USER_CL } from '../interfaces/structures';
// import { ALL_ROWS } from '../core/consts';
import { PipRX } from '../services/pipRX.service';

@Component({
    selector: 'eos-rest-user',
    templateUrl: './user.component.html'
})
export class UserRestComponent implements OnInit {
    items: USER_CL[] = [];
    currentItem: USER_CL;
    userPhotoUrl: SafeUrl;

    // errorMessage: string;
    constructor(
        private pip: PipRX,
        private _sanitizer: DomSanitizer
    ) {
        this.userPhotoUrl = this._sanitizeUrl('/assets/images/no-user.png');
    }
    //
    ngOnInit() {

    }

    getData() {
        this.pip.read<USER_CL>({
            // - Загрузка всех строк
            // USER_CL: ALL_ROWS, orderby: 'DUE', top: 20

            // - Загрузка по известным первичным ключам
            // DELIVERY_CL: [1, 3775, 3776, 3777, 3778, 3779, 1021138, 1021139,
            // 1032930, 1032965, 1032932, 1033581, 1033582, 1037443, 1037634,
            //     1037681, 1037682, 1037683, 1037684, 1037685]

            // - поиск по критериям
            USER_CL: PipRX.criteries({ LAYER: '0:2', IS_NODE: '0' })
            , orderby: 'DUE', top: 200
        }).then(r => {
            // console.log('----->>>>>>>');
            // console.log(r);
            this.items = r;
            /* sanitize image url */
            // this.userPhotoUrl = this._sanitizeUrl(r.user_photo);
        });


    }
    onSelect(cur: USER_CL): void {
        this.currentItem = cur;
    }

    onAdd() {
        /*
        const tisn = this.pip.sequenceMap.GetTempISN();
        const tmp = this.pip.prepareAdded<USER_CL>( {
            DUE: this.currentItem.DUE + tisn + '.',
            ISN_NODE: tisn,
            CLASSIF_NAME: 'Добавляем?',
             RUBRIC_CODE: 'уникальный!'
        }, 'USER_CL');
        this.currentItem = tmp;
        */
    }

    onSave() {
        /*
        const chl = Utils.changeList([this.currentItem]);
        this.pip.batch(chl, '').subscribe((r) => {
            alert(this.pip.sequenceMap.GetFixed(this.currentItem.DUE) + ' ' + this.pip.sequenceMap.GetFixed(this.currentItem.ISN_NODE));
        });
        */
    }

    private _sanitizeUrl(url: string): SafeUrl {
        return this._sanitizer.bypassSecurityTrustUrl(url);
    }
}

