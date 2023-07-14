import { ORGANIZ_CL } from 'eos-rest';
import { AbstratCreatorGraphQlParam } from './abstract-creator-graphQl-param';

export class ContactsCreatorGraphQlParam extends AbstratCreatorGraphQlParam {

    public contacts(organiz: ORGANIZ_CL[]) {
        const isnNode = [];
        organiz.forEach(el => {
            isnNode.push(el.ISN_NODE);
        })
        const searchParam = this.createParamInNumber(isnNode);
        return `contactsPg(filter: {isnOrganiz: {in: [${searchParam}]}, ordernum: {equal: {value: 0}}}) {
                    items {
                    idCertificate
                    eMail
                    isnOrganiz
                    sevIndex
                    }
                }`;
    }
}
