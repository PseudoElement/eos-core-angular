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
        {
            key: 'RESOLUTION_DATE',
            type: 'radio',
            title: 'Дата резолюции',
            options: [
                {value: 'TODAY', title: 'сегодня'},
                {value: 'LAST', title: 'от предыдущей резолюции'},
                {value: 'EMPTY', title: 'не заполнять'}
            ]
        },
        {
            key: 'RESOLUTION_AUTHOR',
            type: 'boolean',
            title: 'от предыдущей резолюции'
        },
        {
            key: 'RESOLUTION_SELECT_AUTHOR',
            type: 'boolean',
            title: 'из списка'
        },
        {
            key: 'PARENT_RESOLUTION_TEXT',
            type: 'boolean',
            title: 'Копировать текст подчитенной резолюции из родительского поручения'
        },
        {
            key: 'CORRECT_CTRL_DATE',
            type: 'boolean',
            title: 'Корректировать  значение контрольности поручения при изменении план. И Факт. Дат'
        },
        {
            key: 'PLAN_DATE_PARENT',
            type: 'boolean',
            title: 'Плановая дата от РК (родительского поручения)'
        },
        {
            key: 'CHECK_RESOL_REPORT',
            type: 'boolean',
            title: 'проверять отчеты'
        },
        {
            key: 'SHOW_REPLY_NOTE',
            type: 'boolean',
            title: 'примечание'
        },
        {
            key: 'SHOW_REPLY_READED',
            type: 'boolean',
            title: 'отметку о прочтении'
        },
        {
            key: 'SHOW_REPLY_READED',
            type: 'boolean',
            title: 'отметку о прочтении'
        },
        {
            key: 'RESOLUTION_CONTROLLER',
            type: 'text',
            title: ''
        },
        {
            key: 'RESOLUTION_CONTROL_STATE',
            type: 'radio',
            title: 'Контроль поручения',
            options: [
                {value: 'YES', title: 'На контроле'},
                {value: 'NO', title: 'Не контрольное'},
                {value: 'PARENT', title: 'От РК (родительского поручения)'}
            ]
        },
        {
            key: 'ADD_JOURNAL_4DOC',
            type: 'radio',
            title: 'для',
            options: [
                {value: '0', title: 'Всех документов'},
                {value: '1', title: 'Только с бумажным оригиналом'},
            ]
        },
        {
            key: 'ADD_JOURNAL_RESOL_AUTHOR',
            type: 'boolean',
            title: 'Автора',
        },
        {
            key: 'ADD_JOURNAL_CONTROLLER',
            type: 'boolean',
            title: 'Контролера',
        },
        {
            key: 'ADD_JOURNAL_RESOL_REPLY',
            type: 'boolean',
            title: 'Исполнителей',
        },
        {
            key: 'ADD_ADRESS_REPORGANIZ',
            type: 'boolean',
            title: 'Не добавлять внешних исполнителей поручения в Адресаты',
        },
        {
            key: 'RESOLUTION_CICLE',
            type: 'boolean',
            title: 'Направлять резолюцию исполнителям из кабинета автора',
        },
        {
            key: 'CONTROLL_AUTHOR',
            type: 'string',
            title: '',
        },
        {
            key: 'SEND_ORDER_TO',
            type: 'radio',
            title: '',
            options: [
                {value: '2', title: 'Всем фигурантам'},
                {value: '1', title: 'Контролерам и исполнителям'},
                {value: '0', title: 'не рассылать'},
            ]
        },
        {
            key: 'RESPRJ_PRIORITY_DEFAULT',
            type: 'select',
            title: '',
            options: [
                {value: '1', title: 'Высокий'},
                {value: '2', title: 'Средний'},
                {value: '3', title: 'Низкий'},
                {value: '4', title: 'Без приоритета'},
            ]
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
