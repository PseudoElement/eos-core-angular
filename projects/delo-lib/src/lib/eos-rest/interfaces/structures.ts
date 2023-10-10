import { IEnt, ILinearCL, IHierCL, IStamp } from "./interfaces";

// tslint:disable class-name

/**
 * Словарь недопустимых паролей
 */
export interface PASS_STOP_LIST extends IEnt {
    /**
     * Недопустимое значение
     */
    CLASSIF_NAME: string;
    /**
     * ISN Недопустимого значения
     */
    ISN_PASS_STOP_LIST: number;
}

/**
 * Справочник видов доставки
 */
export interface DELIVERY_CL extends ILinearCL {
    /**
     * Название вида доставки
     */
    CLASSIF_NAME: string;
    /**
     * ISN вида доставки
     */
    ISN_LCLASSIF: number;
    /**
     * Вес элемента
     */
    WEIGHT: number;
    /**
     * Электронная отправка
     */
    E_SENDING_FLAG: number;
}

/**
 * Справочник Категории адресатов
 */
export interface ADDR_CATEGORY_CL extends ILinearCL {
    /**
     * Наименование
     */
    CLASSIF_NAME: string;
    /**
     * ISN_LCLASSIF
     */
    ISN_LCLASSIF: number;
    /**
     * Вес
     */
    WEIGHT: number;
}

/**
 * Категории ЭП
 */
export interface EDS_CATEGORY_CL extends ILinearCL {
    /**
     * Название
     */
    CLASSIF_NAME: string;
    /**
     * ISN записи
     */
    ISN_LCLASSIF: number;
    /**
     * Вес
     */
    WEIGHT: number;
}

/**
 * Справочник Типы связок
 */
export interface LINK_CL extends ILinearCL {
    /**
     * ISN типа связи
     */
    ISN_LCLASSIF: number;
    /**
     * Имя типа связи
     */
    CLASSIF_NAME: string;
    /**
     * Вес элемента
     */
    WEIGHT: number;
    /**
     * Тип связки
     */
    LINK_TYPE: number;
    /**
     * Направленность связки
     */
    LINK_DIR: number;
    /**
     * Индекс связки
     */
    LINK_INDEX: string;
    /**
     * ISN парной связи
     */
    ISN_PARE_LINK: number;
    /**
     * Есть доступ к связанному объекту
     */
    TRANSPARENT: number;
    // идентификатор медо
    MEDO_ID: string;
}

export interface FORMAT_CL extends ILinearCL {
    ISN_LCLASSIF: number;
    FORMAT_TNAME: string;
    KIND_ADJ: number;
    FILE_ADJ: any;
    FORMAT_GNAME: string;
    COLOR: number;
    COMPR: number;
    WEIGHT: number;
    PROTECTED: any;
    DEL_COL: number;
    NOTE: string;
    PRIORITET: number;
}

/**
 * Справочник Типов организаций
 */
export interface ORG_TYPE_CL extends ILinearCL {
    /**
     * ISN_LCLASSIF
     */
    ISN_LCLASSIF: number;
    /**
     * Наименование
     */
    CLASSIF_NAME: string;
    /**
     * Вес элемента
     */
    WEIGHT: number;
}

/**
 * Справочник Типов реестров
 */
export interface REESTRTYPE_CL extends ILinearCL {
    /**
     * ISN типа реестра
     */
    ISN_LCLASSIF: number;
    /**
     * Вес элемента
     */
    WEIGHT: number;
    /**
     * Имя типа реестра
     */
    CLASSIF_NAME: string;
    /**
     * Категория адресата
     */
    ISN_ADDR_CATEGORY: number;
    /**
     * ISN вид доставки
     */
    ISN_DELIVERY: number;
    /**
     * Признак номерообразования
     */
    FLAG_TYPE: number;
    /**
     * Срочность
     */
    EMERGENCY: string;
    /**
     * Важность
     */
    IMPOTANCE: string;
    /**
     * Партионая почта
     */
    GROUP_MAIL: number;
}

/**
 * Справочник Категорий поручений
 */
export interface RESOLUTION_CATEGORY_CL extends ILinearCL {
    /**
     * ISN категории
     */
    ISN_LCLASSIF: number;
    /**
     * Наименование
     */
    CLASSIF_NAME: string;
    /**
     * Вес элемента
     */
    WEIGHT: number;
    /**
     * Использовать для расчета срока поручения
     */
    PLAN_COUNT_FLAG: number;
    /**
     * Количество дней
     */
    PLAN_DAY_COUNT: number;
    /**
     * Расчет в рабочих или календарных днях
     */
    PLAN_DAY_TYPE: number;
    /**
     * Запретить редактирование плановой даты
     */
    PLAN_PROTECTED: number;
}

/**
 * Приоритеты проекта поручения
 */
export interface RESPRJ_PRIORITY_CL extends ILinearCL {
    /**
     * ISN_LCLASSIF
     */
    ISN_LCLASSIF: number;
    /**
     * Наименование
     */
    CLASSIF_NAME: string;
    /**
     * Вес элемента
     */
    WEIGHT: number;
}

/**
 * Статусы проекта поручения
 */
export interface RESPRJ_STATUS_CL extends ILinearCL {
    /**
     * ISN элемента
     */
    ISN_LCLASSIF: number;
    /**
     * Наименование
     */
    CLASSIF_NAME: string;
    /**
     * Вес элемента
     */
    WEIGHT: number;
}

/**
 * Канал передачи сообщений
 */
export interface SEV_CHANNEL extends ILinearCL {
    /**
     * ISN канала передачи сообщений
     */
    ISN_LCLASSIF: number;
    /**
     * Тип канала
     */
    CHANNEL_TYPE: string;
    /**
     * Параметры доставки
     */
    PARAMS: string;
    /**
     * Вес элемента
     */
    WEIGHT: number;
    /**
     * Наименование канала передачи
     */
    CLASSIF_NAME: string;
}

/**
 * Участник СЭВ
 */
export interface SEV_PARTICIPANT extends ILinearCL {
    /**
     * ISN участника МЭДО
     */
    ISN_LCLASSIF: number;
    /**
     * DUE организации
     */
    DUE_ORGANIZ: string;
    /**
     * Канал передачи сообщений
     */
    ISN_CHANNEL: number;
    /**
     * Именование участника МЭДО
     */
    CLASSIF_NAME: string;
    /**
     * Вес элемента
     */
    WEIGHT: number;
    /**
     * Адрес
     */
    ADDRESS: string;

    /**
     * список используемых для участников СЭВ правил
     */
    SEV_PARTICIPANT_RULE_List: SEV_PARTICIPANT_RULE[];
    /*
     * Имя организации
     */
    ORGANIZ_CL_NAME: string;
}

/**
 * Событие в докладе
 */
export interface SEV_REPORT_EVENT extends ILinearCL {
    /**
     * ISN события
     */
    ISN_LCLASSIF: number;
    /**
     * Вес элемента
     */
    WEIGHT: number;
    /**
     * Наименование события
     */
    CLASSIF_NAME: string;
}

/**
 * Правило СЭВ
 */
export interface SEV_RULE extends ILinearCL {
    /**
     * ISN правил
     */
    ISN_LCLASSIF: number;
    /**
     * Вид правила
     */
    RULE_KIND: number;
    /**
     * Наименование правила МЭДО
     */
    CLASSIF_NAME: string;
    /**
     * Группа документов
     */
    DUE_DOCGROUP: string;
    /**
     * Условия
     */
    FILTER_CONFIG: string;
    /**
     * Параметры обработки
     */
    SCRIPT_CONFIG: string;
    /**
     * Вес элемента
     */
    WEIGHT: number;
    /**
     * DUE_DEP
     */
    DUE_DEP: string;
}

/**
 * Ограничения шаблонов номерообразования
 */
export interface SHABLON_DETAIL extends ILinearCL {
    /**;
     * ISN типа связи
     */
    ISN_LCLASSIF: number;
    /**
     * Код Дьюи группы
     */
    DUE: string;
    /**
     * Элемент шаблона
     */
    ELEMENT: string;
    /**
     * тип органичения
     */
    CONSTR_TYPE: string;
}

/**
 * Виды подписей (ЭП)
 */
export interface SIGN_KIND_CL extends ILinearCL {
    /**
     * ISN элемента
     */
    ISN_LCLASSIF: number;
    /**
     * Наименование
     */
    CLASSIF_NAME: string;
    /**
     * Текст подписи
     */
    SIGN_TEXT: string;
    /**
     * Вес элемента
     */
    WEIGHT: number;
}

/**
 * Справочник Состояния исполнения (Контролера)
 */
export interface STATUS_EXEC_CL extends ILinearCL {
    /**
     * ISN_LCLASSIF
     */
    ISN_LCLASSIF: number;
    /**
     * Наименование
     */
    CLASSIF_NAME: string;
    /**
     * Вес элемента
     */
    WEIGHT: number;
}

/**
 * Справочник Состояния исполнения (Исполнителя)
 */
export interface STATUS_REPLY_CL extends ILinearCL {
    /**
     * ISN_LCLASSIF
     */
    ISN_LCLASSIF: number;
    /**
     * Наименование
     */
    CLASSIF_NAME: string;
    /**
     * Вес элемента
     */
    WEIGHT: number;
}

/**
 * Группы документов пользователя
 */
export interface USER_CARD_DOCGROUP extends ILinearCL {
    /**
     * ISN пользователя
     */
    ISN_LCLASSIF: number;
    /**
     * Код Дьюи ДЛ_картотеки
     */
    DUE_CARD: string;
    /**
     * Код Дьюи группы док
     */
    DUE: string;
    /**
     * FUNC_NUM
     */
    FUNC_NUM: number;
    /**
     * Разрешение
     */
    ALLOWED: number;
}

/**
 * Справочник Пользователей
 */
