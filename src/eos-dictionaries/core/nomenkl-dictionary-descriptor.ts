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

    getActive(): CustomTreeNode {
        return this._activeTreeNode;
    }

    getCustomTreeData(): Promise<CustomTreeNode[]> {

        return this.apiSrv.read<DEPARTMENT>({'DEPARTMENT': PipRX.criteries({'IS_NODE': '0'}),  orderby: 'WEIGHT' })
            .then((data) => {
                this._makeTreeData(data);
                return this._treeData;
            });
    }

    getParentFor(due: any): any {
        let result = null;
        if (this._treeData) {
            this._parseTree(this._treeData, (item: CustomTreeNode) => {
                if (item.id === due) {
                    result = item;
                    return true;
                }
                return false;
            });
        }
        return result;
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

    setRootNode(_nodeId: string): CustomTreeNode {
        let res = this._activeTreeNode;
        this._filterDUE = _nodeId;
        if (this._treeData) {
            this._parseTree(this._treeData, (item: CustomTreeNode) => {
                if (item.id === this._filterDUE) {
                    item.isActive = true;
                    this._activeTreeNode = item;
                    res = item;
                } else {
                    item.isActive = false;
                }
            });
        }
        return res;
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

    defaultTreePath(data: CustomTreeNode[]): any {
        if (data && data[0].id === NP_NOM_ROOT_DUE && this._filterDUE === NP_NOM_ROOT_DUE) {
            return data[0].children && data[0].children.length ? data[0].children[0].path : null;
        }

        return null;
    }

    getRelatedFields2 (tables: string[], nodes: EosDictionaryNode[], loadAll: boolean, ignoreMetadata = false): Promise<any> {
        const ignoreMeta = loadAll || ignoreMetadata;
        return super.getRelatedFields2(tables, nodes, loadAll, ignoreMeta).then( (r) => {
            // if (loadAll) {
            // console.log("TCL: loadAll", loadAll)

            // }
            return r;
        });
    }
    protected _initRecord(data: IDictionaryDescriptor) {
        this.record = new NomenklRecordDescriptor(this, <ITreeDictionaryDescriptor>data);
    }

    private _parseTree(treeData: CustomTreeNode[], callback): boolean {
        let i: number;

        for (i = 0; i < treeData.length; i++) {
            if (callback(treeData[i])) {
                return true;
            }
            if (treeData[i].children && treeData[i].children.length) {
                if (this._parseTree(treeData[i].children, callback)) {
                    return true;
                }
            }
        }
        return false;
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
                isExpanded: false,
                updating: false,
                children: [],
                data: {DEPARTMENT_INDEX : dd.DEPARTMENT_INDEX },
                path: this._getPath(dd.DUE),
            };
            if (r.isActive) {
                this._activeTreeNode = r;
            }
            res.push(r);
        }

        i = 0;
        while (i < res.length) {
            d = res[i];
            r = this._findTreeParent(res, d.parent);
            if (r) {
                r.expandable = true;
                r.children.push(d);
                res.splice(i, 1);
                i--;
            }
            i++;
        }


        r = this._expandToSelected(this._activeTreeNode, res);

        this._treeData = res;
    }

    private _expandToSelected(node2expand: CustomTreeNode, nodes: CustomTreeNode[]) {
        let r = node2expand;
        if (r) {
            while (r) {
                if (r.expandable) {
                    r.isExpanded = true;
                }
                r = this._findTreeParent(nodes, r.parent);
                if (r) {
                    r.isExpanded = true;
                }
            }
        } else {
            nodes.find((f) => f.id === NP_NOM_ROOT_DUE).isExpanded = true;
        }
        return r;
    }

    private _findTreeParent(treeData: CustomTreeNode[], id: any) {
        let i: number;
        let res: CustomTreeNode;
        for (i = 0; i < treeData.length; i++) {
            if (treeData[i].id === id) {
                return treeData[i];
            } else if (treeData[i].children && treeData[i].children.length) {
                res = this._findTreeParent(treeData[i].children, id);
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
