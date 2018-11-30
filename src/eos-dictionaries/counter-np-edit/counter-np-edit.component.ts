import {Component, Input, Output, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {IFieldView} from 'eos-dictionaries/interfaces';
import {BsModalRef} from 'ngx-bootstrap';
import {PipRX} from '../../eos-rest';
import {EosDictService} from '../services/eos-dict.service';


export const NUMCREATION_MAIN_NODE_ID = '0.';

@Component({
    selector: 'eos-counter-np-edit',
    templateUrl: 'counter-np-edit.component.html',
})
export class CounterNpEditComponent implements OnDestroy, OnInit {
    @Input() baseId: string;
    // @Input() customTitles: IFieldView[] = [];
    // @Input() fixedFields: IFieldView[] = [];
    // @Input() currentFields: IFieldView[] = [];
    // @Input() dictionaryFields: IFieldView[] = [];
    @Output() onChoose: EventEmitter<any> = new EventEmitter<any>();

    protected apiSrv: PipRX;
    private nodes: any[];
    // private isMain: boolean;
    private dep_node: any;
    private isUpdating = true;
    private editValueNum: number;
    private editValueYear: number;
    // public haveCustomTitle = false;

    // selectedDictItem: IFieldView;
    // selectedCurrItem: IFieldView;
    // selectedFixedItem: IFieldView;
    //
    // editedItem: IFieldView;
    // newTitle: string;

    // modalRef: BsModalRef;


    // private _subscriptionDrop: Subscription;
    // private _subscriptionDrag: Subscription;

    /**
     * @description constructor, subscribe on drop in dragulaService for highlighting selected field
     * @param dragulaService drag'n'drop service
     * @param bsModalRef reference to modal
     */
    constructor(
        // private dragulaService: DragulaService,
        // private _router: Router,
        public bsModalRef: BsModalRef,
        apiSrv: PipRX,
        private _dictSrv: EosDictService,
        // private modalService: BsModalService,
        // private dictSrv: EosDictService,
    ) {
        this.apiSrv = apiSrv;
        this.isUpdating = true;
        // this.editValueNum = 0;
        // this.editValueYear = 0;
        // // value[3] - src
        // // value[2] - dst
        // // value[1] - droped elem
        // this._subscriptionDrop = dragulaService.drop.subscribe((value) => {
        //     if (value[2].id !== value[3].id) {
        //         if (value[3].id === 'selected') {
        //             this.selectedCurrItem = this.currentFields.find((_f) => _f.title === value[1].innerText);
        //         } else {
        //             this.selectedDictItem = this.dictionaryFields.find((_f) => _f.title === value[1].innerText);
        //         }
        //     }
        // });
        // this._subscriptionDrag = dragulaService.drag
        //     .subscribe(() => {
        //         this.selectedDictItem = null;
        //         this.selectedCurrItem = null;
        //         this.selectedFixedItem = null;
        //     });
        // dragulaService.setOptions('bag-one', {
        //     moves: (el/*, source, handle, sibling*/) => !el.classList.contains('fixed-item')
        // });
        //
        // dragulaService.setOptions('fixed-bag', {
        //     moves: (el/*, source, handle, sibling*/) => !el.classList.contains('fixed-item')
        // });
    }

    ngOnDestroy() {
        // if (!!this.dragulaService.find('bag-one')) {
        //     this.dragulaService.destroy('bag-one');
        // }
        //
        // if (!!this.dragulaService.find('fixed-bag')) {
        //     this.dragulaService.destroy('fixed-bag');
        // }
        // this._subscriptionDrop.unsubscribe();
        // this._subscriptionDrag.unsubscribe();
    }

    init(baseid: string) {
        this.baseId = baseid;
        // this.isMain = isMain;
        this.apiSrv.read({'DEPARTMENT': this.baseId}).then((data) => {
            this.dep_node = data[0];
        });

        this.apiSrv.read({'DEPARTMENT': this.baseId}).then((data) => {
            data = [
                {
                    'BASE_ID': this.baseId,
                    'YEAR_NUMBER': 2018,
                    'CURRENT_NUMBER': 20,
                },
                {
                    'BASE_ID': this.baseId,
                    'YEAR_NUMBER': 2017,
                    'CURRENT_NUMBER': 32,
                },
                {
                    'BASE_ID': this.baseId,
                    'YEAR_NUMBER': 2016,
                    'CURRENT_NUMBER': 12,
                },
            ];
            this.nodes = data;
            this.isUpdating = false;
            return data;
        }).catch(err => this.errHandler(err));

        // return this.apiSrv.read({ 'DEPARTMENT': dues })
        //     .then((departments) => {
        //         data.forEach((rec) => {
        //             const dept = departments.find((d) => d['DUE'] === rec.DUE);
        //             if (dept) {
        //                 rec['DEPARTMENT_NAME'] = dept['CLASSIF_NAME'];
        //             } else {
        //                 rec['DEPARTMENT_NAME'] = '';
        //             }
        //         });
        //         return data;
        //     });

        // return this.apiSrv
        //     .read<SEV_ASSOCIATION>({ SEV_ASSOCIATION: [SevIndexHelper.CompositePrimaryKey(rec['ISN_LCLASSIF'], this.apiInstance)] })
        //     .then((sev) => this.apiSrv.entityHelper.prepareForEdit<SEV_ASSOCIATION>(sev[0], 'SEV_ASSOCIATION'));

    }

    ngOnInit() {
        setTimeout(() => {
            // if (this.dictionaryFields) {
            //     this.currentFields.forEach((_field) => {
            //         this.dictionaryFields = this.dictionaryFields.filter((_f: IFieldView) => _f.key !== _field.key);
            //     });
            // }
            // if (this.currentFields) {
            //     this.dictionaryFields.forEach(_field => {
            //         const fieldWithCustom = this.customTitles.find(item => item.key === _field.key);
            //         if (fieldWithCustom) {
            //             _field.customTitle = fieldWithCustom.customTitle;
            //         }
            //     });
            // }
            // this.haveCustomTitle = Boolean(this.customTitles.length);
        }, 0);
    }

    // getRelated(rec: any): Promise<SEV_ASSOCIATION> {
    //     // return this.apiSrv
    //     //     .read<SEV_ASSOCIATION>({ SEV_ASSOCIATION: [SevIndexHelper.CompositePrimaryKey(rec['ISN_LCLASSIF'], this.apiInstance)] })
    //     //     .then((sev) => this.apiSrv.entityHelper.prepareForEdit<SEV_ASSOCIATION>(sev[0], 'SEV_ASSOCIATION'));
    // }


    public hideModal(): void {
        this.bsModalRef.hide();
    }

    /**
     * @description emit custom fields and hide modal
     */
    save() {
        // const customsTitles = [].concat(
        //     this.fixedFields.filter(el => el.customTitle),
        //     this.dictionaryFields.filter(el => el.customTitle),
        //     this.currentFields.filter(el => el.customTitle));
        // this.dictSrv.customTitles = customsTitles;
        // this.dictSrv.customFields = this.currentFields;
        //      this.hideModal();
        //      this.onChoose.emit();
    }

    /**
     * @description move item from all fields (left) to custom fields (right)
     * use with arrows
     */
    // addToCurrent() {
    //     if (this.selectedDictItem) {
    //         // console.log('addToCurrent, this.selectedDictItem', this.selectedDictItem);
    //         /* tslint:disable:no-bitwise */
    //         if (!~this.currentFields.findIndex((_f) => _f.key === this.selectedDictItem.key)) {
    //             this.currentFields.push(this.selectedDictItem);
    //         }
    //         /* tslint:enable:no-bitwise */
    //         this.dictionaryFields.splice(this.dictionaryFields.indexOf(this.selectedDictItem), 1);
    //         this.selectedDictItem = null;
    //     }
    // }

    /**
     * @description move item from custom fields (right) to all fields (left)
     * use with arrows
     */
    // removeFromCurrent() {
    //     if (this.selectedCurrItem) {
    //         /* tslint:disable:no-bitwise */
    //         if (!~this.dictionaryFields.findIndex((_f) => _f.key === this.selectedCurrItem.key)) {
    //             this.dictionaryFields.push(this.selectedCurrItem);
    //         }
    //         /* tslint:enable:no-bitwise */
    //         this.currentFields.splice(this.currentFields.indexOf(this.selectedCurrItem), 1);
    //         this.selectedCurrItem = null;
    //     }
    // }
    //
    /**
     * @description highlight selected item
     * @param item highlighted item
     * @param type indicates where item is placed
     * 1 - current
     * 2 - dictionary
     * 3 - fixed
     */
    select(item: IFieldView, type: number) {
        // switch (type) {
        //     case 1:
        //         this.selectedCurrItem = item;
        //         this.selectedDictItem = null;
        //         this.selectedFixedItem = null;
        //         break;
        //     case 2:
        //         this.selectedDictItem = item;
        //         this.selectedCurrItem = null;
        //         this.selectedFixedItem = null;
        //         break;
        //     case 3:
        //         this.selectedFixedItem = item;
        //         this.selectedCurrItem = null;
        //         this.selectedDictItem = null;
        // }
    }

    /**
     * make item edited
     * @param item edited item
     */
    edit(item: IFieldView) {
        // this.editedItem = item;
        // this.newTitle = item.customTitle || item.title;
    }

    // /**
    //  * @description set newTitle as customTitle for editedItem
    //  */
    // saveNewTitle() {
    //     const trimNewTitle = this.newTitle.trim();
    //     if (trimNewTitle !== this.editedItem.title) {
    //         this.editedItem.customTitle = trimNewTitle;
    //         this.haveCustomTitle = true;
    //     } else {
    //         this.editedItem.customTitle = undefined;
    //         this.haveCustomTitle = false;
    //     }
    //     this.haveCustomTitle = this._checkCustomTitle();
    //     this.cancelTitleEdit();
    // }
    //
    /**
     * @description cancel title edit, set selectedCurrItem, selectedDictItem,
     * editedItem, newTitle equal to null
     */
    // cancelTitleEdit() {
    //     // this.selectedCurrItem = null;
    //     // this.selectedDictItem = null;
    //     // this.editedItem = null;
    //     // this.newTitle = null;
    // }

    /**
     * open modal with remove custom titles confirmation
     * @param template modal template
     */
    // openModal(template: TemplateRef<any>) {
    //     this.modalRef = this.modalService.show(template);
    // }

    // /**
    //  * remove all custom titles
    //  */
    // moveTitlesBack() {
    //     this.modalRef.hide();
    //     this.currentFields.forEach((_f) => {
    //         _f.customTitle = null;
    //     });
    //     this.dictionaryFields.forEach((_f) => {
    //         _f.customTitle = null;
    //     });
    //     this.fixedFields.forEach((_f) => {
    //         _f.customTitle = null;
    //     });
    //     this.haveCustomTitle = false;
    // }

    // private _checkCustomTitle(): boolean {
    //     let result = false;
    //     if (this.dictionaryFields) {
    //         this.dictionaryFields.forEach((_field: IFieldView) => {
    //             if (_field.customTitle) {
    //                 result = true;
    //             }
    //         });
    //     }
    //     if (this.currentFields) {
    //         this.currentFields.forEach((_field: IFieldView) => {
    //             if (_field.customTitle) {
    //                 result = true;
    //             }
    //         });
    //     }
    //     return result;
    // }

    getNodeTitle() {
        if (this.baseId === NUMCREATION_MAIN_NODE_ID) {
            return 'Главный счетчик';
        } else {
            return this.dep_node['CLASSIF_NAME'];
        }
    }

    rowClick(node: any) {
        this.editValueNum = node.CURRENT_NUMBER;
        this.editValueYear = node.YEAR_NUMBER;
    }

    private errHandler(err: any) {
        this._dictSrv.errHandler(err);
        this.hideModal();
    }
}
