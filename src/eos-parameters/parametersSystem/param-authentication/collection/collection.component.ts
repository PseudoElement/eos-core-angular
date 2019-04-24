import { Component, EventEmitter, Output, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CollectionService, ICollectionList } from './collection.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';
import { CONFIRM_SAVE_ON_LEAVE } from 'eos-dictionaries/consts/confirm.consts';

@Component({
    selector: 'eos-param-auth-collection',
    templateUrl: 'collection.component.html',
    styles: [
        `.form-control.ng-invalid.ng-dirty(:focus) {
            border-color: #f44336;
            border-width: 2px;
        }`,
        `.warning {
            display: inline-block;
            width: 100%;
            text-align: center;
            color: #f44336;
        }`
    ]
})

export class AuthenticationCollectionComponent implements OnInit {
    @Output() closeCollection = new EventEmitter();
    @ViewChild('modalWord') modalWord: TemplateRef<any>;
    modalWordRef: BsModalRef;
    isMarkNode: boolean = false;
    isNewWord: boolean;
    collectionList: ICollectionList[];
    currentSelectedWord: ICollectionList;
    orderBy: boolean = true;
    isLoading: boolean;
    qureyForChenge: any[] = [];
    inputWordValue: string = '';
    constructor (
        private _confirmSrv: ConfirmWindowService,
        private _collectionSrv: CollectionService,
        private _modalSrv: BsModalService
    ) {}
    ngOnInit () {
        this.isLoading = true;
        this._collectionSrv.getCollectionList()
            .then((list: ICollectionList[]) => {
                this.isLoading = false;
                this.collectionList = list;
                this._orderByField();
            })
            .catch(e => {
                this._closed();
            });
    }
    submit() {
        this._collectionSrv.changeWords(this.qureyForChenge)
            .then((state: Boolean) => {
                if (state) {
                    this._closed();
                }
            });
    }
    submitModalWord() {
        this.modalWordRef.hide();
        this.inputWordValue = this.inputWordValue.toUpperCase();
        if (this.isNewWord) {
            this.collectionList.push({
                marked: false,
                isSelected: false,
                selectedMark: false,
                CLASSIF_NAME: this.inputWordValue,
                ISN_PASS_STOP_LIST: null
            });
            this.qureyForChenge.push(this._createRequestForCreate(this.inputWordValue));
            this.isNewWord = false;
        } else {
            this.currentSelectedWord.CLASSIF_NAME = this.inputWordValue;
            if (this.currentSelectedWord.ISN_PASS_STOP_LIST) {
                this.qureyForChenge.push(this._createRequestForUpdate(
                    this.currentSelectedWord.ISN_PASS_STOP_LIST,
                    this.inputWordValue
                ));
            } else {
                this.qureyForChenge.push(this._createRequestForCreate(this.inputWordValue));
            }
        }
        this.inputWordValue = '';

    }
    changeWord(event) {
        this.inputWordValue = this.inputWordValue.toUpperCase();
    }
    cancel() {
        if (this.qureyForChenge.length) {
            this._confirmSrv.confirm(CONFIRM_SAVE_ON_LEAVE)
            .then(state => {
                if (state) {
                    this.submit();
                } else {
                    this._closed();
                }
            });
        } else {
            this._closed();
        }
    }
    cancelModalWord() {
        this.modalWordRef.hide();
        this.isNewWord = false;
        this.inputWordValue = '';
    }


    addWord() {
        this.isNewWord = true;
        this._openModal();
    }
    deleteWords() {
        for (let i = 0; i < this.collectionList.length; i++) {
            const node = this.collectionList[i];
            if (node.marked || node.selectedMark) {
                if (node === this.currentSelectedWord) {
                    this.currentSelectedWord = null;
                }
                this.qureyForChenge.push(this._createRequestForDelete(node));
                this.collectionList.splice(i, 1);
                i --;
            }
        }
        this._checkMarkNode();
    }
    editWord() {
        this.inputWordValue = this.currentSelectedWord.CLASSIF_NAME;
        this._openModal();
    }
    toggleAllMarks(event) {
        if (event.target.checked) {
            this.collectionList.forEach(node => {
                node.marked = event.target.checked;
            });
        } else {
            this.collectionList.forEach(node => {
                node.marked = event.target.checked;
                node.selectedMark = event.target.checked;
                // node.isSelected = false;
            });
        }
        this._checkMarkNode();
    }
    orderByField() {
        this.orderBy = !this.orderBy;
        this._orderByField();
    }
    selectedNode(word: ICollectionList) {
        this.isMarkNode = true;
        this.collectionList.forEach(node => {
            if (node === word) {
                node.isSelected = true;
                node.selectedMark = true;
            } else {
                node.isSelected = false;
                node.selectedMark = false;
            }
        });
        this.currentSelectedWord = word;
    }
    checkboxStopPropagation(event) {
        event.stopPropagation();
    }
    markWord(event, word) {
        if (!event) {
            word.marked = event;
            word.selectedMark = event;
            this._checkMarkNode();
        } else {
            word.marked = event;
            this.isMarkNode = true;
        }
    }
    private _closed() {
        this.closeCollection.emit();
    }
    private _checkMarkNode() {
        let check = false;
        this.collectionList.forEach(node => {
            if (node.marked || node.selectedMark) {
                check = true;
            }
        });
        this.isMarkNode = check;
    }
    private _orderByField() {
        this.collectionList.sort((a: ICollectionList, b: ICollectionList) => {
            const _a = a.CLASSIF_NAME.toUpperCase();
            const _b = b.CLASSIF_NAME.toUpperCase();
            if (_a > _b) {
                return this.orderBy ? 1 : -1;
            }
            if (_a < _b) {
                return this.orderBy ? -1 : 1;
            }
            if (_a === _b) {
                return 0;
            }
        });
    }
    private _createRequestForDelete(word: ICollectionList) {
        return {
            method: 'DELETE',
            requestUri: `SYS_PARMS(-99)/PASS_STOP_LIST_List(${word.ISN_PASS_STOP_LIST})`
        };
    }
    private _createRequestForUpdate(id, word) {
        return {
            method: 'MERGE',
            requestUri: `SYS_PARMS(-99)/PASS_STOP_LIST_List(${id})`,
            data: {
                CLASSIF_NAME: word
            }
        };
    }
    private _createRequestForCreate(word) {
        return {
            method: 'POST',
            requestUri: 'SYS_PARMS(-99)/PASS_STOP_LIST_List',
            data: {
                CLASSIF_NAME: word
            }
        };
    }
    private _openModal() {
        this.modalWordRef = this._modalSrv.show(this.modalWord, {class: 'modalWord', ignoreBackdropClick: true});
    }
}
