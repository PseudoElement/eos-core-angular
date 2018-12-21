import { DEPARTMENT } from 'eos-rest';

export class NodeListDepAbsolute {
    isSelected: boolean = false;
    userDep;
    department: DEPARTMENT;
    createEntity: boolean;
    constructor (uDep, dep: DEPARTMENT, state: boolean = false) {
        this.userDep = uDep;
        this.department = dep;
        this.createEntity = state;
    }
}
