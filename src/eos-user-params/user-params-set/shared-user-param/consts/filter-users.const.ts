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
                {value: '1', title: 'Блокирование пользователя'},
                {value: '2', title: 'Разблокирование пользователя'},
                {value: '3', title: 'Создание пользователя'},
                {value: '4', title: 'Редактирование пользователя БД'},
                {value: '5', title: 'Редактирование прав ДЕЛА'},
                {value: '6', title: 'Редактирование прав Поточного сканирования'},
                {value: '7', title: 'Удаление пользователя'},
            ]
        },
        {
            key: 'USEREDIT',
            title: 'ПОЛЬЗОВАТЕЛЬ:',
            type: 'string',
        },
        {
            key: 'USEREDITISN',
            title: 'ПОЛЬЗОВАТЕЛЬ:',
            type: 'string',
        },
        {
            key: 'USERWHO',
            title: 'РЕДАКТИРОВАЛ:',
            type: 'string',
        },
        {
            key: 'USERWHOISN',
            title: 'РЕДАКТИРОВАЛ:',
            type: 'string',
        }
    ],
};
