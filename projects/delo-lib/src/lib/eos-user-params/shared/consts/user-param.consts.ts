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
         title: 'Отображение РК',
         url: 'rc'
    },
    {
        title: 'Справочники',
        url: 'dictionary'
    },
    {
        title: 'Внешний обмен',
        url: 'ext-exch'
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
    /* @task165408 удаление настроек толстяка
    {
        title: 'Приложение Документы',
        url: 'external-application'
    },
    */
    {
        title: 'Передача',
        url: 'other'
    },
    {
        title: 'Поточное сканирование',
        url: 'inline-scanning'
    }
    /* @task165408 удаление настроек толстяка
    {
        title: 'Шаблоны',
        url: 'patterns'
    }
    */
];
export const SUB_PARAMS_LIST_NAV_FOR_RIGHTS_DELO: IParamAccordionList[] = [
    {
        title: 'Картотеки и кабинеты',
        url: 'card-files',
        disabled: false,
    },
    {
        title: 'Абсолютные права',
        url: 'absolute-rights',
        disabled: false,
    },
    {
        title: 'Права в картотеках',
        url: 'card-index-rights',
        disabled: false,
    },
    {
        title: 'Ограничение доступа',
        url: 'access-limitation',
        disabled: false,
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
    /* {
        title: 'Права в поточном сканировании',
        url: 'inline-scaning',
        disabled: false,
    }, */
    {
        title: 'Протокол',
        url: 'protocol',
        disabled: false,
    },
    {
        title: 'Аутентификация',
        url: 'auntefication',
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
    'Помощник заместителя Председателя и директоров департаментов', 'Исполнитель'
];

export const HTML_TEMPLATE_TITLE = '$TITLE';
export const HTML_TEMPLATE_DATE = '$DATE';
export const HTML_TEMPLATE_DATA = '$DATA';
export const HTML_TEMPLATE_SHORT_REPORT = `
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="utf-8">
    <title>${HTML_TEMPLATE_TITLE}</title>
    <style>
        table {
        margin: 1em;
        border: 1px solid black;
        border-collapse: collapse;
        }
        caption {
        font-size: 22px;
        font-weight: bold;
        }
        th {
        border: 1px solid black;
        font-size: 16px;
        padding: .5em;
        min-width: 100px;
        max-width: 400px;
        text-align: left;
        }
        td {
        border: 1px solid black;
        font-size: 16px;
        padding: .5em;
        min-width: 100px;
        max-width: 400px;
        word-wrap: break-word;
        }
        p {
            font-size: 14px;
            text-align: right;
        }
    </style>
    </head>
    <body>

    <table>
        <caption>
            ${HTML_TEMPLATE_TITLE}
            <br>
            <p>
                <i>${HTML_TEMPLATE_DATE}</i>
            </p>
        </caption>
        <tr>
        <th>№</th>
        <th>Подразделение</th>
        <th>Фамилия</th>
        <th>Имя</th>
        </tr>

        ${HTML_TEMPLATE_DATA}

    </table>
    </body>
    </html>
`;


