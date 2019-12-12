import {
    Component,
    ViewChild,
    OnDestroy,
    OnInit,
    AfterContentInit,
    AfterContentChecked,
    NgZone,
    ChangeDetectorRef,
    HostListener,

} from '@angular/core';
import {SortableComponent, BsModalRef, BsModalService} from 'ngx-bootstrap';
import {Subject} from 'rxjs';


import {EosDictionaryNode} from '../core/eos-dictionary-node';
import {EosDictService, MarkedInformation} from '../services/eos-dict.service';
import {IDictionaryViewParameters, IFieldView, IOrderBy, E_FIELD_SET, E_FIELD_TYPE} from 'eos-dictionaries/interfaces';
import {LongTitleHintComponent} from '../long-title-hint/long-title-hint.component';
import {HintConfiguration} from '../long-title-hint/hint-configuration.interface';
import {ColumnSettingsComponent} from '../column-settings/column-settings.component';
import {EosUtils} from 'eos-common/core/utils';
import { takeUntil } from 'rxjs/operators';
import { ExportImportClService } from 'app/services/export-import-cl.service';
import {CopyNodeComponent} from '../copy-node/copy-node.component';
import { TOOLTIP_DELAY_VALUE } from 'eos-common/services/eos-tooltip.service';

const ITEM_WIDTH_FOR_NAN = 100;
@Component({
    selector: 'eos-node-list',
    templateUrl: 'node-list.component.html',
})
export class NodeListComponent implements OnInit, OnDestroy, AfterContentInit, AfterContentChecked {
    @ViewChild(SortableComponent) sortableComponent: SortableComponent;
    @ViewChild(LongTitleHintComponent) hint: LongTitleHintComponent;
    @ViewChild('eosNodeList') eosNodeList;

    customFields: IFieldView[] = [];
    length = {};
    min_length = {};
    modalWindow: BsModalRef = null;
    nodes: EosDictionaryNode[] = []; // Elements for one page
    orderBy: IOrderBy;
    params: IDictionaryViewParameters;
    headerOffset = 0;
    viewFields: IFieldView[] = [];
    tooltipDelay = TOOLTIP_DELAY_VALUE;
    markedInfo: MarkedInformation;
    allMarked: boolean;

    public hasOverflowedColumns: boolean;
    public firstColumnIndex: number;
    private ngUnsubscribe: Subject<any> = new Subject();
    private nodeListElement: Element;
    private _recalcW: number;
    private _holder;
    private _recalcEvent: any;
    private _dictId: string;
    private _repaintFlag: any;



    constructor(
        // @Inject(DOCUMENT) document,
        private _dictSrv: EosDictService,
        private _modalSrv: BsModalService,
        private _cdr: ChangeDetectorRef,
        private _zone: NgZone,
        private _eiCl: ExportImportClService,
    ) {
        this.firstColumnIndex = 0;
        _dictSrv.visibleList$
        .pipe(
            takeUntil(this.ngUnsubscribe)
        )
            .subscribe((nodes: EosDictionaryNode[]) => {
                if (_dictSrv.currentDictionary) {
                    this._repaintFlag = true;
                    if (_dictSrv.currentDictionary.id !== this._dictId) {
                        this.firstColumnIndex = 0;
                    }
                    this._dictId = _dictSrv.currentDictionary.id;

                    this.customFields = this._dictSrv.customFields;

                    this.updateViewFields(this.customFields, nodes). then ( () => {
                        const _customTitles = this._dictSrv.customTitles;
                        _customTitles.forEach((_title) => {
                            const vField = this.viewFields.concat(this.customFields).find((_field) => _field.key === _title.key);
                            if (vField) {
                                vField.customTitle = _title.customTitle;
                            }
                        });
                        this.nodes = nodes;

                        setTimeout(() => {
                            this._countColumnWidth();
                            this._repaintFlag = false;
                        }, 10);
                    });
                }
            });

        _dictSrv.viewParameters$
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((params: IDictionaryViewParameters) => {
                this.params = params;
                if (this._dictSrv.userOrdered) {
                    this.orderBy = null;
                } else {
                    if (_dictSrv.currentDictionary) {
                        this.orderBy = _dictSrv.currentDictionary.orderBy;
                    }
                }
            });
        _dictSrv.markInfo$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((markedInfo) => {
            this.markedInfo = markedInfo;
            if (this.nodes.length && this.nodes.length === markedInfo.nodes.length) {
                this.allMarked = true;
            } else {
                this.allMarked = false;
            }
        });

    }

    updateViewFields(customFields: IFieldView[], nodes: EosDictionaryNode[]): Promise<any> {
        // also customFields for update
        return this._dictSrv.currentDictionary.getListViewWithRelated(customFields, nodes).then ( (fields) => {
            this.viewFields = fields;
        } );
    }