export interface USER_CL extends ILinearCL {
    /**
     * ISN пользователя
     */
    ISN_LCLASSIF: number;
    /**
     * Гриф доступа
     */
    SECURLEVEL: number;
    /**
     * Должностное лицо
     */
    DUE_DEP: string;
    /**
     * Вес элемента
     */
    WEIGHT: number;
    /**
     * Имя пользователя
     */
    SURNAME_PATRON: string;
    /**
     * Идентификатор
     */
    CLASSIF_NAME: string;
    /**
     * Пароль
     */
    PASSWORD: string;
    /**
     * Ид ORACLE
     */
    ORACLE_ID: string;
    /**
     * Пр Администратора
     */
    ADMIN: number;
    /**
     * Тип пользователя
     */
    USERTYPE: number;
    /**
     * Доступные системы
     */
    AV_SYSTEMS: string;
    /**
     * Администратор систем
     */
    ADM_SYSTEMS: string;
    /**
     * Права в ДЕЛЕ абсолютные
     */
    DELO_RIGHTS: string;
    /**
     * Права в поточном ск
     */
    STREAM_SCAN_RIGHTS: string;
    /**
     * Справочники доступные системному технологу
     */
    TECH_RIGHTS: string;
    /**
     * Права в архиве
     */
    ARCHIVE_RIGTHS: string;
    /**
     * Было неудачных попыток входа
     */
    LOGIN_ATTEMPTS: number;
    /**
     * Проверенность пароля
     */
    IS_PASSWORD: number;
    /**
     * Администратор системы
     */
    IS_SECUR_ADM: number;
    /**
     * Дата смены пароля
     */
    PASSWORD_DATE: number;
    /**
     * Подразделение пользователя
     */
    TECH_DUE_DEP: string;
    /**
     * Примечание
     */
    NOTE2: string;

    /**
     * список используемых для этого пользователя параметров систем оповещения и уведомления
     */
    NTFY_USER_EMAIL_List: NTFY_USER_EMAIL[];

    /**
     * список используемых для этого пользователя полей стандартного ввода
     */
    STTEXT_CONTROL_List: STTEXT_CONTROL[];

    /**
     * список используемых для этого пользователя папок
     */
    UFOLDER_List: FOLDER[];

    /**
     * список используемых для этого пользователя сертификатов
     */
    USER_CERTIFICATE_List: USER_CERTIFICATE[];

    /**
     * список используемых для этого пользователя доступов к группам документов
     */
    USER_DOCGROUP_ACCESS_List: USER_DOCGROUP_ACCESS[];

    /**
     * список используемых для этого пользователя настроек
     */
    USER_PARMS_List: USER_PARMS[];

    /**
     * список используемых для этого пользователя прав на справочники
     */
    USER_TECH_List: USER_TECH[];

    /**
     * список используемых для этого пользователя представлений результатов запроса
     */
    USER_VIEW_List: USER_VIEW[];

    /**
     * список используемых для этого пользователя сохраненных запросов
     */
    USER_REQUEST_List: USER_REQUEST[];

    /**
     * список используемых для этого пользователя картотечных прав
     */
    USERCARD_List: USERCARD[];

    /**
     * список используемых для этого пользователя абсолютных прав
     */
    USERDEP_List: USERDEP[];

    /**
     * список используемых для этого пользователя грифов доступа
     */
    USERSECUR_List: USERSECUR[];
    /**
     * список используемых для этого пользователя группы документов абсолютных прав
     */
    USER_RIGHT_DOCGROUP_List: USER_RIGHT_DOCGROUP[];
    //    USER_EDIT_ORG_TYPE_List;

    /** настрокки пользователя вызова справочников */
    CLICK_MODE_SETTINGS: number;
}

/**
 * Доступ пользователей к группам документов
 */
export interface USER_DOCGROUP_ACCESS extends ILinearCL {
    /**
     * ISN пользователя
     */
    ISN_LCLASSIF: number;
    /**
     * Код Дьюи группы
     */
    DUE: string;
    /**
     * Разрешения доступа
     */
    ALLOWED: number;
}

/**
 * Права ведения внешних резолюций для организаций
 */
export interface USER_ORGANIZ extends ILinearCL {
    /**
     * ISN пользователя
     */
    ISN_LCLASSIF: number;
    /**
     * Код Дьюи организации
     */
    DUE: string;
    /**
     * Номер функции
     */
    FUNC_NUM: number;
    /**
     * Вес
     */
    WEIGHT: number;
}

/**
 * Ограничения прав пользователей по группам документов
 */
export interface USER_RIGHT_DOCGROUP extends ILinearCL {
    /**
     * ISN пользователя
     */
    ISN_LCLASSIF: number;
    /**
     * номер права
     */
    FUNC_NUM: number;
    /**
     * DUE группы документов
     */
    DUE: string;
    /**
     * Разрешено
     */
    ALLOWED: number;
}

/**
 * Права пользователей на справочниках
 */
export interface USER_TECH extends ILinearCL {
    /**
     * ISN пользователя
     */
    ISN_LCLASSIF: number;
    /**
     * номер права
     */
    FUNC_NUM: number;
    /**
     * Дюе
     */
    DUE: string;
    /**
     * ID справочника
     */
    CLASSIF_ID: number;
    /**
     * Разрешение
     */
    ALLOWED: number;
}

/**
 * Картотечные права пользователя
 */
export interface USERCARD extends ILinearCL {
    /**
     * ISN пользователя
     */
    ISN_LCLASSIF: number;
    /**
     * Код Дьюи ДЛ_картотеки
     */
    DUE: string;
    /**
     * Признак гл картотеки
     */
    HOME_CARD: number;
    /**
     * Перечень функций
     */
    FUNCLIST: string;

    /**
     * список используемых для пользователя группы документов
     */
    USER_CARD_DOCGROUP_List: USER_CARD_DOCGROUP[];
    /**
     * список используемых для пользователя карточных прав на кабинеты
     */
    USER_CABINET_List: USER_CABINET[];
}

/**
 * Перечни ДЛ для абсолютных прав
 */
export interface USERDEP extends ILinearCL {
    /**
     * ISN пользователя
     */
    ISN_LCLASSIF: number;
    /**
     * func_num
     */
    FUNC_NUM: number;
    /**
     * Код Дьюи ДЛ
     */
    DUE: string;
    /**
     * Вес
     */
    WEIGHT: number;
    /**
     * Учитывать вложенные
     */
    DEEP: number;
    /**
     * Разрешено
     */
    ALLOWED: number;
}

/**
 * Справочник Типы визы
 */
export interface VISA_TYPE_CL extends ILinearCL {
    /**
     * ISN_LCLASSIF
     */
    ISN_LCLASSIF: number;
    /**
     * Наименование
     */
    CLASSIF_NAME: string;
    /**
     * Вес элемента
     */
    WEIGHT: number;
    /**
     * Признак финальной визы
     */
    IS_FINAL: number;
    /**
     * Статус визы
     */
    STATUS: string;
}

/**
 * Категории доп реквизитов в поиске
 */
export interface AR_CATEGORY extends IHierCL {
    /**
     * Номер уровня
     */
    LAYER: number;
    /**
     * Вес элемента
     */
    WEIGHT: number;
    /**
     * Вид допреквизитов
     */
    KIND: number;
    /**
     * Наименование категории
     */
    CLASSIF_NAME: string;
    /**
     * ISN доп реквизита
     */
    ISN_AR_DESCRIPT: number;
}

/**
 * Значения доп реквизитов организаций
 */
// tslint:disable-next-line:no-empty-interface
export interface AR_ORGANIZ_VALUE extends IHierCL {}

/**
 * Справочник статусов граждан
 */
export interface CITSTATUS_CL extends IHierCL, IStamp {
    /**
     * Номер уровня
     */
    LAYER: number;
    /**
     * Вес элемента
     */
    WEIGHT: number;
    /**
     * MAX значение кода Дьюи
     */
    MAXDUE: string;
    /**
     * Наименование статуса
     */
    CLASSIF_NAME: string;
    /**
     * Код
     */
    CODE: string;
}

/**
 * Справочник подразделений (ДЛ)
 */
export interface DEPARTMENT extends IHierCL, IStamp {
    /**
     * Не используется Организация
     */
    ISN_ORGANIZ: number;
    /**
     * Номер уровня
     */
    LAYER: number;
    /**
     * Вес элемента
     */
    WEIGHT: number;
    /**
     * MAX значение кода Дьюи
     */
    MAXDUE: string;
    /**
     * Код Дьюи организации
     */
    DUE_ORGANIZ: string;
    /**
     * Наименование ДЛ
     */
    CLASSIF_NAME: string;
    /**
     * Фамилия
     */
    SURNAME: string;
    /**
     * Должность
     */
    DUTY: string;
    /**
     * полное наименование
     */
    FULLNAME: string;
    /**
     * код
     */
    CODE: string;
    /**
     * skype
     */
    SKYPE: string;
    /**
     * Картотека ДЛ
     */
    DEPARTMENT_DUE: string;
    /**
     * ISN кабинета
     */
    ISN_CABINET: number;
    /**
     * Порядковый номер в кабинете
     */
    ORDER_NUM: number;
    /**
     * Индекс ДЛ
     */
    DEPARTMENT_INDEX: string;
    /**
     * Признак начальника
     */
    POST_H: number;
    /**
     * Признак образования картотеки
     */
    CARD_FLAG: number;
    /**
     * Наименование картотеки
     */
    CARD_NAME: string;
    /**
     * Дата начала действия
     */
    START_DATE: number;
    /**
     * Дата окончания действия
     */
    END_DATE: number;
    /**
     * ISN контакта
     */
    ISN_CONTACT: number;
    /**
     * № местн тел
     */
    PHONE_LOCAL: string;
    /**
     * № тел
     */
    PHONE: string;
    /**
     * Факс
     */
    FAX: string;
    /**
     * E_MAIL
     */
    E_MAIL: string;
    /**
     * № каб
     */
    NUM_CAB: string;
    /**
     * Due связанной организации
     */
    DUE_LINK_ORGANIZ: string;
    /**
     * ISN фотографии
     */
    ISN_PHOTO: number;
    /**
     * WDUE
     */
    WDUE: string;
    ISN_STAMP: number;
    /** Флаг отправки. */
    EXPEDITION_FLAG: number;
    /** Department_MedoId_name*/
    MEDO_ID: string;

