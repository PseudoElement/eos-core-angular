import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';

export interface IOESDictsFeatures {
    version: string;
    departments: {
        numcreation: boolean; /* галка Номерообразование */
        reestr_send: boolean; /* галка Отправлять документы по реестрам */
        gas_ps: boolean; /* ГАС ПС */
    };
    docgroups: {
        templates: {
            N: boolean,
            E: boolean,
            F: boolean,
            D: boolean,
            validMask?: RegExp,
            invalidText?: string,
        },
    };
    rkdefaults: {
        calendarControl: E_FIELD_TYPE;
        calendarValues: any[];
    };

}
