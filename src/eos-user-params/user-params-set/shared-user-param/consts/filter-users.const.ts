export const FILTER_PROTOCOL = {
    id: '',
    title: '',
    apiInstance: '',
    disabledFields: [
    ],
    fields: [
        {
            key: 'DATEFROM',
            type: 'date',
            title: 'С:'
        },
        {
            key: 'DATETO',
            type: 'date',
            title: 'По:'
        },
        {
            key: 'USEREVENTS',
            type: 'select',
            title: 'События:',
            options: [
                {value: '0', title: ''},
                {value: '1', title: 'Блокирование Пользователя'},
                {value: '2', title: 'Разблокирование Пользователя'},
                {value: '3', title: 'Создание пользователя'},
                {value: '4', title: 'Редактирование пользователя БД'},
                {value: '5', title: 'Редактирование прав ДЕЛА'},
                {value: '6', title: 'Редактирование прав поточного сканирования'},
                {value: '7', title: 'Удаление Пользователя'},
            ]
        },
        {
            key: 'USEREDIT',
            title: 'РЕДАКТИРОВАЛ:',
            type: 'string',
        },
        {
            key: 'USERWHO',
            title: 'Пользователь:',
            type: 'string',
        }
    ],
};
