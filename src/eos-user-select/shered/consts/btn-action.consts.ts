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
    disabledClass: 'eos-icon eos-icon-Eraseduser-Grey small',
    enableClass: 'eos-icon eos-icon-Eraseduser-Blue small',
    tooltip: 'Включить/выключить режим отображения  удаленных пользователей',
    disabled: false,
    activeClass: 'eos-icon eos-icon-Eraseduser-White small',
    activeBtnClass: 'activeShow',
    isActive: false,
};

export const ActionModeMore: BtnActionFields = {
    name: 'ActionMode',
    title: 'Отображение удаленных пользователей',
    disabledClass: 'eos-icon eos-icon-Eraseduser-Grey small',
    enableClass: 'eos-icon eos-icon-Eraseduser-Blue small',
    tooltip: 'Включить/выключить режим отображения  удаленных пользователей',
    disabled: false,
    activeClass: 'eos-icon eos-icon-Eraseduser-White small',
    activeBtnClass: 'activeShow',
    isActive: false,
};

export const ActionTehnicalUser: BtnActionFields = {
    name: 'ActionTehnicalUser',
    title: 'Отображение технических пользователей',
    disabledClass: 'eos-icon eos-icon-Techuser-Grey small',
    enableClass: 'eos-icon eos-icon-Techuser-Blue small',
    tooltip: 'Включить/выключить режим отображения  технических пользователей',
    disabled: false,
    activeClass: 'eos-icon eos-icon-Techuser-White small',
    activeBtnClass: 'activeShow',
    isActive: false,
};
export const LocSelectedUser: BtnActionFields = {
    name: 'LocSelectedUser',
    title: 'Заблокировать пользователей',
    disabledClass: 'eos-icon eos-icon-Blockeduser-Grey small',
    enableClass: 'eos-icon eos-icon-Blockeduser-Blue small',
    tooltip: 'Заблокировать выбранного (выбранных)  пользователя',
    disabled: false,
    activeClass: 'eos-icon eos-icon-Blockeduser-Blue small',
    activeBtnClass: '',
    isActive: false,
};
export const OpenAddressManagementWindow: BtnActionFields = {
    name: 'OpenAddressManagementWindow',
    title: 'Ведение адресов электронной почты',
    disabledClass: 'eos-icon eos-icon-A-Grey small',
    enableClass: 'eos-icon eos-icon-A-Blue small',
    tooltip: 'Открыть окно ведения адресов электронной почты',
    disabled: false,
    activeClass: 'eos-icon eos-icon-A-Blue small',
    activeBtnClass: '',
    isActive: false,
};
export const OpenStreamScanSystem: BtnActionFields = {
    name: 'OpenStreamScanSystem',
    title: 'Окно прав пользователя в системе Поточное сканирование',
    disabledClass: 'eos-icon eos-icon-Sc-Grey small',
    enableClass: 'eos-icon eos-icon-Sc-Blue small',
    tooltip: 'Открыть окно настроек прав пользователя в системе Поточное сканирование',
    disabled: false,
    activeClass: 'eos-icon eos-icon-Sc-Blue small',
    activeBtnClass: '',
    isActive: false,
};

export const OpenRightsSystemCaseDelo: BtnActionFields = {
    name: 'OpenRightsSystemCaseDelo',
    title: 'Окно прав пользователя в системе Надзор',
    disabledClass: 'eos-icon eos-icon-H-Grey small',
    enableClass: 'eos-icon eos-icon-H-Blue small',
    tooltip: 'Открыть окно настроек прав пользователя в системе Надзор',
    disabled: false,
    activeClass: 'eos-icon eos-icon-H-Blue small',
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
       // DeliteLogicalUser,
        // ActionMode,
        LocSelectedUser,
        OpenAddressManagementWindow,
       // OpenStreamScanSystem,
        OpenRightsSystemCaseDelo,
    ],
    moreButtons: [
        CreateUser,
        RedactUser,
       // DeliteLogicalUser,
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

