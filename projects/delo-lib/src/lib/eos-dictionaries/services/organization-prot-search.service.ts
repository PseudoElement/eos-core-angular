import { Injectable } from '@angular/core';
import { Protocol, ResponseProto, SearchQueryOrganization, ResponseOrganizationItems } from '../interfaces/fetch.interface'

@Injectable({providedIn: 'root'})
export class OrganizationProtSearchService {

    public createfetchParamProt(query: SearchQueryOrganization): string {
        const param: Protocol = query.protocol;
        let operDescribeper: string = '';
        const oper: string[] = param.OPER_DESCRIBE.split('|');
        oper.forEach(el => {
            if (operDescribeper.length) {
                operDescribeper = operDescribeper + ',' +`{value: "${el}"}`;
            } else {
                operDescribeper = `{value: "${el}"}`;
            }
        })
        return `protsPg(filter: {
                    userIsn: {equal: {value: ${param.USER_ISN}}}, 
                    operDescribe: {in: [${operDescribeper}]}, 
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

    public createfetchParamOrganiz(param: ResponseProto[], query: SearchQueryOrganization): string {
        let queryParam: string = '';
        param.forEach(el => {
            if (queryParam.length) {
                queryParam = queryParam + ',' +`{value: "${el}"}`;
            } else {
                queryParam = `{value: "${el}"}`;
            }
        })

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
        return `organizClsPg(filter: {isnNode: {in: [${queryParam}]}${ISN_HIGH_NODE}${DUE}${LAYER}}) {
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

    public convertOrganizReq(items: ResponseOrganizationItems[]) {
        const result = [];
        items.forEach(el => {
            const convertItem = {}
            Object.keys(el).forEach(key => {
                switch (key) {
                    case 'classifName':
                        convertItem['CLASSIF_NAME'] = el['classifName']
                        break;
                    case 'classifNameSearch':
                        convertItem['CLASSIF_NAME_SEARCH'] = el['classifNameSearch']
                        break;
                    case 'insDate':
                        convertItem['INS_DATE'] = el['insDate']
                        break;
                    case 'insWho':
                        convertItem['INS_WHO'] = el['insWho']
                        break;
                    case 'isnAddrCategory':
                        convertItem['ISN_ADDR_CATEGORY'] = el['isnAddrCategory']
                        break;
                    case 'isnHighNode':
                        convertItem['ISN_HIGH_NODE'] = el['isnHighNode']
                        break;
                    case 'isnNode':
                        convertItem['ISN_NODE'] = el['isnNode']
                        break;
                    case 'isNode':
                        convertItem['IS_NODE'] = el['isNode']
                        break;
                    case 'isnOrganizType':
                        convertItem['ISN_ORGANIZ_TYPE'] = el['isnOrganizType']
                        break;
                    case 'isnRegion':
                        convertItem['ISN_REGION'] = el['isnRegion']
                        break;
                    case 'lawAdress':
                        convertItem['LAW_ADRESS'] = el['lawAdress']
                        break;
                    case 'termExec':
                        convertItem['TERM_EXEC'] = el['termExec']
                        break;
                    case 'termExecType':
                        convertItem['TERM_EXEC_TYPE'] = el['termExecType']
                        break;
                    case 'updDate':
                        convertItem['UPD_DATE'] = el['updDate']
                        break;
                    case 'updWho':
                        convertItem['UPD_WHO'] = el['updWho']
                        break;
                    case 'mailForAll':
                        convertItem['MAIL_FOR_ALL'] = el['mailForAll']
                        break;
                    case 'newRecord':
                        convertItem['NEW_RECORD'] = el['newRecord']
                        break;
                    case 'parentNode':
                        convertItem['PARENT_DUE'] = el['parentNode']['due']
                        break;
                    default:
                        convertItem[key.toUpperCase()] = el[key]
                }
            })
            result.push(convertItem)
        })
        return result;
    }
}
