import { Component, EventEmitter, Output, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CollectionService, ICollectionList } from './collection.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
// import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';
// import { CONFIRM_SAVE_ON_LEAVE } from 'eos-dictionaries/consts/confirm.consts';

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
    @ViewChild('modalWord', { static: true }) modalWord: TemplateRef<any>;
    @ViewChild('checkAllMarkes', { static: true }) checkAllMarkes;
    modalWordRef: BsModalRef;
    isMarkNode: boolean = false;
    isNewWord: boolean;
    collectionList: ICollectionList[] = [];
    currentSelectedWord: ICollectionList;
    orderBy: boolean = true;
    isLoading: boolean;
    qureyForChenge: any[] = [];
    inputWordValue: string = '';
    errorUnique: boolean = false;
    title = 'Словарь недопустимых паролей';
    validPattern: boolean = true;
    submitDisable = false;
    get disableCollection() {
        return this.inputWordValue === '' || this.inputWordValue.length > 64 || this.errorUnique || !this.validPattern;
    }
    get checkCheckList() {
        return this.collectionList.every(node => node.marked || node.selectedMark);
    }
    constructor(
        // private _confirmSrv: ConfirmWindowService,
        private _collectionSrv: CollectionService,
        private _modalSrv: BsModalService
    ) { }
    btnDisable() {
        const val = this.collectionList.some(list => {
            return list.state === 'new' || list.state === 'merge';
        });
        if (val || this.qureyForChenge.length) {
            return false;
        } else {
            return true;
        }
    }
    ngOnInit() {
        this.isLoading = true;
        this.init();
    }
    init() {
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
        this.submitDisable = true;
        this.collectionList.forEach(list => {
            if (list.state === 'new') {
                this.qureyForChenge.push(this._createRequestForCreate(list.CLASSIF_NAME));
            }

            if (list.state === 'merge') {
                this.qureyForChenge.push(this._createRequestForUpdate(list.ISN_PASS_STOP_LIST, list.CLASSIF_NAME));
            }
        });
        this._collectionSrv.changeWords(this.qureyForChenge)
            .then((state: Boolean) => {
                this.collectionList.map(list => {
                    list.state = 'old';
                    return list;
                });
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
                state: 'new',
                CLASSIF_NAME: this.inputWordValue,
                ISN_PASS_STOP_LIST: null,
            });
            this.isNewWord = false;
            this._orderByField();
        } else {
            this.currentSelectedWord.CLASSIF_NAME = this.inputWordValue;
            if (this.currentSelectedWord.ISN_PASS_STOP_LIST) {
                this.currentSelectedWord.state = 'merge';
            }
        }
        this.inputWordValue = '';
    }
    uniqueVal($event) {
        this.validPattern = $event.target.validity.valid;
        if (this.checkUniqueValue(this.inputWordValue.toUpperCase())) {
            this.errorUnique = true;
        } else {
            this.errorUnique = false;
        }
    }
    checkUniqueValue(newValue): boolean {
        return this.collectionList.some(val => {
            return val.CLASSIF_NAME === newValue;
        });
    }
    changeWord(event) {
        this.inputWordValue = this.inputWordValue.toUpperCase();
    }
    cancel() {
        // if (this.qureyForChenge.length) {
        //     this._confirmSrv.confirm(CONFIRM_SAVE_ON_LEAVE)
        //         .then(state => {
        //             if (state) {
        //                 this.submit();
        //             } else {
        //                 this.init();
        //                 this._closed();
        //             }
        //         });
        // } else {
        // }
        this.init();
        this._closed();
    }
    cancelModalWord() {
        this.modalWordRef.hide();
        this.isNewWord = false;
        this.inputWordValue = '';
        this.errorUnique = false;
        this.validPattern = true;
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
                if (node.state !== 'new') {
                    this.qureyForChenge.push(this._createRequestForDelete(node));
                }
                this.collectionList.splice(i, 1);
                i--;
            }
        }
        this._checkMarkNode();
    }
    editWord() {
        this.inputWordValue = this.currentSelectedWord.CLASSIF_NAME;
        this._openModal();
    }
    selectOneNode() {
        // проверка выделена ли только одна запись, для блокирования кнопки если да ставим кнопку редактирования
        const countSelect = this.collectionList.filter(elem => elem.isSelected === true);
        if (countSelect.length === 1) {
            this.currentSelectedWord = countSelect[0];
            return false;
        }
        return true;
    }
    toggleAllMarks(event) {
        if (event.target.checked) {
            this.collectionList.forEach(node => {
                node.isSelected = event.target.checked; //
                node.marked = event.target.checked;
            });
        } else {
            this.collectionList.forEach(node => {
                node.marked = event.target.checked;
                node.isSelected = event.target.checked; //
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
                this.currentSelectedWord = word;
            } else {
                node.marked = false;
                node.isSelected = false;
                node.selectedMark = false;
            }
        });
        this.updateChecAll();
    }
    checkboxStopPropagation(event) {
        event.stopPropagation();
    }

    markWord(event, word) {
        if (!event) {
            word.marked = event;
            word.isSelected = event;
            word.selectedMark = event;
            this._checkMarkNode();
        } else {
            word.marked = event;
            word.isSelected = event;
            this.isMarkNode = true;
        }
        this.currentSelectedWord = word;
        this.updateChecAll();
    }
    updateChecAll() {
        const allcount = this.collectionList.length;
        const check_count = this.collectionList.filter(elem => elem.marked === true).length;
        if (allcount === check_count) {
            this.checkAllMarkes.nativeElement.checked = true;
        } else {
            this.checkAllMarkes.nativeElement.checked = false;
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
        this.modalWordRef = this._modalSrv.show(this.modalWord, { class: 'modalWord', ignoreBackdropClick: true });
    }
}
