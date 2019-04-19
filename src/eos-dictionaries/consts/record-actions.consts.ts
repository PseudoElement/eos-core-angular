import { IAction, E_RECORD_ACTIONS, E_ACTION_GROUPS } from 'eos-dictionaries/interfaces';
import { APS_DICT_GRANT } from 'eos-dictionaries/services/eos-access-permissions.service';

export const RECORD_ACTIONS_EDIT: IAction = {
    type: E_RECORD_ACTIONS.edit,
    group: E_ACTION_GROUPS.item,
    title: 'Редактировать',
    hint: 'Редактировать',
    iconClass: 'eos-icon eos-icon-edit-blue small',
    disabledIconClass: 'eos-icon eos-icon-edit-grey small',
    hoverIconClass: 'eos-icon eos-icon-edit-dark-blue small',
    activeIconClass: null,
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.readwrite,
};

const RECORD_ACTION_CREATE: IAction = {
    type: E_RECORD_ACTIONS.add,
    group: E_ACTION_GROUPS.common,
    title: 'Создать',
    hint: 'Создать',
    iconClass: 'eos-icon eos-icon-plus-blue small',
    disabledIconClass: 'eos-icon eos-icon-plus-grey small',
    activeIconClass: null,
    hoverIconClass: 'eos-icon eos-icon-plus-dark-blue small',
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.readwrite,
};

const RECORD_ACTION_ADVCARDRK: IAction = {
    type: E_RECORD_ACTIONS.AdvancedCardRK,
    group: E_ACTION_GROUPS.common,
    title: 'Заполнение реквизитов РК',
    hint: 'Заполнение реквизитов РК',
    iconClass: 'eos-icon eos-icon-clip-blue small',
    disabledIconClass: 'eos-icon eos-icon-clip-grey small',
    activeIconClass: '',
    hoverIconClass: 'eos-icon eos-icon-repair-clip-blue small',
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.readwrite,
};

const RECORD_ACTION_LOGIC_DELETE: IAction = {
    type: E_RECORD_ACTIONS.remove,
    group: E_ACTION_GROUPS.group,
    title: 'Удалить логически',
    hint: 'Удалить логически',
    iconClass: 'eos-icon eos-icon-bin-blue small',
    disabledIconClass: 'eos-icon eos-icon-bin-grey small',
    activeIconClass: null,
    hoverIconClass: 'eos-icon eos-icon-bin-dark-blue small',
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.readwrite,
};

const RECORD_ACTION_SHOW_DELETE: IAction = {
    type: E_RECORD_ACTIONS.showDeleted,
    group: E_ACTION_GROUPS.group,
    title: 'Отображать логически удалённые',
    hint: 'Отображать логически удалённые',
    iconClass: 'eos-icon eos-icon-show-blue small',
    disabledIconClass: 'eos-icon eos-icon-show-grey small',
    activeIconClass: 'eos-icon eos-icon-show-white small',
    hoverIconClass: '',
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.read,
};

const RECORD_ACTION_USER_SORT: IAction = {
    type: E_RECORD_ACTIONS.userOrder,
    group: E_ACTION_GROUPS.group,
    title: 'Пользовательская сортировка',
    hint: 'Пользовательская сортировка',
    iconClass: 'eos-icon eos-icon-custom-list-blue small',
    disabledIconClass: 'eos-icon eos-icon-custom-list-grey small',
    activeIconClass: 'eos-icon eos-icon-custom-list-white small',
    hoverIconClass: 'eos-icon eos-icon-custom-list-white small',
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.read,
};
const RECORD_ACTION_TO_UP: IAction = {
    type: E_RECORD_ACTIONS.moveUp,
    group: E_ACTION_GROUPS.item,
    title: 'Поднять строку',
    hint: 'Поднять строку',
    iconClass: 'eos-icon eos-icon-arrow-v-blue-top small',
    disabledIconClass: 'eos-icon eos-icon-arrow-v-grey-top small',
    activeIconClass: null,
    hoverIconClass: 'eos-icon eos-icon-arrow-v-dark-blue-top small',
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.read,
};

