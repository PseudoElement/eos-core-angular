import { IAction, E_RECORD_ACTIONS, E_ACTION_GROUPS, IActionChildren } from '../../eos-dictionaries/interfaces';
import { APS_DICT_GRANT } from '../../eos-dictionaries/services/eos-access-permissions.service';

export const enum EUserOrderPasteChildren {
    first = 0,
    last = 1,
    pred = 2,
    post = 3,
}

export const USER_ORDER_PASTE_CHILDREN: IActionChildren[] = [
    {
        title: 'Вставить в начало',
        iconClass: 'eos-adm-icon-arrow-v-start-blue',
        disabledIconClass: 'eos-adm-icon-arrow-v-start-grey',
        params: {'insertTo': 'first'},
        disabled: false
    },
    {
        title: 'Вставить в конец',
        iconClass: 'eos-adm-icon-arrow-v-end-blue',
        disabledIconClass: 'eos-adm-icon-arrow-v-end-grey',
        params: {'insertTo': 'last'},
        disabled: false
    },
    {
        title: 'Вставить до выбранной',
        iconClass: 'eos-adm-icon-checkbox-square-v-blue',
        disabledIconClass: 'eos-adm-icon-checkbox-square-v-grey',
        params: {'insertTo': 'pred'},
        disabled: false
    },
    {
        title: 'Вставить после выбранной',
        iconClass: 'eos-adm-icon-checkbox-square-v-blue',
        disabledIconClass: 'eos-adm-icon-checkbox-square-v-grey',
        params: {'insertTo': 'post'},
        disabled: false
    }
];

export const RECORD_ACTIONS_EDIT: IAction = {
    type: E_RECORD_ACTIONS.edit,
    group: E_ACTION_GROUPS.item,
    title: 'Редактировать',
    hint: 'Редактировать',
    iconClass: 'eos-adm-icon eos-adm-icon-edit-blue small',
    disabledIconClass: 'eos-adm-icon eos-adm-icon-edit-grey small',
    hoverIconClass: 'eos-adm-icon eos-adm-icon-edit-dark-blue small',
    activeIconClass: null,
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.readwrite,
};

const RECORD_ACTION_CREATE: IAction = {
    type: E_RECORD_ACTIONS.add,
    group: E_ACTION_GROUPS.common,
    title: 'Создать',
    hint: 'Создать',
    iconClass: 'eos-adm-icon eos-adm-icon-plus-blue small',
    disabledIconClass: 'eos-adm-icon eos-adm-icon-plus-grey small',
    activeIconClass: null,
    hoverIconClass: 'eos-adm-icon eos-adm-icon-plus-dark-blue small',
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.readwrite,
};

const RECORD_ACTION_ADVCARDRK: IAction = {
    type: E_RECORD_ACTIONS.AdvancedCardRK,
    group: E_ACTION_GROUPS.common,
    title: 'Заполнение реквизитов РК',
    hint: 'Заполнение реквизитов РК',
    iconClass: 'eos-adm-icon eos-adm-icon-property-edit-blue small',
    disabledIconClass: 'eos-adm-icon eos-adm-icon-property-edit-grey small',
    activeIconClass: '',
    hoverIconClass: 'eos-adm-icon eos-adm-icon-property-edit-blue small',
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.readwrite,
};

const RECORD_ACTION_LOGIC_DELETE: IAction = {
    type: E_RECORD_ACTIONS.remove,
    group: E_ACTION_GROUPS.group,
    title: 'Удалить логически',
    hint: 'Удалить логически',
    iconClass: 'eos-adm-icon eos-adm-icon-bin-blue small',
    disabledIconClass: 'eos-adm-icon eos-adm-icon-bin-grey small',
    activeIconClass: null,
    hoverIconClass: 'eos-adm-icon eos-adm-icon-bin-dark-blue small',
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.readwrite,
};

const RECORD_ACTION_SHOW_DELETE: IAction = {
    type: E_RECORD_ACTIONS.showDeleted,
    group: E_ACTION_GROUPS.group,
    title: 'Отображать логически удалённые',
    hint: 'Отображать логически удалённые',
    iconClass: 'eos-adm-icon eos-adm-icon-show-blue small',
    disabledIconClass: 'eos-adm-icon eos-adm-icon-show-grey small',
    activeIconClass: 'eos-adm-icon eos-adm-icon-show-white small',
    hoverIconClass: '',
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.read,
};

