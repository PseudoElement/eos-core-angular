import { IConfirmWindow } from '../../eos-common/core/confirm-window.interface';
import { IConfirmWindow2 } from 'eos-common/confirm-window/confirm-window2.component';

export const MESSAGE_SAVE_ON_LEAVE = 'Возможно, внесенные изменения не сохранятся.';
export const CONFIRM_SAVE_ON_LEAVE: IConfirmWindow = {
    title: 'Имеются несохранённые изменения',
    body: 'Внесённые изменения могут быть потеряны.',
    okTitle: 'Сохранить и закрыть',
    cancelTitle: 'Закрыть без сохранения'
};

// export const CONFIRM_SAVE_ON_LEAVE2: IConfirmWindow2 = {
//     title: 'Имеются несохранённые изменения',
//     body: 'Внесённые изменения могут быть потеряны.',
//     buttons: [
//         { result: 1, title: 'Сохранить и закрыть', isDefault: true },
//         { result: 2, title: 'Закрыть без сохранения'},
//     ]
// };

export const CONFIRM_CHANGE_BOSS: IConfirmWindow = {
    title: 'Подтвердите действие:',
    body: 'Начальником подразделения уже является {{persone}}, изменить на {{newPersone}}?',
    okTitle: 'Заменить',
    cancelTitle: 'Отмена'
};

export const CONFIRM_DOCGROUP_CHECK_DUPLINDEXES: IConfirmWindow = {
    title: 'Подтвердите действие:',
    body: 'В справочнике уже есть запись с индексом "{{index}}". Продолжить сохранение записи?',
    okTitle: 'Да',
    cancelTitle: 'Нет'
};

export const CONFIRM_LINK_CHECK_CATEGORY: IConfirmWindow = {
    title: 'Подтвердите действие:',
    body: 'Выбранная категория уже принадлежит другой паре связок, назначить категорию текущей паре?',
    okTitle: 'Да',
    cancelTitle: 'Нет'
};

export const CONFIRM_AVSYSTEMS_UNCHECKED: IConfirmWindow = {
    title: 'Подтвердите действие:',
    body: 'Снять права доступа к системам пользователя?',
    okTitle: 'Да',
    cancelTitle: 'Нет'
};

export const CONFIRM_DELETE_ROLE: IConfirmWindow = {
    title: 'Подтвердите действие:',
    body: 'Удалить выбранную роль?',
    okTitle: 'Да',
    cancelTitle: 'Нет'
};

export const CONFIRM_REDIRECT_AUNT: IConfirmWindow = {
    title: 'Подтвердите действие:',
    body: 'У пользователя не задан пароль.\n Хотите задать пароль?',
    okTitle: 'Да',
    cancelTitle: 'Нет'
};

export const CONFIRM_COPY_USER: IConfirmWindow = {
    title: 'Подтвердите действие:',
    body: 'Скопировать права выделенным пользователям?',
    okTitle: 'Да',
    cancelTitle: 'Нет'
};

export const CONFIRM_CUT_USER: IConfirmWindow = {
    title: 'Подтвердите действие:',
    body: 'Снять права выделенным пользователям?',
    okTitle: 'Да',
    cancelTitle: 'Нет'
};

export const CONFIRM_SURNAME_REDACT: IConfirmWindow2 = {
    title: 'Подтвердите действие:',
    body: 'ФИО пользователя отличается от ФИО должностного лица. Сохранить?',
    buttons: [
        {title: 'Да',  result: 1, },
        {title: 'Нет', result: 2, isDefault: true, },
    ],
};
