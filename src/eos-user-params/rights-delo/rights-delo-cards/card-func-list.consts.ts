import { E_CARD_RIGHT } from 'eos-rest/interfaces/rightName';

export interface ICardFuncList {
    funcNum: E_CARD_RIGHT;
    label: string;
    type: E_CARD_TYPE;
}

export enum E_CARD_TYPE {
    none,
    docGroup,
    docGroupWithoutLimit
}

export const CARD_FUNC_LIST: ICardFuncList[] = [
    {
        funcNum: E_CARD_RIGHT.REGDOC, /// 1 - регистрация документов
        label: 'Регистрация документов',
        type: E_CARD_TYPE.docGroup,
    },
    {
        funcNum: E_CARD_RIGHT.SEARCH, /// 2 - поиск документов
        label: 'Поиск документов',
        type: E_CARD_TYPE.none,
    },
    {
        funcNum: E_CARD_RIGHT.EDITRC, /// 3 - редактирование РК
        label: 'Редактирование РК',
        type: E_CARD_TYPE.docGroup,
    },
    {
        funcNum: E_CARD_RIGHT.EDIT_AR_RC_VALUE, /// 19 - Редактирование доп.реквизитов
        label: 'Редактирование доп.реквизитов',
        type: E_CARD_TYPE.docGroup,
    },
    {
        funcNum: E_CARD_RIGHT.EDIT_REF_RUBRIC, /// 20 - Редактирование рубрик
        label: 'Редактирование рубрик',
        type: E_CARD_TYPE.docGroup,
    },
    {
        funcNum: E_CARD_RIGHT.EDIT_REF_LINK, /// 21 - Редактирование связок
        label: 'Редактирование связок',
        type: E_CARD_TYPE.docGroup,
    },
    {
        funcNum: E_CARD_RIGHT.DELRC, /// 4 - удаление РК
        label: 'Удаление РК',
        type: E_CARD_TYPE.docGroup,
    },
    {
        funcNum: E_CARD_RIGHT.FORWARDRC, /// 5 - пересылка РК
        label: 'Пересылка РК',
        type: E_CARD_TYPE.none,
    },
    {
        funcNum: E_CARD_RIGHT.REPORTS, /// 6 - получение отчетов
        label: 'Получение отчетов',
        type: E_CARD_TYPE.none,
    },
    {
        funcNum: E_CARD_RIGHT.REMARKDOC, /// 7 - переотметка документов
        label: 'Переотметка документов',
        type: E_CARD_TYPE.none,
    },
    {
        funcNum: E_CARD_RIGHT.W_DELO, /// 8 - списание документов в дело
        label: 'Списание документов в дело',
        type: E_CARD_TYPE.none,
    },
    {
        funcNum: E_CARD_RIGHT.ACQUAINTANCERC, /// 9 - отметка ознакомления
        label: 'Отметка ознакомления',
        type: E_CARD_TYPE.none,
    },
    {
        funcNum: E_CARD_RIGHT.E_MAIL, /// 10 - отправка по e-mail
        label: 'Отправка по e-mail',
        type: E_CARD_TYPE.none,
    },
    {
        funcNum: E_CARD_RIGHT.MARKSEND, /// 11 - отметка отправки документов
        label: 'Отметка отправки документов',
        type: E_CARD_TYPE.none,
    },
    {
        funcNum: E_CARD_RIGHT.DEPOSIT, /// 12 - опись дел (подготовка дел к хранению)
        label: 'Опись дел',
        type: E_CARD_TYPE.none,
    },
    {
        funcNum: E_CARD_RIGHT.ADDFILES, /// 13 - добавлять файлы
        label: 'Добавлять файлы',
        type: E_CARD_TYPE.docGroup,
    },
    {
        funcNum: E_CARD_RIGHT.READFILES, /// 14 - читать файлы
        label: 'Читать файлы',
        type: E_CARD_TYPE.docGroup,
    },
    {
        funcNum: E_CARD_RIGHT.UPDFILES, /// 15 - редактировать файлы
        label: 'Редактировать файлы',
        type: E_CARD_TYPE.docGroup,
    },
    {
        funcNum: E_CARD_RIGHT.DELFILES, /// 16 - удалять файлы
        label: 'Удалять файлы',
        type: E_CARD_TYPE.docGroup,
    },
    {
        funcNum: E_CARD_RIGHT.VIEWRESOL, /// 17 - Просмотр поручений
        label: 'Просмотр поручений',
        type: E_CARD_TYPE.none,
    },
    {
        funcNum: E_CARD_RIGHT.SEVSEND, /// 18 - Сервер Электронного Взаимодействия
        label: 'Отправка сообщений СЭВ',
        type: E_CARD_TYPE.docGroupWithoutLimit,
    }
];
