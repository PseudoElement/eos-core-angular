import {Component, ViewChild, OnDestroy, OnInit, Inject, ChangeDetectorRef, AfterContentInit, AfterContentChecked} from '@angular/core';
import {SortableComponent, BsModalRef, BsModalService} from 'ngx-bootstrap';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import {EosDictionaryNode} from '../core/eos-dictionary-node';
import {EosDictService} from '../services/eos-dict.service';
import {IDictionaryViewParameters, IFieldView, IOrderBy, E_FIELD_SET} from 'eos-dictionaries/interfaces';
import {LongTitleHintComponent} from '../long-title-hint/long-title-hint.component';
import {HintConfiguration} from '../long-title-hint/hint-configuration.interface';
import {ColumnSettingsComponent} from '../column-settings/column-settings.component';
import {AdditionalFieldsComponent} from '../additional-fields/additional-fields.component';
import {EosUtils} from 'eos-common/core/utils';
import {DOCUMENT} from '@angular/common';

const ITEM_WIDTH_FOR_NAN = 100;
const MAX_PERCENT_WIDTH = 98;

@Component({
    selector: 'eos-node-list',
    templateUrl: 'node-list.component.html',
})
export class NodeListComponent implements OnInit, OnDestroy, AfterContentInit, AfterContentChecked {
    @ViewChild(SortableComponent) sortableComponent: SortableComponent;
    @ViewChild(LongTitleHintComponent) hint: LongTitleHintComponent;

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

    private ngUnsubscribe: Subject<any> = new Subject();
    private nodeListElement: Element;

