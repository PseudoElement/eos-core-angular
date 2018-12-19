import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';
import { E_RIGHT_DELO_ACCESS_CONTENT } from '../interfaces/right-delo.intefaces';
import { IInputParamControl } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { IOpenClassifParams } from 'eos-common/interfaces';

export const ABSOLUTE_RIGHTS: IInputParamControl[] = [
    {
        controlType: E_FIELD_TYPE.boolean,
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
        controlType: E_FIELD_TYPE.boolean,
        key: '2',
        label: 'Отправка документов по реестрам',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean, // этот параметр есть в деле, но нет в старом ПБ надзора
        key: '3',
        label: 'Просмотр всех поручений',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '4',
        label: 'Добавление поручений',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.department
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '5',
        label: 'Исполнение поручений или РКПД',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.department
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '6',
        label: 'Контроль исполнения поручений',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.department
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '7',
        label: 'Добавление организаций',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '8',
        label: 'Добавление граждан',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.all
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '9',
        label: 'Редактирование регистрационного номера РК',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '10',
        label: 'Визировать проекты',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.department
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '11',
        label: 'Подписывать проекты',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.department
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '12',
        label: 'Создвать НП',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.department
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '13',
        label: 'Редактировать с НП',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.department
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '15',
        label: 'Создавать системные запросы',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '16',
        label: 'Добавление обстоятельств дел',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '17',
        label: 'Редактирование обстоятельств дел',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '18',
        label: 'Групповое удаление РК',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '19',
        label: 'Управление подпиской на оповещения',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '20',
        label: 'Редактирование организаций',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.all
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '21',
        label: 'Редактирование граждан',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.all
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean, // отобразить чекбокс Разрешить операцию рассылки проекта резолюции
        key: '22',
        label: 'Добавление проектов резолюций',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.departmentCardAuthorSentProject
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '23',
        label: 'Чтение файлов во всех картотеках',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '24',
        label: 'Чтение конфиденциальных РК',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.department
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '25',
        label: 'Чтение конфиденциальных файлов',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '26',
        label: 'Право добавления резолюций не ограничено картотеками',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '27',
        label: 'Право добавления проектов резолюций не ограничено картотеками',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '28',
        label: 'Право добавления проектов документов',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.docGroup
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '29',
        label: 'Право "Выгрузка информации на ССТУ"',
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

export const OPEN_CLASSIF_DEPARTMENT_FOR_RIGHT: IOpenClassifParams = {
    classif: 'DEPARTMENT',
    return_due: true,
    // id: '0.',
    skipDeleted: true,
    selectMulty: false,
    selectLeafs: true,
    selectNodes: false,
};
