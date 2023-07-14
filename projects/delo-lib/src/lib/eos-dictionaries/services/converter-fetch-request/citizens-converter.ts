import { CITIZEN } from 'eos-rest';
import { ResponseCitizenItems } from '../../interfaces/fetch.interface'

export class CitizensConverterFetchRequest {
    public citizensReq(items:ResponseCitizenItems[]): CITIZEN[] {
        const result: CITIZEN[] = [];
        items.forEach(el => {
            const convertItem: CITIZEN = {} as CITIZEN;
            Object.keys(el).forEach(key => {
                switch (key) {
                    case 'citizenAddr':
                        convertItem['CITIZEN_ADDR'] = el['citizenAddr']
                        break;
                    case 'citizenCity':
                        convertItem['CITIZEN_CITY'] = el['citizenCity']
                        break;
                    case 'citizenCitySearch':
                        convertItem['CITIZEN_CITY_SEARCH'] = el['citizenCitySearch']
                        break;
                    case 'citizenSurname':
                        convertItem['CITIZEN_SURNAME'] = el['citizenSurname']
                        convertItem['CLASSIF_NAME'] = el['citizenSurname']
                        break;
                    case 'citizenSurnameSearch':
                        convertItem['CITIZEN_SURNAME_SEARCH'] = el['citizenSurnameSearch']
                        break;
                    case 'regionCl':
                        convertItem['DUE_REGION'] = el['regionCl']['due']
                        break;
                    case 'edsFlag':
                        convertItem['EDS_FLAG'] = el['edsFlag']
                        break;
                    case 'encryptFlag':
                        convertItem['ENCRYPT_FLAG'] = el['encryptFlag']
                        break;
                    case 'eMail':
                        convertItem['E_MAIL'] = el['eMail']
                        break;
                    case 'idCertificate':
                        convertItem['ID_CERTIFICATE'] = el['idCertificate']
                        break;
                    case 'insDate':
                        convertItem['INS_DATE'] = el['insDate']
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
                    case 'isnCitizen':
                        convertItem['ISN_CITIZEN'] = el['isnCitizen']
                        convertItem['ISN_LCLASSIF'] = el['isnCitizen']
                        break;
                    case 'isnRegion':
                        convertItem['ISN_REGION'] = el['isnRegion']
                        break;
                    case 'mailFormat':
                        convertItem['MAIL_FORMAT'] = el['mailFormat']
                        break;
                    case 'nPasport':
                        convertItem['N_PASPORT'] = el['nPasport']
                        break;
                    case 'updDate':
                        convertItem['UPD_DATE'] = el['updDate']
                        break;
                    case 'updWho':
                        convertItem['UPD_WHO'] = el['updWho']
                        break;
                    default:
                        convertItem[key.toUpperCase()] = el[key]
                }
            })
            convertItem['__metadata'] = {__type: 'CITIZEN'};
            result.push(convertItem)
        })
        return result;
    }
}
