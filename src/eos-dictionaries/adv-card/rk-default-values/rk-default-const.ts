import { E_FIELD_TYPE } from './../../interfaces/dictionary.interfaces';
import { DIGIT3_PATTERN, DIGIT4_WITH_PERIOD_LIST_SEPARATED } from 'eos-common/consts/common.consts';

export class TDFSelect {
    dictId: string;
    dictKey: string;
    dictKeyTitle: string;
    version?: any;
    criteries?: any;
}
export class TDFSelectOption {
    value: any;
    title: string;
}

export class TDefaultField {
    key: string;
    type: E_FIELD_TYPE;
    title: string;
    dict?: TDFSelect;
    options?: TDFSelectOption[];
    pattern?: RegExp;
    value?: any;
    length?: number;
    minValue?: number;
    maxValue?: number;
    default?: any;

}

export const RKFieldsFict: TDefaultField[] = [
    {
        key: 'helper1',
        type: E_FIELD_TYPE.boolean,
        title: '',
    },
];


export const RKFictControls: TDefaultField[] = [
    {
        key: 'KR_CURRENT',
        type: E_FIELD_TYPE.radio,
        title: 'Картотека Регистрации',
        options: [
            {
                value: '0',
                title: 'Текущая картотека регистратора',
            }, {
                value: '1',
                title: '',
            }, {
                value: '2',
                title: 'Картотека первой пересылки РК',
            },
        ]
    }, {
        key: 'KR_CURRENT_IF',
        type: E_FIELD_TYPE.radio,
        title: 'Если журнал пересылки РК пуст, то',
        options: [
            {
                value: '0',
                title: 'Текущая картотека',
            }, {
                value: '1',
                title: '',
            }
        ]
    }, {
        key: 'ISN_CARD_REG_W_1',
        type: E_FIELD_TYPE.select,
        title: '',
        default: null,
        dict: {
            dictId: 'DEPARTMENT',
            dictKey: 'ISN_NODE',
            dictKeyTitle: 'CARD_NAME',
            criteries: { CARD_FLAG: '1', DELETED: '0', },
        }
    }, {
        key: 'ISN_CARD_REG_W_2',
        type: E_FIELD_TYPE.select,
        title: '',
        default: null,
        dict: {
            dictId: 'DEPARTMENT',
            dictKey: 'ISN_NODE',
            dictKeyTitle: 'CARD_NAME',
            criteries: { CARD_FLAG: '1', DELETED: '0', },
        }

    }

];

export const RKFilesConstraintsFields: string[] = [
    'EXTENSIONS',
    'MAX_SIZE',
    'ONE_FILE',
];

export const RKFilesConstraints: TDefaultField[] = [
    {
        key: 'DOC_RC.EXTENSIONS',
        type: E_FIELD_TYPE.string,
        title: 'С расширением',
    }, {
        key: 'DOC_RC.MAX_SIZE',
        type: E_FIELD_TYPE.numberIncrement,
        title: '',
    }, {
        key: 'DOC_RC.ONE_FILE',
        type: E_FIELD_TYPE.boolean,
        title: 'Один файл',
    }, {
        key: 'PRJ_RC.EXTENSIONS',
        type: E_FIELD_TYPE.string,
        title: 'С расширением',
    }, {
        key: 'PRJ_RC.MAX_SIZE',
        type: E_FIELD_TYPE.numberIncrement,
        title: '',
    }, {
        key: 'PRJ_RC.ONE_FILE',
        type: E_FIELD_TYPE.boolean,
        title: 'Один файл',
    }, {
        key: 'PRJ_VISA_SIGN.EXTENSIONS',
        type: E_FIELD_TYPE.string,
        title: 'С расширением',
    }, {
        key: 'PRJ_VISA_SIGN.MAX_SIZE',
        type: E_FIELD_TYPE.numberIncrement,
        title: '',
    }, {
        key: 'PRJ_VISA_SIGN.ONE_FILE',
        type: E_FIELD_TYPE.boolean,
        title: 'Один файл',
    }, {
        key: 'REPLY.EXTENSIONS',
        type: E_FIELD_TYPE.string,
        title: 'С расширением',
    }, {
        key: 'REPLY.MAX_SIZE',
        type: E_FIELD_TYPE.numberIncrement,
        title: '',
    }, {
        key: 'REPLY.ONE_FILE',
        type: E_FIELD_TYPE.boolean,
        title: 'Один файл',
    }, {
        key: 'RESOLUTION.EXTENSIONS',
        type: E_FIELD_TYPE.string,
        title: 'С расширением',
    }, {
        key: 'RESOLUTION.MAX_SIZE',
        type: E_FIELD_TYPE.numberIncrement,
        title: '',
    }, {
        key: 'RESOLUTION.ONE_FILE',
        type: E_FIELD_TYPE.boolean,
        title: 'Один файл',
    },
];

