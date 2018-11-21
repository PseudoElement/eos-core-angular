import { IMessage } from 'eos-common/interfaces';

export const EOS_USER_PARAMETERS_TAB = [{
    title: 'Картотеки',
    url: 'card-files'
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
