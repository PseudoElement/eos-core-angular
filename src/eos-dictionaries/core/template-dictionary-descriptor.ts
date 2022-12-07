import { RecordDescriptor } from './record-descriptor';
import { DOC_TEMPLATES, REF_FILE } from 'eos-rest';
import { ALL_ROWS } from 'eos-rest/core/consts';
import { AbstractDictionaryDescriptor } from './abstract-dictionary-descriptor';
import { ITreeDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { CustomTreeNode } from '../tree2/custom-tree.component';

// interface TreeTempl {
//     id: string;
//     parentId: string;
//     children: [];
//     expandable: boolean;
//     isActive: boolean;
//     isOpened: boolean;
//     isExpanded: boolean;
//     level: number;
//     title: string;
//     path: string;
// }


export class TemplateDescriptor extends RecordDescriptor {
    dictionary: TemplateDictionaryDescriptor;
    fullSearchFields: any;

    constructor(dictionary: TemplateDictionaryDescriptor, descriptor: ITreeDictionaryDescriptor) {
        super(dictionary, descriptor);
        this.dictionary = dictionary;
        this._initFieldSets([
            'fullSearchFields',
        ], descriptor);
    }
}
export class TemplateDictionaryDescriptor extends AbstractDictionaryDescriptor {
    _filterDUE: string;
    _activeTreeNode: CustomTreeNode;
    record: TemplateDescriptor;
    dataNewFile?: REF_FILE;
    top = '0.';
    hashTree: Map<string, string> = new Map()
        .set('0.', '%_%|isnull');
    head: CustomTreeNode[] = [];
    tree: CustomTreeNode[] = [];
    templateUrl: string = this.apiSrv.getConfig().templateApiUrl;

    addRecord(data: any, _useless: any, isProtected = false, isDeleted = false): Promise<any> {
        let _newRec = {};
        _newRec = this.apiSrv.entityHelper.prepareAdded<any>(_newRec, this.apiInstance);
        data.rec['ISN_TEMPLATE'] = -10000;
        return this._postChanges(_newRec, data.rec)
            .then((resp: any[]) => {
                if (resp && resp[0]) {

                    return this.createDocTemp(resp[0].ID);
                } else {
                    return null;
                }
            });
    }

    setRootNode(_nodeId: string): CustomTreeNode {
        this._filterDUE = _nodeId;
        this.checkActiveTreeNode(this.tree, this._filterDUE);
        this.checkActiveTreeNode(this.head, this._filterDUE);
        return this._activeTreeNode;
    }

    checkActiveTreeNode(treeNode: CustomTreeNode[], filterDUE: string) {
        if (treeNode.length) {
            this._parseTree(treeNode, (item: CustomTreeNode) => {
                if (item.id === filterDUE) {
                    item.isActive = true;
                    this._activeTreeNode = item;
                } else {
                    item.isActive = false;
                }
            });
        }
    }

    _parseTree(treeData: CustomTreeNode[], callback): boolean {
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

    getActive(): CustomTreeNode {
        return this._activeTreeNode;
    }



    createDocTemp(id: any): Promise<any> {
        if (id && this.dataNewFile) {
            const entityReq = {
                method: 'MERGE',
                requestUri: `DOC_TEMPLATES(${id})`,
                data: {
                    ISN_TEMPLATE: id
                }
            };
            const request = {
                method: 'POST',
                requestUri: `DOC_TEMPLATES_SetContent?sf=${this.dataNewFile.ISN_REF_FILE}&tt=${id}`,
            };
            return this.apiSrv.batch([entityReq, request], '').then(() => {
                delete this.dataNewFile;
                return id;
            });
        } else {
            return id;
        }
    }
    deleteTempRc() {
        if (this.dataNewFile) {
            this.apiSrv.batch([{
                method: 'DELETE',
                requestUri: `TEMP_RC(${this.dataNewFile.ISN_REF_DOC})/REF_FILE_List(${this.dataNewFile.ISN_REF_FILE})`,
            }], '');
        }
        delete this.dataNewFile;
    }
    hasCustomTree() {
        return true;
    }

    public updateRecord(originalData, updates, appendToChanges): Promise<any> {
        if (originalData.rec.ISN_TEMPLATE && this.dataNewFile) {
            const entityReq = {
                method: 'MERGE',
                requestUri: `DOC_TEMPLATES(${originalData.rec.ISN_TEMPLATE})`,
                data: {
                    ISN_TEMPLATE: originalData.rec.ISN_TEMPLATE
                }
            };
            const request = {
                method: 'POST',
                requestUri: `DOC_TEMPLATES_SetContent?sf=${this.dataNewFile.ISN_REF_FILE}&tt=${originalData.rec.ISN_TEMPLATE}`,
            };
            return this.apiSrv.batch([entityReq, request], '').then(() => {
                return super.updateRecord(originalData, updates, appendToChanges);
                delete this.dataNewFile;
            });
        } else {
            return super.updateRecord(originalData, updates, appendToChanges);
        }
    }
    public extendCritery(critery, { mode, deleted }, selectedNode) {
        if (mode && mode === 2 && this.top) {
            critery['CATEGORY'] = `${this.hash().get(this.top)}`;
            critery['NAME_TEMPLATE'] = critery['NAME_TEMPLATE'].replace(/"/g, '%').replace(/(\(|\)|\s)/g, '_');
            critery['NAME_TEMPLATE'] = critery['NAME_TEMPLATE'] + '%';
        } else if (mode === 0) {
            if (critery['NAME_TEMPLATE']) {
                critery['NAME_TEMPLATE'] = critery['NAME_TEMPLATE'].replace(/"/g, '%').replace(/(\(|\)|\s)/g, '_');
                critery['NAME_TEMPLATE'] = critery['NAME_TEMPLATE'] + '%';
            }
        }
        if (!mode) {
            if (critery['NAME_TEMPLATE']) {
                critery['NAME_TEMPLATE'] = critery['NAME_TEMPLATE'].replace(/"/g, '%').replace(/(\(|\)|\s)/g, '_');
                critery['NAME_TEMPLATE'] = critery['NAME_TEMPLATE'] + '%';
            }
            if (critery['DESCRIPTION']) {
                critery['DESCRIPTION'] = critery['DESCRIPTION'].replace(/"/g, '%').replace(/(\(|\)|\s)/g, '_');
            }
            if (critery['CATEGORY']) {
                critery['CATEGORY'] = critery['CATEGORY'].replace(/"/g, '%').replace(/(\(|\)|\s)/g, '_');
            }
        }
        //  super.extendCritery(critery, { mode, deleted }, selectedNode);
    }

    public getCustomTreeData() {

        const setAllNodesInactive = (root) => {
            root[0].isActive = false;
            const ITEMS = root[0].children;
            ITEMS.forEach(x => x.isActive = false);
        };

        this.head = [];
        this.tree = [];
        const CRIT = { DOC_TEMPLATES: { criteries: { CATEGORY: 'isnotnull' } } };
        return this.apiSrv.read<DOC_TEMPLATES>(CRIT).then((nodes) => {
            const CATEGORIES: string[] = nodes.map(item => item.CATEGORY);
            const UNIQUE_CATEGORIES: string[] = [];
            for (const item of CATEGORIES) {
                if (!UNIQUE_CATEGORIES.includes(item)) {
                    UNIQUE_CATEGORIES.push(item);
                }
            }
            let index: number = 0;
            const step: number = 0.1;
            this.hashTree.clear();
            this.hashTree.set('0.', '%_%|isnull');
            for (const item of UNIQUE_CATEGORIES) {
                const TEMPLATE_NAME = item;
                index = index + step;
                const TEMPLATE_ID: string = Number.isInteger(index) ? String(index) : index.toFixed(1);
                const NODE_TEMPLATE = {
                    title: TEMPLATE_NAME, parent: '0.', id: TEMPLATE_ID, isNode: true, isDeleted: false, isActive: false,
                    expandable: false, isExpanded: false, isClickable: true, updating: false, path: ['spravochniki', 'templates', TEMPLATE_ID],
                    visibleFilter: true, children: []
                };
                this.tree.push(NODE_TEMPLATE);
                this.hashTree.set(TEMPLATE_ID, TEMPLATE_NAME);
            }
            const newHead = [{
                title: 'Шаблоны', parent: null, id: '0.', isNode: true, isDeleted: false, isActive: true,
                expandable: true, isExpanded: true, isClickable: true, updating: false, path: ['spravochniki', 'templates', '0.'],
                visibleFilter: true, children: []
            }];
            this.tree.sort((el1: CustomTreeNode, el2: CustomTreeNode) => {
                return el1.title.localeCompare(el2.title);
            }).forEach((element) => {
                newHead[0].children.push(element);
            });
            this.head = newHead;
            if (this.top !== '0.') {
                setAllNodesInactive(newHead); // @task163304 возврат на нужную вершину
                const ITEMS = newHead[0].children;
                const ITEM = ITEMS.filter(x => x.id === this.top);
                if (ITEM.length > 0) {
                    ITEM[0].isActive = true;
                    this._activeTreeNode = ITEM[0];
                }
            } else {
                this._activeTreeNode = this.head[0];
            }
            return Promise.resolve(newHead);
        });
    }

    public getChildren(params?: string): Promise<any[]> {
        let crit = this.hash().get(this.top);
        if (crit) {
            crit = this.top === '0.' ? `${crit}|isnull` : crit;
        } else {
            crit = '****';
        }
        const _children = {
            CATEGORY: `${crit}`
        };
        return this.getData({ criteries: _children });
    }
    public getRoot() {
        return this.getData({
            DOC_TEMPLATES: ALL_ROWS
        });
    }
    public downloadFile(node: any) {
        return this._ft(node);
        // return fetch(`http://localhost/X1807/getdoctemplate.ashx/${node.id}`).then(resp => {
        //     return resp.text().then((data) => {
        //         if (data.length > 0 && data !== 'empty_mss_blob') {
        //             this.createLink(node);
        //             return true;
        //         } else {
        //             return false;
        //         }
        //     });
        // });
    }
    public getSubtree(): Promise<any[]> {
        return Promise.resolve([]);
    }
    public onPreparePrintInfo(): Promise<any> {
        return Promise.reject('Type of dictionary not true!');
    }
    protected _initRecord(data: ITreeDictionaryDescriptor) {
        this.record = new TemplateDescriptor(this, data);
    }
    private hash(): Map<string, string> {
        return this.hashTree;
    }


    private _readFile(file) {
        return new Promise((resolve, reject) => {
            const fr = new FileReader();
            fr.onload = x => resolve(fr.result);
            fr.readAsText(file);
        });
    }

    private _ft(node: any): Promise<any> {
        return this.apiSrv.getHttp_client().get(`${this.templateUrl}${node.id}`, { responseType: 'blob' }).toPromise().then((data: Blob) => {
            return new Promise((resolve, reject) => {
                if (data.size) {
                    if (data.size === 14) {
                        return this._readFile(data).then((text) => {
                            if (text === 'empty_mss_blob') {
                                return resolve(false);
                            }
                            return resolve(true);
                        });
                    }
                    return resolve(true);
                }
                return resolve(false);
            }).then((result) => {
                if (result) {
                    this._createLink(node, data);
                }
                return result;
            }).catch(error => {
                return (error);
            });

        });
    }

    private _createLink(node: any, data: Blob): void {
        if (window.navigator && window.navigator['msSaveOrOpenBlob']) {
            window.navigator['msSaveBlob'](data, node.title);
        } else {
            const elem = window.document.createElement('a');
            elem.href = `${this.templateUrl}${node.id}`;
            elem.download = node.title;
            document.body.appendChild(elem);
            elem.click();
            document.body.removeChild(elem);
        }

    }
}

