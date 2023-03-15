import { Injectable } from "@angular/core";
import type { EosDictionaryNode } from "../../eos-dictionaries/core/eos-dictionary-node";
import type { EosDictionary } from "../../eos-dictionaries/core/eos-dictionary";
import { EosDictService } from "../../eos-dictionaries/services/eos-dict.service";


@Injectable()
export class DictionaryOverrideService {
    constructor() {
    }

    public getFieldsForInputs(inputs: any, data: any, dict_id: string, editMode: boolean): void {

    }

    public extendsRelatedData(context: EosDictionary, currentNode: EosDictionaryNode): Promise<any> {
        return Promise.resolve(false);
    }
    public getNewExtensionsFields(context: EosDictionary, data: any): void {
    }

    public accessActionEdit(node: any, access, dict): boolean {
        return access;
    }

    public deleteRestoreExtentions(dictSrv: EosDictService, selectedNodes, message): Promise<any> {
        return Promise.resolve(true);
    }

}