const RECORD_ACTION_USER_SORT: IAction = {
    type: E_RECORD_ACTIONS.userOrder,
    group: E_ACTION_GROUPS.group,
    title: 'Пользовательская сортировка',
    hint: 'Пользовательская сортировка',
    iconClass: 'eos-adm-icon eos-adm-icon-custom-list-blue small',
    disabledIconClass: 'eos-adm-icon eos-adm-icon-custom-list-grey small',
    activeIconClass: 'eos-adm-icon eos-adm-icon-custom-list-white small',
    hoverIconClass: 'eos-adm-icon eos-adm-icon-custom-list-white small',
    buttonClass: 'not-disable-color-user-sort',
    accessNeed: APS_DICT_GRANT.read,
};

const RECORD_ACTION_USER_SORT_CUT: IAction = {
    type: E_RECORD_ACTIONS.userOrderCut,
    group: E_ACTION_GROUPS.group,
    title: 'Вырезать',
    hint: 'Вырезать',
    iconClass: 'eos-adm-icon eos-adm-icon-scissors-blue small',
    disabledIconClass: 'eos-adm-icon eos-adm-icon-scissors-grey small',
    activeIconClass: 'eos-adm-icon eos-adm-icon-scissors-white small',
    hoverIconClass: 'eos-adm-icon eos-adm-icon-scissors-white small',
    buttonClass: 'not-disable-color',
    accessNeed: APS_DICT_GRANT.read,
};

const RECORD_ACTION_USER_SORT_PASTE: IAction = {
    type: E_RECORD_ACTIONS.userOrderPaste,
    group: E_ACTION_GROUPS.group,
    title: 'Вставить после выбранной',
    hint: 'Вставить после выбранной',
    iconClass: 'eos-adm-icon eos-adm-icon-paste-blue small',
    disabledIconClass: 'eos-adm-icon eos-adm-icon-paste-grey small',
    activeIconClass: 'eos-adm-icon eos-adm-icon-paste-white small',
    hoverIconClass: 'eos-adm-icon eos-adm-icon-paste-white small',
    buttonClass: 'not-disable-color',
    accessNeed: APS_DICT_GRANT.read,
    children: USER_ORDER_PASTE_CHILDREN
};

const RECORD_ACTION_TO_UP: IAction = {
    type: E_RECORD_ACTIONS.moveUp,
    group: E_ACTION_GROUPS.item,
    title: 'Поднять строку',
    hint: 'Поднять строку',
    iconClass: 'eos-adm-icon eos-adm-icon-arrow-v-blue-top small',
    disabledIconClass: 'eos-adm-icon eos-adm-icon-arrow-v-grey-top small',
    activeIconClass: 'eos-adm-icon eos-adm-icon-arrow-v-white-top small',
    hoverIconClass: 'eos-adm-icon eos-adm-icon-arrow-v-dark-blue-top small',
    buttonClass: 'not-disable-color',
    accessNeed: APS_DICT_GRANT.read,
};

const RECORD_ACTION_TO_DOWN: IAction = {
    type: E_RECORD_ACTIONS.moveDown,
    group: E_ACTION_GROUPS.item,
    title: 'Опустить строку',
    hint: 'Опустить строку',
    iconClass: 'eos-adm-icon eos-adm-icon-arrow-v-blue-bottom small',
    disabledIconClass: 'eos-adm-icon eos-adm-icon-arrow-v-grey-bottom small',
    activeIconClass: 'eos-adm-icon eos-adm-icon-arrow-v-white-bottom small',
    hoverIconClass: 'eos-adm-icon eos-adm-icon-arrow-v-dark-blue-bottom small',
    buttonClass: 'not-disable-color',
    accessNeed: APS_DICT_GRANT.read,
};

const RECORD_ACTION_SHOW_ALL_RECORDS: IAction = {
    type: E_RECORD_ACTIONS.showAllSubnodes,
    group: E_ACTION_GROUPS.common,
    title: 'Отобразить все дочерние записи единым списком',
    hint: 'Отобразить все дочерние записи единым списком',
    iconClass: 'eos-adm-icon eos-adm-icon-tree-blue small',
    disabledIconClass: 'eos-adm-icon eos-adm-icon-tree-grey small',
    activeIconClass: 'eos-adm-icon eos-adm-icon-tree-white small',
    hoverIconClass: '',
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.read,
};

const RECORD_ACTION_SHOW_SETTINGS: IAction = {
    type: E_RECORD_ACTIONS.tableCustomization,
    group: E_ACTION_GROUPS.common,
    title: 'Настройка отображения',
    hint: 'Настройка отображения',
    iconClass: 'eos-adm-icon eos-adm-icon-settings-blue small',
    disabledIconClass: '',
    activeIconClass: null,
    hoverIconClass: '',
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.read,
};

const RECORD_ACTION_RESTORE: IAction = {
    type: E_RECORD_ACTIONS.restore,
    group: E_ACTION_GROUPS.group,
    title: 'Восстановить',
    hint: 'Восстановить логически удаленные элементы',
    iconClass: 'eos-adm-icon eos-adm-icon-repair-blue small',
    disabledIconClass: 'eos-adm-icon eos-adm-icon-repair-grey small',
    activeIconClass: '',
    hoverIconClass: 'eos-adm-icon eos-adm-icon-repair-dark-blue small',
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.readwrite,
};

