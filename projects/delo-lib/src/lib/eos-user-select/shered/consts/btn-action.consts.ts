import {BtnAction, BtnActionFields} from '../interfaces/btn-action.interfase';
export const CreateUser: BtnActionFields = {
    name: 'CreateUser',
    title: 'Добавить пользователя',
    disabledClass: 'eos-adm-icon eos-adm-icon-plus-grey small',
    enableClass: 'eos-adm-icon eos-adm-icon-plus-blue small',
    tooltip: 'Добавить нового пользователя',
    disabled: false,
    activeClass: 'eos-adm-icon eos-adm-icon-plus-blue small',
    activeBtnClass: '',
    isActive: false,
};

export const RedactUser: BtnActionFields = {
    name: 'RedactUser',
    title: 'Редактировать пользователя',
    disabledClass: 'eos-adm-icon eos-adm-icon-edit-grey small',
    enableClass: 'eos-adm-icon eos-adm-icon-edit-blue small',
    tooltip: 'Редактировать существующего пользователя',
    disabled: false,
    activeClass: 'eos-adm-icon eos-adm-icon-edit-blue small',
    activeBtnClass: '',
    isActive: false,
};

export const DeliteUser: BtnActionFields = {
    name: 'DeliteUser',
    title: 'Удалить навсегда',
    disabledClass: 'eos-adm-icon eos-adm-icon-bin-forever-grey small',
    enableClass: 'eos-adm-icon eos-adm-icon-bin-forever-blue small',
    tooltip: 'Удалить выбранного (выбранных) пользователей навсегда',
    disabled: false,
    activeClass: 'eos-adm-icon eos-adm-icon-bin-forever-blue small',
    activeBtnClass: '',
    isActive: false,
};

export const ActionMode: BtnActionFields = {
    name: 'ActionMode',
    title: 'Отображение удаленных пользователей',
    disabledClass: 'eos-adm-icon eos-adm-icon-Eraseduser-Grey small',
    enableClass: 'eos-adm-icon eos-adm-icon-Eraseduser-Blue small',
    tooltip: 'Включить/выключить режим отображения  удаленных пользователей',
    disabled: false,
    activeClass: 'eos-adm-icon eos-adm-icon-Eraseduser-White small',
    activeBtnClass: 'activeShow',
    isActive: false,
};

export const ViewDeletedUsers: BtnActionFields = {
    name: 'ViewDeletedUsers',
    title: 'Отображение удаленных пользователей',
    disabledClass: 'eos-adm-icon eos-adm-icon-Eraseduser-Grey small',
    enableClass: 'eos-adm-icon eos-adm-icon-Eraseduser-Blue small',
    tooltip: 'Включить/выключить режим отображения  удаленных пользователей',
    disabled: false,
    activeClass: 'eos-adm-icon eos-adm-icon-Eraseduser-White small',
    activeBtnClass: 'activeShow',
    isActive: false,
};

export const ViewTechicalUsers: BtnActionFields = {
    name: 'ViewTechicalUsers',
    title: 'Отображение техн. пользователей',
    disabledClass: 'eos-adm-icon eos-adm-icon-Techuser-Grey small',
    enableClass: 'eos-adm-icon eos-adm-icon-Techuser-Blue small',
    tooltip: 'Включить/выключить режим отображения  технических пользователей',
    disabled: false,
    activeClass: 'eos-adm-icon eos-adm-icon-Techuser-White small',
    activeBtnClass: 'activeShow',
    isActive: false,
};
export const BlockUser: BtnActionFields = {
    name: 'BlockUser',
    title: 'Заблокировать пользователей',
    disabledClass: 'eos-adm-icon eos-adm-icon-Blockeduser-Grey small',
    enableClass: 'eos-adm-icon eos-adm-icon-Blockeduser-Blue small',
    tooltip: 'Заблокировать выбранного (выбранных)  пользователя',
    disabled: false,
    activeClass: 'eos-adm-icon eos-adm-icon-Blockeduser-Blue small',
    activeBtnClass: '',
    isActive: false,
};
export const OpenAddressManagementWindow: BtnActionFields = {
    name: 'OpenAddressManagementWindow',
    title: 'Ведение адресов электронной почты',
    disabledClass: 'eos-adm-icon eos-adm-icon-A-Grey small',
    enableClass: 'eos-adm-icon eos-adm-icon-A-Blue small',
    tooltip: 'Открыть окно ведения адресов электронной почты',
    disabled: false,
    activeClass: 'eos-adm-icon eos-adm-icon-A-Blue small',
    activeBtnClass: '',
    isActive: false,
};
export const OpenStreamScanSystem: BtnActionFields = {
    name: 'OpenStreamScanSystem',
    title: 'Поточное сканирование',
    disabledClass: 'eos-adm-icon eos-adm-icon-Sc-Grey small',
    enableClass: 'eos-adm-icon eos-adm-icon-Sc-Blue small',
    tooltip: 'Поточное сканирование',
    disabled: false,
    activeClass: 'eos-adm-icon eos-adm-icon-Sc-Blue small',
    activeBtnClass: '',
    isActive: false,
};

