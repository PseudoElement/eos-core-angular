import { ORGANIZ_CL } from "../../eos-rest/interfaces/structures";

export interface DeleteGroupDoc {
    isnFileCategory: number;
    isnNodeDg: number;
}

export interface METADATA {
    __type: string;
}

export interface RELFIELD {
    DUE_NODE_DG?: null | string;
}

export interface DgFileCategoryElement {
    CompositePrimaryKey: string;
    DUE_NODE_DG: string;
    ISN_FILE_CATEGORY: number;
    ISN_NODE_DG: number;
    __metadata: METADATA;
}

export interface ORIG {
    CLASSIF_NAME: string;
    DELETED: number;
    DG_FILE_CATEGORY_List: DgFileCategoryElement[];
    ISN_LCLASSIF: number;
    NAME: string;
    NOTE: string;
    PROTECTED: number;
    WEIGHT: string;
    __metadata: METADATA;
}

export interface REC extends ORIG {
    DOC_GROUP_NAMES: string;
    _orig: ORIG;
}

export interface ORIGINDATA {
    DG_FILE_CATEGORY_List: DgFileCategoryElement[];
    allOwner: undefined;
    rec: REC;
    updateTrules: any[];
    __relfield: RELFIELD;
}

export interface ResponseGraphQL {
    data: ResponseData;
}

export interface ResponseData {
    deleteDgFileCategory: ResponseFecth;
}

export interface ResponseFecth {
    clientMutationId?: string | null;
    message?: string | null;
    messageCode?: string | null;
    messageData?: string | null;
    systemMessage?: string | null;
    success: boolean;
}

export interface ErrFech {
    message: string;
    stack: string;
}

export interface SearchQueryOrganization {
    ISN_HIGH_NODE?: string;
    DUE?: string;
    LAYER?: string;
    branch: object;
    contact: object;
    medo: object;
    organiz: object;
    protocol: Protocol
}

export interface Protocol {
    FROM: string;
    OPER_DESCRIBE?: string;
    TO: string;
    USER_ISN: number;
}

export interface ResponseProt {
    data: {
        /** Получает страницу IProt для постраничного пейджинга. */
        protsPg: {
            /** Список объектов. Поле предоставлено в дополнение к Relay. */
            items: ResponseProtItem[];
        }
    };
    errors?: any[];
}

export interface ResponseProtItem {
    /** Подоперация. */
    suboperId: string;
    /** Описание операции. */
    operDescribe: string;
    /** Комментарий. */
    operComment: string;
    /** Дополнительная информация. */
    isnProtInfo: number |  null;
    /** Кто произвел операцию. */
    userIsn: number;
    /** Дата операции. */
    timeStamp: string
    /** Таблица. */
    tableId: string;
    /** Объект. */
    refIsn: number;
    /** Операция. */
    operId: string;
}

export interface ResponseOrganizationItems {
    /** Код организации. */
    due: string;
    /** ISN организации. */
    isnNode: number;
    /** Номер вышестоящ вершины. */
    isnHighNode: number;
    /** Номер уровня. */
    layer: number;
    /** Признак вершины. */
    isNode: number;
    /** Вес элемента. */
    weight: number;
    /** Наименование организации. */
    classifName: string;
    /** Поиск наим ие организации. */
    classifNameSearch: string;
    /** Признак защиты от удаления. */
    protected: number;
    /** Полное наименование. Полное наименование организации. */
    fullname: object,
    /** Почтовый индекс. */
    zipcode: string;
    /** Город. */
    city: string;
    /** Почтовый адрес. */
    address: string;
    /** Комментарий. */
    note: object,
    /** ОКПО. */
    okpo: object,
    /** ИНН. */
    inn: object,
    /** Регион. */
    isnRegion: object,
    /** ОКОНХ. */
    okonh: object,
    /** Юридический Адресс. */
    lawAdress: object,
    /** Форма Собственности. */
    isnOrganizType: object,
    /** Регисрационное свидейтельство. */
    sertificat: object,
    /** Категория адресата. */
    isnAddrCategory: object,
    /** поле для формирования выписок для ЦБ. */
    code: object,
    /** ОГРН. */
    ogrn: object,
    /** Срок исполнения РК. */
    termExec: object,
    /** Срок исполнения РК в каких днях. */
    termExecType: object,
    /** Дата создания. */
    insDate: object,
    /** Кто создал. */
    insWho: object,
    /** Дата изменения. */
    updDate: object,
    /** Кто изменил. */
    updWho: object,
    /** Признак логического удаления. */
    deleted: number;
    /** Признак использования E_MAIL для всех представителей. */
    mailForAll: number;
    /** Признак новой записи. */
    newRecord: number;
    /** OrganizCl_ParentNode_name. Ссылка через поле IsnHighNode. */
    parentNode: {
        /** Код организации. */
      due: string;
    }
}

