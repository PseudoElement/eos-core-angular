import { Protocol } from '../../../interfaces/fetch.interface';
import { AbstractAdvancedSearch } from './abstract-advanced-search';

export class ProtAdvancedSearch extends AbstractAdvancedSearch{

    public prot(param: Protocol): string {
        let operDescribeper: string = '';
        let operDescribeperSearchParam: string = '';
        
        if(param.OPER_DESCRIBE) {
            const oper: string[] = param.OPER_DESCRIBE.split('|');
            oper.forEach(el => {
                if (operDescribeper.length) {
                    operDescribeper = operDescribeper + ',' +`{value: "${el}"}`;
                } else {
                    operDescribeper = `{value: "${el}"}`;
                }
            })
            operDescribeperSearchParam = `in: [${operDescribeper}]`;
        }

        return `protsPg(first: 1000,filter: {
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
