import {Component, ViewChild, OnDestroy, OnInit, Inject, AfterViewChecked, ChangeDetectorRef} from '@angular/core';
import {SortableComponent, BsModalRef, BsModalService} from 'ngx-bootstrap';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import {EosDictionaryNode} from '../core/eos-dictionary-node';
import {EosDictService} from '../services/eos-dict.service';
import {IDictionaryViewParameters, IFieldView, IOrderBy, E_FIELD_SET} from 'eos-dictionaries/interfaces';
import {LongTitleHintComponent} from '../long-title-hint/long-title-hint.component';
import {HintConfiguration} from '../long-title-hint/hint-configuration.interface';
import {ColumnSettingsComponent} from '../column-settings/column-settings.component';
import {EosUtils} from 'eos-common/core/utils';
import {EosDictionary} from '../core/eos-dictionary';
import {DictionaryDescriptorService} from '../core/dictionary-descriptor.service';
import {DOCUMENT} from '@angular/common';

const ITEM_WIDTH_FOR_NAN = 100;

@Component({
    selector: 'eos-node-list',
    templateUrl: 'node-list.component.html',
})
export class NodeListComponent implements AfterViewChecked, OnInit, OnDestroy {
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
    tableWidth = 0;
    headerOffset = 0;
    viewFields: IFieldView[] = [];
    already_calced = false;

    private ngUnsubscribe: Subject<any> = new Subject();

    constructor(
        @Inject(DOCUMENT) document,
        private dictSrv: EosDictService,
        private modalSrv: BsModalService,
        private descrSrv: DictionaryDescriptorService,
        private cdr: ChangeDetectorRef,
    ) {
        dictSrv.visibleList$.takeUntil(this.ngUnsubscribe)
            .subscribe((nodes: EosDictionaryNode[]) => {
                // console.log('visibleList', nodes);
                if (dictSrv.currentDictionary) {
                    this.customFields = this.dictSrv.customFields;
                    this.viewFields = this.dictSrv.currentDictionary.getListView();

                    this.viewFields.forEach((field) => {
                        if (field.dictionaryId !== undefined) {
                            const dict = new EosDictionary(field.dictionaryId, this.descrSrv);
                            dict.init()
                                .then(() => {
                                    dict.nodes.forEach((node) => {
                                        field.options.push(...[{value: node.originalId, title: node.title}]);
                                    });
                                });
                        } else if (field.key === 'IS_UNIQUE' && dictSrv.currentDictionary.id === 'reestrtype') {
                            nodes.forEach((node) => {
                                node.data.rec.IS_UNIQUE = 1;
                                nodes.forEach((neighbor) => {
                                    if (node.data.rec.ISN_ADDR_CATEGORY === neighbor.data.rec.ISN_ADDR_CATEGORY
                                        && node.data.rec.ISN_DELIVERY === neighbor.data.rec.ISN_DELIVERY
                                        && node.data.rec.ISN_LCLASSIF !== neighbor.data.rec.ISN_LCLASSIF) {
                                        node.data.rec.IS_UNIQUE = 0;
                                    }
                                });
                            });
                        }
                    });

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
                }, 0);
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

    ngAfterViewChecked() {

        if (!this.already_calced) {
            // this.already_calced = true;

            this.viewFields.forEach((_f) => {
                const element = document.getElementById('vf_' + _f.key);
                if (element) {
                    this.length[_f.key] = element.clientWidth;
                }
            });

            this.customFields.forEach((_f) => {
                const element = document.getElementById('vf_' + _f.key);
                if (element) {
                    this.length[_f.key] = element.clientWidth;
                }
            });
        }
        this.cdr.detectChanges();
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    checkState() {
        this.updateMarks();
        // this.checked.emit();
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
            this._countColumnWidth();
            subscription.unsubscribe();
        });
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
        // this.reordered.emit(this.nodes);
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

    isOverflowed() {
        const element = document.querySelector('.node-title');
        if (!element) {
            return false;
        }
        return element.scrollWidth > element.clientWidth;

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
        const length = {};
        if (this.isOverflowed()) {
            this.min_length = [];
            // console.log("over");
        } else {
            // console.log("!over");
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
                    length[_f.key] = length[_f.key] / fullWidth * 100;
                });
            }
            this.viewFields.forEach((_f) => {
                length[_f.key] = length[_f.key] / fullWidth * 100;
            });

            this.min_length = length;
        }
    }


}
