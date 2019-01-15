import { UserSelectNode } from '../../list-user-select/user-node-select';
export class HelpersSortFunctions {
    flag: boolean;
    constructor() {
    }
    sortDepartment(pageList: UserSelectNode[], flag): UserSelectNode[] {
        if (flag) {
            return pageList.sort(function(a, b){
                if (a.department > b.department) {
                    return -1;
                }  else if (a.department < b.department) {
                    return 1;
                }   else {
                    return 0;
                }
            });
        }   else {
            return pageList.sort(function(a, b){
                if (a.department < b.department) {
                    return -1;
                }  else if (a.department > b.department) {
                    return 1;
                }   else {
                    return 0;
                }
            });
        }
    }
    sortLogin(pageList: UserSelectNode[], flag) {
        if (flag) {
            return pageList.sort(function(a, b){
                if (a.login > b.login) {
                    return -1;
                }  else if (a.login < b.login) {
                    return 1;
                }   else {
                    return 0;
                }
            });
        }   else {
            return pageList.sort(function(a, b){
                if (a.login < b.login) {
                    return -1;
                }  else if (a.login > b.login) {
                    return 1;
                }   else {
                    return 0;
                }
            });
        }
    }
    sortOfficial(pageList: UserSelectNode[], flag) {
        if (flag) {
            return pageList.sort(function(a, b){
                if (a.dueName > b.dueName) {
                    return -1;
                }  else if (a.dueName < b.dueName) {
                    return 1;
                }   else {
                    return 0;
                }
            });
        }   else {
            return pageList.sort(function(a, b){
                if (a.dueName < b.dueName) {
                    return -1;
                }  else if (a.dueName > b.dueName) {
                    return 1;
                }   else {
                    return 0;
                }
            });
        }
    }
    sortTip(pageList: UserSelectNode[], flag) {
        return pageList;
    }
}
