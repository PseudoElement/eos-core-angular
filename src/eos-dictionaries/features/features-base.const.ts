import { IOESDictsFeatures } from './features.interface';
import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';

export const FeaturesBase: IOESDictsFeatures = Object.assign({}, <IOESDictsFeatures>{
    version: 'Base',
    departments: {
        numcreation: false,
        reestr_send: false,
        gas_ps: false,
    },
    docgroups: {
        templates: {
            N: false,
            E: false,
            F: false,
            D: true,
            validMask: /\{2|A|B|C|D|2#|3#|@}|@2\}/,
            invalidText: 'Обязательные элементы: {2}, {A}, {B}, {C}, {D}, {2#}, {3#}, {@}, {@2}',
        },
    },
    rkdefaults: {
        calendarControl: E_FIELD_TYPE.select,
        calendarValues: [
            {
                value: '3',
                title: 'календарн.+',
            }, {
                value: '4',
                title: 'календарн.-',
            }, {
                value: '1',
                title: 'календарн.',
            }, {
                value: '2',
                title: 'рабоч.',
            },
        ],
    },
});

