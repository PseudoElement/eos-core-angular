import { IMessage } from 'eos-common/interfaces';

export const EOS_USER_PARAMETERS_TAB = [{
    title: 'Справочники',
    url: 'directories'
}, {
    title: 'Поиск',
    url: 'search'
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

export const PARM_ERROR_SEND_FROM: IMessage = {
    type: 'warning',
    title: 'Выбранное значение нельзя сохранить',
    msg: 'Выбранное подразделение не отмечено, как подразделение для отправки документов по реестрам',
    dismissOnTimeout: 60000
};