const RECORD_ACTION_TO_DOWN: IAction = {
    type: E_RECORD_ACTIONS.moveDown,
    group: E_ACTION_GROUPS.item,
    title: 'Опустить строку',
    hint: 'Опустить строку',
    iconClass: 'eos-icon eos-icon-arrow-v-blue-bottom small',
    disabledIconClass: 'eos-icon eos-icon-arrow-v-grey-bottom small',
    activeIconClass: null,
    hoverIconClass: 'eos-icon eos-icon-arrow-v-dark-blue-bottom small',
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.read,
};

const RECORD_ACTION_SHOW_ALL_RECORDS: IAction = {
    type: E_RECORD_ACTIONS.showAllSubnodes,
    group: E_ACTION_GROUPS.common,
    title: 'Отобразить все дочерние записи единым списком',
    hint: 'Отобразить все дочерние записи единым списком',
    iconClass: 'eos-icon eos-icon-tree-blue small',
    disabledIconClass: 'eos-icon eos-icon-tree-grey small',
    activeIconClass: 'eos-icon eos-icon-tree-white small',
    hoverIconClass: '',
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.read,
};

const RECORD_ACTION_SHOW_SETTINGS: IAction = {
    type: E_RECORD_ACTIONS.tableCustomization,
    group: E_ACTION_GROUPS.common,
    title: 'Настройка отображения',
    hint: 'Настройка отображения',
    iconClass: 'eos-icon eos-icon-settings-blue small',
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
    iconClass: 'eos-icon eos-icon-repair-blue small',
    disabledIconClass: 'eos-icon eos-icon-repair-grey small',
    activeIconClass: '',
    hoverIconClass: 'eos-icon eos-icon-repair-dark-blue small',
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.readwrite,
};

const RECORD_ACTION_DELETE_HARD: IAction = {
    type: E_RECORD_ACTIONS.removeHard,
    group: E_ACTION_GROUPS.group,
    title: 'Удалить навсегда',
    hint: 'Удалить навсегда',
    iconClass: 'eos-icon eos-icon-bin-forever-blue small',
    disabledIconClass: 'eos-icon eos-icon-bin-forever-grey small',
    activeIconClass: null,
    hoverIconClass: 'eos-icon eos-icon-bin-forever-dark-blue small',
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.readwrite,
};

const RECORD_ACTION_COUNTER_DEPARTMENT_MAIN: IAction = {
    type: E_RECORD_ACTIONS.counterDepartmentMain,
    group: E_ACTION_GROUPS.item,
    title: 'Главный счетчик номерообразования НП',
    hint: 'Главный счетчик номерообразования НП',
    iconClass: 'eos-icon eos-icon-info-blue small',
    disabledIconClass: 'eos-icon eos-icon-info-grey small',
    activeIconClass: null,
    hoverIconClass: 'eos-icon eos-icon-info-blue small',
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.readwrite,
};

const RECORD_ACTION_COUNTER_DEPARTMENT: IAction = {
    type: E_RECORD_ACTIONS.counterDepartment,
    group: E_ACTION_GROUPS.item,
    title: 'Cчетчик номерообразования НП',
    hint: 'Cчетчик номерообразования НП',
    iconClass: 'eos-icon eos-icon-info-blue small',
    disabledIconClass: 'eos-icon eos-icon-info-grey small',
    activeIconClass: null,
    hoverIconClass: 'eos-icon eos-icon-info-blue small',
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.readwrite,
};

const RECORD_ACTION_COUNTER_DOCGROUP: IAction = {
    type: E_RECORD_ACTIONS.counterDocgroup,
    group: E_ACTION_GROUPS.item,
    title: 'Cчетчик номерообразования РК',
    hint: 'Cчетчик номерообразования РК',
    iconClass: 'eos-icon eos-icon-info-blue small',
    disabledIconClass: 'eos-icon eos-icon-info-grey small',
    activeIconClass: null,
    hoverIconClass: 'eos-icon eos-icon-info-blue small',
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.readwrite,
};

