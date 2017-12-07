import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { EosDictionary } from '../core/eos-dictionary';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { IDictionaryViewParameters } from '../core/eos-dictionary.interfaces';
import { ISearchSettings } from '../core/search-settings.interface';

import { DICTIONARIES } from '../consts/dictionaries.consts';
import { WARN_SEARCH_NOTFOUND, DANGER_LOGICALY_RESTORE_ELEMENT } from '../consts/messages.consts';
import { LS_USE_USER_ORDER } from '../consts/common';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { EosUserProfileService } from 'app/services/eos-user-profile.service';
import { IOrderBy } from '../core/sort.interface'
import { EosStorageService } from 'app/services/eos-storage.service';
import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';
import { CONFIRM_SUBNODES_RESTORE } from 'app/consts/confirms.const';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { IDictionaryDescriptor } from 'eos-dictionaries/core/dictionary.interfaces';

@Injectable()
export class EosDictService {
    private dictionary: EosDictionary;
    private selectedNode: EosDictionaryNode; // selected in tree
    private _openedNode: EosDictionaryNode; // selected in list of selectedNode children
    private _currentList: EosDictionaryNode[];
    public viewParameters: IDictionaryViewParameters;

    private _dictionary$: BehaviorSubject<EosDictionary>;
    private _selectedNode$: BehaviorSubject<EosDictionaryNode>;
    private _openedNode$: BehaviorSubject<EosDictionaryNode>;
    private _currentList$: BehaviorSubject<EosDictionaryNode[]>;
    private _viewParameters$: BehaviorSubject<IDictionaryViewParameters>;

    private _mDictionaryPromise: Map<string, Promise<EosDictionary>>;
    private _dictionaries: Map<string, IDictionaryDescriptor>

    public currentTab = 0;

    /* Observable dictionary for subscribing on updates in components */
    get dictionary$(): Observable<EosDictionary> {
        return this._dictionary$.asObservable();
    }

    /* Observable currentNode for subscribing on updates in components */
    get selectedNode$(): Observable<EosDictionaryNode> {
        return this._selectedNode$.asObservable();
    }

    /* Observable openNode for subscribing on updates in components */
    get openedNode$(): Observable<EosDictionaryNode> {
        return this._openedNode$.asObservable();
    }

    get currentList$(): Observable<EosDictionaryNode[]> {
        return this._currentList$.asObservable();
    }

    get viewParameters$(): Observable<IDictionaryViewParameters> {
        return this._viewParameters$.asObservable();
    }

    get userOrdered(): boolean {
        return this.dictionary && this.dictionary.userOrdered;
    }

    get order() {
        return this.dictionary.orderBy;
    }


    /*get currentTab(): number {
        return this._currentTab;
    }

    set currentTab(val: number) {
        this._currentTab = val;
    }*/

    constructor(
        private _msgSrv: EosMessageService,
        private _profileSrv: EosUserProfileService,
        private _storageSrv: EosStorageService,
        private _confirmSrv: ConfirmWindowService,
        private _pipeSrv: PipRX,
    ) {
        this._initViewParameters();
        this._selectedNode$ = new BehaviorSubject<EosDictionaryNode>(null);
        this._openedNode$ = new BehaviorSubject<EosDictionaryNode>(null);
        this._dictionary$ = new BehaviorSubject<EosDictionary>(null);
        this._mDictionaryPromise = new Map<string, Promise<EosDictionary>>();
        this._currentList$ = new BehaviorSubject<EosDictionaryNode[]>([]);
        this._viewParameters$ = new BehaviorSubject<IDictionaryViewParameters>(this.viewParameters);
        this._dictionaries = new Map<string, IDictionaryDescriptor>();
        DICTIONARIES
            .sort((a, b) => {
                if (a.title > b.title) {
                    return 1;
                } else if (a.title < b.title) {
                    return -1;
                } else {
                    return 0;
                }
            })
            .forEach((dict) => this._dictionaries.set(dict.id, dict));
    }

