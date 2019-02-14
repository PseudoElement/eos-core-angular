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
    title: 'Файлы',
    url: 'files'
}, {
    title: 'Поиск',
    url: 'search'
}, {
    title: 'Контекст РК(РКПД)',
    url: 'context-rc'
}, {
    title: 'Прочие',
    url: 'other'
}, {
    title: 'WEB',
    url: 'web'
}];

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

export const REG_RANGE_0_30 = /^[1-2]?\d$|^30$/;
export const REG_RANGE_0_60 = /^[1-5]?\d$|^60$/;
export const REG_RANGE_0_10 = /^\d$|^10$/;
export const REG_RANGE_0_24 = /^1?\d$|^2[0-4]$/;
export const REG_RANGE_0_12 = /^\d$|^1[0-2]$/;