    constructor(
        @Inject(DOCUMENT) document,
        private dictSrv: EosDictService,
        private modalSrv: BsModalService,
        private cdr: ChangeDetectorRef,
    ) {

        dictSrv.visibleList$.takeUntil(this.ngUnsubscribe)
            .subscribe((nodes: EosDictionaryNode[]) => {
                if (dictSrv.currentDictionary) {

                    this.customFields = this.dictSrv.customFields;
                    this.updateViewFields(this.customFields);

                    const _customTitles = this.dictSrv.customTitles;
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

        dictSrv.viewParameters$
            .takeUntil(this.ngUnsubscribe)
            .subscribe((params: IDictionaryViewParameters) => {
                this.params = params;
                if (this.dictSrv.userOrdered) {
                    this.orderBy = null;
                } else {
                    if (dictSrv.currentDictionary) {
                        this.orderBy = dictSrv.currentDictionary.orderBy;
                    }
                }
            });
    }

    updateViewFields(customFields: IFieldView[]) {
        // also customFields for update
        this.viewFields = this.dictSrv.currentDictionary.getListView(customFields);
    }

    ngOnInit() {
        const c = this.viewFields.length + this.customFields.length;

        this.viewFields.forEach((_f) => {
            const element = document.getElementById('vf_' + _f.key);
            if (element) {
                // this.length[_f.key] = element.clientWidth;
                this.min_length[_f.key] = 100 / c;
            }
        });

        this.customFields.forEach((_f) => {
            const element = document.getElementById('vf_' + _f.key);
            if (element) {
                // this.length[_f.key] = element.clientWidth;
                this.min_length[_f.key] = 100 / c;
            }
        });

    }

    ngAfterContentChecked() {
        // TODO: remove freq. updates
        this._countColumnWidth();
    }

    ngAfterContentInit() {
        this.nodeListElement = document.querySelector('.node-title');
        this._countColumnWidth();
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    checkState() {
        this.updateMarks();
    }

    /**
     * @description Open modal with ColumnSettingsComponent, fullfill ColumnSettingsComponent data
     */
    configColumns() {
        this.modalWindow = this.modalSrv.show(ColumnSettingsComponent, {class: 'column-settings-modal modal-lg'});
        this.modalWindow.content.fixedFields = EosUtils.deepUpdate([], this.viewFields);
        this.modalWindow.content.customTitles = EosUtils.deepUpdate([], this.dictSrv.customTitles);
        this.modalWindow.content.currentFields = EosUtils.deepUpdate([], this.customFields);
        this.modalWindow.content.dictionaryFields = EosUtils.deepUpdate([],
            this.dictSrv.currentDictionary.descriptor.record.getFieldSet(E_FIELD_SET.allVisible));

        const subscription = this.modalWindow.content.onChoose.subscribe(() => {
            this.customFields = this.dictSrv.customFields;
            const _customTitles = this.dictSrv.customTitles;
            this.viewFields.forEach((vField) => {
                const _title = _customTitles.find((_f) => _f.key === vField.key);
                vField.customTitle = _title ? _title.customTitle : null;
            });
            this.dictSrv.orderBy(this.orderBy, false);
            subscription.unsubscribe();
        });
    }

    openAdditionalFields(node: EosDictionaryNode) {
        this.modalWindow = this.modalSrv.show(AdditionalFieldsComponent, {class: 'additional-fields-modal modal-lg'});
        this.modalWindow.content.nodeDescription = node.title;
        this.modalWindow.content.data = node.data;
        this.modalWindow.content.nodes = this.nodes;
        this.modalWindow.content.init('3');
     }

    getMarkedTitles(): string[] {
        return this.nodes
            .filter((node) => node.marked)
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
        this.dictSrv.orderBy(this.orderBy);
        this.cdr.detectChanges();
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
        this.nodes.forEach((node) => node.marked = this.allMarked);
        this.dictSrv.markItem(this.allMarked);
    }

    toggleItem() {
        this.userOrdered(this.nodes);
    }

    updateMarks(): void {
        this.anyMarked = this.nodes.findIndex((node) => node.marked) > -1;
        this.anyUnmarked = this.nodes.findIndex((node) => !node.marked) > -1;
        this.allMarked = this.anyMarked;
        this.dictSrv.markItem(this.allMarked);
    }

    writeValues(nodes: EosDictionaryNode[]) {
        if (nodes && nodes.length) {
            this.sortableComponent.writeValue(nodes);
        }
    }


    moveUp(): void {
        const _idx = this.nodes.findIndex((node) => node.isSelected);

        if (_idx > 0) {
            const item = this.nodes[_idx - 1];
            this.nodes[_idx - 1] = this.nodes[_idx];
            this.nodes[_idx] = item;
            this.userOrdered(this.nodes);
        }
    }

    moveDown(): void {
        const _idx = this.nodes.findIndex((node) => node.isSelected);
        if (_idx < this.nodes.length - 1) {
            const item = this.nodes[_idx + 1];
            this.nodes[_idx + 1] = this.nodes[_idx];
            this.nodes[_idx] = item;
            this.userOrdered(this.nodes);
        }
    }

    userOrdered(nodes: EosDictionaryNode[]) {
        this.dictSrv.setUserOrder(nodes);
    }

    openNodeNavigate(backward = false): void {
        let _idx = this.nodes.findIndex((node) => node.isSelected);

        if (backward) {
            if (_idx > -1) {
                _idx--;
            }
        } else {
            _idx++;
        }
        _idx = (_idx + this.nodes.length) % this.nodes.length;

        const node = this.nodes[_idx];
        if (node && node.id) {
            this.dictSrv.openNode(node.id);
        }
    }

    onListScroll(evt: Event) {
        const offset = evt.srcElement.scrollLeft;
        this.headerOffset = -offset;

        // Fix for unhidden tooltip in IE
        const element = document.querySelector('.tooltip');
        if (element) {
            element.setAttribute('style', 'display: none');
        }
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
        this.dictSrv.incFirstUnfixedIndex();
    }

    getSlicedCustomFields() {
        return this.customFields.slice(this.params.firstUnfixedIndex);
    }

    onLeftClick() {
        this.dictSrv.decFirstUnfixedIndex();
    }

    isShifted() {
        return (this.params.firstUnfixedIndex !== 0);
    }

    private _countColumnWidth() {
        // console.log('recalc');
        let length = [];
        this.viewFields.forEach((_f) => {
            const element = document.getElementById('vf_' + _f.key);
            if (element) {
                length[_f.key] = element.clientWidth;
            }
        });

        this.customFields.forEach((_f) => {
            const element = document.getElementById('vf_' + _f.key);
            if (element) {
                length[_f.key] = element.clientWidth;
            }
        });

        this.length = length;
        length = [];

        if (this.isOverflowed()) {
            this.min_length = [];
            // console.log('over');
        } else {
            // console.log('!over');
            let fullWidth = 0;

            this.viewFields.forEach((_f) => {
                const itemWidth = this.length[_f.key];
                length[_f.key] = itemWidth;
                fullWidth += itemWidth;
            });

            if (this.customFields) {
                this.customFields.forEach((_f) => {
                    const itemWidth = this.length[_f.key] ? this.length[_f.key] : ITEM_WIDTH_FOR_NAN;
                    length[_f.key] = itemWidth;
                    fullWidth += itemWidth;
                });
                this.customFields.forEach((_f) => {
                    length[_f.key] = length[_f.key] / fullWidth * MAX_PERCENT_WIDTH;
                });
            }
            this.viewFields.forEach((_f) => {
                length[_f.key] = length[_f.key] / fullWidth * MAX_PERCENT_WIDTH;
            });

            this.min_length = length;
        }

        this.cdr.detectChanges();
    }


}
