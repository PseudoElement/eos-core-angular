import { ResponseProtItem } from '../../../interfaces/fetch.interface'
import { AbstractAdvancedSearch } from './abstract-advanced-search';

export class CitizensAdvancedSearch extends AbstractAdvancedSearch {

    public citizens(param: ResponseProtItem[]): string {
        const userIsn = this.getSearchParameters(param, 'userIsn');
        const queryParam: string = this.createParamInNumber(userIsn);

        return `citizensPg(first: 1000, filter: {isnCitizen: {in: [${queryParam}]}}) {
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
                new
                regionCl {
                    due
                }
            }
        }`
    }
    
}
