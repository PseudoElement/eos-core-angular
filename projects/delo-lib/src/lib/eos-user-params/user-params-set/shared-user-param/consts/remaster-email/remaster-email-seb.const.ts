import { IBaseUsers} from '../../../../shared/intrfaces/user-params.interfaces';

export const REGISTRATION_SEB: IBaseUsers =  {
    id: 'ext-app',
    title: 'Внешний обмен',
    apiInstance: 'USER_PARMS',
    fields: [{
        key: 'SEV_HIDE_SENDING',
        type: 'boolean',
        title: 'Скрыть операцию "Отправить сообщение СЭВ"' /* в приложении Документы */
    },
    {
        key: 'SEV_ALLOW_DELIVERY',
        type: 'boolean',
        title: 'Учитывать вид отправки'
    },
    {
        key: 'ARM_SEV_DLG',
        type: 'boolean',
        title: 'Скрыть операцию отправки по СЭВ без подготовки',
    },
    ]
};