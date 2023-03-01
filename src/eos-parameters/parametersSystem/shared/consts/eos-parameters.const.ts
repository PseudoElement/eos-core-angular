import { IMessage } from 'eos-common/interfaces';

export const EOS_PARAMETERS_TAB = [{
    title: 'Работа с РК',
    url: 'rc'
}, {
    title: 'Работа с РКПД',
    url: 'prj-rc'
}, {
    title: 'Аутентификация',
    url: 'authentication'
}, {
    title: 'Работа с файлами',
    url: 'files'
}, {
    title: 'Хранение файлов',
    url: 'param-lib'
}, {
    title: 'Поиск',
    url: 'search'
}, {
    title: 'Контекст РК(РКПД)',
    url: 'context-rc'
}, {
    title: 'Справочники',
    url: 'dictionaries'
}, {
    title: 'Прочие',
    url: 'other'
}, {
    title: 'WEB',
    url: 'web'
}, {
    title: 'Протоколирование',
    url: 'logging'
}, /* {
    title: 'Криптография',
    url: 'cryptography'
},{
    title: 'Электронная почта',
    url: 'email'
},*/{
    title: 'Текущая организация',
    url: 'now-organiz'
}, {
    title: 'Служба конвертации',
    url: 'conversion'
},
{
    title: 'Архивное хранилище',
    url: 'unloading-arch'
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
    dismissOnTimeout: 2000
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
    msg: 'Элемент "{{prot}}" защищён от удаления',
    dismissOnTimeout: 2000
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
