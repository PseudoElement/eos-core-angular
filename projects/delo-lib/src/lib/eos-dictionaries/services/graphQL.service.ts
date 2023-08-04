import { Injectable } from '@angular/core';
import { Apollo, gql} from 'apollo-angular';
import { ORIGINDATA, DgFileCategoryElement } from '../interfaces/fetch.interface';
import { ApolloQueryResult, NetworkStatus } from '@apollo/client/core';
import { EosMessageService } from '../../eos-common/services/eos-message.service';

@Injectable({providedIn: 'root'})
export class GraphQLService {
    constructor(
        private apollo: Apollo,
        private msgSrv: EosMessageService
    ){}

    Const_Response_Headers: string = `
        clientMutationId
        message
        messageCode
        messageData
        systemMessage
        clientMutationId
        success
    `;
    createDelParams(DUE: string, originalData: ORIGINDATA): string {
        const Dele_Doc_GroupEl: DgFileCategoryElement = originalData.rec.DG_FILE_CATEGORY_List.find((el) => el.DUE_NODE_DG === DUE);
        const Obj_As_String: string = `{
            isnFileCategory: ${originalData.rec.ISN_LCLASSIF},
            isnNodeDg: ${Dele_Doc_GroupEl.ISN_NODE_DG}
            }`;
         return Obj_As_String;
    }

    createFetch(delCat: string[], resrHeaders: string = this.Const_Response_Headers ): Promise<Response> {
        const All_Del_Group: string = delCat.reduce( (acc, curr) => acc + curr);
        const string =  `mutation{
            deleteDgFileCategory(input:{pks:[${All_Del_Group}]})
            {${resrHeaders}}
        }
      `;
      return fetch('../CoreHost/Gql/Query', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({query: string})
      });
    }

    async query(queryParam: string): Promise<ApolloQueryResult<any>> {
        try{
            const result = await this.apollo.query({
                query:  gql`query{${queryParam}}`,
                errorPolicy: 'all',
            }).toPromise();
            if (result.error) {
                const message: string = result.error.message;
                this.errMessage(message);
            }
            return result;
        }
        catch(err) {
            const message = err.message ? err.message : err;
            this.errMessage(message);
        
            const result: ApolloQueryResult<any> = {
                data: {},
                error: err,
                loading: false,
                networkStatus: NetworkStatus.error,
            };
            return result;
        }
    }

    async mutation(mutationParam: string, name: string) {
        try{
            const result: any = await this.apollo.mutate({
                mutation: gql`mutation{${mutationParam}}`,
            }).toPromise();

            const grapgQlRes = result.data[name];

            if(!grapgQlRes.success){
                const message: string = grapgQlRes.message;
                this.errMessage(message);
            }
            return result;
        }
        catch(err) {
            const message = err.message ? err.message : err;
            this.errMessage(message);
            const result = {
                data: {},
                error: err,
                loading: false,
            };
            return result;
        }
    }

    private errMessage(message: string) {
        this.msgSrv.addNewMessage({
            type: 'danger',
            title: message,
            msg: ``,
        })
        console.error(message);
    }
}
