import {ResponseProtItem, SearchQueryOrganization } from '../../../interfaces/fetch.interface'
import { AbstractAdvancedSearch } from './abstract-advanced-search';

export class OrganizAdvancedSearch extends AbstractAdvancedSearch {

    public organiz(param: ResponseProtItem[], query: SearchQueryOrganization): string {
        const refIsn = this.getSearchParameters(param, 'refIsn');
        const queryParam: string = this.createParamInNumber(refIsn);
        let ISN_HIGH_NODE: string = '';
        let DUE: string = '';
        let LAYER: string = '';

        if (query['ISN_HIGH_NODE']) {
            ISN_HIGH_NODE = `, isnHighNode: {equal: {value: ${query['ISN_HIGH_NODE']}}}`;
        }

        if (query['DUE']) {
            let dueParam = query['DUE'].replace('%', '');
            DUE = `, due: {contains: {value: "${dueParam}"}}`;
            let layerParam = query['LAYER'].split(':')[0];
            LAYER = `, layer: {greaterOrEqual: {value: ${layerParam}}}`;
        }

        return `organizClsPg(first: 1000, filter: {isnNode: {in: [${queryParam}]}${ISN_HIGH_NODE}${DUE}${LAYER}}) {
                    items {
                        due
                        isnNode
                        isnHighNode
                        layer
                        isNode
                        weight
                        classifName
                        classifNameSearch
                        protected
                        fullname
                        zipcode
                        city
                        address
                        note
                        okpo
                        inn
                        isnRegion
                        okonh
                        lawAdress
                        isnOrganizType
                        sertificat
                        isnAddrCategory
                        code
                        ogrn
                        termExec
                        termExecType
                        insDate
                        insWho
                        updDate
                        updWho
                        deleted
                        mailForAll
                        newRecord
                        parentNode {
                            due
                        }
                    }
                }`;
    }
    
}
