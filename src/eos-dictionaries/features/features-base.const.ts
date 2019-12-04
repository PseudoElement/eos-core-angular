import { IOESDictsFeatures, IEOSFDocGroups, IEOSFDocGroupsTemplates } from './features.interface';
import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';

export const FeaturesBase: IOESDictsFeatures = Object.assign({}, <IOESDictsFeatures>{
    version: 'Base',
    departments: {
        numcreation: false,
        reestr_send: false,
        gas_ps: false,
    },
    docgroups: <IEOSFDocGroups>{
        templates: <IEOSFDocGroupsTemplates>{
            N: false,
            E: false,
            F: false,
            D: true,
            VALID_TEMPLATE_EXPR: /\{2|A|B|C|D|2#|3#|@}|@2\}/,
            INVALID_TEMPLATE_TEXT: 'Обязательные элементы: {2}, {A}, {B}, {C}, {D}, {2#}, {3#}, {@}, {@2}',
            VALID_PRJ_TEMPLATE_EXPR: /\{2|@}|@2\}/,
            INVALID_PRJ_TEMPLATE_TEXT: 'Обязательные элементы: {2}, {@}, {@2}',
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

