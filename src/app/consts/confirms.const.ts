import { IConfirmWindow } from '../../eos-common/core/confirm-window.interface';
import { IConfirmWindow2 } from 'eos-common/confirm-window/confirm-window2.component';

export const CONFIRM_DESK_DELETE: IConfirmWindow = {
    title: 'Подтверждение удаления',
    body: 'Вы действительно хотите удалить рабочий стол "{{name}}"?',
    okTitle: 'Удалить',
    cancelTitle: 'Отмена'
};

export const CONFIRM_LINK_DELETE: IConfirmWindow = {
    title: 'Подтверждение удаления',
    body: 'Вы действительно хотите удалить ссылку "{{link}}"?',
    okTitle: 'Удалить',
    cancelTitle: 'Отмена'
};

export const CONFIRM_NODE_DELETE: IConfirmWindow = {
    title: 'Подтверждение удаления',
    body: 'Вы действительно хотите удалить запись {{name}} ?',
    okTitle: 'Удалить',
    cancelTitle: 'Отмена'
};

export const CONFIRM_NODES_DELETE: IConfirmWindow = {
    title: 'Подтверждение удаления',
    body: 'Вы действительно хотите удалить записи {{name}} ?',
    okTitle: 'Удалить',
    cancelTitle: 'Отмена'
};

export const CONFIRM_SUBNODES_RESTORE: IConfirmWindow = {
    title: 'Подтверждение восстановления',
    body: 'Восстановить дочерние элементы для {{name}}',
    okTitle: 'Восстановить дочерние',
    cancelTitle: 'Не восстанавливать дочерние'
};

export const CONFIRM_NUMCREATION_CHANGE: IConfirmWindow = {
    title: 'Подтверждение изменения',
    body: 'Вы хотите изменить значение счетчика с "{{old_value}}" на "{{new_value}}" для {{year}} года?'
        + '\nВнимание: Обратное изменение будет невозможно!',
    okTitle: 'Да',
    cancelTitle: 'Нет',
    manualCR: true,
};

export const CONFIRM_REESTRTYPE_DELIVERY_CHANGE: IConfirmWindow = {
    title: 'Подтверждение изменения',
    body: 'У данного типа реестров есть не отправленные реестры. Сменить вид отправки для всех этих реестров?',
    okTitle: 'Да',
    cancelTitle: 'Нет'
};

export const CONFIRM_CABINET_NON_EMPTY: IConfirmWindow = {
    title: 'Подтверждение удаления',
    body: 'Для владельца кабинета существуют записи в папках. Удалить их?',
    okTitle: 'Да',
    cancelTitle: 'Нет'
};

export const CONFIRM_CABINET_NON_EMPTY1: IConfirmWindow2 = {
    title: 'Подтверждение удаления',
    body: 'Для владельца кабинета существуют записи в папках. Удалить их?',
    buttons: [
        {title: 'Да', result: 1, isDefault: true},
        {title: 'Нет', result: 2, },
        {title: 'Отмена', result: 3, },
    ]
};


