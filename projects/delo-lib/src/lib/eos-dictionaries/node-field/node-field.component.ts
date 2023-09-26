import { Component, EventEmitter, Input, Output, OnInit, } from '@angular/core';
import { IFieldView, E_FIELD_TYPE } from '../interfaces';
import { HintConfiguration } from '../long-title-hint/hint-configuration.interface';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { TOOLTIP_DELAY_VALUE } from '../../eos-common/services/eos-tooltip.service';
import { Features } from '../../eos-dictionaries/features/features-current.const';
import { RESOLVE_DESCRIPTIONS } from '../../eos-dictionaries/consts/dictionaries/sev/templates-sev.consts';
import { CHANNEL_TYPE } from '../../eos-dictionaries/consts/dictionaries/sev/types.consts';
import { EosCommonOverriveService } from '../../app/services/eos-common-overrive.service';

interface ISpecialIcon {
    class: string;
    tooltip: string;
    title?: string;
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

    constructor(private _eosCommonOverride: EosCommonOverriveService) {
    }

    viewNode(evt: Event) {
        if (this.getFolderIcon() !== 'emptyicon') { // делаю так чтобы нажатие на папку работало только если папка видна
            this.view.emit(evt);
        }
    }
    getIcons() {
        if (this.node.dictionaryId === 'organization') {
            const icons = [];
            if (Features.cfg.SEV.isIndexesEnable && this.node.data.sev && this.node.data.sev['GLOBAL_ID']) {
                icons.push({
                    class: this.node.isDeleted ? 'eos-adm-icon-shared-folder-grey' : 'eos-adm-icon-shared-folder-black',
                    tooltip: 'Индекс СЭВ',
                });
            }
            if (this.node.data.rec['CONFIDENTIONAL']) {
                icons.push({
                    class: this.node.isDeleted ? 'eos-adm-icon-restricted-grey' : 'eos-adm-icon-restricted-blue',
                    tooltip: 'ДСП файлы',
                });
            }
            return icons;
        }
        return this.iconsArray;
    }
    ngOnInit(): void {
        this._hasFolderIcon = this.field.preferences && this.field.preferences.hasIcon;    
        if (this.field.type === E_FIELD_TYPE.icon) {
            if (this.node.data.rec['CARD_FLAG']) {
                this.iconsArray.push({
                    class: this.node.isDeleted ? 'eos-adm-icon-card-index-grey' : 'eos-adm-icon-card-index-black',
                    tooltip: 'Картотека',
                });
            }

            if (this.node.data.rec['DOCNUMBER_FLAG'] || this.node.data.rec['NUMCREATION_FLAG']) {
                this.iconsArray.push({
                    class: this.node.isDeleted ? 'eos-adm-icon-checkbox-grey' : 'eos-adm-icon-checkbox-black',
                    tooltip: 'Номерообразование',
                });
            }
            if (this.node.data.rec['UNREAD_FLAG']) {
                this.iconsArray.push({
                    class: this.node.isDeleted ? 'eos-icon-alert-grey' : 'eos-icon-alert-yellow',
                    tooltip: 'Непроверенная запись',
                });
            }
            if (this.node.data.rec['CARD_FLAG']) {
                this.iconsArray.push({
                    class: this.node.isDeleted ? 'eos-icon-card-index-grey' : 'eos-icon-card-index-black',
                    tooltip: 'Картотека',
                });
            }
            if (this.node.data.rec['POST_H'] === 1) {
                this.iconsArray.push({
                    class: this.node.isDeleted ? 'eos-adm-icon-user-ceo-grey' : 'eos-adm-icon-user-ceo-black',
                    tooltip: 'Начальник',
                });
            }
            if (this.node.data.rec['CLOSED'] === 1) {
                this.iconsArray.push({
                    class: 'eos-adm-icon-deal-close-blue',
                    tooltip: 'Закрыто',
                });
            }
            this._eosCommonOverride.updateNodeFields(this);
        } else if (this.field.type === E_FIELD_TYPE.icon_sev) {
            if (Features.cfg.SEV.isIndexesEnable && this.node.data.sev && this.node.data.sev['GLOBAL_ID']) {
                this.iconsArray.push({
                    class: this.node.isDeleted ? 'eos-adm-icon-shared-folder-grey' : 'eos-adm-icon-shared-folder-black',
                    tooltip: 'Индекс СЭВ',
                });
            }
            if (this.node.data.rec['CONFIDENTIONAL']) {
                this.iconsArray.push({
                    class: this.node.isDeleted ? 'eos-adm-icon-restricted-grey' : 'eos-adm-icon-restricted-blue',
                    tooltip: 'ДСП файлы',
                });
            }
        }
        // костыль для участников СЭВ, отображение иконки типа передачи сообщений
        if (this.isSevChannelType()) {
            const ITEMS = this.field.options[0].data;
            const NEED_ITEM = ITEMS.filter(x => x.ISN_LCLASSIF === this.field.value);
            const CHANNEL_TYPE_VALUE: string = NEED_ITEM[0].CHANNEL_TYPE;
            const CHANNNEL_OBJ = (CHANNEL_TYPE.filter( item =>  item.value === CHANNEL_TYPE_VALUE))[0];
            this.iconsArray.push({
                class: !this.node.isDeleted ? CHANNNEL_OBJ.iconClass.standard : CHANNNEL_OBJ.iconClass.deleted,
                tooltip: CHANNNEL_OBJ.iconClass.tooltip,
                title: NEED_ITEM[0]['CLASSIF_NAME']
            });
       }
    }

    isSevChannelType(): boolean {
       return this.field.dictionaryId === 'SEV_CHANNEL';
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
                    return 'eos-adm-icon-folder-grey';
            } else {
                    return 'eos-adm-icon-folder-blue';
            }
        }

        return 'emptyicon';
    }

    // get isCertificate() {
    //     return !!this.node.data.rec.ID_CERTIFICATE;
    // }
}
