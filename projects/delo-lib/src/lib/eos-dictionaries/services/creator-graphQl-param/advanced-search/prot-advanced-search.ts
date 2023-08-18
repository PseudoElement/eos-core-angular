import { PROTOCOL_ID } from '../../../../eos-dictionaries/consts/protocolId.const';
import { Protocol } from '../../../interfaces/fetch.interface';
import { AbstractAdvancedSearch } from './abstract-advanced-search';

export class ProtAdvancedSearch extends AbstractAdvancedSearch{

    public prot(param: Protocol, dictId: string): string {
        let operDescribeper: string = '';
        let operDescribeperSearchParam: string = '';
        const table_ID: string = PROTOCOL_ID[dictId];

        if(param.OPERATION && param.OPERATION.length) {
            const oper: string[] = [];
            param.OPERATION.forEach(el => {
                oper.push(el.describtion)
            })
            operDescribeper = this.createParamInString(oper);
            operDescribeperSearchParam = `in: [${operDescribeper}]`;
        }
        return `protsPg(first: 1000000, filter: {
            userIsn: {equal: {value: ${param.USER_ISN}}}, 
            tableId: {contains: {value: "${table_ID}"}},
            protName: {matches: {describtion: {
                ${operDescribeperSearchParam}
            }}}
            timeStamp: {
                greaterOrEqual: {value: "${param.FROM}"}, 
                lessOrEqual: {value: "${param.TO}"}
            }
        }) {
            items {
                refIsn
            }
        }`;
    }
}
