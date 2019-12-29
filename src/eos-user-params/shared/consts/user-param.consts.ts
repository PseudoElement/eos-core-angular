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
    {
        title: 'Электронная подпись',
        url: 'el-signature'
    },
    {
        title: 'Профиль сертификатов',
        url: 'prof-sert'
    },
    // {
    //     title: 'Электронная почта',
    //     url: 'mail'
    // },
    {
        title: 'Визуализация',
        url: 'visualization'
    },
    {
        title: 'Внешние приложения',
        url: 'external-application'
    },
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
        title: 'Права в системе «Дело»',
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
    {
        title: 'Протокол',
        url: 'protocol',
        disabled: false,
    },
    // {
    //     title: 'Данные по отмеченным пользователям',
    //     url: 'users-info',
    //     disabled: false,
    // },
];

export const KIND_ROLES_CB: string[] = [
    'Председатель', 'Заместитель Председателя', 'Директор департамента и заместитель директора департамента', 'Помощник Председателя',
    'Помощник заместителя предстедателя и директоров', 'Исполнитель'
];


