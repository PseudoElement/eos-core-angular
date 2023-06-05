import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CardRightSrv } from '../card-right.service';
import { CardRight } from './card.model';
import { USERCARD } from '../../../../eos-rest';
import { AppContext } from '../../../../eos-rest/services/appContext.service';
import { CardUpdate } from '../card-func-list.consts';

@Component({
    selector: 'eos-list-card-right',
    templateUrl: 'list-card.component.html'
})
export class ListCardRightComponent implements OnInit, OnDestroy {
    @Input() editMode: boolean;
    public isLoading: boolean = true;
    public isShell: boolean = false;
    public listNodes: CardRight[];
    private _cardList: USERCARD[];
    private _ngUnsubscribe: Subject<void>;
    private flagElem: boolean;
    constructor (
        private _cardSrv: CardRightSrv,
        private _appCtx: AppContext,
    ) {
        this._ngUnsubscribe = new Subject<void>();
        this._cardSrv.selectingNode$
        .pipe(
            takeUntil(this._ngUnsubscribe)
        )
        .subscribe((newData: CardUpdate) => {
            if (!newData || (newData.update)) {
                this._createList()
                .then(() => {
                    this.setCheckBox(newData);
                });
            } else {
                this.setCheckBox(newData);
            }
        });
    }
    confirmEditFile(num: number, newFlag: string) {
        const inListMes = ['\"Редактировать файлы\"', '\"Удалять файлы\"'];
        let flag = false;
        this.listNodes.forEach(node => {
            if (num === 13 && newFlag === '1' && (node.card['FUNCLIST'][14] === '1' || node.card['FUNCLIST'][15] === '1')) {
                flag = true;
            }
            if ((num === 14 || num === 15) && newFlag === '0' && node.card['FUNCLIST'][13] === '0') {
                flag = true;
            }
        });
        let message = '';
        if (num === 13) {
            message = 'У пользователя назначены права на выполнение операций' + ':\n' + inListMes.join('\n') + '\nв данной картотеке. Снять эти права?';
        }
        if ((num === 14 || num === 15)) {
                message = 'Назначить пользователю права на выполнение операции \"Читать файлы\"?';
        }
        if (flag) {
            const f = confirm(message);
            if (f) {
                return true;
            } else {
                return false;
            }
        }
    }
    updateConfirmAns(func_list: string): boolean {
        let flagUpdate = false;
        let message = '';
        this.listNodes.forEach(node => {
            if (func_list === node.card['FUNCLIST'][12] || func_list === node.card['FUNCLIST'][13] || func_list === node.card['FUNCLIST'][14] || func_list === node.card['FUNCLIST'][15]) {
                flagUpdate = true;
            }
        });
        const inListMes = ['\"Добавлять файлы\"', '\"Редактировать файлы\"', '\"Удалять файлы\"', '\"Читать файлы\"'];
        if (func_list === '0') {
            message = 'Назначить пользователю права на выполнение операций' + ':\n' + inListMes.join('\n') + '\n во всех картотеках?';
        } else {
            message = 'У пользователя права назначены на выполнение операций' + ':\n' + inListMes.join('\n') + '\n во всех картотеках. Снять эти права?';
        }
        if (flagUpdate) {
            const flag = confirm(message);
            if (flag) {
                return true;
            } else {
                return false;
            }
        }
    }
    setCheckBox(newData: CardUpdate) {
        if (newData && newData.flag !== undefined) {
            const valueCheckBox = newData.flag ? '0' : '1';
            if (this.listNodes[0].funcNum === 3) {
                this.flagElem = this.updateConfirmAns(valueCheckBox);
            }
            if ((this.listNodes[0].funcNum - 1) > 12 && (this.listNodes[0].funcNum - 1) < 16) {
                this.flagElem = this.confirmEditFile(this.listNodes[0].funcNum - 1, valueCheckBox);
            }
            this.listNodes.forEach(node => {
                if (node.value !== newData.flag) {
                    node.setElemAll(newData.flag, this.flagElem);
                }
            });
            this.flagElem = undefined;
            this._cardSrv.setUpdateFlag();
        }
    }
    ngOnInit() {
        this._createList();
        this.isLoading = false;
    }
    ngOnDestroy() {
        this._ngUnsubscribe.next();
        this._ngUnsubscribe.complete();
    }
    // hideToolTip() {
    //     const element = document.querySelector('.tooltip');
    //     if (element) {
    //         element.setAttribute('style', 'display: none');
    //     }
    // }
    // test() {
    //     this._cardSrv.test();
    // }
    private _createList(): Promise<void> {
        return this._cardSrv.getCardList()
        .then(data => {
            this.listNodes = [];
            this._cardList = data;
            this._cardList.forEach((card: USERCARD) => {
                this.listNodes.push(new CardRight(this._appCtx, this._cardSrv, card));
            });
        });
    }
}