    private _initViewParameters() {
        this.viewParameters = {
            showDeleted: false,
            userOrdered: false,
            markItems: false,
            searchResults: false,
            updating: false,
            haveMarked: false
        };
    }

    public getDictionariesList(): Promise<any> {
        return Promise.resolve(DICTIONARIES);
    }

    public defaultOrder() {
        this.dictionary.defaultOrder();
        this._reorder();
    }

    public closeDictionary() {
        this.dictionary = this.selectedNode = this._openedNode = null;
        this._initViewParameters();
        this._viewParameters$.next(this.viewParameters);
        this._currentList = [];
        this._currentList$.next([]);
        this._openedNode$.next(null);
        this._selectedNode$.next(null);
        this._dictionary$.next(null);
    }

    public openDictionary(dictionaryId: string): Promise<EosDictionary> {
        return this._profileSrv.checkAuth()
            .then((authorized) => {
                if (authorized) {
                    if (this.dictionary && this.dictionary.id === dictionaryId) {
                        return this.dictionary;
                    } else {
                        this.viewParameters.showDeleted = false;
                        this._viewParameters$.next(this.viewParameters);
                        if (this.dictionary) {
                            this.closeDictionary();
                        }
                        return this._openDictionary(dictionaryId);
                    }
                } else {
                    this.closeDictionary();
                    return null;
                }
            });
    }

    private _openDictionary(dictionaryId: string): Promise<EosDictionary> {
        let _p: Promise<EosDictionary> = this._mDictionaryPromise.get(dictionaryId);
        if (!_p) {
            const descriptor = this._dictionaries.get(dictionaryId);
            if (descriptor) {
                this.dictionary = new EosDictionary(descriptor, this._pipeSrv);
                _p = this.dictionary.init()
                    .then((root) => {
                        this._initViewParameters();
                        this.viewParameters.userOrdered = this._storageSrv.getUserOrderState(this.dictionary.id);
                        this.viewParameters.markItems = this.dictionary.canMarkItems;
                        this._viewParameters$.next(this.viewParameters);
                        this.dictionary.initUserOrder(
                            this.viewParameters.userOrdered,
                            this._storageSrv.getUserOrder(this.dictionary.id)
                        );
                        this._mDictionaryPromise.delete(dictionaryId);
                        this._dictionary$.next(this.dictionary);
                        return this.dictionary;
                    })
                    .catch((err) => {
                        this.closeDictionary();
                        this._mDictionaryPromise.delete(dictionaryId);
                        return null;
                    });
                this._mDictionaryPromise.set(dictionaryId, _p);
            } else {
                _p = Promise.reject({ message: 'No dictionary' });
            }
        }
        return _p;
    }

    public getNode(dictionaryId: string, nodeId: string): Promise<EosDictionaryNode> {
        return this.openDictionary(dictionaryId)
            .then(() => this._getNode(nodeId));
    }

    private _getNode(nodeId: string): Promise<EosDictionaryNode> {
        // todo: refactor
        // console.log('get node', nodeId);
        if (this.dictionary) {
            const _node = this.dictionary.getNode(nodeId);
            if (_node) {
                if (_node.loaded) {
                    return Promise.resolve(_node);
                } else {
                    return this.loadChildren(_node);
                }
            } else {
                return this.dictionary.descriptor.getRecord(nodeId)
                    .then((data) => {
                        this._updateDictNodes(data, false);
                        return this.dictionary.getNode(nodeId);
                    })
                    .then((node) => {
                        return this.loadChildren(node);
                    })
            }
        }
    }

    public loadChildren(node: EosDictionaryNode): Promise<EosDictionaryNode> {
        if (this.dictionary) {
            return this.dictionary.getChildren(node)
                .then((nodes) => {
                    return node;
                });
        } else {
            return Promise.resolve(null);
        }
    }