const RECORD_ACTION_DELETE_HARD: IAction = {
    type: E_RECORD_ACTIONS.removeHard,
    group: E_ACTION_GROUPS.group,
    title: 'Удалить навсегда',
    hint: 'Удалить навсегда',
    iconClass: 'eos-adm-icon eos-adm-icon-bin-forever-blue small',
    disabledIconClass: 'eos-adm-icon eos-adm-icon-bin-forever-grey small',
    activeIconClass: null,
    hoverIconClass: 'eos-adm-icon eos-adm-icon-bin-forever-dark-blue small',
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.readwrite,
};

const RECORD_ACTION_COUNTER_DEPARTMENT_MAIN: IAction = {
    type: E_RECORD_ACTIONS.counterDepartmentMain,
    group: E_ACTION_GROUPS.item,
    title: 'Главный счетчик номерообразования НП',
    hint: 'Главный счетчик номерообразования НП',
    iconClass: 'eos-adm-icon eos-adm-icon-counter-blue small',
    disabledIconClass: 'eos-adm-icon eos-adm-icon-counter-grey small',
    activeIconClass: null,
    hoverIconClass: 'eos-adm-icon eos-adm-icon-counter-blue small',
    buttonClass: null,
    iconText: 'НП',
    accessNeed: APS_DICT_GRANT.readwrite,
};

const RECORD_ACTION_COUNTER_DEPARTMENT: IAction = {
    type: E_RECORD_ACTIONS.counterDepartment,
    group: E_ACTION_GROUPS.item,
    title: 'Cчетчик номерообразования НП',
    hint: 'Cчетчик номерообразования НП',
    iconClass: 'eos-adm-icon eos-adm-icon-counter-blue small',
    disabledIconClass: 'eos-adm-icon eos-adm-icon-counter-grey small',
    activeIconClass: null,
    hoverIconClass: 'eos-adm-icon eos-adm-icon-counter-blue small',
    buttonClass: null,
    iconText: 'НП',
    accessNeed: APS_DICT_GRANT.readwrite,
};

const RECORD_ACTION_COUNTER_DOCGROUP: IAction = {
    type: E_RECORD_ACTIONS.counterDocgroup,
    group: E_ACTION_GROUPS.item,
    title: 'Cчетчик номерообразования РК',
    hint: 'Cчетчик номерообразования РК',
    iconClass: 'eos-adm-icon eos-adm-icon-counter-blue small',
    disabledIconClass: 'eos-adm-icon eos-adm-icon-counter-grey small',
    activeIconClass: null,
    hoverIconClass: 'eos-adm-icon eos-adm-icon-counter-blue small',
    buttonClass: null,
    iconText: 'РК',
    accessNeed: APS_DICT_GRANT.readwrite,
};

const RECORD_ACTION_COUNTER_DOCGROUP_RKPD: IAction = {
    type: E_RECORD_ACTIONS.counterDocgroupRKPD,
    group: E_ACTION_GROUPS.item,
    title: 'Cчетчик номерообразования РКПД',
    hint: 'Cчетчик номерообразования РКПД',
    iconClass: 'eos-adm-icon eos-adm-icon-counter-blue small',
    disabledIconClass: 'eos-adm-icon eos-adm-icon-counter-grey small',
    activeIconClass: null,
    hoverIconClass: 'eos-adm-icon eos-adm-icon-counter-blue small',
    buttonClass: null,
    iconText: 'РКПД',
    accessNeed: APS_DICT_GRANT.readwrite,
};

const RECORD_ACTION_COUNTER_DEPARTMENT_RK: IAction = {
    type: E_RECORD_ACTIONS.counterDepartmentRK,
    group: E_ACTION_GROUPS.item,
    title: 'Cчетчик номерообразования РК',
    hint: 'Cчетчик номерообразования РК',
    iconClass: 'eos-adm-icon eos-adm-icon-counter-blue small',
    disabledIconClass: 'eos-adm-icon eos-adm-icon-counter-grey small',
    activeIconClass: null,
    hoverIconClass: 'eos-adm-icon eos-adm-icon-counter-blue small',
    buttonClass: null,
    iconText: 'РК',
    accessNeed: APS_DICT_GRANT.readwrite,
};

