import { USER_CL } from 'eos-rest';

export class UserSelectNode {
    marked: boolean;
    isSelected: boolean;
    selectedMark: boolean;
    name: string;
    login: string;
    department: string;
    official: string;
    deleted: number;
    readonly id;
    constructor(
        public data: USER_CL
    ) {
        this.name = data.SURNAME_PATRON;
        this.login = data.CLASSIF_NAME;
        this.id = data.ISN_LCLASSIF;
        this.department = data.NOTE || 'не указанно';
        this.official = '';
        this.deleted = data.DELETED;
    }
}