    public reloadNode(node: EosDictionaryNode): Promise<EosDictionaryNode> {
        node.updating = true;
        return this.dictionary.descriptor.getRecord(node.originalId)
            .then((nodeData) => {
                node.updateData(nodeData);
                node.updating = false;
                return node;
            })
    }

    public expandNode(nodeId: string): Promise<EosDictionaryNode> {
        return this.dictionary.expandNode(nodeId);
    }

    private _updateDictNodes(data: any[], updateTree = false): EosDictionaryNode[] {
        if (data && data.length) {
            return this.dictionary.updateNodes(data, updateTree);
        } else {
            return null;
        }
    }

    private _setCurrentList(nodes: EosDictionaryNode[]) {
        this._currentList = nodes || [];
        // todo: filter & order list before anounce
        this._updateCurrentList();
    }

    private _updateCurrentList() {
        let nodes = this._currentList;
        if (!this.viewParameters.showDeleted) {
            nodes = nodes.filter((node) => node.isVisible(this.viewParameters.showDeleted));
        }
        this._currentList$.next(nodes);
    }

    /**
     *
     * @param nodeId node ID to be selected
     * @returns selected node in current dictionary
     */
    public selectNode(nodeId: string): Promise<EosDictionaryNode> {
        if (nodeId) {
            if (this.selectedNode && this.selectedNode.id !== nodeId) {
                this.viewParameters.showDeleted = false;
                this._viewParameters$.next(this.viewParameters);
                return this._getNode(nodeId)
                .then((node) => {
                    if (node) {
                        let parent = node.parent;
                        while (parent) {
                            parent.isExpanded = true;
                            parent = parent.parent;
                        }
                    }
                    this.viewParameters.updating = false;
                    this._viewParameters$.next(this.viewParameters);
                    this._selectNode(node);
                    return node;
                });
            }
        } else {
            return Promise.resolve(this._selectRoot());
        }
    }

    private _selectNode(node: EosDictionaryNode) {
        if (this.selectedNode !== node) {
            if (this.selectedNode) {
                if (this.selectedNode.children) {
                    this.selectedNode.children.forEach((child) => child.marked = false);
                }
                this.selectedNode.isActive = false;
            }
            if (node) {
                node.isActive = true;
                this._setCurrentList(node.children);
            }
            this._openNode(null);
            this.selectedNode = node;
            this._reorder();
            this._selectedNode$.next(node);
            this.viewParameters.searchResults = false;
            this._viewParameters$.next(this.viewParameters);
        }
    }

    private _selectRoot(): EosDictionaryNode {
        let node: EosDictionaryNode = null;
        if (this.dictionary && this.dictionary.root) {
            node = this.dictionary.root;
        }
        this._selectNode(node);
        return node;
    }

    public openNode(nodeId: string): Promise<EosDictionaryNode> {
        if (this.dictionary) {
            if (!this._openedNode || this._openedNode.id !== nodeId) {
                return this.dictionary.getFullNodeInfo(nodeId)
                    .then((node) => {
                        this._openNode(node);
                        return node;
                    });
            } else {
                return Promise.resolve(this._openedNode);
            }
        } else {
            return Promise.resolve(null);
        }
    }

    private _openNode(node: EosDictionaryNode) {
        if (this._openedNode !== node) {
            if (this._openedNode) {
                this._openedNode.isSelected = false;
            }
            if (node) {
                node.isSelected = true;
            }
            this._openedNode = node;
            this._openedNode$.next(node);
        }
    }

    public isRoot(nodeId: string): boolean {
        return this.dictionary.root && this.dictionary.root.id === nodeId;
    }

    public updateNode(node: EosDictionaryNode, data: any): Promise<EosDictionaryNode> {
        return this.dictionary.descriptor.updateRecord(node.data, data)
            .then(() => {
                return this.reloadNode(node);
            });
    }

