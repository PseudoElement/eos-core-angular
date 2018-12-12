import { _T } from '../core/consts';
/* ts-lint : disable */

const _t = _T;

// Файл практически целиком генериться, поэтому не боремся с устаревшим синтаксисом
const commonMeta = {
    ADDR_CATEGORY_CL: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            DELETED: _t.i,
            PROTECTED: _t.i,
            CLASSIF_NAME: _t.s,
            WEIGHT: _t.i,
            NOTE: _t.s
        },
        readonly: [

        ],
        relations: [

        ]
    },
    AR_CATEGORY: {
        pk: 'DUE',
        properties: {
            DUE: _t.s,
            ISN_NODE: _t.i,
            ISN_HIGH_NODE: _t.i,
            LAYER: _t.i,
            IS_NODE: _t.i,
            WEIGHT: _t.i,
            KIND: _t.i,
            CLASSIF_NAME: _t.s,
            ISN_AR_DESCRIPT: _t.i,
            PROTECTED: _t.i,
            DELETED: _t.i
        },
        readonly: [
            'PROTECTED'
        ],
        relations: [
            { name: 'AR_DESCRIPT_Ref', __type: 'AR_DESCRIPT', sf: 'ISN_AR_DESCRIPT', tf: 'ISN_AR_DESCRIPT' }
        ]
    },
    AR_DESCRIPT: {
        pk: 'ISN_AR_DESCRIPT',
        properties: {
            ISN_AR_DESCRIPT: _t.i,
            OWNER: _t.s,
            UI_NAME: _t.s,
            API_NAME: _t.s,
            AR_TYPE: _t.s,
            USE_LIST_FLAG: _t.i,
            IS_MULTILINE: _t.i,
            MAX_LEN: _t.i,
            AR_PRECISION: _t.i,
            MAX_VAL: _t.i,
            MIN_VAL: _t.i,
            DEF_VAL: _t.s,
            FRM_STR: _t.s,
            ISN_CLS_OBJECT: _t.i,
            CLS_EXPRESSION: _t.s,
            ISN_CLS_CONTROL: _t.i,
            UI_READONLY: _t.i,
            NO_COPY: _t.i,
            ADD_PROT_INFO: _t.i,
            SEND_ENABLED: _t.i
        },
        readonly: [

        ],
        relations: [
            { name: 'AR_VALUE_LIST_List', __type: 'AR_VALUE_LIST', sf: 'ISN_AR_DESCRIPT', tf: 'ISN_AR_DESCRIPT' }
        ]
    },
    AR_DOCGROUP: {
        pk: 'ISN_AR_DOCGROUP',
        properties: {
            ISN_AR_DOCGROUP: _t.i,
            DUE: _t.s,
            ISN_DOCGROUP: _t.i,
            ISN_AR_DESCRIPT: _t.i,
            DEF_VALUE: _t.s,
            AR_MANDATORY: _t.i,
            TAB_ORDER: _t.i,
            RX_POS: _t.i,
            RY_POS: _t.i,
            R_HEIGHT: _t.i,
            R_WIDTH: _t.i,
            R_UOD: _t.s,
            LX_POS: _t.i,
            LY_POS: _t.i,
            L_HEIGHT: _t.i,
            L_WIDTH: _t.i,
            L_UOD: _t.s
        },
        readonly: [

        ],
        relations: [
            { name: 'AR_DESCRIPT_Ref', __type: 'AR_DESCRIPT', sf: 'ISN_AR_DESCRIPT', tf: 'ISN_AR_DESCRIPT' },
            { name: 'DOCGROUP_CL_Ref', __type: 'DOCGROUP_CL', sf: 'ISN_DOCGROUP', tf: 'ISN_NODE' }
        ]
    },
    AR_ORGANIZ_VALUE: {
        pk: 'ISN_NODE',
        properties: {
            ISN_NODE: _t.i,
            DUE: _t.s
        },
        readonly: [

        ],
        relations: [
            { name: 'ORGANIZ_CL_Ref', __type: 'ORGANIZ_CL', sf: 'ISN_NODE', tf: 'ISN_NODE' }
        ]
    },
    AR_VALUE_LIST: {
        pk: 'ISN_AR_VALUE_LIST',
        properties: {
            ISN_AR_VALUE_LIST: _t.i,
            ISN_AR_DESCRIPT: _t.i,
            VALUE: _t.s,
            WEIGHT: _t.i
        },
        readonly: [

        ],
        relations: [
            { name: 'AR_DESCRIPT_Ref', __type: 'AR_DESCRIPT', sf: 'ISN_AR_DESCRIPT', tf: 'ISN_AR_DESCRIPT' }
        ]
    },
    BANK_RECVISIT: {
        pk: 'ISN_BANK_RECV',
        properties: {
            ISN_BANK_RECV: _t.i,
            ISN_ORGANIZ: _t.i,
            CLASSIF_NAME: _t.s,
            BANK_NAME: _t.s,
            ACOUNT: _t.s,
            SUBACOUNT: _t.s,
            BIK: _t.s,
            CITY: _t.s,
            NOTE: _t.s,
            DUE: _t.s
        },
        readonly: [

        ],
        relations: [
            { name: 'ORGANIZ_CL_Ref', __type: 'ORGANIZ_CL', sf: 'ISN_ORGANIZ', tf: 'ISN_NODE' }
        ]
    },
    CA_CATEGORY: {
        pk: 'ISN_CA_CATEGORY',
        properties: {
            ISN_CA_CATEGORY: _t.i,
            CA_SERIAL: _t.s,
            CA_SUBJECT: _t.s,
            ISN_EDS_CATEGORY: _t.i
        },
        readonly: [

        ],
        relations: [
            { name: 'EDS_CATEGORY_CL_Ref', __type: 'EDS_CATEGORY_CL', sf: 'ISN_EDS_CATEGORY', tf: 'ISN_LCLASSIF' }
        ]
    },
    CABINET: {
        pk: 'ISN_CABINET',
        properties: {
            ISN_CABINET: _t.i,
            DUE: _t.s,
            CABINET_NAME: _t.s,
            FULLNAME: _t.s
        },
        readonly: [

        ],
        relations: [
            { name: 'DEPARTMENT_Ref', __type: 'DEPARTMENT', sf: 'DUE', tf: 'DUE' },
            { name: 'FOLDER_List', __type: 'FOLDER', sf: 'ISN_CABINET', tf: 'ISN_CABINET' }
        ]
    },
    CALENDAR_CL: {
        pk: 'ISN_CALENDAR',
        properties: {
            ISN_CALENDAR: _t.i,
            DATE_CALENDAR: _t.d,
            DATE_TYPE: _t.i
        },
        readonly: [

        ],
        relations: [

        ]
    },
    CB_PRINT_INFO: {
        pk: 'ISN_OWNER OWNER_KIND',
        properties: {
            ISN_OWNER: _t.i,
            OWNER_KIND: _t.i,
            PRINT_SURNAME: _t.s,
            PRINT_SURNAME_DP: _t.s,
            PRINT_DUTY: _t.s,
            PRINT_DEPARTMENT: _t.s,
            DEPARTMENT_RP: _t.s,
            NOT_USE_IN_DUTY: _t.i,
            SURNAME: _t.s,
            NAME: _t.s,
            PATRON: _t.s,
            SURNAME_RP: _t.s,
            NAME_RP: _t.s,
            PATRON_RP: _t.s,
            SURNAME_DP: _t.s,
            NAME_DP: _t.s,
            PATRON_DP: _t.s,
            SURNAME_VP: _t.s,
            NAME_VP: _t.s,
            PATRON_VP: _t.s,
            SURNAME_TP: _t.s,
            NAME_TP: _t.s,
            PATRON_TP: _t.s,
            SURNAME_PP: _t.s,
            NAME_PP: _t.s,
            PATRON_PP: _t.s,
            GENDER: _t.i,
            DUTY_RP: _t.s,
            DUTY_DP: _t.s,
            DUTY_VP: _t.s
        },
        readonly: [

        ],
        relations: [

        ]
    },
    CITIZEN: {
        pk: 'ISN_CITIZEN',
        properties: {
            ISN_CITIZEN: _t.i,
            CITIZEN_SURNAME_SEARCH: _t.s,
            CITIZEN_CITY_SEARCH: _t.s,
            CITIZEN_SURNAME: _t.s,
            CITIZEN_ADDR: _t.s,
            ISN_REGION: _t.i,
            DELETED: _t.i,
            ISN_ADDR_CATEGORY: _t.i,
            CITIZEN_CITY: _t.s,
            DUE_REGION: _t.s,
            ZIPCODE: _t.s,
            PHONE: _t.s,
            SEX: _t.i,
            N_PASPORT: _t.s,
            SERIES: _t.s,
            GIVEN: _t.s,
            INN: _t.s,
            SNILS: _t.s,
            NEW: _t.i,
            E_MAIL: _t.s,
            EDS_FLAG: _t.i,
            ENCRYPT_FLAG: _t.i,
            ID_CERTIFICATE: _t.s,
            MAIL_FORMAT: _t.i,
            INS_DATE: _t.d,
            UPD_DATE: _t.d,
            INS_WHO: _t.i,
            UPD_WHO: _t.i,
            PROTECTED: _t.i,
            WEIGHT: _t.i,
            NOTE: _t.s
        },
        readonly: [
            'ISN_REGION',
            'INS_DATE',
            'UPD_DATE',
            'INS_WHO',
            'UPD_WHO'
        ],
        relations: [
            { name: 'CITIZEN_STATUS_List', __type: 'CITIZEN_STATUS', sf: 'ISN_CITIZEN', tf: 'ISN_CITIZEN' },
            { name: 'REGION_Ref', __type: 'REGION_CL', sf: 'ISN_REGION', tf: 'ISN_NODE' },
            { name: 'ADDR_CATEGORY_Ref', __type: 'ADDR_CATEGORY_CL', sf: 'ISN_ADDR_CATEGORY', tf: 'ISN_LCLASSIF' }
        ]
    },
    CITIZEN_STATUS: {
        pk: 'ISN_CIT_STAT',
        properties: {
            ISN_CITIZEN: _t.i,
            ISN_STATUS: _t.i,
            ISN_CIT_STAT: _t.i,
            DUE_STATUS: _t.s
        },
        readonly: [
            'ISN_STATUS'
        ],
        relations: [
            { name: 'CITIZEN_Ref', __type: 'CITIZEN', sf: 'ISN_CITIZEN', tf: 'ISN_CITIZEN' },
            { name: 'STATUS_Ref', __type: 'CITSTATUS_CL', sf: 'ISN_STATUS', tf: 'ISN_NODE' }
        ]
    },
    CITSTATUS_CL: {
        pk: 'DUE',
        properties: {
            DUE: _t.s,
            ISN_NODE: _t.i,
            ISN_HIGH_NODE: _t.i,
            LAYER: _t.i,
            IS_NODE: _t.i,
            WEIGHT: _t.i,
            MAXDUE: _t.s,
            CLASSIF_NAME: _t.s,
            PROTECTED: _t.i,
            DELETED: _t.i,
            CODE: _t.s,
            NOTE: _t.s,
            INS_DATE: _t.d,
            UPD_DATE: _t.d,
            INS_WHO: _t.i,
            UPD_WHO: _t.i
        },
        readonly: [
            'INS_DATE',
            'UPD_DATE',
            'INS_WHO',
            'UPD_WHO'
        ],
        relations: [
            { name: 'PARENT_Ref', __type: 'CITSTATUS_CL', sf: 'ISN_HIGH_NODE', tf: 'ISN_NODE' }
        ]
    },
    CONTACT: {
        pk: 'ISN_CONTACT',
        properties: {
            ISN_CONTACT: _t.i,
            ID_CERTIFICATE: _t.s,
            ISN_ORGANIZ: _t.i,
            ORDERNUM: _t.i,
            DELETED: _t.i,
            SURNAME: _t.s,
            SURNAME_DP: _t.s,
            DUTY: _t.s,
            DEPARTMENT: _t.s,
            PHONE_LOCAL: _t.s,
            PHONE: _t.s,
            FAX: _t.s,
            E_MAIL: _t.s,
            EDS_FLAG: _t.i,
            ENCRYPT_FLAG: _t.i,
            NOTE: _t.s,
            MAIL_FORMAT: _t.i,
            INS_DATE: _t.d,
            UPD_DATE: _t.d,
            INS_WHO: _t.i,
            UPD_WHO: _t.i,
            DUE: _t.s,
            IS_NODE: _t.i,
            DUE_EXT_DEPARTMENT: _t.s
        },
        readonly: [
            'INS_DATE',
            'UPD_DATE',
            'INS_WHO',
            'UPD_WHO',
            'DUE_EXT_DEPARTMENT'
        ],
        relations: [
            { name: 'EXT_DEPARTMENT_Ref', __type: 'DEPARTMENT', sf: 'ISN_CONTACT', tf: 'ISN_CONTACT' },
            { name: 'ORGANIZ_CL_Ref', __type: 'ORGANIZ_CL', sf: 'ISN_ORGANIZ', tf: 'ISN_NODE' }
        ]
    },
    CUSTOM_STORAGE: {
        pk: 'VALUE_ID',
        properties: {
            VALUE_ID: _t.s,
            VALUE: _t.s,
            OWNER_KIND: _t.i,
            OWNER_ID: _t.s,
            ORDERNUM: _t.i
        },
        readonly: [

        ],
        relations: [

        ]
    },
    CUSTOM_STORAGE_ID: {
        pk: 'VALUE_ID',
        properties: {
            VALUE_ID: _t.s
        },
        readonly: [

        ],
        relations: [
            { name: 'CUSTOM_STORAGE_List', __type: 'CUSTOM_STORAGE', sf: 'VALUE_ID', tf: 'VALUE_ID' }
        ]
    },
    DELIVERY_CL: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            DELETED: _t.i,
            PROTECTED: _t.i,
            WEIGHT: _t.i,
            CLASSIF_NAME: _t.s,
            NOTE: _t.s
        },
        readonly: [

        ],
        relations: [

        ]
    },
    DELO_BLOB: {
        pk: 'ISN_BLOB',
        properties: {
            ISN_BLOB: _t.i,
            CONTENTS: _t.s,
            EXTENSION: _t.s
        },
        readonly: [

        ],
        relations: [

        ]
    },
    DEPARTMENT: {
        pk: 'DUE',
        properties: {
            DUE: _t.s,
            ISN_NODE: _t.i,
            ISN_ORGANIZ: _t.i,
            ISN_HIGH_NODE: _t.i,
            LAYER: _t.i,
            IS_NODE: _t.i,
            WEIGHT: _t.i,
            MAXDUE: _t.s,
            CLASSIF_NAME: _t.s,
            SURNAME: _t.s,
            DUTY: _t.s,
            FULLNAME: _t.s,
            CODE: _t.s,
            SKYPE: _t.s,
            DUE_ORGANIZ: _t.s,
            DEPARTMENT_DUE: _t.s,
            PROTECTED: _t.i,
            DELETED: _t.i,
            ISN_CABINET: _t.i,
            ORDER_NUM: _t.i,
            DEPARTMENT_INDEX: _t.s,
            POST_H: _t.i,
            CARD_FLAG: _t.i,
            CARD_NAME: _t.s,
            NOTE: _t.s,
            START_DATE: _t.d,
            END_DATE: _t.d,
            ISN_CONTACT: _t.i,
            PHONE_LOCAL: _t.s,
            PHONE: _t.s,
            FAX: _t.s,
            E_MAIL: _t.s,
            NUM_CAB: _t.s,
            DUE_LINK_ORGANIZ: _t.s,
            ISN_PHOTO: _t.i,
            WDUE: _t.s,
            INS_DATE: _t.d,
            UPD_DATE: _t.d,
            INS_WHO: _t.i,
            UPD_WHO: _t.i,
            ID_GAS_PS: _t.s,
            NUMCREATION_FLAG: _t.i,
        },
        readonly: [

        ],
        relations: [
            { name: 'CABINET_Ref', __type: 'CABINET', sf: 'ISN_CABINET', tf: 'ISN_CABINET' },
            { name: 'CARD_Ref', __type: 'DEPARTMENT', sf: 'DEPARTMENT_DUE', tf: 'DUE' },
            { name: 'CONTACT_Ref', __type: 'CONTACT', sf: 'ISN_CONTACT', tf: 'ISN_CONTACT' },
            { name: 'LINK_ORGANIZ_Ref', __type: 'ORGANIZ_CL', sf: 'DUE_LINK_ORGANIZ', tf: 'DUE' },
            { name: 'ORGANIZ_Ref', __type: 'ORGANIZ_CL', sf: 'DUE_ORGANIZ', tf: 'DUE' },
            { name: 'PHOTO_Ref', __type: 'DELO_BLOB', sf: 'ISN_PHOTO', tf: 'ISN_BLOB' }
        ]
    },
    DG_FILE_CONSTRAINT: {
        pk: 'ISN_DOCGROUP',
        properties: {
            ISN_DOCGROUP: _t.i,
            CATEGORY: _t.s,
            MAX_SIZE: _t.i,
            ONE_FILE: _t.i,
            EXTENSIONS: _t.s,
            DUE: _t.s
        },
        readonly: [
            'DUE'
        ],
        relations: [
            { name: 'DOCGROUP_CL_Ref', __type: 'DOCGROUP_CL', sf: 'ISN_DOCGROUP', tf: 'ISN_NODE' }
        ]
    },
    DOC_DEFAULT: {
        properties: {
            DEFAULT_ID: _t.s,
            DEFAULT_TYPE: _t.s,
            KIND_DOC: _t.s,
            DESCRIPTION: _t.s,
            CLASSIF_ID: _t.i
        },
        readonly: [

        ],
        relations: [

        ]
    },
    DOC_DEFAULT_VALUE: {
        pk: 'DEFAULT_ID',
        properties: {
            DEFAULT_ID: _t.s,
            DUE: _t.s,
            ISN_DOCGROUP: _t.i,
            VALUE: _t.s
        },
        readonly: [
            'ISN_DOCGROUP'
        ],
        relations: [
            { name: 'DEFAULT_Ref', __type: 'DOC_DEFAULT', sf: 'DEFAULT_ID', tf: 'DEFAULT_ID' },
            { name: 'DOCGROUP_CL_Ref', __type: 'DOCGROUP_CL', sf: 'ISN_DOCGROUP', tf: 'ISN_NODE' }
        ]
    },
    DOC_TEMPLATES: {
        pk: 'ISN_TEMPLATE',
        properties: {
            ISN_TEMPLATE: _t.i,
            KIND_TEMPLATE: _t.i,
            NAME_TEMPLATE: _t.s,
            DESCRIPTION: _t.s,
            INFO: _t.s,
            DELETED: _t.i,
            PROTECTED: _t.i,
            WEIGHT: _t.i,
            CATEGORY: _t.s,
            FILECONTENTS: _t.s
        },
        readonly: [

        ],
        relations: [

        ]
    },
    DOCGROUP_CL: {
        pk: 'DUE',
        properties: {
            DUE: _t.s,
            ISN_NODE: _t.i,
            ISN_HIGH_NODE: _t.i,
            LAYER: _t.i,
            IS_NODE: _t.i,
            IS_COPYCOUNT: _t.i,
            WEIGHT: _t.i,
            MAXDUE: _t.s,
            CLASSIF_NAME: _t.s,
            FULLNAME: _t.s,
            CODE: _t.s,
            PROTECTED: _t.i,
            DELETED: _t.i,
            RC_TYPE: _t.i,
            DOCGROUP_INDEX: _t.s,
            DOCNUMBER_FLAG: _t.i,
            SHABLON: _t.s,
            EDS_FLAG: _t.i,
            ENCRYPT_FLAG: _t.i,
            TEST_UNIQ_FLAG: _t.i,
            PRJ_NUM_FLAG: _t.i,
            PRJ_SHABLON: _t.s,
            PRJ_WEIGHT: _t.i,
            PRJ_AUTO_REG: _t.i,
            PRJ_APPLY_EDS: _t.i,
            PRJ_APPLY2_EDS: _t.i,
            PRJ_APPLY_EXEC_EDS: _t.i,
            PRJ_DEL_AFTER_REG: _t.i,
            PRJ_TEST_UNIQ_FLAG: _t.i,
            E_DOCUMENT: _t.i,
            NOTE: _t.s,
            INS_DATE: _t.d,
            UPD_DATE: _t.d,
            INS_WHO: _t.i,
            UPD_WHO: _t.i,
            ACCESS_MODE: _t.i,
            INITIATIVE_RESOLUTION: _t.i,
            ACCESS_MODE_FIXED: _t.i
        },
        readonly: [

        ],
        relations: [
            { name: 'AR_DOCGROUP_List', __type: 'AR_DOCGROUP', sf: 'ISN_NODE', tf: 'ISN_DOCGROUP' },
            { name: 'DG_FILE_CONSTRAINT_List', __type: 'DG_FILE_CONSTRAINT', sf: 'ISN_NODE', tf: 'ISN_DOCGROUP' },
            // { name: 'DOC_DEFAULT_VALUE_List', __type: 'DOC_DEFAULT_VALUE', sf: 'ISN_NODE', tf: 'ISN_DOCGROUP' },
            // { name: 'PRJ_DEFAULT_VALUE_List', __type: 'PRJ_DEFAULT_VALUE', sf: 'ISN_NODE', tf: 'ISN_DOCGROUP' },
            // { name: 'SHABLON_DETAIL_List', __type: 'SHABLON_DETAIL', sf: 'DUE', tf: 'DUE' }
        ]
    },
    EDS_CATEGORY_CL: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            CLASSIF_NAME: _t.s,
            WEIGHT: _t.i,
            PROTECTED: _t.i,
            DELETED: _t.i,
            NOTE: _t.s
        },
        readonly: [

        ],
        relations: [

        ]
    },
    EVNT_FEED: {
        pk: 'ISL_EVENT',
        properties: {
            ISL_EVENT: _t.i,
            KIND_EVENT: _t.i,
            KIND_OBJECT: _t.i,
            OBJECT_ID: _t.s,
            DUE_DOCGROUP: _t.s,
            FLAGS: _t.s,
            TIME_STAMP: _t.d,
            DATA_I1: _t.i,
            DATA_S1: _t.s,
            DATA_D1: _t.d,
            DATA_I2: _t.i,
            DATA_S2: _t.s,
            DATA_D2: _t.d,
            DATA_I3: _t.i,
            DATA_S3: _t.s,
            DATA_D3: _t.d,
            DATA_I4: _t.i,
            DATA_S4: _t.s,
            DATA_D4: _t.d,
            DATA_I5: _t.i,
            DATA_S5: _t.s,
            DATA_D5: _t.d
        },
        readonly: [

        ],
        relations: [

        ]
    },
    EVNT_QUEUE_ITEM: {
        pk: 'ISN_SUBSCRIPTION',
        properties: {
            ISN_SUBSCRIPTION: _t.i,
            ISN_EVENT: _t.i,
            ISL_EVENT: _t.i,
            KIND_EVENT: _t.i,
            KIND_OBJECT: _t.i,
            OBJECT_ID: _t.s,
            DUE_DOCGROUP: _t.s,
            FLAGS: _t.s,
            DATA_I1: _t.i,
            DATA_S1: _t.s,
            DATA_D1: _t.d,
            DATA_I2: _t.i,
            DATA_S2: _t.s,
            DATA_D2: _t.d,
            DATA_I3: _t.i,
            DATA_S3: _t.s,
            DATA_D3: _t.d,
            DATA_I4: _t.i,
            DATA_S4: _t.s,
            DATA_D4: _t.d,
            DATA_I5: _t.i,
            DATA_S5: _t.s,
            DATA_D5: _t.d
        },
        readonly: [

        ],
        relations: [

        ]
    },
    FOLDER: {
        pk: 'ISN_FOLDER',
        properties: {
            ISN_FOLDER: _t.i,
            ISN_CABINET: _t.i,
            FOLDER_KIND: _t.i,
            USER_COUNT: _t.i
        },
        readonly: [

        ],
        relations: [
            { name: 'CABINET_Ref', __type: 'CABINET', sf: 'ISN_CABINET', tf: 'ISN_CABINET' }
        ]
    },
    LINK_CL: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            CLASSIF_NAME: _t.s,
            DELETED: _t.i,
            PROTECTED: _t.i,
            WEIGHT: _t.i,
            LINK_TYPE: _t.i,
            LINK_DIR: _t.i,
            LINK_INDEX: _t.s,
            ISN_PARE_LINK: _t.i,
            NOTE: _t.s,
            TRANSPARENT: _t.i
        },
        readonly: [

        ],
        relations: [
            { name: 'PARE_LINK_Ref', __type: 'LINK_CL', sf: 'ISN_PARE_LINK', tf: 'ISN_LCLASSIF' }
        ]
    },
    LIST_ITEMS: {
        pk: 'REF_ISN',
        properties: {
            REF_ISN: _t.i,
            ISN_LIST: _t.i,
            KIND_OBJ: _t.i,
            WEIGHT: _t.i,
            NOTE: _t.s
        },
        readonly: [

        ],
        relations: [
            { name: 'LIST_Ref', __type: 'USER_LISTS', sf: 'ISN_LIST', tf: 'ISN_LIST' }
        ]
    },
    NOMENKL_CL: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            DUE: _t.s,
            WEIGHT: _t.i,
            CLASSIF_NAME: _t.s,
            PROTECTED: _t.i,
            DELETED: _t.i,
            CLOSED: _t.i,
            SECURITY: _t.s,
            YEAR_NUMBER: _t.i,
            STORE_TIME: _t.i,
            SHELF_LIFE: _t.s,
            NOM_NUMBER: _t.s,
            NOTE: _t.s,
            END_YEAR: _t.i,
            ARTICLE: _t.s,
            INS_DATE: _t.d,
            UPD_DATE: _t.d,
            INS_WHO: _t.i,
            UPD_WHO: _t.i,
            CLOSE_WHO: _t.i,
            CLOSE_DATE: _t.d,
            DOC_UID: _t.s,
            ARCH_DATE: _t.d,
            ARCH_FLAG: _t.i,
            E_DOCUMENT: _t.i
        },
        readonly: [

        ],
        relations: [
            { name: 'DEPARTMENT_Ref', __type: 'DEPARTMENT', sf: 'DUE', tf: 'DUE' },
        ]
    },
    NTFY_SYSTEM_PARAMS: {
        pk: 'SERVICE_ID',
        properties: {
            SERVICE_ID: _t.s,
            SYSTEM_STATE: _t.i,
            MAX_EVENT_COUNT: _t.i,
            SERVICE_HOST: _t.s,
            SERVICE_PORT: _t.i,
            SERVICE_NAME: _t.s
        },
        readonly: [

        ],
        relations: [

        ]
    },
    NTFY_USER_EMAIL: {
        pk: 'ISN_USER',
        properties: {
            ISN_USER: _t.i,
            EMAIL: _t.s,
            IS_ACTIVE: _t.i,
            WEIGHT: _t.i,
            EXCLUDE_OPERATION: _t.s
        },
        readonly: [

        ],
        relations: [
            { name: 'USER_Ref', __type: 'USER_CL', sf: 'ISN_USER', tf: 'ISN_LCLASSIF' }
        ]
    },
    ORG_TYPE_CL: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            PROTECTED: _t.i,
            DELETED: _t.i,
            CLASSIF_NAME: _t.s,
            WEIGHT: _t.i,
            NOTE: _t.s
        },
        readonly: [

        ],
        relations: [

        ]
    },
    ORGANIZ_CL: {
        pk: 'DUE',
        properties: {
            DUE: _t.s,
            ISN_NODE: _t.i,
            ISN_HIGH_NODE: _t.i,
            LAYER: _t.i,
            IS_NODE: _t.i,
            WEIGHT: _t.i,
            MAXDUE: _t.s,
            CLASSIF_NAME_SEARCH: _t.s,
            CLASSIF_NAME: _t.s,
            PROTECTED: _t.i,
            DELETED: _t.i,
            FULLNAME: _t.s,
            ZIPCODE: _t.s,
            CITY: _t.s,
            ADDRESS: _t.s,
            MAIL_FOR_ALL: _t.i,
            NOTE: _t.s,
            NEW_RECORD: _t.i,
            OKPO: _t.s,
            INN: _t.s,
            ISN_REGION: _t.i,
            OKONH: _t.s,
            LAW_ADRESS: _t.s,
            ISN_ORGANIZ_TYPE: _t.i,
            SERTIFICAT: _t.s,
            ISN_ADDR_CATEGORY: _t.i,
            CODE: _t.s,
            OGRN: _t.s,
            // DUE_REGION: _t.s,
            INS_DATE: _t.d,
            UPD_DATE: _t.d,
            INS_WHO: _t.i,
            UPD_WHO: _t.i,
            // CONTACT_List: _t.dt
        },
        readonly: [
            'ISN_REGION'
        ],
        relations: [
            { name: 'ADDR_CATEGORY_Ref', __type: 'ADDR_CATEGORY_CL', sf: 'ISN_ADDR_CATEGORY', tf: 'ISN_LCLASSIF' },
            { name: 'AR_ORGANIZ_VALUE_List', __type: 'AR_ORGANIZ_VALUE', sf: 'ISN_NODE', tf: 'ISN_NODE' },
            { name: 'BANK_RECVISIT_List', __type: 'BANK_RECVISIT', sf: 'ISN_NODE', tf: 'ISN_ORGANIZ' },
            { name: 'CONTACT_List', __type: 'CONTACT', sf: 'ISN_NODE', tf: 'ISN_ORGANIZ' },
            { name: 'ORGANIZ_TYPE_Ref', __type: 'ORG_TYPE_CL', sf: 'ISN_ORGANIZ_TYPE', tf: 'ISN_LCLASSIF' },
            { name: 'PARENT_Ref', __type: 'ORGANIZ_CL', sf: 'ISN_HIGH_NODE', tf: 'ISN_NODE' },
            { name: 'REGION_Ref', __type: 'REGION_CL', sf: 'ISN_REGION', tf: 'ISN_NODE' }
        ]
    },
    PRJ_DEFAULT: {
        properties: {
            DEFAULT_ID: _t.s,
            DEFAULT_TYPE: _t.s,
            DESCRIPTION: _t.s,
            CLASSIF_ID: _t.i
        },
        readonly: [

        ],
        relations: [

        ]
    },
    PRJ_DEFAULT_VALUE: {
        pk: 'DEFAULT_ID',
        properties: {
            DEFAULT_ID: _t.s,
            DUE: _t.s,
            ISN_DOCGROUP: _t.i,
            VALUE: _t.s
        },
        readonly: [
            'ISN_DOCGROUP'
        ],
        relations: [
            { name: 'DEFAULT_Ref', __type: 'PRJ_DEFAULT', sf: 'DEFAULT_ID', tf: 'DEFAULT_ID' },
            { name: 'DOCGROUP_CL_Ref', __type: 'DOCGROUP_CL', sf: 'ISN_DOCGROUP', tf: 'ISN_NODE' }
        ]
    },
    PROT: {
        pk: 'TABLE_ID',
        properties: {
            TABLE_ID: _t.s,
            OPER_ID: _t.s,
            SUBOPER_ID: _t.s,
            OPER_DESCRIBE: _t.s,
            REF_ISN: _t.i,
            TIME_STAMP: _t.d,
            USER_ISN: _t.i,
            OPER_COMMENT: _t.s,
            ISN_PROT_INFO: _t.i
        },
        readonly: [
            'REF_ISN',
            'ISN_PROT_INFO'
        ],
        relations: [

        ]
    },
    PROT_NAME: {
        pk: 'TABLE_ID',
        properties: {
            TABLE_ID: _t.s,
            OPER_ID: _t.s,
            SUBOPER_ID: _t.s,
            OPER_DESCRIBE: _t.s,
            DESCRIPTION: _t.s,
            NOTE: _t.s,
            VIEW_PARM_POSITION: _t.i
        },
        readonly: [

        ],
        relations: [

        ]
    },
    READ_PROT: {
        pk: 'USER_ISN',
        properties: {
            USER_ISN: _t.i,
            TABLE_ID: _t.s,
            REF_ISN: _t.i,
            TIME_STAMP: _t.d
        },
        readonly: [
            'TIME_STAMP'
        ],
        relations: [

        ]
    },
    REESTRTYPE_CL: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            WEIGHT: _t.i,
            CLASSIF_NAME: _t.s,
            PROTECTED: _t.i,
            DELETED: _t.i,
            ISN_ADDR_CATEGORY: _t.i,
            ISN_DELIVERY: _t.i,
            FLAG_TYPE: _t.i,
            EMERGENCY: _t.s,
            IMPOTANCE: _t.s,
            GROUP_MAIL: _t.i,
            NOTE: _t.s
        },
        readonly: [

        ],
        relations: [
            { name: 'ADDR_CATEGORY_Ref', __type: 'ADDR_CATEGORY_CL', sf: 'ISN_ADDR_CATEGORY', tf: 'ISN_LCLASSIF' },
            { name: 'DELIVERY_Ref', __type: 'DELIVERY_CL', sf: 'ISN_DELIVERY', tf: 'ISN_LCLASSIF' }
        ]
    },
    REF_FILE: {
        pk: 'ISN_REF_FILE',
        properties: {
            ISN_REF_FILE: _t.i,
            ISN_FILE_TYPE: _t.i,
            ISN_REF_DOC: _t.i,
            ORDERNUM: _t.i,
            NAME: _t.s,
            STORAGE: _t.i,
            PATH: _t.s,
            FILESIZE: _t.i,
            FREE_NUM: _t.s,
            DOC_DATE: _t.d,
            DESCRIPTION: _t.s,
            CATEGORY: _t.s,
            KIND_DOC: _t.i,
            SECURLEVEL: _t.i,
            LOCK_FLAG: _t.i,
            ISN_USER_LOCK: _t.i,
            ISN_USER_EDIT: _t.i,
            SCAN_NUM: _t.i,
            EDS_CNT: _t.i,
            GR_STORAGE: _t.i,
            DONTDEL_FLAG: _t.i,
            ISN_USER_DONTDEL: _t.i,
            IS_HIDDEN: _t.i,
            APPLY_EDS: _t.i,
            SEND_ENABLED: _t.i,
            UPD_CONTENT_DATE: _t.d,
            INS_DATE: _t.d,
            UPD_DATE: _t.d,
            INS_WHO: _t.i,
            UPD_WHO: _t.i
        },
        readonly: [
            'ISN_USER_EDIT',
            'PATH',
            'GR_STORAGE',
            'INS_DATE',
            'UPD_DATE',
            'INS_WHO',
            'UPD_WHO'
        ],
        relations: [
            { name: 'USER_EDIT_Ref', __type: 'USER_CL', sf: 'ISN_USER_EDIT', tf: 'ISN_LCLASSIF' },
            { name: 'USER_LOCK_Ref', __type: 'USER_CL', sf: 'ISN_USER_LOCK', tf: 'ISN_LCLASSIF' },
            { name: 'DOC_Ref', __type: 'DOC_RC', sf: 'ISN_DELIVERY', tf: 'ISN_LCLASSIF' },
            { name: 'SECURITY_CL_Ref', __type: 'SECURITY_CL', sf: 'SECURLEVEL', tf: 'SECURLEVEL' }
        ]
    },
    REGION_CL: {
        pk: 'DUE',
        properties: {
            DUE: _t.s,
            ISN_NODE: _t.i,
            ISN_HIGH_NODE: _t.i,
            LAYER: _t.i,
            IS_NODE: _t.i,
            WEIGHT: _t.i,
            MAXDUE: _t.s,
            CLASSIF_NAME: _t.s,
            PROTECTED: _t.i,
            DELETED: _t.i,
            NOTE: _t.s,
            CODE: _t.i,
            COD_OKATO: _t.i
        },
        readonly: [

        ],
        relations: [

        ]
    },
    RESOLUTION_CATEGORY_CL: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            CLASSIF_NAME: _t.s,
            DELETED: _t.i,
            PROTECTED: _t.i,
            WEIGHT: _t.i,
            NOTE: _t.s,
            PLAN_COUNT_FLAG: _t.i,
            PLAN_DAY_COUNT: _t.i,
            PLAN_DAY_TYPE: _t.i,
            PLAN_PROTECTED: _t.i
        },
        readonly: [

        ],
        relations: [

        ]
    },
    RESPRJ_PRIORITY_CL: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            CLASSIF_NAME: _t.s,
            DELETED: _t.i,
            PROTECTED: _t.i,
            WEIGHT: _t.i,
            NOTE: _t.s
        },
        readonly: [

        ],
        relations: [

        ]
    },
    RESPRJ_STATUS_CL: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            CLASSIF_NAME: _t.s,
            DELETED: _t.i,
            PROTECTED: _t.i,
            WEIGHT: _t.i,
            NOTE: _t.s
        },
        readonly: [

        ],
        relations: [

        ]
    },
    RUBRIC_CL: {
        pk: 'DUE',
        properties: {
            DUE: _T.s,
            ISN_NODE: _T.i,
            ISN_HIGH_NODE: _T.i,
            LAYER: _T.i,
            IS_NODE: _T.i,
            WEIGHT: _T.i,
            MAXDUE: _T.s,
            CLASSIF_NAME: _T.s,
            FULLNAME: _T.s,
            PROTECTED: _t.i,
            DELETED: _T.i,
            RUBRIC_CODE: _T.s,
            CODE: _T.s,
            NOTE: _t.s,
            INS_DATE: _T.d,
            UPD_DATE: _T.d,
            INS_WHO: _T.i,
            UPD_WHO: _T.i

        },
        readonly: [
            'INS_DATE',
            'UPD_DATE',
            'INS_WHO',
            'UPD_WHO'
        ],
        relations: []
    },
    SECURITY_CL: {
        pk: 'SECURLEVEL',
        properties: {
            SECURLEVEL: _t.i,
            GRIF_NAME: _t.s,
            DELETED: _t.i,
            PROTECTED: _t.i,
            WEIGHT: _t.i,
            EDS_FLAG: _t.i,
            ENCRYPT_FLAG: _t.i,
            SEC_INDEX: _t.s,
            CONFIDENTIONAL: _t.i,
            NOTE: _t.s
        },
        readonly: [

        ],
        relations: [

        ]
    },
    SEV_ASSOCIATION: {
        pk: 'OBJECT_ID OBJECT_NAME',
        properties: {
            OBJECT_ID: _t.s,
            OBJECT_NAME: _t.s,
            GLOBAL_ID: _t.s,
            OWNER_ID: _t.s,
            SENDER_ID: _t.s
        },
        readonly: [

        ],
        relations: [

        ]
    },
    SEV_CHANNEL: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            CHANNEL_TYPE: _t.s,
            PARAMS: _t.s,
            WEIGHT: _t.i,
            CLASSIF_NAME: _t.s,
            DELETED: _t.i,
            PROTECTED: _t.i,
            NOTE: _t.s
        },
        readonly: [

        ],
        relations: [

        ]
    },
    SEV_COLLISION: {
        pk: 'COLLISION_CODE',
        properties: {
            COLLISION_CODE: _t.i,
            REASON_NUM: _t.i,
            COLLISION_NAME: _t.s,
            RESOLVE_TYPE: _t.i,
            DEFAULT_RESOLVE_TYPE: _t.i,
            ALLOWED_RESOLVE_TYPES: _t.s
        },
        readonly: [

        ],
        relations: [

        ]
    },
    SEV_PARTICIPANT: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            DUE_ORGANIZ: _t.s,
            ISN_CHANNEL: _t.i,
            WEIGHT: _t.i,
            CLASSIF_NAME: _t.s,
            ADDRESS: _t.s,
            DELETED: _t.i,
            PROTECTED: _t.i,
            NOTE: _t.s
        },
        readonly: [

        ],
        relations: [
            { name: 'CHANNEL_Ref', __type: 'SEV_CHANNEL', sf: 'ISN_CHANNEL', tf: 'ISN_LCLASSIF' },
            { name: 'ORGANIZ_Ref', __type: 'ORGANIZ_CL', sf: 'DUE_ORGANIZ', tf: 'DUE' },
            { name: 'SEV_PARTICIPANT_RULE_List', __type: 'SEV_PARTICIPANT_RULE', sf: 'ISN_LCLASSIF', tf: 'ISN_PARTICIPANT' }
        ]
    },
    SEV_PARTICIPANT_RULE: {
        pk: 'ISN_PARTICIPANT',
        properties: {
            ISN_PARTICIPANT: _t.i,
            ISN_RULE: _t.i,
            ORDERNUM: _t.i
        },
        readonly: [

        ],
        relations: [
            { name: 'PARTICIPANT_Ref', __type: 'SEV_PARTICIPANT', sf: 'ISN_PARTICIPANT', tf: 'ISN_LCLASSIF' },
            { name: 'RULE_Ref', __type: 'SEV_RULE', sf: 'ISN_RULE', tf: 'ISN_LCLASSIF' }
        ]
    },
    SEV_REPORT_EVENT: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            WEIGHT: _t.i,
            CLASSIF_NAME: _t.s,
            DELETED: _t.i,
            PROTECTED: _t.i,
            NOTE: _t.s
        },
        readonly: [

        ],
        relations: [

        ]
    },
    SEV_RULE: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            RULE_KIND: _t.i,
            CLASSIF_NAME: _t.s,
            DUE_DOCGROUP: _t.s,
            FILTER_CONFIG: _t.s,
            SCRIPT_CONFIG: _t.s,
            WEIGHT: _t.i,
            DELETED: _t.i,
            PROTECTED: _t.i,
            DUE_DEP: _t.s,
            NOTE: _t.s
        },
        readonly: [

        ],
        relations: [
            { name: 'DOCGROUP_Ref', __type: 'DOCGROUP_CL', sf: 'DUE_DOCGROUP', tf: 'DUE' },
            { name: 'DEPARTMENT_Ref', __type: 'DEPARTMENT', sf: 'DUE_DEP', tf: 'DUE' }
        ]
    },
    SEV_SYNC_REPORT: {
        pk: 'ISN_SEV_SYNC_REPORT',
        properties: {
            ISN_SEV_SYNC_REPORT: _t.i,
            ISN_PARTICIPANT: _t.i,
            FILE_SYNC_DATE: _t.d
        },
        readonly: [

        ],
        relations: [
            { name: 'PARTICIPANT_Ref', __type: 'SEV_PARTICIPANT', sf: 'ISN_PARTICIPANT', tf: 'ISN_LCLASSIF' }
        ]
    },
    SHABLON_DETAIL: {
        pk: 'DUE',
        properties: {
            ISN_LCLASSIF: _t.i,
            DUE: _t.s,
            ELEMENT: _t.s,
            CONSTR_TYPE: _t.s
        },
        readonly: [

        ],
        relations: [
            { name: 'DOCGROUP_Ref', __type: 'DOCGROUP_CL', sf: 'DUE', tf: 'DUE' },
            { name: 'LINK_CL_Ref', __type: 'LINK_CL', sf: 'ISN_LCLASSIF', tf: 'ISN_LCLASSIF' }
        ]
    },
    SIGN_KIND_CL: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            CLASSIF_NAME: _t.s,
            DELETED: _t.i,
            SIGN_TEXT: _t.s,
            PROTECTED: _t.i,
            WEIGHT: _t.i
        },
        readonly: [
            'NOTE'
        ],
        relations: [

        ]
    },
    SRCH_AR_HIER: {
        pk: 'HIER_KIND',
        properties: {
            HIER_KIND: _t.i,
            HIER_NAME: _t.s,
            HIER_USAGE: _t.s
        },
        readonly: [

        ],
        relations: [

        ]
    },
    SRCH_CATEGORY: {
        pk: 'DUE',
        properties: {
            DUE: _t.s,
            ISN_NODE: _t.i,
            ISN_HIGH_NODE: _t.i,
            LAYER: _t.i,
            IS_NODE: _t.i,
            WEIGHT: _t.i,
            KIND: _t.i,
            CLASSIF_NAME: _t.s,
            ISN_CRITERY: _t.i,
            PROTECTED: _t.i,
            DELETED: _t.i
        },
        readonly: [
            'PROTECTED'
        ],
        relations: [
            { name: 'SRCH_CRITERY_Ref', __type: 'SRCH_CRITERY', sf: 'ISN_CRITERY', tf: 'ISN_CRITERY' }
        ]
    },
    SRCH_CRITERY: {
        pk: 'ISN_CRITERY',
        properties: {
            ISN_CRITERY: _t.i,
            UOD: _t.s,
            UOD_PROP: _t.s,
            TREE_LABEL: _t.s,
            FORM_LABEL: _t.s,
            CRITERY_NAME: _t.s,
            KIND: _t.i
        },
        readonly: [

        ],
        relations: [

        ]
    },
    SRCH_REQ_DESC: {
        pk: 'ISN_REQUEST',
        properties: {
            ISN_REQUEST: _t.i,
            CRITERY_NAME: _t.s,
            VALUE: _t.s,
            DISP_VALUE: _t.s,
            RX_POS: _t.i,
            RY_POS: _t.i,
            R_HEIGHT: _t.i,
            R_WIDTH: _t.i,
            LX_POS: _t.i,
            LY_POS: _t.i,
            L_HEIGHT: _t.i,
            L_WIDTH: _t.i,
            TAB_ORDER: _t.i
        },
        readonly: [

        ],
        relations: [
            { name: 'SRCH_REQUEST_Ref', __type: 'SRCH_REQUEST', sf: 'ISN_REQUEST', tf: 'ISN_REQUEST' }
        ]
    },
    SRCH_REQUEST: {
        pk: 'ISN_REQUEST',
        properties: {
            ISN_REQUEST: _t.i,
            REQUEST_NAME: _t.s,
            SRCH_KIND_NAME: _t.s,
            PERSONAL: _t.i,
            UTILITY_KIND: _t.i,
            PROTECTED: _t.i,
            CUSTOMIZATION: _t.i,
            PARAMS: _t.s,
            BASE_CONTROL: _t.s,
            AUTO_DISTRIBUTE: _t.i,
            ISN_VIEW: _t.i
        },
        readonly: [

        ],
        relations: [
            { name: 'SRCH_REQ_DESC_List', __type: 'SRCH_REQ_DESC', sf: 'ISN_REQUEST', tf: 'ISN_REQUEST' }
        ]
    },
    SRCH_VIEW: {
        pk: 'ISN_VIEW',
        properties: {
            ISN_VIEW: _t.i,
            SRCH_KIND_NAME: _t.s,
            VIEW_NAME: _t.s,
            PERSONAL: _t.i,
            PROTECTED: _t.i,
            CUSTOMIZATION: _t.i,
            BASE_CONTROL: _t.s,
            SORT_DIRECTION: _t.i,
            PARAMS: _t.s,
            ORDERBY: _t.s,
            PAGE_SIZE: _t.i,
            AUTO_REFRESH: _t.i,
            HEIGHT: _t.i
        },
        readonly: [

        ],
        relations: [
            { name: 'SRCH_VIEW_DESC_List', __type: 'SRCH_VIEW_DESC', sf: 'ISN_VIEW', tf: 'ISN_VIEW' }
        ]
    },
    SRCH_VIEW_DESC: {
        pk: 'ISN_VIEW_DESC',
        properties: {
            ISN_VIEW_DESC: _t.i,
            ISN_VIEW: _t.i,
            ORDERNUM: _t.i,
            ROW_NUM: _t.i,
            COLUMN_NUM: _t.i,
            LABEL: _t.s,
            BLOCK_ID: _t.s,
            PARAMS: _t.s
        },
        readonly: [

        ],
        relations: [

        ]
    },
    STATUS_EXEC_CL: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            CLASSIF_NAME: _t.s,
            DELETED: _t.i,
            PROTECTED: _t.i,
            WEIGHT: _t.i,
            NOTE: _t.s
        },
        readonly: [

        ],
        relations: [

        ]
    },
    STATUS_REPLY_CL: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            CLASSIF_NAME: _t.s,
            DELETED: _t.i,
            PROTECTED: _t.i,
            WEIGHT: _t.i,
            NOTE: _t.s
        },
        readonly: [

        ],
        relations: [

        ]
    },
    STTEXT: {
        pk: 'ISN_STTEXT',
        properties: {
            ISN_STTEXT: _t.i,
            ISN_STTEXT_LIST: _t.i,
            CODE: _t.s,
            STTEXT: _t.s,
            WEIGHT: _t.i
        },
        readonly: [

        ],
        relations: [
            { name: 'STTEXT_LIST_Ref', __type: 'STTEXT_LIST', sf: 'ISN_STTEXT_LIST', tf: 'ISN_STTEXT_LIST' }
        ]
    },
    STTEXT_CONTROL: {
        pk: 'ISN_USER',
        properties: {
            ISN_USER: _t.i,
            ISN_STTEXT_LIST: _t.i,
            CONTROL_ID: _t.s
        },
        readonly: [

        ],
        relations: [
            { name: 'STTEXT_LIST_Ref', __type: 'STTEXT_LIST', sf: 'ISN_STTEXT_LIST', tf: 'ISN_STTEXT_LIST' },
            { name: 'USER_Ref', __type: 'USER_CL', sf: 'ISN_USER', tf: 'ISN_LCLASSIF' }
        ]
    },
    STTEXT_LIST: {
        pk: 'ISN_STTEXT_LIST',
        properties: {
            ISN_STTEXT_LIST: _t.i,
            ISN_USER: _t.i,
            LIST_NAME: _t.s,
            REF_ISN_STTEXT_LIST: _t.i,
            ALL_FLAG: _t.i,
            WEIGHT: _t.i
        },
        readonly: [

        ],
        relations: [
            { name: 'PARENT_STTEXT_LIST_Ref', __type: 'STTEXT_LIST', sf: 'REF_ISN_STTEXT_LIST', tf: 'ISN_STTEXT_LIST' },
            { name: 'STTEXT_List', __type: 'STTEXT', sf: 'ISN_STTEXT_LIST', tf: 'ISN_STTEXT_LIST' },
            { name: 'USER_Ref', __type: 'USER_CL', sf: 'ISN_USER', tf: 'ISN_LCLASSIF' }
        ]
    },
    SYS_PARMS: {
        properties: {
            ISN_USER_OWNER: _t.i,
            DBMS: _t.s
        },
        readonly: [

        ],
        relations: [

        ]
    },
    TEMP_RC: {
        pk: 'ISN_TEMP_RC',
        properties: {
            ISN_TEMP_RC: _t.i,
            WAPI_SESSION_SID: _t.s,
            OPERATION_KEY: _t.s,
            EXPIRATION_DATE: _t.d,
            INS_WHO: _t.i,
            INS_DATE: _t.d
        },
        readonly: [
            'INS_WHO',
            'INS_DATE'
        ],
        relations: [
            { name: 'REF_FILE_List', __type: 'REF_FILE', sf: 'ISN_TEMP_RC', tf: 'ISN_REF_DOC' }
        ]
    },
    USER_AUDIT: {
        pk: 'ISN_EVENT',
        properties: {
            ISN_EVENT: _t.i,
            ISN_USER: _t.i,
            ISN_WHO: _t.i,
            EVENT_DATE: _t.d,
            EVENT_KIND: _t.i
        },
        readonly: [

        ],
        relations: [
            { name: 'REF_FILE_List', __type: 'REF_FILE', sf: 'ISN_EVENT', tf: 'ISN_REF_DOC' },
            { name: 'USER_Ref', __type: 'USER_CL', sf: 'ISN_USER', tf: 'ISN_LCLASSIF' },
            { name: 'WHO_Ref', __type: 'USER_CL', sf: 'ISN_WHO', tf: 'ISN_LCLASSIF' }
        ]
    },
    USER_CABINET: {
        pk: 'ISN_CABINET',
        properties: {
            ISN_CABINET: _t.i,
            ISN_LCLASSIF: _t.i,
            FOLDERS_AVAILABLE: _t.s,
            ORDER_WORK: _t.i,
            HOME_CABINET: _t.i,
            HIDE_INACCESSIBLE: _t.i,
            HIDE_INACCESSIBLE_PRJ: _t.i,
            DEPARTMENT_DUE: _t.s
        },
        readonly: [

        ],
        relations: [
            { name: 'CABINET_Ref', __type: 'CABINET', sf: 'ISN_CABINET', tf: 'ISN_CABINET' },
            { name: 'USER_Ref', __type: 'USER_CL', sf: 'ISN_LCLASSIF', tf: 'ISN_LCLASSIF' },
            { name: 'DEPARTMENT_Ref', __type: 'DEPARTMENT', sf: 'DEPARTMENT_DUE', tf: 'DUE' },
            { name: 'USERCARD_Ref', __type: 'USERCARD', sf: 'ISN_LCLASSIF', tf: 'ISN_LCLASSIF' }
        ]
    },
    USER_CARD_DOCGROUP: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            DUE_CARD: _t.s,
            DUE: _t.s,
            FUNC_NUM: _t.i,
            ALLOWED: _t.i
        },
        readonly: [

        ],
        relations: [
            { name: 'DOCGROUP_Ref', __type: 'DOCGROUP_CL', sf: 'DUE', tf: 'DUE' },
            { name: 'USER_Ref', __type: 'USER_CL', sf: 'ISN_LCLASSIF', tf: 'ISN_LCLASSIF' },
            { name: 'USERCARD_Ref', __type: 'USERCARD', sf: 'ISN_LCLASSIF', tf: 'ISN_LCLASSIF' }
        ]
    },
    USER_CERT_PROFILE: {
        pk: 'ISN_CERT_PROFILE',
        properties: {
            ISN_CERT_PROFILE: _t.i,
            ISN_USER: _t.i,
            ID_CERTIFICATE: _t.s
        },
        readonly: [

        ],
        relations: [
            { name: 'USER_Ref', __type: 'USER_CL', sf: 'ISN_USER', tf: 'ISN_LCLASSIF' }

        ]
    },
    USER_CERTIFICATE: {
        pk: 'ISN_USER',
        properties: {
            ISN_USER: _t.i,
            SIGN_CERT: _t.s,
            ENC_CERT: _t.s,
            SIGN_MAIL_CERT: _t.s,
            ENC_MAIL_CERT: _t.s
        },
        readonly: [

        ],
        relations: [
            { name: 'USER_Ref', __type: 'USER_CL', sf: 'ISN_USER', tf: 'ISN_LCLASSIF' }
        ]
    },
    USER_CL: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            SECURLEVEL: _t.i,
            DUE_DEP: _t.s,
            WEIGHT: _t.i,
            SURNAME_PATRON: _t.s,
            PROTECTED: _t.i,
            DELETED: _t.i,
            CLASSIF_NAME: _t.s,
            PASSWORD: _t.s,
            NOTE: _t.s,
            ORACLE_ID: _t.s,
            ADMIN: _t.i,
            USERTYPE: _t.i,
            AV_SYSTEMS: _t.s,
            ADM_SYSTEMS: _t.s,
            DELO_RIGHTS: _t.s,
            STREAM_SCAN_RIGHTS: _t.s,
            ARCHIVE_RIGTHS: _t.s,
            TECH_RIGHTS: _t.s,
            LOGIN_ATTEMPTS: _t.i,
            IS_PASSWORD: _t.i,
            IS_SECUR_ADM: _t.i,
            PASSWORD_DATE: _t.d,
            TECH_DUE_DEP: _t.s,
            NOTE2: _t.s
        },
        readonly: [

        ],
        relations: [
            { name: 'DEP_Ref', __type: 'DEPARTMENT', sf: 'DUE_DEP', tf: 'DUE' },
            { name: 'NTFY_USER_EMAIL_List', __type: 'NTFY_USER_EMAIL', sf: 'ISN_LCLASSIF', tf: 'ISN_USER' },
            { name: 'STTEXT_CONTROL_List', __type: 'STTEXT_CONTROL', sf: 'ISN_LCLASSIF', tf: 'ISN_USER' },
            { name: 'TECH_DEP_Ref', __type: 'DEPARTMENT', sf: 'TECH_DUE_DEP', tf: 'DUE' },
            { name: 'UFOLDER_List', __type: 'UFOLDER', sf: 'ISN_LCLASSIF', tf: 'ISN_USER' },
            { name: 'USER_CERTIFICATE_List', __type: 'USER_CERTIFICATE', sf: 'ISN_LCLASSIF', tf: 'ISN_USER' },
            { name: 'USER_DOCGROUP_ACCESS_List', __type: 'USER_DOCGROUP_ACCESS', sf: 'ISN_LCLASSIF', tf: 'ISN_LCLASSIF' },
            { name: 'USER_ORGANIZ_List', __type: 'USER_ORGANIZ', sf: 'ISN_LCLASSIF', tf: 'ISN_LCLASSIF' },
            { name: 'USER_PARMS_List', __type: 'USER_PARMS', sf: 'ISN_LCLASSIF', tf: 'ISN_USER_OWNER' },
            { name: 'USER_REQUEST_List', __type: 'USER_REQUEST', sf: 'ISN_LCLASSIF', tf: 'ISN_USER' },
            { name: 'USER_TECH_List', __type: 'USER_TECH', sf: 'ISN_LCLASSIF', tf: 'ISN_LCLASSIF' },
            { name: 'USER_VIEW_List', __type: 'USER_VIEW', sf: 'ISN_LCLASSIF', tf: 'ISN_USER' },
            { name: 'USERCARD_List', __type: 'USERCARD', sf: 'ISN_LCLASSIF', tf: 'ISN_LCLASSIF' },
            { name: 'USERDEP_List', __type: 'USERDEP', sf: 'ISN_LCLASSIF', tf: 'ISN_LCLASSIF' },
            { name: 'USERSECUR_List', __type: 'USERSECUR', sf: 'ISN_LCLASSIF', tf: 'ISN_LCLASSIF' }
        ]
    },
    USER_DOCGROUP_ACCESS: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            DUE: _t.s,
            ALLOWED: _t.i
        },
        readonly: [

        ],
        relations: [
            { name: 'DOCGROUP_Ref', __type: 'DOCGROUP_CL', sf: 'DUE', tf: 'DUE' },
            { name: 'USER_Ref', __type: 'USER_CL', sf: 'ISN_LCLASSIF', tf: 'ISN_LCLASSIF' }
        ]
    },
    USER_LISTS: {
        pk: 'ISN_LIST',
        properties: {
            ISN_LIST: _t.i,
            REF_ISN_LIST: _t.i,
            NAME: _t.s,
            ISN_LCLASSIF: _t.i,
            CLASSIF_ID: _t.i,
            WEIGHT: _t.i,
            ALL_FLAG: _t.i,
            LIST_KIND: _t.i
        },
        readonly: [

        ],
        relations: [
            { name: 'LIST_ITEMS_List', __type: 'LIST_ITEMS', sf: 'ISN_LIST', tf: 'ISN_LIST' },
            { name: 'PARENT_USER_LIST_Ref', __type: 'USER_LISTS', sf: 'ISN_LIST', tf: 'REF_ISN_LIST' },
            { name: 'USER_Ref', __type: 'USER_CL', sf: 'ISN_LCLASSIF', tf: 'ISN_LCLASSIF' }
        ]
    },
    USER_ORGANIZ: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            DUE: _t.s,
            FUNC_NUM: _t.i,
            WEIGHT: _t.i
        },
        readonly: [

        ],
        relations: [
            { name: 'ORGANIZ_Ref', __type: 'ORGANIZ_CL', sf: 'DUE', tf: 'DUE' },
            { name: 'USER_Ref', __type: 'USER_CL', sf: 'ISN_LCLASSIF', tf: 'ISN_LCLASSIF' }
        ]
    },
    USER_PARMS: {
        pk: 'ISN_USER_OWNER',
        properties: {
            ISN_USER_OWNER: _t.i,
            PARM_NAME: _t.s,
            PARM_GROUP: _t.i,
            PARM_VALUE: _t.s
        },
        readonly: [

        ],
        relations: [
            { name: 'USER_Ref', __type: 'USER_CL', sf: 'ISN_USER_OWNER', tf: 'ISN_LCLASSIF' }
        ]
    },
    USER_RIGHT_DOCGROUP: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            FUNC_NUM: _t.i,
            DUE: _t.s,
            ALLOWED: _t.i
        },
        readonly: [

        ],
        relations: [
            { name: 'DOCGROUP_Ref', __type: 'DOCGROUP_CL', sf: 'DUE', tf: 'DUE' },
            { name: 'USER_Ref', __type: 'USER_CL', sf: 'ISN_LCLASSIF', tf: 'ISN_LCLASSIF' }
        ]
    },
    USER_TECH: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            FUNC_NUM: _t.i,
            DUE: _t.s,
            CLASSIF_ID: _t.i,
            ALLOWED: _t.i
        },
        readonly: [

        ],
        relations: [
            { name: 'USER_Ref', __type: 'USER_CL', sf: 'ISN_LCLASSIF', tf: 'ISN_LCLASSIF' }
        ]
    },
    USER_VIEW: {
        pk: 'ISN_USER',
        properties: {
            ISN_USER: _t.i,
            ISN_VIEW: _t.i,
            WEIGHT: _t.i,
            SRCH_KIND_NAME: _t.s
        },
        readonly: [

        ],
        relations: [
            { name: 'USER_Ref', __type: 'USER_CL', sf: 'ISN_USER', tf: 'ISN_LCLASSIF' },
            { name: 'VIEW_Ref', __type: 'SRCH_VIEW', sf: 'ISN_VIEW', tf: 'ISN_VIEW' }
        ]
    },
    USER_REQUEST: {
        pk: 'ISN_USER',
        properties: {
            ISN_USER: _t.i,
            ISN_REQUEST: _t.i,
            WEIGHT: _t.i,
            PARAMS: _t.s,
            SRCH_KIND_NAME: _t.s
        },
        readonly: [

        ],
        relations: [
            { name: 'USER_Ref', __type: 'USER_CL', sf: 'ISN_USER', tf: 'ISN_LCLASSIF' },
            { name: 'REQUEST_Ref', __type: 'SRCH_REQUEST', sf: 'ISN_REQUEST', tf: 'ISN_REQUEST' }
        ]
    },
    USERCARD: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            DUE: _t.s,
            HOME_CARD: _t.i,
            FUNCLIST: _t.s
        },
        readonly: [

        ],
        relations: [
            { name: 'USER_Ref', __type: 'USER_CL', sf: 'ISN_LCLASSIF', tf: 'ISN_LCLASSIF' },
            { name: 'CARD_Ref', __type: 'DEPARTMENT', sf: 'DUE', tf: 'DUE' },
            { name: 'USER_CABINET_List', __type: 'USER_CABINET', sf: 'ISN_LCLASSIF', tf: 'ISN_LCLASSIF' },
            { name: 'USER_CARD_DOCGROUP_List', __type: 'USER_CARD_DOCGROUP', sf: 'ISN_LCLASSIF', tf: 'ISN_LCLASSIF' }
        ]
    },
    USERDEP: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            FUNC_NUM: _t.i,
            DUE: _t.s,
            WEIGHT: _t.i,
            DEEP: _t.i,
            ALLOWED: _t.i
        },
        readonly: [

        ],
        relations: [
            { name: 'DEPARTMENT_Ref', __type: 'DEPARTMENT', sf: 'DUE', tf: 'DUE' },
            { name: 'USER_Ref', __type: 'USER_CL', sf: 'ISN_LCLASSIF', tf: 'ISN_LCLASSIF' }
        ]
    },
    USERSECUR: {
        pk: 'SECURLEVEL',
        properties: {
            SECURLEVEL: _t.i,
            ISN_LCLASSIF: _t.i,
            WEIGHT: _t.i
        },
        readonly: [

        ],
        relations: [
            { name: 'SECURITY_CL_Ref', __type: 'SECURITY_CL', sf: 'SECURLEVEL', tf: 'SECURLEVEL' },
            { name: 'USER_Ref', __type: 'USER_CL', sf: 'ISN_LCLASSIF', tf: 'ISN_LCLASSIF' }
        ]
    },
    VISA_TYPE_CL: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            CLASSIF_NAME: _t.s,
            PROTECTED: _t.i,
            DELETED: _t.i,
            NOTE: _t.s,
            WEIGHT: _t.i,
            IS_FINAL: _t.i,
            STATUS: _t.s
        },
        readonly: [

        ],
        relations: [

        ]
    },
    SEV_SUBSCRIBE: { pk: 'ISN_SUBSCRIBE',
        properties: {
            ISN_SUBSCRIBE: _t.i,
            ISN_DOC: _t.i,
            KIND_DOC: _t.i,
            DUE_OWNER_ORGANIZ: _t.s,
            PARTICIPANT_ISN: _t.i,
            RETURN_ID: _t.s,
            EDMS_NAME: _t.s,
            EDMS_VERSION: _t.s,
            EDMS_UID: _t.s,
            DOC_UID: _t.s,
            DOC_VERSION_UID: _t.s,
            DOC_NUMBER: _t.s,
            DOC_DATE: _t.i,
            DOC_GROUP: _t.s,
            DOC_GROUP_UID: _t.s,
            SUBSCRIPTIONS: _t.s,
            HASH: _t.s,
            TASKS_UIDS: _t.s,
            VISA_SIGN_UIDS: _t.s
        },
        readonly: [

        ],
        relations: [

        ] },
    DEPARTMENT_REPL: {
        pk: 'ISN_DEPARTMENT_REPL',
        properties: {
            ISN_DEPARTMENT_REPL: _t.i,
            DUE_DEP: _t.s,
            DUE_REPL: _t.s,
            START_DATE: _t.d,
            END_DATE: _t.d
        },
        readonly: [

        ],
        relations: [

        ]
    },
    // NADZOR
    NP_ADDRESS_VID_CL: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            PROTECTED: _t.i,
            DELETED: _t.i,
            CLASSIF_NAME: _t.s,
            WEIGHT: _t.i,
            NOTE: _t.s
        },
        readonly: [],
        relations: []
    },
    NP_UDOST_TYPE_CL: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            PROTECTED: _t.i,
            DELETED: _t.i,
            CLASSIF_NAME: _t.s,
            WEIGHT: _t.i,
            NOTE: _t.s
        },
        readonly: [],
        relations: []
    },
    NP_SUDIM_CL: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            PROTECTED: _t.i,
            DELETED: _t.i,
            CLASSIF_NAME: _t.s,
            WEIGHT: _t.i,
            NOTE: _t.s
        },
        readonly: [],
        relations: []
    },
    NP_OSNZADER_CL: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            ISN_CODEX_TYPE: _t.i,
            PROTECTED: _t.i,
            DELETED: _t.i,
            CLASSIF_NAME: _t.s,
            WEIGHT: _t.i,
            NOTE: _t.s
        },
        readonly: [],
        relations: [
            {name: 'NP_CODEX_TYPE_CL_Ref', __type: 'NP_CODEX_TYPE_CL', sf: 'ISN_LCLASSIF', tf: 'ISN_LCLASSIF'}
        ]
    },
    NP_OSN_OSVOB_CL: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            ISN_CODEX_TYPE: _t.i,
            PROTECTED: _t.i,
            DELETED: _t.i,
            CLASSIF_NAME: _t.s,
            WEIGHT: _t.i,
            NOTE: _t.s
        },
        readonly: [],
        relations: [
            {name: 'NP_CODEX_TYPE_CL_Ref', __type: 'NP_CODEX_TYPE_CL', sf: 'ISN_LCLASSIF', tf: 'ISN_LCLASSIF'}
        ]
    },
    NP_CODEX_TYPE_CL: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            PROTECTED: _t.i,
            DELETED: _t.i,
            CLASSIF_NAME_SHORT: _t.s,
            CLASSIF_NAME_FULL: _t.s,
            WEIGHT: _t.i,
            NOTE: _t.s
        },
        readonly: [],
        relations: []
    },
    NP_MERA_TYPE_CL: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            PROTECTED: _t.i,
            DELETED: _t.i,
            CLASSIF_NAME: _t.s,
            WEIGHT: _t.i,
            NOTE: _t.s
        },
        readonly: [],
        relations: []
    },
    NP_MERA_OSNOV_CL: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            PROTECTED: _t.i,
            DELETED: _t.i,
            CLASSIF_NAME: _t.s,
            WEIGHT: _t.i,
            NOTE: _t.s
        },
        readonly: [],
        relations: []
    },
    NP_SUD_TYPE_CL: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            PROTECTED: _t.i,
            DELETED: _t.i,
            CLASSIF_NAME: _t.s,
            WEIGHT: _t.i,
            NOTE: _t.s
        },
        readonly: [],
        relations: []
    },
    NP_NAKAZ_TYPE_CL: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            PROTECTED: _t.i,
            DELETED: _t.i,
            CLASSIF_NAME: _t.s,
            WEIGHT: _t.i,
            NOTE: _t.s
        },
        readonly: [],
        relations: []
    },
    NP_OB_WHAT_CL: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            PROTECTED: _t.i,
            DELETED: _t.i,
            CLASSIF_NAME: _t.s,
            WEIGHT: _t.i,
            NOTE: _t.s
        },
        readonly: [],
        relations: []
    },
    NP_OB_VOSST_CL: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            PROTECTED: _t.i,
            DELETED: _t.i,
            CLASSIF_NAME: _t.s,
            WEIGHT: _t.i,
            NOTE: _t.s
        },
        readonly: [],
        relations: []
    },
    NP_OPF_CL: {
        pk: 'ISN_LCLASSIF',
        properties: {
            CODE: _t.s,
            ISN_LCLASSIF: _t.i,
            PROTECTED: _t.i,
            DELETED: _t.i,
            CLASSIF_NAME: _t.s,
            WEIGHT: _t.i,
            NOTE: _t.s
        },
        readonly: [],
        relations: []
    },
    NP_OB_NOMOVE_CL: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            PROTECTED: _t.i,
            DELETED: _t.i,
            CLASSIF_NAME: _t.s,
            WEIGHT: _t.i,
            NOTE: _t.s
        },
        readonly: [],
        relations: []
    },
    NP_SPEC_SUBJECT_CL: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            PROTECTED: _t.i,
            DELETED: _t.i,
            CLASSIF_NAME: _t.s,
            WEIGHT: _t.i,
            NOTE: _t.s
        },
        readonly: [],
        relations: []
    },
    NP_NARUSHEN_CL: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            PROTECTED: _t.i,
            DELETED: _t.i,
            CLASSIF_NAME: _t.s,
            WEIGHT: _t.i,
            NOTE: _t.s
        },
        readonly: [],
        relations: []
    },
    NP_NEZ_METOD_RASSLED_CL: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            PROTECTED: _t.i,
            DELETED: _t.i,
            CLASSIF_NAME: _t.s,
            WEIGHT: _t.i,
            NOTE: _t.s
        },
        readonly: [],
        relations: []
    },
    NP_RESULT_RASSLED_CL: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            PROTECTED: _t.i,
            DELETED: _t.i,
            CLASSIF_NAME: _t.s,
            WEIGHT: _t.i,
            NOTE: _t.s
        },
        readonly: [],
        relations: []
    },
    NP_OSN_PRIN_RESH_CL: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            PROTECTED: _t.i,
            DELETED: _t.i,
            CLASSIF_NAME: _t.s,
            WEIGHT: _t.i,
            NOTE: _t.s
        },
        readonly: [],
        relations: []
    },
    NP_MERA_REAGIR_CL: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            PROTECTED: _t.i,
            DELETED: _t.i,
            CLASSIF_NAME: _t.s,
            WEIGHT: _t.i,
            NOTE: _t.s
        },
        readonly: [],
        relations: []
    },
    NP_STATUS_CL: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            PROTECTED: _t.i,
            DELETED: _t.i,
            CLASSIF_NAME: _t.s,
            WEIGHT: _t.i,
            NOTE: _t.s,
            CLEAR_CABINET: _t.i
        },
        readonly: [],
        relations: []
    },
    NP_FIG_ROLE_CL: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            PROTECTED: _t.i,
            DELETED: _t.i,
            CLASSIF_NAME: _t.s,
            WEIGHT: _t.i,
            NOTE: _t.s,
            ARH_FLAG: _t.i
        },
        readonly: [],
        relations: []
    },
    NP_OB_TYPE_CL: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            PROTECTED: _t.i,
            DELETED: _t.i,
            CLASSIF_NAME: _t.s,
            WEIGHT: _t.i,
            USE_C: _t.i,
            USE_A: _t.i,
            USE_N: _t.i,
            NOTE: _t.s
        },
        readonly: [],
        relations: []
    },
    NP_SPOSOB_UKR_PR_CL: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            PROTECTED: _t.i,
            DELETED: _t.i,
            CLASSIF_NAME: _t.s,
            WEIGHT: _t.i,
            ISP_OTKAZ: _t.i,
            ISP_ISTOCH: _t.i,
            NOTE: _t.s
        },
        readonly: [],
        relations: []
    },
    NP_OB_MOTIV_CL: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            PROTECTED: _t.i,
            DELETED: _t.i,
            CLASSIF_NAME: _t.s,
            WEIGHT: _t.i,
            USE_C: _t.i,
            USE_A: _t.i,
            USE_N: _t.i,
            NOTE: _t.s
        },
        readonly: [],
        relations: []
    },
    NP_OB_OTZIV_CL: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            PROTECTED: _t.i,
            DELETED: _t.i,
            CLASSIF_NAME: _t.s,
            WEIGHT: _t.i,
            USE_C: _t.i,
            USE_A: _t.i,
            USE_N: _t.i,
            USE_VP: _t.i,
            USE_NP: _t.i,
            NOTE: _t.s
        },
        readonly: [],
        relations: []
    },
    NP_OB_RETURN_CL: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            PROTECTED: _t.i,
            DELETED: _t.i,
            CLASSIF_NAME: _t.s,
            WEIGHT: _t.i,
            USE_C: _t.i,
            USE_A: _t.i,
            USE_N: _t.i,
            NOTE: _t.s
        },
        readonly: [],
        relations: []
    },
    NP_OB_OSNOV_CL: {
        pk: 'ISN_LCLASSIF',
        properties: {
            ISN_LCLASSIF: _t.i,
            PROTECTED: _t.i,
            DELETED: _t.i,
            CLASSIF_NAME: _t.s,
            WEIGHT: _t.i,
            USE_C: _t.i,
            USE_A: _t.i,
            USE_N: _t.i,
            USE_VP: _t.i,
            USE_NP: _t.i,
            NOTE: _t.s
        },
        readonly: [],
        relations: []
    },
    NP_RESHEN_CL: {
        pk: 'DUE',
        properties: {
            DUE: _t.s,
            ISN_NODE: _t.i,
            MAXDUE: _t.s,
            LAYER: _t.i,
            IS_NODE: _t.i,
            ISN_HIGH_NODE: _t.i,
            CLASSIF_NAME: _t.s,
            PROTECTED: _t.i,
            DELETED: _t.i,
            ID_GAS_PS: _t.s,
            NOTE: _t.s,
            WEIGHT: _t.i
        },
        readonly: ['PROTECTED'],
        relations: [
            { name: 'PARENT_Ref', __type: 'NP_RESHEN_CL', sf: 'DUE', tf: 'DUE' }
        ]
    },
    NP_SUD_RESHEN_TYPE_CL: {
        pk: 'DUE',
        properties: {
            DUE: _t.s,
            ISN_NODE: _t.i,
            ISN_HIGH_NODE: _t.i,
            MAXDUE: _t.s,
            LAYER: _t.i,
            IS_NODE: _t.i,
            CLASSIF_NAME: _t.s,
            WEIGHT: _t.i,
            PROTECTED: _t.i,
            DELETED: _t.i,
            NOTE: _t.s
        },
        readonly: [
            'PROTECTED'
        ],
        relations: [
            { name: 'PARENT_Ref', __type: 'NP_SUD_RESHEN_TYPE_CL', sf: 'DUE', tf: 'DUE' }
        ]

    },
    NP_OSN_PRED_DELA_CL: {
        pk: 'DUE',
        properties: {
            DUE: _t.s,
            ISN_NODE: _t.i,
            ISN_HIGH_NODE: _t.i,
            MAXDUE: _t.s,
            LAYER: _t.i,
            IS_NODE: _t.i,
            CLASSIF_NAME: _t.s,
            WEIGHT: _t.i,
            PROTECTED: _t.i,
            DELETED: _t.i,
            NOTE: _t.s
        },
        readonly: [
            'PROTECTED'
        ],
        relations: [
            // { name: 'PARENT_Ref', __type: 'NP_OSN_PRED_DELA_CL', sf: 'ISN_NODE', tf: 'ISN_HIGH_NODE' }
            { name: 'PARENT_Ref', __type: 'NP_OSN_PRED_DELA_CL', sf: 'DUE', tf: 'DUE' }
        ]

    },
    NP_NUMCREATION: {
        pk: ['BASE_ID', 'YEAR_NUMBER', 'CURRENT_NUMBER'],
        properties: {
            BASE_ID: _t.s,
            YEAR_NUMBER: _t.i,
            CURRENT_NUMBER: _t.i,
            FLAG_MAX: _t.i,
            USER_ID: _t.s,
            LOCK_TIME: _t.d,
        }
    },
};

export function commonMergeMeta(meta: any) {
    meta.merge(commonMeta);
}
