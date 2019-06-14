import { DOCGROUP_DICT } from './../consts/dictionaries/docgroup.consts';
import { DEPARTMENTS_DICT } from './../consts/dictionaries/department.consts';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { IFieldView, E_FIELD_TYPE } from '../interfaces';
import { HintConfiguration } from '../long-title-hint/hint-configuration.interface';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { TOOLTIP_DELAY_VALUE } from 'eos-common/services/eos-message.service';

@Component({
    selector: 'eos-node-field',
    templateUrl: 'node-field.component.html'
})
export class NodeFieldComponent implements OnInit {
    @Input() field: IFieldView;
    @Input() node: EosDictionaryNode;
    @Input() width: number;
    @Output() view: EventEmitter<any> = new EventEmitter<any>();
    @Output() fieldHover: EventEmitter<HintConfiguration> = new EventEmitter<HintConfiguration>();

    tooltipDelay = TOOLTIP_DELAY_VALUE;
    types = E_FIELD_TYPE;
    length = {};
    private _hasIcon: boolean;

    constructor() {
    }

    viewNode(evt: Event) {
        this.view.emit(evt);
    }

    ngOnInit(): void {
        this._hasIcon = this.node.dictionary.isTreeType() && (this.field.key === 'CLASSIF_NAME' || this.field.foreignKey === 'CLASSIF_NAME')
            && (this.node.dictionary.id === DEPARTMENTS_DICT.id || this.node.dictionary.id === DOCGROUP_DICT.id);
        // this._hasIcon = this.node.isNode && (this.field.key === 'CLASSIF_NAME' || this.field.foreignKey === 'CLASSIF_NAME');
    }

    currentValue(): string {
        let value = this.field.value;
        if (value !== undefined && value !== null) {
            const optValue = this.field.options.find((option) => option.value === this.field.value);
            if (optValue) {
                value = optValue.title;
            }
        }
        return value;
    }

    decodeDictionary(): string {
        return this.node.getFieldValue(this.field);
    }

    get tooltipValue(): string {
        if (this.field.key === 'CODE') {
            return '';
        } else if (this.field.type === E_FIELD_TYPE.select) {
            return this.currentValue();
        } else if (this.field.type === E_FIELD_TYPE.dictionary) {
            return this.decodeDictionary();
        } else if (this.field.type === E_FIELD_TYPE.date) {
            return this.field.value ? this.field.value.split('T')[0] : '';
        } else if (this.field.type === E_FIELD_TYPE.boolean) {
            if (this.field.value) {
                return 'Да';
            } else {
                return '';
            }
        }
        return this.field.value;
    }

    specialIcon () {
        if (this.node.data.rec['DOCNUMBER_FLAG'] || this.node.data.rec['NUMCREATION_FLAG']) {
            return true;
        }
        return false;
    }

    get hasIcon(): boolean {
        return this._hasIcon;
    }

    getIcon() {
        if (this.node.isNode) {
            if (this.node.isDeleted) {
                if (this.node.data.rec['CARD_FLAG']) {
                    return 'eos-icon-card-index-grey';
                } else {
                    return 'eos-icon-folder-grey';
                }
            } else {
                if (this.node.data.rec['CARD_FLAG']) {
                    return 'eos-icon-card-index-blue';
                } else {
                    return 'eos-icon-folder-blue';
                }
            }
        } else {
            return 'emptyicon';
        }
    }
}
