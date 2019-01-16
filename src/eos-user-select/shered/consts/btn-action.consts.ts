import {BtnAction, BtnActionFields} from '../interfaces/btn-action.interfase';
export const CreateUser: BtnActionFields = {
    name: 'CreateUser',
    title: 'Добавить нового пользователя',
    disabledClass: '',
    enableClass: 'eos-icon eos-icon-plus-blue small',
    tooltip: this.title,
    disabled: false,
};

export const RedactUser: BtnActionFields = {
    name: 'RedactUser',
    title: 'Редактировать сушествующего пользователя',
    disabledClass: 'eos-icon eos-icon-edit-grey small',
    enableClass: 'eos-icon eos-icon-edit-blue small',
    tooltip: this.title,
    disabled: false,
};

export const DeliteLogicalUser: BtnActionFields = {
    name: 'DeliteLogicalUser',
    title: 'Удалить выбранного (выбранных) пользователей навсегда',
    disabledClass: 'eos-icon eos-icon-bin-forever-grey small',
    enableClass: 'eos-icon eos-icon-bin-forever-blue small',
    tooltip: this.title,
    disabled: false,
};

export const ActionMode: BtnActionFields = {
    name: 'ActionMode',
    title: 'Включить/выключить режим отображения логически удаленных пользователей',
    disabledClass: '',
    enableClass: 'eos-icon eos-icon-show-blue small',
    tooltip: this.title,
    disabled: false,
    activeClass: 'activeShow'
};
export const RestoreLogicallyDeletedUser: BtnActionFields = {
    name: 'RestoreLogicallyDeletedUser',
    title: 'Восстановить логически удаленного пользователя',
    disabledClass: 'eos-icon eos-icon-repair-grey small',
    enableClass: 'eos-icon eos-icon-repair-blue small',
    tooltip: this.title,
    disabled: false,
};
export const LocSelectedUser: BtnActionFields = {
    name: 'LocSelectedUser',
    title: 'Заблокировать выбранного (выбранных) пользователя',
    disabledClass: '',
    enableClass: 'eos-icon eos-icon-lock-blue small',
    tooltip: this.title,
    disabled: false,
};
export const OpenAddressManagementWindow: BtnActionFields = {
    name: 'OpenAddressManagementWindow',
    title: 'Открыть окно ведения адресов электронной почты',
    disabledClass: '',
    enableClass: '',
    tooltip: this.title,
    disabled: false,
};
export const OpenStreamScanSystem: BtnActionFields = {
    name: 'OpenStreamScanSystem',
    title: 'Открыть окно настроек прав пользователя в системе Поточное сканирование',
    disabledClass: '',
    enableClass: '',
    tooltip: this.title,
    disabled: false,
};

export const OpenRightsSystemCaseDelo: BtnActionFields = {
    name: 'OpenRightsSystemCaseDelo',
    title: 'Открыть окно настроек прав пользователя в системе Дело',
    disabledClass: '',
    enableClass: '',
    tooltip: this.title,
    disabled: false,
};

export const OpenMoreMenu: BtnActionFields = {
    name: 'OpenMoreMenu',
    title: 'Показать меню',
    disabledClass: '',
    enableClass: 'eos-icon eos-icon-fab-blue small',
    disabled: false,
    activeClass: 'activeShow'
};


export const Allbuttons: BtnAction = {
    buttons: [
        CreateUser,
        RedactUser,
        DeliteLogicalUser,
        ActionMode,
        RestoreLogicallyDeletedUser,
        LocSelectedUser,
        OpenAddressManagementWindow,
        OpenStreamScanSystem,
        OpenRightsSystemCaseDelo,
        OpenMoreMenu,
    ],
    moreButtons: [
        CreateUser,
        RedactUser,
        DeliteLogicalUser,
        ActionMode,
        RestoreLogicallyDeletedUser,
        LocSelectedUser,
        OpenAddressManagementWindow,
        OpenStreamScanSystem,
        OpenRightsSystemCaseDelo,
    ],
};

