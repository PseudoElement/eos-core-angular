import { E_RIGHT_DELO_ACCESS_CONTENT } from './right-delo.intefaces';
import { IInputParamControl } from '../../../eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { E_FIELD_TYPE } from '../../../eos-dictionaries/interfaces';

export enum ETypeDeloRight {
    SystemTechnologist = '0', // Системный технолог
    SearchInAllFileCabinets = '1', // Поиск по всем картотекам
    SendingDocumentsToRegisters = '2', // Отправка документов по реестрам
    ViewAllOrders = '3', // Просмотр всех поручений
    EnteringResolutions = '4', // Ввод резолюций
    ExecutionOfOrders = '5', // Исполнение поручений
    OrderExecutionControl = '6', // Контроль исполнения поручений
    AddingOrganizations = '7', // Добавление организаций
    EditingOrganizationsAndCitizens = '8', // Редактирование организаций и граждан
    EditingRKData = '9', // Редактирование рег. данных РК
    ApprovalOfProjects = '10', // Визирование проектов
    ProjectSigning = '11', // Подписание проектов
    PuttingOnControl = '14', // Постановка на контроль
    CreatingSystemRequests = '15', // Создание системных запросов
    BulkDeletionOfAds = '18', // Групповое удаление РК
    AlertSubscriptionManagement = '19', // Управление подпиской на оповещения
    IntroductionOfDraftResolutions = '22', // Ввод проектов резолюций
    ReadingFilesInAllFileCabinets = '23', // Чтение файлов во всех картотеках
    ReadingRKpersonalizedAccess = '24', // Чтение РК персонифицированного доступа
    ReadingPersonalAccessFiles = '25', // Чтение файлов персонифицированного доступа
    CreationOfRKPD = '28', // Создание РКПД
    UploadingInformationToSSTU = '29', // Выгрузка информации на ССТУ
    ProjectExecution = '31', // Исполнение проектов
    ReadingProjects = '32', // Чтение проектов
    ReadingStrictAccessFiles = '33', // Чтение файлов строгого доступа
    ReadingEvents = '34', // Чтение событий
    WorkingWithEvents = '35', // Работа с событиями
}
export type TupeDeloRight = ETypeDeloRight;

