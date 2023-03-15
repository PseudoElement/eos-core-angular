import { Injectable } from "@angular/core";
import type { DictionaryComponent } from "../../eos-dictionaries/dictionary/dictionary.component";
import type { CounterDeclarator } from "../../eos-dictionaries/counter-np-edit/counter-np-edit.component";
import type { NodeActionsComponent } from "../../eos-dictionaries/node-actions/node-actions.component";
import type { EosDictionaryNode } from "../../eos-dictionaries";

@Injectable()
export class NpCounterOverrideService {
    public OrgEditDeny: string = '';
    constructor() {
    }

    /* константы для NP */
    public getOverridesCounterDeclarator(): CounterDeclarator[] {
        return [];
    }


    public getResolveAction() {

    }

    /* обработчик кликов на меню */
    public handleAction(type, dict: DictionaryComponent): any {
    }

    /* обработчик дизейбла кнопок */

    public checkActiveMenuButtons(type: number, nodeActionsExampleClass: NodeActionsComponent, opts: any): { enabled: boolean, show: boolean } {
        let enabled = false;
        let show = false;
        return {
            enabled,
            show
        }
    }
    public getDisableActionExpandOrganiz(key: number, enable: boolean, organiz: any[]): boolean {
        return enable;
    }
    public setOrgEditDeny(): Promise<any> {
        this.OrgEditDeny = '';
        return Promise.resolve('');
    }
    public checkCopyElementTech(dictionaryId: string, nodex: EosDictionaryNode[], markedNode?: EosDictionaryNode[]): boolean {
        return false;
    }
    public validateOperation(dict: DictionaryComponent, type: number): boolean {
        return true
    }
}