    /** Запись не проверенна */
    UNREAD_FLAG: number;

    ISN_LCLASSIF?: number;
}

/**
 * Справочник Группы документов
 */
export interface DOCGROUP_CL extends IHierCL, IStamp {
    /**
     * Номер уровня
     */
    LAYER: number;
    /**
     * Признак нумерации копий
     */
    IS_COPYCOUNT: number;
    /**
     * Вес элемента
     */
    WEIGHT: number;
    /**
     * MAX значение кода Дьюи
     */
    MAXDUE: string;
    /**
     * Наименование группы
     */
    CLASSIF_NAME: string;
    /**
     * Полное наименование
     */
    FULLNAME: string;
    /**
     * Код
     */
    CODE: string;
    /**
     * Вид РК
     */
    REG_DATE_PROTECTED: string;
    /**
     * Запрещение на редактирование рег. даты
     */
    RC_TYPE: number;
    /**
     * Индекс группы
     */
    DOCGROUP_INDEX: string;
    /**
     * Признак образования номеров
     */
    DOCNUMBER_FLAG: number;
    /**
     * Шаблон номера документа
     */
    SHABLON: string;
    /**
     * Требуется ЭП
     */
    EDS_FLAG: number;
    /**
     * Требуется шифрование
     */
    ENCRYPT_FLAG: number;
    /**
     * Проверять уникальность
     */
    TEST_UNIQ_FLAG: number;
    /**
     * Разрешение создания РКПД
     */
    PRJ_NUM_FLAG: number;
    /**
     * Шаблон номера проекта документа
     */
    PRJ_SHABLON: string;
    /**
     * Вес в списке для проектов
     */
    PRJ_WEIGHT: number;
    /**
     * Авторегистрация проекта
     */
    PRJ_AUTO_REG: number;
    /**
     * Применять ЭП для подписания проекта
     */
    PRJ_APPLY_EDS: number;
    /**
     * Применять ЭП для визирования проекта
     */
    PRJ_APPLY2_EDS: number;
    /**
     * Применять ЭП для исполнителя проекта
     */
    PRJ_APPLY_EXEC_EDS: number;
    /**
     * Удалять РК проекта после регистрации
     */
    PRJ_DEL_AFTER_REG: number;
    /**
     * Флаг проверки уникальности номера проекта
     */
    PRJ_TEST_UNIQ_FLAG: number;
    /**
     * Электронный документ
     */
    E_DOCUMENT: number;
    /**
     * Конфиденциальность
     */
    ACCESS_MODE: number;
    /**
     * Без редактирования
     */
    ACCESS_MODE_FIXED: number;
    /**
     * флаг Инициативная резолюция
     */
    INITIATIVE_RESOLUTION: number;

    /**
     * список используемых для этой группы документов дополнительных реквизитов
     */
    AR_DOCGROUP_List: AR_DOCGROUP[];

    /**
     * список используемых для этой группы документов ограничений на файлы
     */
    DG_FILE_CONSTRAINT_List: DG_FILE_CONSTRAINT[];

    /**
     * список используемых для этой группы документов дополнительных реквизитов РК
     */
    DOC_DEFAULT_VALUE_List: DOC_DEFAULT_VALUE[];

    /**
     * список используемых для этой группы документов правил заполнения реквизитов РКПД
     */
    PRJ_DEFAULT_VALUE_List: PRJ_DEFAULT_VALUE[];

    /**
     * список используемых для этой группы документов ограничений шаблонов номерообразования
     */
    SHABLON_DETAIL_List: SHABLON_DETAIL[];
}

/**
 * Справочник организаций
 */
export interface ORGANIZ_CL extends IHierCL, IStamp {
    /**
     * Номер уровня
     */
    LAYER: number;
    /**
     * Вес элемента
     */
    WEIGHT: number;
    /**
     * MAX значение кода Дьюи
     */
    MAXDUE: string;
    /**
     * Поиск наимен организации
     */
    CLASSIF_NAME_SEARCH: string;
    /**
     * Наименование организации
     */
    CLASSIF_NAME: string;
    /**
     * Полное наименование
     */
    FULLNAME: string;
    /**
     * Почтовый индекс
     */
    ZIPCODE: string;
    /**
     * Город
     */
    CITY: string;
    /**
     * Почтовый адрес
     */
    ADDRESS: string;
    /**
     * Признак использования E_MAIL для всех представителей
     */
    MAIL_FOR_ALL: number;
    /**
     * Признак новой записи
     */
    NEW_RECORD: number;
    /**
     * ОКПО
     */
    OKPO: string;
    /**
     * ИНН
     */
    INN: string;
    /**
     * Регион
     */
    ISN_REGION: number;
    /**
     * ОКОНХ
     */
    OKONH: string;
    /**
     * Юридический Адресс
     */
    LAW_ADRESS: string;
    /**
     * Форма Собственности
     */
    ISN_ORGANIZ_TYPE: number;
    /**
     * Регисрационное свидейтельство
     */
    SERTIFICAT: string;
    /**
     * Категория адресата
     */
    ISN_ADDR_CATEGORY: number;
    /**
     * поле для формирования выписок для ЦБ
     */
    CODE: string;
    /**
     * ОГРН
     */
    OGRN: string;
    /**
     * Срок исполнения РК.
     */
    TERM_EXEC: number;

    /** Срок исполнения РК в каких днях. */
    TERM_EXEC_TYPE: string;

    /**
     * список используемых для справочника организаций значений доп. реквизитов
     */
    AR_ORGANIZ_VALUE_List: AR_ORGANIZ_VALUE[];

    /**
     * список используемых для справочника организаций банковских реквизитов
     */
    BANK_RECVISIT_List: BANK_RECVISIT[];

    /**
     * список используемых для справочника организаций контактов
     */
    CONTACT_List: CONTACT[];
}

/**
 * Справочник Регионов
 */
export interface REGION_CL extends IHierCL {
    /**
     * Номер уровня
     */
    LAYER: number;
    /**
     * Вес элемента
     */
    WEIGHT: number;
    /**
     * MAX значение кода Дьюи
     */
    MAXDUE: string;
    /**
     * Наименование
     */
    CLASSIF_NAME: string;
    /**
     * Код региона
     */
    CODE: number;
    /**
     * Код ОКАТО
     */
    COD_OKATO: number;
}

/**
 * Справочник рубрик
 */
export interface RUBRIC_CL extends IHierCL, IStamp {
    /**
     * Номер уровня
     */
    LAYER: number;
    /**
     * Вес элемента
     */
    WEIGHT: number;
    /**
     * MAX значение кода Дьюи
     */
    MAXDUE: string;
    /**
     * Наименование темы
     */
    CLASSIF_NAME: string;
    /**
     * Полное наименование
     */
    FULLNAME: string;
    /**
     * Код рубрики_
     */
    CODE: string;
    /**
     * Код рубрики
     */
    RUBRIC_CODE: string;
}

/**
 * Категории осн реквизитов РК и РКПД в поиске
 */
export interface SRCH_CATEGORY extends IHierCL {
    /**
     * Номер уровня
     */
    LAYER: number;
    /**
     * Вес элемента
     */
    WEIGHT: number;
    /**
     * Вид критериев
     */
    KIND: number;
    /**
     * Наименование категории
     */
    CLASSIF_NAME: string;
    /**
     * ISN критерия
     */
    ISN_CRITERY: number;
}

/**
 * Описание доп реквизитов
 */
export interface AR_DESCRIPT extends IEnt {
    /**
     * ISN_AR_DESCRIPT
     */
    ISN_AR_DESCRIPT: number;
    /**
     * Вид реквизита
     */
    OWNER: string;
    /**
     * Наименование реквизита
     */
    UI_NAME: string;
    /**
     * Имя для API
     */
    API_NAME: string;
    /**
     * Тип реквизита
     */
    AR_TYPE: string;
    /**
     * Использовать список
     */
    USE_LIST_FLAG: number;
    /**
     * Является многострочным
     */
    IS_MULTILINE: number;
    /**
     * MAX длина текстового поля
     */
    MAX_LEN: number;
    /**
     * Знаков после запятой для атрибута DECIMAL
     */
    AR_PRECISION: number;
    /**
     * Максимальное значение атрибута DECIMAL
     */
    MAX_VAL: number;
    /**
     * Минимальное значение атрибута DECIMAL
     */
    MIN_VAL: number;
    /**
     * Значение по умолчанию
     */
    DEF_VAL: string;
    /**
     * Формат представления
     */
    FRM_STR: string;
    /**
     * ISN справочника из EOS_OBJECTS
     */
    ISN_CLS_OBJECT: number;
    /**
     * Шаблон значения справочника
     */
    CLS_EXPRESSION: string;
    /**
     * ISN контрола выбора значения из справочника
     */
    ISN_CLS_CONTROL: number;
    /**
     * Защищено от редактирования пользователем
     */
    UI_READONLY: number;
    /**
     * Не копировать значение при создании связанной РК или РКПД
     */
    NO_COPY: number;
    /**
     * Создавать доп инфо о протоколе
     */
    ADD_PROT_INFO: number;
    /**
     * Отправлять по электронным каналам связи
     */
    SEND_ENABLED: number;

    /**
     * список используемых для доп. реквизитов допустимых значений полей
     */
    AR_VALUE_LIST_List: AR_VALUE_LIST[];
}

/**
 * Описание доп реквизита в конкретной гр док и его визуализация
 */
