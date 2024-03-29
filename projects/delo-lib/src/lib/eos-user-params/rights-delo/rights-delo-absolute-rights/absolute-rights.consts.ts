import { E_RIGHT_DELO_ACCESS_CONTENT } from './right-delo.intefaces';
import { IInputParamControl } from '../../../eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { E_FIELD_TYPE } from '../../../eos-dictionaries/interfaces';
import { DEPARTMENT, ORGANIZ_CL } from '../../../eos-rest';

export enum ETypeDeloRight {
    /** Системный технолог */
    SystemTechnologist = '0',
    /** Поиск по всем картотекам */
    SearchInAllFileCabinets = '1',
    /** Централизованная отправка документов */ 
    SendingDocumentsToRegisters = '2',
    /** Просмотр всех поручений */
    ViewAllOrders = '3',
    /** Ввод резолюций */
    EnteringResolutions = '4',
    /** Исполнение поручений */
    ExecutionOfOrders = '5',
    /** Контроль исполнения поручений */
    OrderExecutionControl = '6',
    /** Добавление организаций */
    AddingOrganizations = '7',
    /** Редактирование организаций и граждан */
    EditingOrganizationsAndCitizens = '8',
    /** Редактирование рег. данных РК */
    EditingRKData = '9',
    /** Визирование проектов */
    ApprovalOfProjects = '10',
    /** Подписание проектов */
    ProjectSigning = '11',
    /** Постановка на контроль */
    PuttingOnControl = '14',
    /** Создание системных запросов */
    CreatingSystemRequests = '15',
    /** Групповое удаление РК */
    BulkDeletionOfAds = '18',
    /** Управление подпиской на оповещения */
    AlertSubscriptionManagement = '19',
    /** Ввод проектов резолюций */ 
    IntroductionOfDraftResolutions = '22',
    /** Чтение файлов во всех картотеках */
    ReadingFilesInAllFileCabinets = '23',
    /** Чтение РК персонифицированного доступа */
    ReadingRKpersonalizedAccess = '24',
    /** Чтение файлов персонифицированного доступа */
    ReadingPersonalAccessFiles = '25',
    /** Создание РКПД */
    CreationOfRKPD = '28',
    /** Выгрузка информации на ССТУ */
    UploadingInformationToSSTU = '29',
    /** Исполнение проектов */
    ProjectExecution = '31',
    /** Чтение проектов */
    ReadingProjects = '32',
    /** Чтение файлов строгого доступа */
    ReadingStrictAccessFiles = '33',
    /** Чтение событий */
    ReadingEvents = '34',
    /** Работа с событиями */
    WorkingWithEvents = '35',
    Reporting = '36',
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
        label: 'Централизованная отправка документов',
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
        positionAuthorized: 3,
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
        positionAuthorized: 4,
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
        positionAuthorized: 5,
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
        positionAuthorized: 6,
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
        positionAuthorized: 7,
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
        positionAuthorized: 8,
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
        positionAuthorized: 9,
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
        positionAuthorized: 10,
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
        positionAuthorized: 0,
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
        positionAuthorized: 1,
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
        positionAuthorized: 2,
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
        positionAuthorized: 11,
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
        positionAuthorized: 12,
        viewToAuthorized: true,
        checkBoxAll: true,
        onlyDL: true,
        useInProject: 'delo'
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: ETypeDeloRight.Reporting,
        label: 'Получение отчетов',
        data: {
            isSelected: false,
            rightContent: E_RIGHT_DELO_ACCESS_CONTENT.srchGroup
        },
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
        tooltip: 'Поднять строку',
        disable: false,
        iconActiv: 'eos-adm-icon-arrow-v-blue-top',
        iconDisable: 'eos-adm-icon-arrow-v-grey-top',
        activeIcon: 'eos-adm-icon-arrow-v-white-top',
        active: true,
        notView: true,
        id: 'up'
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
export interface IAbsRightMapSet {
    newMapDep: string[];
    newMapOrg: string[];
    mapDep: Map<string, string>;
    mapOrg: Map<string, string>;
    mapDepInfo: Map<string, DEPARTMENT>;
    mapOrgInfo: Map<string, ORGANIZ_CL>;
    mapOrgWeight: any;
    mapDepWeight: any;
}
export enum ALL_MAP_TO_ABS_RIGHT {
    newMapDep = 'newMapDep', // тут храним все DUE подразделениq которые меня интересуют
    newMapOrg= 'newMapOrg',// тут храним все DUE организаций которые меня интересуют
    mapDep = 'mapDep', // сохраняем все FUNC_NUM
    mapOrg = 'mapOrg', // сохраняем все FUNC_NUM
    mapDepInfo = 'mapDepInfo', // сохраняем всю информацию
    mapOrgInfo = 'mapOrgInfo', // сохраняем всю информацию
    mapOrgWeight = 'mapOrgWeight', // сохраняем все веса организаций чтобы привести таблицу в норму
    mapDepWeight = 'mapDepWeight', // сохраняем все веса департаментов чтобы привести таблицу в норму
}
export enum EQueryPosition {
    department = 0,
    organiz = 1
}
