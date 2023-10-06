import {ResponseProtItem, SearchQueryOrganization } from '../../../interfaces/fetch.interface'
import { AbstractAdvancedSearch } from './abstract-advanced-search';

export class OrganizAdvancedSearch extends AbstractAdvancedSearch {
    getItemsSort(orderby: string): string {
        if (orderby.indexOf('CLASSIF_NAME') !== -1) {
            return 'classifName'
        }
        if (orderby.indexOf('NOTE') !== -1) {
            return 'note';
        }
        if (orderby.indexOf('NEW_RECORD') !== -1) {
            return 'newRecord';
        }
        return 'classifName';
    }
    getDescriptor(orderby: string) {
        if(orderby.indexOf('asc') > -1) {
            return 'Asc'
        } else {
            return 'Desc';
        }
    }
    public organiz(param: ResponseProtItem[], query: SearchQueryOrganization, first: number, scip: number, order, showDelete): string {
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
        const after = scip ? '' + (scip - 1) : '-1';
        let deletedFlagFilter = '';
        if (!showDelete) {
            deletedFlagFilter = `, deleted: {equal: { value: 0 }}`;
        }
        return `organizClsPg(
                        first: ${first},
                        after: "${after}",
                        orderby: [{${this.getItemsSort(order)}: ${this.getDescriptor(order)}}],
                        filter: {isnNode: {in: [${queryParam}]}${ISN_HIGH_NODE}${DUE}${LAYER}${deletedFlagFilter}}) {
                    totalCount
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
