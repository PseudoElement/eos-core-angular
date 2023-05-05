import { Injectable } from '@angular/core';
import { EosMessageService, IOrderTable } from '../../../../eos-common/index';
import { ELEMENT_PROTECT_NOT_DELET } from '../consts/eos-parameters.const';
import { BaseTableData, ResultAppSettings } from '../interfaces/parameters.interfaces';
import { ITableBtn } from '../interfaces/tables.interfaces';
export const PROTECTED_NODE = "Default";
@Injectable({
    providedIn: 'root'
})
export class BaseParamTableService {
    public tableData: BaseTableData = { data: [], tableBtn: [], tableHeader: [] };
    public deletedNodesCollection = new Map();
    constructor(private msgSrv: EosMessageService) { }
    public getTableRow(data: ResultAppSettings) {
        this.tableData.data = [];
        Object.keys(data).forEach((key) => {
            const row: any = {};
            row.key = key;
            Object.keys(data[key]).forEach((dataField) => {
                row[dataField] = data[key][dataField]
            })
            this.tableData.data.push(row);
        })
        this.hideDeletedNodes();
    }
    public sortOrder($event: IOrderTable) {
        this.tableData.data.sort((a, b) => {
            if (a[$event.id] > b[$event.id]) {
                return $event.order === 'desc' ? -1 : 1;
            } else if (a[$event.id] < b[$event.id]) {
                return $event.order === 'desc' ? 1 : -1;
            } else {
                return 0;
            }
        });
        return this.tableData;
    }
    public updateBtn(callback: (btn: ITableBtn) => void) {
        this.tableData.tableBtn.forEach(btn => {
            callback(btn);
        })
    }

    public deleteNode() {
        const deletedNodes = this.tableData.data.filter(node => {
            if (node.check) {
                if (node.key === PROTECTED_NODE) {
                    const massage = Object.assign({}, ELEMENT_PROTECT_NOT_DELET);
                    massage.msg = massage.msg.replace('{{prot}}', node['ProfileName']);
                    this.msgSrv.addNewMessage(massage);
                    return false;
                }
                return true;
            }
            return false;
        });
        deletedNodes.forEach(node => {
            this.deletedNodesCollection.set(node.key, node);
        });
        this.tableData.data = this.tableData.data.filter(node => !deletedNodes.some((deletedNode => deletedNode.key === node.key)));
        this.hideDeletedNodes();
    }
    private hideDeletedNodes() {
        this.tableData.data = this.tableData.data.filter(node => !Array.from(this.deletedNodesCollection).some(arrNode => arrNode[0] === node?.key));
    }
    public resetNodes() {
        this.deletedNodesCollection.clear();
        this.tableData.tableBtn.forEach(btn => btn.disable = true);
    }

    public getDeleteNodes(): { instanse: string | number }[] {
        const deleteInstance = [];
        Array.from(this.deletedNodesCollection).forEach(arrNode => {
            deleteInstance.push({
                instanse: arrNode[0],
                ProfileName: arrNode[1]?.ProfileName
            })
        })
        return deleteInstance
    }
}
