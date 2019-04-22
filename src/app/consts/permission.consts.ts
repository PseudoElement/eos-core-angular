import { E_TECH_RIGHT } from 'eos-rest/interfaces/rightName';

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
        key: E_TECH_RIGHT.Users,
        name: 'Пользователи'
    },
};
