// import { ORGANIZ_CL } from 'eos-rest';
import { Protocol, ResponseProtItem, SearchQueryOrganization } from '../interfaces/fetch.interface'

export class creatorGraphQlParam {
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

        return `protsPg(filter: {
                    userIsn: {equal: {value: ${param.USER_ISN}}}, 
                    operDescribe: {${operDescribeperSearchParam}}, 
                    timeStamp: {
                        greaterOrEqual: {value: "${param.FROM}"}, 
                        lessOrEqual: {value: "${param.TO}"}
                    }
                },first: 1000000) {
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

    public organiz(param: ResponseProtItem[], query: SearchQueryOrganization): string {
        const refIsn = this.getSearchParameters(param, 'refIsn');
        const queryParam: string = this.createParamIn(refIsn);
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

        return `organizClsPg(filter: {isnNode: {in: [${queryParam}]}${ISN_HIGH_NODE}${DUE}${LAYER}},first: 1000000) {
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

    public citizens(param: ResponseProtItem[]): string {
        const refIsn = this.getSearchParameters(param, 'refIsn');
        const queryParam: string = this.createParamIn(refIsn);
        return `citizensPg(filter: {isnCitizen: {in: [${queryParam}]}},first: 1000000) {
            items {
              isnCitizen
              citizenSurname
              citizenSurnameSearch
              citizenCity
              isnRegion
              citizenCitySearch
              zipcode
              citizenAddr
              protected
              weight
              isnAddrCategory
              phone
              sex
              nPasport
              series
              given
              inn
              eMail
              edsFlag
              encryptFlag
              idCertificate
              note
              mailFormat
              snils
              insDate
              insWho
              updDate
              updWho
              deleted
              regionCl {
                due
              }
              new
            }
          }`
    }

    // public contacts(organiz: ORGANIZ_CL[]) {
    //     const isnNode = [];
    //     organiz.forEach(el => {
    //         isnNode.push(el.ISN_NODE);
    //     })
    //     const searchParam = this.createParamIn(isnNode);
    //     return `contactsPg(filter: {isnOrganiz: {in: [${searchParam}]}, ordernum: {equal: {value: 0}}}) {
    //                 items {
    //                 idCertificate
    //                 eMail
    //                 isnOrganiz
    //                 sevIndex
    //                 }
    //             }`;
    // }

    private getSearchParameters(param: ResponseProtItem[], nameParam: string): number[] {
        const result = [];
         param.forEach(el => {
            result.push(el[nameParam]);
        })
        return result;
    }

    public createParamIn(param: number[]): string {
        let queryParam: string = '';
        param.forEach(el => {
            if (queryParam.length) {
                queryParam = queryParam + ',' +`{value: ${el}}`;
            } else {
                queryParam = `{value: ${el}}`;
            }
        })
        return queryParam;
    }
}
