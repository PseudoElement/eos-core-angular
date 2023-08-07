import { Protocol } from '../../../interfaces/fetch.interface';
import { AbstractAdvancedSearch } from './abstract-advanced-search';

export class ProtAdvancedSearch extends AbstractAdvancedSearch{

    public prot(param: Protocol): string {
        let operDescribeper: string = '';
        let operDescribeperSearchParam: string = '';
        
        if(param.OPER_DESCRIBE) {
            const oper: string[] = param.OPER_DESCRIBE.split('|');
            operDescribeper = this.createParamInString(oper);
            operDescribeperSearchParam = `in: [${operDescribeper}]`;
        }

        return `protsPg(first: 1000000,filter: {
                    userIsn: {equal: {value: ${param.USER_ISN}}}, 
                    operDescribe: {${operDescribeperSearchParam}}, 
                    timeStamp: {
                        greaterOrEqual: {value: "${param.FROM}"}, 
                        lessOrEqual: {value: "${param.TO}"}
                    }
                }) {
                    items {
                        suboperId
                        operDescribe
                        operComment
                        isnProtInfo
                        userIsn
                        timeStamp
                        tableId
                        refIsn
                        operId
                    }
                }`;
    }
}