    ngOnInit() {
        this._holder = document.getElementById('sizeholder');
    }

    ngAfterContentChecked() {
        if ((this._recalcW !== this._holder.clientWidth)) {
            this._recalcW = this._holder.clientWidth;
            this._countColumnWidth();
        }
    }

    ngAfterContentInit() {
        this.nodeListElement = document.querySelector('.node-title');
        this._countColumnWidth();
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        if (!this._cdr['destroyed']) {
            this._cdr.detach();
        }

    }

    markedNodes() {
        return this.nodes.filter(n => n.isMarked);
    }

    onClickSelect (item) {
        const selectedItems = this.markedNodes();
        const selectedCount = selectedItems.length;

        if (selectedCount === 0) {
            this._dictSrv.setMarkForNode(item, true, true);
        } else {
            this._dictSrv.setMarkAllNone(false);
            this._dictSrv.setMarkForNode(item, true, true);
        }
    }

    onClickMark (item, isMarked) {
        this._dictSrv.setMarkForNode(item, isMarked, true);
    }

    /**
     * @description Open modal with ColumnSettingsComponent, fullfill ColumnSettingsComponent data
     */
    configColumns() {
        this.modalWindow = this._modalSrv.show(ColumnSettingsComponent, {class: 'column-settings-modal modal-lg'});
        this.modalWindow.content.fixedFields = EosUtils.deepUpdate([], this.viewFields);
        this.modalWindow.content.customTitles = EosUtils.deepUpdate([], this._dictSrv.customTitles);
        this.modalWindow.content.currentFields = EosUtils.deepUpdate([], this.customFields);
        this.modalWindow.content.dictionaryFields = EosUtils.deepUpdate([],
            this._dictSrv.currentDictionary.descriptor.record.getFieldSet(E_FIELD_SET.allVisible));

        const subscriptionClose = this.modalWindow.content.onClose.subscribe(() => {
            this.modalWindow = null;
            subscriptionClose.unsubscribe();
        });

        const subscription = this.modalWindow.content.onChoose.subscribe(() => {
            this.customFields = this._dictSrv.customFields;
            const _customTitles = this._dictSrv.customTitles;

            this.viewFields.concat(this.customFields).forEach((vField) => {
                const _title = _customTitles.find((_f) => _f.key === vField.key);
                vField.customTitle = _title ? _title.customTitle : null;
            });


            if (!this.isCorrectOrderBy()) {
                this.orderBy = this._dictSrv.currentDictionary.orderDefault();
            }

            this.updateViewFields(this.customFields, []);
            this._dictSrv.updateVisibleList();
            this._countColumnWidth();
            subscription.unsubscribe();
        });
    }

    isCorrectOrderBy(): boolean {
        if (this.orderBy === null) {
            return true;
        }
        if (this.viewFields.find(v => v.key === this.orderBy.fieldKey)) {
            return true;
        }
        if (this.customFields.find(v => v.key === this.orderBy.fieldKey)) {
            return true;
        }
        return false;
    }

    openAdditionalFields(node: EosDictionaryNode) {
        let url = '../WebRC/AR_EDITOR/AR_EDITOR.aspx#docgrp={{DUE}}';
        url = url.replace('{{DUE}}', node.data.rec['DUE']);
        this._zone.runOutsideAngular(() => {
            window.open(url, 'addFields', 'resizable=1,status=1,top=20,left=20,width=1220,height=900');
        });
    }

    openCopyNode(nodes: EosDictionaryNode[]) {
        this.modalWindow = this._modalSrv.show(CopyNodeComponent, {
            class: 'copy-node-modal moodal-lg'});
        this.modalWindow.content.init(nodes);

        const subscriptionClose = this.modalWindow.content.onClose.subscribe(() => {
            this.modalWindow = null;
            subscriptionClose.unsubscribe();
        });
    }

    getMarkedTitles(): string[] {
        return this.nodes
            .filter((node) => node.isMarked)
            .map((node) => node.title);
    }

    orderByField(fieldKey: string) {
        this._dictSrv.setMarkAllNone();
        if (!this.orderBy || this.orderBy.fieldKey !== fieldKey) {
            this.orderBy = {
                fieldKey: fieldKey,
                ascend: true,
            };
        } else {
            this.orderBy.ascend = !this.orderBy.ascend;
        }
        this._dictSrv.orderBy(this.orderBy);
        if (!this._cdr['destroyed']) {
            this._cdr.detectChanges();
        }
    }

    untrimmedValue(value: string): string {
        const res = value.replace(/ /g, '\u00A0');
        return res;
    }

    showHint(hintConfig?: HintConfiguration) {
        if (!hintConfig) {
            this.hint.hideHint({
                node: null,
                show: false
            });
            return;
        }
        if (hintConfig.show) {
            this.hint.showHint(hintConfig);
        } else {
            this.hint.hideHint(hintConfig);
        }
    }