export interface AR_DOCGROUP extends IEnt {
    /**
     * ISN_AR_DOCGROUP
     */
    ISN_AR_DOCGROUP: number;
    /**
     * DUE
     */
    DUE: string;
    /**
     * Ссылка на запись в таблице DOCGROUP_CL
     */
    ISN_DOCGROUP: number;
    /**
     * ISN реквизита
     */
    ISN_AR_DESCRIPT: number;
    /**
     * Умолчательное значение
     */
    DEF_VALUE: string;
    /**
     * Обязательность реквизита
     */
    AR_MANDATORY: number;
    /**
     * Последовательность обхода
     */
    TAB_ORDER: number;
    /**
     * Х реквизита на форме
     */
    RX_POS: number;
    /**
     * Y реквизита на форме
     */
    RY_POS: number;
    /**
     * Высота реквизита на форме
     */
    R_HEIGHT: number;
    /**
     * Ширина реквизита на форме
     */
    R_WIDTH: number;
    /**
     * Имя UserObject реквизита
     */
    R_UOD: string;
    /**
     * Х метки на форме
     */
    LX_POS: number;
    /**
     * Y метки на формее
     */
    LY_POS: number;
    /**
     * Высота метки на форме
     */
    L_HEIGHT: number;
    /**
     * Ширина метки на форме
     */
    L_WIDTH: number;
    /**
     * Имя UserObject метки
     */
    L_UOD: string;
}

/**
 * Допустимые значения полей
 */
export interface AR_VALUE_LIST extends IEnt {
    /**
     * ISN_AR_VALUE_LIST
     */
    ISN_AR_VALUE_LIST: number;
    /**
     * ISN_AR_DESCRIPT
     */
    ISN_AR_DESCRIPT: number;
    /**
     * Значение текстового поля
     */
    VALUE: string;
    /**
     * Вес
     */
    WEIGHT: number;
}

/**
 * Банковские реквизиты организации
 */
export interface BANK_RECVISIT extends IEnt {
    /**
     * ISN_BANK_RECV
     */
    ISN_BANK_RECV: number;
    /**
     * Организация
     */
    ISN_ORGANIZ: number;
    /**
     * Наименование
     */
    CLASSIF_NAME: string;
    /**
     * Наименование Банка
     */
    BANK_NAME: string;
    /**
     * Расчетный счет
     */
    ACOUNT: string;
    /**
     * Кор счет
     */
    SUBACOUNT: string;
    /**
     * БИК
     */
    BIK: string;
    /**
     * Город
     */
    CITY: string;
    /**
     * Примечание
     */
    NOTE: string;
    /**
     * DUE
     */
    DUE: string;
}

/**
 * Группы УЦ
 */
export interface CA_CATEGORY extends IEnt {
    /**
     * ISN записи
     */
    ISN_CA_CATEGORY: number;
    /**
     * Серийный номер корневого сертификата УЦ
     */
    CA_SERIAL: string;
    /**
     * Тема корневого сертификата УЦ
     */
    CA_SUBJECT: string;
    /**
     * Категория ЭП
     */
    ISN_EDS_CATEGORY: number;
}

/**
 * Кабинеты
 */
export interface CABINET extends IEnt {
    /**
     * ISN кабинета
     */
    ISN_CABINET: number;
    /**
     * Код подразделения
     */
    DUE: string;
    /**
     * Имя кабинета
     */
    CABINET_NAME: string;
    /**
     * Полное наименование
     */
    FULLNAME: string;

    /**
     * список используемых для кабинетов папок
     */
    FOLDER_List: FOLDER[];
}

/**
 * Календарь
 */
export interface CALENDAR_CL extends IEnt {
    /**
     * ISN календаря
     */
    ISN_CALENDAR: number;
    /**
     * Дата
     */
    DATE_CALENDAR: string;
    /**
     * Тип даты
     */
    DATE_TYPE: number;
}

/**
 * Печатные формы
 */
export interface CB_PRINT_INFO extends IEnt {
    /**
     * ISN владельца
     */
    ISN_OWNER: number;
    /**
     * Вид владельца
     */
    OWNER_KIND: number;
    /**
     * ФИО
     */
    PRINT_SURNAME: string;
    /**
     * ФИО в дательном
     */
    PRINT_SURNAME_DP: string;
    /**
     * Должность
     */
    PRINT_DUTY: string;
    /**
     * Тип Подразделение
     */
    PRINT_DEPARTMENT: string;
    /**
     * Подразделение (родительный падеж)
     */
    DEPARTMENT_RP: string;
    /**
     * Признак использования подразделения в названии должности
     */
    NOT_USE_IN_DUTY: number;
    /**
     * Фамилия (именительный падеж)
     */
    SURNAME: string;
    /**
     * Имя (именительный падеж)
     */
    NAME: string;
    /**
     * Отчество (именительный падеж)
     */
    PATRON: string;
    /**
     * Фамилия (родительный падеж)
     */
    SURNAME_RP: string;
    /**
     * Имя (родительный падеж)
     */
    NAME_RP: string;
    /**
     * Отчество (родительный падеж)
     */
    PATRON_RP: string;
    /**
     * Фамилия (дательный падеж)
     */
    SURNAME_DP: string;
    /**
     * Имя (дательный падеж)
     */
    NAME_DP: string;
    /**
     * Отчество (дательный падеж)
     */
    PATRON_DP: string;
    /**
     * Фамилия (винительный падеж)
     */
    SURNAME_VP: string;
    /**
     * Имя (винительный падеж)
     */
    NAME_VP: string;
    /**
     * Отчество (винительный падеж)
     */
    PATRON_VP: string;
    /**
     * Фамилия (творительный падеж)
     */
    SURNAME_TP: string;
    /**
     * Имя (творительный падеж)
     */
    NAME_TP: string;
    /**
     * Отчество (творительный падеж)
     */
    PATRON_TP: string;
    /**
     * Фамилия (предложный падеж)
     */
    SURNAME_PP: string;
    /**
     * Имя (предложный падеж)
     */
    NAME_PP: string;
    /**
     * Отчество (предложный падеж)
     */
    PATRON_PP: string;
    /**
     * Пол
     */
    GENDER: number;
    /**
     * Должность (родительный падеж)
     */
    DUTY_RP: string;
    /**
     * Должность (дательный падеж)
     */
    DUTY_DP: string;
    /**
     * Должность (винительный падеж)
     */
    DUTY_VP: string;
}

/**
 * Справочник Граждане
 */
export interface CITIZEN extends IEnt, IStamp {
    /**
     * ISN гражданина
     */
    ISN_CITIZEN: number;
    /**
     * Фамилия И О в верхн регистре
     */
    CITIZEN_SURNAME_SEARCH: string;
    /**
     * Город в верхн регистре
     */
    CITIZEN_CITY_SEARCH: string;
    /**
     * Фамилия И О
     */
    CITIZEN_SURNAME: string;
    /**
     * Адрес
     */
    CITIZEN_ADDR: string;
    /**
     * Регион
     */
    ISN_REGION: number;
    /**
     * Признак логического удаления
     */
    DELETED: number;
    /**
     * Категория адресата
     */
    ISN_ADDR_CATEGORY: number;
    /**
     * Город
     */
    CITIZEN_CITY: string;
    /**
     * DUE_REGION
     */
    DUE_REGION: string;
    /**
     * Почтовый индекс
     */
    ZIPCODE: string;
    /**
     * Телефон
     */
    PHONE: string;
    /**
     * Пол
     */
    SEX: number;
    /**
     * N Паспорта
     */
    N_PASPORT: string;
    /**
     * Cерия
     */
    SERIES: string;
    /**
     * Выдан
     */
    GIVEN: string;
    /**
     * ИНН
     */
    INN: string;
    /**
     * Снилс
     */
    SNILS: string;
    /**
     * Признак новой записи
     */
    NEW: number;
    /**
     * e_mail
     */
    E_MAIL: string;
    /**
     * Требуется ЭП
     */
    EDS_FLAG: number;
    /**
     * Требуется шифрование
     */
    ENCRYPT_FLAG: number;
    /**
     * Идентификатор сертификата
     */
    ID_CERTIFICATE: string;
    /**
     * Почтовый формат
     */
    MAIL_FORMAT: number;
    /**
     * Признак запрета удаления
     */
    PROTECTED: number;
    /**
     * Вес элемента
     */
    WEIGHT: number;
    /**
     * Комментарий
     */
    NOTE: string;

    /**
     * список используемых для справочника Граждан статусов
     */
    CITIZEN_STATUS_List: CITIZEN_STATUS[];
}

/**
 * Статусы граждан
 */
export interface CITIZEN_STATUS extends IEnt {
    /**
     * ISN гражданина
     */
    ISN_CITIZEN: number;
    /**
     * ISN статуса
     */
    ISN_STATUS: number;
    /**
     * идентификатор
     */
    ISN_CIT_STAT: number;
    /**
     * DUE_STATUS
     */
    DUE_STATUS: string;
}

/**
 * Контакты в организации
 */
export interface CONTACT extends IEnt, IStamp {
    /**
     * ISN контакта
     */
    ISN_CONTACT: number;
    /**
     * ISN организации
     */
    ISN_ORGANIZ: number;
    /**
     * № в списке
     */
    ORDERNUM: number;
    /**
     * ФИО
     */
    SURNAME: string;
    /**
     * Признак лог удаления
     */
    DELETED: number;
    /**
     * DUE
     */
    DUE: string;
    /**
     * IS_NODE
     */
    IS_NODE: number;
    /**
     * Идентификатор сертификата
     */
    ID_CERTIFICATE: string;
    /**
     * ФИО в дательном
     */
    SURNAME_DP: string;
    /**
     * Должность
     */
    DUTY: string;
    /**
     * Подразделение
     */
    DEPARTMENT: string;
    /**
     * Телефон местный
     */
    PHONE_LOCAL: string;
    /**
     * Телефон городской
     */
    PHONE: string;
    /**
     * Факс
     */
    FAX: string;
    /**
     * E_MAIL
     */
    E_MAIL: string;
    /**
     * Требуется ЭП
     */
    EDS_FLAG: number;
    /**
     * Требуется шифрование
     */
    ENCRYPT_FLAG: number;
    /**
     * Примечание
     */
    NOTE: string;
    /**
     * Почтовый формат
     */
    MAIL_FORMAT: number;
    /**
     * DUE_EXT_DEPARTMENT
     */
    DUE_EXT_DEPARTMENT: string;
}

/**
 * Спецхранилище значений
 */
