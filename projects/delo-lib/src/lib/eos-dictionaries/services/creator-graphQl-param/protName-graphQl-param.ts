import { E_DICTIONARY_ID } from "../../../eos-dictionaries/consts/dictionaries/enum/dictionaryId.enum";
import { AbstratCreatorGraphQlParam } from "./abstract-creator-graphQl-param";

export class ProtNameGraphQlParam extends AbstratCreatorGraphQlParam {

    public protName(param: string, dictionaryId: string) {
        switch(dictionaryId) {
            case E_DICTIONARY_ID.CITIZENS:
                return this.protNameCitizen(param);
            default:
                const queryParam = `{value: "${param}"}`;
                return ` protNamesPg(filter: {tableId: {in: [${queryParam}]}}, first: 1000, orderby: {describtion: Asc}) {
                    items {
                        describtion
                        operDescribe
                    }
                }`
          }
    }

    private protNameCitizen(param: string) {
        const queryParam = `{value: "${param}"}`;
        return ` protNamesPg(filter: {operDescribe: {notIn: {value: "SIG"}}, tableId: {in: [${queryParam}]}}, first: 1000, orderby: {describtion: Asc}) {
            items {
                describtion
                operDescribe
            }
        }`
    }
}