    get getflagChecked() {
        if (this.allMarked) {
            return 'eos-icon-checkbox-square-v-blue';
        } else if (this.markedInfo.anyMarked) {
            return 'eos-icon-checkbox-square-minus-blue';
        } else {
            return 'eos-icon-checkbox-square-blue';
        }
      }

      /**
     * Toggle checkbox checked all
     */
    toggleAllMarks(): void {

        if (this.allMarked) {
            this._dictSrv.setMarkAllVisible();
        } else {
            this._dictSrv.setMarkAllNone();
        }

        // TODO: move to info?
        const selectedItems = this.markedNodes();
        const selectedCount = selectedItems.length;
        this._dictSrv.openNode(selectedCount ? selectedItems[0].id : '').then(() => {});
    }

    toggleItem() {
        this.userOrdered(this.nodes);
    }

    writeValues(nodes: EosDictionaryNode[]) {
        if (nodes && nodes.length) {
            this.sortableComponent.writeValue(nodes);
        }
    }

    getWeigthForItem(item: EosDictionaryNode, index: number): number {
        let w = item.data.rec['WEIGHT'];
        if (!w) {
            w = Number (item.id);
        }
        if (!w) {
            w = item.data.rec['ISN_LCLASSIF'];
        }
        if (!w) {
            w = index;
        }
        return w;
    }

    _nodesSwap(changeList: {}, i1: number, i2: number): any {
        const item1 = this.nodes[i1];
        const item2 = this.nodes[i2];
        let w1 = this.getWeigthForItem(item1, i1);
        let w2 = this.getWeigthForItem(item2, i2);

        // ситуация, когда восстанавливаем из id, случай, когда вес и так тот что нужен.
        if ((i1 > i2 && w1 < w2) || (i1 < i2 && w1 > w2)) {
            const s = w1;
            w1 = w2;
            w2 = s;
        }

        const signedOne = (i1 > i2 ? -1 : 1);

        if (w1 === w2) {
            w1 += signedOne;
        }

        if (w1 === 0) { w1 += signedOne; }
        if (w2 === 0) { w2 -= signedOne; }

        item1.data.rec['WEIGHT'] = w2;
        item2.data.rec['WEIGHT'] = w1;

        changeList[item1.id] = item1.data.rec['WEIGHT'];
        changeList[item2.id] = item2.data.rec['WEIGHT'];

        this.nodes[i1] = item2;
        this.nodes[i2] = item1;
    }

    moveUp(): void {
        const changeList = {};

        if (!this._dictSrv.viewParameters.showAllSubnodes) {
            for (let i = 0; i < this.nodes.length; i++) {
                const item1 = this.nodes[i];
                if (item1.isMarked) {
                    if (i > 0) {
                        const item2 = this.nodes[i - 1];
                        if (!item2.isMarked) {
                            this._nodesSwap(changeList, i, i - 1);
                        }
                    }
                }
            }
        } else {
            for (let m = 0; m < this.nodes.length; m++) {
                const element = this.nodes[m];
                if (element.isMarked) {
                    let targ_idx = m - 1;
                    for (let i = targ_idx; i >= 0; i--) {
                        if (element.originalParentId === this.nodes[i].originalParentId) {
                            targ_idx = i;
                            if (targ_idx >= 0) {
                                const item = this.nodes[targ_idx];
                                if (!item.isMarked) {
                                    this._nodesSwap(changeList, targ_idx, m);
                                }
                            }
                            break;
                        }
                    }
                }
            }
        }
        if ( changeList !== {} ) {
            this._dictSrv.storeDBWeights(this._dictSrv.currentDictionary, changeList).then(() => {
                this.userOrdered(this.nodes);
            });
        }
    }

    moveDown(): void {
        const changeList = {};

        if (!this._dictSrv.viewParameters.showAllSubnodes) {
            for (let i = this.nodes.length - 1; i >= 0; i--) {
                const element = this.nodes[i];
                if (element.isMarked) {
                    if (i < this.nodes.length - 1) {
                        const item = this.nodes[i + 1];
                        if (!item.isMarked) {
                            this._nodesSwap(changeList, i, i + 1);
                        }
                    }
                }
            }
        } else {
            for (let m = this.nodes.length - 1; m >= 0; m--) {
                const element = this.nodes[m];
                if (element.isMarked) {
                    let targ_idx = m + 1;
                    for (let i = targ_idx; i < this.nodes.length; i++) {
                        if (this.nodes[m].originalId !== this.nodes[i].originalParentId) {
                            targ_idx = i;
                            if (targ_idx < this.nodes.length) {
                                const item = this.nodes[targ_idx];
                                if (!item.isMarked) {
                                    this._nodesSwap(changeList, targ_idx, m);
                                }
                            }
                            break;
                        }
                    }
                }
            }
        }
        if ( changeList !== {} ) {
            this._dictSrv.storeDBWeights(this._dictSrv.currentDictionary, changeList);
            this.userOrdered(this.nodes);
        }
    }

