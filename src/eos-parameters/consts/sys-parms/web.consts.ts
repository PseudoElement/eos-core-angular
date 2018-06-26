import { IBaseInput } from 'eos-common/interfaces';

// import { IParamBese } from 'eos-parameters/interfaces/parameters.interfaces';

export const WEB_PARAM = {
    id: 'web',
    apiInstance: 'USER_PARMS',
    title: 'WEB',
    fields: <IBaseInput[]>[
        {
            key: 'APPSRV_CRYPTO_ACTIVEX',
            controlType: 'string',
            label: 'Название объекта',
            // value: 'test',
            hideLabel: false,
        },
        {
            key: 'APPSRV_CRYPTO_INITSTR',
            controlType: 'string',
            label: 'Строка инициализации',
            hideLabel: false,
        },
        {
            key: 'APPSRV_PKI_ACTIVEX',
            controlType: 'string',
            label: 'Название объекта',
            hideLabel: false,
        },
        {
            key: 'APPSRV_PKI_INITSTR',
            controlType: 'string',
            label: 'Строка инициализации',
            hideLabel: false,
        },
        {
            controlType: 'buttons',
            label: 'Хранилища сертификатов',
            hideLabel: true,
            options: [{ value: 1, title: 'Хранилища сертификатов'}]
        }
    ]
};
