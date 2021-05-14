import {BtnAction, BtnActionFields} from '../interfaces/btn-action.interfase';
export const CreateUser: BtnActionFields = {
    name: 'CreateUser',
    title: 'Добавить пользователя',
    disabledClass: 'eos-icon eos-icon-plus-grey small',
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
    tooltip: 'Редактировать существующего пользователя',
    disabled: false,
    activeClass: 'eos-icon eos-icon-edit-blue small',
    activeBtnClass: '',
    isActive: false,
};

export const DeliteUser: BtnActionFields = {
    name: 'DeliteUser',
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

export const ViewDeletedUsers: BtnActionFields = {
    name: 'ViewDeletedUsers',
    title: 'Отображение удаленных пользователей',
    disabledClass: 'eos-icon eos-icon-Eraseduser-Grey small',
    enableClass: 'eos-icon eos-icon-Eraseduser-Blue small',
    tooltip: 'Включить/выключить режим отображения  удаленных пользователей',
    disabled: false,
    activeClass: 'eos-icon eos-icon-Eraseduser-White small',
    activeBtnClass: 'activeShow',
    isActive: false,
};

export const ViewTechicalUsers: BtnActionFields = {
    name: 'ViewTechicalUsers',
    title: 'Отображение техн. пользователей',
    disabledClass: 'eos-icon eos-icon-Techuser-Grey small',
    enableClass: 'eos-icon eos-icon-Techuser-Blue small',
    tooltip: 'Включить/выключить режим отображения  технических пользователей',
    disabled: false,
    activeClass: 'eos-icon eos-icon-Techuser-White small',
    activeBtnClass: 'activeShow',
    isActive: false,
};
export const BlockUser: BtnActionFields = {
    name: 'BlockUser',
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
    title: 'Поточное сканирование',
    disabledClass: 'eos-icon eos-icon-Sc-Grey small',
    enableClass: 'eos-icon eos-icon-Sc-Blue small',
    tooltip: 'Поточное сканирование',
    disabled: false,
    activeClass: 'eos-icon eos-icon-Sc-Blue small',
    activeBtnClass: '',
    isActive: false,
};

export const OpenRightsSystemCaseDelo: BtnActionFields = {
    name: 'OpenRightsSystemCaseDelo',
    title: 'Окно прав пользователя в системе Дело',
    disabledClass: 'eos-icon eos-icon-D-Grey small',
    enableClass: 'eos-icon eos-icon-D-Blue small',
    tooltip: 'Открыть окно настроек прав пользователя в системе Дело',
    disabled: false,
    activeClass: 'eos-icon eos-icon-D-Blue small',
    activeBtnClass: '',
    isActive: false,
};

export const CommonTechLists: BtnActionFields = {
    name: 'CommonTechLists',
    title: 'Ведение общих и технологических списков',
    disabledClass: 'eos-icon eos-icon-template-grey small',
    enableClass: 'eos-icon eos-icon-template-blue small',
    tooltip: 'Ведение общих и технологических списков',
    disabled: false,
    activeClass: 'eos-icon eos-icon-template-blue small',
    activeBtnClass: '',
    isActive: false,
};

export const UserLists: BtnActionFields = {
    name: 'UserLists',
    title: 'Ведение списков пользователя',
    disabledClass: 'eos-icon eos-icon-template-grey small',
    enableClass: 'eos-icon eos-icon-template-blue small',
    tooltip: 'Ведение списков пользователя',
    disabled: false,
    activeClass: 'eos-icon eos-icon-text-list-blue small',
    activeBtnClass: '',
    isActive: false,
};

export const GeneralLists: BtnActionFields = {
    name: 'GeneralLists',
    title: 'Ведение общих списков стандартных текстов',
    disabledClass: 'eos-icon eos-icon-text-list-grey small',
    enableClass: 'eos-icon eos-icon-text-list-blue small',
    tooltip: 'Ведение общих списков стандартных текстов',
    disabled: false,
    activeClass: 'eos-icon eos-icon-text-list-blue small',
    activeBtnClass: '',
    isActive: false,
};

export const SumProtocol: BtnActionFields = {
    name: 'OpenSumProtocol',
    title: 'Сводный протокол',
    disabledClass: 'eos-icon eos-icon-rules-grey small',
    enableClass: 'eos-icon eos-icon-rules-blue small',
    tooltip: 'Сводный протокол',
    disabled: false,
    activeClass: 'eos-icon eos-icon-rules-blue small',
    activeBtnClass: '',
    isActive: false,
};

export const UsersStats: BtnActionFields = {
    name: 'UsersStats',
    title: 'Статистика по пользователям и опциям',
    disabledClass: 'eos-icon eos-icon eos-icon-statistic-grey small',
    enableClass: 'eos-icon eos-icon eos-icon-statistic-blue small',
    tooltip: 'Статистика по пользователям и опциям',
    disabled: false,
    activeClass: 'eos-icon eos-icon eos-icon-statistic-blue small',
    activeBtnClass: '',
    isActive: false,
};

export const UsersInfo: BtnActionFields = {
    name: 'OpenUsersInfo',
    title: 'Данные по отмеченным пользователям',
    disabledClass: 'eos-icon eos-icon-department-grey small',
    enableClass: 'eos-icon eos-icon-department-blue small',
    tooltip: 'Данные по отмеченным пользователям',
    disabled: false,
    activeClass: 'eos-icon eos-icon-department-blue small',
    activeBtnClass: '',
    isActive: false,
};

export const Protocol: BtnActionFields = {
    name: 'Protocol',
    title: 'Протокол',
    disabledClass: 'eos-icon eos-icon-rules-grey small',
    enableClass: 'eos-icon eos-icon-rules-blue small',
    tooltip: 'Протокол',
    disabled: false,
    activeClass: 'eos-icon eos-icon-rules-blue small',
    activeBtnClass: 'eos-icon-rules-blue',
    isActive: false,
};

export const DefaultSettings: BtnActionFields = {
    name: 'DefaultSettings',
    title: 'Настройки по умолчанию',
    disabledClass: 'eos-icon eos-icon-repair-grey small',
    enableClass: 'eos-icon eos-icon-settings-blue small',
    tooltip: 'Настройки по умолчанию',
    disabled: false,
    activeClass: 'eos-icon eos-icon-settings-blue small',
    activeBtnClass: '',
    isActive: false,
};

export const SettingsManagement: BtnActionFields = {
    name: 'SettingsManagement',
    title: 'Управление настройками',
    disabledClass: 'eos-icon eos-icon-department-grey small',
    enableClass: 'eos-icon eos-icon-department-blue small',
    tooltip: 'Управление настройками',
    disabled: false,
    activeClass: 'eos-icon eos-icon-department-blue small',
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
        // ActionMode,
        BlockUser,
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
        BlockUser,
        OpenAddressManagementWindow,
        OpenStreamScanSystem,
        OpenRightsSystemCaseDelo,
        CommonTechLists,
        UserLists,
        SettingsManagement,
        GeneralLists,
        UsersStats,
        Protocol,
        SumProtocol,
        UsersInfo,
        DefaultSettings,
        DeliteUser,
    ],
    moreButtonCheck: {
        check: false,
        activeClass: 'eos-icon eos-icon-fab-white small activeShow',
        notActiveClass: 'eos-icon eos-icon-fab-blue small',
    }
};