export const OpenRightsSystemCaseDelo: BtnActionFields = {
    name: 'OpenRightsSystemCaseDelo',
    title: 'Окно прав пользователя в системе Дело',
    disabledClass: 'eos-adm-icon eos-adm-icon-D-Grey small',
    enableClass: 'eos-adm-icon eos-adm-icon-D-Blue small',
    tooltip: 'Открыть окно настроек прав пользователя в системе Дело',
    disabled: false,
    activeClass: 'eos-adm-icon eos-adm-icon-D-Blue small',
    activeBtnClass: '',
    isActive: false,
};

export const UserLists: BtnActionFields = {
    name: 'UserLists',
    title: 'Ведение списков пользователя',
    disabledClass: 'eos-adm-icon eos-adm-icon-citizen-grey small',
    enableClass: 'eos-adm-icon eos-adm-icon-citizen-blue small',
    tooltip: 'Ведение списков пользователя',
    disabled: false,
    activeClass: 'eos-adm-icon eos-adm-icon-citizen-blue small',
    activeBtnClass: '',
    isActive: false,
};

export const SumProtocol: BtnActionFields = {
    name: 'OpenSumProtocol',
    title: 'Сводный протокол',
    disabledClass: 'eos-adm-icon eos-adm-icon-rules-grey small',
    enableClass: 'eos-adm-icon eos-adm-icon-rules-blue small',
    tooltip: 'Сводный протокол',
    disabled: false,
    activeClass: 'eos-adm-icon eos-adm-icon-rules-blue small',
    activeBtnClass: '',
    isActive: false,
};

export const UsersStats: BtnActionFields = {
    name: 'UsersStats',
    title: 'Статистика по пользователям и опциям',
    disabledClass: 'eos-adm-icon eos-adm-icon eos-adm-icon-statistic-grey small',
    enableClass: 'eos-adm-icon eos-adm-icon eos-adm-icon-statistic-blue small',
    tooltip: 'Статистика по пользователям и опциям',
    disabled: false,
    activeClass: 'eos-adm-icon eos-adm-icon eos-adm-icon-statistic-blue small',
    activeBtnClass: '',
    isActive: false,
};

export const UsersInfo: BtnActionFields = {
    name: 'OpenUsersInfo',
    title: 'Данные по отмеченным пользователям',
    disabledClass: 'eos-adm-icon eos-adm-icon-department-grey small',
    enableClass: 'eos-adm-icon eos-adm-icon-department-blue small',
    tooltip: 'Данные по отмеченным пользователям',
    disabled: false,
    activeClass: 'eos-adm-icon eos-adm-icon-department-blue small',
    activeBtnClass: '',
    isActive: false,
};

export const Protocol: BtnActionFields = {
    name: 'Protocol',
    title: 'Протокол',
    disabledClass: 'eos-adm-icon eos-adm-icon-rules-grey small',
    enableClass: 'eos-adm-icon eos-adm-icon-rules-blue small',
    tooltip: 'Протокол',
    disabled: false,
    activeClass: 'eos-adm-icon eos-adm-icon-rules-blue small',
    activeBtnClass: 'eos-adm-icon-rules-blue',
    isActive: false,
};

