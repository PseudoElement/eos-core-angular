export interface IOESDictsFeatures {
    version: string;
    departments: {
        numcreation: boolean; /* галка Номерообразование */
        reestr_send: boolean; /* галка Отправлять документы по реестрам */
    };
    docgroups: {
        templates: {
            N: boolean,
            E: boolean,
            F: boolean,
        },
    };

}
