import { IConfirmWindow } from 'eos-common/core/confirm-window.interface';

export const CONFIRM_DELETE: IConfirmWindow = {
    title: 'Подтвердите удаление выбранных пользователей',
    body: 'Удаленных пользователей невозможно восстановить',
    okTitle: 'Удалить',
    cancelTitle: 'Отмена'
};
export const CONFIRM_SCANSYST: IConfirmWindow = {
    title: 'Данный функционал находится в разработке',
    body: '',
    okTitle: 'Подтвердить',
    cancelTitle: 'Отмена'
};