export interface CUSTOM_STORAGE extends IEnt {
    /**
     * Идентификатор значения
     */
    VALUE_ID: string;
    /**
     * Значение
     */
    VALUE: string;
    /**
     * Тип объекта владельца
     */
    OWNER_KIND: number;
    /**
     * Идентификатор объекта владельца
     */
    OWNER_ID: string;
    /**
     * Порядковый номер
     */
    ORDERNUM: number;
}

/**
 * Файлы объектов Дело
 */
export interface DELO_BLOB extends IEnt {
    /**
     * ISN объекта
     */
    ISN_BLOB: number;
    /**
     * Содержимое
     */
    CONTENTS: string;
    /**
     * Расширение
     */
    EXTENSION: string;
}

/**
 * Ограничения на файлы для групп документов
 */
export interface DG_FILE_CONSTRAINT extends IEnt {
    /**
     * ISN группы
     */
    ISN_DOCGROUP: number;
    /**
     * Категория
     */
    CATEGORY: string;
    /**
     * Максимальный размер
     */
    MAX_SIZE: number;
    /**
     * Для одного файла
     */
    ONE_FILE: number;
    /**
     * Расширения
     */
    EXTENSIONS: string;
    /**
     * DUE
     */
    DUE: string;
}

/**
 * Список идентификаторов реквизитов РК и их описание
 */
export interface DOC_DEFAULT extends IEnt {
    /**
     * Идентификатор реквизита
     */
    DEFAULT_ID: string;
    /**
     * Тип реквизита
     */
    DEFAULT_TYPE: string;
    /**
     * Тип РК
     */
    KIND_DOC: string;
    /**
     * Описание реквизита
     */
    DESCRIPTION: string;
    /**
     * Таблица ссылки реквизита
     */
    CLASSIF_ID: number;
}

/**
 * Правила заполнения реквизитов РК
 */
export interface DOC_DEFAULT_VALUE extends IEnt {
    /**
     * Идентификатор реквизита
     */
    DEFAULT_ID: string;
    /**
     * DUE
     */
    DUE: string;
    /**
     * ISN группы документов
     */
    ISN_DOCGROUP: number;
    /**
     * Значение реквизита
     */
    VALUE: string;
}

/**
 * Шаблоны печатных форм
 */
export interface DOC_TEMPLATES extends IEnt {
    /**
     * ISN шаблона
     */
    ISN_TEMPLATE: number;
    /**
     * Вид шаблона
     */
    KIND_TEMPLATE: number;
    /**
     * Наименование
     */
    NAME_TEMPLATE: string;
    /**
     * Описание
     */
    DESCRIPTION: string;
    /**
     * Структура шаблона
     */
    INFO: string;
    /**
     * Пр лог удаления
     */
    DELETED: number;
    /**
     * Пр запрета удаления
     */
    PROTECTED: number;
    /**
     * Вес элемента
     */
    WEIGHT: number;
    /**
     * Категория
     */
    CATEGORY: string;
    /**
     * Содержимое файла
     */
    FILECONTENTS: string;
}

/**
 * События для потребления
 */
export interface EVNT_FEED extends IEnt {
    /**
     * ISL события
     */
    ISL_EVENT: number;
    /**
     * вид события
     */
    KIND_EVENT: number;
    /**
     * вид объекта
     */
    KIND_OBJECT: number;
    /**
     * ID объекта
     */
    OBJECT_ID: string;
    /**
     * DUE группы документов
     */
    DUE_DOCGROUP: string;
    /**
     * флаги
     */
    FLAGS: string;
    /**
     * Метка времени
     */
    TIME_STAMP: number;
    /**
     * Данные I1
     */
    DATA_I1: number;
    /**
     * Данные S1
     */
    DATA_S1: string;
    /**
     * Данные D1
     */
    DATA_D1: number;
    /**
     * Данные I2
     */
    DATA_I2: number;
    /**
     * Данные S2
     */
    DATA_S2: string;
    /**
     * Данные D2
     */
    DATA_D2: number;
    /**
     * Данные I3
     */
    DATA_I3: number;
    /**
     * Данные S3
     */
    DATA_S3: string;
    /**
     * Данные D3
     */
    DATA_D3: number;
    /**
     * Данные I4
     */
    DATA_I4: number;
    /**
     * Данные S4
     */
    DATA_S4: string;
    /**
     * Данные D4
     */
    DATA_D4: number;
    /**
     * Данные I5
     */
    DATA_I5: number;
    /**
     * Данные S5
     */
    DATA_S5: string;
    /**
     * Данные D5
     */
    DATA_D5: number;
}

/**
 * Элементы очереди подписки
 */
export interface EVNT_QUEUE_ITEM extends IEnt {
    /**
     * ISN подписчика
     */
    ISN_SUBSCRIPTION: number;
    /**
     * ISN события
     */
    ISN_EVENT: number;
    /**
     * ISL события
     */
    ISL_EVENT: number;
    /**
     * Вид события
     */
    KIND_EVENT: number;
    /**
     * Вид объекта
     */
    KIND_OBJECT: number;
    /**
     * Идентификатор объекта
     */
    OBJECT_ID: string;
    /**
     * Due группы документов
     */
    DUE_DOCGROUP: string;
    /**
     * Флаги события
     */
    FLAGS: string;
    /**
     * Данные I1
     */
    DATA_I1: number;
    /**
     * Данные S1
     */
    DATA_S1: string;
    /**
     * Данные D1
     */
    DATA_D1: number;
    /**
     * Данные I2
     */
    DATA_I2: number;
    /**
     * Данные S2
     */
    DATA_S2: string;
    /**
     * Данные D2
     */
    DATA_D2: number;
    /**
     * Данные I3
     */
    DATA_I3: number;
    /**
     * Данные S3
     */
    DATA_S3: string;
    /**
     * Данные D3
     */
    DATA_D3: number;
    /**
     * Данные I4
     */
    DATA_I4: number;
    /**
     * Данные S4
     */
    DATA_S4: string;
    /**
     * Данные D4
     */
    DATA_D4: number;
    /**
     * Данные I5
     */
    DATA_I5: number;
    /**
     * Данные S5
     */
    DATA_S5: string;
    /**
     * Данные D5
     */
    DATA_D5: number;
}

/**
 * Папки кабинетов
 */
export interface FOLDER extends IEnt {
    /**
     * ISN папки
     */
    ISN_FOLDER: number;
    /**
     * ISN кабинета
     */
    ISN_CABINET: number;
    /**
     * Тип папки
     */
    FOLDER_KIND: number;
    /**
     * "Папка открыта для наполнения"
     */
    USER_COUNT: number;
}

/**
 * Элементы списка пользователя
 */
export interface LIST_ITEMS extends IEnt {
    /**
     * REF_ISN
     */
    REF_ISN: number;
    /**
     * ISN_LIST
     */
    ISN_LIST: number;
    /**
     * тип объекта
     */
    KIND_OBJ: number;
    /**
     * Вес элемента
     */
    WEIGHT: number;
    /**
     * Примечание
     */
    NOTE: string;
}

/**
 * Параметры системы оповещений и уведомлений
 */
export interface NTFY_SYSTEM_PARAMS extends IEnt {
    /**
     * Идентификатор системного агента
     */
    SERVICE_ID: string;
    /**
     * Состояние системы
     */
    SYSTEM_STATE: number;
    /**
     * Максимальное количество обработанных записей
     */
    MAX_EVENT_COUNT: number;
    /**
     * Сетевой адрес компьютера службы
     */
    SERVICE_HOST: string;
    /**
     * Номер порта службы
     */
    SERVICE_PORT: number;
    /**
     * Название системной службы
     */
    SERVICE_NAME: string;
}

/**
 * Параметры пользователей системы оповещений и уведомлений
 */
export interface NTFY_USER_EMAIL extends IEnt {
    /**
     * ISN_USER
     */
    ISN_USER: number;
    /**
     * Адрес электроной почты
     */
    EMAIL: string;
    /**
     * Доступность
     */
    IS_ACTIVE: number;
    /**
     * Вес
     */
    WEIGHT: number;
    /**
     * Перечень событий по которым в этот адрес НЕ посылаются сообщения
     */
    EXCLUDE_OPERATION: string;
}

export interface NTYF_OPERATION extends IEnt {
    CODE: string;
    NAME: string;
    KIND: number;
    MSG_EXTEND_TEXT: string;
    MSG_EXTEND_TEXT2: string;
    MSG_HEADER: string;
    MSG_TEXT: string;
    NOTE: string;
}
/**
 * Список идентификаторов реквизитов РКПД и их описание
 */
export interface PRJ_DEFAULT extends IEnt {
    /**
     * Идентификатор реквизита
     */
    DEFAULT_ID: string;
    /**
     * Тип реквизита
     */
    DEFAULT_TYPE: string;
    /**
     * Описание реквизита
     */
    DESCRIPTION: string;
    /**
     * Таблица ссылки реквизита
     */
    CLASSIF_ID: number;
}

/**
 * Правила заполнения реквизитов РКПД
 */
export interface PRJ_DEFAULT_VALUE extends IEnt {
    /**
     * Идентификатор реквизита
     */
    DEFAULT_ID: string;
    /**
     * DUE
     */
    DUE: string;
    /**
     * Код группы документов
     */
    ISN_DOCGROUP: number;
    /**
     * Значение реквизита
     */
    VALUE: string;
}

/**
 * Протокол работы пользователей
 */
export interface PROT extends IEnt {
    /**
     * TABLE_ID
     */
    TABLE_ID: string;
    /**
     * OPER_ID
     */
    OPER_ID: string;
    /**
     * SUBOPER_ID
     */
    SUBOPER_ID: string;
    /**
     * OPER_DESCRIBE
     */
    OPER_DESCRIBE: string;
    /**
     * REF_ISN
     */
    REF_ISN: number;
    /**
     * TIME_STAMP
     */
    TIME_STAMP: number;
    /**
     * USER_ISN
     */
    USER_ISN: number;
    /**
     * OPER_COMMENT
     */
    OPER_COMMENT: string;
    /**
     * ISN доп информации
     */
    ISN_PROT_INFO: number;
}

/**
 * Перечень протоколируемых операций
 */
