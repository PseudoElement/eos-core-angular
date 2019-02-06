import { E_FIELD_TYPE } from './../../interfaces/dictionary.interfaces';

export class TDFSelect {
    dictId: string;
    dictKey: string;
    dictKeyTitle: string;
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
    value?: any;

}

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
        type: E_FIELD_TYPE.numberIncrement,
        // kind_doc '1,2,3',
        title: 'Гриф доступа файла РК',
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
        type: E_FIELD_TYPE.numberIncrement,
        // kind_doc '1,2,3',
        title: 'Дело для записи в ЖПД',
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
        type: E_FIELD_TYPE.string,
        // kind_doc '1,2,3',
        title: 'Заполнение ЖПД по журналу пересылок РК',
        // classif_id: NULL
    }, {
        key: 'JOURNAL_FROM_WHO_W',
        // Default type:  'W',
        type: E_FIELD_TYPE.string,
        // kind_doc '1,2',
        title: 'Заполнение ЖПД по значению реквизита Кому',
        // classif_id: NULL
    }, {
        key: 'JOURNAL_ISN_NOMENC_W',
        // Default type:  'W',
        type: E_FIELD_TYPE.string,
        // kind_doc '1,2,3',
        title: 'Значение для записи для дела ЖПД',
        // classif_id:  119
    }, {
        key: 'TERM_EXEC_W',
        // Default type:  'W',
        type: E_FIELD_TYPE.string,
        // kind_doc '1,2,3',
        title: 'Значение при записи для срока исполнения РК',
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
        type: E_FIELD_TYPE.string,
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
        type: E_FIELD_TYPE.string,
        // kind_doc '3',
        title: 'Картотека визажиста РК',
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
        type: E_FIELD_TYPE.string,
        // kind_doc '1,2',
        title: 'Картотека ДЛ получателя РК',
        // classif_id: NULL
    }, {
        key: 'CARD_SIGN_W',
        // Default type:  'W',
        type: E_FIELD_TYPE.string,
        // kind_doc '3',
        title: 'Картотека ДЛ, подписавшего РК',
        // classif_id: NULL
    }, {
        key: 'CARD_EXEC_W',
        // Default type:  'W',
        type: E_FIELD_TYPE.string,
        // kind_doc '3',
        title: 'Картотека исполнителя РК',
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
        type: E_FIELD_TYPE.string,
        // kind_doc '1,2,3',
        title: 'Параметр копирования оригинал/копия',
        // classif_id: NULL
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
        type: E_FIELD_TYPE.string,
        // kind_doc '1,2,3',
        title: 'Параметр копирования оригинал/копия',
        // classif_id: NULL
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
                title: 'ел. экз.',
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
        type: E_FIELD_TYPE.string,
        // kind_doc '3',
        title: 'Пересылка ДЛ исполнителю РК',
        // classif_id: NULL
    }, {
        key: 'FORWARD_SIGN_W',
        // Default type:  'W',
        type: E_FIELD_TYPE.string,
        // kind_doc '3',
        title: 'Пересылка ДЛ подписавшему РК',
        // classif_id: NULL
    }, {
        key: 'FORWARD_WHO_W',
        // Default type:  'W',
        type: E_FIELD_TYPE.string,
        // kind_doc '1,2',
        title: 'Пересылка ДЛ получателю РК',
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
        type: E_FIELD_TYPE.string,
        // kind_doc '3',
        title: 'Подписал',
        // classif_id: NULL
    }, {
        key: 'FOLDER6_DEST_W',
        // Default type:  'W',
        type: E_FIELD_TYPE.string,
        // kind_doc '1,2,3',
        title: 'Положить в 6 папку текущего кабинета',
        // classif_id: NULL
    }, {
        key: 'FOLDER2_DEST_W',
        // Default type:  'W',
        type: E_FIELD_TYPE.string,
        // kind_doc '1,2,3',
        title: 'Положить во 2 папку текущего кабинета',
        // classif_id: NULL
    }, {
        // Примечание
        key: 'NOTE',
        // Default type:  'D',
        type: E_FIELD_TYPE.text,
        // kind_doc '1,2,3',
        title: 'Примечание',
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
        type: E_FIELD_TYPE.string,
        // kind_doc '1,2,3',
        title: 'Список ДЛ  по которому будет производиться переадресация  в ЖПД',
        // classif_id: NULL
    }, {
        key: 'FORWARD_WHERE_REDIRECTION_W',
        // Default type:  'W',
        type: E_FIELD_TYPE.string,
        // kind_doc '1,2,3',
        title: 'Список ДЛ  по которому будетпроизводиться переадресация  при пересылке',
        // classif_id:  545
    }, {
        key: 'REF_FILE_ACCESS_LIST',
        // Default type:  'D',
        type: E_FIELD_TYPE.numberIncrement,
        // kind_doc '1,2,3',
        title: 'Список ДЛ для доступа к файлу РК',
        // classif_id:  545
    }, {
        key: 'JOURNAL_WHO_EMPTY_W',
        // Default type:  'W',
        type: E_FIELD_TYPE.string,
        // kind_doc '1,2,3',
        title: 'Список ДЛ для ЖПД если поле "Кому" пусто',
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
        type: E_FIELD_TYPE.string,
        // kind_doc '1,2,3',
        title: 'Список ДЛ для записи в ЖПД при записи',
        // classif_id:  545
    }, {
        key: 'JOURNAL_WHO_REDIRECTION_W',
        // Default type:  'W',
        type: E_FIELD_TYPE.string,
        // kind_doc '1,2,3',
        title: 'Список ДЛ для которых должна быть применена переадресация в ЖПД',
        // classif_id:  545
    }, {
        key: 'FORWARD_WHO_REDIRECTION_W',
        // Default type:  'W',
        type: E_FIELD_TYPE.string,
        // kind_doc '1,2,3',
        title: 'Список ДЛ для которых должна быть применена переадресация при пересылке',
        // classif_id:  545
    }, {
        key: 'FORWARD_ISN_LIST_DEP_W',
        // Default type:  'W',
        type: E_FIELD_TYPE.string,
        // kind_doc '1,2,3',
        title: 'Список ДЛ для пересылок',
        // classif_id:  545
    }, {
        key: 'FORWARD_WHO_EMPTY_W',
        // Default type:  'W',
        type: E_FIELD_TYPE.string,
        // kind_doc '1,2,3',
        title: 'Список ДЛ для пересылок если поле "Кому" пусто',
        // classif_id:  545
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
        type: E_FIELD_TYPE.string,
        // kind_doc '1,2,3',
        title: 'Текущий  кабинет в качестве кабинета регистрации',
        // classif_id: NULL
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
        type: E_FIELD_TYPE.string,
        // kind_doc '1,2,3',
        title: 'Фиксированная картотека',
        // classif_id:  104
    }, {
        key: 'ISN_CARD_REG_W',
        // Default type:  'W',
        type: E_FIELD_TYPE.string,
        // kind_doc '1,2,3',
        title: 'Фиксированная картотека для записи в качестве картотеки регистрации',
        // classif_id:  104
    }, {
        key: 'SPECIMEN',
        // Default type:  'D',
        type: E_FIELD_TYPE.numberIncrement,
        // kind_doc '1,2,3',
        title: 'Экз №',
        // classif_id: NULL
    },

];
// UPDATE doc_default_VALUE SET value = '555' WHERE default_id = 'SPECIMEN' AND isn_docgroup = 3670

// export const RKDefaultFields = {
//     rec: {
//         FIELD_1: {
//             label: 'Экз №',
//             value: '',
//             type: E_FIELD_TYPE.numberIncrement,
//             foreignKey: 'FIELD_1',
//         },
//     }

// };

