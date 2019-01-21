import {BtnAction, BtnActionFields} from '../interfaces/btn-action.interfase';
export const CreateUser: BtnActionFields = {
    name: 'CreateUser',
    title: 'Добавить пользователя',
    disabledClass: 'eos-icon eos-icon-plus-blue small',
    enableClass: 'eos-icon eos-icon-plus-blue small',
    tooltip: 'Добавить нового пользователя',
    disabled: false,
    activeClass: 'eos-icon eos-icon-plus-blue small',
    activeBtnClass: '',
    isActive: false,
};

export const RedactUser: BtnActionFields = {
    name: 'RedactUser',
    title: 'Редактировать пользователя',
    disabledClass: 'eos-icon eos-icon-edit-grey small',
    enableClass: 'eos-icon eos-icon-edit-blue small',
    tooltip: 'Редактировать сушествующего пользователя',
    disabled: false,
    activeClass: 'eos-icon eos-icon-edit-blue small',
    activeBtnClass: '',
    isActive: false,
};

export const DeliteLogicalUser: BtnActionFields = {
    name: 'DeliteLogicalUser',
    title: 'Удалить навсегда',
    disabledClass: 'eos-icon eos-icon-bin-forever-grey small',
    enableClass: 'eos-icon eos-icon-bin-forever-blue small',
    tooltip: 'Удалить выбранного (выбранных) пользователей навсегда',
    disabled: false,
    activeClass: 'eos-icon eos-icon-bin-forever-blue small',
    activeBtnClass: '',
    isActive: false,
};

export const ActionMode: BtnActionFields = {
    name: 'ActionMode',
    title: 'Отображение удаленных пользователей',
    disabledClass: 'eos-icon eos-icon-show-blue small',
    enableClass: 'eos-icon eos-icon-show-blue small',
    tooltip: 'Включить/выключить режим отображения  удаленных пользователей',
    disabled: false,
    activeClass: 'eos-icon eos-icon-show-white small',
    activeBtnClass: 'activeShow',
    isActive: false,
};

export const ActionModeMore: BtnActionFields = {
    name: 'ActionMode',
    title: 'Отображение удаленных пользователей',
    disabledClass: 'eos-icon eos-icon-show-blue small',
    enableClass: 'eos-icon eos-icon-show-blue small',
    tooltip: 'Включить/выключить режим отображения  удаленных пользователей',
    disabled: false,
    activeClass: 'eos-icon eos-icon-show-white small',
    activeBtnClass: 'activeShow',
    isActive: false,
};

export const ActionTehnicalUser: BtnActionFields = {
    name: 'ActionTehnicalUser',
    title: 'Отображение технических пользователей',
    disabledClass: 'eos-icon eos-icon-show-blue small',
    enableClass: 'eos-icon eos-icon-show-blue small',
    tooltip: 'Включить/выключить режим отображения  технических пользователей',
    disabled: false,
    activeClass: 'eos-icon eos-icon-show-white small',
    activeBtnClass: 'activeShow',
    isActive: false,
};
export const LocSelectedUser: BtnActionFields = {
    name: 'LocSelectedUser',
    title: 'Заблокировать пользователей',
    disabledClass: 'eos-icon eos-icon-lock-blue small',
    enableClass: 'eos-icon eos-icon-lock-blue small',
    tooltip: 'Заблокировать выбранного (выбранных)  пользователя',
    disabled: false,
    activeClass: 'eos-icon eos-icon-lock-blue small',
    activeBtnClass: '',
    isActive: false,
};
export const OpenAddressManagementWindow: BtnActionFields = {
    name: 'OpenAddressManagementWindow',
    title: 'Ведение адресов электронной почты',
    disabledClass: 'eos-icon eos-icon-show-blue small',
    enableClass: 'eos-icon eos-icon-show-blue small',
    tooltip: 'Открыть окно ведения адресов электронной почты',
    disabled: false,
    activeClass: 'eos-icon eos-icon-show-blue small',
    activeBtnClass: '',
    isActive: false,
};
export const OpenStreamScanSystem: BtnActionFields = {
    name: 'OpenStreamScanSystem',
    title: 'Окно прав пользователя в системе Поточное сканирование',
    disabledClass: 'eos-icon eos-icon-show-blue small',
    enableClass: 'eos-icon eos-icon-show-blue small',
    tooltip: 'Открыть окно настроек прав пользователя в системе Поточное сканирование',
    disabled: false,
    activeClass: 'eos-icon eos-icon-show-blue small',
    activeBtnClass: '',
    isActive: false,
};

export const OpenRightsSystemCaseDelo: BtnActionFields = {
    name: 'OpenRightsSystemCaseDelo',
    title: 'Окно прав пользователя в системе Дело',
    disabledClass: 'eos-icon eos-icon-show-blue small',
    enableClass: 'eos-icon eos-icon-show-blue small',
    tooltip: 'Открыть окно настроек прав пользователя в системе Дело',
    disabled: false,
    activeClass: 'eos-icon eos-icon-show-blue small',
    activeBtnClass: '',
    isActive: false,
};

// export const OpenMoreMenu: BtnActionFields = {
//     name: 'OpenMoreMenu',
//     title: 'Показать меню',
//     disabledClass: '',
//     enableClass: 'eos-icon eos-icon-fab-blue small',
//     disabled: false,
//     activeClass: 'activeShow',
//     activeBtnClass: 'activeShow',
//     isActive: false,
// };


export const Allbuttons: BtnAction = {
    buttons: [
        CreateUser,
        RedactUser,
        DeliteLogicalUser,
        ActionMode,
        LocSelectedUser,
        OpenAddressManagementWindow,
       // OpenStreamScanSystem,
        OpenRightsSystemCaseDelo,
    ],
    moreButtons: [
        CreateUser,
        RedactUser,
        DeliteLogicalUser,
        ActionModeMore,
        ActionTehnicalUser,
        LocSelectedUser,
        OpenAddressManagementWindow,
      //  OpenStreamScanSystem,
        OpenRightsSystemCaseDelo,
    ],
    moreButtonCheck: {
        check: false,
        activeClass: 'eos-icon eos-icon-fab-white small activeShow',
        notActiveClass: 'eos-icon eos-icon-fab-blue small',
    }
};