const RECORD_ACTION_COUNTER_DEPARTMENT_RKPD: IAction = {
    type: E_RECORD_ACTIONS.counterDepartmentRKPD,
    group: E_ACTION_GROUPS.item,
    title: 'Cчетчик номерообразования РКПД',
    hint: 'Cчетчик номерообразования РКПД',
    iconClass: 'eos-adm-icon eos-adm-icon-counter-blue small',
    disabledIconClass: 'eos-adm-icon eos-adm-icon-counter-grey small',
    activeIconClass: null,
    hoverIconClass: 'eos-adm-icon eos-adm-icon-counter-blue small',
    buttonClass: null,
    iconText: 'РКПД',
    accessNeed: APS_DICT_GRANT.readwrite,
};

const RECORD_ACTION_NOMENKL_CLS: IAction = {
    type: E_RECORD_ACTIONS.CloseSelected,
    group: E_ACTION_GROUPS.item,
    title: 'Закрыть выделенные дела',
    hint: 'Закрыть выделенные дела',
    iconClass: 'eos-adm-icon eos-adm-icon-deal-close-blue small',
    disabledIconClass: 'eos-adm-icon eos-adm-icon-deal-close-grey small',
    activeIconClass: null,
    hoverIconClass: 'eos-adm-icon eos-adm-icon-deal-close-blue small',
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.readwrite,
};

const RECORD_ACTION_NOMENKL_OPS: IAction = {
    type: E_RECORD_ACTIONS.OpenSelected,
    group: E_ACTION_GROUPS.item,
    title: 'Открыть выделенные дела',
    hint: 'Открыть выделенные дела',
    iconClass: 'eos-adm-icon eos-adm-icon-deal-open-blue small',
    disabledIconClass: 'eos-adm-icon eos-adm-icon-deal-open-grey small',
    activeIconClass: null,
    hoverIconClass: 'eos-adm-icon eos-adm-icon-deal-open-blue small',
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.readwrite,
};

// const RECORD_ACTION_CREATE_ORGANISATION_AGENT: IAction = {
//     type: E_RECORD_ACTIONS.createRepresentative,
//     group: E_ACTION_GROUPS.group,
//     title: 'Создать представителя организации',
//     hint: 'Создать представителя организации',
//     iconClass: 'eos-adm-icon eos-adm-icon-avatar-blue small',
//     disabledIconClass: 'eos-adm-icon eos-adm-icon-avatar-grey small',
//     activeIconClass: null,
//     hoverIconClass: 'eos-adm-icon eos-adm-icon-avatar-dark-blue small',
//     buttonClass: null
// };

export const RECORD_ACTIONS_NAVIGATION_UP = {
    type: E_RECORD_ACTIONS.navigateUp,
    group: E_ACTION_GROUPS.item,
    title: null,
    hint: 'Предыдущая',
    iconClass: 'eos-adm-icon eos-adm-icon-arrow-v-blue-top small',
    disabledIconClass: 'eos-adm-icon eos-adm-icon-arrow-v-grey-top small',
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.read,
};

export const RECORD_ACTIONS_NAVIGATION_DOWN = {
    type: E_RECORD_ACTIONS.navigateDown,
    group: E_ACTION_GROUPS.item,
    title: null,
    hint: 'Следующая',
    iconClass: 'eos-adm-icon eos-adm-icon-arrow-v-blue-bottom small',
    disabledIconClass: 'eos-adm-icon eos-adm-icon-arrow-v-grey-bottom small',
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.read,
};

const RECORD_ACTIONS_ADDITIONAL_FIELDS: IAction = {
    type: E_RECORD_ACTIONS.additionalFields,
    group: E_ACTION_GROUPS.item,
    title: 'Дополнительные реквизиты',
    hint: 'Дополнительные реквизиты',
    iconClass: 'eos-adm-icon eos-adm-icon-property-extra-blue small',
    disabledIconClass: 'eos-adm-icon eos-adm-icon-property-extra-grey small',
    activeIconClass: '',
    hoverIconClass: 'eos-adm-icon eos-adm-icon-property-extra-blue small',
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.readwrite,
};

const RECORD_DETAILS_RKPD: IAction = {
    type: E_RECORD_ACTIONS.prjDefaultValues,
    group: E_ACTION_GROUPS.item,
    title: 'Заполнение реквизитов РКПД',
    hint: 'Заполнение реквизитов РКПД',
    iconClass: 'eos-adm-icon eos-adm-icon-property-edit-blue small',
    disabledIconClass: 'eos-adm-icon eos-adm-icon-property-edit-grey small',
    activeIconClass: '',
    hoverIconClass: 'eos-adm-icon eos-adm-icon-property-edit-blue small',
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.readwrite,
};

const RECORD_ACTION_IMPORT_DIRECTORY: IAction = {
    type: E_RECORD_ACTIONS.import,
    group: E_ACTION_GROUPS.common,
    title: 'Импорт справочника',
    hint: 'Импорт справочника',
    iconClass: 'eos-adm-icon eos-adm-icon-download small',
    disabledIconClass: 'eos-adm-icon eos-adm-icon-download-grey small',
    activeIconClass: '',
    hoverIconClass: 'eos-adm-icon eos-adm-icon-download-dark-blue small',
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.readwrite
};

