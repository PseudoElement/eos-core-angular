import { IMessage } from '../../eos-common/interfaces';

export const WARNING_CUT_OWN_RIGHTS: IMessage = {
    type: 'warning',
    title: 'Предупреждение: ',
    msg: 'Снять права самому себе нельзя',
    dismissOnTimeout: 6000,
};