export const DefaultSettings: BtnActionFields = {
    name: 'DefaultSettings',
    title: 'Настройки по умолчанию',
    disabledClass: 'eos-adm-icon eos-adm-icon-repair-grey small',
    enableClass: 'eos-adm-icon eos-adm-icon-settings-blue small',
    tooltip: 'Настройки по умолчанию',
    disabled: false,
    activeClass: 'eos-adm-icon eos-adm-icon-settings-blue small',
    activeBtnClass: '',
    isActive: false,
};

export const SettingsManagement: BtnActionFields = {
    name: 'SettingsManagement',
    title: 'Управление настройками пользователей',
    disabledClass: 'eos-adm-icon eos-adm-icon-options-grey small',
    enableClass: 'eos-adm-icon eos-adm-icon-options-blue small',
    tooltip: 'Управление настройками пользователей',
    disabled: false,
    activeClass: 'eos-adm-icon eos-adm-icon-options-blue small',
    activeBtnClass: '',
    isActive: false,
};
export const Unlock: BtnActionFields = {
    name: 'Unlock',
    title: 'Разблокировать пользователей',
    disabledClass: 'eos-adm-icon eos-adm-icon-user-unblock-grey small',
    enableClass: 'eos-adm-icon eos-adm-icon-user-unblock-blue small',
    tooltip: 'Разблокировать выбранного (выбранных) пользователя',
    disabled: false,
    activeClass: 'eos-adm-icon eos-adm-icon-user-unblock-blue small',
    activeBtnClass: '',
    isActive: false,
};
export const USER_SESSION: BtnActionFields = {
    name: 'UserSession',
    title: 'Текущие сессии пользователей',
    disabledClass: 'eos-adm-icon eos-adm-icon-key-grey small',
    enableClass: 'eos-adm-icon eos-adm-icon-key-blue small',
    tooltip: 'Текущие сессии пользователей',
    disabled: false,
    activeClass: 'eos-adm-icon eos-adm-icon-key-blue small',
    activeBtnClass: '',
    isActive: false,
};
export const ViewDisableUser: BtnActionFields = {
    name: 'ViewDisableUser',
    title: 'Отображать заблокированных пользователей',
    disabledClass: 'eos-adm-icon eos-adm-icon-show-grey small',
    enableClass: 'eos-adm-icon eos-adm-icon-show-blue small',
    tooltip: 'Включить/выключить режим отображения  технических пользователей',
    disabled: false,
    activeClass: 'eos-adm-icon eos-adm-icon-show-white small',
    activeBtnClass: 'activeShow',
    isActive: false,
};
// export const OpenMoreMenu: BtnActionFields = {
//     name: 'OpenMoreMenu',
//     title: 'Показать меню',
//     disabledClass: '',
//     enableClass: 'eos-adm-icon eos-adm-icon-fab-blue small',
//     disabled: false,
//     activeClass: 'activeShow',
//     activeBtnClass: 'activeShow',
//     isActive: false,
// };


export const Allbuttons: BtnAction = {
    buttons: [
        CreateUser,
        RedactUser,
        // ActionMode,
        BlockUser,
        Unlock,
        OpenAddressManagementWindow,
        OpenStreamScanSystem,
        OpenRightsSystemCaseDelo,
     //   DeliteLogicalUser,
    ],
    moreButtons: [
        CreateUser,
        RedactUser,
        ViewDeletedUsers,
        ViewTechicalUsers,
        ViewDisableUser,
        BlockUser,
        Unlock,
        OpenAddressManagementWindow,
        OpenStreamScanSystem,
        OpenRightsSystemCaseDelo,
        UserLists,
        SettingsManagement,
        UsersStats,
        USER_SESSION,
        Protocol,
        SumProtocol,
        UsersInfo,
        DefaultSettings,
        DeliteUser,
    ],
    moreButtonCheck: {
        check: false,
        activeClass: 'eos-adm-icon eos-adm-icon-fab-white small activeShow',
        notActiveClass: 'eos-adm-icon eos-adm-icon-fab-blue small',
    }
};

