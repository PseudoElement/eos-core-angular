import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { IFieldView, E_FIELD_TYPE } from '../interfaces';
import { HintConfiguration } from '../long-title-hint/hint-configuration.interface';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { TOOLTIP_DELAY_VALUE } from 'eos-common/services/eos-message.service';
import { ICONS_CONTAINER } from 'eos-dictionaries/consts/dictionaries/_common';


interface ISpecialIcon {
    class: string;
    tooltip: string;
}

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
    iconsArray: ISpecialIcon[] = [];
    private _hasFolderIcon: boolean;

    constructor() {
    }

    viewNode(evt: Event) {
        this.view.emit(evt);
    }

    ngOnInit(): void {
        this._hasFolderIcon = this.node.dictionary.isTreeType() && (this.field.key === 'CLASSIF_NAME' || this.field.foreignKey === 'CLASSIF_NAME');

        if (this.field.type === E_FIELD_TYPE.icon) {
            if (this.node.data.rec['CARD_FLAG']) {
                this.iconsArray.push({
                    class: this.node.isDeleted ? 'eos-icon-card-index-grey' : 'eos-icon-card-index-blue',
                    tooltip: 'Картотека',
                });
            }

            if (this.node.data.rec['DOCNUMBER_FLAG'] || this.node.data.rec['NUMCREATION_FLAG']) {
                this.iconsArray.push({
                    class: this.node.isDeleted ? 'eos-icon-checkbox-grey' : 'eos-icon-checkbox-blue',
                    tooltip: 'Номерообразование',
                });
            }

        }
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
        if (this.field.value && this.field.value.length < 6) {
            return '';
        }
        return this.field.value;
    }

    get hasFolderIcon(): boolean {
        return this._hasFolderIcon;
    }

    public getFolderIcon() {
        if (this.node.isNode) {
            if (this.node.isDeleted) {
                    return 'eos-icon-folder-grey';
            } else {
                    return 'eos-icon-folder-blue';
            }
        }
        return 'emptyicon';
    }
}
