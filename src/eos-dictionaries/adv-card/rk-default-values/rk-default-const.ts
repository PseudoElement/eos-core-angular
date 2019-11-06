import { E_FIELD_TYPE } from './../../interfaces/dictionary.interfaces';
import { DIGIT3_PATTERN, DIGIT4_WITH_PERIOD_LIST_SEPARATED } from 'eos-common/consts/common.consts';

export const USER_LIST_ORDERBY = 'WEIGHT';
export const DAYS_TYPE_OPTS_VARIATIONS = [
    {
        daysLabel: 'дней',
        options: [{
                value: '1',
                title: 'календарных',
            }, {
                value: '2',
                title: 'рабочих',
            },
        ]
    }, {
        daysLabel: 'день',
        options: [{
                value: '1',
                title: 'календарный',
            }, {
                value: '2',
                title: 'рабочий',
            },
        ]
    }, {
        daysLabel: 'дня',
        options: [{
                value: '1',
                title: 'календарных',
            }, {
                value: '2',
                title: 'рабочих',
            },
        ]
    },
];
export class TDFSelect {
    dictId: string;
    dictKey: string;
    dictKeyTitle: string;
    version?: any;
    criteries?: any;
    orderby?: string;
}
export class TDFSelectOption {
    value: any;
    title: string;
    disabled?: boolean;
    rec?: any;
    hasDeleted?: boolean;
    isEmpty?: boolean;
}

export class TDefaultField {
    key: string;
    type: E_FIELD_TYPE;
    page?: 'D' | 'M' | 'W' | 'Fict' | 'F';
    title: string;
    longTitle?: string; // Расширеное поле текстовое для случаев когда title один и тот же у разных полей
    dict?: TDFSelect;
    options?: TDFSelectOption[];
    pattern?: RegExp;
    value?: any;
    length?: number;
    minValue?: number;
    maxValue?: number;
    default?: any;
    order?: number;
}

export const RKFieldsFict: TDefaultField[] = [
    {
        key: 'helper1',
        type: E_FIELD_TYPE.boolean,
        title: '',
        page: 'Fict',
    },
];


