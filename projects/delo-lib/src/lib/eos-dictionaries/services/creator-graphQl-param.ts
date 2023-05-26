import { Protocol, ResponseProtItem, SearchQueryOrganization } from '../interfaces/fetch.interface'

export class creatorGraphQlParam {
    public prot(param: Protocol): string {
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

    public organiz(param: ResponseProtItem[], query: SearchQueryOrganization): string {
        const queryParam: string = this.createParamIn(param);
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

    public citizens(param: ResponseProtItem[]): string {
        const queryParam: string = this.createParamIn(param);
        return `citizensPg(filter: {isnCitizen: {in: [${queryParam}]}}) {
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

    private createParamIn(param: ResponseProtItem[]): string {
        let queryParam: string = '';
        param.forEach(el => {
            if (queryParam.length) {
                queryParam = queryParam + ',' +`{value: "${el}"}`;
            } else {
                queryParam = `{value: "${el}"}`;
            }
        })
        return queryParam;
    }
}
