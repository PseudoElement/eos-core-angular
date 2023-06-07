import { IConfirmWindow } from '../../eos-common/core/confirm-window.interface';
import { IConfirmWindow2 } from '../../eos-common/confirm-window/confirm-window2.component';

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
    body: 'ФИО пользователя отличается от ФИО должностного лица. Сохранить новое ФИО пользователя?',
    buttons: [
        {title: 'Нет', result: 2},
        {title: 'Да',  result: 1, isDefault: true},
    ],
};

export const WARN_ELEMENTS_COPY_DELETE_LOGICK: IConfirmWindow2 = {
    title: 'Внимание',
    bodyList: [],
    body: 'Следующие элементы справочника удалены логически:',
    bodyAfterList: '',
    buttons: [
        {title: 'Закрыть',  result: 1, isDefault: true},
    ],
};
export const CONFIRM_OPERATION_HARDDELETE_COPY_MASSAGE: IConfirmWindow2 = {
    title: 'Внимание',
    bodyList: [],
    body: 'Удалить копируемые элементы справочника?',
    bodyAfterList: '',
    buttons: [
        {title: 'Нет', result: 2},
        {title: 'Да',  result: 1, isDefault: true},
    ],
}
export const WARN_ELEMENTS_ARE_RELATED: IConfirmWindow2 = {
    title: 'Внимание',
    bodyList: [],
    body: 'Записи:',
    bodyAfterList: 'удалены логически.',
    buttons: [
        { title: 'Ок', result: 1, isDefault: true, },
    ],
};
export const CONFIRM_UNAVAILABLE_SYSTEMS: IConfirmWindow2 = {
    title: 'Невозможно предоставить доступ к выбранным системам',
    body: 'Превышено максимальное число пользователей.',
    buttons: [
            {title: 'Ok', result: 1, isDefault: true, },
    ],
    manualCR: true,
};

export const CONFIRM_UNAVAILABLE_SYSTEMS_AFTER_BLOCK: IConfirmWindow2 = {
    title: 'Ограничение лицензии',
    body: '',
    buttons: [
            {title: 'Ok', result: 1, isDefault: true, },
    ],
    manualCR: true,
};
export const CONFIRM_MAIN_CABINET_IN_CARTOTEK: IConfirmWindow2 = {
    title: '',
    body: 'В главной картотеке не назначен главный кабинет. Продолжить сохранение?',
    buttons: [
        {title: 'Нет', result: 2, },
        {title: 'Да', result: 1, isDefault: true },
    ],
    manualCR: true,
};
