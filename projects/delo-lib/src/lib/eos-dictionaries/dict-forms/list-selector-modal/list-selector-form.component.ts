import { Component, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { InjectorInstance } from '../../../app/app.static';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs/internal/Subscription';

export interface SelectorListItem {
    key: any;
    title: string;
    obj: any;
}

export interface SelectorListOptions {
    showKeys?: boolean;
    targetNonUniques?: boolean;
}


@Component({
    selector: 'eos-list-selector-form',
    templateUrl: 'list-selector-form.component.html',
    styleUrls: ['./list-selector-form.component.scss']
})

export class ListSelectorFormComponent implements OnDestroy {

    @Input() options: SelectorListOptions = {};
    @Output() onSave: EventEmitter<any[]> = new EventEmitter<any[]>();
    @Output() onClose: EventEmitter<any[]> = new EventEmitter<any[]>();

    selection: {available: SelectorListItem, current: SelectorListItem } = { available: null, current: null };

    BAG_NAME = 'list-select-bag';

    public title: string = '';
    public availableList: SelectorListItem[] = [];
    public currentList: SelectorListItem[] = [];
    public bufferAvailableList: SelectorListItem[] = [];
    public showKeys: false;
    public withDel: boolean = false;
    private subscriptions: Subscription[] = [];



    constructor (
        private dragulaService: DragulaService,
        public bsModalRef: BsModalRef,
    ) {

        // this.availableList_ = [];//[{ key: 1, title: 'dsag', obj: {}}, { key: 2, title: 'ds35215235ag', obj: {}}, ];
        // this.currentList_ = [];//[{ key: 3, title: 'd346234sag', obj: {}}];

        dragulaService.setOptions(this.BAG_NAME, {
            revertOnSpill: true,
            // moves: (el, source) => {
            //     return source.id !== 'selected' && !el.classList.contains('disabled');
            // },
            moves: (el, source) => { //
            //     // return source.id !== 'available';
                return true;
            },
            copy: (el, source) => {
            //     return true;
                return source.id === 'availableList';
            },
            delay: 100,
            removeOnSpill: true,
            copySortSource: false,
            ignoreInputTextSelection: true,
            // invalid: (el?: Element, target?: Element) => {
            //     return el.classList.contains('disabled');
            // },
            accepts: (el, target, source, sibling) => {
                if (target.id !== 'currentList') {
                    return false;
                }
                if (!this.options.targetNonUniques) {
                    const id = Number(el.id.split('listItem_')[1]);
                    return (!this.currentList.find(cl => cl.key === id));
                    // console.log("TCL: ListSelectorFormComponent -> id", id)
                }
                return true;
            }
        });

        this.subscriptions.push(dragulaService.dropModel.subscribe(([bagName, el, target, source, sourceModel, targetModel, item]) => {
            if (bagName === this.BAG_NAME ) {
                if (!this.options.targetNonUniques) {
                    // const set = new Set(this.currentList);
                    // this.currentList = Array.from(set);
                }
            }


        }));

        this.subscriptions.push(dragulaService.dragend.subscribe(([hz, el, target, source, sourceModel, targetModel, item]) => {
        }));

        this.subscriptions.push(dragulaService.drop.subscribe(([hz, el, target, source, sourceModel, targetModel, item]) => {
        }));

        this.subscriptions.push(dragulaService.removeModel.subscribe(([hz, el, target, source, sourceModel, targetModel, item]) => {
        }));


    }


    static showModal(title: string, availableList: SelectorListItem[], currentList: SelectorListItem[]): ListSelectorFormComponent {
        const modalSrv = InjectorInstance.get(BsModalService);
        const templateModal = modalSrv.show(ListSelectorFormComponent, {
            class: 'list-selector-form modal-form' ,
            ignoreBackdropClick: true,
            animated: false,
        });

        const modalObj = <ListSelectorFormComponent>templateModal.content;
        modalObj.availableList = availableList;
        modalObj.bufferAvailableList = availableList;
        modalObj.currentList = currentList;
        modalObj.title = title,
        // modalObj.forProject = forProject;
        // modalObj.additionalData = forProject ? {COPY_NUMBER_FLAG_PRJ: this.getValue('rec.COPY_NUMBER_FLAG_PRJ') || 0} : {COPY_NUMBER_FLAG: this.getValue('rec.COPY_NUMBER_FLAG') || 0};
        // modalObj.dgTemplate = this.getValue(path);
        // modalObj.rcType = this.rcType * 1;
        // modalObj.allowEmpty = (forProject ? false : this.isNode);
        modalObj.init();
        // modalObj.onSave.subscribe(([template, additionalData]) => {
        //     if (additionalData && !EosUtils.isObjEmpty(additionalData)) {
        //         for (const key in additionalData) {
        //             if (additionalData.hasOwnProperty(key)) {
        //                 const value = additionalData[key];
        //                 this.setValue('rec.' + key, value);
        //             }
        //         }
        //     }

        //     this.setValue(path, template);
        // });

        return modalObj;

    }
    public init() {
        // this.availableList_ = this.availableList; //[];//[{ key: 1, title: 'dsag', obj: {}}, { key: 2, title: 'ds35215235ag', obj: {}}, ];
        // this.currentList_ = this.currentList; //[];//[{ key: 3, title: 'd346234sag', obj: {}}];

    }

    public close(doSave: boolean ) {
        if (doSave) {
            if (this.selection.available && !this.currentList.includes(this.selection.available)) {
                this.currentList.push(this.selection.available);
            }
            this.onSave.emit([this.currentList]);
        }
        this.onClose.emit();
        this.bsModalRef.hide();
    }

    public selectItem (item: SelectorListItem, panelNum: number) {
        panelNum === 0 ? this.selection.available = item :  this.selection.current = item;
    }

    ngOnDestroy() {
        if (!!this.dragulaService.find(this.BAG_NAME)) {
            this.dragulaService.destroy(this.BAG_NAME);
        }
        this.subscriptions.forEach((s) => s.unsubscribe());
    }

    b1() { }
    b2() { }

    deletedWith() {
        this.withDel = !this.withDel;
    }

    search(value: string) {
        this.availableList = this.bufferAvailableList.filter((item) => item.title.toLowerCase().includes(value.toLowerCase()));
    }
}
