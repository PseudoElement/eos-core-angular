import { IOESDictsFeatures, IEOSFDocGroups, IEOSFDocGroupsTemplates, IEOSRKDefaults, EOSDICTS_VARIANT, IEOSSevConfig } from './features.interface';
import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';

export const FeaturesBase: IOESDictsFeatures = Object.assign({}, <IOESDictsFeatures> {
    version: 'ЦБ',
    variant : EOSDICTS_VARIANT.CB,
    departments: {
        numcreation: false,
        reestr_send: false,
        gas_ps: false,
        stamp: false,
        userCreateButton: true, /* в цб не должно быть, пока привязано к cb_func */
        datesReq: false, /* только в цб должно быть, пока привязано к cb_func */
    },
    SEV: <IEOSSevConfig> {
        isIndexesEnable: true,
        isDictsEnabled: true, /* Доступны ли справочники СЭВ */

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
    rkdefaults: <IEOSRKDefaults>{
        appendFields: [
            {
                key: 'SEND_CB_SENDING_TYPE',
                page: 'D',
                type: E_FIELD_TYPE.buttons,
                title: 'Отправка',
                options: [
                    {
                        value: '1',
                        title: 'Централизовано',
                    }, {
                        value: '2',
                        title: 'В Департаменте',
                    },
                ],
                default: '1',
            },
        ],
        calendarControl: E_FIELD_TYPE.select,
        calendarValuesDefault: '3',
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

