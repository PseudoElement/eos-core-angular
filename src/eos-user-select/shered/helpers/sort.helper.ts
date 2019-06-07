import { UserSelectNode } from '../../list-user-select/user-node-select';
export class HelpersSortFunctions {
    flag: boolean;
    constructor() {
    }
    sort(pageList: UserSelectNode[], flag, key): UserSelectNode[] {
        return pageList.sort(function (a, b) {
            if (String(a[key]).toLowerCase() > String(b[key]).toLowerCase()) {
                return flag ? -1 : 1;
            } else if (String(a[key]).toLowerCase() < String(b[key]).toLowerCase()) {
                return flag ? 1 : -1;
            } else {
                return 0;
            }
        });
    }
    has() {
        return {
            LOGIN: 'login',
            DEPARTMENT: 'department',
            fullDueName: 'fullDueName',
        };
    }
    findUsers(pageList: UserSelectNode[], config: { LOGIN?: string, DEPARTMENT?: string, DUE_DEP?: string, CARD?: string }) {
        const arraySearch = [];
        for (const param in config) {
            if (config.hasOwnProperty(param)) {
                if (param !== 'TEH' && param !== 'DEL_USER') {
                    arraySearch.push(param);
                }
            }
        }
        return pageList.filter((user: UserSelectNode) => {
            if (arraySearch.length === 1) {
                return this.find1(user, arraySearch, config);
            }
            if (arraySearch.length === 2) {
                return this.find2(user, arraySearch, config);
            }
            if (arraySearch.length === 3) {
                return this.find3(user, arraySearch, config);
            }
        });
    }
    find1(user: UserSelectNode, arrSearh, config) {
        return user[this.has()[arrSearh[0]]].indexOf(config[arrSearh[0]]) !== -1;
    }
    find2(user: UserSelectNode, arrSearh, config) {
        return user[this.has()[arrSearh[1]]].indexOf(config[arrSearh[1]]) !== -1 && user[this.has()[arrSearh[0]]].indexOf(config[arrSearh[0]]) !== -1;
    }
    find3(user: UserSelectNode, arrSearh, config) {
        return user[this.has()[arrSearh[2]]].indexOf(config[arrSearh[2]]) !== -1 &&
            user[this.has()[arrSearh[0]]].indexOf(config[arrSearh[0]]) !== -1 &&
            user[this.has()[arrSearh[1]]].indexOf(config[arrSearh[1]]) !== -1;

    }
}