const RECORD_ACTION_EXPORT_DIRECTORY: IAction = {
    type: E_RECORD_ACTIONS.export,
    group: E_ACTION_GROUPS.common,
    title: 'Экспорт справочника',
    hint: 'Экспорт справочника',
    iconClass: 'eos-adm-icon eos-adm-icon-share-blue small',
    disabledIconClass: 'eos-adm-icon eos-adm-icon-share-grey small',
    activeIconClass: '',
    hoverIconClass: 'eos-adm-icon eos-adm-icon-share-dark-blue small',
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.readwrite
};

const RECORD_COPY_PROPERTIES: IAction = {
    type: E_RECORD_ACTIONS.copyProperties,
    group: E_ACTION_GROUPS.item,
    title: 'Копировать свойства',
    hint: 'Копировать свойства',
    iconClass: 'eos-adm-icon eos-adm-icon-copy-blue small',
    disabledIconClass: 'eos-adm-icon eos-adm-icon-copy-grey small',
    activeIconClass: '',
    hoverIconClass: 'eos-adm-icon eos-adm-icon-copy-blue small',
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.readwrite,
};

const RECORD_COPY_PROPERTIES_FROM_PARRENT: IAction = {
    type: E_RECORD_ACTIONS.copyPropertiesFromParent,
    group: E_ACTION_GROUPS.item,
    title: 'Обновить свойства подчиненных групп документов',
    hint: 'Обновить свойства подчиненных групп документов',
    iconClass: 'eos-adm-icon eos-adm-icon-process-blue small',
    disabledIconClass: 'eos-adm-icon eos-adm-icon-process-grey small',
    activeIconClass: '',
    hoverIconClass: 'eos-adm-icon eos-adm-icon-process-blue small',
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.readwrite,
};

const RECORD_COPY_NODES: IAction = {
    type: E_RECORD_ACTIONS.copyNodes,
    group: E_ACTION_GROUPS.item,
    title: 'Копировать',
    hint: 'Копировать',
    iconClass: 'eos-adm-icon eos-adm-icon-copy-blue small',
    disabledIconClass: 'eos-adm-icon eos-adm-icon-copy-grey small',
    activeIconClass: '',
    hoverIconClass: 'eos-adm-icon eos-adm-icon-copy-blue small',
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.readwrite,
};

const RECORD_PASTE_NODES: IAction = {
    type: E_RECORD_ACTIONS.pasteNodes,
    group: E_ACTION_GROUPS.item,
    title: 'Вставить',
    hint: 'Вставить',
    iconClass: 'eos-adm-icon eos-adm-icon-paste-blue small',
    disabledIconClass: 'eos-adm-icon eos-adm-icon-paste-grey small',
    activeIconClass: '',
    hoverIconClass: 'eos-adm-icon eos-adm-icon-paste-blue small',
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.readwrite,
};

const RECORD_GOTO_CERTIFICATES: IAction = {
    type: E_RECORD_ACTIONS.certifUC,
    group: E_ACTION_GROUPS.item,
    title: 'Перечень корневых сертификатов УЦ по категориям ЭП',
    hint: 'Перечень корневых сертификатов УЦ по категориям ЭП',
    iconClass: 'eos-adm-icon eos-adm-icon-el-signature-uc-blue small',
    disabledIconClass: 'eos-adm-icon eos-adm-icon-el-signature-uc-grey small',
    activeIconClass: '',
    hoverIconClass: 'eos-adm-icon eos-adm-icon-el-signature-uc-blue small',
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.read,
};

