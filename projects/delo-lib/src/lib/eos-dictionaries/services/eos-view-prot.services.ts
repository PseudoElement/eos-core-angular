import { Injectable } from '@angular/core';
import { DictionaryDescriptor } from '../../eos-dictionaries/core/dictionary-descriptor';
import { EosDictionaryNode } from '../../eos-dictionaries/core/eos-dictionary-node';
import { PROTOCOL_ID } from '../consts/protocolId.const';

@Injectable({ providedIn: 'root' })
export class ViewProtocolServices {
    public defaultPath: string = '../WebRC/Pages/ProtView.html';
    private protocolIds: { [key: string]: string } = PROTOCOL_ID;

    private windowProtocol: Window;
    public getUrlProtocol(descriptor: DictionaryDescriptor, nodes: EosDictionaryNode[]): void {
        if (nodes[0] && nodes[0].id) {
            const key = descriptor.record.keyField.key === 'DUE' ? 'ISN_NODE' : descriptor.record.keyField.key;
            const id = nodes[0].data.rec[key];
            if (this.windowProtocol && !this.windowProtocol.closed) {
                this.windowProtocol.close();
                this.windowProtocol = window.open(this.getPath(descriptor, +id, key), '_blank', 'width=910,height=500');
            } else {
                this.windowProtocol = window.open(this.getPath(descriptor, +id, key), '_blank', 'width=910,height=500');
            }
        }
    }
    private getPath(descriptor: DictionaryDescriptor, id: number, key: string): string {
        const url = this.templateUrl(id, descriptor.apiInstance, key, this.protocolIds[descriptor.id]);
        return url;
    }

    private templateUrl(isn: number, tableName: string, pkName: string, tableId: string): string {
        let postParams = `,"insDesc":"Создание","updDesc":"Редактирование"`;
        if (tableName === 'SIGN_KIND_CL' || tableName === 'SEV_COLLISION') {
            postParams = '';
        }
        let url: string;

        url = this.defaultPath +
            `?params={"ref_isn":${isn},"tableName":"${tableName}","pkName":"${pkName}","tableId":"${tableId}"${postParams}}`;
        if (tableName === 'SEV_COLLISION') {
            url = this.defaultPath +
                `?params={"ref_isn":${isn},"tableName":"${tableName}","pkName":"${pkName}","updDesc":"Редактирование"}`;
        }
        return url;
    }
}