export interface PROT_NAME extends IEnt {
    /**
     * Идентификатор таблицы
     */
    TABLE_ID: string;
    /**
     * Идентификатор операции
     */
    OPER_ID: string;
    /**
     * идентификатор подоперации
     */
    SUBOPER_ID: string;
    /**
     * Описатель операции
     */
    OPER_DESCRIBE: string;
    /**
     * Описание
     */
    DESCRIPTION: string;
    DESCRIBTION: string;
    /**
     * Примечание
     */
    NOTE: string;
    /**
     * Позиция в параметре пользователя
     */
    VIEW_PARM_POSITION: number;
}

/**
 * Журнал отметок о прочтении
 */
export interface READ_PROT extends IEnt {
    /**
     * Системный номер пользователя
     */
    USER_ISN: number;
    /**
     * Идентификатор таблицы
     */
    TABLE_ID: string;
    /**
     * Системный номер объекта
     */
    REF_ISN: number;
    /**
     * Дата и время чтения пользователем объекта
     */
    TIME_STAMP: number;
}

/**
 * Файлы РК и РКПД
 */
export interface REF_FILE extends IEnt, IStamp {
    /**
     * ISN файла
     */
    ISN_REF_FILE: number;
    /**
     * ISN типа файла
     */
    ISN_FILE_TYPE: number;
    /**
     * ISN документа
     */
    ISN_REF_DOC: number;
    /**
     * № в списке
     */
    ORDERNUM: number;
    /**
     * Название файла
     */
    NAME: string;
    /**
     * Тип хранения
     */
    STORAGE: number;
    /**
     * Путь
     */
    PATH: string;
    /**
     * Размер
     */
    FILESIZE: number;
    /**
     * Номер документа
     */
    FREE_NUM: string;
    /**
     * Дата документа
     */
    DOC_DATE: number;
    /**
     * Комментарий
     */
    DESCRIPTION: string;
    /**
     * Категория
     */
    CATEGORY: string;
    /**
     * Вид документа
     */
    KIND_DOC: number;
    /**
     * Гриф доступа
     */
    SECURLEVEL: number;
    /**
     * Флаг защиты
     */
    LOCK_FLAG: number;
    /**
     * Кто защитил
     */
    ISN_USER_LOCK: number;
    /**
     * Кто редактировал
     */
    ISN_USER_EDIT: number;
    /**
     * SCAN_NUM
     */
    SCAN_NUM: number;
    /**
     * Группа хранения
     */
    GR_STORAGE: number;
    /**
     * Количество подписей
     */
    EDS_CNT: number;
    /**
     * Запрещено удалять
     */
    DONTDEL_FLAG: number;
    /**
     * Кто последний запретил удалять
     */
    ISN_USER_DONTDEL: number;
    /**
     * Признак скрытого файла
     */
    IS_HIDDEN: number;
    /**
     * Применять ЭП
     */
    APPLY_EDS: number;
    /**
     * Рассылать
     */
    SEND_ENABLED: number;
    /**
     * UPD_CONTENT_DATE
     */
    UPD_CONTENT_DATE: number;
}

/**
 * Справочник Грифы доступа
 */
export interface SECURITY_CL extends IEnt {
    /**
     * Гриф доступа
     */
    SECURLEVEL: number;
    /**
     * Наименование грифа
     */
    GRIF_NAME: string;
    /**
     * Признак лог удаления
     */
    DELETED: number;
    /**
     * Признак запрета удаления
     */
    PROTECTED: number;
    /**
     * Вес элемента
     */
    WEIGHT: number;
    /**
     * Требуется ЭП
     */
    EDS_FLAG: number;
    /**
     * Требуется шифрование
     */
    ENCRYPT_FLAG: number;
    /**
     * Индекс грифа
     */
    SEC_INDEX: string;
    /**
     * Конфиденциальность
     */
    CONFIDENTIONAL: number;
    /**
     * Примечание
     */
    NOTE: string;
}

/**
 * Индекс СЭВ для элементов справочников
 */
export interface SEV_ASSOCIATION extends IEnt {
    /**
     * Идентификатор в БД
     */
    OBJECT_ID: string;
    /**
     * Сущность в БД
     */
    OBJECT_NAME: string;
    /**
     * Глобальный идентификатор
     */
    GLOBAL_ID: string;
    /**
     * Владелец
     */
    OWNER_ID: string;
    /**
     * Отправитель документа
     */
    SENDER_ID: string;
}

/**
 * Коллизии СЭВ
 */
export interface SEV_COLLISION extends IEnt {
    /**
     * номер коллизии
     */
    COLLISION_CODE: number;
    /**
     * номер причины возникновения коллизии
     */
    REASON_NUM: number;
    /**
     * название коллизии
     */
    COLLISION_NAME: string;
    /**
     * Способ разрешения выбранный пользователем для данной коллизии
     */
    RESOLVE_TYPE: number;
    /**
     * Значение по умолчанию рекомендованное для данной коллизии
     */
    DEFAULT_RESOLVE_TYPE: number;
    /**
     * через запятую допустимые способы для данной коллизии
     */
    ALLOWED_RESOLVE_TYPES: string;
}

/**
 * Используемые правила
 */
export interface SEV_PARTICIPANT_RULE extends IEnt {
    /**
     * Участник МЭДО
     */
    ISN_PARTICIPANT: number;
    /**
     * Правило
     */
    ISN_RULE: number;
    /**
     * Порядок выбора правила
     */
    ORDERNUM: number;
}

/**
 * Отчет о синхронизации СЭВ
 */
export interface SEV_SYNC_REPORT extends IEnt {
    /**
     * ISN записи
     */
    ISN_SEV_SYNC_REPORT: number;
    /**
     * ISN участника СЭВ
     */
    ISN_PARTICIPANT: number;
    /**
     * Дата формирования файла синхронизации
     */
    FILE_SYNC_DATE: number;
}

/**
 * Перечень иерархий в поиске
 */
export interface SRCH_AR_HIER extends IEnt {
    /**
     * Вид иерархии
     */
    HIER_KIND: number;
    /**
     * Название иерархии
     */
    HIER_NAME: string;
    /**
     * Места использования
     */
    HIER_USAGE: string;
}

/**
 * Описания осн реквизитов РК и РКПД
 */
export interface SRCH_CRITERY extends IEnt {
    /**
     * ISN критерия
     */
    ISN_CRITERY: number;
    /**
     * Имя объекта
     */
    UOD: string;
    /**
     * Параметры объекта
     */
    UOD_PROP: string;
    /**
     * Текст для отображения в дереве
     */
    TREE_LABEL: string;
    /**
     * Текст для отображения на форме
     */
    FORM_LABEL: string;
    /**
     * Имя критерия для поисковой машины
     */
    CRITERY_NAME: string;
    /**
     * Вид критериев
     */
    KIND: number;
}

/**
 * Описание сохраненного запроса
 */
export interface SRCH_REQ_DESC extends IEnt {
    /**
     * ISN сохраненного запроса
     */
    ISN_REQUEST: number;
    /**
     * Имя критерия для поисковой машины
     */
    CRITERY_NAME: string;
    /**
     * Значение
     */
    VALUE: string;
    /**
     * Значение для отображения
     */
    DISP_VALUE: string;
    /**
     * Х реквизита на форме
     */
    RX_POS: number;
    /**
     * Y реквизита на форме
     */
    RY_POS: number;
    /**
     * Высота реквизита на форме
     */
    R_HEIGHT: number;
    /**
     * Ширина реквизита на форме
     */
    R_WIDTH: number;
    /**
     * Х метки на форме
     */
    LX_POS: number;
    /**
     * Y метки на форме
     */
    LY_POS: number;
    /**
     * Высота метки на форме
     */
    L_HEIGHT: number;
    /**
     * Ширина метки на форме
     */
    L_WIDTH: number;
    /**
     * Номер в порядке обхода
     */
    TAB_ORDER: number;
}

/**
 * Список сохраненных запросов
 */
export interface SRCH_REQUEST extends IEnt {
    /**
     * ISN запроса
     */
    ISN_REQUEST: number;
    /**
     * Название
     */
    REQUEST_NAME: string;
    /**
     * Мнемоника вида поиска
     */
    SRCH_KIND_NAME: string;
    /**
     * "Личный запрос"
     */
    PERSONAL: number;
    /**
     * Технологический
     */
    UTILITY_KIND: number;
    /**
     * Признак запрета удаления
     */
    PROTECTED: number;
    /**
     * Настраиваемый
     */
    CUSTOMIZATION: number;
    /**
     * Параметры
     */
    PARAMS: string;
    /**
     * Основной контрол
     */
    BASE_CONTROL: string;
    /**
     * Автораздача пользователям
     */
    AUTO_DISTRIBUTE: number;
    /**
     * Представление
     */
    ISN_VIEW: number;

    /**
     * список используемых сохраненных запросов с описанием
     */
    SRCH_REQ_DESC_List: SRCH_REQ_DESC[];
}

/**
 * Таблица подписок СЭВ
 */
export interface SEV_SUBSCRIBE extends IEnt {
    /**
     * ISN_SUBSCRIBE
     */
    ISN_SUBSCRIBE: number;
    /**
     * ISN_DOC
     */
    ISN_DOC: number;
    /**
     * KIND_DOC
     */
    KIND_DOC: number;
    /**
     * DUE_OWNER_ORGANIZ
     */
    DUE_OWNER_ORGANIZ: string;
    /**
     * PARTICIPANT_ISN
     */
    PARTICIPANT_ISN: number;
    /**
     * RETURN_ID
     */
    RETURN_ID: string;
    /**
     * EDMS_NAME
     */
    EDMS_NAME: string;
    /**
     * EDMS_VERSION
     */
    EDMS_VERSION: string;
    /**
     * EDMS_UID
     */
    EDMS_UID: string;
    /**
     * DOC_UID
     */
    DOC_UID: string;
    /**
     * DOC_VERSION_UID
     */
    DOC_VERSION_UID: string;
    /**
     * DOC_NUMBER
     */
    DOC_NUMBER: string;
    /**
     * DOC_DATE
     */
    DOC_DATE: number;
    /**
     * DOC_GROUP
     */
    DOC_GROUP: string;
    /**
     * DOC_GROUP_UID
     */
    DOC_GROUP_UID: string;
    /**
     * SUBSCRIPTIONS
     */
    SUBSCRIPTIONS: string;
    /**
     * HASH
     */
    HASH: string;
    /**
     * TASKS_UIDS
     */
    TASKS_UIDS: string;
    /**
     * VISA_SIGN_UIDS
     */
    VISA_SIGN_UIDS: string;
}