export const RECORD_ACTIONS_DOWNLOAD_FILE: IAction = {
    type: E_RECORD_ACTIONS.downloadFile,
    group: E_ACTION_GROUPS.item,
    title: 'Выгрузить файл',
    hint: 'Выгрузить файл',
    iconClass: 'eos-adm-icon eos-adm-icon-download small',
    disabledIconClass: 'eos-adm-icon eos-adm-icon-download-grey small',
    hoverIconClass: 'eos-adm-icon eos-adm-icon-download-dark-blue small',
    activeIconClass: null,
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.readwrite,
};
const RECORD_CHECK_UNIQUE_INDEX: IAction = {
    type: E_RECORD_ACTIONS.uniqueIndexDel,
    group: E_ACTION_GROUPS.group,
    title: 'Проверка уникальности индексов',
    hint: 'Проверка уникальности индексов',
    iconClass: 'eos-adm-icon eos-adm-icon-check-uniq-index-blue small',
    disabledIconClass: 'eos-adm-icon eos-adm-icon-check-uniq-index-grey small',
    activeIconClass: 'eos-adm-icon eos-adm-icon-check-uniq-index-white small',
    hoverIconClass: 'eos-adm-icon eos-adm-icon-check-uniq-index-white small',
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.read,
};
const PRINT_NOMENKL: IAction = {
    type: E_RECORD_ACTIONS.printNomenc,
    group: E_ACTION_GROUPS.group,
    title: 'Печать',
    hint: 'Печать',
    iconClass: 'eos-adm-icon eos-adm-icon-print-blue small',
    disabledIconClass: 'eos-adm-icon eos-adm-icon-print-grey small',
    activeIconClass: 'eos-adm-icon eos-adm-icon-print-white small',
    hoverIconClass: 'eos-adm-icon eos-adm-icon-print-white small',
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.read,
};
export const RECORD_ACTIONS_IMPORT_EDS: IAction = {
    type: E_RECORD_ACTIONS.importEDS,
    group: E_ACTION_GROUPS.common,
    title: 'Загрузка списка сертификатов в категорию ЭП',
    hint: 'Загрузка списка сертификатов в категорию ЭП',
    iconClass: 'eos-adm-icon eos-adm-icon-el-signature-add-blue small',
    disabledIconClass: 'eos-adm-icon eos-adm-icon-el-signature-add-grey small',
    hoverIconClass: 'eos-adm-icon eos-adm-icon-el-signature-add-blue small',
    activeIconClass: null,
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.readwrite,
};
export const RECORD_ACTION_CUT: IAction = {
    type: E_RECORD_ACTIONS.cut,
    group: E_ACTION_GROUPS.common,
    title: 'Вырезать',
    hint: 'Вырезать',
    iconClass: 'eos-adm-icon eos-adm-icon-scissors-blue small',
    disabledIconClass: 'eos-adm-icon eos-adm-icon-scissors-grey small',
    hoverIconClass: 'eos-adm-icon eos-adm-icon-scissors-grey small',
    activeIconClass: null,
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.readwrite,
};
export const RECORD_ACTION_COMBINE: IAction = {
    type: E_RECORD_ACTIONS.combine,
    group: E_ACTION_GROUPS.common,
    title: 'Соединить',
    hint: 'Соединить',
    iconClass: 'eos-adm-icon eos-adm-icon-combine-blue small',
    disabledIconClass: 'eos-adm-icon eos-adm-icon-combine-grey small',
    hoverIconClass: 'eos-adm-icon eos-adm-icon-combine-grey small',
    activeIconClass: null,
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.readwrite,
};
export const RECORD_UNCHECK_NEW_ENTRY: IAction = {
    type: E_RECORD_ACTIONS.uncheckNewEntry,
    group: E_ACTION_GROUPS.common,
    title: 'Снять признак "Новая запись"',
    hint: 'Снять признак "Новая запись"',
    iconClass: 'eos-adm-icon eos-adm-icon-new-off-blue small',
    disabledIconClass: 'eos-adm-icon eos-adm-icon-new-off-grey small',
    hoverIconClass: 'eos-adm-icon eos-adm-icon-new-off-grey small',
    activeIconClass: null,
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.readwrite,
};

const RECORD_ACTIONS_DOP_REC: IAction = {
    type: E_RECORD_ACTIONS.dopRequisites,
    group: E_ACTION_GROUPS.item,
    title: 'Дополнительные реквизиты',
    hint: 'Дополнительные реквизиты',
    iconClass: 'eos-adm-icon eos-adm-icon-property-extra-blue small',
    disabledIconClass: 'eos-adm-icon eos-adm-icon-property-extra-grey small',
    activeIconClass: '',
    hoverIconClass: 'eos-adm-icon eos-adm-icon-property-extra-blue small',
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.readwrite,
};

const RECORD_ACTIONS_DEFAULT_COLLISION: IAction = {
    type: E_RECORD_ACTIONS.defaultCollision,
    group: E_ACTION_GROUPS.item,
    title: 'По умолчанию',
    hint: 'По умолчанию',
    iconClass: 'eos-adm-icon eos-adm-icon-default-settings-blue small',
    disabledIconClass: 'eos-adm-icon eos-adm-icon-default-settings-grey small',
    activeIconClass: '',
    hoverIconClass: 'eos-adm-icon eos-adm-icon-default-settings-blue small',
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.readwrite,
};