export interface ResponseOrganization {
    data: {
        /** Получает страницу IOrganizCl для постраничного пейджинга. */
        organizClsPg: {
            /** Список объектов. Поле предоставлено в дополнение к Relay. */
          items: ResponseOrganizationItems[];
        }
      }
}

export interface ResponseCitizenItems {
    /** ISN гражданина. */
    isnCitizen: number;
    /** Фамилия И О. */
    citizenSurname: string;
    /** Фамилия И О в верхн регистре. */
    citizenSurnameSearch: string;
    /** Город. */
    citizenCity: string;
    /** Регион. */
    isnRegion: number;
    /** Город в верхн регистре. */
    citizenCitySearch: string;
    /** Почтовый индекс. */
    zipcode: number;
    /** Адрес. */
    citizenAddr: string;
    /** Признак защиты от удаления. Для СФ и Госдумы это поле также является признаком окабинеченности гражданина в виртуальной приемной. */
    protected: number;
    /** Вес элемента. */
    weight: number;
    /** Категория адресата. */
    isnAddrCategory: number;
    /** Телефон. */
    phone: string;
    /** Пол. 1 - м 0 - ж null - не определено. */
    sex: number;
    /** N Паспорта. */
    nPasport: string;
    /** Cерия. */
    series: string;
    /** Выдан. */
    given: string;
    /** ИНН. */
    inn: string;
    /** e_mail. */
    eMail: string;
    /** Требуется ЭП. */
    edsFlag: number;
    /** Требуется шифрование. */
    encryptFlag: number;
    /** Идентификатор сертификата. */
    idCertificate: string;
    /** Комментарий. */
    note: string;
    /** Почтовый формат. */
    mailFormat: number;
    /** Снилс. */
    snils: string;
    /** Дата создания. */
    insDate: number;
    /** Кто создал. */
    insWho: number;
    /** Дата изменения. */
    updDate: number;
    /** Кто изменил. */
    updWho: number;
    /** Признак логического удаления. */
    deleted: number;
    /** Регион. Ссылка через поле IsnRegion. */
    regionCl: {
        /** Код. */
        due: string;
    };
    /** Признак новой записи. */
    new: number;
}

export interface ResponseCitizens {
    data: {
        /** Получает страницу ICitizen для постраничного пейджинга. */
        citizensPg: {
            /** Список объектов. Поле предоставлено в дополнение к Relay. */
          items: ResponseCitizenItems[];
        }
      }
}

export interface ORGANIZ_EXTENDS extends ORGANIZ_CL {
    ID_CERTIFICATE?: string;
    E_MAIL?: string;
    GLOBAL_ID?: string;
}

export interface ProtNames {
    /** Описание. */
    describtion?: string;
    /** Тип операции. */
    operDescribe?: string;
    /** Примечание. */
    note?: string
    /** Операция. */
    operId?: string;
    /** Подоперация. */
    suboperId?: string;
    /** Таблица. */
    tableId?: string;
    /** Позиция в параметре пользователя. */
    viewParmPosition?: number;
    /** Наименование таблицы */
    __typename: string
}

export interface ResponseProtNames {
    protNamesPg: {
        items: ProtNames[];
        __typename: string;
    }
}