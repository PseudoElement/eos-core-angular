import { IParamAccordionList } from '../intrfaces/user-params.interfaces';

export const SUB_PARAMS_LIST_NAV: IParamAccordionList[] = [
    {
        title: 'Регистрация',
        url: 'registration'
    },
    {
         title: 'Кабинеты',
         url: 'cabinets'
    },
    {
         title: 'РК',
         url: 'rc'
    },
    {
        title: 'Поиск',
        url: 'search'
    },
    {
        title: 'Справочники',
        url: 'dictionary'
    },
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
export const SUB_PARAMS_LIST_NAV_FOR_RIGHTS_DELO: IParamAccordionList[] = [
    {
        title: 'Картотеки и кабинеты',
        url: 'card-files'
    },
    {
        title: 'Абсолютные права',
        url: 'absolute-rights'
    },
    {
        title: 'Права в картотеках',
        url: 'card-index-rights'
    },
    {
        title: 'Ограничение доступа',
        url: 'access-limitation'
    },

];
export const USER_PARAMS_LIST_NAV: IParamAccordionList[] = [
    {
        title: 'Основные данные',
        url: 'base-param',
        disabled: false,
    },
    {
        title: 'Права в системе АИК «Надзор»',
        url: 'rights-delo',
        subList: SUB_PARAMS_LIST_NAV_FOR_RIGHTS_DELO,
        isOpen: false,
        disabled: false,
    },
    {
        title: 'Настройки пользователя',
        url: 'param-set',
        subList: SUB_PARAMS_LIST_NAV,
        isOpen: false,
        disabled: false,
    },
    {
        title: 'Ведение адресов электронной почты',
        url: 'email-address',
        disabled: false,
    },
    {
        title: 'Права в поточном сканировании',
        url: 'inline-scaning',
        disabled: false,
    },
];