export const RKDefaultFields: TDefaultField[] = [
    {
        key: 'TERM_EXEC_TYPE',
        // Default type:  'D',
        type: E_FIELD_TYPE.numberIncrement,
        // kind_doc '1,2,3',
        title: ' Срок исполнения РК в каких днях',
        // classif_id: NULL
    }, {
        key: 'SND_M',
        // Default type:  'M',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '1,2,3',
        title: 'Адресаты',
        // classif_id: NULL
    }, {
        // Внешние адресаты - вид отправки
        key: 'SEND_ISN_DELIVERY',
        // Default type:  'D',
        type: E_FIELD_TYPE.select,
        // kind_doc '1,2,3',
        // title: 'Вид доставки',
        title: 'Вид отправки',
        // classif_id:  112
        dict: {
            dictId: 'DELIVERY_CL',
            dictKey: 'ISN_LCLASSIF',
            dictKeyTitle: 'CLASSIF_NAME',
        }
    }, {
        key: 'SECURLEVEL_M',
        // Default type:  'M',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '1,2,3',
        // title: 'Гриф доступа',
        title: 'Доступ',
        // classif_id: NULL
    }, {
        // Доступ
        key: 'SECURLEVEL',
        // Default type:  'D',
        type: E_FIELD_TYPE.select,
        // kind_doc '1,2,3',
        // title: 'Гриф доступа РК',
        title: 'Доступ',
        dict: {
            dictId: 'SECURITY_CL',
            dictKey: 'SECURLEVEL',
            dictKeyTitle: 'GRIF_NAME',
        }
        // classif_id:  111
        // справочник.
    }, {
        key: 'SECURLEVEL_FILE',
        // Default type:  'D',
        type: E_FIELD_TYPE.select,
        // kind_doc '1,2,3',
        // title: 'Гриф доступа файла РК',
        title: 'Доступ',
        dict: {
            dictId: 'SECURITY_CL',
            dictKey: 'SECURLEVEL',
            dictKeyTitle: 'GRIF_NAME',
            version: 1,
        }

        // classif_id:  111
    }, {
        key: 'DOC_DATE_M',
        // Default type:  'M',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '1,2,3',
        title: 'Дата регистрации',
        // classif_id: NULL
    }, {
        key: 'JOURNAL_ISN_NOMENC',
        // Default type:  'D',
        type: E_FIELD_TYPE.dictLink,
        // kind_doc '1,2,3',
        // title: 'Дело для записи в ЖПД',
        title: 'Списать в дело',
        dict: {
            dictId: 'NOMENKL_CL',
            dictKey: 'ISN_LCLASSIF',
            dictKeyTitle: 'CLASSIF_NAME',
            // criteries: { CLASSIF_ID: '104', ISN_LCLASSIF: '-99', },
        }


        // classif_id:  119
    }, {
        key: 'ISN_DELIVERY_M',
        // Default type:  'M',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '1,2',
        title: 'Доставка',
        // classif_id: NULL
    }, {
        key: 'ISN_DELIVERY',
        // Default type:  'D',
        type: E_FIELD_TYPE.select,
        // kind_doc '1,2',
        // title: 'Доставка РК',
        title: 'Доставка',
        // classif_id:  112
        dict: {
            dictId: 'DELIVERY_CL',
            dictKey: 'ISN_LCLASSIF',
            dictKeyTitle: 'CLASSIF_NAME',
        }
    }, {
        key: 'JOURNAL_FROM_FORWARD_W',
        // Default type:  'W',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '1,2,3',
        // title: 'Заполнение ЖПД по журналу пересылок РК',
        title: 'По значению Журнала пересылки РК',

        // classif_id: NULL
    }, {
        key: 'JOURNAL_FROM_WHO_W',
        // Default type:  'W',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '1,2',
        // title: 'Заполнение ЖПД по значению реквизита Кому',
        title: 'По значению реквизита "Кому" (адресован)',
        // classif_id: NULL
    }, {
        key: 'JOURNAL_ISN_NOMENC_W',
        // Default type:  'W',
        type: E_FIELD_TYPE.dictLink,
        // kind_doc '1,2,3',
        // title: 'Значение для записи для дела ЖПД',
        // classif_id:  119
        title: 'Списать в дело',
        dict: {
            dictId: 'NOMENKL_CL',
            dictKey: 'ISN_LCLASSIF',
            dictKeyTitle: 'CLASSIF_NAME',
            // criteries: { CLASSIF_ID: '104', ISN_LCLASSIF: '-99', },
        }

    }, {
        key: 'TERM_EXEC_W',
        // Default type:  'W',
        type: E_FIELD_TYPE.numberIncrement,
        // kind_doc '1,2,3',
        // title: 'Значение при записи для срока исполнения РК',
        title: 'Срок исп. (План. дата)',
        pattern: DIGIT3_PATTERN,
        minValue: 1,
        maxValue: 999,
        // classif_id: NULL
    }, {
        key: 'EXE_ISN_LIST',
        // Default type:  'D',
        type: E_FIELD_TYPE.numberIncrement,
        // kind_doc '3',
        title: 'Исполнители РК',
        // classif_id:  545
    }, {
        key: 'ISN_PERSON_EXE_M',
        // Default type:  'M',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '3',
        title: 'Исполнитель',
        // classif_id: NULL
    }, {
        key: 'ISN_CABINET_REG_M',
        // Default type:  'M',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '1,2,3',
        title: 'Кабинет регистрации',
        // classif_id: NULL
    }, {
        key: 'CARD_VISA_W',
        // Default type:  'W',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '3',
        // title: 'Картотека визажиста РК',
        title: 'По значению реквизита "Визы"'
        // classif_id: NULL
    }, {
        key: 'ISN_CARD_REG_FORWARD_W',
        // Default type:  'W',
        type: E_FIELD_TYPE.string,
        // kind_doc '1,2,3',
        title: 'Картотека ДЛ первой пересылки РК вкачестве картотеки регистрации',
        // classif_id: NULL
    }, {
        key: 'CARD_WHO_W',
        // Default type:  'W',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '1,2',
        // title: 'Картотека ДЛ получателя РК',
        title: 'по значению реквизита "Кому (адресован)'
        // classif_id: NULL
    }, {
        key: 'CARD_SIGN_W',
        // Default type:  'W',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '3',
        title: 'По значению реквизита "Подписал"'
        // title: 'Картотека ДЛ, подписавшего РК',
        // classif_id: NULL
    }, {
        key: 'CARD_EXEC_W',
        // Default type:  'W',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '3',
        // title: 'Картотека исполнителя РК',
        title: 'По значению реквизита "Исполнитель"'
        // classif_id: NULL
    }, {
        key: 'ISN_CARD_REG_M',
        // Default type:  'M',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '1,2,3',
        title: 'Картотека регистрации',
        // classif_id: NULL
    }, {
        key: 'DOCWHO_M',
        // Default type:  'M',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '1,2',
        // title: 'Кому',
        title: 'Кому адресован',
        // classif_id: NULL
    }, {
        key: 'CONTROL_STATE',
        // Default type:  'D',
        type: E_FIELD_TYPE.numberIncrement,
        // kind_doc '1,2,3',
        title: 'Контрольность РК',
        // classif_id: NULL
    }, {
        key: 'CORRESP_M',
        // Default type:  'M',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '1,2',
        title: 'Корреспондент',
        // classif_id: NULL
    }, {
        // с отметкой об отправке
        key: 'SEND_MARKSEND',
        // Default type:  'D',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '1,2,3',
        // title: 'Отметить отправку',
        title: 'с отметкой об отправке',
        // classif_id: NULL
    }, {
        // Внешние адресаты - с отметкой об отправке
        key: 'SEND_OUTER_MARKSEND',
        // Default type:  'D',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '1,2,3',
        // title: 'Отметить отправку',
        title: 'с отметкой об отправке',
        // classif_id: NULL
    }, {
        key: 'SEND_CB_SENDING_TYPE',
        // Default type:  'D',
        type: E_FIELD_TYPE.numberIncrement,
        // kind_doc '1,2,3',
        title: 'Отправка Цб через',
        // classif_id: NULL
    }, {
        key: 'SEND_DEP_DOC_PARM',
        // Default type:  'D',
        type: E_FIELD_TYPE.numberIncrement,
        // kind_doc '1,2,3',
        title: 'Параметр заполнения адресатов для всех док-тов/только с бум.оригиналом',
        // classif_id: NULL
    }, {
        key: 'JOURNAL_DOC_PARM',
        // Default type:  'D',
        type: E_FIELD_TYPE.numberIncrement,
        // kind_doc '1,2,3',
        title: 'Параметр заполнения жпд для всех док-тов/только с бум.оригиналом',
        // classif_id: NULL
    }, {
        key: 'JOURNAL_DOC_PARM_W',
        // Default type:  'W',
        type: E_FIELD_TYPE.string,
        // kind_doc '1,2,3',
        title: 'Параметр заполнения жпд для всех док-тов/только с бум.оригиналом',
        // classif_id: NULL
    }, {
        // Списать в дело радиобуттоны
        key: 'JOURNAL_NOMENC_PARM',
        // Default type:  'D',
        type: E_FIELD_TYPE.buttons,
        // kind_doc '1,2,3',
        title: 'Параметр копирования оригинал/копия',
        // classif_id: NULL
        options: [
            {
                value: '0',
                title: 'оригинал',
            }, {
                value: '1',
                title: 'копию',
            }, {
                value: '2',
                title: 'эл. экз',
            },
        ]
    }, {
        key: 'JOURNAL_NOMENC_PARM_W',
        // Default type:  'W',
        type: E_FIELD_TYPE.buttons,
        // kind_doc '1,2,3',
        title: 'Параметр копирования оригинал/копия',
        // classif_id: NULL
        options: [
            {
                value: '0',
                title: 'оригинал',
            }, {
                value: '1',
                title: 'копию',
            }, {
                value: '2',
                title: 'эл. экз',
            },
        ]
    }, {
        key: 'JOURNAL_PARM',
        // Default type:  'D',
        type: E_FIELD_TYPE.buttons,
        // kind_doc '1,2,3',
        title: 'Параметр копирования оригинал/копия',
        options: [
            {
                value: '0',
                title: 'оригинала',
            }, {
                value: '1',
                title: 'копии',
            }, {
                value: '2',
                title: 'первому оригинал, остальным копии',
            }, {
                value: '3',
                title: 'вручную',
            },
        ]
        // classif_id: NULL
    }, {
        key: 'JOURNAL_PARM_W',
        // Default type:  'W',
        type: E_FIELD_TYPE.buttons,
        // kind_doc '1,2,3',
        title: 'Параметр копирования оригинал/копия',
        // classif_id: NULL
        options: [
            {
                value: '0',
                title: 'оригинала',
            }, {
                value: '1',
                title: 'копии',
            }, {
                value: '2',
                title: 'первому оригинал, остальным копии',
            }, {
                value: '3',
                title: 'вручную',
            },
        ]
    }, {
        // Внутренние адресаты - радиобуттоны
        key: 'SEND_DEP_PARM',
        // Default type:  'D',
        type: E_FIELD_TYPE.buttons,
        // kind_doc '1,2,3',
        title: 'Параметр копирования оригинал/копия',
        options: [
            {
                value: '0',
                title: 'оригинал',
            }, {
                value: '1',
                title: 'копии',
            }, {
                value: '2',
                title: 'первому оригинал, остальным копии',
            }, {
                value: '3',
                title: 'эл. экз.',
            },
        ]
        // classif_id: NULL
    }, {
        key: 'JOURNAL_NOMENC_DOC_PARM',
        // Default type:  'D',
        type: E_FIELD_TYPE.numberIncrement,
        // kind_doc '1,2,3',
        title: 'Параметр списания в дело всех док-тов/только с бум.оригиналом/только без бум.оригинала',
        // classif_id: NULL
    }, {
        key: 'JOURNAL_NOMENC_DOC_PARM_W',
        // Default type:  'W',
        type: E_FIELD_TYPE.string,
        // kind_doc '1,2,3',
        title: 'Параметр списания в дело всех док-тов/только с бум.оригиналом/только без бум.оригинала',
        // classif_id: NULL
    }, {
        key: 'FORWARD_EXEC_W',
        // Default type:  'W',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '3',
        title: 'По значению реквизита "Исполнитель"'
        // title: 'Пересылка ДЛ исполнителю РК',
        // classif_id: NULL
    }, {
        key: 'FORWARD_SIGN_W',
        // Default type:  'W',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '3',
        title: 'По значению реквизита "Подписал"'
        // title: 'Пересылка ДЛ подписавшему РК',
        // classif_id: NULL
    }, {
        key: 'FORWARD_WHO_W',
        // Default type:  'W',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '1,2',
        // title: 'Пересылка ДЛ получателю РК',
        title: 'По значению реквизита "Кому" (адресован)',
        // classif_id: NULL
    }, {
        key: 'TERM_EXEC_M',
        // Default type:  'M',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '1,2,3',
        // title: 'Плановая дата',
        title: 'Срок исп. (План. дата)',
        // classif_id: NULL
    }, {
        key: 'DOCSIGN_M',
        // Default type:  'M',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '3',
        title: 'Подписал',
        // classif_id: NULL
    }, {
        key: 'FOLDER6_DEST_W',
        // Default type:  'W',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '1,2,3',
        // title: 'Положить в 6 папку текущего кабинета',
        title: '"В Дело"',
        // classif_id: NULL
    }, {
        key: 'FOLDER2_DEST_W',
        // Default type:  'W',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '1,2,3',
        // title: 'Положить во 2 папку текущего кабинета',
        title: '"На исполнение"',
        // classif_id: NULL
    }, {
        // Примечание
        key: 'NOTE',
        // Default type:  'D',
        type: E_FIELD_TYPE.text,
        // kind_doc '1,2,3',
        title: 'Примечание',
        length: 2000,
        // classif_id: NULL
    }, {
        key: 'FREE_NUM_M',
        // Default type:  'M',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '1,2,3',
        title: 'Рег. №',
        // classif_id: NULL
    }, {
        key: 'RUB_M',
        // Default type:  'M',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '1,2,3',
        title: 'Рубрики',
        // classif_id: NULL
    }, {
        key: 'ANNOTAT_M',
        // Default type:  'M',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '1,2,3',
        title: 'Содержание',
        // classif_id: NULL
    }, {
        key: 'ANNOTAT',
        // Default type:  'D',
        type: E_FIELD_TYPE.text,
        // kind_doc '1,2,3',
        // title: 'Содержание РК',
        title: 'Содержание',
        // classif_id: NULL
    }, {
        key: 'CONSISTS_M',
        // Default type:  'M',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '1,2,3',
        title: 'Состав',
        // classif_id: NULL
    }, {
        key: 'CONSISTS',
        // Default type:  'D',
        type: E_FIELD_TYPE.string,
        // kind_doc '1,2,3',
        title: 'Состав',
        value: '',

        // classif_id: NULL
    }, {
        // Внутренние адресаты - Адресаты
        key: 'SEND_ISN_LIST_DEP',
        // Default type:  'D',
        type: E_FIELD_TYPE.select,
        // kind_doc '1,2,3',
        // title: 'Список адресатов ДЛ',
        title: 'Адресаты',
        // classif_id:  545
        dict: {
            dictId: 'USER_LISTS',
            dictKey: 'ISN_LIST',
            dictKeyTitle: 'NAME',
            criteries: { CLASSIF_ID: '104', ISN_LCLASSIF: '-99', },
        }
    }, {
        // Внешние адресаты - Адресаты
        key: 'SEND_ISN_LIST_ORGANIZ',
        // Default type:  'D',
        type: E_FIELD_TYPE.select,
        // kind_doc '1,2,3',
        // title: 'Список адресатов организаций',
        title: 'Адресаты',
        // classif_id:  545
        dict: {
            dictId: 'USER_LISTS',
            dictKey: 'ISN_LIST',
            dictKeyTitle: 'NAME',
            criteries: { CLASSIF_ID: '630', ISN_LCLASSIF: '-99', },
        }
    }, {
        key: 'JOURNAL_WHERE_REDIRECTION_W',
        // Default type:  'W',
        type: E_FIELD_TYPE.select,
        // kind_doc '1,2,3',
        title: 'Список ДЛ  по которому будет производиться переадресация  в ЖПД',
        dict: {
            dictId: 'USER_LISTS',
            dictKey: 'ISN_LIST',
            dictKeyTitle: 'NAME',
            criteries: { CLASSIF_ID: '104', ISN_LCLASSIF: '-99', },
        }

        // classif_id: NULL
    }, {
        key: 'FORWARD_WHERE_REDIRECTION_W',
        // Default type:  'W',
        type: E_FIELD_TYPE.select,
        // kind_doc '1,2,3',
        title: 'Список ДЛ  по которому будетпроизводиться переадресация  при пересылке',
        // classif_id:  545
        dict: {
            dictId: 'USER_LISTS',
            dictKey: 'ISN_LIST',
            dictKeyTitle: 'NAME',
            criteries: { CLASSIF_ID: '104', ISN_LCLASSIF: '-99', },
        }
    }, {
        key: 'REF_FILE_ACCESS_LIST',
        // Default type:  'D',
        type: E_FIELD_TYPE.select,
        // kind_doc '1,2,3',
        title: 'Список ДЛ для доступа к файлу РК',
        // classif_id:  545
        dict: {
            dictId: 'USER_LISTS',
            dictKey: 'ISN_LIST',
            dictKeyTitle: 'NAME',
            criteries: { CLASSIF_ID: '104', ISN_LCLASSIF: '-99', },
        }
    }, {
        key: 'JOURNAL_WHO_EMPTY_W',
        // Default type:  'W',
        type: E_FIELD_TYPE.select,
        // kind_doc '1,2,3',
        title: 'Список ДЛ для ЖПД если поле "Кому" пусто',
        dict: {
            dictId: 'USER_LISTS',
            dictKey: 'ISN_LIST',
            dictKeyTitle: 'NAME',
            criteries: { CLASSIF_ID: '104', ISN_LCLASSIF: '-99', },
        }
        // classif_id:  545
    }, {
        key: 'JOURNAL_ISN_LIST',
        // Default type:  'D',
        type: E_FIELD_TYPE.select,
        // kind_doc '1,2,3',
        // title: 'Список ДЛ для записи в ЖПД',
        title: 'Отметка о передаче',
        // classif_id:  545
        dict: {
            dictId: 'USER_LISTS',
            dictKey: 'ISN_LIST',
            dictKeyTitle: 'NAME',
            criteries: { CLASSIF_ID: '104', ISN_LCLASSIF: '-99', },
        }

    }, {
        key: 'JOURNAL_ISN_LIST_W',
        // Default type:  'W',
        type: E_FIELD_TYPE.select,
        // kind_doc '1,2,3',
        title: 'Список ДЛ для записи в ЖПД при записи',
        dict: {
            dictId: 'USER_LISTS',
            dictKey: 'ISN_LIST',
            dictKeyTitle: 'NAME',
            criteries: { CLASSIF_ID: '104', ISN_LCLASSIF: '-99', },
        }
        // classif_id:  545
    }, {
        key: 'JOURNAL_WHO_REDIRECTION_W',
        // Default type:  'W',
        type: E_FIELD_TYPE.select,
        // kind_doc '1,2,3',
        title: 'Список ДЛ для которых должна быть применена переадресация в ЖПД',
        dict: {
            dictId: 'USER_LISTS',
            dictKey: 'ISN_LIST',
            dictKeyTitle: 'NAME',
            criteries: { CLASSIF_ID: '104', ISN_LCLASSIF: '-99', },
        }
        // classif_id:  545
    }, {
        key: 'FORWARD_WHO_REDIRECTION_W',
        // Default type:  'W',
        type: E_FIELD_TYPE.select,
        // kind_doc '1,2,3',
        title: 'Список ДЛ для которых должна быть применена переадресация при пересылке',
        // classif_id:  545
        dict: {
            dictId: 'USER_LISTS',
            dictKey: 'ISN_LIST',
            dictKeyTitle: 'NAME',
            criteries: { CLASSIF_ID: '104', ISN_LCLASSIF: '-99', },
        }
    }, {
        key: 'FORWARD_ISN_LIST_DEP_W',
        // Default type:  'W',
        type: E_FIELD_TYPE.select,
        // kind_doc '1,2,3',
        // title: 'Список ДЛ для пересылок',
        title: 'Переслать РК (Журнал пересылок РК)',
        dict: {
            dictId: 'USER_LISTS',
            dictKey: 'ISN_LIST',
            dictKeyTitle: 'NAME',
            criteries: { CLASSIF_ID: '104', ISN_LCLASSIF: '-99', },
        }

        // classif_id:  545
    }, {
        key: 'FORWARD_WHO_EMPTY_W',
        // Default type:  'W',
        type: E_FIELD_TYPE.select,
        // kind_doc '1,2,3',
        title: 'Список ДЛ для пересылок если поле "Кому" пусто',
        // classif_id:  545
        dict: {
            dictId: 'USER_LISTS',
            dictKey: 'ISN_LIST',
            dictKeyTitle: 'NAME',
            criteries: { CLASSIF_ID: '104', ISN_LCLASSIF: '-99', },
        }
    }, {
        key: 'SIGN_ISN_LIST',
        // Default type:  'D',
        type: E_FIELD_TYPE.numberIncrement,
        // kind_doc '3',
        title: 'Список подписывающих РК',
        // classif_id:  545
    }, {
        /* кому адресован */
        // select isn_list, name, all_flag, WEIGHT FROM user_lists where classif_id = 104 and isn_lclassif = -99 Order by user_lists.weight asc
        key: 'WHO_ISN_LIST',
        // Default type:  'D',
        type: E_FIELD_TYPE.select,
        // kind_doc '1,2',
        // title: 'Список получателей РК',
        title: 'Кому адресован',
        dict: {
            dictId: 'USER_LISTS',
            dictKey: 'ISN_LIST',
            dictKeyTitle: 'NAME',
            criteries: { CLASSIF_ID: '104', ISN_LCLASSIF: '-99', },

        }
        // classif_id:  545
    }, {
        // Рубрики
        key: 'RUBRIC_LIST',
        // Default type:  'D',
        type: E_FIELD_TYPE.select,
        // kind_doc '1,2,3',
        // title: 'Список рубрик',
        title: 'Рубрики',
        // classif_id:  545
    }, {
        key: 'TERM_EXEC',
        // Default type:  'D',
        type: E_FIELD_TYPE.numberIncrement,
        // kind_doc '1,2,3',
        title: 'Срок исполнения',
        pattern: DIGIT3_PATTERN,
        minValue: 1,
        maxValue: 999,
        // classif_id: NULL
    }, {
        key: 'ISN_CARD_REG_CURR_W',
        // Default type:  'W',
        type: E_FIELD_TYPE.string,
        // kind_doc '1,2,3',
        title: 'Текущая картотека в качестве картотеки регистрации',
        // classif_id: NULL
    }, {
        key: 'ISN_CABINET_REG_CURR_W',
        // Default type:  'W',
        type: E_FIELD_TYPE.buttons,
        // kind_doc '1,2,3',
        // title: 'Текущий  кабинет в качестве кабинета регистрации',
        // classif_id: NULL
        title: '',
        default: '1',
        options: [
            {
                value: '1',
                title: 'Текущий кабинет регистратора',
            } , {
                value: '0',
                title: 'Кабинет ДЛ первой пересылки РК',
            },
        ],
    }, {
        // Select ISN_TEMPLATE ISN, DESCRIPTION NAME, DELETED, WEIGHT From DOC_TEMPLATES Where LOWER(CATEGORY) LIKE 'файлы документов' Order By WEIGHT
        key: 'FILE',
        // Default type:  'D',
        type: E_FIELD_TYPE.select,
        // kind_doc '1,2,3',
        title: 'Файлы',
        dict: {
            dictId: 'DOC_TEMPLATES',
            dictKey: 'ISN_TEMPLATE',
            dictKeyTitle: 'DESCRIPTION',
            criteries: { CATEGORY: '%файлы документов%'}
        }
        // classif_id: NULL
    }, {
        key: 'FILE_M',
        // Default type:  'M',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '1,2,3',
        title: 'Файлы',
        // classif_id: NULL
    }, {
        key: 'CARD_ISN_W',
        // Default type:  'W',
        type: E_FIELD_TYPE.select,
        // kind_doc '1,2,3',
        // title: 'Фиксированная картотека',
        title: '',
        // classif_id:  104
        dict: {
            dictId: 'DEPARTMENT',
            dictKey: 'ISN_NODE',
            dictKeyTitle: 'CARD_NAME',
            criteries: { CARD_FLAG: '1', DELETED: '0', },
        }
    }, {
        key: 'ISN_CARD_REG_W',
        // Default type:  'W',
        type: E_FIELD_TYPE.select,
        // kind_doc '1,2,3',
        title: 'Фиксированная картотека для записи в качестве картотеки регистрации',
        dict: {
            dictId: 'DEPARTMENT',
            dictKey: 'ISN_NODE',
            dictKeyTitle: 'CARD_NAME',
            criteries: { CARD_FLAG: '1', DELETED: '0', },
        }
        // classif_id:  104
    }, {
        key: 'SPECIMEN',
        // Default type:  'D',
        type: E_FIELD_TYPE.string,
        // kind_doc '1,2,3',
        title: 'Экз №',
        pattern: DIGIT4_WITH_PERIOD_LIST_SEPARATED,
        length: 2000,
        // classif_id: NULL
    },

];
