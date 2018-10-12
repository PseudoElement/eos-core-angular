import { IBaseUsers } from '../../../shared/intrfaces/user-params.interfaces';

export const REGISTRATION_USER: IBaseUsers = {
    id: 'registration',
    title: 'Регистрация',
    apiInstance: 'USER_PARMS',
    fields: [
        {
            key: 'AUTOSEND',
            type: 'boolean',
            title: 'Автоматически вызывать функцию переслать РК'
        },
        {
            key: 'AUTOLOAD_TO_EXEC_CURR_CAB',
            type: 'boolean',
            title: 'На исполнение текущего кабинета'
        },
        {
            key: 'AUTOLOAD_TO_DELO_CURR_CAB',
            type: 'boolean',
            title: 'В дело текущего кабинета'
        },
        {
            key: 'AUTOSTAMP',
            type: 'boolean',
            title: 'Автоматическая печать регистрация штампа(входящий)'
        },
        {
            key: 'AUTOSTAMP1',
            type: 'boolean',
            title: 'Автоматическая печать регистрация штампа(исходящий)'
        },
        {
            key: 'SECURLEVEL',
            type: 'radio',
            title: '',
            readonly: false,
            options: [
                {value: '0', title: 'от предыдущей РК'},
                {value: '1', title: 'первый из справочника'}
            ]
        },
        {
            key: 'DELIVERY_TYPE',
            type: 'radio',
            title: '',
            readonly: false,
            options: [
                {value: '0', title: 'от предыдущей РК'},
                {value: '1', title: 'первый из справочника'}
            ]
        },
        {
            key: 'TESTRAPID_ONSAVE',
            type: 'boolean',
            title: 'Автоматически вызывать проверку повторности РК'
        },
        {
            key: 'TESTRAPID_USECORRESP',
            type: 'boolean',
            title: 'Проверять корреспондента'
        },
        {
            key: 'PRJ2RC_DIALOG',
            type: 'radio',
            title: '',
            readonly: false,
            options: [
                {value: 'NO', title: 'Без диалога'},
                {value: 'YES', title: 'С диалогом'}
            ]
        },
        {
            key: 'FILELOCK',
            type: 'boolean',
            title: 'Запрет на редактирование прикрепляемых файлов'
        },
        {
            key: 'FILE_DONTDEL',
            type: 'boolean',
            title: 'Запрет на удаление прикрепляемых файлов'
        },
    ]
};