    public addNode(data: any): Promise<any> {
        if (this.selectedNode) {
            console.log('addNode', data, this.selectedNode.data);
            return this.dictionary.descriptor.addRecord(data, this.selectedNode.data)
                .then((newNodeId) => {
                    console.log('created node', newNodeId);
                    return this.dictionary.getChildren(this.selectedNode)
                        .then((nodes) => {
                            this._setCurrentList(nodes);
                            this._selectedNode$.next(this.selectedNode);
                            return this.dictionary.getNode(newNodeId + '');
                        });
                });
        } else {
            return Promise.reject('No selected node');
        }
    }

    public deleteMarkedNodes(nodes: string[]): Promise<boolean> {
        if (this.dictionary) {
            return this.dictionary.deleteMarked(nodes)
                .then((resp) => {
                    return this.dictionary.getChildren(this.selectedNode)
                        .then((list) => {
                            this._setCurrentList(list);
                            return true;
                        });
                });
        } else {
            return Promise.resolve(false);
        }
    }

    public restoreNodes(nodes: EosDictionaryNode[], recursive = false): Promise<boolean> {
        if (this.dictionary) {
        return this.dictionary.restoreMarked(recursive)
            .then(() => {
                return this.dictionary.getChildren(this.selectedNode)
                .then((list) => {
                    this._setCurrentList(list);
                    return true;
                });
            });
        } else {
            return Promise.resolve(false);
        }
    }

    public physicallyDelete(nodeId: string): Promise<any> {
        const _node = this.dictionary.getNode(nodeId);
        return this.dictionary.descriptor.deleteRecord(_node.data.rec)
            .then(() => {
                this.dictionary.deleteNode(nodeId, true);
                // console.log('update list', this.selectedNode);
                this._setCurrentList(this.selectedNode.children);
                this._selectedNode$.next(this.selectedNode);
            });
    }

    public search(searchString: string, params: ISearchSettings): Promise<EosDictionaryNode[]> {
        const _criteries = this.dictionary.getSearchCriteries(searchString, params, this.selectedNode);
        return this._search(_criteries);
    }

    public fullSearch(data: any, params: ISearchSettings) {
        const critery = this.dictionary.getFullsearchCriteries(data, params, this.selectedNode);
        return this._search([critery]);
    }


    private _search(criteries: any[]): Promise<EosDictionaryNode[]> {
        // console.log('full search', critery);
        this._openNode(null);
        this.viewParameters.updating = true;
        return this.dictionary.descriptor.search(criteries)
            .then((data: any[]) => {
                let nodes = [];
                if (!data || data.length < 1) {
                    this._msgSrv.addNewMessage(WARN_SEARCH_NOTFOUND);
                } else {
                    nodes = this.dictionary.updateNodes(data, false);
                }
                this._setCurrentList(nodes);
                this.viewParameters.updating = false;
                this.viewParameters.searchResults = true;
                this._viewParameters$.next(this.viewParameters);
                return this._currentList;
            });
    }

    private _restoreItem(node: EosDictionaryNode) {
        if (node.parent && node.parent.isDeleted) {
            this._msgSrv.addNewMessage(DANGER_LOGICALY_RESTORE_ELEMENT);
        }
        this.updateNode(node, { DELETED: 0 }).then((res) => {
            this.reloadNode(node);
        });
        Object.assign(node, { ...node, marked: false });
        if (node.children) {
            node.children.forEach((subNode) => {
                this._restoreItem(subNode);
            });
        }
    }

    filter(params: any): Promise<any> {
        return Promise.reject('not implemeted')
    }

    getNodePath(node: EosDictionaryNode): string[] {
        const _path = [
            'spravochniki',
            this.dictionary.id,
        ];

        if (this.dictionary.root !== node) {
            _path.push(node.id);
        }
        return _path;
    }

