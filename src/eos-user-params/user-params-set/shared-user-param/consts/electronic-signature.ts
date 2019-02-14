
import { IInputParamControl,  } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';
export const ELECTRONIC_SIGNATURE: IInputParamControl[] =
  [
        {
            controlType: E_FIELD_TYPE.string,
            key: 'CRYPTO_ACTIVEX',
            label: 'Название объекта:',
            readonly: false,
        },
        {
            controlType: E_FIELD_TYPE.boolean,
            key: 'WEB_EDS_VERIFY_ON_SERVER',
            label: 'Проверка ЭП на WEB-сервере',
            readonly: false,
        },
        {
            controlType: E_FIELD_TYPE.string,
            key: 'CRYPTO_INITSTR',
            label: 'Строка инициализации:',
            readonly: false,
        },
        {
            controlType: E_FIELD_TYPE.boolean,
            key: 'SIGN_BASE64',
            label: 'Сохранять подпись в формате Base64',
            readonly: false,
        },
        {
            controlType: E_FIELD_TYPE.string,
            key: 'PKI_ACTIVEX',
            label: 'Название объекта:',
            readonly: false,
        },
        {
            controlType: E_FIELD_TYPE.string,
            key: 'PKI_INITSTR',
            label: 'Строка инициализации:',
            readonly: false,
        },
        {
            controlType: E_FIELD_TYPE.string,
            key: 'CERT_USER_STORES',
            label: '',
            readonly: false,
        },
        {
            controlType: E_FIELD_TYPE.string,
            key: 'CERT_OTHER_STORES',
            label: '',
            readonly: false,
        },
        {
            controlType: E_FIELD_TYPE.boolean,
            key: 'REMOTE_CRYPTO_SERVER',
            label: 'Использовать сервер удаленной проверки ЭП',
            readonly: false,
        },
        {
            controlType: E_FIELD_TYPE.string,
            key: 'WEB_CRYPTO_ACTIVEX',
            label: 'Название объекта:',
            readonly: false,
        },
        {
            controlType: E_FIELD_TYPE.string,
            key: 'WEB_CRYPTO_INITSTR',
            label: 'Строка инициализации:',
            readonly: false,
        },
        {
            controlType: E_FIELD_TYPE.string,
            key: 'WEB_PKI_ACTIVEX',
            label: 'Название объекта:',
            readonly: false,
        },
        {
            controlType: E_FIELD_TYPE.string,
            key: 'WEB_PKI_INITSTR',
            label: 'Строка инициализации:',
            readonly: false,
        },
        {
            controlType: E_FIELD_TYPE.string,
            key: 'CERT_WEB_STORES',
            label: '',
            readonly: false,
        },


    ];

