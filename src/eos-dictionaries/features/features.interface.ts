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
        },
    };

}
