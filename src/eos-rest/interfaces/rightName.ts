export enum E_TECH_RIGHT {
    Users = 1, // Пользователи
    CurrOrganiz = 2, // Текущая организация
    OrganizList = 3, // Список организаций
    OrganizTypes = 4, // Типы организаций
    Regions = 5, // Регионы
    AdresatCategories = 6, // Категории адресатов
    CalendarSettings = 7, // Ведение календаря
    Rubrics = 8, // Рубрикатор
    Docgroups = 9, // Группы документов
    Departments = 10, // Подразделения
    DeliveryTypes = 11, // Виды доставки
    ReestrTypes = 12, // Типы реестров
    LinkTypes = 13, // Типы связок
    DeloNomenkl = 14, // Номенклатура дел
    SecurGrifs = 15, // Грифы доступа
    Citizens = 16, // Граждане
    Citstatuses = 17, // Статус заявителя
    Cabinets = 18, // Кабинеты
    ArrDescripts = 19, // Настройка реквизитов
    Templates = 20, // Шаблоны
    EditUserProtocol = 21, // Протокол редактирования пользователей
    ManageCertificate = 22, // Управление сертификатами
    VisaTypes = 23, // Типы виз
    SignTypes = 24, // Виды подписей
    ResCategories = 25, // Категории поручений
    SystemParms = 26, // Параметры системы
    ExecStatuses = 27, // Cтатус исполнения (поручение)
    ReplyStatuses = 28, // Cтатус исполнения (исполнитель)
    ProcPeredachiDocs = 29, // Процедура передачи документов
    ViewProtSettings = 30, // Настройка протокола просмотра
    ProtVigruz = 31, // Зачистка протоколов
    NotificationManage = 32, // Настройка подсистемы оповещения
    PartionPostSettings = 33, // Настройка партионной почты
    SevCL = 34, // Справочники СЭВ
    BufCL = 35, // Буфер электронных сообщений
    ResPriority = 36, // Приоритеты проектов резолюций
    EdsCategory = 37, // Категории ЭП
    NadzorCL = 38, // Справочники Надзора
    NpObst = 39, // Обстоятельства дел
}

export enum E_CARD_RIGHT {
    REGDOC = 1, /// 1 - регистрация документов
    SEARCH = 2, /// 2 - поиск документов
    EDITRC = 3, /// 3 - редактирование РК
    DELRC = 4, /// 4 - удаление РК
    FORWARDRC = 5, /// 5 - пересылка РК
    REPORTS = 6, /// 6 - получение отчетов
    REMARKDOC = 7, /// 7 - переотметка документов
    W_DELO = 8, /// 8 - списание документов в дело
    ACQUAINTANCERC = 9, /// 9 - отметка ознакомления
    E_MAIL = 10, /// 10 - отправка по e-mail
    MARKSEND = 11, /// 11 - отметка отправки документов
    DEPOSIT = 12, /// 12 - опись дел (подготовка дел к хранению)
    ADDFILES = 13, /// 13 - добавлять файлы
    READFILES = 14, /// 14 - читать файлы
    UPDFILES = 15, /// 15 - редактировать файлы
    DELFILES = 16, /// 16 - удалять файлы
    VIEWRESOL = 17, /// 17 - Просмотр поручений
    SEVSEND = 18, /// 18 - Сервер Электронного Взаимодействия
    EDIT_AR_RC_VALUE = 19, /// 19 - Редактирование доп.реквизитов
    EDIT_REF_RUBRIC = 20, /// 20 - Редактирование рубрик
    EDIT_REF_LINK = 21 /// 21 - Редактирование связок
}
