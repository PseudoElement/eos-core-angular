import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';
import { TDefaultField } from 'eos-dictionaries/adv-card/rk-default-values/rk-default-const';

export enum EOSDICTS_VARIANT {
    base,
    CB, // ЦБ
    Nadzor, // Надзор
}
export interface IOESDictsFeatures {
    version: string;
    variant: EOSDICTS_VARIANT;
    departments: {
        numcreation: boolean; /* галка Номерообразование */
        reestr_send: boolean; /* галка Отправлять документы по реестрам */
        gas_ps: boolean; /* ГАС ПС */
        stamp: boolean; /* угловой штамп */
        userCreateButton: boolean; /* кнопка "создать юзера" для ДЛ */
    };
    docgroups: IEOSFDocGroups;
    rkdefaults: IEOSRKDefaults;
    SEV: IEOSSevConfig;

}

export interface IEOSSevConfig {
    isIndexesEnable: boolean; /* Нужны ли Поля "индекс СЭВ" в справочниках, (SEV_ASSOCIATION)*/
}

export interface IEOSRKDefaults {
    calendarControl: E_FIELD_TYPE;
    calendarValues: any[];
    appendFields: TDefaultField[];
}

export interface IEOSFDocGroups {
    templates: IEOSFDocGroupsTemplates;
}

export interface IEOSFDocGroupsTemplates {
    N: boolean;
    E: boolean;
    F: boolean;
    D: boolean;
    VALID_TEMPLATE_EXPR: RegExp;
    INVALID_TEMPLATE_TEXT: string;
    VALID_PRJ_TEMPLATE_EXPR: RegExp;
    INVALID_PRJ_TEMPLATE_TEXT: string;
}