const RECORD_ACTION_COUNTER_DOCGROUP_RKPD: IAction = {
    type: E_RECORD_ACTIONS.counterDocgroupRKPD,
    group: E_ACTION_GROUPS.item,
    title: 'Cчетчик номерообразования РКПД',
    hint: 'Cчетчик номерообразования РКПД',
    iconClass: 'eos-icon eos-icon-info-blue small',
    disabledIconClass: 'eos-icon eos-icon-info-grey small',
    activeIconClass: null,
    hoverIconClass: 'eos-icon eos-icon-info-blue small',
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.readwrite,
};

const RECORD_ACTION_COUNTER_DEPARTMENT_RK: IAction = {
    type: E_RECORD_ACTIONS.counterDepartmentRK,
    group: E_ACTION_GROUPS.item,
    title: 'Cчетчик номерообразования РК',
    hint: 'Cчетчик номерообразования РК',
    iconClass: 'eos-icon eos-icon-info-blue small',
    disabledIconClass: 'eos-icon eos-icon-info-grey small',
    activeIconClass: null,
    hoverIconClass: 'eos-icon eos-icon-info-blue small',
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.readwrite,
};

const RECORD_ACTION_COUNTER_DEPARTMENT_RKPD: IAction = {
    type: E_RECORD_ACTIONS.counterDepartmentRKPD,
    group: E_ACTION_GROUPS.item,
    title: 'Cчетчик номерообразования РКПД',
    hint: 'Cчетчик номерообразования РКПД',
    iconClass: 'eos-icon eos-icon-info-blue small',
    disabledIconClass: 'eos-icon eos-icon-info-grey small',
    activeIconClass: null,
    hoverIconClass: 'eos-icon eos-icon-info-blue small',
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.readwrite,
};

const RECORD_ACTION_NOMENKL_CLS: IAction = {
    type: E_RECORD_ACTIONS.CloseSelected,
    group: E_ACTION_GROUPS.item,
    title: 'Закрыть выделенные дела',
    hint: 'Закрыть выделенные дела',
    iconClass: 'eos-icon eos-icon-info-blue small',
    disabledIconClass: 'eos-icon eos-icon-info-grey small',
    activeIconClass: null,
    hoverIconClass: 'eos-icon eos-icon-info-blue small',
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.readwrite,
};

const RECORD_ACTION_NOMENKL_OPS: IAction = {
    type: E_RECORD_ACTIONS.OpenSelected,
    group: E_ACTION_GROUPS.item,
    title: 'Открыть выделенные дела',
    hint: 'Открыть выделенные дела',
    iconClass: 'eos-icon eos-icon-info-blue small',
    disabledIconClass: 'eos-icon eos-icon-info-grey small',
    activeIconClass: null,
    hoverIconClass: 'eos-icon eos-icon-info-blue small',
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.readwrite,
};

// const RECORD_ACTION_CREATE_ORGANISATION_AGENT: IAction = {
//     type: E_RECORD_ACTIONS.createRepresentative,
//     group: E_ACTION_GROUPS.group,
//     title: 'Создать представителя организации',
//     hint: 'Создать представителя организации',
//     iconClass: 'eos-icon eos-icon-avatar-blue small',
//     disabledIconClass: 'eos-icon eos-icon-avatar-grey small',
//     activeIconClass: null,
//     hoverIconClass: 'eos-icon eos-icon-avatar-dark-blue small',
//     buttonClass: null
// };

export const RECORD_ACTIONS_NAVIGATION_UP = {
    type: E_RECORD_ACTIONS.navigateUp,
    group: E_ACTION_GROUPS.item,
    title: null,
    hint: 'Предыдущая',
    iconClass: 'eos-icon eos-icon-arrow-v-blue-top small',
    disabledIconClass: 'eos-icon eos-icon-arrow-v-grey-top small',
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.read,
};

