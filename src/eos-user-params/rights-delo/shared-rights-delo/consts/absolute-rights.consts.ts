import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';
import { E_RIGHT_DELO_ACCESS_CONTENT } from '../interfaces/right-delo.intefaces';
import { IInputParamControl } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';

export const ABSOLUTE_RIGHTS: IInputParamControl[] = [
    {
        controlType: E_FIELD_TYPE.boolean, // 1
        key: '0',
        label: 'Системный технолог',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.classif
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '1',
        label: 'Поиск по всем картотекам',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean, // 3
        key: '3',
        label: 'Просмотр всех поручений',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean, // 4
        key: '4',
        label: 'Ввод резолюций',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.department
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean, // 5
        key: '26',
        label: 'Ввод резолюций не ограничен картотекой автора',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean, // отобразить чекбокс Разрешить операцию рассылки проекта резолюции
        key: '22',
        label: 'Ввод проектов резолюций',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.departmentCardAuthorSentProject
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean, // 7
        key: '27',
        label: 'Ввод проектов резолюций не ограничен картотекой автора',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean, // 8
        key: '5',
        label: 'Исполнение поручений',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.department
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean, // 9
        key: '6',
        label: 'Контроль исполнения поручений',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.department
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean, // 10
        key: '14',
        label: 'Установка на контроль',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean, // 11
        key: '7',
        label: 'Добавление организаций',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean, // 12
        key: '8',
        label: 'Редактирование организаций',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.all
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '20',
        label: 'Добавление граждан',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean, // 14
        key: '21',
        label: 'Редактирование граждан',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.all
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean, // 15
        key: '15',
        label: 'Создание системных запросов',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean, // 16
        key: '28',
        label: 'Создание РКПД',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.docGroup
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '10',
        label: 'Визирование проектов',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.department
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '11',
        label: 'Подписание проектов',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.department
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean, // 19
        key: '9',
        label: 'Редактирование регистрационного номера РК',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean, // 20
        key: '18',
        label: 'Групповое удаление РК',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean, // 21
        key: '23',
        label: 'Чтение файлов во всех картотеках',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean, // 22
        key: '24',
        label: 'Чтение РК персонального доступа',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.department
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean, // 23
        key: '25',
        label: 'Чтение файлов персонального доступа',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.department
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean, // 24
        key: '2',
        label: 'Отправка документов по реестрам',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean, // 25
        key: '30',
        label: 'Удаление реестров',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean, // 26
        key: '19',
        label: 'Управление подпиской на оповещения',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '12',
        label: 'Создание НП',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.department
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean, // 28
        key: '13',
        label: 'Работа с НП',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.department
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean, // 29
        key: '16',
        label: 'Добавление обстоятельств дел',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean, // 30
        key: '17',
        label: 'Редактирование обстоятельств дел',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean, // 31
        key: '29',
        label: 'Выгрузка информации на ССТУ',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
        }
    },
];

export const CONTROL_ALL_NOTALL: IInputParamControl = {
    controlType: E_FIELD_TYPE.radio,
    key: 'all',
    label: '',
    options: [
        {
            title: 'Всех реквизитов',
            value: '1'
        },
        {
            title: 'Не заполненных',
            value: '2'
        }
    ]
};
