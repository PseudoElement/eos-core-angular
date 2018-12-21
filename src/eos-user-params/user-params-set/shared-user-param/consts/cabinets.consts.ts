import { IBaseUsers } from '../../../shared/intrfaces/user-params.interfaces';
const REG_MAX_SIZE: RegExp = /^\d{0,3}$|^1000$/; // 0-1000
export const CABINETS_USER: IBaseUsers = {
    id: 'cabinets',
    title: 'Кабинеты',
    apiInstance: 'USER_PARMS',
    disabledFields: [
        'HILITE_RESOLUTION_INCREMENT',
        'HILITE_PRJ_RC_INCREMENT'
    ],
    fields: [
        {
            key: 'FOLDERCOLORSTATUS',
            type: 'boolean',
            title: 'Поступившие'
        },
        {
            key: 'FOLDERCOLORSTATUS_RECEIVED',
            type: 'boolean',
            title: 'Поступившие'
        },
        {
            key: 'FOLDERCOLORSTATUS_FOR_EXECUTION',
            type: 'boolean',
            title: 'На исполнение'
        },
        {
            key: 'FOLDERCOLORSTATUS_UNDER_CONTROL',
            type: 'boolean',
            title: 'На контроле'
        },
        {
            key: 'FOLDERCOLORSTATUS_HAVE_LEADERSHIP',
            type: 'boolean',
            title: 'У руководства'
        },
        {
            key: 'FOLDERCOLORSTATUS_FOR_CONSIDERATION',
            type: 'boolean',
            title: 'На рассмотрение'
        },
        {
            key: 'FOLDERCOLORSTATUS_INTO_THE_BUSINESS',
            type: 'boolean',
            title: 'В дело'
        },
        {
            key: 'FOLDERCOLORSTATUS_PROJECT_MANAGEMENT',
            type: 'boolean',
            title: 'Управление проектами'
        },
        {
            key: 'FOLDERCOLORSTATUS_ON_SIGHT',
            type: 'boolean',
            title: 'На визировании'
        },
        {
            key: 'FOLDERCOLORSTATUS_ON_THE_SIGNATURE',
            type: 'boolean',
            title: 'На подписи'
        },
        {
            key: 'HILITE_RESOLUTION',
            type: 'numberIncrement',
            title: '',
            readonly: true,
        },
        {
            key: 'HILITE_RESOLUTION_BOOLEAN',
            type: 'boolean',
            title: 'Подсвечивать записи с поручениями РК, срок исполнения которых истекает через'
        },
        {
            key: 'HILITE_RESOLUTION_INCREMENT',
            type: 'numberIncrement',
            title: ''
        },
        {
            key: 'HILITE_PRJ_RC',
            type: 'boolean',
            title: ''
        },
        {
            key: 'HILITE_PRJ_RC_BOOLEAN',
            type: 'boolean',
            title: 'Подсвечивать записив папке "Управление проектами" РК, срок которых истекает через'
        },
        {
            key: 'HILITE_PRJ_RC_INCREMENT',
            type: 'numberIncrement',
            title: ''
        },
        {
            key: 'CABSORT_ISN_DOCGROUP_LIST',
            type: 'select',
            title: '',
            options: [
            ]
        },
        {
            key: 'INPUT_REP_RC_WITHOUT_RES_DELETE_FROM_CAB',
            type: 'boolean',
            title: 'Удалять РК (без поручений) из кабинета исполнителя при вводе резолюции'
        },
        {
            key: 'SCRATCH_RC',
            type: 'boolean',
            title: 'Удалять РК (без поручений) из кабинета автора при вводе резолюции'
        },
        {
            key: 'SCRATCH_RESOL',
            type: 'boolean',
            title: 'Исполнять РК в кабинете автора при вводе резолюции'
        },
        {
            key: 'FOLDER_ITEM_LIMIT_RESULT',
            type: 'numberIncrement',
            title: 'Максимальное количество записи',
            pattern: REG_MAX_SIZE,
        },
    ],
    fieldsChild: [
        {
            key: 'FOLDERCOLORSTATUS_RECEIVED',
            type: 'boolean',
            title: 'Поступившие'
        },
        {
            key: 'FOLDERCOLORSTATUS_FOR_EXECUTION',
            type: 'boolean',
            title: 'На исполнение'
        },
        {
            key: 'FOLDERCOLORSTATUS_UNDER_CONTROL',
            type: 'boolean',
            title: 'На контроле'
        },
        {
            key: 'FOLDERCOLORSTATUS_HAVE_LEADERSHIP',
            type: 'boolean',
            title: 'У руководства'
        },
        {
            key: 'FOLDERCOLORSTATUS_FOR_CONSIDERATION',
            type: 'boolean',
            title: 'На рассмотрение'
        },
        {
            key: 'FOLDERCOLORSTATUS_INTO_THE_BUSINESS',
            type: 'boolean',
            title: 'В дело'
        },
        {
            key: 'FOLDERCOLORSTATUS_PROJECT_MANAGEMENT',
            type: 'boolean',
            title: 'Управление проектами'
        },
        {
            key: 'FOLDERCOLORSTATUS_ON_SIGHT',
            type: 'boolean',
            title: 'На визировании'
        },
        {
            key: 'FOLDERCOLORSTATUS_ON_THE_SIGNATURE',
            type: 'boolean',
            title: 'На подписи'
        },
        {
            key: 'HILITE_RESOLUTION_BOOLEAN',
            type: 'boolean',
            title: 'Подсвечивать записи с поручениями РК, срок исполнения которых истекает через'
        },
        {
            key: 'HILITE_RESOLUTION_INCREMENT',
            type: 'numberIncrement',
            readonly: true,
            title: ''
        },
        {
            key: 'HILITE_PRJ_RC_BOOLEAN',
            type: 'boolean',
            title: 'Подсвечивать записив папке "Управление проектами" РК, срок которых истекает через'
        },
        {
            key: 'HILITE_PRJ_RC_INCREMENT',
            type: 'numberIncrement',
            readonly: true,
            title: ''
        },
    ]
};
