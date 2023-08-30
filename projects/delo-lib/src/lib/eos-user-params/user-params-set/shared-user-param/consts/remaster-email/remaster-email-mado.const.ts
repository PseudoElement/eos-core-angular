import { IBaseUsers} from '../../../../shared/intrfaces/user-params.interfaces';

export const REMASTER_MADO: IBaseUsers =  {
    id: 'ext-app',
    title: 'Внешний обмен',
    apiInstance: 'USER_PARMS',
    fields: [{
        key: 'MEDO_DELETE_MESSAGE_AFTER_REGISTRATION',
        type: 'boolean',
        title: 'Удалять сообщения после регистрации'
    },
    {
        key: 'MEDO_DELETE_MESSAGE_AFTER_REFUSAL_REGISTRATION',
        type: 'boolean',
        title: 'Удалять сообщения после отказа от регистрации'
    },
    {
        key: 'MEDO_ATTACH_DOC_PASSPORT_TO_RC',
        type: 'boolean',
        title: 'Прикреплять к РК паспорт документа'
    },
    {
        key: 'MEDO_RECEIVE_RUBRIC_CHECK',
        type: 'boolean',
        title: 'Принимать рубрики РК и определять их по:',
    },
    {
        key: 'MEDO_RECEIVE_RUBRIC_RC_AND_IDENTIFY_BY',
        type: 'radio',
        title: '',
        readonly: false,
        options: [
            {value: '1', title: 'Коду'},
            {value: '2', title: 'Наименованию'},
            {value: '3', title: 'Коду и наименованию'}
        ],
        parent: 'MEDO_RECEIVE_RUBRIC_CHECK'
    },
    {
        key: 'MEDO_ADD_CITIZEN_TO_ORGANIZ',
        type: 'boolean',
        title: 'Автоматически добавлять организации и представителей в справочник "Организации"'
    },
    /* {
        key: 'ARM_MEDO_HIDE',
        type: 'boolean',
        title: 'Скрыть команду отправки'
    }, */
    {
        key: 'ARM_MEDO_DLG',
        type: 'boolean',
        title: 'Скрыть операцию отправки по МЭДО без подготовки'
    }
    ]
};