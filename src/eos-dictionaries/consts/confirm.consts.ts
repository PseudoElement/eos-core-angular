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

export const CONFIRM_CHANGE_REESTR: IConfirmWindow = {
    title: 'Подтвердите действие:',
    body: 'У данного типа реестров есть не отправленные реестры. Сменить вид отправки для всех этих реестров?',
    okTitle: 'Да',
    cancelTitle: 'Нет'
};
