import { IBaseUsers } from '../../../shared/intrfaces/user-params.interfaces';
// const REG_MAX_SIZE: RegExp = /^\d{0,3}$|^1000$/; // 0-1000
const REG_MAX_SIZE1: RegExp = /^(-\d{1,2}|[1-9](\d{1,2})?|0|\s*)$/; // 0-1000
const REG_ONE_HUNDRED_SIZE = /(^\d$)|(^[1-9]\d$)/; // 0-99
const REG_ONE_THOUSAND_SIZE = /(^\d$)|(^[1-9]\d{1,2}$)/; // 0-999
const REG_TEN_THOUSAND_SIZE = /(^\d$)|(^[1-9]\d{1,3}$)/; // 0-9999
const REG_SOUND_FILE_WAV = /^[A-Z]\:\\.+\.wav$/; // system path for .wav file
 const REG_MIN_VAL: RegExp = /^[1-9][0-9]{0,4}$/;
export const SEND_ORDER_TO_FOR_ARM = {
    key: 'SEND_ORDER_TO',
    type: 'boolean',
    title: 'Направлять резолюции в папку «На контроле» кабинета автора в АРМ «ДелоWeb»',
};
export const CABINETS_USER: IBaseUsers = {
    id: 'cabinets',
    title: 'Кабинеты',
    apiInstance: 'USER_PARMS',
    disabledFields: [
    ],
    fields: [
        {
            key: 'FOLDERCOLORSTATUS',
            type: 'text',
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
            title: 'На исполнении'
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
            title: 'На рассмотрении'
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
            pattern: REG_MAX_SIZE1
        },
        {
            key: 'HILITE_RESOLUTION_BOOLEAN',
            type: 'boolean',
            title: 'с поручениями, срок исполнения которых истекает через'
        },
        // {
        //     key: 'HILITE_RESOLUTION_INCREMENT',
        //     type: 'numberIncrement',
        //     title: '',
        //     pattern: REG_MAX_SIZE1
        // },
        {
            key: 'HILITE_PRJ_RC',
            type: 'numberIncrement',
            title: '',
            pattern: REG_MAX_SIZE1
        },
        {
            key: 'HILITE_PRJ_RC_BOOLEAN',
            type: 'boolean',
            title: 'с проектами документов, срок которых истекает через '
        },
        // {
        //     key: 'HILITE_PRJ_RC_INCREMENT',
        //     type: 'numberIncrement',
        //     title: '',
        //     pattern: REG_MAX_SIZE1
        // },
        {
            key: 'CABSORT_ISN_DOCGROUP_LIST',
            type: 'select',
            title: '',
            options: [
                {value: '', title: ''}
            ]
        },
        {
            key: 'INPUT_REP_RC_WITHOUT_RES_DELETE_FROM_CAB',
            type: 'boolean',
            title: 'при вводе отчета'
        },
        {
            key: 'SCRATCH_RC',
            type: 'boolean',
            title: 'при вводе резолюции по документу без поручений'
        },
        {
            key: 'OZN_RC_WITHOUT_RES_DELETE_FROM_CAB',
            type: 'boolean',
            title: 'удалять документы без поручений из кабинета '
        },
        {
            key: 'OZN_FILL_REPLY',
            type: 'boolean',
            title: 'вводить отчет об исполнении поручения с текстом:'
        },
        {
            key: 'OZN_FILL_REPLY_TEXT',
            type: 'string',
            title: ''
        },
        {
            key: 'SCRATCH_RESOL',
            type: 'boolean',
            title: 'при вводе резолюции по неконтрольному документу с проставлением даты отчета'
        },
        {
            key: 'FOLDER_ITEM_LIMIT_RESULT',
            type: 'numberIncrement',
            title: 'Максимальное количество записи',
            pattern: REG_MIN_VAL,
        },
        {
            key: 'RESOLUTION_DATE',
            type: 'radio',
            title: 'Дата поручения в приложении Документы:',
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
            title: 'вручную'
        },
        {
            key: 'PARENT_RESOLUTION_TEXT',
            type: 'boolean',
            title: 'текст'
        },
        {
            key: 'INTERIM_DATE_PARENT',
            type: 'boolean',
            title: 'промежуточную дату'
        },
        {
            key: 'STATUS_EXEC_PARENT',
            type: 'boolean',
            title: 'состояние исполнения'
        },
        {
            key: 'CORRECT_CTRL_DATE',
            type: 'boolean',
            title: 'Ставить поручение на контроль при проставлении плановой даты (корректировать значение контрольности при изменении плановой и фактической даты)'
        },
        {
            key: 'INFORM_DIFFERENCE_CTRL_DATE',
            type: 'boolean',
            title: 'Сообщать о несоответствии контрольности поручения плановой и фактической дате в АРМ «ДелоWeb»'
        },
        {
            key: 'RESOLUTION_PLAN_DATE_ASK',
            type: 'boolean',
            title: 'Предлагать заполнить пустую плановую дату РК при вводе контрольного поручения в АРМ «ДелоWeb»'
        },
        {
            key: 'CASCADE_CONTROL',
            type: 'boolean',
            title: 'Снимать поручение с контроля, если снято вышестоящее поручение в АРМ «ДелоWeb»'
        },
        {
            key: 'PLAN_DATE_PARENT',
            type: 'boolean',
            title: 'Копировать плановую дату из вышестоящего поручения или документа'
        },
        {
            key: 'CHECK_RESOL_REPORT',
            type: 'boolean',
            title: 'проверять наличие отчетов исполнителей'
        },
        {
            key: 'SHOW_REPLY_NOTE',
            type: 'boolean',
            title: 'Примечание'
        },
        {
            key: 'SHOW_REPLY_READED',
            type: 'boolean',
            title: 'Отметку о прочтении'
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
                {value: 'YES', title: 'на контроле'},
                {value: 'NO', title: 'не контрольное'},
                {value: 'PARENT', title: 'от документа (родительского поручения)'}
            ]
        },
        {
            key: 'ADD_JOURNAL_4DOC',
            type: 'radio',
            title: 'для',
            options: [
                {value: '0', title: 'всех документов'},
                {value: '1', title: 'только с "бумажным" оригиналом'},
            ]
        },
        {
            key: 'ADD_JOURNAL_RESOL_AUTHOR',
            type: 'boolean',
            title: 'автора',
        },
        {
            key: 'ADD_JOURNAL_CONTROLLER',
            type: 'boolean',
            title: 'контролера',
        },
        {
            key: 'ADD_JOURNAL_RESOL_REPLY',
            type: 'boolean',
            title: 'исполнителей',
        },
        {
            key: 'ADD_ADRESS_REPORGANIZ',
            type: 'boolean',
            title: 'Не добавлять внешних исполнителей поручений в Адресаты',
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
            key: 'RESOLUTION_PRINT',
            type: 'boolean',
            title: 'Доступна печать поручения в приложении Документы',
        },
        {
            key: 'SEND_ORDER_TO',
            type: 'radio',
            title: '',
            options: [
                {value: '2', title: 'всем фигурантам'},
                {value: '1', title: 'контролеру и исполнителям'},
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
    fieldsDefaultValue: [
        {
            key: 'FOLDERCOLORSTATUS',
            type: '',
            title: '',
        },
        {
            key: 'HILITE_RESOLUTION',
            type: '',
            title: '',
        },
        {
            key: 'HILITE_PRJ_RC',
            type: '',
            title: '',
        },
        {
            key: 'CASCADE_CONTROL',
            type: '',
            title: ''
        },
        {
            key: 'RESOLUTION_PLAN_DATE_ASK',
            type: '',
            title: ''
        },
        {
            key: 'INFORM_DIFFERENCE_CTRL_DATE',
            type: '',
            title: ''
        },
        {
            key: 'STATUS_EXEC_PARENT',
            type: '',
            title: ''
        },
        {
            key: 'INTERIM_DATE_PARENT',
            type: '',
            title: ''
        },
        {
            key: 'PARENT_RESOLUTION_TEXT',
            type: '',
            title: ''
        },
        {
            key: 'CABSORT_ISN_DOCGROUP_LIST',
            type: '',
            title: '',
        },
        {
            key: 'INPUT_REP_RC_WITHOUT_RES_DELETE_FROM_CAB',
            type: '',
            title: '',
        },
        {
            key: 'SCRATCH_RC',
            type: '',
            title: '',
        },
        {
            key: 'SCRATCH_RESOL',
            type: '',
            title: '',
        },
        {
            key: 'FOLDER_ITEM_LIMIT_RESULT',
            type: '',
            title: '',
        },
        {
            key: 'RESOLUTION_DATE',
            type: '',
            title: '',
        },
        {
            key: 'RESOLUTION_AUTHOR',
            type: '',
            title: '',
        },
        {
            key: 'RESOLUTION_SELECT_AUTHOR',
            type: '',
            title: '',
        },
        {
            key: 'RESOLUTION_CONTROLLER',
            type: '',
            title: '',
        },
        {
            key: 'RESOLUTION_CONTROL_STATE',
            type: '',
            title: '',
        },
        {
            key: 'CORRECT_CTRL_DATE',
            type: '',
            title: '',
        },
        {
            key: 'PLAN_DATE_PARENT',
            type: '',
            title: '',
        },
        {
            key: 'CHECK_RESOL_REPORT',
            type: '',
            title: '',
        },
        {
            key: 'SHOW_REPLY_NOTE',
            type: '',
            title: '',
        },
        {
            key: 'SHOW_REPLY_READED',
            type: '',
            title: '',
        },
        {
            key: 'ADD_JOURNAL_4DOC',
            type: '',
            title: '',
        },
        {
            key: 'ADD_JOURNAL_RESOL_AUTHOR',
            type: '',
            title: '',
        },
        {
            key: 'ADD_JOURNAL_CONTROLLER',
            type: '',
            title: '',
        },
        {
            key: 'ADD_JOURNAL_RESOL_REPLY',
            type: '',
            title: '',
        },
        {
            key: 'ADD_ADRESS_REPORGANIZ',
            type: '',
            title: '',
        },
        {
            key: 'SEND_ORDER_TO',
            type: '',
            title: '',
        },
        {
            key: 'RESOLUTION_CICLE',
            type: '',
            title: '',
        },
        {
            key: 'RESPRJ_PRIORITY_DEFAULT',
            type: '',
            title: '',
        },
        {
            key: 'RESOLUTION_PRINT',
            type: '',
            title: '',
        },
    ]
};

export const CABINETS_USER_INFORMER: IBaseUsers = {
    id: 'cabinets',
    title: 'Кабинеты',
    apiInstance: 'USER_PARMS',
    disabledFields: [
    ],
    fields: [
        {
            key: 'INFORMER_FOLDER_ITEM_CHECK',
            type: 'boolean',
            title: 'Отслеживать записи',
        },
        {
            key: 'INFORMER_CABINET_RADIO',
            type: 'radio',
            title: '',
            options: [
                {value: 'ALL', title: 'Всех кабинетов'},
                {value: 'CABINET', title: 'Выбранного'},
            ],
            keyPosition: 0,
        },
        {
            key: 'INFORMER_CABINET',
            type: 'select',
            title: '',
            options: [
                {value: '', title: ''}
            ]
        },
        {
            key: 'INFORMER_FOLDER_ITEM_NOTIFY',
            type: 'boolean',
            title: 'Выдавать оповещение',
        },
        {
            key: 'INFORMER_FOLDERS',
            type: 'text',
            title: ''
        },
        {
            key: 'INFORMER_FOLDERS_RECEIVED',
            type: 'boolean',
            title: 'Поступившие'
        },
        {
            key: 'INFORMER_FOLDERS_FOR_EXECUTION',
            type: 'boolean',
            title: 'На исполнении'
        },
        {
            key: 'INFORMER_FOLDERS_UNDER_CONTROL',
            type: 'boolean',
            title: 'На контроле'
        },
        {
            key: 'INFORMER_FOLDERS_HAVE_LEADERSHIP',
            type: 'boolean',
            title: 'У руководства'
        },
        {
            key: 'INFORMER_FOLDERS_FOR_CONSIDERATION',
            type: 'boolean',
            title: 'На рассмотрении'
        },
        {
            key: 'INFORMER_FOLDERS_INTO_THE_BUSINESS',
            type: 'boolean',
            title: 'В дело'
        },
        {
            key: 'INFORMER_FOLDERS_PROJECT_MANAGEMENT',
            type: 'boolean',
            title: 'Управление проектами'
        },
        {
            key: 'INFORMER_FOLDERS_ON_SIGHT',
            type: 'boolean',
            title: 'На визировании'
        },
        {
            key: 'INFORMER_FOLDERS_ON_THE_SIGNATURE',
            type: 'boolean',
            title: 'На подписи'
        },
        {
            key: 'INFORMER_MODE',
            type: 'radio',
            title: '',
            options: [
                {value: 'CHECK_NEW', title: 'Новые'},
                {value: 'CHECK_UNREAD', title: 'Не прочитанные'},
            ],
            keyPosition: 0,
        },
        {
            key: 'INFORMER_ALL_NEW',
            type: 'boolean',
            title: 'Все новые записи'
        },
        {
            key: 'INFORMER_DFI_GREEN_FLAG',
            type: 'boolean',
            title: 'В кабинетах снимать отметку "Новая запись" при просмотре'
        },
        {
            key: 'INFORMER_REPLY_MODE',
            type: 'radio',
            title: '',
            options: [
                {value: 'MAIN', title: 'Ответственных'},
                {value: 'ALL', title: 'Всех'},
            ],
            keyPosition: 0,
        },
        {
            key: 'INFORMER_REPLY_OVER_CHECK_ON',
            type: 'boolean',
            title: 'Просроченные не более'
        },
        {
            key: 'INFORMER_REPLY_OVER_CHECK',
            type: 'numberIncrement',
            title: '',
            pattern: REG_ONE_HUNDRED_SIZE,
        },
        {
            key: 'INFORMER_REPLY_OVER_NOTIFY',
            type: 'boolean',
            title: 'Выдавать оповещение'
        },
        {
            key: 'INFORMER_REPLY_DELTA_CHECK_ON',
            type: 'boolean',
            title: 'Срок истекает через'
        },
        {
            key: 'INFORMER_REPLY_DELTA_CHECK',
            type: 'numberIncrement',
            title: '',
            pattern: REG_ONE_HUNDRED_SIZE,
        },
        {
            key: 'INFORMER_REPLY_DELTA_NOTIFY',
            type: 'boolean',
            title: 'Выдавать оповещение'
        },
        {
            key: 'INFORMER_CTRL_OVER_CHECK_ON',
            type: 'boolean',
            title: 'Просроченные не более'
        },
        {
            key: 'INFORMER_CTRL_OVER_CHECK',
            type: 'numberIncrement',
            title: '',
            pattern: REG_ONE_HUNDRED_SIZE,
        },
        {
            key: 'INFORMER_CTRL_OVER_NOTIFY',
            type: 'boolean',
            title: 'Выдавать оповещение'
        },
        {
            key: 'INFORMER_CTRL_DELTA_CHECK_ON',
            type: 'boolean',
            title: 'Срок истекает через'
        },
        {
            key: 'INFORMER_CTRL_DELTA_CHECK',
            type: 'numberIncrement',
            title: '',
            pattern: REG_ONE_HUNDRED_SIZE,
        },
        {
            key: 'INFORMER_CTRL_DELTA_NOTIFY',
            type: 'boolean',
            title: 'Выдавать оповещение'
        },
        {
            key: 'INFORMER_LIMIT_RESULT',
            type: 'numberIncrement',
            title: 'Максимальное количество записей',
            pattern: REG_TEN_THOUSAND_SIZE,
        },
        {
            key: 'INFORMER_TIMER_ON',
            type: 'boolean',
            title: 'Проверять состояние каждые:'
        },
        {
            key: 'INFORMER_TIMER',
            type: 'numberIncrement',
            title: '',
            pattern: REG_ONE_THOUSAND_SIZE,
        },
        {
            key: 'INFORMER_SOUND',
            type: 'boolean',
            title: 'Звуковой сигнал'
        },
        {
            key: 'INFORMER_SOUND_PATH',
            type: 'string',
            title: '',
            pattern: REG_SOUND_FILE_WAV,
        },
        {
            key: 'INFORMER_START',
            type: 'boolean',
            title: 'Запускать информер при входе в систему'
        },
    ],
    fieldsDefaultValue: [
        {
            key: 'OZN_FILL_REPLY_TEXT',
            type: '',
            title: ''
        },
        {
            key: 'OZN_FILL_REPLY',
            type: '',
            title: ''
        },
        {
            key: 'OZN_RC_WITHOUT_RES_DELETE_FROM_CAB',
            type: '',
            title: ''
        },
        {
            key: 'INFORMER_FOLDER_ITEM_CHECK',
            type: '',
            title: '',
        },
        {
            key: 'INFORMER_CABINET',
            type: '',
            title: '',
        },
        {
            key: 'INFORMER_FOLDER_ITEM_NOTIFY',
            type: '',
            title: '',
        },
        {
            key: 'INFORMER_FOLDERS',
            type: '',
            title: ''
        },
        {
            key: 'INFORMER_MODE',
            type: '',
            title: '',
        },
        {
            key: 'INFORMER_ALL_NEW',
            type: '',
            title: ''
        },
        {
            key: 'INFORMER_DFI_GREEN_FLAG',
            type: '',
            title: ''
        },
        {
            key: 'INFORMER_REPLY_MODE',
            type: '',
            title: '',
        },
        {
            key: 'INFORMER_REPLY_OVER_CHECK',
            type: '',
            title: '',
        },
        {
            key: 'INFORMER_REPLY_OVER_NOTIFY',
            type: '',
            title: ''
        },
        {
            key: 'INFORMER_REPLY_DELTA_CHECK',
            type: '',
            title: '',
        },
        {
            key: 'INFORMER_REPLY_DELTA_NOTIFY',
            type: '',
            title: ''
        },
        {
            key: 'INFORMER_CTRL_OVER_CHECK',
            type: '',
            title: '',
        },
        {
            key: 'INFORMER_CTRL_OVER_NOTIFY',
            type: '',
            title: ''
        },
        {
            key: 'INFORMER_CTRL_DELTA_CHECK',
            type: '',
            title: '',
        },
        {
            key: 'INFORMER_CTRL_DELTA_NOTIFY',
            type: '',
            title: ''
        },
        {
            key: 'INFORMER_LIMIT_RESULT',
            type: '',
            title: '',
        },
        {
            key: 'INFORMER_TIMER',
            type: '',
            title: '',
        },
        {
            key: 'INFORMER_SOUND',
            type: '',
            title: ''
        },
        {
            key: 'INFORMER_SOUND_PATH',
            type: '',
            title: ''
        },
        {
            key: 'INFORMER_START',
            type: '',
            title: ''
        },
    ],
};

export const CABINETS_USER_NOTIFICATOR: IBaseUsers = {
    id: 'cabinets',
    title: 'Кабинеты',
    apiInstance: 'USER_PARMS',
    disabledFields: [
    ],
    fields: [
        {
            key: 'NOTIFICATOR_MODE',
            type: 'radio',
            title: 'Оповещать о:',
            options: [
                {value: 'CHECK_NEW', title: 'Появлении в папках новых записей'},
                {value: 'CHECK_UNREAD', title: 'Непрочитанных РК, поручениях и РКПД'},
            ],
            keyPosition: 0,
        },
        {
            key: 'START_NOTIFICATOR',
            type: 'boolean',
            title: 'Запускать "оповещатель кабинетов" при входе в систему'
        },
    ],
    fieldsDefaultValue: [
        {
            key: 'NOTIFICATOR_MODE',
            type: '',
            title: '',
        },
        {
            key: 'START_NOTIFICATOR',
            type: '',
            title: '',
        },
    ],
};
