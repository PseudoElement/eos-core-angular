import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';
import { TDefaultField } from 'eos-dictionaries/adv-card/rk-default-values/rk-default-const';
import { DGTplElement } from 'eos-dictionaries/helpers/numcreation-template.interface';

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
        datesReq: boolean; /* требовать дату начала */
    };
    docgroups: IEOSFDocGroups;
    rkdefaults: IEOSRKDefaults;
    SEV: IEOSSevConfig;
    nodeList: IEOSNodeListPreferences;
    canEditLogicDeleted: boolean;

}

export enum E_LIST_ENUM_TYPE {
    marked, // Только выделенные
    allInFolder, // все в пределах родительской ноды
}
export interface  IEOSNodeListPreferences {
    enumerationType: E_LIST_ENUM_TYPE; // как перелистывать ноды (предыдущая\следущая)
}

export interface IEOSSevConfig {
    isIndexesEnable: boolean; /* Нужны ли Поля "индекс СЭВ" в справочниках, (SEV_ASSOCIATION)*/
    isDictsEnabled: boolean; /* Доступны ли справочники СЭВ */
}

export interface IEOSRKDefaults {
    calendarControl: E_FIELD_TYPE;
    calendarValues: any[];
    calendarValuesDefault: string;
    appendFields: TDefaultField[];
}

export interface IEOSFDocGroups {
    templates: IEOSFDocGroupsTemplates;
}


export interface IEOSTPLVariant {
    list: DGTplElement[];
    validationExpr: RegExp;
    invalidText: string; // TODO: генерить
}
export interface IEOSFDocGroupsTemplates {
    doc: IEOSTPLVariant;
    prj: IEOSTPLVariant;

    // N: boolean;
    // E: boolean;
    // F: boolean;
    // D: boolean;
    // VALID_TEMPLATE_EXPR: RegExp;
    // INVALID_TEMPLATE_TEXT: string;
    // VALID_PRJ_TEMPLATE_EXPR: RegExp;
    // INVALID_PRJ_TEMPLATE_TEXT: string;
}
