import { IOESDictsFeatures, IEOSFDocGroups, IEOSFDocGroupsTemplates, IEOSRKDefaults, EOSDICTS_VARIANT, IEOSSevConfig, IEOSTPLVariant, E_LIST_ENUM_TYPE } from '../features.interface';
import { E_FIELD_TYPE } from '../../../eos-dictionaries/interfaces';
import { DOC_TEMPLATE_ELEMENTS_CB, PRJ_TEMPLATE_ELEMENTS_CB } from './docgroup-template-cb.consts';
import ctxstore from '../../../eos-rest/core/cntxHepler';

export const FeaturesDelo: IOESDictsFeatures = Object.assign({}, <IOESDictsFeatures>{
    version: 'ЦБ',
    variant : EOSDICTS_VARIANT.CB,
    canEditLogicDeleted: true,
    nodeList: {
        enumerationType: E_LIST_ENUM_TYPE.allInFolder,
    },
    departments: {
        numcreation: false,
        /** обображать поле пока сделаю для всех и для ЦБ и для Дела*/
        reestr_send: true, 
        gas_ps: false,
        stamp: false,
        /** в цб не должно быть, пока привязано к cb_func */
        userCreateButton: true, 
        /** только в цб должно быть, пока привязано к cb_func */
        datesReq: false, 
    },
    SEV: <IEOSSevConfig> {
        isIndexesEnable: true,
        /** Доступны ли справочники СЭВ */
        isDictsEnabled: true, 

    },
    docgroups: <IEOSFDocGroups>{
        templates: <IEOSFDocGroupsTemplates>{
            doc: <IEOSTPLVariant> {
                list: DOC_TEMPLATE_ELEMENTS_CB,
                validationExpr: /\{2\}|\{\*?A\*?\}|\{\*?B\*?\}|\{C\}|\{D\}|\{2#\}|\{3#\}|\{@\}|\{@2\}/,
                invalidText: 'Обязательные элементы: {2}, {A}, {B}, {C}, {D}, {2#}, {3#}, {@}, {@2}',
            },
            prj: <IEOSTPLVariant>{
                list: PRJ_TEMPLATE_ELEMENTS_CB,
                validationExpr: /\{2\}|\{@\}|\{@2\}|\{E\}\}/,
                invalidText: 'Обязательные элементы: {2}, {@}, {@2}',
            }

            // N: false,
            // E: false,
            // F: false,
            // D: true,
            // VALID_TEMPLATE_EXPR: /\{2|A|B|C|D|2#|3#|@}|@2\}/,
            // INVALID_TEMPLATE_TEXT: 'Обязательные элементы: {2}, {A}, {B}, {C}, {D}, {2#}, {3#}, {@}, {@2}',
            // VALID_PRJ_TEMPLATE_EXPR: /\{2|@}|@2\}/,
            // INVALID_PRJ_TEMPLATE_TEXT: 'Обязательные элементы: {2}, {@}, {@2}',
        },
    },
    rkdefaults: <IEOSRKDefaults>{
        appendFields: ctxstore.cbBase ? [
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
        ] : [],
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