export const ABSOLUTE_RIGHTS: IInputParamControl[] = [
    {
        controlType: E_FIELD_TYPE.boolean, // 1
        key: ETypeDeloRight.SystemTechnologist,
        label: 'Системный технолог',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.classif
        },
        useInProject: 'delo,nadzor'
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: ETypeDeloRight.SearchInAllFileCabinets,
        label: 'Поиск по всем картотекам',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
        },
        useInProject: 'delo,nadzor'
    },
    {
        controlType: E_FIELD_TYPE.boolean, // 24
        key: ETypeDeloRight.SendingDocumentsToRegisters,
        label: 'Отправка документов по реестрам',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.department
        },
        useInProject: 'delo,nadzor'
    },
    {
        controlType: E_FIELD_TYPE.boolean, // 3
        key: ETypeDeloRight.ViewAllOrders,
        label: 'Просмотр всех поручений',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
        },
        useInProject: 'delo,nadzor'
    },
    {
        controlType: E_FIELD_TYPE.boolean, // 4
        key: ETypeDeloRight.EnteringResolutions,
        label: 'Ввод резолюций',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.departOrganiz
        },
        viewToAuthorized: true,
        checkBoxAll: true,
        useInProject: 'delo,nadzor'
    },
    // {
    //     controlType: E_FIELD_TYPE.boolean, // 5
    //     key: '26',
    //     label: 'Ввод резолюций не ограничен картотекой автора',
    //     data: {
    //         isSelected: false,
    //         rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
    //     }
    // },
    {
        controlType: E_FIELD_TYPE.boolean, // отобразить чекбокс Разрешить операцию рассылки проекта резолюции
        key: ETypeDeloRight.IntroductionOfDraftResolutions,
        label: 'Ввод проектов резолюций',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.departmentCardAuthorSentProject
        },
        viewToAuthorized: true,
        checkBoxAll: true,
        useInProject: 'delo,nadzor'
    },
    // {
    //     controlType: E_FIELD_TYPE.boolean, // 7
    //     key: '27',
    //     label: 'Ввод проектов резолюций не ограничен картотекой автора',
    //     data: {
    //         isSelected: false,
    //         rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
    //     }
    // },
    {
        controlType: E_FIELD_TYPE.boolean, // 8
        key: ETypeDeloRight.ExecutionOfOrders,
        label: 'Исполнение поручений',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.departOrganiz
        },
        viewToAuthorized: true,
        useInProject: 'delo,nadzor'
    },
    {
        controlType: E_FIELD_TYPE.boolean, // 16
        key: ETypeDeloRight.CreationOfRKPD,
        label: 'Создание РКПД',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.docGroup
        },
        useInProject: 'delo,nadzor'
    },
    {
        controlType: E_FIELD_TYPE.boolean, // 9
        key: ETypeDeloRight.OrderExecutionControl,
        label: 'Контроль исполнения поручений',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.department
        },
        viewToAuthorized: true,
        useInProject: 'delo,nadzor'
    },
    {
        controlType: E_FIELD_TYPE.boolean, // 10
        key: ETypeDeloRight.PuttingOnControl,
        label: 'Постановка на контроль',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
        },
        useInProject: 'delo,nadzor'
    },
    {
        controlType: E_FIELD_TYPE.boolean, // 11
        key: ETypeDeloRight.AddingOrganizations,
        label: 'Добавление организаций и граждан',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
        },
        useInProject: 'delo,nadzor'
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: ETypeDeloRight.EditingOrganizationsAndCitizens,
        label: 'Редактирование организаций и граждан',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.all
        },
        useInProject: 'delo'
    },
    // {
    //     controlType: E_FIELD_TYPE.boolean,
    //     key: '20',
    //     label: 'Добавление граждан',
    //     data: {
    //         isSelected: false,
    //         rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
    //     },
    //     useInProject: 'delo,nadzor'
    // },
    // {
    //     controlType: E_FIELD_TYPE.boolean, // 14
    //     key: '21',
    //     label: 'Редактирование граждан',
    //     data: {
    //         isSelected: false,
    //         rightContent: E_RIGHT_DELO_ACCESS_CONTENT.all
    //     },
    //     useInProject: 'delo,nadzor'
    // },
    {
        controlType: E_FIELD_TYPE.boolean, // 15
        key: ETypeDeloRight.CreatingSystemRequests,
        label: 'Создание системных запросов',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
        },
        useInProject: 'delo,nadzor'
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: ETypeDeloRight.ApprovalOfProjects,
        label: 'Визирование проектов',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.departOrganiz
        },
        viewToAuthorized: true,
        useInProject: 'delo,nadzor'
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: ETypeDeloRight.ProjectSigning,
        label: 'Подписание проектов',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.departOrganiz
        },
        viewToAuthorized: true,
        useInProject: 'delo,nadzor'
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: ETypeDeloRight.ProjectExecution,
        label: 'Исполнение проектов',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.department
        },
        viewToAuthorized: true,
        useInProject: 'delo,nadzor'
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: ETypeDeloRight.ReadingProjects,
        label: 'Чтение проектов',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.department
        },
        viewToAuthorized: true,
        useInProject: 'delo,nadzor'
    },
    {
        controlType: E_FIELD_TYPE.boolean, // 19
        key: ETypeDeloRight.EditingRKData,
        label: 'Редактирование рег. данных РК',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
        },
        useInProject: 'delo,nadzor'
    },
    {
        controlType: E_FIELD_TYPE.boolean, // 20
        key: ETypeDeloRight.BulkDeletionOfAds,
        label: 'Групповое удаление РК',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
        },
        useInProject: 'delo,nadzor'
    },
    {
        controlType: E_FIELD_TYPE.boolean, // 21
        key: ETypeDeloRight.ReadingFilesInAllFileCabinets,
        label: 'Чтение файлов во всех картотеках',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none,
        },
        useInProject: 'delo,nadzor'
    },
    {
        controlType: E_FIELD_TYPE.boolean, // 22
        key: ETypeDeloRight.ReadingRKpersonalizedAccess,
        label: 'Чтение РК персонифицированного доступа',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.department,
            flagcheck: true,
        },
        viewToAuthorized: true,
        optionBtn: true,
        checkBoxAll: true,
        useInProject: 'delo,nadzor'
    },
    {
        controlType: E_FIELD_TYPE.boolean, // 26
        key: ETypeDeloRight.ReadingPersonalAccessFiles,
        label: 'Чтение файлов персонифицированного доступа',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.department,
            flagcheck: true,
        },
        viewToAuthorized: true,
        optionBtn: true,
        checkBoxAll: true,
        useInProject: 'delo,nadzor'
    },
    {
        controlType: E_FIELD_TYPE.boolean, // 34
        key: ETypeDeloRight.ReadingStrictAccessFiles,
        label: 'Чтение файлов строгого доступа',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.department,
            flagcheck: true,
        },
        viewToAuthorized: true,
        optionBtn: true,
        checkBoxAll: true,
        useInProject: 'delo,nadzor'
    },
    /* {
        controlType: E_FIELD_TYPE.boolean, // 24
        key: '2',
        label: 'Отправка документов по реестрам',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
        }
    }, */
    /* {
        controlType: E_FIELD_TYPE.boolean, // 25
        key: '30',
        label: 'Удаление реестров',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
        }
    }, */
    {
        controlType: E_FIELD_TYPE.boolean, // 26
        key: ETypeDeloRight.AlertSubscriptionManagement,
        label: 'Управление подпиской на оповещения',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
        },
        useInProject: 'delo,nadzor'
    },
    // {
    //     controlType: E_FIELD_TYPE.boolean,
    //     key: '12',
    //     label: 'Создание НП',
    //     data: {
    //         isSelected: false,
    //         rightContent: E_RIGHT_DELO_ACCESS_CONTENT.department
    //     }
    // },
    // {
    //     controlType: E_FIELD_TYPE.boolean, // 28
    //     key: '13',
    //     label: 'Работа с НП',
    //     data: {
    //         isSelected: false,
    //         rightContent: E_RIGHT_DELO_ACCESS_CONTENT.department
    //     }
    // },
    // {
    //     controlType: E_FIELD_TYPE.boolean, // 29
    //     key: '16',
    //     label: 'Добавление обстоятельств дел',
    //     data: {
    //         isSelected: false,
    //         rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
    //     }
    // },
    // {
    //     controlType: E_FIELD_TYPE.boolean, // 30
    //     key: '17',
    //     label: 'Редактирование обстоятельств дел',
    //     data: {
    //         isSelected: false,
    //         rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
    //     }
    // },
    {
        controlType: E_FIELD_TYPE.boolean, // 31
        key: ETypeDeloRight.UploadingInformationToSSTU,
        label: 'Выгрузка информации на ССТУ',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
        },
        useInProject: 'delo,nadzor'
    },
    {
        controlType: E_FIELD_TYPE.boolean, // 23
        key: ETypeDeloRight.ReadingEvents,
        label: 'Чтение событий',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.department,
            flagcheck: false,
        },
        viewToAuthorized: true,
        checkBoxAll: true,
        useInProject: 'delo'
    },
    {
        controlType: E_FIELD_TYPE.boolean, // 23
        key: ETypeDeloRight.WorkingWithEvents,
        label: 'Работа с событиями',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.department,
            flagcheck: false,
        },
        viewToAuthorized: true,
        checkBoxAll: true,
        onlyDL: true,
        useInProject: 'delo'
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

