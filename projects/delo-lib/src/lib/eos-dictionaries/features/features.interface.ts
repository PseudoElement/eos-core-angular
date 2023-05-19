import { E_FIELD_TYPE } from '../../eos-dictionaries/interfaces';
import { TDefaultField } from '../../eos-dictionaries/adv-card/rk-default-values/rk-default-const';
import { DGTplElement } from '../../eos-dictionaries/helpers/numcreation-template.interface';

export enum EOSDICTS_VARIANT {
    base,
    CB, // ЦБ
    Nadzor, // Надзор
}

export interface IOESDictsFeatures {
    version: string;
    variant: EOSDICTS_VARIANT;
    departments: {
        /** галка Номерообразование */
        numcreation: boolean;
        /** галка Отправлять документы по реестрам */
        reestr_send: boolean;
        /** ГАС ПС */
        gas_ps: boolean;
        /** угловой штамп */
        stamp: boolean;
        /** кнопка "создать юзера" для ДЛ */
        userCreateButton: boolean;
        /** требовать дату начала */
        datesReq: boolean;
        /** Отображение колхозных справочников */
        calendar_depart: boolean,
    };
    docgroups: IEOSFDocGroups;
    rkdefaults: IEOSRKDefaults;
    SEV: IEOSSevConfig;
    nodeList: IEOSNodeListPreferences;
    canEditLogicDeleted: boolean;
}

export enum E_LIST_ENUM_TYPE {
    /** Только выделенные */
    marked,
    /**  все в пределах родительской ноды */
    allInFolder,
}
export interface  IEOSNodeListPreferences {
    /** как перелистывать ноды (предыдущая\следущая) */
    enumerationType: E_LIST_ENUM_TYPE;
}

export interface IEOSSevConfig {
    /** Нужны ли Поля "индекс СЭВ" в справочниках, (SEV_ASSOCIATION) */
    isIndexesEnable: boolean;
    /** Доступны ли справочники СЭВ */
    isDictsEnabled: boolean;
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
