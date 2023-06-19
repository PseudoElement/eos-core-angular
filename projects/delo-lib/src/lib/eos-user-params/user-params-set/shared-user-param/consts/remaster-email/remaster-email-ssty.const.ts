import { IBaseUsers} from '../../../../shared/intrfaces/user-params.interfaces';

export const REGISTRATION_SSTU: IBaseUsers =  {
    id: 'ext-app',
    title: 'Внешний обмен',
    apiInstance: 'USER_PARMS',
    fields: [{
        key: 'SSTU_FOLDER_UPLOAD_PATH',
        type: 'boolean',
        title: 'Индивидуальная папка выгрузки'
    },
    ]
};