/**
 * Представление результатов запроса
 */
export interface SRCH_VIEW extends IEnt {
    /**
     * ISN представления
     */
    ISN_VIEW: number;
    /**
     * Тип списка
     */
    SRCH_KIND_NAME: string;
    /**
     * Название
     */
    VIEW_NAME: string;
    /**
     * Общий или личный
     */
    PERSONAL: number;
    /**
     * Признак запрета удаления
     */
    PROTECTED: number;
    /**
     * Настраиваемое
     */
    CUSTOMIZATION: number;
    /**
     * Основное контрол
     */
    BASE_CONTROL: string;
    /**
     * Направление сортировки
     */
    SORT_DIRECTION: number;
    /**
     * Настройки
     */
    PARAMS: string;
    /**
     * Сортировка
     */
    ORDERBY: string;
    /**
     * Размер страницы
     */
    PAGE_SIZE: number;
    /**
     * Автоматическое обновление
     */
    AUTO_REFRESH: number;
    /**
     * Высота
     */
    HEIGHT: number;

    /**
     * список используемых представлений результата запроса с описанием
     */
    SRCH_VIEW_DESC_List: SRCH_VIEW_DESC[];
}

/**
 * Описание представления результатов запроса
 */
export interface SRCH_VIEW_DESC extends IEnt {
    /**
     * ISN записи
     */
    ISN_VIEW_DESC: number;
    /**
     * ISN представления
     */
    ISN_VIEW: number;
    /**
     * Порядковый номер
     */
    ORDERNUM: number;
    /**
     * Номер строки
     */
    ROW_NUM: number;
    /**
     * Номер колонки
     */
    COLUMN_NUM: number;
    /**
     * Заголовок
     */
    LABEL: string;
    /**
     * Блок
     */
    BLOCK_ID: string;
    /**
     * Параметры для блока
     */
    PARAMS: string;
}

/**
 * Стандартный текст
 */
export interface STTEXT extends IEnt {
    /**
     * ISN стандартного текста
     */
    ISN_STTEXT: number;
    /**
     * ISN списка стандартных текстов
     */
    ISN_STTEXT_LIST: number;
    /**
     * Код текста
     */
    CODE: string;
    /**
     * Стандартный текст
     */
    STTEXT: string;
    /**
     * Вес
     */
    WEIGHT: number;
}

/**
 * Поле ввода стандартных текстов
 */
export interface STTEXT_CONTROL extends IEnt {
    /**
     * ISN пользователя
     */
    ISN_USER: number;
    /**
     * ISN списка стандартных текстов
     */
    ISN_STTEXT_LIST: number;
    /**
     * ID поля ввода
     */
    CONTROL_ID: string;

    /**
     * список используемых стандартных текстов
     */
    STTEXT_LIST_Ref: STTEXT_LIST[];
}

/**
 * Список стандартных текстов
 */
export interface STTEXT_LIST extends IEnt {
    /**
     * ISN списка стандартных текстов
     */
    ISN_STTEXT_LIST: number;
    /**
     * ISN пользователя
     */
    ISN_USER: number;
    /**
     * Наименование списка
     */
    LIST_NAME: string;
    /**
     * Указатель на общий список стандартных текстов
     */
    REF_ISN_STTEXT_LIST: number;
    /**
     * Флаг копирования общих списков стандартных текстов
     */
    ALL_FLAG: number;
    /**
     * Вес
     */
    WEIGHT: number;

    /**
     * список используемых стандартных текстов
     */
    STTEXT_List: STTEXT[];

    /**
     * список используемых стандартных текстов
     */
    PARENT_STTEXT_LIST_Ref: STTEXT_LIST[];
}

/**
 * Временная РК
 */
export interface TEMP_RC extends IEnt {
    /**
     * ISN РК
     */
    ISN_TEMP_RC: number;
    /**
     * SID сессии
     */
    WAPI_SESSION_SID: string;
    /**
     * Ключ операции
     */
    OPERATION_KEY: string;
    /**
     * Дата протухания
     */
    EXPIRATION_DATE: number;
    /**
     * Кто добавил
     */
    INS_WHO: number;
    /**
     * Когда добавил
     */
    INS_DATE: number;

    /**
     * список используемых для временной РК файлов
     */
    REF_FILE_List: REF_FILE[];
}

/**
 * Аудит изменений справочника пользователей
 */
export interface USER_AUDIT extends IEnt {
    /**
     * ISN события аудита
     */
    ISN_EVENT: number;
    /**
     * ISN редактируемого пользователя
     */
    ISN_USER: number;
    /**
     * ISN редактирующего пользователя
     */
    ISN_WHO: number;
    /**
     * Дата события аудита
     */
    EVENT_DATE: number;
    /**
     * Вид события аудита
     */
    EVENT_KIND: number;

    /**
     * список используемых для временной РК файлов
     */
    REF_FILE_List: REF_FILE[];
}

/**
 * Пользователи кабинета
 */
export interface USER_CABINET extends IEnt {
    /**
     * ISN кабинета
     */
    ISN_CABINET: number;
    /**
     * ISN пользователя
     */
    ISN_LCLASSIF: number;
    /**
     * Права на папки
     */
    FOLDERS_AVAILABLE: string;
    /**
     * Признак работы с поручениями
     */
    ORDER_WORK: number;
    /**
     * Признак гл кабинета
     */
    HOME_CABINET: number;
    /**
     * "Скрыть недоступные"
     */
    HIDE_INACCESSIBLE: number;
    /**
     * Скрыть недоступные" для РКПД
     */
    HIDE_INACCESSIBLE_PRJ: number;
    /**
     * DEPARTMENT_DUE
     */
    DEPARTMENT_DUE: string;
    HIDE_CONF_RESOL?: number;
    IS_ASSISTANT?: number;
}

/**
 * Профили сертификатов пользователей
 */
export interface USER_CERT_PROFILE extends IEnt {
    /**
     * ISN_CERT_PROFILE
     */
    ISN_CERT_PROFILE: number;
    /**
     * Пользователь
     */
    ISN_USER: number;
    /**
     * ID сертификата
     */
    ID_CERTIFICATE: string;
}

/**
 * Сертификаты пользователей
 */
export interface USER_CERTIFICATE extends IEnt {
    /**
     * ISN пользовалеля
     */
    ISN_USER: number;
    /**
     * Сертификат подписи
     */
    SIGN_CERT: string;
    /**
     * Сертификат шифрования
     */
    ENC_CERT: string;
    /**
     * Сертификат подписи email
     */
    SIGN_MAIL_CERT: string;
    /**
     * Сертификат шифрования email
     */
    ENC_MAIL_CERT: string;
}

/**
 * Списки пользователя
 */
export interface USER_LISTS extends IEnt {
    /**
     * isn_list
     */
    ISN_LIST: number;
    /**
     * Указатель на общий список
     */
    REF_ISN_LIST: number;
    /**
     * Имя списка
     */
    NAME: string;
    /**
     * ISN пользователя
     */
    ISN_LCLASSIF: number;
    /**
     * Ид классификатора
     */
    CLASSIF_ID: number;
    /**
     * Вес элемента
     */
    WEIGHT: number;
    /**
     * Флаг копирования общих списков
     */
    ALL_FLAG: number;
    /**
     * Вид списка
     */
    LIST_KIND: number;

    /**
     * список используемых для пользователя элементов
     */
    LIST_ITEMS_List: LIST_ITEMS[];
}

/**
 * Настройки (параметры) пользователя
 */
export interface USER_PARMS extends IEnt {
    /**
     * пользователь
     */
    ISN_USER_OWNER: number;
    /**
     * имя параметра
     */
    PARM_NAME: string;
    /**
     * группа параметра
     */
    PARM_GROUP: number;
    /**
     * значение параметра
     */
    PARM_VALUE: string;
    /**
     * isn реального пользователя, может быть -99
     *  */
    REAL_ISN_USER_OWNER: number;
}

/**
 * Грифы доступа пользователя
 */
export interface USERSECUR extends IEnt {
    /**
     * Гриф доступа
     */
    SECURLEVEL: number;
    /**
     * ISN пользователя
     */
    ISN_LCLASSIF: number;
    /**
     * Вес элемента
     */
    WEIGHT: number;
}

/**
 * Представление пользователя результатов запроса
 */
export interface USER_VIEW extends IEnt {
    /**
     * ISN пользователя
     */
    ISN_USER: number;
    /**
     * ISN представления
     */
    ISN_VIEW: number;
    /**
     * Вес
     */
    WEIGHT: number;
    /**
     * Тип списка
     */
    SRCH_KIND_NAME: string;
}

/**
 * Сохраненные запросы пользователей
 */
export interface USER_REQUEST extends IEnt {
    /**
     * ISN пользователя
     */
    ISN_USER: number;
    /**
     * ISN запроса
     */
    ISN_REQUEST: number;
    /**
     * Вес
     */
    WEIGHT: number;
    /**
     * Параметры папок кабинетов
     */
    PARAMS: string;
    /**
     * Тип списка
     */
    SRCH_KIND_NAME: string;
}

/**
 * Делегирование полномочий ДЛ
 */
export interface DEPARTMENT_REPL extends IEnt {
    /**
     * ISN_DEPARTMENT_REPL
     */
    ISN_DEPARTMENT_REPL: number;
    /**
     * Кого замещаем
     */
    DUE_DEP: string;
    /**
     * Кем замещаем
     */
    DUE_REPL: string;
    /**
     * Дата начала действия
     */
    START_DATE: number;
    /**
     * Дата окончания действия
     */
    END_DATE: number;
}

