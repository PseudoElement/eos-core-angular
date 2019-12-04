import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';

export interface IOESDictsFeatures {
    version: string;
    departments: {
        numcreation: boolean; /* галка Номерообразование */
        reestr_send: boolean; /* галка Отправлять документы по реестрам */
        gas_ps: boolean; /* ГАС ПС */
    };
    docgroups: IEOSFDocGroups;
    rkdefaults: {
        calendarControl: E_FIELD_TYPE;
        calendarValues: any[];
    };

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
