import { IBaseUsers, IParamAccordionList } from '../../../shared/intrfaces/user-params.interfaces';

export const REGISTRATION_USER: IBaseUsers = {
    id: 'registration',
    title: 'Регистрация',
    apiInstance: 'USER_PARMS',
    disabledFields: [
        'RCSEND_REGISTRATION_NUMBER',
        'RCSEND_REGISTRATION_NUMBER_SUBSET',
        'RCSEND_DATE_OF_REGISTRATION',
        'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ABBREVIATION',
        'RCSEND_VISAS_ORGANIZATION_ABBREVIATION',
        'RCSEND_ADDRESSES_ORGANIZATION_ABBREVIATION',
        'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ABBREVIATION',
        'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ABBREVIATION',
        'RCSEND_EXECUTOR_ORGANIZATION_ABBREVIATION',
        'RCSEND_ORDERS_SYSTEM_NUMBER',
        'RCSEND_ORDERS_POINT_RESOLUTION'
    ],
    fields: [
        {
            key: 'AUTOSEND',
            type: 'boolean',
            title: 'Автоматически вызывать функцию переслать РК'
        },
        {
            key: 'AUTOLOAD_TO_EXEC_CURR_CAB',
            type: 'boolean',
            title: 'На исполнение текущего кабинета'
        },
        {
            key: 'AUTOLOAD_TO_DELO_CURR_CAB',
            type: 'boolean',
            title: 'В дело текущего кабинета'
        },
        {
            key: 'AUTOSTAMP',
            type: 'boolean',
            title: 'Автоматическая печать регистрация штампа(входящий)'
        },
        {
            key: 'AUTOSTAMP1',
            type: 'boolean',
            title: 'Автоматическая печать регистрация штампа(исходящий)'
        },
        {
            key: 'SECURLEVEL',
            type: 'radio',
            title: '',
            readonly: false,
            options: [
                {value: '0', title: 'от предыдущей РК'},
                {value: '1', title: 'первый из справочника'}
            ]
        },
        {
            key: 'DELIVERY_TYPE',
            type: 'radio',
            title: '',
            readonly: false,
            options: [
                {value: '0', title: 'от предыдущей РК'},
                {value: '1', title: 'первый из справочника'}
            ]
        },
        {
            key: 'TESTRAPID_ONSAVE',
            type: 'boolean',
            title: 'Автоматически вызывать проверку повторности РК'
        },
        {
            key: 'TESTRAPID_USECORRESP',
            type: 'boolean',
            title: 'Проверять корреспондента'
        },
        {
            key: 'PRJ2RC_DIALOG',
            type: 'radio',
            title: '',
            readonly: false,
            options: [
                {value: 'NO', title: 'Без диалога'},
                {value: 'YES', title: 'С диалогом'}
            ]
        },
        {
            key: 'FILELOCK',
            type: 'boolean',
            title: 'Запрет на редактирование прикрепляемых файлов'
        },
        {
            key: 'FILE_DONTDEL',
            type: 'boolean',
            title: 'Запрет на удаление прикрепляемых файлов'
        },
        {
            key: 'DEF_SEARCH_CITIZEN',
            type: 'boolean',
            title: 'Фамилия'
        },
        {
            key: 'SEV_HIDE_SENDING',
            type: 'boolean',
            title: 'Скрыть операцию "Отправить сообщение СЭВ"'
        },
        {
            key: 'SEV_ALLOW_DELIVERY',
            type: 'boolean',
            title: 'Учитывать вид отправки'
        },
        {
            key: 'FIRST_PRJEXEC_FROM_PREV',
            type: 'boolean',
            title: 'Первый исполнитель от предыдущей РКПД'
        },
        {
            key: 'DONT_SHOW_PRJ_HIDDEN_FILES',
            type: 'boolean',
            title: 'Не показывать скрытые файлы'
        },
        {
            key: 'CORR_SIGN',
            type: 'boolean',
            title: 'Заполнять поле "Подписал" (Корреспондент) из справочника'
        },
        {
            key: 'ADDR_WHOUM',
            type: 'boolean',
            title: 'Заполнять поле "Кому" (Адресат) из справочника '
        },
        {
            key: 'ORGGROUP',
            title: '',
            type: 'string'
        },
        {
            key: 'ORGGROUP_NAME',
            title: '',
            type: 'string'
        },
        {
            key: 'LINKED_SEARCHPARAM',
            type: 'select',
            title: '',
            options: [
                {value: '1', title: 'Рег. № всех видов документов'},
                {value: '2', title: 'Рег. № входящих документов'},
                {value: '3', title: 'Рег. № писем граждан'},
                {value: '4', title: 'Рег. № входящих документов и писем граждан'},
                {value: '5', title: 'Рег. № исходящих документов'},
                {value: '6', title: 'Исходящему № корреспондента'},
                {value: '7', title: 'Исходящему № сопроводительного документа'},
                {value: '8', title: 'Исходящему № корреспондента и сопр. документа'},
                {value: '9', title: 'Рег. № проектов документов'}
            ]
        },
        {
            key: 'LINKED_SEARCHVALUE',
            type: 'select',
            title: '',
            options: [
                {value: '1', title: 'Точное'},
                {value: '2', title: 'Начало номера'},
                {value: '3', title: 'Подстрока'},
                {value: '4', title: 'Порядковый'}
            ]
        },
        {
            key: 'LINKED_SEARCHYEAR',
            type: 'select',
            title: '',
            options: [
                {value: '1', title: 'Нет'},
                {value: '2', title: 'Текущий'},
                {value: '3', title: 'Предыдущий'}
            ]
        },
        {
            key: 'LINKED_LINKTYPE',
            type: 'select',
            title: '',
            options: [
                {value: '0', title: ''},
                {value: '1', title: 'Исполнено'},
                {value: '2', title: 'Во исполнение'},
                {value: '3', title: 'Первичный'},
                {value: '4', title: 'Повторный'},
                {value: '5', title: 'Зарегистрирован'},
                {value: '6', title: 'Проект'},
                {value: '3786', title: 'В дополнение'},
                {value: '3787', title: 'Дополнен'},
                {value: '4057035', title: 'В отмену'},
                {value: '4057036', title: 'Отменен'},
                {value: '3788', title: 'Общий автор'},
                {value: '3790', title: 'Ответ на'},
                {value: '3791', title: 'Обращение'},
                {value: '4410', title: 'Запрос'},
                {value: '4411', title: 'Ответ на запрос'},
                {value: '4057038', title: 'Факс'},
                {value: '4057039', title: 'Оригинал'}
            ]
        },
        {
            key: 'LINKED_WIN_SHOW',
            type: 'boolean',
            title: 'Всегда показывать список найденных документов'
        },
        {
            key: 'RCSEND',
            type: 'boolean',
            title: ''
        },
        {
            key: 'RECEIP_EMAIL',
            type: 'string',
            title: '',
        },
        {
            key: 'MAILRECEIVE',
            type: 'boolean',
            title: ''
        },
        {
            key: 'SHABLONBARCODE',
            type: 'select',
            title: '',
            options: [
                {value: 'barcode5.dot', title: 'Печать штрих-кода - наклейки'},
                {value: 'barcode1.dot', title: 'Печать штрих-кода в левом верхнем углу'},
                {value: 'barcode3.dot', title: 'Печать штрих-кода в левом нижнем углу'},
                {value: 'barcode2.dot', title: 'Печать штрих-кода в правом верхнем углу'},
                {value: 'barcode4.dot', title: 'Печать штрих-кода в правом нижнем углу'}
            ]
        },
        {
            key: 'SHABLONBARCODEL',
            type: 'select',
            title: '',
            options: [
                {value: 'barcodeL5.dot', title: 'Печать штрих-кода - наклейки'},
                {value: 'barcodeL1.dot', title: 'Печать штрих-кода в левом верхнем углу'},
                {value: 'barcodeL3.dot', title: 'Печать штрих-кода в левом нижнем углу'},
                {value: 'barcodeL2.dot', title: 'Печать штрих-кода в правом верхнем углу'},
                {value: 'barcodeL4.dot', title: 'Печать штрих-кода в правом нижнем углу'}
            ]
        },
        {
            key: 'SAVEFORMAT',
            type: 'select',
            title: '',
            options: [
                {value: '0', title: ''},
                {value: '1', title: 'формат сохранения по умолчанию, rtf'}
            ]
        },
        {
            key: 'LOCKFILE_SSCAN',
            type: 'boolean',
            title: 'Запретить редактирование прикрепленного файла'
        }
    ],
    fieldsChild: [
        {
            key: 'DEF_SEARCH_CITIZEN_SURNAME',
            type: 'boolean',
            title: 'Фамилия'
        },
        {
            key: 'DEF_SEARCH_CITIZEN_SURNAME_RADIO',
            type: 'radio',
            title: '',
            options: [
                {value: '3', title: 'по началу'},
                {value: '1', title: 'по подстроке'},
                {value: '2', title: 'на равенство'}
            ]
        },
        {
            key: 'DEF_SEARCH_CITIZEN_CITY',
            type: 'boolean',
            title: 'Город'
        },
        {
            key: 'DEF_SEARCH_CITIZEN_CITY_RADIO',
            type: 'radio',
            title: '',
            options: [
                {value: '3', title: 'по началу'},
                {value: '1', title: 'по подстроке'},
                {value: '2', title: 'на равенство'}
            ]
        },
        {
            key: 'DEF_SEARCH_CITIZEN_INDEX',
            type: 'boolean',
            title: 'Индекс'
        },
        {
            key: 'DEF_SEARCH_CITIZEN_INDEX_RADIO',
            type: 'radio',
            title: '',
            options: [
                {value: '3', title: 'по началу'},
                {value: '1', title: 'по подстроке'},
                {value: '2', title: 'на равенство'}
            ]
        },
        {
            key: 'DEF_SEARCH_CITIZEN_ADDRESS',
            type: 'boolean',
            title: 'Адрес'
        },
        {
            key: 'DEF_SEARCH_CITIZEN_ADDRESS_RADIO',
            type: 'radio',
            title: '',
            options: [
                {value: '3', title: 'по началу'},
                {value: '1', title: 'по подстроке'},
                {value: '2', title: 'на равенство'}
            ]
        },
        {
            key: 'DEF_SEARCH_CITIZEN_REGION',
            type: 'boolean',
            title: 'Регион'
        },
        {
            key: 'DEF_SEARCH_CITIZEN_REGION_RADIO',
            type: 'radio',
            title: '',
            options: [
                {value: '1', title: 'на вхождение'},
                {value: '2', title: 'на равенство'}
            ]
        },
        {
            key: 'DEF_SEARCH_CITIZEN_OTHER',
            type: 'boolean',
            title: 'Прочие'
        },
        {
            key: 'DEF_SEARCH_CITIZEN_OTHER_RADIO',
            type: 'radio',
            title: '',
            options: [
                {value: '3', title: 'по началу'},
                {value: '1', title: 'по подстроке'},
                {value: '2', title: 'на равенство'}
            ]
        },
        {
            key: 'RCSEND_HIDE_OPERATION_SEND_EMAIL',
            type: 'boolean',
            title: 'Скрыть операцию \'Отправить E-mail\''
        },
        {
            key: 'RCSEND_ENCRYPTION',
            type: 'boolean',
            title: 'Шифрование'
        },
        {
            key: 'RCSEND_ELECTRONIC_SIGNATURE',
            type: 'boolean',
            title: 'Электронная подпись'
        },
        {
            key: 'RCSEND_COMPRESS_ATTACHED_FILES',
            type: 'boolean',
            title: 'Сжимать прикрепленные файлы'
        },
        {
            key: 'RCSEND_CONSIDER_THE_TYPE_OF_DISPATCH',
            type: 'boolean',
            title: 'Учитывать вид отправки'
        },
        {
            key: 'RCSEND_REPORT_THE_DELIVERY_OF_THIS_MESSAGE',
            type: 'boolean',
            title: 'Сообщить о доставке этого сообщения'
        },
        {
            key: 'RCSEND_REQUIRES_REGISTRATION_NOTICE_OR_OPT_OUT',
            type: 'boolean',
            title: 'Требуется уведомление о регистрации или отказе от нее'
        },
        {
            key: 'RCSEND_FOR_MULTIPOINT_DOCUMENTS_SEND_RADIO',
            type: 'radio',
            title: '',
            options: [
                {value: '0', title: 'весь документ'},
                {value: '1', title: 'выписку'}
            ]
        },
        {
            key: 'RCSEND_RESOLUTIONS',
            type: 'boolean',
            title: 'Резолюции'
        },
        {
            key: 'RCSEND_RESOLUTIONS_RADIO',
            type: 'radio',
            title: '',
         //   readonly: true,
            options: [
                {value: '0', title: '"свои"'},
                {value: '1', title: 'все'}
            ]
        },
        {
            key: 'RCSEND_ADDRESSEES',
            type: 'boolean',
            title: 'Адресаты'
        },
        {
            key: 'RCSEND_ADDRESSEES_RADIO',
            type: 'radio',
            title: '',
           // readonly: true,
            options: [
                {value: '0', title: '"свои"'},
                {value: '1', title: 'все'}
            ]
        },
        {
            key: 'RCSEND_GROUP_OF_DOCUMENTS',
            type: 'boolean',
            title: 'Группа документов'
        },
        {
            key: 'RCSEND_THE_COMPOSITION_OF_THE_DOCUMENT',
            type: 'boolean',
            title: 'Состав документа'
        },
        {
            key: 'RCSEND_SUMMARY',
            type: 'boolean',
            title: 'Краткое содержание'
        },
        {
            key: 'RCSEND_SIGN_OF_COLLECTIVITY',
            type: 'boolean',
            title: 'Признак коллективности (письма гражданина)'
        },
        // --------------------------------------
        {
            key: 'RCSEND_REGISTRATION_NUMBER',
            type: 'boolean',
            title: 'Регистрационный номер'
        },
        {
            key: 'RCSEND_REGISTRATION_NUMBER_SUBSET',
            type: 'boolean',
            title: 'Регистрационный номер'
        },
        {
            key: 'RCSEND_DATE_OF_REGISTRATION',
            type: 'boolean',
            title: 'Дата регистрации'
        },
        // --------------------------------------
        {
            key: 'RCSEND_ACCESS_NECK',
            type: 'boolean',
            title: 'Гриф доступа'
        },
        {
            key: 'RCSEND_HEADINGS',
            type: 'boolean',
            title: 'Рубрики'
        },
        {
            key: 'RCSEND_ACCOMPANYING_DOCUMENTS',
            type: 'boolean',
            title: 'Сопроводительные документы'
        },
        {
            key: 'RCSEND_NOTE_TO_THE_RK',
            type: 'boolean',
            title: 'Примечание к РК'
        },
        {
            key: 'RCSEND_NOTE_TO_THE_ADDRESSEE_OF_THE_MESSAGE',
            type: 'boolean',
            title: 'Примечание к адресату-получателю сообщения'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR',
            type: 'boolean',
            title: 'Автор документа'
        },
        {
            key: 'RCSEND_VISAS',
            type: 'boolean',
            title: 'Визы'
        },
        {
            key: 'RCSEND_ADDRESSES',
            type: 'boolean',
            title: 'Адресаты'
        },
        {
            key: 'RCSEND_DOCUMENT_PERFORMER',
            type: 'boolean',
            title: 'Исполнитель документа'
        },
        {
            key: 'RCSEND_ORDERS',
            type: 'boolean',
            title: 'Поручения'
        },
        {
            key: 'RCSEND_ADDITIONAL_DETAILS',
            type: 'boolean',
            title: 'Дополнительные реквизиты'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION',
            type: 'boolean',
            title: 'Организация'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_FULL_TITLE',
            type: 'boolean',
            title: 'Полное название'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ABBREVIATION',
            type: 'boolean',
            title: 'Сокращенное название'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_OGRN_CODE',
            type: 'boolean',
            title: 'Код ОГРН'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_INN',
            type: 'boolean',
            title: 'ИНН'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS',
            type: 'boolean',
            title: 'Адрес'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_CITY',
            type: 'boolean',
            title: 'Город'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_REGION',
            type: 'boolean',
            title: 'Регион'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_POSTCODE',
            type: 'boolean',
            title: 'Почтовый индекс'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_STREET',
            type: 'boolean',
            title: 'Улица, дом'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_EMAIL',
            type: 'boolean',
            title: 'E-mail'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED',
            type: 'boolean',
            title: 'Подписал'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_FULL_NAME',
            type: 'boolean',
            title: 'ФИО'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_SUBDIVISION',
            type: 'boolean',
            title: 'Подразделение'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_POSITION',
            type: 'boolean',
            title: 'Должность'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_DATE_OF_SIGNING',
            type: 'boolean',
            title: 'Дата подписания'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER',
            type: 'boolean',
            title: 'Номер автора документа'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER_REGISTRATION_NUMBER',
            type: 'boolean',
            title: 'Регистрационный номер'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER_DATE_OF_REGISTRATION',
            type: 'boolean',
            title: 'Дата регистрации'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_CITIZEN',
            type: 'boolean',
            title: 'Гражданин'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_CITIZEN_FULL_NAME',
            type: 'boolean',
            title: 'ФИО'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_CITIZEN_INN_SNILS',
            type: 'boolean',
            title: 'ИНН, СНИЛС'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_CITIZEN_PASSPORT_DETAILS',
            type: 'boolean',
            title: 'Паспортные данные'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS',
            type: 'boolean',
            title: 'Адрес'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS_CITY',
            type: 'boolean',
            title: 'Город'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS_REGION',
            type: 'boolean',
            title: 'Регион'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS_POSTCODE',
            type: 'boolean',
            title: 'Почтовый индекс'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS_STREET',
            type: 'boolean',
            title: 'Улица, дом'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_CITIZEN_EMAIL_PHONE',
            type: 'boolean',
            title: 'E-mail, телефон'
        },
        {
            key: 'RCSEND_VISAS_ORGANIZATION',
            type: 'boolean',
            title: 'Организация'
        },
        {
            key: 'RCSEND_VISAS_ORGANIZATION_FULL_TITLE',
            type: 'boolean',
            title: 'Полное название'
        },
        {
            key: 'RCSEND_VISAS_ORGANIZATION_ABBREVIATION',
            type: 'boolean',
            title: 'Сокращенное название'
        },
        {
            key: 'RCSEND_VISAS_ORGANIZATION_OGRN_CODE',
            type: 'boolean',
            title: 'Код ОГРН'
        },
        {
            key: 'RCSEND_VISAS_ORGANIZATION_INN',
            type: 'boolean',
            title: 'ИНН'
        },
        {
            key: 'RCSEND_VISAS_ORGANIZATION_ADDRESS',
            type: 'boolean',
            title: 'Адрес'
        },
        {
            key: 'RCSEND_VISAS_ORGANIZATION_ADDRESS_CITY',
            type: 'boolean',
            title: 'Город'
        },
        {
            key: 'RCSEND_VISAS_ORGANIZATION_ADDRESS_REGION',
            type: 'boolean',
            title: 'Регион'
        },
        {
            key: 'RCSEND_VISAS_ORGANIZATION_ADDRESS_POSTCODE',
            type: 'boolean',
            title: 'Почтовый индекс'
        },
        {
            key: 'RCSEND_VISAS_ORGANIZATION_ADDRESS_STREET',
            type: 'boolean',
            title: 'Улица, дом'
        },
        {
            key: 'RCSEND_VISAS_ORGANIZATION_EMAIL',
            type: 'boolean',
            title: 'E-mail'
        },
        {
            key: 'RCSEND_VISAS_ORGANIZATION_EXECUTIVE',
            type: 'boolean',
            title: 'Должностное лицо'
        },
        {
            key: 'RCSEND_VISAS_ORGANIZATION_EXECUTIVE_FULL_NAME',
            type: 'boolean',
            title: 'ФИО'
        },
        {
            key: 'RCSEND_VISAS_ORGANIZATION_EXECUTIVE_SUBDIVISION',
            type: 'boolean',
            title: 'Подразделение'
        },
        {
            key: 'RCSEND_VISAS_ORGANIZATION_EXECUTIVE_POSITION',
            type: 'boolean',
            title: 'Должность'
        },
        {
            key: 'RCSEND_VISAS_ORGANIZATION_EXECUTIVE_DATE_OF_SIGNING',
            type: 'boolean',
            title: 'Дата подписания'
        },
        // ---------------------------------------------------
        {
            key: 'RCSEND_ADDRESSES_ORGANIZATION',
            type: 'boolean',
            title: 'Организация'
        },
        {
            key: 'RCSEND_ADDRESSES_ORGANIZATION_FULL_TITLE',
            type: 'boolean',
            title: 'Полное название'
        },
        {
            key: 'RCSEND_ADDRESSES_ORGANIZATION_ABBREVIATION',
            type: 'boolean',
            title: 'Сокращенное название'
        },
        {
            key: 'RCSEND_ADDRESSES_ORGANIZATION_OGRN_CODE',
            type: 'boolean',
            title: 'Код ОГРН'
        },
        {
            key: 'RCSEND_ADDRESSES_ORGANIZATION_INN',
            type: 'boolean',
            title: 'ИНН'
        },
        {
            key: 'RCSEND_ADDRESSES_ORGANIZATION_ADDRESS',
            type: 'boolean',
            title: 'Адрес'
        },
        {
            key: 'RCSEND_ADDRESSES_ORGANIZATION_ADDRESS_CITY',
            type: 'boolean',
            title: 'Город'
        },
        {
            key: 'RCSEND_ADDRESSES_ORGANIZATION_ADDRESS_REGION',
            type: 'boolean',
            title: 'Регион'
        },
        {
            key: 'RCSEND_ADDRESSES_ORGANIZATION_ADDRESS_POSTCODE',
            type: 'boolean',
            title: 'Почтовый индекс'
        },
        {
            key: 'RCSEND_ADDRESSES_ORGANIZATION_ADDRESS_STREET',
            type: 'boolean',
            title: 'Улица, дом'
        },
        {
            key: 'RCSEND_ADDRESSES_ORGANIZATION_EMAIL',
            type: 'boolean',
            title: 'E-mail'
        },
        {
            key: 'RCSEND_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED',
            type: 'boolean',
            title: 'Кому адресован'
        },
        {
            key: 'RCSEND_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED_FULL_NAME',
            type: 'boolean',
            title: 'ФИО'
        },
        {
            key: 'RCSEND_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED_SUBDIVISION',
            type: 'boolean',
            title: 'Подразделение'
        },
        {
            key: 'RCSEND_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED_POSITION',
            type: 'boolean',
            title: 'Должность'
        },

        {
            key: 'RCSEND_ADDRESSES_CITIZEN',
            type: 'boolean',
            title: 'Гражданин'
        },
        {
            key: 'RCSEND_ADDRESSES_CITIZEN_FULL_NAME',
            type: 'boolean',
            title: 'ФИО'
        },
        {
            key: 'RCSEND_ADDRESSES_CITIZEN_INN_SNILS',
            type: 'boolean',
            title: 'ИНН, СНИЛС'
        },
        {
            key: 'RCSEND_ADDRESSES_CITIZEN_PASSPORT_DETAILS',
            type: 'boolean',
            title: 'Паспортные данные'
        },
        {
            key: 'RCSEND_ADDRESSES_CITIZEN_ADDRESS',
            type: 'boolean',
            title: 'Адрес'
        },
        {
            key: 'RCSEND_ADDRESSES_CITIZEN_ADDRESS_CITY',
            type: 'boolean',
            title: 'Город'
        },
        {
            key: 'RCSEND_ADDRESSES_CITIZEN_ADDRESS_REGION',
            type: 'boolean',
            title: 'Регион'
        },
        {
            key: 'RCSEND_ADDRESSES_CITIZEN_ADDRESS_POSTCODE',
            type: 'boolean',
            title: 'Почтовый индекс'
        },
        {
            key: 'RCSEND_ADDRESSES_CITIZEN_ADDRESS_STREET',
            type: 'boolean',
            title: 'Улица, дом'
        },
        {
            key: 'RCSEND_ADDRESSES_CITIZEN_EMAIL_PHONE',
            type: 'boolean',
            title: 'E-mail, телефон'
        },
        // Исполнитель документа
        {
            key: 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION',
            type: 'boolean',
            title: 'Организация'
        },
        {
            key: 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_FULL_TITLE',
            type: 'boolean',
            title: 'Полное название'
        },
        {
            key: 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ABBREVIATION',
            type: 'boolean',
            title: 'Сокращенное название'
        },
        {
            key: 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_OGRN_CODE',
            type: 'boolean',
            title: 'Код ОГРН'
        },
        {
            key: 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_INN',
            type: 'boolean',
            title: 'ИНН'
        },
        {
            key: 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS',
            type: 'boolean',
            title: 'Адрес'
        },
        {
            key: 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_CITY',
            type: 'boolean',
            title: 'Город'
        },
        {
            key: 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_REGION',
            type: 'boolean',
            title: 'Регион'
        },
        {
            key: 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_POSTCODE',
            type: 'boolean',
            title: 'Почтовый индекс'
        },
        {
            key: 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_STREET',
            type: 'boolean',
            title: 'Улица, дом'
        },
        {
            key: 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EMAIL',
            type: 'boolean',
            title: 'E-mail'
        },
        {
            key: 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED',
            type: 'boolean',
            title: 'Должностное лицо'
        },
        {
            key: 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED_FULL_NAME',
            type: 'boolean',
            title: 'ФИО'
        },
        {
            key: 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED_SUBDIVISION',
            type: 'boolean',
            title: 'Подразделение'
        },
        {
            key: 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED_POSITION',
            type: 'boolean',
            title: 'Должность'
        },

        // Поручения
        {
            key: 'RCSEND_ORDERS_SYSTEM_NUMBER',
            type: 'boolean',
            title: 'Системный номер'
        },
        {
            key: 'RCSEND_ORDERS_POINT_RESOLUTION',
            type: 'boolean',
            title: 'Пункт/резолюция'
        },
        {
            key: 'RCSEND_ORDERS_ORDER_TEXT',
            type: 'boolean',
            title: 'Текст поручения'
        },
        {
            key: 'RCSEND_ORDERS_PLANNED_DATE_OF_PERFORMANCE',
            type: 'boolean',
            title: 'Плановая дата исполнения'
        },
        {
            key: 'RCSEND_ORDERS_RESOLUTION_CREATION_DATE',
            type: 'boolean',
            title: 'Дата создания резолюции'
        },
        {
            key: 'RCSEND_ORDERS_ITEM_NUMBER',
            type: 'boolean',
            title: 'Номер пункта'
        },
        {
            key: 'RCSEND_ORDERS_PRIVACY_FEATURE',
            type: 'boolean',
            title: 'Признак конфиденциальности'
        },
        {
            key: 'RCSEND_ORDERS_RESOLUTION_AUTHOR',
            type: 'boolean',
            title: 'Автор резолюции'
        },

        {
            key: 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION',
            type: 'boolean',
            title: 'Организация'
        },
        {
            key: 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_FULL_TITLE',
            type: 'boolean',
            title: 'Полное название'
        },
        {
            key: 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ABBREVIATION',
            type: 'boolean',
            title: 'Сокращенное название'
        },
        {
            key: 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_OGRN_CODE',
            type: 'boolean',
            title: 'Код ОГРН'
        },
        {
            key: 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_INN',
            type: 'boolean',
            title: 'ИНН'
        },
        {
            key: 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS',
            type: 'boolean',
            title: 'Адрес'
        },
        {
            key: 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_CITY',
            type: 'boolean',
            title: 'Город'
        },
        {
            key: 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_REGION',
            type: 'boolean',
            title: 'Регион'
        },
        {
            key: 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_POSTCODE',
            type: 'boolean',
            title: 'Почтовый индекс'
        },
        {
            key: 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_STREET',
            type: 'boolean',
            title: 'Улица, дом'
        },
        {
            key: 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EMAIL',
            type: 'boolean',
            title: 'E-mail'
        },
        {
            key: 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED',
            type: 'boolean',
            title: 'Должностное лицо'
        },
        {
            key: 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED_FULL_NAME',
            type: 'boolean',
            title: 'ФИО'
        },
        {
            key: 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED_SUBDIVISION',
            type: 'boolean',
            title: 'Подразделение'
        },
        {
            key: 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_POSITION',
            type: 'boolean',
            title: 'Должность'
        },
        {
            key: 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_DATE_OF_SIGNING',
            type: 'boolean',
            title: 'Дата подписания'
        },

        {
            key: 'RCSEND_EXECUTOR',
            type: 'boolean',
            title: 'Исполнитель'
        },
        {
            key: 'RCSEND_EXECUTOR_ORGANIZATION',
            type: 'boolean',
            title: 'Организация'
        },
        {
            key: 'RCSEND_EXECUTOR_ORGANIZATION_FULL_TITLE',
            type: 'boolean',
            title: 'Полное название'
        },
        {
            key: 'RCSEND_EXECUTOR_ORGANIZATION_ABBREVIATION',
            type: 'boolean',
            title: 'Сокращенное название'
        },
        {
            key: 'RCSEND_EXECUTOR_ORGANIZATION_OGRN_CODE',
            type: 'boolean',
            title: 'Код ОГРН'
        },
        {
            key: 'RCSEND_EXECUTOR_ORGANIZATION_INN',
            type: 'boolean',
            title: 'ИНН'
        },
        {
            key: 'RCSEND_EXECUTOR_ORGANIZATION_ADDRESS',
            type: 'boolean',
            title: 'Адрес'
        },
        {
            key: 'RCSEND_ORDERS_EXECUTOR_ORGANIZATION_ADDRESS_CITY',
            type: 'boolean',
            title: 'Город'
        },
        {
            key: 'RCSEND_ORDERS_EXECUTOR_ORGANIZATION_ADDRESS_REGION',
            type: 'boolean',
            title: 'Регион'
        },
        {
            key: 'RCSEND_EXECUTOR_ORGANIZATION_ADDRESS_POSTCODE',
            type: 'boolean',
            title: 'Почтовый индекс'
        },
        {
            key: 'RCSEND_EXECUTOR_ORGANIZATION_ADDRESS_STREET',
            type: 'boolean',
            title: 'Улица, дом'
        },
        {
            key: 'RCSEND_EXECUTOR_ORGANIZATION_EMAIL',
            type: 'boolean',
            title: 'E-mail'
        },
        {
            key: 'RCSEND_EXECUTOR_EXECUTIVE_ADDRESSED',
            type: 'boolean',
            title: 'Должностное лицо'
        },
        {
            key: 'RCSEND_EXECUTOR_EXECUTIVE_ADDRESSED_FULL_NAME',
            type: 'boolean',
            title: 'ФИО'
        },
        {
            key: 'RCSEND_EXECUTOR_ORGANIZATION_EXECUTIVE_ADDRESSED_SUBDIVISION',
            type: 'boolean',
            title: 'Подразделение'
        },
        {
            key: 'RCSEND_EXECUTOR_ORGANIZATION_EXECUTIVE_POSITION',
            type: 'boolean',
            title: 'Должность'
        },
        {
            key: 'RCSEND_OREDER_FILES',
            type: 'boolean',
            title: 'Файлы поручений'
        },
        {
            key: 'MAILRECEIVE_DELETE_POST_AFTER_REGISTRATION',
            type: 'boolean',
            title: 'Удалить сообщение после регистрации'
        },
        {
            key: 'MAILRECEIVE_DELETE_POST_AFTER_CANCELING_REGISTRATION',
            type: 'boolean',
            title: 'Удалить сообщение после отказа от регистрации'
        },
        {
            key: 'MAILRECEIVE_NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT',
            type: 'boolean',
            title: 'Уведомлять о регистрации или отказе от нее'
        },
        {
            key: 'MAILRECEIVE_NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT_RADIO',
            type: 'radio',
            title: '',
            options: [
                {value: '0', title: 'Всегда'},
                {value: '1', title: 'По заказу корреспондента'}
            ]
        },
        {
            key: 'MAILRECEIVE_ATTACH_DOCUMENT_PASSPORT_TO_RK',
            type: 'boolean',
            title: 'Прикрепить к РК паспорт документа'
        },
        {
            key: 'MAILRECEIVE_TAKE_RUBRICS_RK',
            type: 'boolean',
            title: 'Принимать рубрики РК'
        },
        {
            key: 'MAILRECEIVE_TAKE_RUBRICS_RK_RADIO',
            type: 'radio',
            title: '',
            options: [
                {value: '1', title: 'Определять рубрику по Коду'},
                {value: '0', title: 'Определять рубрику по Наименованию'},
                {value: '-1', title: 'Определять рубрику по Коду и Наименованию'}
            ]
        },
        {
            key: 'MAILRECEIVE_ACCOMPANYING_DOCUMENTS',
            type: 'boolean',
            title: 'Сопроводительные документы'
        },
        {
            key: 'MAILRECEIVE_AUTOMATICALLY_ADD_ORGANIZATIONS_AND_REPRESENTATIVES',
            type: 'boolean',
            title: 'Автоматически добавлять организации и представителей'
        },
        {
            key: 'MAILRECEIVE_CHECK_EMAIL_MESSAGES',
            type: 'boolean',
            title: 'Проверять ЭП сообщения'
        },
        {
            key: 'MAILRECEIVE_CHECK_EMAIL_FILE_ATTACHMENTS',
            type: 'boolean',
            title: 'Проверять ЭП вложенных файлов'
        },
        {
            key: 'MAILRECEIVE_CHECK_EMAIL_RESOLUTION',
            type: 'boolean',
            title: 'Проверять ЭП резолюции'
        },
        {
            key: 'MAILRECEIVE_NOTIFY_SENDER_IF_EMAIL_IS_NOT_VALID',
            type: 'boolean',
            title: 'Сообщать отправителю, если ЭП не действительна'
        },
        {
            key: 'MAILRECEIVE_NOTIFY_SENDER_IF_EMAIL_IS_VALID',
            type: 'boolean',
            title: 'Сообщать отправителю, если ЭП действительна'
        },
    ]
};

