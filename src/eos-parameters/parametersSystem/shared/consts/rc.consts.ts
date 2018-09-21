import { IBaseParameters } from '../interfaces/parameters.interfaces';

export const RC_PARAM: IBaseParameters = {
    id: 'rc',
    apiInstance: 'USER_PARMS',
    title: 'Работа с РК',
    disabledFields: [
        'RC_CTRL_ABS',
        'RC_CTRL_RES_LAYER'
    ],
    fields: [
        {
            key: 'RC_CTRL',
            type: 'radio',
            readonly: true,
            title: '',
            options: [
                {value: '0', title: 'Правило 1 (от поручения)'},
                {value: '1', title: 'Правило 2 (вручную)'},
            ]
        },
        {
            key: 'RC_CTRL_ABS',
            type: 'radio',
            title: '',
            options: [
                {value: '1', title: 'Абсолютно'},
                {value: '0', title: 'Картотечно'},
            ]
        },
        {
            key: 'RC_CTRL_RES_LAYER',
            type: 'select',
            title: 'по поручениям',
            options: [
                {value: '1', title: '1 уровня'},
                {value: '2', title: '1 и 2 уровня'},
                {value: '3', title: '1-3 уровня'},
                {value: '0', title: 'всех уровней'}
            ]
        },
        {
            key: 'REP_SELF',
            type: 'toggle',
            title: 'Ввод отчетов только исполнителем поручений'
        },
        {
            key: 'REG_PERIOD',
            type: 'numberIncrement',
            title: 'ПРОДОЛЖИТЕЛЬНОСТЬ',
        },
        {
            key: 'REG_UNIT',
            type: 'select',
            title: '',
            options: [
                {value: '1', title: 'Мин.'},
                {value: '2', title: 'Час.'},
                {value: '3', title: 'Сутки'}
            ]
        },
        {
            key: 'REG_CHECK_EDIT',
            type: 'boolean',
            title: 'Не редактируемые другими пользователями'
        },
        {
            key: 'RESOLUTION_REPLY_PROTECTED',
            type: 'boolean',
            title: 'Запретить редактирование поручения при наличии отчета исполнителя'
        },
        {
            key: 'REPLY_CTRL_RESOLUTION_PROTECTED',
            type: 'boolean',
            title: 'Запретить редактирование отчета исполнителя после снятия поручения с контроля'
        },
        {
            key: 'RESOLUTION_REPLY_DELETE_PROTECTED',
            type: 'boolean',
            title: 'Запретить удаление поручения при наличии отчета исполнителя'
        },
        {
            key: 'RES_PLAN_MORE_PARENT',
            type: 'boolean',
            title: 'Запретить ввод поручений с «План. датой» больше «План. даты» РК или род. поручения'
        },
        {
            key: 'RES_DATE_LESS_PARENT',
            type: 'boolean',
            title: 'Запретить ввод резолюций с датой меньше даты рег. РК или род. резолюции'
        },
        {
            key: 'CONSTRAIN_DELO_LIST',
            type: 'boolean',
            title: 'Ограничивать выбор дел при регистрации РК правом «Списания документов в дело»'
        },
        {
            key: 'RESOLUTION_PRJ_COPY',
            type: 'boolean',
            title: 'Формировать файл проекта резолюции'
        }
    ]
};
