import { AbstratCreatorGraphQlParam } from "./abstract-creator-graphQl-param";

export class ProtNameGraphQlParam extends AbstratCreatorGraphQlParam {

    public protName(param: string) {
        const queryParam = `{value: "${param}"}`;
        return ` protNamesPg(filter: {tableId: {in: [${queryParam}]}}, first: 1000, orderby: {describtion: Asc}) {
            items {
                describtion
                operDescribe
            }
        }`
    }
}
