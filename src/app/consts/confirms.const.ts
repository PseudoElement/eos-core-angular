import { IConfirmWindow } from '../../eos-common/core/confirm-window.interface';
import { IConfirmWindow2 } from 'eos-common/confirm-window/confirm-window2.component';

export const BUTTON_RESULT_YES = 1;
export const BUTTON_RESULT_OK = 1;
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
    body: 'Значения больше указанного ранее уже использовались в нумерации.',
    buttons: [
            {title: 'Ok', result: 1, isDefault: true, },
    ],
    manualCR: true,
};

export const CONFIRM_DEPARTMENTS_DATES_FIX: IConfirmWindow2 = {
    title: 'Ведение справочников',
    body: 'Период существования элемента выходит за границы существования родительской вершины. Скорректировать даты?',
    buttons: [
            {title: 'Да', result: BUTTON_RESULT_YES, isDefault: true, },
            {title: 'Нет', result: BUTTON_RESULT_NO, },
    ],
    // manualCR: true,
};
export const CONFIRM_DEPARTMENTS_DATES_FIX1: IConfirmWindow2 = {
    title: 'Ведение справочников',
    body: 'Период существования подчиненных элементов выходит за границы существования родительской вершины. Скорректировать даты подчиненных элементов?',
    buttons: [
            {title: 'Да', result: BUTTON_RESULT_YES, isDefault: true, },
            {title: 'Нет', result: BUTTON_RESULT_NO, },
    ],
    // manualCR: true,
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
export const RK_ERROR_SAVE_SECUR: IConfirmWindow2 = {
    title: 'Внимание',
    bodyList: [],
    body: '',
    bodyAfterList: '',
    buttons: [
        {title: 'Ок', result: 1, isDefault: true, },
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

export const RK_SELECTED_VALUE_INCORRECT_EMPTY_LIST: IConfirmWindow2 = {
    title: 'Внимание',
    bodyList: [],
    body: 'Выбранный список пуст. Заполните его или смените значение параметра "Доступ"',
    buttons: [
        { title: 'Ок', result: 2, isDefault: true, },
    ],
};

export const CONFIRM_SAVE_WITHOUT_FILE: IConfirmWindow2 = {
    title: 'Внимание',
    bodyList: [],
    body: 'Не выбран файл шаблона.',
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

export const CONFIRM_NOT_CONSLITE: IConfirmWindow2 = {
    title: 'Справочники СЭВ',
    bodyList: [],
    body: 'Подразделение образующее \"Картотеку автомата\", не входит в состав организации "Получателя".\nПродолжить сохранение?:',
    // bodyAfterList: 'Продолжить?',
    buttons: [
        {title: 'Да', result: 1, isDefault: true, },
        {title: 'Нет',  result: 2, },
    ],
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

export const CONFIRM_OPERATION_FILL_ENDDATE: IConfirmWindow2 = {
    title: 'Внимание',
    bodyList: [],
    body: 'Заполните, пожалуйста, поле «Дата окончания действия» у удаляемого (логически) подразделения.',
    buttons: [
        {title: 'Ok', result: BUTTON_RESULT_OK, isDefault: true, },
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
export const CONFIRM_OPERATION_NOMENKL_CLOSED: IConfirmWindow2 = {
    title: 'Внимание',
    bodyList: [],
    body: 'Невозможно удалить дела:',
    bodyAfterList: 'Вы хотите закрыть их?',
    buttons: [
        {title: 'Отменить', result: 1, isDefault: true, },
        {title: 'Закрыть',  result: 2, },
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

export const CONFIRM_DG_FIXE_V2: IConfirmWindow2 = {
    title: 'Вид РК:',
    body: 'Вид РК не может быть отредактирован, поскольку в правилах регистрации заданы следующие специфические реквизиты:',
    // bodyList: [],
    bodyAfterList: 'Удалить реквизит(ы)?',
    buttons: [
        {title: 'Да', result: BUTTON_RESULT_YES, },
        {title: 'Нет', result: BUTTON_RESULT_NO, isDefault: true },
    ]
};

export const CONFIRM_COMBINE_NODES: IConfirmWindow = {
    title: 'Подтверждение объединения',
    body: 'Вы действительно хотите соединить объекты? ',
    okTitle: 'Да',
    cancelTitle: 'Нет'
};
export const CONFIRM_PRINT_INCLUDE: IConfirmWindow = {
    title: 'Печать',
    body: 'Печатать с учётом подчинённых? ',
    okTitle: 'Да',
    cancelTitle: 'Нет'
};
export const CONFIRM_DG_SHABLONRK: IConfirmWindow2 = {
    title: 'Ведение справочников:',
    body: 'Шаблон Рег.№ не соответствует указанному Виду РК.',
    buttons: [
        {title: 'OK', result: BUTTON_RESULT_OK, isDefault: true },
    ]
};
export const CONFIRM_SEV_DEFAULT: IConfirmWindow = {
    title: 'Значения по умолчанию',
    body: 'Применить значения по умолчанию для коллизий группы ',
    okTitle: 'ПРИМЕНИТЬ',
    cancelTitle: 'ОТМЕНИТЬ'
};

export const CONFIRM_OPERATION_NOT_DATE: IConfirmWindow2 = {
    title: 'Внимание',
    bodyList: [],
    body: 'Логическое удаление некоторых подразделений невозможно (не заполнена Дата окончания действия):',
    bodyAfterList: 'Продолжить?',
    buttons: [
        {title: 'Отменить', result: 1, isDefault: true, },
        {title: 'Продолжить',  result: 2, },
    ],
};
export const CONFIRM_OPERATION_NOT_DATE_ALL: IConfirmWindow2 = {
    title: 'Внимание',
    bodyList: [],
    body: 'Логическое удаление всех отмеченных подразделений невозможно (не заполнена Дата окончания действия):',
    buttons: [
        {title: 'OK', result: 1, isDefault: true, },
    ],
};
export const CONFIRM_CHANGE_CONFIDENTIONAL_FLAG: IConfirmWindow2 = {
    title: 'Внимание',
    bodyList: [],
    body: `В системе существуют РК и файлы с данным грифом доступа. После внесения изменений в их реквизитах возможны не корректные значения.
     Вы хотите изменить значение флага «ДСП файлы»?`,
    buttons: [
        {title: 'Нет', result: 1, isDefault: true, },
        {title: 'Да',  result: 2, },
    ],
};
export const CONFIRM_CHANGE_ISN_ADDR_CATEGORY: IConfirmWindow2 = {
    title: 'Ведение справочников',
    bodyList: [],
    body: `Менять на новое значение Категории адресатов в подчиненных организациях? `,
    buttons: [
        {title: 'Да',  result: 2, },
        {title: 'Нет', result: 1, isDefault: true, },
    ],
};

export const CONFIRM_REPLACE_SAME_FILE: IConfirmWindow2 = {
    title: 'Внимание',
    bodyList: [],
    body: ``,
    buttons: [
        {title: 'Да',  result: 2, },
        {title: 'Нет', result: 1, isDefault: true, },
    ],
};
