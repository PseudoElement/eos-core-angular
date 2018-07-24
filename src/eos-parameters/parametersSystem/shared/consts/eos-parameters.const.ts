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
