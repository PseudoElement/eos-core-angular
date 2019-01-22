import { UserSelectNode } from '../../list-user-select/user-node-select';
export class HelpersSortFunctions {
    flag: boolean;
    constructor() {
    }
    sort(pageList: UserSelectNode[], flag, key): UserSelectNode[] {
            return pageList.sort(function(a, b){
                if (a[key] > b[key]) {
                  return  flag ? -1 : 1;
                }  else if (a[key] < b[key]) {
                    return flag ? 1 : -1;
                }   else {
                    return 0;
                }
            });
    }
}
