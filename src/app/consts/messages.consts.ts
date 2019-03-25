import { IMessage /*, DEFAULT_DISMISS_TIMEOUT, DANGER_DISMISS_TIMEOUT */} from '../../eos-common/core/message.interface';

export const WARN_DESK_EDITING: IMessage = {
    type: 'warning',
    title: 'Ошибка редактирования рабочего стола:',
    msg: 'одновременное редактирование нескольких рабочих столов запрещено',
};

export const WARN_DESK_CREATING: IMessage = {
    type: 'warning',
    title: 'Ошибка создания рабочего стола:',
    msg: 'Закончите редактирование рабочего стола',
};

export const WARN_DESK_MAX_COUNT: IMessage = {
    type: 'warning',
    title: 'Предупреждение: максимальное колличество рабочих столов!',
    msg: 'У вас может быть не более 5 рабочих столов',
};

export const DANGER_DESK_CREATING: IMessage = {
    type: 'danger',
    title: 'Ошибка создания рабочего стола:',
    msg: 'нельзя создавать рабочие столы с одинаковым именем',
};

export const WARN_LINK_PIN: IMessage = {
    type: 'warning',
    title: 'Ошибка добавления ссылки:',
    msg: 'ссылка была прикреплена к этому рабочему столу ранее',
};

export const WARN_SEARCH_NOTFOUND: IMessage = {
    type: 'warning',
    title: 'Ничего не найдено: ',
    msg: 'попробуйте изменить поисковую фразу',
};

export const WARN_EDIT_ERROR: IMessage = {
    type: 'warning',
    title: 'Ошибка редактирования: ',
    msg: 'не выбран элемент для редактирования',
};

export const WARN_CABINET_DELETE: IMessage = {
    type: 'warning',
    title: 'Удаление отменено',
    msg: 'Папки кабинета {name} не пусты',
};

export const DANGER_EDIT_ROOT_ERROR: IMessage = {
    type: 'danger',
    title: 'Ошибка редактирования элемента: ',
    msg: 'вы пытаетесь отредактировать корень (или другой элемент без id). Корень нельзя редактировать'
};

export const DANGER_EDIT_DELETED_ERROR: IMessage = {
    type: 'danger',
    title: 'Ошибка редактирования элемента: ',
    msg: 'удалённые элементы нельзя редактировать'
};

export const DANGER_DELETE_ELEMENT: IMessage = {
    type: 'danger',
    title: 'Ошибка удаления элемента: ',
    msg: 'на этот объект ссылаются другие объекты системы'
};

export const SESSION_CLOSED: IMessage = {
    type: 'success',
    title: 'Сессия завершена',
    msg: '',
    dismissOnTimeout: 3000,
    authMsg: true
};

export const AUTH_REQUIRED: IMessage = {
    type: 'danger',
    title: 'Ошибка авторизации',
    msg: '',
    authMsg: true
};

export const NAVIGATE_TO_ELEMENT_WARN: IMessage = {
    title: 'Предупреждение:',
    msg: 'Запись не найдена.',
    type: 'warning'
};
export const EMPTY_ADD_ELEMENT_WARN: IMessage = {
    type: 'warning',
    title: 'Предупреждение:',
    msg: 'Нет элементов для добавления.'
};
export const DUE_DEP_OCCUPATION: IMessage = {
    title: 'Предупреждение:',
    msg: 'Должностное лицо уже привязано к пользователю.',
    type: 'warning'
};
export const ENPTY_ALLOWED_CREATE_PRJ: IMessage = {
    title: 'Предупреждение:',
    msg: 'Пользователю дано право на создание РКПД, но нет разрешения ни на одну группу документов!\nУкажите группу документов для создания РКПД.',
    type: 'warning'
};
export const EMPTY_ALLOWED_CREATE_REGISTRATION_OF_DOCUMENTS: IMessage = {
    title: 'Предупреждение:',
    msg: 'Пользователю дано право на регистрацию документов, но нет разрешения ни на одну группу документов!\nУкажите группу документов для регистрации.',
    type: 'warning'
};
