import { IBaseParameters } from '../interfaces/parameters.interfaces';

export const RC_PARAM: IBaseParameters = {
    id: 'rc',
    apiInstance: 'USER_PARMS',
    title: 'Работа с РК',
    fields: [
        {
            key: 'REP_SELF',
            type: 'toggle',
            title: 'Ввод отчетов только исполнителем поручений'
        },
        {
            key: 'REG_PERIOD',
            type: 'numberIncrement',
            title: 'ПРОДОЛЖИТЕЛЬНОСТЬ',
            pattern: /^[1-9]0?$/
        },
        {
            key: 'REG_UNIT',
            type: 'select',
            title: '',
            options: [
                {value: 1, title: 'Мин.'},
                {value: 2, title: 'Час.'},
                {value: 3, title: 'Сутки'}
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
            title: 'Ввод поручений с «План. датой» больше «План. даты» РК или род. поручения'
        },
        {
            key: 'RES_DATE_LESS_PARENT',
            type: 'boolean',
            title: 'Ввод резолюций с датой меньше даты рег.РК или род. резолюции'
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