const RECORD_ACTIONS_PROTVIEW_SECURITY: IAction = {
    type: E_RECORD_ACTIONS.protViewSecurity,
    group: E_ACTION_GROUPS.item,
    title: 'Протокол изменений',
    hint: 'Протокол изменений',
    iconClass: 'eos-adm-icon eos-adm-icon-rules-blue small',
    disabledIconClass: 'eos-adm-icon eos-adm-icon-rules-grey small',
    activeIconClass: '',
    hoverIconClass: 'eos-adm-icon eos-adm-icon-rules-blue small',
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.readwrite,
};
export const RECORD_ACTION_PASTE: IAction = {
    type: E_RECORD_ACTIONS.paste,
    group: E_ACTION_GROUPS.common,
    title: 'Вставить',
    hint: 'Вставить',
    iconClass: 'eos-adm-icon eos-adm-icon-paste-blue small',
    disabledIconClass: 'eos-adm-icon eos-adm-icon-paste-grey small',
    hoverIconClass: 'eos-adm-icon eos-adm-icon-paste-grey small',
    activeIconClass: null,
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.readwrite,
};
export const RECORD_ACTION_COPY: IAction = {
    type: E_RECORD_ACTIONS.copy,
    group: E_ACTION_GROUPS.common,
    title: 'Копировать',
    hint: 'Копировать',
    iconClass: 'eos-adm-icon eos-adm-icon-copy-blue small',
    disabledIconClass: 'eos-adm-icon eos-adm-icon-copy-grey small',
    hoverIconClass: 'eos-adm-icon eos-adm-icon-copy-grey small',
    activeIconClass: null,
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.readwrite,
};

export const RECORD_ACTION_SEV_SYNC_DICTS: IAction = {
    type: E_RECORD_ACTIONS.sevSyncDicts,
    group: E_ACTION_GROUPS.item,
    title: 'Синхронизировать справочники',
    hint: 'Синхронизировать справочники',
    iconClass: 'eos-adm-icon eos-adm-icon-synchro-blue small',
    disabledIconClass: 'eos-adm-icon eos-adm-icon-synchro-grey small',
    hoverIconClass: 'eos-adm-icon eos-adm-icon-synchro-grey small',
    activeIconClass: null,
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.readwrite,
};

export const RECORD_ACTION_SEV_CLEAR_IDENTITY_CODES: IAction = {
    type: E_RECORD_ACTIONS.sevClearIdentityCodes,
    group: E_ACTION_GROUPS.item,
    title: 'Очистить коды синхронизации',
    hint: 'Очистить коды синхронизации',
    iconClass: 'eos-adm-icon eos-adm-icon-eraser-blue small',
    disabledIconClass: 'eos-adm-icon eos-adm-icon-eraser-grey small',
    hoverIconClass: 'eos-adm-icon eos-adm-icon-eraser-grey small',
    activeIconClass: null,
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.readwrite,
};


export const RENAME_BASE_DIRECTORY: IAction = {
    type: E_RECORD_ACTIONS.renameBaseDepartment,
    group: E_ACTION_GROUPS.group,
    title: 'Переименовать центральную картотеку',
    hint: 'Переименовать центральную картотеку',
    iconClass: 'eos-adm-icon eos-adm-icon-rename-blue small',
    disabledIconClass: 'eos-adm-icon eos-adm-icon-rename-grey small',
    hoverIconClass: 'eos-adm-icon eos-adm-icon-rename-grey small',
    activeIconClass: null,
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.readwrite,
};

export const TRANSFER_DOCUMENTS: IAction = {
    type: E_RECORD_ACTIONS.transferDocuments,
    group: E_ACTION_GROUPS.group,
    title: 'Передать документы',
    hint: 'Передать документы',
    iconClass: 'eos-adm-icon eos-adm-icon-accept-doc-blue small',
    disabledIconClass: 'eos-adm-icon eos-adm-icon-accept-doc-grey small',
    hoverIconClass: 'eos-adm-icon eos-adm-icon-accept-doc-grey small',
    activeIconClass: null,
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.readwrite,
};

