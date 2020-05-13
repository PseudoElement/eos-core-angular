import { IConfirmWindow } from 'eos-common/core/confirm-window.interface';
import { IConfirmWindow2 } from 'eos-common/confirm-window/confirm-window2.component';

export const CONFIRM_DELETE: IConfirmWindow = {
    title: 'Подтверждение удаления',
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
export const CONFIRM_UPDATE_USER: IConfirmWindow2 = {
    title: 'Изменение типа пользователя',
    bodyList: [],
    body: 'Вы собираетесь сделать этого пользователя техническим. Ассоциация с должностным лицом будет удалена.',
    bodyAfterList: '',
    buttons: [
        {title: 'Ок', result: 1, isDefault: true, },
        {title: 'Отменить',  result: 2, },
    ],
};