    export(dictionaryId: string): void {
        this._eiCl.openExport(dictionaryId).then().catch(err => { });
    }

    import(dictionaryId: string, nodeId: string): void {
        this._eiCl.openImport(dictionaryId, nodeId)
            .then(r => {
                this._dictSrv.resetSearch().then().catch(err => { });
            })
            .catch(err => {
                this._dictSrv.resetSearch().then().catch(e => { console.log(e); });
             });
    }
    userOrdered(nodes: EosDictionaryNode[]) {
        this._dictSrv.setUserOrder(nodes);
    }

    openNodeNavigate(backward = false): void {
        const markList = this.nodes.filter( n => n.isMarked);
        if (markList.length <= 1) {
            return;
        }

        const currentNode =  this._dictSrv.listNode;

        for (let i = 0; i < markList.length; i++) {
            const element = markList[i];
            if (element === currentNode) {
                if (backward) {
                    this._dictSrv.openNode(markList[(i === 0 ? markList.length - 1 : i - 1)].id);
                } else {
                    this._dictSrv.openNode(markList[(i === markList.length - 1 ? 0 : i + 1)].id);
                }
                break;
            }

        }
    }

    onListScroll(evt: any) {
        let offset = -this.headerOffset;
        if (evt.srcElement) {
            offset = evt.srcElement.scrollLeft;
        } else if (evt.target) {
            offset = (evt.target as Element).scrollLeft;
        }
        this.headerOffset = -offset;

        // Fix for unhidden tooltip in IE
        const element = document.querySelector('.tooltip');
        if (element) {
            element.setAttribute('style', 'display: none');
        }

        this._dictSrv.currentScrollTop = evt.srcElement.scrollTop;

    }

    updateScrollTop(): void {
        this.eosNodeList.nativeElement.scrollTop = this._dictSrv.currentScrollTop;
    }

    isOverflowed() {
        return (this.firstColumnIndex !== 0) || this.hasOverflowedColumns;
    }

    onRightClick() {
        if (this.customFields.length > this.firstColumnIndex + 1) {
            this.firstColumnIndex ++;
            this._countColumnWidth();
        }
    }

    getSlicedCustomFields() {
        return this.customFields.slice(this.firstColumnIndex);
    }

    onLeftClick() {
        if (this.firstColumnIndex > 0 ) {
            this.firstColumnIndex--;
            this._countColumnWidth();
        }
    }

    @HostListener('window:resize')
    onResize() {
        this._countColumnWidth();
    }

    get recalcDone() {
        return /*!this._recalcEvent && */!this._repaintFlag && this.modalWindow === null;
    }
    private _countColumnWidth() {
        if (!this.viewFields || this.viewFields.length === 0) {
            return;
        }
        if (!this._recalcEvent) {
            this._recalcEvent = setTimeout(() => {
                this._countColumnWidthUnsafe();
                this._recalcEvent = null;
            }, 1);
        }
    }

    private _countColumnWidthUnsafe() {
        const calcLength = [];
        const presetLength = [];
        let fullWidth = 0;

        const fields: IFieldView[] = this.viewFields.concat(this.customFields);

        fields.forEach((_f) => {
            const element = document.getElementById('vf_' + _f.key);
            if (element) {
                let itemWidth;
                if (_f.preferences && _f.preferences.columnWidth) {
                    itemWidth = _f.preferences.columnWidth;
                    presetLength[_f.key] = itemWidth;
                } else {
                    itemWidth = element.clientWidth ? element.clientWidth : ITEM_WIDTH_FOR_NAN;
                }

                calcLength[_f.key] = itemWidth;
                fullWidth += itemWidth;
            }
        });

        this.length = calcLength;

        if (!this.nodeListElement) {
            this.hasOverflowedColumns = false;
        } else {
            this.hasOverflowedColumns = (this.nodeListElement.scrollWidth > this.nodeListElement.clientWidth);
        }

        if (this.isOverflowed()) {
            this.min_length = presetLength;
        } else {
            const minLength = presetLength;
            const lastField = fields[fields.length - 1];
            if (lastField && lastField.type !== E_FIELD_TYPE.boolean) {
                minLength[lastField.key] = (this._holder.clientWidth - (fullWidth - this.length[lastField.key])) - 50;
                this.length[lastField.key] = minLength[lastField.key];
            }
            this.min_length = minLength;
        }

        if (!this._cdr['destroyed']) {
            this._cdr.detectChanges();
        }
    }

}