export const RECORD_ACTIONS: IAction[] = [
    RECORD_ACTION_CREATE,
    RECORD_ACTIONS_EDIT,
    RECORD_ACTION_LOGIC_DELETE,
    RECORD_ACTION_SHOW_DELETE,
    RECORD_ACTION_RESTORE,
    RECORD_ACTION_USER_SORT,
    RECORD_ACTION_USER_SORT_CUT,
    RECORD_ACTION_USER_SORT_PASTE,
    RECORD_ACTION_TO_UP,
    RECORD_ACTION_TO_DOWN,
    RECORD_ACTION_SEV_SYNC_DICTS,
    RECORD_ACTION_SEV_CLEAR_IDENTITY_CODES,
    RECORD_ACTION_SHOW_ALL_RECORDS,
    // RECORD_ACTION_CREATE_ORGANISATION_AGENT,
    // RECORD_ACTION_SHOW_SETTINGS,
    RECORD_ACTIONS_ADDITIONAL_FIELDS,
    RECORD_ACTION_COUNTER_DEPARTMENT,
    RECORD_ACTION_COUNTER_DEPARTMENT_MAIN,
    RECORD_ACTION_COUNTER_DEPARTMENT_RK,
    RECORD_ACTION_COUNTER_DEPARTMENT_RKPD,
    RECORD_ACTION_COUNTER_DOCGROUP,
    RECORD_ACTION_COUNTER_DOCGROUP_RKPD,
    RECORD_ACTION_NOMENKL_CLS,
    RECORD_ACTION_NOMENKL_OPS,
    RECORD_COPY_PROPERTIES_FROM_PARRENT,
    RECORD_COPY_PROPERTIES,
    RECORD_GOTO_CERTIFICATES,
    RECORD_ACTIONS_DOWNLOAD_FILE,
    RECORD_ACTIONS_IMPORT_EDS,
    RECORD_ACTION_CUT,
    RECORD_ACTION_COMBINE,
    RECORD_UNCHECK_NEW_ENTRY,
    RECORD_ACTIONS_DEFAULT_COLLISION,
    RECORD_ACTIONS_PROTVIEW_SECURITY,
    RECORD_ACTION_COPY,
    RECORD_ACTION_PASTE,
    // EP_CERTIFICATE_IS_APPOINTED,
    // RECORD_ACTION_EXPORT_DIRECTORY,
    // RECORD_ACTION_IMPORT_DIRECTORY,
];

export const MORE_RECORD_ACTIONS: IAction[] = [
    RECORD_ACTION_CREATE,
    RECORD_ACTIONS_EDIT,
    RECORD_ACTION_LOGIC_DELETE,
    RECORD_ACTION_SHOW_DELETE,
    RECORD_ACTION_RESTORE,
    RECORD_ACTION_USER_SORT,
    RECORD_ACTION_USER_SORT_CUT,
    RECORD_ACTION_USER_SORT_PASTE,
    RECORD_CHECK_UNIQUE_INDEX,
    RECORD_ACTION_TO_UP,
    RECORD_ACTION_TO_DOWN,
    RECORD_ACTION_SHOW_ALL_RECORDS,
    RECORD_ACTION_COUNTER_DOCGROUP,
    RECORD_ACTION_COUNTER_DOCGROUP_RKPD,
    // RECORD_ACTION_CREATE_ORGANISATION_AGENT,
    RECORD_ACTION_SEV_SYNC_DICTS,
    RECORD_ACTION_SEV_CLEAR_IDENTITY_CODES,
    RECORD_ACTIONS_DOP_REC,
    RECORD_UNCHECK_NEW_ENTRY,
    RECORD_ACTIONS_ADDITIONAL_FIELDS,
    RECORD_ACTION_ADVCARDRK,
    RECORD_DETAILS_RKPD,
    RECORD_ACTION_CUT,
    RECORD_ACTION_COPY,
    RECORD_ACTION_COMBINE,
    RECORD_ACTION_PASTE,
    TRANSFER_DOCUMENTS,
    RENAME_BASE_DIRECTORY,
    RECORD_ACTION_EXPORT_DIRECTORY,
    RECORD_ACTION_IMPORT_DIRECTORY,
    RECORD_COPY_PROPERTIES_FROM_PARRENT,
    RECORD_COPY_PROPERTIES,
    RECORD_ACTION_SHOW_SETTINGS,
    RECORD_COPY_NODES,
    RECORD_PASTE_NODES,
    RECORD_ACTIONS_DOWNLOAD_FILE,
    RECORD_ACTIONS_DEFAULT_COLLISION,
    RECORD_GOTO_CERTIFICATES,
    RECORD_ACTIONS_IMPORT_EDS,
    RECORD_ACTIONS_PROTVIEW_SECURITY,
    PRINT_NOMENKL,
    RECORD_ACTION_DELETE_HARD,
];

export const COMMON_ADD_MENU = [{
    params: { 'IS_NODE': 0 },
    title: 'Создать вершину'
},
{
    params: { 'IS_NODE': 1 },
    title: 'Создать лист'
}];

export const DEPARTMENT_ADD_MENU = [
    {
        params: { 'IS_NODE': 0 },
        title: 'Создать подразделение'
    },
    {
        params: { 'IS_NODE': 1 },
        title: 'Создать должностное лицо'
    }
];

export const ORGANIZ_ADD_MENU = [
    {
        params: { 'IS_NODE': 0 },
        title: 'Создать группу'
    },
    {
        params: { 'IS_NODE': 1 },
        title: 'Создать организацию'
    }
];

export const RUBRIC_UNIQ_ADD_MENU = [
    {
        params: { 'SET_DISABLED': 0 },
        title: 'Включена',
        active: true,

    },
    {
        params: { 'SET_DISABLED': 1 },
        title: 'Отключена',
        active: false,
    }
];
