import {DEPARTMENT, CABINET, USER_CABINET} from 'eos-rest/interfaces/structures';
export interface CardInit {
    DEPARTMENT_info: DEPARTMENT[];
    CABINET_info: CABINET[];
    USER_CABINET_info: USER_CABINET[];
    create: boolean;
}
