import { Injectable } from '@angular/core';
import { ORIGINDATA, DgFileCategoryElement } from '../interfaces/fetch.interface';

@Injectable({providedIn: 'root'})

export class GraphQLService {

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
}
