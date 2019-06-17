import {
    Component,
    ViewChild,
    OnDestroy,
    OnInit,
    Inject,
    AfterContentInit,
    AfterContentChecked,
    NgZone,
    ChangeDetectorRef,
    HostListener
} from '@angular/core';
import {SortableComponent, BsModalRef, BsModalService} from 'ngx-bootstrap';
import {Subject} from 'rxjs';


import {EosDictionaryNode} from '../core/eos-dictionary-node';
import {EosDictService} from '../services/eos-dict.service';
import {IDictionaryViewParameters, IFieldView, IOrderBy, E_FIELD_SET, E_FIELD_TYPE} from 'eos-dictionaries/interfaces';
import {LongTitleHintComponent} from '../long-title-hint/long-title-hint.component';
import {HintConfiguration} from '../long-title-hint/hint-configuration.interface';
import {ColumnSettingsComponent} from '../column-settings/column-settings.component';
import {EosUtils} from 'eos-common/core/utils';
import {DOCUMENT} from '@angular/common';
import {PrjDefaultValuesComponent} from '../prj-default-values/prj-default-values.component';
import { takeUntil } from 'rxjs/operators';
import {CopyPropertiesComponent} from '../copy-properties/copy-properties.component';
import { ExportImportClService } from 'app/services/export-import-cl.service';
import { TOOLTIP_DELAY_VALUE } from 'eos-common/services/eos-message.service';

const ITEM_WIDTH_FOR_NAN = 100;

@Component({
    selector: 'eos-node-list',
    templateUrl: 'node-list.component.html',
})
export class NodeListComponent implements OnInit, OnDestroy, AfterContentInit, AfterContentChecked {
    @ViewChild(SortableComponent) sortableComponent: SortableComponent;
    @ViewChild(LongTitleHintComponent) hint: LongTitleHintComponent;
    @ViewChild('eosNodeList') eosNodeList;


    allMarked: boolean;
    anyMarked: boolean;
    anyUnmarked: boolean;
    customFields: IFieldView[] = [];
    length = {};
    min_length = {};
    modalWindow: BsModalRef;
    nodes: EosDictionaryNode[] = []; // Elements for one page
    orderBy: IOrderBy;
    params: IDictionaryViewParameters;
    headerOffset = 0;
    viewFields: IFieldView[] = [];
    tooltipDelay = TOOLTIP_DELAY_VALUE;

    private ngUnsubscribe: Subject<any> = new Subject();
    private nodeListElement: Element;
    private _recalcW: number;
    private _holder;

