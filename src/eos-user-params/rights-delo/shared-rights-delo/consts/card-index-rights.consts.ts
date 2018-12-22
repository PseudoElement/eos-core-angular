// import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';
import { E_RIGHT_DELO_ACCESS_CONTENT } from '../interfaces/right-delo.intefaces';
import { IInputParamControl, IInputParamControlForIndexRight } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';

export const CARD_INDEXS_RIGHTS: IInputParamControlForIndexRight[] = [
        {
         //   controlType: E_FIELD_TYPE.text,
            key: '0',
            // key: 'CARD_INDEX_RIGHTS_REGISTRATION_OF_DOCUMENTS',
            label: 'Регистрация документов',
            data: {
                isSelected: false,
                rightContent: E_RIGHT_DELO_ACCESS_CONTENT.docGroup
            }
        },
        {
        //    controlType: E_FIELD_TYPE.boolean,
            key: '1',
            // key: 'CARD_INDEX_RIGHTS_DOCUMENT_SEARCH',
            label: 'Поиск документов',
            data: {
                isSelected: false,
                rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
            }
        },
        {
         //   controlType: E_FIELD_TYPE.boolean,
            key: '2',
            // key: 'CARD_INDEX_RIGHTS_EDITING_RC',
            label: 'Редактирование РК',
            data: {
                isSelected: false,
                rightContent: E_RIGHT_DELO_ACCESS_CONTENT.docGroupCard
            }
        },
        {
          //  controlType: E_FIELD_TYPE.boolean,
            key: '3',
            // key: 'CARD_INDEX_RIGHTS_RC_REMOVAL',
            label: 'Удаление РК',
            data: {
                isSelected: false,
                rightContent: E_RIGHT_DELO_ACCESS_CONTENT.docGroupCard
            }
        },
        {
        //    controlType: E_FIELD_TYPE.boolean,
            key: '4',
            // key: 'CARD_INDEX_RIGHTS_RC_SHIPMENT',
            label: 'Пересылка РК',
            data: {
                isSelected: false,
                rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
            }
        },
        {
        //    controlType: E_FIELD_TYPE.boolean,
            key: '5',
            // key: 'CARD_INDEX_RIGHTS_RECEIVE_REPORTS',
            label: 'Получение отчетов',
            data: {
                isSelected: false,
                rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
            }
        },
        {
        //    controlType: E_FIELD_TYPE.boolean,
            key: '6',
            // key: 'CARD_INDEX_RIGHTS_DOCUMENT_REWIND',
            label: 'Переотметка документов',
            data: {
                isSelected: false,
                rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
            }
        },
        {
         //   controlType: E_FIELD_TYPE.boolean,
            key: '7',
            // key: 'CARD_INDEX_RIGHTS_WRITING_OFF_OF_DOCUMENTS_IN_DELO',
            label: 'Списание документов в дело',
            data: {
                isSelected: false,
                rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
            }
        },
        {
         //   controlType: E_FIELD_TYPE.boolean,
            key: '8',
            // key: 'CARD_INDEX_RIGHTS_MARK_FAMILIARIZATION',
            label: 'Отметка ознакомления',
            data: {
                isSelected: false,
                rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
            }
        },
        {
          //  controlType: E_FIELD_TYPE.boolean,
            key: '9',
            // key: 'CARD_INDEX_RIGHTS_SENDING_BY_EMAIL',
            label: 'Отправка по e-mail',
            data: {
                isSelected: false,
                rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
            }
        },
        {
          //  controlType: E_FIELD_TYPE.boolean,
            key: '10',
            // key: 'CARD_INDEX_RIGHTS_MARK_SENDING_DOCUMENTS',
            label: 'Отметка отправки документов',
            data: {
                isSelected: false,
                rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
            }
        },
        {
        //    controlType: E_FIELD_TYPE.boolean,
            key: '11',
            // key: 'CARD_INDEX_RIGHTS_INVENTORY_OF_CASES',
            label: 'Опись дел',
            data: {
                isSelected: false,
                rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
            }
        },
        {
           // controlType: E_FIELD_TYPE.boolean,
            key: '12',
            // key: 'CARD_INDEX_RIGHTS_ADD_FILES',
            label: 'Добавлять файлы',
            data: {
                isSelected: false,
                rightContent: E_RIGHT_DELO_ACCESS_CONTENT.docGroupCard
            }
        },
        {
         //   controlType: E_FIELD_TYPE.boolean,
            key: '13',
            // key: 'CARD_INDEX_RIGHTS_READ_FILES',
            label: 'Читать файлы',
            data: {
                isSelected: false,
                rightContent: E_RIGHT_DELO_ACCESS_CONTENT.docGroupCard
            }
        },
        {
         //   controlType: E_FIELD_TYPE.boolean,
            key: '14',
            // key: 'CARD_INDEX_RIGHTS_EDIT_FILES',
            label: 'Редактировать файлы',
            data: {
                isSelected: false,
                rightContent: E_RIGHT_DELO_ACCESS_CONTENT.docGroupCard
            }
        },
        {
         //   controlType: E_FIELD_TYPE.boolean,
            key: '15',
            // key: 'CARD_INDEX_RIGHTS_DELETE_FILES',
            label: 'Удалять файлы',
            data: {
                isSelected: false,
                rightContent: E_RIGHT_DELO_ACCESS_CONTENT.docGroupCard
            }
        },
        {
        //    controlType: E_FIELD_TYPE.boolean,
            key: '16',
            // key: 'CARD_INDEX_RIGHTS_VIEW_ORDERS',
            label: 'Просмотр поручений',
            data: {
                isSelected: false,
                rightContent: E_RIGHT_DELO_ACCESS_CONTENT.none
            }
        },
        {
        //    controlType: E_FIELD_TYPE.boolean,
            key: '17',
            // key: 'CARD_INDEX_RIGHTS_SENDING_MESSAGES_SEV',
            label: 'Отправка сообщений СЭВ',
            data: {
                isSelected: false,
                rightContent: E_RIGHT_DELO_ACCESS_CONTENT.docGroup
            }
        },
        {
        //    controlType: E_FIELD_TYPE.boolean,
            key: '18',
            // key: 'CARD_INDEX_RIGHTS_EDITING_ADDITIONAL_DETAILS',
            label: 'Редактирование доп.реквизитов',
            data: {
                isSelected: false,
                rightContent: E_RIGHT_DELO_ACCESS_CONTENT.docGroupCard
            }
        },
        {
        //    controlType: E_FIELD_TYPE.boolean,
            key: '19',
            // key: 'CARD_INDEX_RIGHTS_EDITING_RUBRICS',
            label: 'Редактирование рубрик',
            data: {
                isSelected: false,
                rightContent: E_RIGHT_DELO_ACCESS_CONTENT.docGroupCard
            }
        },
        {
        //    controlType: E_FIELD_TYPE.boolean,
            key: '20',
            // key: 'CARD_INDEX_RIGHTS_EDITING_BUNDLE',
            label: 'Редактирование связок',
            data: {
                isSelected: false,
                rightContent: E_RIGHT_DELO_ACCESS_CONTENT.docGroupCard
            }
        }
];

export const DOCUMENT_GROUPS: IInputParamControl[] = [
];

export const RESTRICT_REGISTRATION_FILING: IInputParamControl[] = [
];

export const ALL_DOCUMENTS: IInputParamControl[] = [
];
