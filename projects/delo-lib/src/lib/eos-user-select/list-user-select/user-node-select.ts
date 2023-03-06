import { USER_CL, DEPARTMENT } from '../../eos-rest';


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
    dataDeep: DEPARTMENT;
    readonly id;
    deep;
    constructor(
        public data: USER_CL,
        public sysParam,
        public limitCards: string[],
    ) {
        this.name = data.SURNAME_PATRON;
        this.login = data.CLASSIF_NAME;
        this.id = data.ISN_LCLASSIF;
        this.deep = data.DUE_DEP;
        this.department = data['DEPARTMENT'] || '...';
        this.deleted = (data.DELETED && data.ORACLE_ID === null && data.CLASSIF_NAME.trim() === '') ? true : false;
        this.oracle_id = data.ORACLE_ID;
        this.dueName = data['DEPARTMENT_SURNAME'];
        this.dueDytu = data['DEPARTMENT_DYTU'];
        this.official = this.dueDytu + '-' + this.dueName;
        this.isChecked = false;
        this.deletedOffFace = +data['DEPARTMENT_DELETE'] > 0 ? true : false;
        this.blockedUser = (+data.DELETED > 0) && (+data.LOGIN_ATTEMPTS < +sysParam) ? true : false;
        this.blockedSystem = (+data.DELETED > 0) && (+data.LOGIN_ATTEMPTS >= +sysParam) ? true : false;
        this.dataDeep = data['DEEP_DATA'] ? data['DEEP_DATA'] : null;
    }
    get fullDueName() {
        let name = '';
        if (this.deleted) {
            name = this.name + ' - Пользователь удален';
        }
        if (!this.deep && !this.deleted) {
            name = this.name + ' - Технический пользователь';
        }
        if (this.deep && !this.deleted) {
            name = 'Должностное лицо';
        }
        if (this.deletedOffFace) {
            name = this.dueName + '- Должностное лицо логически удалено';
        }

        if (!this.deleted && !this.deletedOffFace) {
            name = this.dueName + '-' + this.dueDytu;
            if (name === '-') {
                name = '...';
            }
        }
        return name;
    }

    get isEditable() {
        // if (this.limitCards.length) {
        //     if (this.dataDeep) {
        //         return this.limitCards.indexOf(this.dataDeep.DEPARTMENT_DUE) !== -1;
        //     }
        //   return false;
        // }
        if (this.data && this.data._more_json && this.data._more_json.hasOwnProperty('CanTech')) {
            return !!this.data._more_json['CanTech'];
        }
        return true;
    }
}