export const RECORD_ACTIONS_NAVIGATION_DOWN = {
    type: E_RECORD_ACTIONS.navigateDown,
    group: E_ACTION_GROUPS.item,
    title: null,
    hint: 'Следующая',
    iconClass: 'eos-icon eos-icon-arrow-v-blue-bottom small',
    disabledIconClass: 'eos-icon eos-icon-arrow-v-grey-bottom small',
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.read,
};

const RECORD_ACTIONS_ADDITIONAL_FIELDS: IAction = {
    type: E_RECORD_ACTIONS.additionalFields,
    group: E_ACTION_GROUPS.item,
    title: 'Дополнительные реквизиты РК',
    hint: 'Дополнительные реквизиты РК',
    iconClass: 'eos-icon eos-icon-clip-blue small',
    disabledIconClass: 'eos-icon eos-icon-clip-grey small',
    activeIconClass: '',
    hoverIconClass: 'eos-icon eos-icon-repair-clip-blue small',
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.readwrite,
};

const RECORD_DETAILS_RKPD: IAction = {
    type: E_RECORD_ACTIONS.prjDefaultValues,
    group: E_ACTION_GROUPS.item,
    title: 'Заполнение реквизитов РКПД',
    hint: 'Заполнение реквизитов РКПД',
    iconClass: 'eos-icon eos-icon-clip-blue small',
    disabledIconClass: 'eos-icon eos-icon-clip-grey small',
    activeIconClass: '',
    hoverIconClass: 'eos-icon eos-icon-repair-clip-blue small',
    buttonClass: null,
    accessNeed: APS_DICT_GRANT.readwrite,
};

export const RECORD_ACTIONS: IAction[] = [
    RECORD_ACTION_CREATE,
    RECORD_ACTIONS_EDIT,
    RECORD_ACTION_LOGIC_DELETE,
    RECORD_ACTION_DELETE_HARD,
    RECORD_ACTION_SHOW_DELETE,
    RECORD_ACTION_RESTORE,
    RECORD_ACTION_USER_SORT ,
    RECORD_ACTION_TO_UP ,
    RECORD_ACTION_TO_DOWN ,
    RECORD_ACTION_SHOW_ALL_RECORDS,
    // RECORD_ACTION_CREATE_ORGANISATION_AGENT,
    RECORD_ACTION_SHOW_SETTINGS,
    RECORD_ACTIONS_ADDITIONAL_FIELDS,
    RECORD_ACTION_COUNTER_DEPARTMENT,
    RECORD_ACTION_COUNTER_DEPARTMENT_MAIN,
    RECORD_ACTION_COUNTER_DEPARTMENT_RK,
    RECORD_ACTION_COUNTER_DEPARTMENT_RKPD,
    RECORD_ACTION_COUNTER_DOCGROUP,
    RECORD_ACTION_COUNTER_DOCGROUP_RKPD,
    RECORD_ACTION_NOMENKL_CLS,
    RECORD_ACTION_NOMENKL_OPS,
];

export const MORE_RECORD_ACTIONS: IAction[] = [
    RECORD_ACTION_CREATE,
    RECORD_ACTIONS_EDIT,
    RECORD_ACTION_LOGIC_DELETE,
    RECORD_ACTION_DELETE_HARD,
    RECORD_ACTION_SHOW_DELETE,
    RECORD_ACTION_RESTORE,
    RECORD_ACTION_USER_SORT,
    RECORD_ACTION_TO_UP,
    RECORD_ACTION_TO_DOWN,
    RECORD_ACTION_SHOW_ALL_RECORDS,
    // RECORD_ACTION_CREATE_ORGANISATION_AGENT,
    RECORD_ACTIONS_ADDITIONAL_FIELDS,
    RECORD_ACTION_ADVCARDRK,
    RECORD_DETAILS_RKPD,
    RECORD_ACTION_SHOW_SETTINGS,
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
