import { Component, OnDestroy, EventEmitter, Output, OnInit} from '@angular/core';
import { CollectionService, ICollectionList } from './collection.service';

@Component({
    selector: 'eos-param-auth-collection',
    templateUrl: 'collection.component.html'
})

export class AuthenticationCollectionComponent implements OnDestroy, OnInit {
    @Output() closeCollection = new EventEmitter();
    isMarkNode: boolean = false;
    collectionList: ICollectionList[];
    currentSelectedWord: ICollectionList;
    orderBy: boolean = true;
    constructor (
        private _collectionSrv: CollectionService
    ) {}
    ngOnDestroy(): void {
        console.log('destroy');
    }
    ngOnInit () {
        this._collectionSrv.getCollectionList()
            .then((list: ICollectionList[]) => {
                this.collectionList = list;
                this._orderByField();
            });
    }
    submit() {
        console.log('submit');
    }
    cancel() {
        this._closed();
    }


    addWord() {
        console.log('add word');
    }
    deleteWords() {
        for (let i = 0; i < this.collectionList.length; i++) {
            const node = this.collectionList[i];
            if (node.marked || node.selectedMark) {
                if (node === this.currentSelectedWord) {
                    this.currentSelectedWord = null;
                }
                this.collectionList.splice(i, 1); // удалить с базы!!!
                i --;
            }
        }
        this._checkMarkNode();
    }
    editWord() {
        console.log('edit word');
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
}
