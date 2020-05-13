import { SevDictionaryDescriptor } from './sev-dictionary-descriptor';
import { CustomTreeNode } from 'eos-dictionaries/tree2/custom-tree.component';
import { ALL_ROWS } from 'eos-rest/core/consts';
import { ISearchSettings } from 'eos-dictionaries/interfaces';
import { EosDictionaryNode } from '../eos-dictionary-node';
import { SEV_COLLISION } from 'eos-rest';
const NP_NOM_ROOT_DUE = '0.';
export class SevCollisionsDictionaryDescriptor extends SevDictionaryDescriptor {

    // protected prepareForEdit(records: any[]): any[] {
    //     const result = super.prepareForEdit(records);
    //     if (result) {
    //         for (let i = 0; i < result.length; i++) {
    //             const description = RESOLVE_DESCRIPTIONS.filter(val => val.type === result[i]['RESOLVE_TYPE']);
    //             if (description.length > 0) {
    //                 result[i]['resolve_text'] = description[0]['text'];
    //             }
    //         }
    //     }
    //     return result;
    // }
    private _treeData: CustomTreeNode[];
    private _filterDUE: string;
    private _activeTreeNode: CustomTreeNode;
    private groupColission: Array<any> = [
        { title: 'Некорректность формата сообщений СЭВ', id: '1.' },
        { title: 'Несогласованность значений элементов справочников', id: '2.' },
        { title: 'Нарушение правил регистрации сообщения СЭВ в системе', id: '3.' },
        { title: 'Неопределенность связанного документа', id: '4.' },
        { title: 'Повторность документа', id: '5.' },
    ];
    // defaultTreePath(data: CustomTreeNode[]): any {
    //     if (data && data[0].id === NP_NOM_ROOT_DUE && this._filterDUE === NP_NOM_ROOT_DUE) {
    //         return data[0].children && data[0].children.length ? data[0].children[0].path : null;
    //     }
    //     return null;
    // }
    getRoot(): Promise<any[]> {
        return this.getData();
    }

    getChildren(): Promise<any[]> {
        const _children = {
            REASON_NUM: this._filterDUE[0] + ''
        };
        if (this._filterDUE === NP_NOM_ROOT_DUE) {
            return this.getData();
        }
        return this.getData({ criteries: _children });
    }
    getData(query?: any, order?: string, limit?: number): Promise<any[]> {
        if (!query) {
            if (this._filterDUE && (this._filterDUE !== NP_NOM_ROOT_DUE)) {
                query = { criteries: { 'REASON_NUM': this._filterDUE[0] } };
            } else {
                query = ALL_ROWS;
            //    return Promise.resolve([]);
            }
        }

        const req = { [this.apiInstance]: query };

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
    extendCritery(critery: any, params: ISearchSettings, selectedNode: EosDictionaryNode) {
        if (params.mode === 2) {
            critery['REASON_NUM'] = this._filterDUE[0];
        }
    }
    hasCustomTree() {
        return true;
    }
    getActive(): CustomTreeNode {
        return this._activeTreeNode;
    }
    getCustomTreeData(): Promise<CustomTreeNode[]> {
        const res: CustomTreeNode[] = [];
        this.groupColission.forEach((list) => {
            const r = {
                title: list.title,
                parent: '0.',
                id: list.id,
                isNode: true,
                isDeleted: false,
                isActive: list.id === this._filterDUE,
                isClickable: (list.id !== 0),
                expandable: list.id === 0,
                isExpanded: false,
                updating: false,
                children: [],
                data: null,
                visibleFilter: true,
                path: this._getPath(list.id),
            };
            if (r.isActive) {
                this._activeTreeNode = r;
            }
            res.push(r);
        });
        const head: CustomTreeNode[] = [{
            title: 'Коллизии СЭВ',
            parent: null,
            id: '0.',
            isNode: true,
            isDeleted: false,
            isActive: '0.' === this._filterDUE,
            isClickable: true,
            expandable: true,
            isExpanded: true,
            updating: false,
            children: [...res],
            data: null,
            visibleFilter: true,
            path: this._getPath('0.'),
        }];
        this._treeData = head;
        return Promise.resolve(this._treeData);
    }
    setRootNode(_nodeId: string): CustomTreeNode {
        const res = this._activeTreeNode;
        this._filterDUE = _nodeId;
        if (this._treeData) {
            this.readChildren(this._treeData[0], res);
        }
        return res;
    }
    readChildren(item: CustomTreeNode, res) {
        this.checkChildren(item, res);
        if (item.children && item.children.length) {
            item.children.forEach((list: CustomTreeNode) => {
                this.readChildren(list, res);
            });
        }
    }
    checkChildren(list: CustomTreeNode, res) {
        if (list.id === this._filterDUE) {
            list.isActive = true;
            this._activeTreeNode = list;
            res = list;
        } else {
            list.isActive = false;
        }
    }
    updateDefaultValues(nodes: EosDictionaryNode[]): Promise<any> {
        const changesList = [];
        nodes.forEach((node: EosDictionaryNode) => {
            const data: SEV_COLLISION = node.data.rec;
            if (data.DEFAULT_RESOLVE_TYPE !== data.RESOLVE_TYPE) {
                changesList.push({
                    method: 'MERGE',
                    data: {
                        RESOLVE_TYPE: data.DEFAULT_RESOLVE_TYPE
                    },
                    requestUri: `SEV_COLLISION(${data.COLLISION_CODE})`
                });
            }
        });
        if (changesList.length) {
            return this.apiSrv.batch(changesList, '');
        }
        return Promise.resolve(null);

    }
    private _getPath(id) {
        const _path = [
            'spravochniki',
            this.id,
            id,
        ];
        return _path;
    }
}
