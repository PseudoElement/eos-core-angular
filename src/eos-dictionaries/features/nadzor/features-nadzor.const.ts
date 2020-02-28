import { IOESDictsFeatures, IEOSFDocGroups, IEOSFDocGroupsTemplates, EOSDICTS_VARIANT, IEOSRKDefaults, IEOSSevConfig, IEOSTPLVariant, E_LIST_ENUM_TYPE } from '../features.interface';
import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';
import { DOC_TEMPLATE_ELEMENTS_NADZOR, PRJ_TEMPLATE_ELEMENTS_NADZOR } from './docgroup-template-nadzor.consts';

export const FeaturesNadzor: IOESDictsFeatures = Object.assign({}, <IOESDictsFeatures>{
    version: 'Nadzor',
    variant: EOSDICTS_VARIANT.Nadzor,
    canEditLogicDeleted: true,
    nodeList: {
        enumerationType: E_LIST_ENUM_TYPE.marked,
    },
    departments: {
        numcreation: true,
        reestr_send: true,
        gas_ps: true,
        stamp: true,
        userCreateButton: true,
        datesReq: false,
    },
    SEV: <IEOSSevConfig> {
        isIndexesEnable: false,
    },
    docgroups: <IEOSFDocGroups>{
        templates: <IEOSFDocGroupsTemplates>{
            doc: <IEOSTPLVariant> {
                list: DOC_TEMPLATE_ELEMENTS_NADZOR,
                validationExpr: /\{2\}|\{A\}|\{B\}|\{C\}|\{E\}|\{2#\}|\{3#\}|\{@\}|\{@2\}/,
                invalidText: 'Обязательные элементы: {2}, {A}, {B}, {C}, {E}, {2#}, {3#}, {@}, {@2}',
            },
            prj: <IEOSTPLVariant>{
                list: PRJ_TEMPLATE_ELEMENTS_NADZOR,
                validationExpr: /\{2\}|\{@\}|\{@2\}|\{E\}\}/,
                invalidText: 'Обязательные элементы: {2}, {@}, {@2}, {E}',
            }
        },
    },

    rkdefaults: <IEOSRKDefaults>{
        appendFields: [],
        calendarControl: E_FIELD_TYPE.buttons,
        calendarValuesDefault: '1',
        calendarValues: [
            {
                value: '1',
                title: 'календарн.',
            }, {
                value: '2',
                title: 'рабоч.',
            },
        ],
    },

});
