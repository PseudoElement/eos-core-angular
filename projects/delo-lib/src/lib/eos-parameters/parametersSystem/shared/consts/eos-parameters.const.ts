import { IMessage } from '../../../../eos-common/interfaces';
import { IEosParametersTab } from '../interfaces/parameters.interfaces';
export enum E_PARMS_PAGES {
    rc = "rc",
    "prj-rc" = "prj-rc",
    authentication = "authentication",
    files = "files",
    "param-libs" = "param-libs",
    search = "search",
    "context-rc" = "context-rc",
    dictionaries = "dictionaries",
    other = "other",
    web = "web",
    cryptography = "cryptography",
    email = "email",
    sms = "sms",
    "inline-scanning" = "inline-scanning",
    logging = "logging",
    "now-organiz" = "now-organiz",
    conversion = "conversion",
    "unloading-arch" = "unloading-arch",
    "extended-protocol" = "extended-protocol",
    licensing = "licensing",
    preview = "preview",
    "protocol-of-requests" = "protocol-of-requests"
}

export const EOS_PARAMETERS_TAB: IEosParametersTab[] = [{
    title: 'Работа с РК',
    url: E_PARMS_PAGES.rc,
    visible: true
}, {
    title: 'Работа с РКПД',
    url: E_PARMS_PAGES['prj-rc'],
    visible: true
}, {
    title: 'Аутентификация',
    url: E_PARMS_PAGES.authentication,
    visible: true
}, {
    title: 'Работа с файлами',
    url: E_PARMS_PAGES.files,
    visible: true
},/*  {
    title: 'Хранение файлов',
    url: 'param-lib',
    visible: true
}, */ {
    title: 'Хранение файлов',
    url: E_PARMS_PAGES['param-libs'],
    visible: true
}, {
    title: 'Поиск',
    url: E_PARMS_PAGES.search,
    visible: true
}, {
    title: 'Контекст РК(РКПД)',
    url: E_PARMS_PAGES['context-rc'],
    visible: true
}, {
    title: 'Справочники',
    url: E_PARMS_PAGES.dictionaries,
    visible: true
}, {
    title: 'Прочие',
    url: E_PARMS_PAGES.other,
    visible: true
}, {
    title: 'WEB',
    url: E_PARMS_PAGES.web,
    visible: true
}, {
    title: 'Криптография',
    url: E_PARMS_PAGES.cryptography
}, {
    title: 'Электронная почта',
    url: E_PARMS_PAGES.email,
    visible: true
}, {
    title: 'CMC-шлюз',
    url: E_PARMS_PAGES.sms,
    visible: true
}, {
    title: 'Поточное сканирование',
    url: E_PARMS_PAGES['inline-scanning'],
}, {
    title: 'Протоколирование',
    url: E_PARMS_PAGES.logging,
    visible: true
},
{
    title: 'Протоколирование запросов',
    url: E_PARMS_PAGES['protocol-of-requests'],
    visible: true
},
{
    title: 'Текущая организация',
    url: E_PARMS_PAGES['now-organiz'],
    visible: true
}, {
    title: 'Служба конвертации',
    url: E_PARMS_PAGES.conversion,
    visible: true
}, {
    title: 'Предварительный просмотр',
    url: E_PARMS_PAGES.preview,
    visible: true
}, {
    title: 'Архивное хранилище',
    url: E_PARMS_PAGES['unloading-arch'],
    visible: true
}, {
    title: 'Расширенный протокол',
    url: E_PARMS_PAGES['extended-protocol'],
    visible: true
}, {
    title: 'Лицензирование',
    url: E_PARMS_PAGES.licensing,
    visible: true
}
];


export const PARM_SUCCESS_SAVE: IMessage = {
    type: 'success',
    title: 'Изменения сохранены',
    msg: '',
    dismissOnTimeout: 2000
};

export const PARM_CANCEL_CHANGE: IMessage = {
    type: 'warning',
    title: 'Изменения не сохранены',
    msg: '',
};
export const PARM_CHANGE_RC_RES_LAYER: IMessage = {
    type: 'warning',
    title: 'Необходимо выполнить процедуру пересчета флагов контрольности всех РК',
    msg: 'Эта операция может занять много времени и ресурсов',
    dismissOnTimeout: 5000
};
export const PARM_NOT_CARMA_SERVER: IMessage = {
    type: 'warning',
    title: 'Отсутствует сервер "Карма"',
    msg: 'Требуется установить службу - "КАРМА"',
    dismissOnTimeout: 5000
};
export const PARM_ERR_OPEN_CERT_STORES: IMessage = {
    type: 'warning',
    title: 'Ошибка открытия списка сертификатов',
    msg: 'Не удается найти указанный файл',
    dismissOnTimeout: 5000
};
export const CARMA_UNIC_VALUE: IMessage = {
    type: 'warning',
    title: 'Данное хранилище уже выбранно',
    msg: 'Выберите другое хранилище.',
    dismissOnTimeout: 5000
};
export const ELEMENT_PROTECT_NOT_DELET: IMessage = {
    type: 'warning',
    title: 'Изменения сохранены',
    msg: 'Нельзя удалить общий профиль "{{prot}}"',
};

export const REG_RANGE_0_30 = /^[1-2]?\d$|^30$/;
export const REG_RANGE_0_60 = /^[1-5]?\d$|^60$/;
export const REG_RANGE_0_10 = /^\d$|^10$/;
export const REG_RANGE_0_24 = /^1?\d$|^2[0-4]$/;
export const REG_RANGE_0_12 = /^\d$|^1[0-2]$/;


export const REG_RANGE_0_60_2 = /^([1-5][0-9]|[1-9]?|60)$/;
export const REG_RANGE_0_10_2 = /^([1-9]|10)$/;
export const REG_RANGE_0_24_2 = /^([1-9]|[1][0-9]|[2][0-4])$/;
export const REG_RANGE_0_1440_2 = /^\b(\b[0-9]{1,3}\b)|(1(([0-3]?[0-9]{2})|(4(([0-3]?[0-9]?)|40))))\b$/;
export const FILES_UNS = /^(\\\\[^/\\\]\[":;|<>+=,?* _]+\\[^/\\\]\[":;|<>+=,?*]+)((?:\\[^\\/:*?"<>|]+)*\\?)|(\/\/[^/\\\]\[":;|<>+=,?* _]+\/[^/\\\]\[":;|<>+=,?*]+)((?:\/[^\\/:*?"<>|]+)*\/?)$/;
