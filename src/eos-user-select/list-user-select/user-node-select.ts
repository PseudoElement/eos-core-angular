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
    oracle_id: number | string;
    dueName: string;
    dueDytu: string;
    readonly id;
    constructor(
        public data: USER_CL
    ) {
        this.name = data.SURNAME_PATRON;
        this.login = data.CLASSIF_NAME;
        this.id = data.ISN_LCLASSIF;
        this.department = data['DEPARTMENT'] || '...';
        this.deleted = data.DELETED;
        this.oracle_id = data.ORACLE_ID;
        this.dueName = data['DEPARTMENT_SURNAME'];
        this.dueDytu = data['DEPARTMENT_DYTU'];
        this.official = this.dueDytu + '-' + this.dueName;
    }
}