    constructor(
        @Inject(DOCUMENT) document,
        private _dictSrv: EosDictService,
        private _modalSrv: BsModalService,
        private _cdr: ChangeDetectorRef,
        private _zone: NgZone,
        private _eiCl: ExportImportClService,
    ) {

        _dictSrv.visibleList$
        .pipe(
            takeUntil(this.ngUnsubscribe)
        )
            .subscribe((nodes: EosDictionaryNode[]) => {
                if (_dictSrv.currentDictionary) {

                    this.customFields = this._dictSrv.customFields;
                    this.updateViewFields(this.customFields);

                    const _customTitles = this._dictSrv.customTitles;
                    _customTitles.forEach((_title) => {
                        const vField = this.viewFields.find((_field) => _field.key === _title.key);
                        if (vField) {
                            vField.customTitle = _title.customTitle;
                        }
                    });
                }
                this.nodes = nodes;
                setTimeout(() => {
                    this._countColumnWidth();
                }, 100);
                this.updateMarks();
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
    }

    updateViewFields(customFields: IFieldView[]) {
        // also customFields for update
        this.viewFields = this._dictSrv.currentDictionary.getListView(customFields);
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
    }

    markedNodes() {
        return this.nodes.filter(n => n.isMarked);
    }

    onClickSelect (item, isMarked) {
        const selectedItems = this.markedNodes();
        const selectedCount = selectedItems.length;

        if (isMarked) {
            if (selectedCount === 1) {
            } else {
                selectedItems.forEach((node) => {
                    if (node !== item) { node.isMarked = false; }
                });
            }
            this._dictSrv.openNode(item.id);
        } else {
            if (selectedCount === 0) {
                this._dictSrv.openNode('').then(() => {});
            } else {
                item.isMarked = true;
                selectedItems.forEach((node) => {
                    if (node !== item) { node.isMarked = false; }
                });
                this._dictSrv.openNode(selectedItems[0].id).then(() => {});
            }
        }

        this.updateMarks();
    }

    onClickMark (item, isMarked) {
        if (isMarked) {
            this._dictSrv.openNode(item.id).then(() => {
            });
        } else {
            const selectedItems = this.markedNodes();
            const selectedCount = selectedItems.length;
            this._dictSrv.openNode(selectedCount ? selectedItems[0].id : '').then(() => {});
        }
        this.updateMarks();
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

        const subscription = this.modalWindow.content.onChoose.subscribe(() => {
            this.customFields = this._dictSrv.customFields;
            const _customTitles = this._dictSrv.customTitles;
            this.viewFields.forEach((vField) => {
                const _title = _customTitles.find((_f) => _f.key === vField.key);
                vField.customTitle = _title ? _title.customTitle : null;
            });


            if (!this.isCorrectOrderBy()) {
                this.orderBy = this._dictSrv.currentDictionary.orderDefault();
            }

            this._dictSrv.orderBy(this.orderBy, false);
            this._countColumnWidth();
            subscription.unsubscribe();
        });
    }

    isCorrectOrderBy(): boolean {
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

    openPrjDefaultValues(node: EosDictionaryNode) {
        this.modalWindow = this._modalSrv.show(PrjDefaultValuesComponent, {
            class: 'prj-default-values-modal moodal-lg'});
        const content = {
            nodeDescription: node.title,
            isnNode: node.data.rec['ISN_NODE'],
        };
        this.modalWindow.content.init(content);
    }

    openCopyProperties(node: EosDictionaryNode, fromParent: boolean) {
        this.modalWindow = this._modalSrv.show(CopyPropertiesComponent, {
            class: 'copy-properties-modal moodal-lg'});
        this.modalWindow.content.init(node.data.rec, fromParent);
    }

    getMarkedTitles(): string[] {
        return this.nodes
            .filter((node) => node.isMarked)
            .map((node) => node.title);
    }

    orderByField(fieldKey: string) {
        if (!this.orderBy || this.orderBy.fieldKey !== fieldKey) {
            this.orderBy = {
                fieldKey: fieldKey,
                ascend: true,
            };
        } else {
            this.orderBy.ascend = !this.orderBy.ascend;
        }
        this._dictSrv.orderBy(this.orderBy);
        this._cdr.detectChanges();
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

    /**
     * Toggle checkbox checked all
     */
    toggleAllMarks(): void {
        this.anyMarked = this.allMarked;
        this.anyUnmarked = !this.allMarked;
        this.nodes.forEach((node) => node.isMarked = this.allMarked);
        this._dictSrv.markItem(this.allMarked);
        const selectedItems = this.markedNodes();
        const selectedCount = selectedItems.length;
        this._dictSrv.openNode(selectedCount ? selectedItems[0].id : '').then(() => {});
    }

    toggleItem() {
        this.userOrdered(this.nodes);
    }

    updateMarks(): void {
        this.anyMarked = this.nodes.findIndex((node) => node.isMarked) > -1;
        this.anyUnmarked = this.nodes.findIndex((node) => !node.isMarked) > -1;
        this.allMarked = this.anyMarked;
        this._dictSrv.markItem(this.allMarked);
    }

    writeValues(nodes: EosDictionaryNode[]) {
        if (nodes && nodes.length) {
            this.sortableComponent.writeValue(nodes);
        }
    }

    moveUp(): void {
        if (!this._dictSrv.viewParameters.showAllSubnodes) {
            for (let i = 0; i < this.nodes.length; i++) {
                const element = this.nodes[i];
                if (element.isMarked) {
                    if (i > 0) {
                        const item = this.nodes[i - 1];
                        if (!item.isMarked) {
                            this.nodes[i - 1] = this.nodes[i];
                            this.nodes[i] = item;
                        }
                    }
                }
            }
            this.userOrdered(this.nodes);
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
                                    this.nodes[targ_idx] = this.nodes[m];
                                    this.nodes[m] = item;
                                }
                            }
                            break;
                        }
                    }
                }
            }
            this.userOrdered(this.nodes);
        }
    }

    moveDown(): void {
        if (!this._dictSrv.viewParameters.showAllSubnodes) {
            for (let i = this.nodes.length - 1; i >= 0; i--) {
                const element = this.nodes[i];
                if (element.isMarked) {
                    if (i < this.nodes.length - 1) {
                        const item = this.nodes[i + 1];
                        if (!item.isMarked) {
                            this.nodes[i + 1] = this.nodes[i];
                            this.nodes[i] = item;
                        }
                    }
                }
            }
            this.userOrdered(this.nodes);
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
                                    this.nodes[targ_idx] = this.nodes[m];
                                    this.nodes[m] = item;
                                }
                            }
                            break;
                        }
                    }
                }
            }
            this.userOrdered(this.nodes);
        }
    }

    export(dictionaryId: string): void {
        this._eiCl.openExport(dictionaryId).then().catch(err => { });
    }

    import(dictionaryId: string, nodeId: string): void {
        this._eiCl.openImport(dictionaryId, nodeId).then().catch(err => { });
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

    hasOverflowedColumns() {
        if (!this.nodeListElement) {
            return false;
        }
        return (this.nodeListElement.scrollWidth > this.nodeListElement.clientWidth);
    }

    isOverflowed() {
        return (this.params.firstUnfixedIndex !== 0) || this.hasOverflowedColumns();
    }

    onRightClick() {
        this._dictSrv.incFirstUnfixedIndex();
    }

    getSlicedCustomFields() {
        return this.customFields.slice(this.params.firstUnfixedIndex);
    }

    onLeftClick() {
        this._dictSrv.decFirstUnfixedIndex();
    }

    isShifted() {
        return (this.params.firstUnfixedIndex !== 0);
    }

    @HostListener('window:resize')
    onResize() {
        this._countColumnWidth();
    }

    private _countColumnWidth() {
        const calcLength = [];
        let fullWidth = 0;

        const fields: IFieldView[] = this.viewFields.concat(this.customFields);

        fields.forEach((_f) => {
            const element = document.getElementById('vf_' + _f.key);
            if (element) {
                const itemWidth = element.clientWidth ? element.clientWidth : ITEM_WIDTH_FOR_NAN;
                calcLength[_f.key] = itemWidth;
                fullWidth += itemWidth;
            }
        });

        this.length = calcLength;

        if (this.isOverflowed()) {
            this.min_length = [];
        } else {
            const minLength = [];
            const lastField = fields[fields.length - 1];
            if (lastField.type !== E_FIELD_TYPE.boolean) {
                minLength[lastField.key] = (this._holder.clientWidth - (fullWidth - this.length[lastField.key])) - 50;
                this.length[lastField.key] = minLength[lastField.key];
            }
            this.min_length = minLength;
        }

        this._cdr.detectChanges();
    }



}
