import { E_TECH_RIGHT } from '../../eos-rest/interfaces/rightName';

export interface IKeyRightTech {
    key: E_TECH_RIGHT;
    name: string;
}

export const KEY_RIGHT_TECH = {
    'parameters': {
        key: E_TECH_RIGHT.SystemParms,
        name: 'Параметры системы'
    },
    'user_param': {
        key: E_TECH_RIGHT.Users,
        name: 'Пользователи'
    },
    'user-params-set': {
        key: "user-params-set",
        name: 'Пользователи'
    },
    'services': {
        key: "services",
        name: 'Сервисы'
    },
    'tools': {
        key: "tools",
        name: 'Инструменты'
    },
    'spravochniki': {
        key: "spravochniki",
        name: 'Справочники'
    },
    'SEV': {
        key: "SEV",
        name: 'Справочники СЭВ'
    },
    'nadzor': {
        key: "nadzor",
        name: 'Справочники'
    },
    'desk': {
        key: "desk",
        name: ''
    },
    'user-session': {
        key: "user-session",
        name: 'Сессии пользователей'
    },
};
