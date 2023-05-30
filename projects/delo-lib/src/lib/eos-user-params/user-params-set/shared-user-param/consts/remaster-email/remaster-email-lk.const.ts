import { IBaseUsers } from "../../../../shared/intrfaces/user-params.interfaces";
import * as Fields from './remaster-fields.const';

export const REGISTRATION_LK: IBaseUsers = {
    id: 'ext-app',
    title: 'Внешний обмен',
    apiInstance: 'USER_PARMS',
    disabledFields: [
        'RCSEND_LK_REGISTRATION_NUMBER',
        'RCSEND_LK_REGISTRATION_NUMBER_SUBSET',
        'RCSEND_LK_DATE_OF_REGISTRATION',
        'RCSEND_LK_DOCUMENT_AUTHOR_ORGANIZATION_ABBREVIATION',
        'RCSEND_LK_VISAS_ORGANIZATION_ABBREVIATION',
        'RCSEND_LK_ADDRESSES_ORGANIZATION_ABBREVIATION',
        'RCSEND_LK_ADDRESSES_ORGANIZATION_INN',
        'RCSEND_LK_DOCUMENT_PERFORMER_ORGANIZATION_ABBREVIATION',
        'RCSEND_LK_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ABBREVIATION',
        'RCSEND_LK_EXECUTOR_ORGANIZATION_ABBREVIATION',
        'RCSEND_LK_ORDERS_SYSTEM_NUMBER',
        'RCSEND_LK_ORDERS_POINT_RESOLUTION',
        'RCSEND_LK_SUMMARY',
        'RCSEND_LK_ADDRESSEES',
        'RCSEND_LK_ADDRESSEES_RADIO',
    ],
    fields: [
        Fields.HIDE_OPERATION_SEND_EMAIL,
        Fields.EMAIL,
        Fields.CONSIDER_THE_TYPE_OF_DISPATCH,
        Fields.REQUIRES_REGISTRATION_NOTICE_OR_OPT_OUT,
        Fields.FOR_MULTIPOINT_DOCUMENTS_SEND_RADIO,
        Fields.RESOLUTIONS,
        Fields.RESOLUTIONS_RADIO,
        Fields.ADDRESSEES,
        Fields.ADDRESSEES_RADIO,
        Fields.GROUP_OF_DOCUMENTS,
        Fields.THE_COMPOSITION_OF_THE_DOCUMENT,
        Fields.SUMMARY,
        // --------------------------------------
        Fields.REGISTRATION_NUMBER,
        Fields.REGISTRATION_NUMBER_SUBSET,
        Fields.DATE_OF_REGISTRATION,
        // --------------------------------------
        Fields.ACCESS_NECK,
        Fields.HEADINGS,
        Fields.ACCOMPANYING_DOCUMENTS,
        Fields.NOTE_TO_THE_RK,
        Fields.NOTE_TO_THE_ADDRESSEE_OF_THE_MESSAGE,
        Fields.DOCUMENT_AUTHOR,
        Fields.VISAS,
        Fields.ADDRESSES,
        Fields.DOCUMENT_PERFORMER,
        Fields.ORDERS,
        Fields.ADDITIONAL_DETAILS,
        Fields.DOCUMENT_AUTHOR_ORGANIZATION,
        Fields.DOCUMENT_AUTHOR_ORGANIZATION_FULL_TITLE,
        Fields.DOCUMENT_AUTHOR_ORGANIZATION_ABBREVIATION,
        Fields.DOCUMENT_AUTHOR_ORGANIZATION_OGRN_CODE,
        Fields.DOCUMENT_AUTHOR_ORGANIZATION_INN,
        Fields.DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS,
        Fields.DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_CITY,
        Fields.DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_REGION,
        Fields.DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_POSTCODE,
        Fields.DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_STREET,
        Fields.DOCUMENT_AUTHOR_ORGANIZATION_EMAIL,
        Fields.DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED,
        Fields.DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_FULL_NAME,
        Fields.DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_SUBDIVISION,
        Fields.DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_POSITION,
        Fields.DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_DATE_OF_SIGNING,
        Fields.DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER,
        Fields.DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER_REGISTRATION_NUMBER,
        Fields.DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER_DATE_OF_REGISTRATION,
        Fields.DOCUMENT_AUTHOR_CITIZEN,
        Fields.DOCUMENT_AUTHOR_CITIZEN_FULL_NAME,
        Fields.DOCUMENT_AUTHOR_CITIZEN_INN_SNILS,
        Fields.DOCUMENT_AUTHOR_CITIZEN_PASSPORT_DETAILS,
        Fields.DOCUMENT_AUTHOR_CITIZEN_ADDRESS,
        Fields.DOCUMENT_AUTHOR_CITIZEN_ADDRESS_CITY,
        Fields.DOCUMENT_AUTHOR_CITIZEN_ADDRESS_REGION,
        Fields.DOCUMENT_AUTHOR_CITIZEN_ADDRESS_POSTCODE,
        Fields.DOCUMENT_AUTHOR_CITIZEN_ADDRESS_STREET,
        Fields.DOCUMENT_AUTHOR_CITIZEN_EMAIL_PHONE,
        Fields.VISAS_ORGANIZATION,
        Fields.VISAS_ORGANIZATION_FULL_TITLE,
        Fields.VISAS_ORGANIZATION_ABBREVIATION,
        Fields.VISAS_ORGANIZATION_OGRN_CODE,
        Fields.VISAS_ORGANIZATION_INN,
        Fields.VISAS_ORGANIZATION_ADDRESS,
        Fields.VISAS_ORGANIZATION_ADDRESS_CITY,
        Fields.VISAS_ORGANIZATION_ADDRESS_REGION,
        Fields.VISAS_ORGANIZATION_ADDRESS_POSTCODE,
        Fields.VISAS_ORGANIZATION_ADDRESS_STREET,
        Fields.VISAS_ORGANIZATION_EMAIL,
        Fields.VISAS_ORGANIZATION_EXECUTIVE,
        Fields.VISAS_ORGANIZATION_EXECUTIVE_FULL_NAME,
        Fields.VISAS_ORGANIZATION_EXECUTIVE_SUBDIVISION,
        Fields.VISAS_ORGANIZATION_EXECUTIVE_POSITION,
        Fields.VISAS_ORGANIZATION_EXECUTIVE_DATE_OF_SIGNING,
        // ---------------------------------------------------
        Fields.ADDRESSES_ORGANIZATION,
        Fields.ADDRESSES_ORGANIZATION_FULL_TITLE,
        Fields.ADDRESSES_ORGANIZATION_ABBREVIATION,
        Fields.ADDRESSES_ORGANIZATION_OGRN_CODE,
        Fields.ADDRESSES_ORGANIZATION_INN,
        Fields.ADDRESSES_ORGANIZATION_ADDRESS_CITY,
        Fields.ADDRESSES_ORGANIZATION_ADDRESS_REGION,
        Fields.ADDRESSES_ORGANIZATION_ADDRESS_POSTCODE,
        Fields.ADDRESSES_ORGANIZATION_ADDRESS_STREET,
        Fields.ADDRESSES_ORGANIZATION_EMAIL,
        Fields.ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED,
        Fields.ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED_FULL_NAME,
        Fields.ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED_SUBDIVISION,
        Fields.ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED_POSITION,
        Fields.ADDRESSES_CITIZEN,
        Fields.ADDRESSES_CITIZEN_FULL_NAME,
        Fields.ADDRESSES_CITIZEN_INN_SNILS,
        Fields.ADDRESSES_CITIZEN_PASSPORT_DETAILS,
        Fields.ADDRESSES_CITIZEN_ADDRESS,
        Fields.ADDRESSES_CITIZEN_ADDRESS_CITY,
        Fields.ADDRESSES_CITIZEN_ADDRESS_REGION,
        Fields.ADDRESSES_CITIZEN_ADDRESS_POSTCODE,
        Fields.ADDRESSES_CITIZEN_ADDRESS_STREET,
        Fields.ADDRESSES_CITIZEN_EMAIL_PHONE,
        // Исполнитель документа
        Fields.DOCUMENT_PERFORMER_ORGANIZATION,
        Fields.DOCUMENT_PERFORMER_ORGANIZATION_FULL_TITLE,
        Fields.DOCUMENT_PERFORMER_ORGANIZATION_ABBREVIATION,
        Fields.DOCUMENT_PERFORMER_ORGANIZATION_OGRN_CODE,
        Fields.DOCUMENT_PERFORMER_ORGANIZATION_INN,
        Fields.DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS,
        Fields.DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_CITY,
        Fields.DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_REGION,
        Fields.DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_POSTCODE,
        Fields.DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_STREET,
        Fields.DOCUMENT_PERFORMER_ORGANIZATION_EMAIL,
        Fields.DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED,
        Fields.DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED_FULL_NAME,
        Fields.DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED_SUBDIVISION,
        Fields.DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED_POSITION,
        // Поручения
        Fields.ORDERS_SYSTEM_NUMBER,
        Fields.ORDERS_POINT_RESOLUTION,
        Fields.ORDERS_ORDER_TEXT,
        Fields.ORDERS_PLANNED_DATE_OF_PERFORMANCE,
        Fields.ORDERS_RESOLUTION_CREATION_DATE,
        Fields.ORDERS_ITEM_NUMBER,
        Fields.ORDERS_PRIVACY_FEATURE,
        Fields.ORDERS_RESOLUTION_AUTHOR,
        Fields.ORDERS_RESOLUTION_AUTHOR_ORGANIZATION,
        Fields.ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_FULL_TITLE,
        Fields.ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ABBREVIATION,
        Fields.ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_OGRN_CODE,
        Fields.ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_INN,
        Fields.ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS,
        Fields.ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_CITY,
        Fields.ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_REGION,
        Fields.ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_POSTCODE,
        Fields.ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_STREET,
        Fields.ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EMAIL,
        Fields.ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED,
        Fields.ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED_FULL_NAME,
        Fields.ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED_SUBDIVISION,
        Fields.ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_POSITION,
        Fields.ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_DATE_OF_SIGNING,
        Fields.EXECUTOR,
        Fields.EXECUTOR_ORGANIZATION,
        Fields.EXECUTOR_ORGANIZATION_FULL_TITLE,
        Fields.EXECUTOR_ORGANIZATION_ABBREVIATION,
        Fields.EXECUTOR_ORGANIZATION_OGRN_CODE,
        Fields.EXECUTOR_ORGANIZATION_INN,
        Fields.EXECUTOR_ORGANIZATION_ADDRESS,
        Fields.ORDERS_EXECUTOR_ORGANIZATION_ADDRESS_CITY,
        Fields.ORDERS_EXECUTOR_ORGANIZATION_ADDRESS_REGION,
        Fields.EXECUTOR_ORGANIZATION_ADDRESS_POSTCODE,
        Fields.EXECUTOR_ORGANIZATION_ADDRESS_STREET,
        Fields.EXECUTOR_ORGANIZATION_EMAIL,
        Fields.EXECUTOR_EXECUTIVE_ADDRESSED,
        Fields.EXECUTOR_EXECUTIVE_ADDRESSED_FULL_NAME,
        Fields.EXECUTOR_ORGANIZATION_EXECUTIVE_ADDRESSED_SUBDIVISION,
        Fields.EXECUTOR_ORGANIZATION_EXECUTIVE_POSITION,
        Fields.OREDER_FILES,
    ]
}

export const REGISTRATION_MAILRESIVE_LK: IBaseUsers = {
    id: 'registration',
    title: 'Регистрация',
    apiInstance: 'USER_PARMS',
    
    fields: [
        Fields.DELETE_POST_AFTER_REGISTRATION,
        Fields.DELETE_POST_AFTER_CANCELING_REGISTRATION,
        Fields.NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT,
        Fields.NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT_RADIO,
        Fields.ATTACH_DOCUMENT_PASSPORT_TO_RK,
        Fields.TAKE_RUBRICS_RK,
        Fields.TAKE_RUBRICS_RK_RADIO,
        Fields.ACCOMPANYING_DOCUMENTS,
        Fields.AUTOMATICALLY_ADD_ORGANIZATIONS_AND_REPRESENTATIVES,
        Fields.CHECK_EMAIL_MESSAGES,
        Fields.CHECK_EMAIL_FILE_ATTACHMENTS,
        Fields.CHECK_EMAIL_RESOLUTION,
        Fields.NOTIFY_SENDER_IF_EMAIL_IS_NOT_VALID,
        Fields.NOTIFY_SENDER_IF_EMAIL_IS_VALID,
        Fields.ORIGINAL_IN_ELECTRONIC_FORM,
    ]
};
