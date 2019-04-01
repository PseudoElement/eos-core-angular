import { USER_CL } from 'eos-rest';


export class UserSelectNode {
    marked: boolean;
    isSelected: boolean;
    isChecked: boolean;
    selectedMark: boolean;
    name: string;
    login: string;
    department: string;
    official: string;
    deleted: boolean;
    deletedOffFace: boolean;
    oracle_id: number | string;
    dueName: string;
    dueDytu: string;
    blockedUser: boolean;
    blockedSystem: boolean;
    readonly id;
    constructor(
        public data: USER_CL,
        public sysParam
    ) {
        this.name = data.SURNAME_PATRON;
        this.login = data.CLASSIF_NAME;
        this.id = data.ISN_LCLASSIF;
        this.department = data['DEPARTMENT'] || '...';
        this.deleted = (data.DELETED && data.ORACLE_ID === null) ? true : false;
        this.oracle_id = data.ORACLE_ID;
        this.dueName = data['DEPARTMENT_SURNAME'];
        this.dueDytu = data['DEPARTMENT_DYTU'];
        this.official = this.dueDytu + '-' + this.dueName;
        this.isChecked = false;
        this.deletedOffFace = +data['DEPARTMENT_DELETE'] > 0 ? true : false;
        this.blockedUser =  (+data.DELETED > 0) && (+data.LOGIN_ATTEMPTS < +sysParam) ? true : false;
        this.blockedSystem = (+data.DELETED > 0) && (+data.LOGIN_ATTEMPTS >= +sysParam) ? true : false;
    }
    get fullDueName () {
        let name = '';
        if (this.deleted) {
            name = this.name + ' - Пользователь удален';
        }
        if (this.deletedOffFace) {
            name = this.dueName + '- Должностное лицо логически удалено';
        }

        if (!this.deleted && !this.deletedOffFace) {
            name =  this.dueName + '-' +  this.dueDytu;
            if (name === '-') {
                name = '...';
            }
        }
        return name;
    }

}
