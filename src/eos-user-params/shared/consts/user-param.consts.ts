import { IParamAccordionList, IOpenClessifParams } from '../intrfaces/user-params.interfaces';

export const SUB_PARAMS_LIST_NAV: IParamAccordionList[] = [
    {
        title: 'Регистрация',
        url: 'registration'
    },
    // {
    //     title: 'Кабинеты',
    //     url: 'cabinets'
    // },
    // {
    //     title: 'РК',
    //     url: 'rc'
    // },
    {
        title: 'Поиск',
        url: 'search'
    },
    // {
    //     title: 'Справочники',
    //     url: 'dictionary'
    // },
    // {
    //     title: 'Электронная почта',
    //     url: 'mail'
    // },
    {
        title: 'Визуализация',
        url: 'visualization'
    },
    // {
    //     title: 'Внешние приложения',
    //     url: 'out-app'
    // },
    {
        title: 'Прочие',
        url: 'other'
    },
];
export const USER_PARAMS_LIST_NAV: IParamAccordionList[] = [
    {
        title: 'Основные данные',
        url: 'base-param'
    },
    {
        title: 'Права в системе ДЕЛО',
        url: 'rights-delo'
    },
    {
        title: 'Настройки пользователя',
        url: 'param-set',
        subList: SUB_PARAMS_LIST_NAV,
        isOpen: false
    },
    {
        title: 'Ведение адресов электронной почты',
        url: 'email-address'
    },
];

export const OPEN_CLASSIF_DEPARTMENT: IOpenClessifParams = {
    classif: 'DEPARTMENT',
    return_due: true,
    id: '0.',
    skipDeleted: true,
    selectMulty: false,
    selectLeafs: true,
    selectNodes: false,
};
