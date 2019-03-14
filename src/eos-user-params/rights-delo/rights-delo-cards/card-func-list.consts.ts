export const CARD_FUNC_LIST: ICardFuncList[] = [
    {
        key: 0,
        label: 'Регистрация документов',
    },
    {
        key: 1,
        label: 'Поиск документов',
    },
    {
        key: 2,
        label: 'Редактирование РК',
    },
    {
        key: 18,
        label: 'Редактирование доп.реквизитов',
    },
    {
        key: 19,
        label: 'Редактирование рубрик',
    },
    {
        key: 20,
        label: 'Редактирование связок',
    },
    {
        key: 3,
        label: 'Удаление РК',
    },
    {
        key: 4,
        label: 'Пересылка РК',
    },
    {
        key: 5,
        label: 'Получение отчетов',
    },
    {
        key: 6,
        label: 'Переотметка документов',
    },
    {
        key: 7,
        label: 'Списание документов в дело',
    },
    {
        key: 8,
        label: 'Отметка ознакомления',
    },
    {
        key: 9,
        label: 'Отправка по e-mail',
    },
    {
        key: 10,
        label: 'Отметка отправки документов',
    },
    {
        key: 11,
        label: 'Опись дел',
    },
    {
        key: 12,
        label: 'Добавлять файлы',
    },
    {
        key: 13,
        label: 'Читать файлы',
    },
    {
        key: 14,
        label: 'Редактировать файлы',
    },
    {
        key: 15,
        label: 'Удалять файлы',
    },
    {
        key: 16,
        label: 'Просмотр поручений',
    },
    {
        key: 17,
        label: 'Отправка сообщений СЭВ',
    }
];

export interface ICardFuncList {
    key: number;
    label: string;
}
