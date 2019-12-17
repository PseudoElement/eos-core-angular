import { IConfirmWindow } from '../../eos-common/core/confirm-window.interface';
import { IConfirmWindow2 } from 'eos-common/confirm-window/confirm-window2.component';

export const BUTTON_RESULT_YES = 1;
export const BUTTON_RESULT_NO = 2;
export const BUTTON_RESULT_CANCEL = 3;

export const WARNING_LIST_MAXCOUNT = 10;
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

export const CONFIRM_NUMCREATION_CHANGE: IConfirmWindow = {
    title: 'Подтверждение изменения',
    body: 'Вы хотите изменить значение счетчика с "{{old_value}}" на "{{new_value}}" для {{year}} года?'
        + '\nВнимание: Обратное изменение будет невозможно!',
    okTitle: 'Да',
    cancelTitle: 'Нет',
    manualCR: true,
};

export const CONFIRM_NUMCREATION_CANT: IConfirmWindow2 = {
    title: 'Изменение значения счетчика невозможно',
    body: 'Указанное значение или значения больше ранее уже использовались в нумерации.',
    buttons: [
            {title: 'Ok', result: 1, isDefault: true, },
    ],
    manualCR: true,
};

export const CONFIRM_REESTRTYPE_DELIVERY_CHANGE: IConfirmWindow = {
    title: 'Подтверждение изменения',
    body: 'У данного типа реестров есть не отправленные реестры. Сменить вид отправки для всех этих реестров?',
    okTitle: 'Да',
    cancelTitle: 'Нет'
};

export const CONFIRM_CABINET_NON_EMPTY: IConfirmWindow2 = {
    title: 'Подтверждение удаления',
    body: 'Для владельца кабинета "{{XXX}}" существуют записи в папках. Удалить их?',
    buttons: [
        {title: 'Да', result: 1, isDefault: true},
        {title: 'Нет', result: 2, },
        {title: 'Отмена', result: 3, },
    ]
};

export const RK_SELECTED_LIST_IS_EMPTY: IConfirmWindow2 = {
    title: 'Внимание',
    body: 'В реквизите "{{REK}}" выбран пустой список. Продолжить?',
    buttons: [
        {title: 'Да', result: 1, },
        {title: 'Нет', result: 2, },
    ],
};

export const RK_SELECTED_LIST_CONTAIN_DELETED: IConfirmWindow2 = {
    title: 'Внимание',
    body: 'В реквизите "{{REK}}" выбран список, в котором некоторые элементы логически удалены. Продолжить?',
    buttons: [
        {title: 'Да', result: 1, },
        {title: 'Нет', result: 2, },
    ],
};

export const RK_SELECTED_LIST_BEEN_DELETED: IConfirmWindow2 = {
    title: 'Внимание',
    body: 'В реквизите "{{REK}}" выбран список, который был удален. Значение очищено. Выберите корректное значение.',
    buttons: [
        {title: 'Отмена', result: 2, },
    ],
};

export const RK_SELECTED_VALUE_LOGIC_DELETED: IConfirmWindow2 = {
    title: 'Внимание',
    body: 'В настройках реквизитов {{REK}} используются логически удаленные элементы справочников: {{LIST}} Продолжить?',
    buttons: [
        {title: 'Да', result: 1, isDefault: true, },
        {title: 'Нет', result: 2, },
    ],
};

export const RK_SELECTED_VALUE_INCORRECT: IConfirmWindow2 = {
    title: 'Внимание',
    bodyList: [],
    body: '',
    bodyAfterList: 'Продолжить?',
    buttons: [
        {title: 'Да', result: 1, isDefault: true, },
        {title: 'Нет', result: 2, },
    ],
};

export const CONFIRM_SAVE_INVALID: IConfirmWindow2 = {
    title: 'Не удалось сохранить',
    body: '{{errors}}',
    buttons: [
        {title: 'Ок', result: 1, isDefault: true}
    ],
    manualCR: true
};

export const CONFIRM_OPERATION_LOGICDELETE: IConfirmWindow2 = {
    title: 'Внимание',
    bodyList: [],
    body: 'Вы действительно хотите логически удалить записи:',
    bodyAfterList: 'Продолжить?',
    buttons: [
        {title: 'Отменить', result: 1, isDefault: true, },
        {title: 'Удалить',  result: 2, },
    ],
};

export const CONFIRM_OPERATION_HARDDELETE: IConfirmWindow2 = {
    title: 'Внимание',
    bodyList: [],
    body: 'Вы действительно хотите навсегда удалить записи:',
    bodyAfterList: 'Продолжить?',
    buttons: [
        {title: 'Отменить', result: 1, isDefault: true, },
        {title: 'Удалить',  result: 2, },
    ],
};

export const CONFIRM_OPERATION_RESTORE: IConfirmWindow2 = {
    title: 'Внимание',
    bodyList: [],
    body: 'Вы действительно хотите восстановить записи:',
    bodyAfterList: 'Продолжить?',
    buttons: [
        {title: 'Отменить', result: 1, isDefault: true, },
        {title: 'Восстановить',  result: 2, },
    ],
};

export const CONFIRM_SUBNODES_RESTORE: IConfirmWindow2 = {
    title: 'Подтверждение восстановления',
    body: 'Восстановить дочерние элементы для {{name}}',
    buttons: [
        {title: 'Не восстанавливать дочерние',  result: 1, },
        {title: 'Восстановить дочерние', result: 2, isDefault: true, },
    ],
};

export const CONFIRM_DEPCALENDAR_DELETE: IConfirmWindow2 = {
    title: 'Подтверждение удаления',
    body: 'Вы действительно хотите удалить календарь подразделения?',
    buttons: [
        {title: 'Да', result: BUTTON_RESULT_YES, },
        {title: 'Нет', result: BUTTON_RESULT_NO, isDefault: true },
    ]
};

export const CONFIRM_DG_FIXE: IConfirmWindow2 = {
    title: 'Ведение справочников:',
    body: 'Новое значение флага "Оригинал в электронном виде" не соответствует заданным правилам заполнения реквизитов РК. Отредактировать эти правила?',
    buttons: [
        {title: 'Да', result: BUTTON_RESULT_YES, isDefault: true },
        {title: 'Нет', result: BUTTON_RESULT_NO, },
    ]
};

export const CONFIRM_COMBINE_NODES: IConfirmWindow = {
    title: 'Подтверждение объединения',
    body: 'Вы действительно хотите соединить объекты? ',
    okTitle: 'Да',
    cancelTitle: 'Нет'
};