export const SUB_PARAMS_LIST_EMAIL_SEND_OPTIONS_NAV: IParamAccordionList[] = [
    {
        title: 'Общие параметры отправки сообщений',
        url: 'general-options-for-sending-messages',
        isOpen: false
    },
    {
        title: 'Параметры формирования паспорта',
        url: 'passport-formation-options',
        isOpen: false
    },
    {
        title: 'Реквизиты РК для отправки',
        url: 'requisites-rk-to-send',
        isOpen: false
    }
];

export const SUB_PARAMS_LIST_EMAIL_REGISTRATION_SETTINGS_NAV: IParamAccordionList[] = [
    {
        title: 'Параметры приема и регистрации сообщений',
        url: 'message-reception-and-logging-options',
        isOpen: false
    }
];

export const USER_PARAMS_LIST_REGISTRATION_EMAIL_NAV: IParamAccordionList[] = [
    {
        title: 'Параметры отправки',
        url: 'send-options',
        subList: SUB_PARAMS_LIST_EMAIL_SEND_OPTIONS_NAV,
        isOpen: true
    },
    {
        title: 'Параметры регистрации',
        url: 'registration-options',
        subList: SUB_PARAMS_LIST_EMAIL_REGISTRATION_SETTINGS_NAV,
        isOpen: true
    }
];
