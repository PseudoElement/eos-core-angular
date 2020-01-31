import { RecordDescriptor } from './record-descriptor';
import { REF_FILE } from 'eos-rest';
import { ALL_ROWS } from 'eos-rest/core/consts';
import { AbstractDictionaryDescriptor } from './abstract-dictionary-descriptor';
import { ITreeDictionaryDescriptor } from 'eos-dictionaries/interfaces';
interface TreeTempl {
    id: string;
    parentId: string;
    children: [];
    expandable: boolean;
    isActive: boolean;
    isOpened: boolean;
    isExpanded: boolean;
    level: number;
    title: string;
    path: string;
}
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
    record: TemplateDescriptor;
    dataNewFile?: REF_FILE;
    top?;
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
        .set('2', 'Печать перечня поручений');


    staticDataForTree: TreeTempl[] = [
        {
            id: '0.1', parentId: '0.', children: [], expandable: false, isActive: false, isOpened: false,
            isExpanded: false, level: 1, title: 'Информация о системе', path: 'spravochniki/templates/0.1'
        },
        {
            id: '0.2', parentId: '0.', children: [], expandable: false, isActive: false, isOpened: false,
            isExpanded: false, level: 1, title: 'Файлы документов', path: 'spravochniki/templates/0.2'
        },
        {
            id: '0.3', parentId: '0.', children: [], expandable: false, isActive: false, isOpened: false,
            isExpanded: false, level: 1, title: 'Печать списка РК', path: 'spravochniki/templates/0.3'
        },
        {
            id: '0.4', parentId: '0.', children: [], expandable: false, isActive: false, isOpened: false,
            isExpanded: false, level: 1, title: 'Печать штрих-кода (альбомная)', path: 'spravochniki/templates/0.4'
        },
        {
            id: '0.5', parentId: '0.', children: [], expandable: false, isActive: false, isOpened: false,
            isExpanded: false, level: 1, title: 'Печать штрих-кода (книжная)', path: 'spravochniki/templates/0.5'
        },
        {
            id: '0.6', parentId: '0.', children: [], expandable: false, isActive: false, isOpened: false,
            isExpanded: false, level: 1, title: 'Печать списка РКПД', path: 'spravochniki/templates/0.6'
        },
        {
            id: '0.7', parentId: '0.', children: [], expandable: false, isActive: false, isOpened: false,
            isExpanded: false, level: 1, title: 'Печать списка поручений', path: 'spravochniki/templates/0.7'
        },
        {
            id: '0.8', parentId: '0.', children: [], expandable: false, isActive: false, isOpened: false,
            isExpanded: false, level: 1, title: 'Реестры внеш. отправки', path: 'spravochniki/templates/0.8'
        },
        {
            id: '0.9', parentId: '0.', children: [], expandable: false, isActive: false, isOpened: false,
            isExpanded: false, level: 1, title: 'Печать РК', path: 'spravochniki/templates/0.9'
        },
        {
            id: '1', parentId: '0.', children: [], expandable: false, isActive: false, isOpened: false,
            isExpanded: false, level: 1, title: 'opis_arh.exe', path: 'spravochniki/templates/1'
        },
        {
            id: '2', parentId: '0.', children: [], expandable: false, isActive: false, isOpened: false,
            isExpanded: false, level: 1, title: 'Печать перечня поручений', path: 'spravochniki/templates/2'
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
        return false;
    }
    hasTemplateTree() {
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
    public getTemplateTree(data) {
        const head = [
            {
                id: '0.', parentId: 'null', children: [], expandable: true, isActive: true, isOpened: true, isExpanded: true,
                path: 'spravochniki/templates/0.', level: 0, title: 'Шаблоны'
            }
        ];
        this.staticDataForTree.sort((el1: TreeTempl, el2: TreeTempl) => {
            return el1.title.localeCompare(el2.title);
        }).forEach((element) => {
            head[0].children.push(element);
        });
        return Promise.resolve(head);
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

