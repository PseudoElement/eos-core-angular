import { ResponseOrganizationItems} from '../../interfaces/fetch.interface'

export class OrganizConverterFetchRequest {
    getTermExecType(termExecType: string) {
        switch (termExecType) {
            case 'CalendarDays':
                return 1;
            case 'WorkingDays':
                return 2;
            case 'CalendarDaysPlus':
                return 3;
            case 'CalendarDaysMinus':
                return 4;
            default:
                return null;
        }
    }
    public organizReq(items: ResponseOrganizationItems[]) {
        const result = [];
        items.forEach(el => {
            const convertItem = {};
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
                        convertItem['TERM_EXEC_TYPE'] = typeof(el['termExecType']) === 'string' ? this.getTermExecType(el['termExecType']) : el['termExecType'];
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