// NADZOR
export interface NP_ADDRESS_VID_CL extends ILinearCL {
    ISN_LCLASSIF: number;
    CLASSIF_NAME: string;
    NOTE: string;
    WEIGHT: number;
}

export interface NP_UDOST_TYPE_CL extends ILinearCL {
    ISN_LCLASSIF: number;
    CLASSIF_NAME: string;
    NOTE: string;
    WEIGHT: number;
}

export interface NP_SUDIM_CL extends ILinearCL {
    ISN_LCLASSIF: number;
    CLASSIF_NAME: string;
    NOTE: string;
    WEIGHT: number;
}

export interface NP_OSNZADER_CL extends ILinearCL {
    ISN_LCLASSIF: number;
    ISN_CODEX_TYPE: number;
    CLASSIF_NAME: string;
    NOTE: string;
    WEIGHT: number;
}

export interface NP_CODEX_TYPE_CL extends ILinearCL {
    ISN_LCLASSIF: number;
    CLASSIF_NAME: string;
    NOTE: string;
    WEIGHT: number;
}

export interface NP_MERA_TYPE_CL extends ILinearCL {
    ISN_LCLASSIF: number;
    CLASSIF_NAME: string;
    NOTE: string;
    WEIGHT: number;
}

export interface NP_MERA_OSNOV_CL extends ILinearCL {
    ISN_LCLASSIF: number;
    CLASSIF_NAME: string;
    NOTE: string;
    WEIGHT: number;
}

export interface NP_SUD_TYPE_CL extends ILinearCL {
    ISN_LCLASSIF: number;
    CLASSIF_NAME: string;
    NOTE: string;
    WEIGHT: number;
}

export interface NP_NAKAZ_TYPE_CL extends ILinearCL {
    ISN_LCLASSIF: number;
    CLASSIF_NAME: string;
    NOTE: string;
    WEIGHT: number;
}

export interface NP_OB_WHAT_CL extends ILinearCL {
    ISN_LCLASSIF: number;
    CLASSIF_NAME: string;
    NOTE: string;
    WEIGHT: number;
}

export interface NP_OB_NOMOVE_CL extends ILinearCL {
    ISN_LCLASSIF: number;
    CLASSIF_NAME: string;
    NOTE: string;
    WEIGHT: number;
}

export interface NP_OB_VOSST_CL extends ILinearCL {
    ISN_LCLASSIF: number;
    CLASSIF_NAME: string;
    NOTE: string;
    WEIGHT: number;
}

export interface NP_SPEC_SUBJECT_CL extends ILinearCL {
    ISN_LCLASSIF: number;
    CLASSIF_NAME: string;
    NOTE: string;
    WEIGHT: number;
}

export interface NP_OSN_PRIN_RESH_CL extends ILinearCL {
    ISN_LCLASSIF: number;
    CLASSIF_NAME: string;
    NOTE: string;
    WEIGHT: number;
}

export interface NP_MERA_REAGIR_CL extends ILinearCL {
    ISN_LCLASSIF: number;
    CLASSIF_NAME: string;
    NOTE: string;
    WEIGHT: number;
}

export interface NP_NARUSHEN_CL extends ILinearCL {
    ISN_LCLASSIF: number;
    CLASSIF_NAME: string;
    NOTE: string;
    WEIGHT: number;
}

export interface NP_NEZ_METOD_RASSLED_CL extends ILinearCL {
    ISN_LCLASSIF: number;
    CLASSIF_NAME: string;
    NOTE: string;
    WEIGHT: number;
}

export interface NP_RESULT_RASSLED_CL extends ILinearCL {
    ISN_LCLASSIF: number;
    CLASSIF_NAME: string;
    NOTE: string;
    WEIGHT: number;
}

export interface NP_OPF_CL extends ILinearCL {
    CODE: string;
    ISN_LCLASSIF: number;
    CLASSIF_NAME: string;
    NOTE: string;
    WEIGHT: number;
}

export interface NP_OSN_OSVOB_CL extends ILinearCL {
    ISN_LCLASSIF: number;
    CLASSIF_NAME: string;
    NOTE: string;
    WEIGHT: number;
}

export interface NP_STATUS_CL extends ILinearCL {
    ISN_LCLASSIF: number;
    CLASSIF_NAME: string;
    NOTE: string;
    WEIGHT: number;
    CLEAR_CABINET: boolean;
}

export interface NP_FIG_ROLE_CL extends ILinearCL {
    ISN_LCLASSIF: number;
    CLASSIF_NAME: string;
    NOTE: string;
    WEIGHT: number;
    ARH_FLAG: boolean;
}

export interface NP_SPOSOB_UKR_PR_CL extends ILinearCL {
    ISN_LCLASSIF: number;
    CLASSIF_NAME: string;
    NOTE: string;
    WEIGHT: number;
    ISP_OTKAZ: boolean;
    ISP_ISTOCH: boolean;
}

export interface NP_FIG_ROLE_CL extends ILinearCL {
    ISN_LCLASSIF: number;
    CLASSIF_NAME: string;
    NOTE: string;
    WEIGHT: number;
    CLEAR_CABINET: boolean;
}

export interface NP_OB_TYPE_CL extends ILinearCL {
    ISN_LCLASSIF: number;
    CLASSIF_NAME: string;
    NOTE: string;
    WEIGHT: number;
    USE_C: boolean;
    USE_A: boolean;
    USE_N: boolean;
}

export interface NP_OB_RETURN_CL extends ILinearCL {
    ISN_LCLASSIF: number;
    CLASSIF_NAME: string;
    NOTE: string;
    WEIGHT: number;
    USE_C: boolean;
    USE_A: boolean;
    USE_N: boolean;
}

export interface NP_OB_OTZIV_CL extends ILinearCL {
    ISN_LCLASSIF: number;
    CLASSIF_NAME: string;
    NOTE: string;
    WEIGHT: number;
    USE_C: boolean;
    USE_A: boolean;
    USE_N: boolean;
}

export interface NP_OB_MOTIV_CL extends ILinearCL {
    ISN_LCLASSIF: number;
    CLASSIF_NAME: string;
    NOTE: string;
    WEIGHT: number;
    USE_C: boolean;
    USE_A: boolean;
    USE_N: boolean;
}

export interface NP_OB_OSNOV_CL extends ILinearCL {
    ISN_LCLASSIF: number;
    CLASSIF_NAME: string;
    NOTE: string;
    WEIGHT: number;
    USE_C: boolean;
    USE_A: boolean;
    USE_N: boolean;
    USE_VP: boolean;
    USE_NP: boolean;
}

export interface NP_RESHEN_CL extends IHierCL {
    LAYER: number;
    WEIGHT: number;
    MAXDUE: string;
}

export interface SYS_PARMS extends IEnt {
    ISN_USER_OWNER: number;
    DBMS: string;
}

export interface CUSTOM_STORAGE_ID extends IEnt {
    VALUE_ID: string;

    CUSTOM_STORAGE_List: CUSTOM_STORAGE[];
}

export interface NP_RESHEN_CL extends IHierCL {
    LAYER: number;
    WEIGHT: number;
    MAXDUE: string;
}

export interface NP_SUD_RESHEN_TYPE_CL extends IHierCL {
    LAYER: number;
    WEIGHT: number;
    MAXDUE: string;
}

export interface USER_EDIT_ORG_TYPE extends IEnt {
    ISN_USER: number;
    ISN_ORG_TYPE: number;
}
export interface FILE_TYPE_CL {
    ISN_LCLASSIF: number;
    CLASSIF_NAME: string;
    DELETED: number;
    PROTECTED: number;
    WEIGHT: number;
    TAG: string;
    UNIQUE_FLAG: number;
    ISN_WHO: number;
    ISN_DATE: number;
    UPD_WHO: string;
    UPD_DATE: string;
}

export interface MEDO_PARTICIPANT {
    ISN_ORGANIZ: number;
    GATE: string;
    GATE_ID: string;
    MSGFORMAT: string;
}

export interface IDG_FILE_CATEGORY {
    ISN_NODE_DG: number;
    ISN_FILE_CATEGORY: number;
    DUE_NODE_DG: string;
}

export interface LIB_LIBRARY {
    ISN_LIBRARY: number;
    NAME: string;
    DESCRIPTION: string;
}

export interface FILE_CATEGORY_CL extends IEnt, IStamp {
    ISN_LCLASSIF: number;
    NAME: string;
    NOTE: string;
    PROTECTED: number;
    WEIGHT: number;
    DG_FILE_CATEGORY_List: IDG_FILE_CATEGORY[];
    DELETED: number;
}

export interface DELO_OWNER {
    DUE_ORGANIZ: string;
    ISN_DELO_OWNER: number;
    ISN_ORGANIZ: number;
    ISN_OWNER: number;
    NAME: string;
    ORG_ID: null;
    SYS_ID: string;
    SYS_NAME: string;
    SYS_VERSION: string;
}

export interface SRCH_GROUP {
    /**
     * ISN группы отчета
     */
    ISN_GROUP: number;
    /**
     * name наименование группы отчета
     */
    NAME: string;
    /**
     * вес
     */
    WEIGHT: number;
    ALLOWED_FOR_ALL: number;
    PROTECTED: number;
    NOTE: string;
}

export interface USER_SRCH_GROUP {
    ISN_USER: number;
    ISN_GROUP: number;
}

export interface SRCH_GROUP_ITEM {
    ISN_GROUP: number;
    ISN_REQUEST: number;
    WEIGHT: number;
}

export interface APP_HOST {
    ISN_APP_HOST: number;
    DISPLAY_NAME: string;
    SERVICE_URL: string;
    ENABLED: number;
}
export interface ADDRESS {
    ISN_ADDRESS: number;
    ISN_ADDRESS_VID: number;
    /** Регион с которым связанн адрес */
    ISN_REGION: number;
    /** ISN гражданина с которым связан адрес */
    ISN_OWNER: number;
    KIND_OWNER: number;
    ZIPCODE: string;
    SETTLEMENT: string;
    ADDRES: string;
    NOTE: string;
    DELETED: number;
    ORDERNUM: number;
}
