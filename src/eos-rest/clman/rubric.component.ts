﻿import { Component, OnInit, Input } from '@angular/core';

import { IRubricCl } from '../interfaces/interfaces';
import { ALL_ROWS } from '../core/consts';
import { PipRX } from '../services/pipRX.service';
import { RubricService } from '../services/rubric.service';
import { Utils } from '../core/utils';
//
import { AuthService } from '../services/auth.service';



@Component({
    selector: 'eos-rubric',
    templateUrl: './rubric.component.html'
})
export class RubricComponent implements OnInit {
    items: IRubricCl[] = [];
    currentItem: IRubricCl;
    // errorMessage: string;
    constructor(private pip: PipRX, private _auth: AuthService) { }
    //
    ngOnInit() {

    }

    getData() {
        this.pip.read<IRubricCl>({
            // - Загрузка всех строк
            RUBRIC_CL: ALL_ROWS, orderby: 'DUE', top: 20

            // - Загрузка по известным первичным ключам
            // DELIVERY_CL: [1, 3775, 3776, 3777, 3778, 3779, 1021138, 1021139,
            // 1032930, 1032965, 1032932, 1033581, 1033582, 1037443, 1037634,
            //     1037681, 1037682, 1037683, 1037684, 1037685]

            // - поиск по критериям
            // DELIVERY_CL: Utils.criteries({ CLASSIF_NAME: 'Поч%' })
        }).subscribe(r => {
            console.log('----->>>>>>>');
            console.log(r);
            this.items = r;
        });

    }
    onSelect(cur: IRubricCl): void {
        this.currentItem = cur;
    }
    login() {
        this._auth.login('tver', 'tver')
            .then((resp) => {
                console.log('login resp', resp);
            }).catch((err) => {
                console.error('login error', err);
            });
    }

    onAdd() {
        const tisn = this.pip.sequenceMap.GetTempISN();
        const tmp = this.pip.prepareAdded<IRubricCl>( {
            DUE: this.currentItem.DUE + tisn + '.',
            ISN_NODE: tisn,
            CLASSIF_NAME: 'Добавляем?',
            RUBRIC_CODE: 'уникальный!'
        }, 'RUBRIC_CL');
        this.currentItem = tmp;
    }

    onSave() {
        const chl = Utils.changeList([this.currentItem]);
        this.pip.batch(chl, '').subscribe((r) => {
            alert(this.pip.sequenceMap.GetFixed(this.currentItem.DUE));
        });

    }
}

