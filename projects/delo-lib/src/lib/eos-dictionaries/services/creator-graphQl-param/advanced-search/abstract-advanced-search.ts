import { ResponseProtItem } from '../../../interfaces/fetch.interface'
import { AbstratCreatorGraphQlParam } from '../abstract-creator-graphQl-param';

export class AbstractAdvancedSearch extends AbstratCreatorGraphQlParam{

    public getSearchParameters(param: ResponseProtItem[], nameParam: string): number[] {
        const result = [];
         param.forEach(el => {
            result.push(el[nameParam]);
        })
        return result;
    }
}
