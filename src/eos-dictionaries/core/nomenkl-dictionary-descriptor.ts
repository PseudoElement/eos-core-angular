import {
    IDictionaryDescriptor, ISearchSettings, ITreeDictionaryDescriptor,
} from 'eos-dictionaries/interfaces';

import {PipRX} from 'eos-rest/services/pipRX.service';
import {FieldDescriptor} from './field-descriptor';
import {ModeFieldSet} from './record-mode';
import {ALL_ROWS} from '../../eos-rest/core/consts';
import {DEPARTMENT} from '../../eos-rest';
import {CustomTreeNode} from '../tree2/custom-tree.component';
import {DictionaryDescriptor} from './dictionary-descriptor';
import {RecordDescriptor} from './record-descriptor';
import {EosDictionaryNode} from './eos-dictionary-node';
import {DictionaryComponent} from '../dictionary/dictionary.component';
import {DANGER_EDIT_ON_ROOT} from '../consts/messages.consts';
import {IMessage} from '../../eos-common/core/message.interface';

const NP_NOM_ROOT_DUE = '0.';

export class NomenklRecordDescriptor extends RecordDescriptor {
    dictionary: NomenklDictionaryDescriptor;

    parentField: FieldDescriptor;
    fullSearchFields: ModeFieldSet | any;

    constructor(dictionary: NomenklDictionaryDescriptor, descriptor: IDictionaryDescriptor,
    ) {
        super(dictionary, descriptor);
        this.dictionary = dictionary;
    }

    filterBy(filters: any, data: any): boolean {
        if (filters && filters.hasOwnProperty('YEAR')) {
            const y: number = parseInt(filters['YEAR'], 10);
            this.dictionary.filtYear = y;
            const y1: number = data.rec['YEAR_NUMBER'];
            const y2: number = data.rec['END_YEAR'];
            const p: boolean = filters['CB1'];
            if (y) {
                if (!p && !y2) {
                    return false;
                }
                if (y1 && (y1 > y)) {
                    return false;
                }
                if (y2 && (y2 < y)) {
                    return false;
                }
                if (!p && (y2) && (y !== y2)) {
                    return false;
                }
            }
        }
        return super.filterBy(filters, data);
    }
}

export class NomenklDictionaryDescriptor extends DictionaryDescriptor {
    record: NomenklRecordDescriptor;
    filtYear: number;
    private _treeData: CustomTreeNode[];
    private _filterDUE: string;
    // private _defaultIndex: string;
    private _activeTreeNode: CustomTreeNode;


    constructor(
        descriptor: IDictionaryDescriptor,
        apiSrv: PipRX,
    ) {
        super(descriptor, apiSrv);
        this._filterDUE = NP_NOM_ROOT_DUE;
    }

    hasCustomTree() {
        return true;
    }

    getCustomTreeData(): Promise<CustomTreeNode[]> {
        return this.apiSrv.read<DEPARTMENT>({'DEPARTMENT': PipRX.criteries({'IS_NODE': '0'})})
            .then((data) => {
                this._makeTreeData(data);
                return this._treeData;
            });
    }

    getRoot(): Promise<any[]> {
        return this.getData();
    }

    preCreateCheck(dict: DictionaryComponent): IMessage {
        if (this._filterDUE && this._filterDUE !== NP_NOM_ROOT_DUE) {
            return null;
        } else {
            return DANGER_EDIT_ON_ROOT;
        }
    }

    setRootNode(_nodeId: string) {
        this._filterDUE = _nodeId;
        if (this._treeData) {
            this.parseTree(this._treeData, (item: CustomTreeNode) => {
                if (item.id === this._filterDUE) {
                    item.isActive = true;
                    this._activeTreeNode = item;
                } else {
                    item.isActive = false;
                }
            });
        }
    }

    getChildren(): Promise<any[]> {
        const _children = {
            DUE: this._filterDUE + ''
        };
        return this.getData({ criteries: _children }, 'DUE');
    }

    getData(query?: any, order?: string, limit?: number): Promise<any[]> {
        if (!query) {
            if (this._filterDUE && (this._filterDUE !== NP_NOM_ROOT_DUE)) {
                query = {criteries: {DUE: this._filterDUE}};
            } else {
                query = ALL_ROWS;
                return Promise.resolve([]);
            }
        }

        const req = {[this.apiInstance]: query};

        if (limit) {
            req.top = limit;
        }

        if (order) {
            req.orderby = order;
        }

        return this.apiSrv
            .read(req)
            .then((data: any[]) => {
                this.prepareForEdit(data);
                return data;
            });
    }

    getNewRecord(preSetData: {}): {} {
        const res = super.getNewRecord(preSetData);
        res['rec']['DUE'] = this._filterDUE;
        if (!this.filtYear) {
            this.filtYear = new Date().getFullYear();
        }
        res['rec']['YEAR_NUMBER'] = this.filtYear;
        res['rec']['NOM_NUMBER'] = this._activeTreeNode.data['DEPARTMENT_INDEX'];

        return res;
    }

    extendCritery(critery: any, params: ISearchSettings, selectedNode: EosDictionaryNode) {
        if (params.mode === 2) {
            critery['DUE'] = this._filterDUE;
        }
    }

    protected _initRecord(data: IDictionaryDescriptor) {
        this.record = new NomenklRecordDescriptor(this, <ITreeDictionaryDescriptor>data);
    }

    private parseTree(treeData: CustomTreeNode[], callback) {
        let i: number;

        for (i = 0; i < treeData.length; i++) {
            callback(treeData[i]);
            if (treeData[i].children && treeData[i].children.length) {
                this.parseTree(treeData[i].children, callback);
            }
        }
    }


    private _makeTreeData(ddata: DEPARTMENT[]) {
        let r: CustomTreeNode;
        let d: CustomTreeNode;
        let i: number;
        const res: CustomTreeNode[] = [];
        let dd: DEPARTMENT;

        this._treeData = [];
        for (i = 0; i < ddata.length; i++) {
            dd = ddata[i];
            r = {
                title: (dd.DUE === NP_NOM_ROOT_DUE) ? 'Подразделения' : dd.CLASSIF_NAME,
                parent: dd.PARENT_DUE,
                id: dd.DUE,
                isNode: true,
                isDeleted: dd.DELETED === 0 ? false : true,
                isActive: dd.DUE === this._filterDUE,
                expandable: false,
                isExpanded: true,
                updating: false,
                children: [],
                data: {DEPARTMENT_INDEX : dd.DEPARTMENT_INDEX },
                path: this._getPath(dd.DUE),
            };
            res.push(r);
        }

        i = 0;
        while (i < res.length) {
            d = res[i];
            r = this.findTreeParent(res, d.parent);
            if (r) {
                r.expandable = true;
                r.isExpanded = false;
                r.children.push(d);
                res.splice(i, 1);
                i--;
            }
            i++;
        }
        res.find((f) => f.id === NP_NOM_ROOT_DUE).isExpanded = true;
        this._treeData = res;
    }

    private findTreeParent(treeData: CustomTreeNode[], id: any) {
        let i: number;
        let res: CustomTreeNode;
        for (i = 0; i < treeData.length; i++) {
            if (treeData[i].id === id) {
                return treeData[i];
            } else if (treeData[i].children && treeData[i].children.length) {
                res = this.findTreeParent(treeData[i].children, id);
                if (res) {
                    return res;
                }
            }
        }
        return null;
    }

    private _getPath(DUE: string) {
        const _path = [
            'spravochniki',
            this.id,
            DUE,
        ];
        return _path;
    }

}
