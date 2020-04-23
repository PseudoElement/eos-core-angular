import { IBaseUsers } from '../../../shared/intrfaces/user-params.interfaces';
// const REG_MAX_SIZE: RegExp = /^\d{0,3}$|^1000$/; // 0-1000
const REG_MAX_SIZE1: RegExp = /^(-\d{1,2}|[1-9](\d{1,2})?|0|\s*)$/; // 0-1000
 const REG_MIN_VAL: RegExp = /^[1-9][0-9]{0,4}$/;
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
            title: 'удалять документы без поручений из кабинета'
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
            title: 'Дата поручения:',
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
            title: 'Ставить поручение на контроль при проставлении плановой даты'
        },
        {
            key: 'INFORM_DIFFERENCE_CTRL_DATE',
            type: 'boolean',
            title: 'Сообщать о несоответствии контрольности поручения плановой и фактической дате'
        },
        {
            key: 'RESOLUTION_PLAN_DATE_ASK',
            type: 'boolean',
            title: 'Предлагать заполнить пустую плановую дату РК при вводе контрольного поручения'
        },
        {
            key: 'CASCADE_CONTROL',
            type: 'boolean',
            title: 'Снимать поручение с контроля, если снято вышестоящее поручение'
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
            title: 'Добавлять внешних исполнителей поручений в Адресаты',
        },
        {
            key: 'RESOLUTION_CICLE',
            type: 'boolean',
            title: 'Направлять резолюцию исполнителям, если они работают в том же кабинете, что и автор',
        },
        {
            key: 'CONTROLL_AUTHOR',
            type: 'string',
            title: '',
        },
        {
            key: 'RESOLUTION_PRINT',
            type: 'boolean',
            title: 'Доступна печать поручения в десктопном приложении',
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
            key: 'PARENT_RESOLUTION_TEXT',
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
