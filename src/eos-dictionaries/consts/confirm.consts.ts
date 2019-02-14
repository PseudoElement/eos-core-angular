import { IConfirmWindow } from '../../eos-common/core/confirm-window.interface';

export const CONFIRM_SAVE_ON_LEAVE: IConfirmWindow = {
    title: 'Имеются несохранённые изменения',
    body: 'Внесённые изменения могут быть потеряны.',
    okTitle: 'Сохранить и закрыть',
    cancelTitle: 'Закрыть без сохранения'
};

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