    getFullNode(dictionaryId: string, nodeId: string): Promise<EosDictionaryNode> {
        return this.openDictionary(dictionaryId)
            .then(() => this.dictionary.getFullNodeInfo(nodeId));
    }

    public orderBy(orderBy: IOrderBy) {
        if (this.dictionary) {
            this.dictionary.orderBy = orderBy;
            this._reorder();
        }
    }

    public toggleUserOrder(value?: boolean) {
        if (value === undefined) {
            this.viewParameters.userOrdered = !this.viewParameters.userOrdered;
        } else {
            this.viewParameters.userOrdered = value;
        }
        this._viewParameters$.next(this.viewParameters);

        if (this.viewParameters.userOrdered) {
            this.dictionary.orderBy = null;
        } else {
            this.defaultOrder();
        }

        if (this.dictionary) {
            this.dictionary.userOrdered = this.viewParameters.userOrdered;
            this._storageSrv.setUserOrderState(this.dictionary.id, this.dictionary.userOrdered);
            this._reorder();
        }
    }

    // temporary
    private _reorder() {
        if (this.dictionary) {
            if (this.viewParameters.searchResults) {
                this._setCurrentList(this.dictionary.reorderList(this._currentList));
            } else {
                this._setCurrentList(this.dictionary.reorderList(this._currentList, this.selectedNode.id));
            }
        }
    }

    private aToKeys(a: EosDictionaryNode[]): string[] {
        return a.map((node) => node.id);
    }

    setUserOrder(ordered: EosDictionaryNode[], fullList: EosDictionaryNode[]) {
        const _original = [];
        const _move = {};

        console.log('setUserOrder', this.aToKeys(ordered), this.aToKeys(fullList));
        // restore original order
        fullList.forEach((node) => {
            const _oNode = ordered.find((item) => item.id === node.id);
            if (_oNode) {
                _original.push(node);
            }
        });

        _original.forEach((node, idx) => {
            _move[node.id] = ordered[idx];
        });

        const _order = fullList.map((node) => {
            if (_move[node.id]) {
                return _move[node.id].id;
            } else {
                return node.id;
            }
        });

        if (this.dictionary && this.selectedNode) {
            this.dictionary.setNodeUserOrder(this.selectedNode.id, _order);
            this._reorder();
            this._storageSrv.setUserOrder(this.dictionary.id, this.selectedNode.id, _order);
        }
    }

    toggleDeleted() {
        this.viewParameters.showDeleted = !this.viewParameters.showDeleted;
        if (!this.viewParameters.showDeleted) {
            this._currentList.forEach((node) => {
                if (node.isDeleted) { node.marked = false; }
            });
        }
        this._updateCurrentList();
        this._viewParameters$.next(this.viewParameters);
    }

    private _errHandler(err) {
        const errMessage = err.message ? err.message : err;
        this._msgSrv.addNewMessage({
            type: 'danger',
            title: 'Ошибка операции',
            msg: errMessage,
            dismissOnTimeout: 100000
        });
        return null;
    }

    isUnic(val: string, key: string, inDict?: boolean, nodeId?: string): { [key: string]: any } {
        if (inDict) {
            let _hasMatch = false;
            this.dictionary.nodes.forEach((_node) => {
                if (_node.data.rec[key] === val && _node.id !== nodeId) {
                    _hasMatch = true;
                }
            });
            return _hasMatch ? { 'isUnic': _hasMatch } : null;
        } else if (this.selectedNode) {
            /* tslint:disable:no-bitwise */
            const _hasMatch = !!~this.selectedNode.children.findIndex((_node) => _node.data.rec[key] === val);
            /* tslint:enable:no-bitwise */
            return _hasMatch ? { 'isUnic': _hasMatch } : null;
        } else {
            return null;
        }
    }

    public markItem(val: boolean) {
        this.viewParameters.haveMarked = val;
        this._viewParameters$.next(this.viewParameters);
    }
}
