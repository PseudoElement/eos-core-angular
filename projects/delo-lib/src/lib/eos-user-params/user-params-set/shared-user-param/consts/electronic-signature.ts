
import { IInputParamControl,  } from '../../../../eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { E_FIELD_TYPE } from '../../../../eos-dictionaries/interfaces';
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
            key: 'DIFF_CHECK_EDS',
            label: 'Использовать отдельные настройки для проверки ЭП',
            readonly: false,
        },
        {
            controlType: E_FIELD_TYPE.string,
            key: 'DIFF_CHECK_CRYPTO_INITSTR',
            label: 'Строка инициализации:',
            readonly: false,
        },
        {
            controlType: E_FIELD_TYPE.string,
            key: 'DIFF_CHECK_PKI_INITSTR',
            label: 'Строка инициализации:',
            readonly: false,
        },
        {
            controlType: E_FIELD_TYPE.string,
            key: 'CERT_DIFF_CHECK_STORES',
            label: '',
            readonly: false,
        },
    ];

export const CRYPTO_EI_BTN_TABEL = [
    {
        tooltip: 'Добавить',
        disable: false,
        iconActiv: 'eos-adm-icon-plus-blue',
        iconDisable: 'eos-adm-icon-plus-grey',
        id: 'add'
    },
    {
        tooltip: 'Редактировать',
        disable: true,
        iconActiv: 'eos-adm-icon-edit-blue',
        iconDisable: 'eos-adm-icon-edit-grey',
        id: 'edit'
    },
    {
        tooltip: 'Удалить',
        disable: true,
        iconActiv: 'eos-adm-icon-bin-forever-blue',
        iconDisable: 'eos-adm-icon-bin-forever-grey',
        id: 'deleted'
    },
    {
        tooltip: 'Просмотреть',
        disable: true,
        iconActiv: 'eos-adm-icon-info-blue',
        iconDisable: 'eos-adm-icon-info-grey',
        id: 'show'
    },
];   