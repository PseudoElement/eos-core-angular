import { RecordDescriptor } from './record-descriptor';
import { REF_FILE } from 'eos-rest';
import { ALL_ROWS } from 'eos-rest/core/consts';
import { AbstractDictionaryDescriptor } from './abstract-dictionary-descriptor';
import { ITreeDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import {CustomTreeNode} from '../tree2/custom-tree.component';
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
        .set('0.', '%_%|isnull')
        .set('0.1', 'Информация о системе')
        .set('0.2', 'Файлы документов')
        .set('0.3', 'Печать списка РК')
        .set('0.4', '%альбомная%')
        .set('0.5', '%книжная%')
        .set('0.6', 'Печать списка РКПД')
        .set('0.7', 'Печать списка поручений')
        .set('0.8', 'Реестры внеш. отправки')
        .set('0.9', 'Печать РК')
        .set('1', '%opis_arh.exe%')
        .set('2', 'Печать перечня поручений')
        .set('3', 'Печать номенклатуры дел');

    head: CustomTreeNode[] = [];
    staticDataForTree: CustomTreeNode[] = [
        {
            title: 'Информация о системе', parent: '0.', id: '0.1', isNode: true, isDeleted: false, isActive: false,
            expandable: false, isExpanded: false, isClickable: true, updating: false, path: ['spravochniki', 'templates', '0.1'],
            visibleFilter: true, children: []
        },
        {
            title: 'Файлы документов', parent: '0.', id: '0.2', isNode: true, isDeleted: false, isActive: false,
            expandable: false, isExpanded: false, isClickable: true, updating: false, path: ['spravochniki', 'templates', '0.2'],
            visibleFilter: true, children: []
        },
        {
            title: 'Печать списка РК', parent: '0.', id: '0.3', isNode: true, isDeleted: false, isActive: false,
            expandable: false, isExpanded: false, isClickable: true, updating: false, path: ['spravochniki', 'templates', '0.3'],
            visibleFilter: true, children: []
        },
        {
            title: 'Печать штрих-кода (альбомная)', parent: '0.', id: '0.4', isNode: true, isDeleted: false, isActive: false,
            expandable: false, isExpanded: false, isClickable: true, updating: false, path: ['spravochniki', 'templates', '0.4'],
            visibleFilter: true, children: []
        },
        {
            title: 'Печать штрих-кода (книжная)', parent: '0.', id: '0.5', isNode: true, isDeleted: false, isActive: false,
            expandable: false, isExpanded: false, isClickable: true, updating: false, path: ['spravochniki', 'templates', '0.5'],
            visibleFilter: true, children: []
        },
        {
            title: 'Печать списка РКПД', parent: '0.', id: '0.6', isNode: true, isDeleted: false, isActive: false,
            expandable: false, isExpanded: false, isClickable: true, updating: false, path: ['spravochniki', 'templates', '0.6'],
            visibleFilter: true, children: []
        },
        {
            title: 'Печать списка поручений', parent: '0.', id: '0.7', isNode: true, isDeleted: false, isActive: false,
            expandable: false, isExpanded: false, isClickable: true, updating: false, path: ['spravochniki', 'templates', '0.7'],
            visibleFilter: true, children: []
        },
        {
            title: 'Реестры внеш. отправки', parent: '0.', id: '0.8', isNode: true, isDeleted: false, isActive: false,
            expandable: false, isExpanded: false, isClickable: true, updating: false, path: ['spravochniki', 'templates', '0.8'],
            visibleFilter: true, children: []
        },
        {
            title: 'Печать РК', parent: '0.', id: '0.9', isNode: true, isDeleted: false, isActive: false,
            expandable: false, isExpanded: false, isClickable: true, updating: false, path: ['spravochniki', 'templates', '0.9'],
            visibleFilter: true, children: []
        },
        {
            title: 'opis_arh.exe', parent: '0.', id: '1', isNode: true, isDeleted: false, isActive: false,
            expandable: false, isExpanded: false, isClickable: true, updating: false, path: ['spravochniki', 'templates', '1'],
            visibleFilter: true, children: []
        },
        {
            title: 'Печать перечня поручений', parent: '0.', id: '2', isNode: true, isDeleted: false, isActive: false,
            expandable: false, isExpanded: false, isClickable: true, updating: false, path: ['spravochniki', 'templates', '2'],
            visibleFilter: true, children: []
        },
        {
            title: 'Печать номенклатуры дел', parent: '0.', id: '3', isNode: true, isDeleted: false, isActive: false,
            expandable: false, isExpanded: false, isClickable: true, updating: false, path: ['spravochniki', 'templates', '3'],
            visibleFilter: true, children: []
        },
    ];

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
        this.checkActiveTreeNode(this.staticDataForTree, this._filterDUE);
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
        }   else {
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
        } else if (mode && mode === 0) {
            if (critery['NAME_TEMPLATE']) {
                critery['NAME_TEMPLATE'] = critery['NAME_TEMPLATE'].replace(/"/g, '%').replace(/(\(|\)|\s)/g, '_');
            }
        }
        if (!mode) {
            if (critery['NAME_TEMPLATE']) {
                critery['NAME_TEMPLATE'] = critery['NAME_TEMPLATE'].replace(/"/g, '%').replace(/(\(|\)|\s)/g, '_');
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
        const newHead = [{
            title: 'Шаблоны', parent: null, id: '0.', isNode: true, isDeleted: false, isActive: false,
            expandable: true, isExpanded: true, isClickable: true, updating: false, path: ['spravochniki', 'templates', '0.'],
            visibleFilter: true, children: []
        }];
        this.staticDataForTree.sort((el1: CustomTreeNode, el2: CustomTreeNode) => {
            return el1.title.localeCompare(el2.title);
        }).forEach((element) => {
            newHead[0].children.push(element);
        });
        this.head = newHead;
        this._activeTreeNode = newHead[0].children[0];
        return Promise.resolve(newHead);
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
        return this.apiSrv.getHttp_client().get(`../getdoctemplate.ashx/${node.id}`, { responseType: 'blob' }).toPromise().then((data: Blob) => {
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
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(data, node.title);
        } else {
            const elem = window.document.createElement('a');
            elem.href = `../getdoctemplate.ashx/${node.id}`;
            elem.download = node.title;
            document.body.appendChild(elem);
            elem.click();
            document.body.removeChild(elem);
        }

    }
}

