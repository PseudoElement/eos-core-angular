import { IMessage } from '../../eos-common/core/message.interface';

export const WARN_EDIT_ERROR: IMessage = {
    type: 'warning',
    title: 'Предупреждение: ',
    msg: 'не выбран элемент для редактирования'
};

export const WARN_SELECT_NODE: IMessage = {
    type: 'warning',
    title: 'Предупреждение: ',
    msg: 'не выбрано ни одного элемента'
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

export const DANGER_LOGICALY_RESTORE_ELEMENT: IMessage = {
    type: 'danger',
    title: 'Ошибка логического восстановления элемента: ',
    msg: 'нельзя логически восстановить подэлемент логически удаленного элемента'
};

export const WARN_SEARCH_NOTFOUND: IMessage = {
    type: 'warning',
    title: 'Ничего не найдено: ',
    msg: 'попробуйте изменить поисковую фразу'
};

export const DANGER_NAVIGATE_TO_DELETED_ERROR: IMessage = {
    type: 'danger',
    title: 'Ошибка редактирования элемента: ',
    /* tslint:disable:max-line-length */
    msg: 'больше нет не удалённых элементов. Включите просмотр логически удалённых элементов, чтобы просмотреть, или восстановите удалённые элементы, чтобы отредактировать'
    /* tslint:enable:max-line-length */
};

export const INFO_NOTHING_CHANGES: IMessage = {
    type: 'info',
    title: 'Информация о сохранении изменений: ',
    msg: 'текущие изменения совпадают с изначальным значением. Изменения не будут сохранены'
};

export const SUCCESS_SAVE: IMessage = {
    type: 'success',
    title: 'Изменения сохранены',
    msg: ''
};

export const WARN_SAVE_FAILED: IMessage = {
    type: 'warning',
    title: 'Предупреждение:',
    msg: 'изменения не сохранены!'
};

export const WARN_LOGIC_CLOSE: IMessage = {
    type: 'warning',
    title: 'Предупреждение:',
    msg: 'отмеченные элементы уже были закрыты!'
};

export const WARN_LOGIC_OPEN: IMessage = {
    type: 'warning',
    title: 'Предупреждение:',
    msg: 'отмеченные элементы уже были открыты!'
};

export const WARN_NOT_ELEMENTS_FOR_REPRESENTATIVE: IMessage = {
    type: 'warning',
    title: 'Предупреждение:',
    msg: 'нет элементов для назначений представителей организации'
};

export const WARN_NO_ORGANIZATION: IMessage = {
    type: 'warning',
    title: 'Предупреждение:',
    msg: 'вверх по иерархии нет организаций'
};

export const SEARCH_NOT_DONE: IMessage = {
    title: 'Идет поиск!',
    type: 'warning',
    msg: 'Пожалуйста подождите.'
};

export const SEARCH_EMPTY: IMessage = {
    title: 'Справочники',
    type: 'warning',
    msg: 'Не заданы поисковые критерии'
};

export const FILE_IS_NOT_IMAGE: IMessage = {
    type: 'warning',
    title: 'Предупреждение:',
    msg: 'выбранный файл не является изображением!'
};

export const WARN_WRONG_IMAGE_TYPE: IMessage = {
    type: 'warning',
    title: 'Предупреждение:',
    msg: 'допустимы изображения в формате *.jpeg, *.png'
};

export const FILE_IS_BIG: IMessage = {
    type: 'warning',
    title: 'Предупреждение:',
    msg: 'размер файла слишком велик! Выберите файл размером не более {maxFileSize}'
};

export const UPLOAD_IMG_FALLED: IMessage = {
    type: 'warning',
    title: 'Предупреждение:',
    msg: 'загрузить изображение не удалось!'
};

export const WARN_ELEMENT_PROTECTED: IMessage = {
    type: 'warning',
    title: 'Предупреждение:',
    msg: 'элемент "{{elem}}" является защищенным! Удаление невозможно.'
};
export const WARN_ELEMENT_CLOSED: IMessage = {
    type: 'warning',
    title: 'Предупреждение:',
    msg: 'элементы "{{elem}}" нельзя удалить!  Дела  непустые и уже закрыты!'
};

export const WARN_ELEMENT_DELETED: IMessage = {
    type: 'warning',
    title: 'Предупреждение:',
    msg: 'элемент "{{elem}}" удален! Действие невозможно.'
};

export const INFO_PERSONE_DONT_HAVE_CABINET: IMessage = {
    type: 'warning',
    title: 'Внимание:',
    msg: 'У выбранного должностного лица отсутствует свой кабинет.'
};

export const WARN_NO_BINDED_ORGANIZATION: IMessage = {
    type: 'warning',
    title: 'Предупреждение:',
    msg: 'У подразделения нет собственной организации. Удаление невозможно'
};

export const DANGER_EDIT_DICT_NOTALLOWED: IMessage = {
    type: 'danger',
    title: 'Ошибка редактирования',
    msg: 'Редактирование "Счетчика номерообразования НП" доступно только справочникам "Подразделения" и "Группы документов"'
};

export const DANGER_EDIT_ON_ROOT: IMessage = {
    type: 'danger',
    title: 'Ошибка редактирования',
    msg: 'Необходимо выбрать подразделение'
};

export const DANGER_EDIT_YEAR_INVALID: IMessage = {
    type: 'danger',
    title: 'Ошибка редактирования',
    msg: 'Неверно задан год'
};

export const DANGER_NUMCREATION_NP_CHANGE: IMessage = {
    type: 'danger',
    title: 'Предупреждение: ',
    msg: 'Значения больше указанного ранее уже использовались в нумерации НП. Изменение значения счетчика невозможно.'
};

export const DANGER_ORGANIZ_NO_SEV: IMessage = {
    type: 'danger',
    title: 'Предупреждение: ',
    msg: 'У выбранной организации не задан индекс СЭВ.'
};

export const DANGER_DEPART_IS_LDELETED: IMessage = {
    type: 'danger',
    title: 'Предупреждение: ',
    msg: 'Выбранное подразделение логически удалено.'
};

export const DANGER_DEPART_NO_NUMCREATION: IMessage = {
    type: 'danger',
    title: 'Предупреждение: ',
    msg: 'В выбранном подразделении не взведен флаг номерообразования'
};

export const DANGER_ACCESS_DENIED_DICT: IMessage = {
    type: 'danger',
    title: 'Предупреждение: ',
    msg: 'Недостаточно прав доступа к справочнику'
};

export const INFO_OPERATION_COMPLETE: IMessage = {
    type: 'info',
    title: 'Внимание:',
    msg: 'Записи: {{RECS}} {{OPERATION}}',
};
export const DANGER_EMPTY_FILE: IMessage = {
    type: 'warning',
    title: 'Предупреждение',
    msg: 'Шаблон в базе отсутствует',
};
export const DANGER_ERROR_FILE: IMessage = {
    type: 'warning',
    title: 'Предупреждение',
    msg: 'Ошибка чтения файла',
};
export const DANGER_SAVE_FILE: IMessage = {
    type: 'warning',
    title: 'Предупреждение',
    msg: 'Файл шаблона отсутсвует, сохранение невозможно',
};

export const SEV_DANGER_CHECK_ADDRESS: IMessage = {
    type: 'danger',
    title: 'У выбранных участников СЭВ не заполнены параметры доставки сообщения. Отправка сообщения невозможна.',
    msg: ''
};

export const SEV_SUCCESS_SEND: IMessage = {
    type: 'success',
    title: 'Сообщения СЭВ отправлены успешно',
    msg: ''
};

export const SEV_WARN_CHECK_CRYPT_CERTS_ALL: IMessage = {
    type: 'danger',
    title: 'У выбранных участников СЭВ не определен сертификат шифрования. Отправка сообщения невозможна',
    msg: ''
};

export const SEV_WARN_CHECK_SEV_DEPARTMENTS: IMessage = {
    type: 'info',
    title: '',
    msg: ''
};

export const SEV_CLEAR_IDENT_CODES: IMessage = {
    type: 'success',
    title: 'Очистка идентификационных кодов завершена успешно',
    msg: ''
};

export const WARN_NO_BINDED_DOCGROUP: IMessage = {
    type: 'warning',
    title: 'Предупреждение:',
    msg: 'Не указана группа документов. Удаление невозможно'
};

export const WARN_DUP_USER_DL: IMessage = {
    type: 'info',
    title: 'Предупреждение:',
    msg: 'ДЛ уже ассоциировано с другим пользователем.'
};
export const MESSAGE_TO_RENAME_ORGANIZATION_SEV: IMessage = {
    type: 'warning',
    title: '',
    msg: 'Изменилось название участника СЭВ в справочнике \"Организации\". Сохраните текущую карточку'
};