export const ABSOLUTE_RIGHTS_BTN_TABEL_SECOND = [
    {
        tooltip: 'Добавить',
        disable: false,
        iconActiv: 'eos-adm-icon-plus-blue',
        iconDisable: 'eos-adm-icon-plus-grey',
        id: 'add',
        children: [
            {
                title: 'Добавить ДЛ / Подразделение',
                disable: false,
                id: 'addDep'
            },
            {
                title: 'Добавить организацию',
                disable: false,
                id: 'addOrg'
            }
        ]
    },
    {
        tooltip: 'Удалить',
        disable: true,
        iconActiv: 'eos-adm-icon-bin-forever-blue',
        iconDisable: 'eos-adm-icon-bin-forever-grey',
        id: 'deleted'
    },
    
    {
        tooltip: 'Экспортировать',
        disable: false,
        iconActiv: 'eos-adm-icon-share-blue',
        iconDisable: 'eos-adm-icon-share-grey',
        id: 'export'
    },
    {
        tooltip: 'Сортировка',
        disable: false,
        iconActiv: 'eos-adm-icon-custom-list-blue',
        iconDisable: 'eos-adm-icon-custom-list-grey',
        activeIcon: 'eos-adm-icon-custom-list-white',
        id: 'sort'
    },
    {
        tooltip: 'Опустить строку',
        disable: false,
        iconActiv: 'eos-adm-icon-arrow-v-blue-bottom',
        iconDisable: 'eos-adm-icon-arrow-v-grey-bottom',
        activeIcon: 'eos-adm-icon-arrow-v-white-bottom',
        active: true,
        notView: true,
        id: 'down'
    },
    {
        tooltip: 'Поднять строку',
        disable: false,
        iconActiv: 'eos-adm-icon-arrow-v-blue-top',
        iconDisable: 'eos-adm-icon-arrow-v-grey-top',
        activeIcon: 'eos-adm-icon-arrow-v-white-top',
        active: true,
        notView: true,
        id: 'up'
    }
];
export const HTML_ABSOLUT_RIGH_TITLE = '$TITLE';
export const HTML_ABSOLUT_RIGH_HEADER = '$HEADERS';
export const HTML_ABSOLUT_ROW = '$ROW'
export const HTML_ABSOLUT_RIGH_DATE = '$DATA'
export const HTML_ABSOLUT_RIGHT_REPORT = `
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="utf-8">
    <title>$HTML_ABSOLUT_RIGH_TITLE</title>
    <style>
        table {
        margin: 1em;
        border: 1px solid black;
        border-collapse: collapse;
        }
        caption {
        font-size: 22px;
        font-weight: bold;
        }
        th {
        border: 1px solid black;
        font-size: 16px;
        padding: .5em;
        min-width: 100px;
        max-width: 400px;
        text-align: left;
        }
        td {
        border: 1px solid black;
        font-size: 16px;
        padding: .5em;
        min-width: 100px;
        max-width: 400px;
        word-wrap: break-word;
        }
        p {
            font-size: 14px;
            text-align: right;
        }
        /* прячем input checkbox */
        input[type="checkbox"] {
            display: none;
        }
        
        /* стили для метки */
        label {
            color: #000;
            cursor: default;
            font-weight: normal;
            line-height: 30px;
            padding: 10px 0;
            vertical-align: middle;
        }
        label:before {
            content: " ";
            color: #000;
            display: inline-block;
            font: 20px/30px Arial;
            margin-right: 15px;
            position: relative;
            text-align: center;
            text-indent: 0px;
            width: 15px;
            height: 15px;
            background: #FFF;
            border: 1px solid #e3e3e3;
            border-image: initial;
            vertical-align: middle;
        }
        input:checked + label:before {
            content:'\u2713';
            font-size: 15px;
            line-height: 15px;
            background: #2196f3 !important;
        }
        input:disabled + label:before {
            background: white;
            color: white;
            border-color: black;
        }
    </style>
    </head>
    <body>

    <table>
        <caption>
            ${HTML_ABSOLUT_RIGH_TITLE}
            <br>
            <p>
                <i>${HTML_ABSOLUT_RIGH_DATE}</i>
            </p>
        </caption>
        <tr>
        ${HTML_ABSOLUT_RIGH_HEADER}
        </tr>
        ${HTML_ABSOLUT_ROW}
    </table>
    </body>
    </html>
`;