import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

import { EosStorageService } from 'app/services/eos-storage.service';

import { RECENT_URL } from 'app/consts/common.consts';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { IDictionaryViewParameters, IFieldView, E_RECORD_ACTIONS } from 'eos-dictionaries/interfaces';
import { HintConfiguration } from '../long-title-hint/hint-configuration.interface';
import { EosUtils } from 'eos-common/core/utils';
import { E_VISIBLE_TIPE } from '../interfaces/dictionary.interfaces';
import { EosBreadcrumbsService } from 'app/services/eos-breadcrumbs.service';
import { Features } from 'eos-dictionaries/features/features-current.const';

@Component({
    selector: 'eos-node-list-item',
    templateUrl: 'node-list-item.component.html'
})

export class NodeListItemComponent implements OnInit, OnChanges {
    @ViewChild('item') item: ElementRef;
    @Input() node: EosDictionaryNode;
    @Input() params: IDictionaryViewParameters;
    @Input() length: any = {};
    @Input() customFields: IFieldView[];
    @Input() firstColumnIndex: number;
    @Output() clickMark: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() clickSelect: EventEmitter<EosDictionaryNode> = new EventEmitter<EosDictionaryNode>();
    @Output() onHoverItem: EventEmitter<HintConfiguration> = new EventEmitter<HintConfiguration>();

    viewFields: IFieldView[];
    custom: IFieldView[];
    customSliced: IFieldView[];

    constructor(
        private _storageSrv: EosStorageService,
        private _dictSrv: EosDictService,
        private _router: Router,
        private _breadcrumbsSrv: EosBreadcrumbsService,
    ) {
        this.viewFields = [];
        this.custom = [];
        this.customSliced = [];
    }

    ngOnInit() {
        this.viewFields = this.node.getListView();
    }

    ngOnChanges(changes: SimpleChanges) {

        for (const propName in changes) {
            if (changes.hasOwnProperty(propName)) {
                // const change = changes[propName];
                if (propName === 'node') {
                    if (this.viewFields) {
                        this.viewFields.forEach((_field) => {
                            this._updateFieldValue(_field);
                        });
                    }
                 } else if (propName === 'customFields') {
                    if (this.customFields) {
                        this.custom = EosUtils.deepUpdate({}, this.customFields);
                        this.custom.forEach((_field) => {
                            this._updateFieldValue(_field);
                        });
                        this.customSliced = this.custom.slice(this.firstColumnIndex);
                    }
                 } else if (propName === 'firstColumnIndex') {
                    if (this.custom) {
                        this.customSliced = this.custom.slice(this.firstColumnIndex);
                    }
                 }
            }
        }


    }

    selectNode(evt: Event): void {
        // evt.stopPropagation();
        this.clickSelect.emit(this.node);
    }

    markNode(marked: boolean) {
        this.clickMark.emit(marked);
    }

    viewNode(evt: MouseEvent, view = false) {
        evt.stopPropagation();
        const id = this._dictSrv.currentDictionary.id;

        if ((id === 'citizens' || id === 'organization') && !this.node.isNode && !view) {
            this._breadcrumbsSrv.sendAction({action: E_RECORD_ACTIONS.edit, params: {mode: 'view'}});
            return;
        }
        if (!this._dictSrv.isRoot(this.node.id) && (!this.node.isDeleted || Features.cfg.canEditLogicDeleted)) {
            const _path = this.node.getPath();
            if (!this.node.isNode || view) {
                this._storageSrv.setItem(RECENT_URL, this._router.url);
                _path.push('view');
            }
            this._router.navigate(_path);
        }
    }

    onFieldHover(config: HintConfiguration) {
        this.onHoverItem.emit(config);
    }

    private _updateFieldValue(_field: IFieldView) {
        const is_node = this.node.data.rec['IS_NODE'];
        if ((_field.vistype !== undefined) && (is_node !== undefined)) {
            if (_field.vistype === E_VISIBLE_TIPE.onlyNode && is_node) {
                _field.value = this.node.getValue(_field);
            } else if (_field.vistype === E_VISIBLE_TIPE.onlyChild && !is_node) {
                _field.value = this.node.getValue(_field);
            } else if (_field.vistype === E_VISIBLE_TIPE.fromParentIfNode) {
                if (is_node) {
                    _field.value = this.node.parent ? this.node.parent.data.rec[_field.foreignKey] : '';
                } else {
                    _field.value = this.node.getValue(_field);
                }
            } else {
                _field.value = '';
            }
        } else {
            _field.value = this.node.getValue(_field);
        }
    }


}