export const RKFictControls: TDefaultField[] = [
    {
        key: 'KR_CURRENT',
        type: E_FIELD_TYPE.radio,
        title: 'Картотека Регистрации',
        page: 'Fict',
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
        page: 'Fict',
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
        type: E_FIELD_TYPE.dictLink,
        title: '',
        default: null,
        page: 'Fict',
        dict: {
            dictId: 'DEPARTMENT',
            dictKey: 'ISN_NODE',
            dictKeyTitle: 'CARD_NAME',
            criteries: { CARD_FLAG: '1', DELETED: '0', },
        }
    }, {
        key: 'ISN_CARD_REG_W_2',
        type: E_FIELD_TYPE.dictLink,
        title: '',
        default: null,
        page: 'Fict',
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

const FILE_SIZE_PATTERN = /^\d{0,8}$/;

export const RKFilesConstraints: TDefaultField[] = [
    {
        key: 'DOC_RC.EXTENSIONS',
        type: E_FIELD_TYPE.string,
        title: 'С расширением',
        length: 255,
        order: 3020,
    }, {
        key: 'DOC_RC.MAX_SIZE',
        type: E_FIELD_TYPE.numberIncrement,
        title: '',
        minValue: 1,
        maxValue: 99999999,
        pattern: FILE_SIZE_PATTERN,
        order: 3000,
    }, {
        key: 'DOC_RC.ONE_FILE',
        type: E_FIELD_TYPE.boolean,
        title: 'Один файл',
        order: 3010,
    }, {
        key: 'PRJ_RC.EXTENSIONS',
        type: E_FIELD_TYPE.string,
        title: 'С расширением',
        length: 255,
    }, {
        key: 'PRJ_RC.MAX_SIZE',
        type: E_FIELD_TYPE.numberIncrement,
        title: '',
        minValue: 1,
        maxValue: 99999999,
        pattern: FILE_SIZE_PATTERN,
    }, {
        key: 'PRJ_RC.ONE_FILE',
        type: E_FIELD_TYPE.boolean,
        title: 'Один файл',
    }, {
        key: 'PRJ_VISA_SIGN.EXTENSIONS',
        type: E_FIELD_TYPE.string,
        title: 'С расширением',
        length: 255,
    }, {
        key: 'PRJ_VISA_SIGN.MAX_SIZE',
        type: E_FIELD_TYPE.numberIncrement,
        title: '',
        minValue: 1,
        maxValue: 99999999,
        pattern: FILE_SIZE_PATTERN,
    }, {
        key: 'PRJ_VISA_SIGN.ONE_FILE',
        type: E_FIELD_TYPE.boolean,
        title: 'Один файл',
    }, {
        key: 'REPLY.EXTENSIONS',
        type: E_FIELD_TYPE.string,
        title: 'С расширением',
        length: 255,
    }, {
        key: 'REPLY.MAX_SIZE',
        type: E_FIELD_TYPE.numberIncrement,
        title: '',
        minValue: 1,
        maxValue: 99999999,
        pattern: FILE_SIZE_PATTERN,
        order: 3200,
    }, {
        key: 'REPLY.ONE_FILE',
        type: E_FIELD_TYPE.boolean,
        title: 'Один файл',
    }, {
        key: 'RESOLUTION.EXTENSIONS',
        type: E_FIELD_TYPE.string,
        title: 'С расширением',
        length: 255,
        order: 3120,
    }, {
        key: 'RESOLUTION.MAX_SIZE',
        type: E_FIELD_TYPE.numberIncrement,
        title: '',
        minValue: 1,
        maxValue: 99999999,
        pattern: FILE_SIZE_PATTERN,
        order: 3100,
    }, {
        key: 'RESOLUTION.ONE_FILE',
        type: E_FIELD_TYPE.boolean,
        title: 'Один файл',
        order: 3110,
    },
];

export const RKDefaultFields: TDefaultField[] = [
    {
        key: 'TERM_EXEC_TYPE',
        page: 'D',
        type: E_FIELD_TYPE.buttons,
        // kind_doc '1,2,3',
        // title: ' Срок исполнения РК в каких днях',
        title: 'от даты регистрации',
        order: 15,
        options: DAYS_TYPE_OPTS_VARIATIONS[0].options,
        default: '1',
        // classif_id: NULL
    }, {
        key: 'SND_M',
        page: 'M',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '1,2,3',
        title: 'Адресаты',
        order: 1110,
        // classif_id: NULL
    }, {
        // Внешние адресаты - вид отправки
        key: 'SEND_ISN_DELIVERY',
        page: 'D',
        type: E_FIELD_TYPE.select,
        // kind_doc '1,2,3',
        // title: 'Вид доставки',
        title: 'Вид отправки',
        order: 190,
        // classif_id:  112
        dict: {
            dictId: 'DELIVERY_CL',
            dictKey: 'ISN_LCLASSIF',
            dictKeyTitle: 'CLASSIF_NAME',
        }
    }, {
        key: 'SECURLEVEL_M',
        page: 'M',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '1,2,3',
        // title: 'Гриф доступа',
        title: 'Доступ',
        order: 1020,
        // classif_id: NULL
    }, {
        // Доступ
        key: 'SECURLEVEL',
        page: 'D',
        type: E_FIELD_TYPE.select,
        // kind_doc '1,2,3',
        // title: 'Гриф доступа РК',
        title: 'Доступ',
        dict: {
            dictId: 'SECURITY_CL',
            dictKey: 'SECURLEVEL',
            dictKeyTitle: 'GRIF_NAME',
        },
        order: 40,
        // classif_id:  111
        // справочник.
    }, {
        key: 'SECURLEVEL_FILE',
        page: 'F',
        type: E_FIELD_TYPE.select,
        // kind_doc '1,2,3',
        // title: 'Гриф доступа файла РК',
        longTitle: 'Доступ (Файлы)',
        title: 'Доступ',
        dict: {
            dictId: 'SECURITY_CL',
            dictKey: 'SECURLEVEL',
            dictKeyTitle: 'GRIF_NAME',
            version: 1,
        },
        order: 3300,

        // classif_id:  111
    }, {
        key: 'DOC_DATE_M',
        page: 'M',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '1,2,3',
        title: 'Дата регистрации',
        order: 1010,
        // classif_id: NULL
    }, {
        key: 'JOURNAL_ISN_NOMENC',
        page: 'D',
        type: E_FIELD_TYPE.dictLink,
        // kind_doc '1,2,3',
        // title: 'Дело для записи в ЖПД',
        title: 'Списать в дело',
        dict: {
            dictId: 'NOMENKL_CL',
            dictKey: 'ISN_LCLASSIF',
            dictKeyTitle: 'CLASSIF_NAME',
            // criteries: { CLASSIF_ID: '104', ISN_LCLASSIF: '-99', },
        },
        order: 130,
        // classif_id:  119
    }, {
        key: 'ISN_DELIVERY_M',
        page: 'M',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '1,2',
        title: 'Доставка',
        order: 1080,
        // classif_id: NULL
    }, {
        key: 'ISN_DELIVERY',
        page: 'D',
        type: E_FIELD_TYPE.select,
        // kind_doc '1,2',
        // title: 'Доставка РК',
        title: 'Доставка',
        // classif_id:  112
        dict: {
            dictId: 'DELIVERY_CL',
            dictKey: 'ISN_LCLASSIF',
            dictKeyTitle: 'CLASSIF_NAME',
        },
        order: 50,
    }, {
        key: 'JOURNAL_FROM_FORWARD_W',
        page: 'W',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '1,2,3',
        // title: 'Заполнение ЖПД по журналу пересылок РК',
        title: 'По значению Журнала пересылки РК',
        order: 2130,

        // classif_id: NULL
    }, {
        key: 'JOURNAL_FROM_WHO_W',
        page: 'W',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '1,2',
        // title: 'Заполнение ЖПД по значению реквизита Кому',
        title: 'По значению реквизита "Кому" (адресован)',
        order: 2090,
        // classif_id: NULL
    }, {
        key: 'JOURNAL_ISN_NOMENC_W',
        page: 'W',
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
        },
        order: 2180,

    }, {
        key: 'TERM_EXEC_W',
        page: 'W',
        type: E_FIELD_TYPE.numberIncrement,
        // kind_doc '1,2,3',
        // title: 'Значение при записи для срока исполнения РК',
        title: 'Срок исп. (План. дата)',
        pattern: DIGIT3_PATTERN,
        minValue: 1,
        maxValue: 999,
        order: 2000,
        // classif_id: NULL
    }, {
        key: 'EXE_ISN_LIST',
        page: 'D',
        type: E_FIELD_TYPE.select,
        // kind_doc '3',
        title: 'Исполнитель',
        dict: {
            dictId: 'USER_LISTS',
            dictKey: 'ISN_LIST',
            dictKeyTitle: 'NAME',
            criteries: { CLASSIF_ID: '104', ISN_LCLASSIF: '-99', },
            orderby: USER_LIST_ORDERBY,
        },
        order: 90,
        // title: 'Исполнители РК',
        // classif_id:  545
    }, {
        key: 'ISN_PERSON_EXE_M',
        page: 'M',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '3',
        title: 'Исполнитель',
        order: 1060,
        // classif_id: NULL
    }, {
        key: 'ISN_CABINET_REG_M',
        page: 'M',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '1,2,3',
        title: 'Кабинет регистрации',
        order: 1130,
        // classif_id: NULL
    }, {
        key: 'CARD_VISA_W',
        page: 'W',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '3',
        // title: 'Картотека визажиста РК',
        title: 'По значению реквизита "Визы"',
        order: 2250,
        // classif_id: NULL
    }, {
        key: 'ISN_CARD_REG_FORWARD_W',
        page: 'W',
        type: E_FIELD_TYPE.string,
        // kind_doc '1,2,3',
        title: 'Картотека ДЛ первой пересылки РК вкачестве картотеки регистрации',
        // classif_id: NULL
    }, {
        key: 'CARD_WHO_W',
        page: 'W',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '1,2',
        // title: 'Картотека ДЛ получателя РК',
        title: 'по значению реквизита "Кому (адресован)',
        order: 2220,
        // classif_id: NULL
    }, {
        key: 'CARD_SIGN_W',
        page: 'W',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '3',
        title: 'По значению реквизита "Подписал"',
        order: 2230,
        // title: 'Картотека ДЛ, подписавшего РК',
        // classif_id: NULL
    }, {
        key: 'CARD_EXEC_W',
        page: 'W',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '3',
        // title: 'Картотека исполнителя РК',
        title: 'По значению реквизита "Исполнитель"',
        order: 2240,
        // classif_id: NULL
    }, {
        key: 'ISN_CARD_REG_M',
        page: 'M',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '1,2,3',
        title: 'Картотека регистрации',
        order: 1120,
        // classif_id: NULL
    }, {
        key: 'DOCWHO_M',
        page: 'M',
        type: E_FIELD_TYPE.boolean,
        order: 1090,
        // kind_doc '1,2',
        // title: 'Кому',
        title: 'Кому адресован',
        // classif_id: NULL
    }, {
        key: 'CONTROL_STATE',
        page: 'D',
        type: E_FIELD_TYPE.numberIncrement,
        // kind_doc '1,2,3',
        title: 'Контрольность РК',
        // classif_id: NULL
    }, {
        key: 'CORRESP_M',
        page: 'M',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '1,2',
        title: 'Корреспондент',
        order: 1040,
        // classif_id: NULL
    }, {
        // с отметкой об отправке
        key: 'SEND_MARKSEND',
        page: 'D',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '1,2,3',
        // title: 'Отметить отправку',
        title: 'с отметкой об отправке',
        order: 160,
        // classif_id: NULL
    }, {
        // Внешние адресаты - с отметкой об отправке
        key: 'SEND_OUTER_MARKSEND',
        page: 'D',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '1,2,3',
        // title: 'Отметить отправку',
        title: 'с отметкой об отправке',
        order: 200,
        // classif_id: NULL
    }, {
        key: 'SEND_CB_SENDING_TYPE',
        page: 'D',
        type: E_FIELD_TYPE.numberIncrement,
        // kind_doc '1,2,3',
        title: 'Отправка Цб через',
        // classif_id: NULL
    }, {
        key: 'SEND_DEP_DOC_PARM',
        page: 'D',
        type: E_FIELD_TYPE.numberIncrement,
        // kind_doc '1,2,3',
        title: 'Параметр заполнения адресатов для всех док-тов/только с бум.оригиналом',
        // classif_id: NULL
    }, {
        key: 'JOURNAL_DOC_PARM',
        page: 'D',
        type: E_FIELD_TYPE.numberIncrement,
        // kind_doc '1,2,3',
        title: 'Параметр заполнения жпд для всех док-тов/только с бум.оригиналом',
        // classif_id: NULL
    }, {
        key: 'JOURNAL_DOC_PARM_W',
        page: 'W',
        type: E_FIELD_TYPE.string,
        // kind_doc '1,2,3',
        title: 'Параметр заполнения жпд для всех док-тов/только с бум.оригиналом',
        // classif_id: NULL
    }, {
        // Списать в дело радиобуттоны
        key: 'JOURNAL_NOMENC_PARM',
        page: 'D',
        type: E_FIELD_TYPE.buttons,
        // kind_doc '1,2,3',
        title: 'Параметр копирования оригинал/копия',
        order: 140,
        // classif_id: NULL
        options: [
            {
                value: '0',
                title: 'оригинал',
            }, {
                value: '1',
                title: 'копию',
            }, {
                value: '4',
                title: 'эл. экз',
            },
        ]
    }, {
        key: 'JOURNAL_NOMENC_PARM_W',
        page: 'W',
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
                value: '4',
                title: 'эл. экз',
            },
        ],
        order: 2190,
    }, {
        key: 'JOURNAL_PARM',
        page: 'D',
        type: E_FIELD_TYPE.buttons,
        // kind_doc '1,2,3',
        order: 120,
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
        page: 'W',
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
        ],
        order: 2140,
    }, {
        // Внутренние адресаты - радиобуттоны
        key: 'SEND_DEP_PARM',
        page: 'D',
        type: E_FIELD_TYPE.buttons,
        // kind_doc '1,2,3',
        order: 170,
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
        page: 'D',
        type: E_FIELD_TYPE.numberIncrement,
        // kind_doc '1,2,3',
        title: 'Параметр списания в дело всех док-тов/только с бум.оригиналом/только без бум.оригинала',
        // classif_id: NULL
    }, {
        key: 'JOURNAL_NOMENC_DOC_PARM_W',
        page: 'W',
        type: E_FIELD_TYPE.string,
        // kind_doc '1,2,3',
        title: 'Параметр списания в дело всех док-тов/только с бум.оригиналом/только без бум.оригинала',
        // classif_id: NULL
    }, {
        key: 'FORWARD_EXEC_W',
        page: 'W',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '3',
        title: 'По значению реквизита "Исполнитель"',
        order: 2070,
        // title: 'Пересылка ДЛ исполнителю РК',
        // classif_id: NULL
    }, {
        key: 'FORWARD_SIGN_W',
        page: 'W',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '3',
        title: 'По значению реквизита "Подписал"',
        order: 2060,
        // title: 'Пересылка ДЛ подписавшему РК',
        // classif_id: NULL
    }, {
        key: 'FORWARD_WHO_W',
        page: 'W',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '1,2',
        // title: 'Пересылка ДЛ получателю РК',
        title: 'По значению реквизита "Кому" (адресован)',
        order: 2020,
        // classif_id: NULL
    }, {
        key: 'TERM_EXEC_M',
        page: 'M',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '1,2,3',
        // title: 'Плановая дата',
        title: 'Срок исп. (План. дата)',
        order: 1030,
        // classif_id: NULL
    }, {
        key: 'DOCSIGN_M',
        page: 'M',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '3',
        title: 'Подписал',
        order: 1070,
        // classif_id: NULL
    }, {
        key: 'FOLDER6_DEST_W',
        page: 'W',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '1,2,3',
        // title: 'Положить в 6 папку текущего кабинета',
        title: '"В Дело"',
        order: 2270,
        // classif_id: NULL
    }, {
        key: 'FOLDER2_DEST_W',
        page: 'W',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '1,2,3',
        // title: 'Положить во 2 папку текущего кабинета',
        title: '"На исполнение"',
        order: 2260,
        // classif_id: NULL
    }, {
        // Примечание
        key: 'NOTE',
        page: 'D',
        type: E_FIELD_TYPE.text,
        // kind_doc '1,2,3',
        title: 'Примечание',
        length: 2000,
        order: 210,
        // classif_id: NULL
    }, {
        key: 'FREE_NUM_M',
        page: 'M',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '1,2,3',
        title: 'Рег. №',
        order: 1000,
        // classif_id: NULL
    }, {
        key: 'RUB_M',
        page: 'M',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '1,2,3',
        title: 'Рубрики',
        order: 1150,
        // classif_id: NULL
    }, {
        key: 'ANNOTAT_M',
        page: 'M',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '1,2,3',
        title: 'Содержание',
        order: 1100,
        // classif_id: NULL
    }, {
        key: 'ANNOTAT',
        page: 'D',
        type: E_FIELD_TYPE.text,
        // kind_doc '1,2,3',
        // title: 'Содержание РК',
        title: 'Содержание',
        length: 2000,
        order: 60,
        // classif_id: NULL
    }, {
        key: 'CONSISTS_M',
        page: 'M',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '1,2,3',
        title: 'Состав',
        order: 1050,
        // classif_id: NULL
    }, {
        key: 'CONSISTS',
        page: 'D',
        type: E_FIELD_TYPE.string,
        // kind_doc '1,2,3',
        title: 'Состав',
        length: 255,
        value: '',
        order: 20,
        // classif_id: NULL
    }, {
        // Внутренние адресаты - Адресаты
        key: 'SEND_ISN_LIST_DEP',
        page: 'D',
        type: E_FIELD_TYPE.select,
        // kind_doc '1,2,3',
        // title: 'Список адресатов ДЛ',
        title: 'Адресаты',
        longTitle: 'Внутренние адресаты',
        // classif_id:  545
        dict: {
            dictId: 'USER_LISTS',
            dictKey: 'ISN_LIST',
            dictKeyTitle: 'NAME',
            criteries: { CLASSIF_ID: '104', ISN_LCLASSIF: '-99', },
            orderby: USER_LIST_ORDERBY,
        },
        order: 150,
    }, {
        // Внешние адресаты - Адресаты
        key: 'SEND_ISN_LIST_ORGANIZ',
        page: 'D',
        type: E_FIELD_TYPE.select,
        // kind_doc '1,2,3',
        // title: 'Список адресатов организаций',
        title: 'Адресаты',
        longTitle: 'Внешние адресаты',
        order: 180,
        // classif_id:  545
        dict: {
            dictId: 'USER_LISTS',
            dictKey: 'ISN_LIST',
            dictKeyTitle: 'NAME',
            criteries: { CLASSIF_ID: '630', ISN_LCLASSIF: '-99', },
            orderby: USER_LIST_ORDERBY,
        }
    }, {
        key: 'JOURNAL_WHERE_REDIRECTION_W',
        page: 'W',
        type: E_FIELD_TYPE.select,
        // kind_doc '1,2,3',
        title: 'Список ДЛ  по которому будет производиться переадресация  в ЖПД',
        dict: {
            dictId: 'USER_LISTS',
            dictKey: 'ISN_LIST',
            dictKeyTitle: 'NAME',
            criteries: { CLASSIF_ID: '104', ISN_LCLASSIF: '-99', },
            orderby: USER_LIST_ORDERBY,
        },
        order: 2120,

        // classif_id: NULL
    }, {
        key: 'FORWARD_WHERE_REDIRECTION_W',
        page: 'W',
        type: E_FIELD_TYPE.select,
        // kind_doc '1,2,3',
        title: 'Список ДЛ  по которому будетпроизводиться переадресация  при пересылке',
        // classif_id:  545
        dict: {
            dictId: 'USER_LISTS',
            dictKey: 'ISN_LIST',
            dictKeyTitle: 'NAME',
            criteries: { CLASSIF_ID: '104', ISN_LCLASSIF: '-99', },
            orderby: USER_LIST_ORDERBY,
        },
        order: 2050,
    }, {
        key: 'REF_FILE_ACCESS_LIST',
        page: 'F',
        type: E_FIELD_TYPE.select,
        // kind_doc '1,2,3',
        title: 'Список ДЛ для доступа к файлу РК',
        // classif_id:  545
        dict: {
            dictId: 'USER_LISTS',
            dictKey: 'ISN_LIST',
            dictKeyTitle: 'NAME',
            criteries: { CLASSIF_ID: '104', ISN_LCLASSIF: '-99', },
            orderby: USER_LIST_ORDERBY,
        },
        order: 3310,
    }, {
        key: 'JOURNAL_WHO_EMPTY_W',
        page: 'W',
        type: E_FIELD_TYPE.select,
        // kind_doc '1,2,3',
        title: 'Список ДЛ для ЖПД если поле "Кому" пусто',
        dict: {
            dictId: 'USER_LISTS',
            dictKey: 'ISN_LIST',
            dictKeyTitle: 'NAME',
            criteries: { CLASSIF_ID: '104', ISN_LCLASSIF: '-99', },
            orderby: USER_LIST_ORDERBY,
        },
        order: 2100,
        // classif_id:  545
    }, {
        key: 'JOURNAL_ISN_LIST',
        page: 'D',
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
            orderby: USER_LIST_ORDERBY,
        },
        order: 110,

    }, {
        key: 'JOURNAL_ISN_LIST_W',
        page: 'W',
        type: E_FIELD_TYPE.select,
        // kind_doc '1,2,3',
        title: 'Список ДЛ для записи в ЖПД при записи',
        dict: {
            dictId: 'USER_LISTS',
            dictKey: 'ISN_LIST',
            dictKeyTitle: 'NAME',
            criteries: { CLASSIF_ID: '104', ISN_LCLASSIF: '-99', },
            orderby: USER_LIST_ORDERBY,
        },
        order: 2080,
        // classif_id:  545
    }, {
        key: 'JOURNAL_WHO_REDIRECTION_W',
        page: 'W',
        type: E_FIELD_TYPE.select,
        // kind_doc '1,2,3',
        title: 'Список ДЛ для которых должна быть применена переадресация в ЖПД',
        dict: {
            dictId: 'USER_LISTS',
            dictKey: 'ISN_LIST',
            dictKeyTitle: 'NAME',
            criteries: { CLASSIF_ID: '104', ISN_LCLASSIF: '-99', },
            orderby: USER_LIST_ORDERBY,
        },
        order: 2110,
        // classif_id:  545
    }, {
        key: 'FORWARD_WHO_REDIRECTION_W',
        page: 'W',
        type: E_FIELD_TYPE.select,
        // kind_doc '1,2,3',
        title: 'Список ДЛ для которых должна быть применена переадресация при пересылке',
        // classif_id:  545
        dict: {
            dictId: 'USER_LISTS',
            dictKey: 'ISN_LIST',
            dictKeyTitle: 'NAME',
            criteries: { CLASSIF_ID: '104', ISN_LCLASSIF: '-99', },
            orderby: USER_LIST_ORDERBY,
        },
        order: 2040,
    }, {
        key: 'FORWARD_ISN_LIST_DEP_W',
        page: 'W',
        type: E_FIELD_TYPE.select,
        // kind_doc '1,2,3',
        // title: 'Список ДЛ для пересылок',
        title: 'Переслать РК (Журнал пересылок РК)',
        dict: {
            dictId: 'USER_LISTS',
            dictKey: 'ISN_LIST',
            dictKeyTitle: 'NAME',
            criteries: { CLASSIF_ID: '104', ISN_LCLASSIF: '-99', },
            orderby: USER_LIST_ORDERBY,
        },
        order: 2010,

        // classif_id:  545
    }, {
        key: 'FORWARD_WHO_EMPTY_W',
        page: 'W',
        type: E_FIELD_TYPE.select,
        // kind_doc '1,2,3',
        title: 'Список ДЛ для пересылок если поле "Кому" пусто',
        // classif_id:  545
        dict: {
            dictId: 'USER_LISTS',
            dictKey: 'ISN_LIST',
            dictKeyTitle: 'NAME',
            criteries: { CLASSIF_ID: '104', ISN_LCLASSIF: '-99', },
            orderby: USER_LIST_ORDERBY,
        },
        order: 2030,
    }, {
        key: 'SIGN_ISN_LIST',
        page: 'D',
        type: E_FIELD_TYPE.select,
        title: 'Подписал',
        dict: {
            dictId: 'USER_LISTS',
            dictKey: 'ISN_LIST',
            dictKeyTitle: 'NAME',
            criteries: { CLASSIF_ID: '104', ISN_LCLASSIF: '-99', },
            orderby: USER_LIST_ORDERBY,
        },
        order: 80,
        // kind_doc '3',
        // title: 'Список подписывающих РК',
        // classif_id:  545
    }, {
        /* кому адресован */
        // select isn_list, name, all_flag, WEIGHT FROM user_lists where classif_id = 104 and isn_lclassif = -99 Order by user_lists.weight asc
        key: 'WHO_ISN_LIST',
        page: 'D',
        type: E_FIELD_TYPE.select,
        // kind_doc '1,2',
        // title: 'Список получателей РК',
        title: 'Кому адресован',
        dict: {
            dictId: 'USER_LISTS',
            dictKey: 'ISN_LIST',
            dictKeyTitle: 'NAME',
            criteries: { CLASSIF_ID: '104', ISN_LCLASSIF: '-99', },
            orderby: USER_LIST_ORDERBY,
        },
        order: 70,
        // classif_id:  545
    }, {
        // Рубрики
        key: 'RUBRIC_LIST',
        page: 'D',
        type: E_FIELD_TYPE.select,
        // kind_doc '1,2,3',
        // title: 'Список рубрик',
        title: 'Рубрики',
        order: 220,
        // classif_id:  545
        dict: {
            dictId: 'USER_LISTS',
            dictKey: 'ISN_LIST',
            dictKeyTitle: 'NAME',
            criteries: { CLASSIF_ID: '107', ISN_LCLASSIF: '-99', },
            orderby: USER_LIST_ORDERBY,
        }
    }, {
        key: 'TERM_EXEC',
        page: 'D',
        type: E_FIELD_TYPE.numberIncrement,
        // kind_doc '1,2,3',
        title: 'Срок исполнения',
        pattern: DIGIT3_PATTERN,
        minValue: 1,
        maxValue: 999,
        order: 30,
        // classif_id: NULL
    }, {
        key: 'ISN_CARD_REG_CURR_W',
        page: 'W',
        type: E_FIELD_TYPE.string,
        // kind_doc '1,2,3',
        title: 'Текущая картотека в качестве картотеки регистрации',
        // classif_id: NULL
    }, {
        key: 'ISN_CABINET_REG_CURR_W',
        page: 'W',
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
        order: 2200,
    }, {
        // Select ISN_TEMPLATE ISN, DESCRIPTION NAME, DELETED, WEIGHT From DOC_TEMPLATES Where LOWER(CATEGORY) LIKE 'файлы документов' Order By WEIGHT
        key: 'FILE',
        page: 'D',
        type: E_FIELD_TYPE.select,
        // kind_doc '1,2,3',
        title: 'Файлы',
        dict: {
            dictId: 'DOC_TEMPLATES',
            dictKey: 'ISN_TEMPLATE',
            dictKeyTitle: 'DESCRIPTION',
            criteries: { CATEGORY: '%файлы документов%'}
        },
        order: 100,
        // classif_id: NULL
    }, {
        key: 'FILE_M',
        page: 'M',
        type: E_FIELD_TYPE.boolean,
        // kind_doc '1,2,3',
        title: 'Файлы',
        order: 1140,
        // classif_id: NULL
    }, {
        key: 'CARD_ISN_W',
        page: 'W',
        type: E_FIELD_TYPE.dictLink,
        // kind_doc '1,2,3',
        // title: 'Фиксированная картотека',
        title: '',
        // classif_id:  104
        dict: {
            dictId: 'DEPARTMENT',
            dictKey: 'ISN_NODE',
            dictKeyTitle: 'CARD_NAME',
            criteries: { CARD_FLAG: '1', DELETED: '0', },
        },
        order: 2210,
    }, {
        key: 'ISN_CARD_REG_W',
        page: 'W',
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
        page: 'D',
        type: E_FIELD_TYPE.string,
        // kind_doc '1,2,3',
        title: 'Экз №',
        pattern: DIGIT4_WITH_PERIOD_LIST_SEPARATED,
        length: 2000,
        order: 10,
        // classif_id: NULL
    },

];
