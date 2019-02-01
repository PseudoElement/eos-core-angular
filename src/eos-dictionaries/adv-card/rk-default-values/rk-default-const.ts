import { E_FIELD_TYPE } from './../../interfaces/dictionary.interfaces';


export const RKDefaultFields = [
    // {
    //     key: 'SPECIMEN',
    //     title: 'Экз №',
    //     value: '',
    //     type: E_FIELD_TYPE.numberIncrement,
    // },
    // {
    //     key: 'CONSISTS',
    //     title: 'Состав',
    //     value: '',
    //     type: E_FIELD_TYPE.string,
    // },
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
        type: E_FIELD_TYPE.string,
        // kind_doc '1,2,3',
        title: 'Адресаты',
        // classif_id: NULL
    }, {
        key: 'SEND_ISN_DELIVERY',
        // Default type:  'D',
        type: E_FIELD_TYPE.numberIncrement,
        // kind_doc '1,2,3',
        title: 'Вид доставки',
        // classif_id:  112
    }, {
        key: 'SECURLEVEL_M',
        // Default type:  'M',
        type: E_FIELD_TYPE.string,
        // kind_doc '1,2,3',
        title: 'Гриф доступа',
        // classif_id: NULL
    }, {
        key: 'SECURLEVEL',
        // Default type:  'D',
        type: E_FIELD_TYPE.numberIncrement,
        // kind_doc '1,2,3',
        title: 'Гриф доступа РК',
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
        type: E_FIELD_TYPE.string,
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
        type: E_FIELD_TYPE.string,
        // kind_doc '1,2',
        title: 'Доставка',
        // classif_id: NULL
    }, {
        key: 'ISN_DELIVERY',
        // Default type:  'D',
        type: E_FIELD_TYPE.numberIncrement,
        // kind_doc '1,2',
        title: 'Доставка РК',
        // classif_id:  112
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
        type: E_FIELD_TYPE.string,
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
        type: E_FIELD_TYPE.string,
        // kind_doc '1,2,3',
        title: 'Картотека регистрации',
        // classif_id: NULL
    }, {
        key: 'DOCWHO_M',
        // Default type:  'M',
        type: E_FIELD_TYPE.string,
        // kind_doc '1,2',
        title: 'Кому',
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
        type: E_FIELD_TYPE.string,
        // kind_doc '1,2',
        title: 'Корреспондент',
        // classif_id: NULL
    }, {
        key: 'SEND_MARKSEND',
        // Default type:  'D',
        type: E_FIELD_TYPE.numberIncrement,
        // kind_doc '1,2,3',
        title: 'Отметить отправку',
        // classif_id: NULL
    }, {
        key: 'SEND_OUTER_MARKSEND',
        // Default type:  'D',
        type: E_FIELD_TYPE.numberIncrement,
        // kind_doc '1,2,3',
        title: 'Отметить отправку',
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
        key: 'JOURNAL_NOMENC_PARM',
        // Default type:  'D',
        type: E_FIELD_TYPE.numberIncrement,
        // kind_doc '1,2,3',
        title: 'Параметр копирования оригинал/копия',
        // classif_id: NULL
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
        // classif_id: NULL
    }, {
        key: 'JOURNAL_PARM_W',
        // Default type:  'W',
        type: E_FIELD_TYPE.string,
        // kind_doc '1,2,3',
        title: 'Параметр копирования оригинал/копия',
        // classif_id: NULL
    }, {
        key: 'SEND_DEP_PARM',
        // Default type:  'D',
        type: E_FIELD_TYPE.numberIncrement,
        // kind_doc '1,2,3',
        title: 'Параметр копирования оригинал/копия',
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
        type: E_FIELD_TYPE.string,
        // kind_doc '1,2,3',
        title: 'Плановая дата',
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
        key: 'NOTE',
        // Default type:  'D',
        type: E_FIELD_TYPE.numberIncrement,
        // kind_doc '1,2,3',
        title: 'Примечание',
        // classif_id: NULL
    }, {
        key: 'FREE_NUM_M',
        // Default type:  'M',
        type: E_FIELD_TYPE.string,
        // kind_doc '1,2,3',
        title: 'Рег. №',
        // classif_id: NULL
    }, {
        key: 'RUB_M',
        // Default type:  'M',
        type: E_FIELD_TYPE.string,
        // kind_doc '1,2,3',
        title: 'Рубрики',
        // classif_id: NULL
    }, {
        key: 'ANNOTAT_M',
        // Default type:  'M',
        type: E_FIELD_TYPE.string,
        // kind_doc '1,2,3',
        title: 'Содержание',
        // classif_id: NULL
    }, {
        key: 'ANNOTAT',
        // Default type:  'D',
        type: E_FIELD_TYPE.numberIncrement,
        // kind_doc '1,2,3',
        title: 'Содержание РК',
        // classif_id: NULL
    }, {
        key: 'CONSISTS_M',
        // Default type:  'M',
        type: E_FIELD_TYPE.string,
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
        key: 'SEND_ISN_LIST_DEP',
        // Default type:  'D',
        type: E_FIELD_TYPE.numberIncrement,
        // kind_doc '1,2,3',
        title: 'Список адресатов ДЛ',
        // classif_id:  545
    }, {
        key: 'SEND_ISN_LIST_ORGANIZ',
        // Default type:  'D',
        type: E_FIELD_TYPE.numberIncrement,
        // kind_doc '1,2,3',
        title: 'Список адресатов организаций',
        // classif_id:  545
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
        type: E_FIELD_TYPE.numberIncrement,
        // kind_doc '1,2,3',
        title: 'Список ДЛ для записи в ЖПД',
        // classif_id:  545
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
        key: 'WHO_ISN_LIST',
        // Default type:  'D',
        type: E_FIELD_TYPE.numberIncrement,
        // kind_doc '1,2',
        title: 'Список получателей РК',
        // classif_id:  545
    }, {
        key: 'RUBRIC_LIST',
        // Default type:  'D',
        type: E_FIELD_TYPE.numberIncrement,
        // kind_doc '1,2,3',
        title: 'Список рубрик',
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
        key: 'FILE',
        // Default type:  'D',
        type: E_FIELD_TYPE.numberIncrement,
        // kind_doc '1,2,3',
        title: 'Файлы',
        // classif_id: NULL
    }, {
        key: 'FILE_M',
        // Default type:  'M',
        type: E_FIELD_TYPE.string,
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

