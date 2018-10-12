import { IBaseUsers } from '../../../shared/intrfaces/user-params.interfaces';

export const OTHER_USER: IBaseUsers = {
    id: 'other',
    title: 'Прочее',
    apiInstance: 'USER_PARMS',
    fields: [
        {
            key: 'SEND_DIALOG',
            type: 'radio',
            title: '',
            readonly: false,
            options: [
                {value: 'NO', title: 'Без диалога'},
                {value: 'YES', title: 'С диалогом'}
            ]
        },
        {
            key: 'DELFROMCAB',
            type: 'radio',
            title: '',
            readonly: false,
            options: [
                {value: '1', title: 'Нет'},
                {value: '0', title: 'Да'}
            ]
        },
        {
            key: 'MARKDOC',
            type: 'radio',
            title: '',
            readonly: false,
            options: [
                {value: '1', title: 'Не добавлять'},
                {value: '0', title: 'Для всех документов'},
                {value: '2', title: 'Только для документов с "бумажным" оригиналом'}
            ]
        },
        {
            key: 'MARKDOCKND',
            type: 'radio',
            title: '',
            readonly: false,
            options: [
                {value: '0', title: 'Оригинал(ы)'},
                {value: '1', title: 'Копию(и)'},
                {value: '2', title: 'Первому оригинал(ы), остальным копии'},
                {value: '3', title: 'Вручную'}
            ]
        },
        {
            key: 'RS_OUTER_DEFAULT_DELIVERY',
            type: 'select',
            title: '',
            options: [
                {value: 'NULL', title: ''},
                {value: '3774', title: 'Почта'},
                {value: '3776', title: 'Заказная почта'},
                {value: '3772', title: 'Нарочный'},
                {value: '3773', title: 'Курьер'},
                {value: '3775', title: 'Фельдсвязь'},
                {value: '1', title: 'E-MAIL'},
                {value: '3777', title: 'Телефонограмма'},
                {value: '3779', title: 'Спецсвязь'},
                {value: '3778', title: 'Факс'},
                {value: '2', title: 'СЭВ'},
                {value: '3', title: 'МЭДО'},
                {value: '4', title: 'VipNet'},
            ]
        },
        {
            key: 'MARKDOCKND1',
            type: 'radio',
            title: '',
            readonly: false,
            options: [
                {value: '0', title: 'Оригинал(ы)'},
                {value: '1', title: 'Копию(и)'},
                {value: '2', title: 'Первыму оригинал(ы), остальным копии'},
                {value: '3', title: 'Вручную'}
            ]
        },
        {
            key: 'GPD_FLAG',
            type: 'boolean',
            title: 'Использовать это правило в Журнале передачи документов'
        },
        {
            key: 'VOL_FLAG',
            type: 'boolean',
            title: 'Заполнять информацию о томах'
        },
        {
            key: 'CUR_CABINET',
            type: 'radio',
            title: '',
            readonly: false,
            options: [
                {value: '0', title: 'по записям текущей картотеки'},
                {value: '1', title: 'по записям текущего кабинета'}
            ]
        },
        {
            key: 'PARAM_WINDOW',
            type: 'boolean',
            title: 'Показывать окно изменения параметров реестра'
        },
        {
            key: 'SELECT_ITEMS',
            type: 'boolean',
            title: 'Давать возможность выбора записей для реестра'
        },
        {
            key: 'REESTR_ONE_TO_ONE',
            type: 'boolean',
            title: 'Каждый адресат в свой реестр'
        },
        {
            key: 'ORIG_FLAG',
            type: 'radio',
            title: '',
            readonly: false,
            options: [
                {value: '0', title: 'Оригиналам'},
                {value: '1', title: 'Копиям'},
                {value: '2', title: 'Всем'}
            ]
        },
        {
            key: 'REESTR_NOT_INCLUDED',
            type: 'boolean',
            title: 'Каждый адресат в свой реестр'
        },
        {
            key: 'REESTR_DATE_INTERVAL',
            type: 'numberIncrement',
            title: 'Дата передачи документов не позднее ( дней ):'
        },
        {
            key: 'REESTR_COPY_COUNT',
            type: 'numberIncrement',
            title: 'Количество копий:'
        },
        {
            key: 'REESTR_RESTRACTION_DOCGROUP',
            title: 'Ограничить группами документов',
            type: 'text',
            length: 255,
        },
      /*  {
            key: 'Опись дел',
            type: 'string',
            title: ''
        },*/
      /*  {
            key: '12_1',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_28',
            type: 'string',
            title: ''
        },
        {
            key: '12_56',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_2',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_29',
            type: 'string',
            title: ''
        },
        {
            key: '12_57',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_3',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_30',
            type: 'string',
            title: ''
        },
        {
            key: '12_58',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_4',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_31',
            type: 'string',
            title: ''
        },
        {
            key: '12_59',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_5',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_32',
            type: 'string',
            title: ''
        },
        {
            key: '12_60',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_6',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_33',
            type: 'string',
            title: ''
        },
        {
            key: '12_61',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_7',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_34',
            type: 'string',
            title: ''
        },
        {
            key: '12_62',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_8',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_35',
            type: 'string',
            title: ''
        },
        {
            key: '12_63',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_9',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_36',
            type: 'string',
            title: ''
        },
        {
            key: '12_64',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_10',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_37',
            type: 'string',
            title: ''
        },
        {
            key: '12_65',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_11',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_38',
            type: 'string',
            title: ''
        },
        {
            key: '12_66',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_12',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_39',
            type: 'string',
            title: ''
        },
        {
            key: '12_67',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_13',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_40',
            type: 'string',
            title: ''
        },
        {
            key: '12_68',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_14',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_41',
            type: 'string',
            title: ''
        },
        {
            key: '12_69',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_15',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_42',
            type: 'string',
            title: ''
        },
        {
            key: '12_70',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_16',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_43',
            type: 'string',
            title: ''
        },
        {
            key: '12_71',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_17',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_44',
            type: 'string',
            title: ''
        },
        {
            key: '12_72',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_18',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_45',
            type: 'string',
            title: ''
        },
        {
            key: '12_73',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_19',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_46',
            type: 'string',
            title: ''
        },
        {
            key: '12_74',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_20',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_47',
            type: 'string',
            title: ''
        },
        {
            key: '12_75',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_21',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_48',
            type: 'string',
            title: ''
        },
        {
            key: '12_76',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_22',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_49',
            type: 'string',
            title: ''
        },
        {
            key: '12_77',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_23',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_50',
            type: 'string',
            title: ''
        },
        {
            key: '12_78',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_24',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_51',
            type: 'string',
            title: ''
        },
        {
            key: '12_79',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_25',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_52',
            type: 'string',
            title: ''
        },
        {
            key: '12_80',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_26',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_53',
            type: 'string',
            title: ''

        },
        {
            key: '12_81',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_27',
            type: 'string',
            title: '',
            readonly: true
        },
        {
            key: '12_54',
            type: 'string',
            title: ''
        }*/
    ],
    fieldsTemplates: [
        {
            key: 'Опись дел',
            type: 'string',
            title: ''
        },
      /*  {
            key: '12_1',
            type: 'string',
            title: ''
        },
        {
            key: '12_28',
            type: 'string',
            title: ''
        },
        {
            key: '12_56',
            type: 'string',
            title: ''
        },
        {
            key: '12_2',
            type: 'string',
            title: ''
        },
        {
            key: '12_29',
            type: 'string',
            title: ''
        },
        {
            key: '12_57',
            type: 'string',
            title: ''
        },
        {
            key: '12_3',
            type: 'string',
            title: ''
        },
        {
            key: '12_30',
            type: 'string',
            title: ''
        },
        {
            key: '12_58',
            type: 'string',
            title: ''
        },
        {
            key: '12_4',
            type: 'string',
            title: ''
        },
        {
            key: '12_31',
            type: 'string',
            title: ''
        },
        {
            key: '12_59',
            type: 'string',
            title: ''
        },
        {
            key: '12_5',
            type: 'string',
            title: ''
        },
        {
            key: '12_32',
            type: 'string',
            title: ''
        },
        {
            key: '12_60',
            type: 'string',
            title: ''
        },
        {
            key: '12_6',
            type: 'string',
            title: ''
        },
        {
            key: '12_33',
            type: 'string',
            title: ''
        },
        {
            key: '12_61',
            type: 'string',
            title: ''
        },
        {
            key: '12_7',
            type: 'string',
            title: ''
        },
        {
            key: '12_34',
            type: 'string',
            title: ''
        },
        {
            key: '12_62',
            type: 'string',
            title: ''
        },
        {
            key: '12_8',
            type: 'string',
            title: ''
        },
        {
            key: '12_35',
            type: 'string',
            title: ''
        },
        {
            key: '12_63',
            type: 'string',
            title: ''
        },
        {
            key: '12_9',
            type: 'string',
            title: ''
        },
        {
            key: '12_36',
            type: 'string',
            title: ''
        },
        {
            key: '12_64',
            type: 'string',
            title: ''
        },
        {
            key: '12_10',
            type: 'string',
            title: ''
        },
        {
            key: '12_37',
            type: 'string',
            title: ''
        },
        {
            key: '12_65',
            type: 'string',
            title: ''
        },
        {
            key: '12_11',
            type: 'string',
            title: ''
        },
        {
            key: '12_38',
            type: 'string',
            title: ''
        },
        {
            key: '12_66',
            type: 'string',
            title: ''
        },
        {
            key: '12_12',
            type: 'string',
            title: ''
        },
        {
            key: '12_39',
            type: 'string',
            title: ''
        },
        {
            key: '12_67',
            type: 'string',
            title: ''
        },
        {
            key: '12_13',
            type: 'string',
            title: ''
        },
        {
            key: '12_40',
            type: 'string',
            title: ''
        },
        {
            key: '12_68',
            type: 'string',
            title: ''
        },
        {
            key: '12_14',
            type: 'string',
            title: ''
        },
        {
            key: '12_41',
            type: 'string',
            title: ''
        },
        {
            key: '12_69',
            type: 'string',
            title: ''
        },
        {
            key: '12_15',
            type: 'string',
            title: ''
        },
        {
            key: '12_42',
            type: 'string',
            title: ''
        },
        {
            key: '12_70',
            type: 'string',
            title: ''
        },
        {
            key: '12_16',
            type: 'string',
            title: ''
        },
        {
            key: '12_43',
            type: 'string',
            title: ''
        },
        {
            key: '12_71',
            type: 'string',
            title: ''
        },
        {
            key: '12_17',
            type: 'string',
            title: ''
        },
        {
            key: '12_44',
            type: 'string',
            title: ''
        },
        {
            key: '12_72',
            type: 'string',
            title: ''
        },
        {
            key: '12_18',
            type: 'string',
            title: ''
        },
        {
            key: '12_45',
            type: 'string',
            title: ''
        },
        {
            key: '12_73',
            type: 'string',
            title: ''
        },
        {
            key: '12_19',
            type: 'string',
            title: ''
        },
        {
            key: '12_46',
            type: 'string',
            title: ''
        },
        {
            key: '12_74',
            type: 'string',
            title: ''
        },
        {
            key: '12_20',
            type: 'string',
            title: ''
        },
        {
            key: '12_47',
            type: 'string',
            title: ''
        },
        {
            key: '12_75',
            type: 'string',
            title: ''
        },
        {
            key: '12_21',
            type: 'string',
            title: ''
        },
        {
            key: '12_48',
            type: 'string',
            title: ''
        },
        {
            key: '12_76',
            type: 'string',
            title: ''
        },
        {
            key: '12_22',
            type: 'string',
            title: ''
        },
        {
            key: '12_49',
            type: 'string',
            title: ''
        },
        {
            key: '12_77',
            type: 'string',
            title: ''
        },
        {
            key: '12_23',
            type: 'string',
            title: ''
        },
        {
            key: '12_50',
            type: 'string',
            title: ''
        },
        {
            key: '12_78',
            type: 'string',
            title: ''
        },
        {
            key: '12_24',
            type: 'string',
            title: ''
        },
        {
            key: '12_51',
            type: 'string',
            title: ''
        },
        {
            key: '12_79',
            type: 'string',
            title: ''
        },
        {
            key: '12_25',
            type: 'string',
            title: ''
        },
        {
            key: '12_52',
            type: 'string',
            title: ''
        },
        {
            key: '12_80',
            type: 'string',
            title: ''
        },
        {
            key: '12_26',
            type: 'string',
            title: ''
        },
        {
            key: '12_53',
            type: 'string',
            title: ''
        },
        {
            key: '12_81',
            type: 'string',
            title: ''
        },
        {
            key: '12_27',
            type: 'string',
            title: ''
        },
        {
            key: '12_54',
            type: 'string',
            title: ''
        }*/
    ]
};
