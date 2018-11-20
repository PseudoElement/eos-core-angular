import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { Router } from '@angular/router';

import { EosStorageService } from 'app/services/eos-storage.service';

import { RECENT_URL } from 'app/consts/common.consts';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { IDictionaryViewParameters, IFieldView } from 'eos-dictionaries/interfaces';
import { HintConfiguration } from '../long-title-hint/hint-configuration.interface';
import { EosUtils } from 'eos-common/core/utils';

@Component({
    selector: 'eos-node-list-item',
    templateUrl: 'node-list-item.component.html'
})

export class NodeListItemComponent implements OnInit, OnChanges {
    @ViewChild('item') item: ElementRef;
    @Input('node') node: EosDictionaryNode;
    @Input('params') params: IDictionaryViewParameters;
    @Input('length') length: any = {};
    @Input('customFields') customFields: IFieldView[];
    @Output('mark') mark: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output('onHoverItem') onHoverItem: EventEmitter<HintConfiguration> = new EventEmitter<HintConfiguration>();

    viewFields: IFieldView[];
    custom: IFieldView[];

    customValues: any = {};

    constructor(
        private _storageSrv: EosStorageService,
        private _dictSrv: EosDictService,
        private _router: Router,
    ) { }

    ngOnInit() {
        this.viewFields = this.node.getListView();

    }

    ngOnChanges() {
        if (this.customFields) {
            this.custom = EosUtils.deepUpdate({}, this.customFields);
            this.custom.forEach((_field) => {
                _field.value = this.node.getValue(_field);
                // this.customValues[_field.key] = this.node.getValue(_field);
            });
        }
    }

    selectNode(evt: Event): void {
        evt.stopPropagation();
        this.openNode();
    }

    markNode(marked: boolean) {
        this.node.marked = marked;
        this.mark.emit(this.node.marked);
        if (!this._dictSrv.listNode) {
            this.openNode();
        }
    }

    viewNode(evt: MouseEvent, view = false) {
        evt.stopPropagation();
        if (!this._dictSrv.isRoot(this.node.id) && !this.node.isDeleted) {
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

    private openNode() {
        if (!this.node.isDeleted && this.node.id !== '') {
            this._dictSrv.openNode(this.node.id);
            this.mark.emit(true);
        }
    }
}
