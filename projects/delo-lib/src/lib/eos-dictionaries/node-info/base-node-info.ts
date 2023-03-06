import { Component, Input, OnChanges, } from '@angular/core';
import { E_FIELD_TYPE } from '../../eos-dictionaries/interfaces';
import { EosDictionaryNode } from '../../eos-dictionaries/core/eos-dictionary-node';
import { Features } from '../../eos-dictionaries/features/features-current.const';

@Component({
    template: ''
})
export class BaseNodeInfoComponent implements OnChanges {
    @Input() node: EosDictionaryNode;

    fieldsDescriptionShort: any;
    nodeDataShort: any;
    fieldsDescriptionFull: any;
    nodeDataFull: any;

    fieldTypes = E_FIELD_TYPE;
    values = {};
    isSevIndexesEnable: boolean;

    constructor() {
        this.isSevIndexesEnable = Features.cfg.SEV.isIndexesEnable;
    }
    keys(data: Object): string[] {
        if (data) {
            return Object.keys(data);
        }
    }

    ngOnChanges() {
        this.values = {};
        if (this.node) {
            this.fieldsDescriptionShort = this.node.getShortViewFieldsDescription();
            this.nodeDataShort = this.node.getShortViewData();
            this.fieldsDescriptionFull = this.node.getFullViewFieldsDescription();
            this.nodeDataFull = this.node.getFullViewData();
        } else {
            this._initInfo();
        }
    }

    private _initInfo() {
        this.fieldsDescriptionFull = {};
        this.fieldsDescriptionShort = {};
        this.nodeDataFull = {};
        this.nodeDataShort = {};

    }

}
