import { Component, EventEmitter, Input, Output, OnInit, } from '@angular/core';
import { IFieldView, E_FIELD_TYPE } from '../interfaces';
import { HintConfiguration } from '../long-title-hint/hint-configuration.interface';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { TOOLTIP_DELAY_VALUE } from 'eos-common/services/eos-tooltip.service';
import { Features } from 'eos-dictionaries/features/features-current.const';
import { RESOLVE_DESCRIPTIONS } from 'eos-dictionaries/consts/dictionaries/sev/templates-sev.consts';

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
        this._hasFolderIcon = this.field.preferences && this.field.preferences.hasIcon;
        if (this.field.type === E_FIELD_TYPE.icon) {
            if (this.node.data.rec['CARD_FLAG']) {
                this.iconsArray.push({
                    class: this.node.isDeleted ? 'eos-icon-card-index-grey' : 'eos-icon-card-index-black',
                    tooltip: 'Картотека',
                });
            }

            if (this.node.data.rec['DOCNUMBER_FLAG'] || this.node.data.rec['NUMCREATION_FLAG']) {
                this.iconsArray.push({
                    class: this.node.isDeleted ? 'eos-icon-checkbox-grey' : 'eos-icon-checkbox-black',
                    tooltip: 'Номерообразование',
                });
            }
            if (this.node.data.rec['POST_H'] === 1) {
                this.iconsArray.push({
                    class: this.node.isDeleted ? 'eos-icon-user-ceo-grey' : 'eos-icon-user-ceo-blue',
                    tooltip: 'Начальник',
                });
            }


        } else if (this.field.type === E_FIELD_TYPE.icon_sev) {
            if (Features.cfg.SEV.isIndexesEnable && this.node.data.sev && this.node.data.sev['GLOBAL_ID']) {
                this.iconsArray.push({
                    class: this.node.isDeleted ? 'eos-icon-shared-folder-grey' : 'eos-icon-shared-folder-blue',
                    tooltip: 'Индекс СЭВ',
                });
            }
            if (this.node.data.rec['CONFIDENTIONAL']) {
                this.iconsArray.push({
                    class: this.node.isDeleted ? 'eos-icon-restricted-grey' : 'eos-icon-restricted-blue',
                    tooltip: 'ДСП файлы',
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
        if (this.field.key === 'RESOLVE_TYPE') {
            value = RESOLVE_DESCRIPTIONS[--value].title;
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
