import { Injectable } from '@angular/core';
import { CarmaHttpService, Istore } from 'app/services/carmaHttp.service';
import { Subject } from 'rxjs/Subject';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { PARM_NOT_CARMA_SERVER } from '../../shared/consts/eos-parameters.const';

export interface IListCertStotes extends Istore {
    marked: boolean;
    isSelected: boolean;
    selectedMark: boolean;
}

@Injectable()
export class CertStoresService {
    isMarkNode: boolean = false;
    private currentSelectedNode: IListCertStotes;
    private _currentSelectedNode$: Subject<IListCertStotes>;
    private _isCarmaServer$: Subject<boolean>;
    private isCarmaServer: boolean = false;
    private initCarmaStores: Istore[];
    private listsCetsStores: IListCertStotes[];
    private orderByAscend: boolean = true;
    private listStoresDb: string[];
    constructor(
        private carmaService: CarmaHttpService,
        private msgSrv: EosMessageService
    ) {
        this._currentSelectedNode$ = new Subject();
        this._isCarmaServer$ = new Subject();
    }
    get getListCetsStores() {
        return this.listsCetsStores;
    }
    get getCurrentSelectedNode$() {
        return this._currentSelectedNode$.asObservable();
    }
    get getIsCarmaServer$() {
        return this._isCarmaServer$.asObservable();
    }
    initCarma(listCertStores: string[]) {
        this.listStoresDb = listCertStores;
        this.createInitCarmaStores();
        this.listsCetsStores = this.createListCetsStores();
        this._orderByField();
        this.initCarmaServer();
    }
    selectedNode(list: IListCertStotes) {
        this.isMarkNode = true;
        this.listsCetsStores.forEach(node => {
            if (node === list) {
                node.isSelected = true;
                node.selectedMark = true;
            } else {
                node.isSelected = false;
                node.selectedMark = false;
            }
        });
        this.currentSelectedNode = list;
        this._currentSelectedNode$.next(list);
    }
    toggleAllMarks(e) {
        if (e.target.checked) {
            this.listsCetsStores.forEach(node => {
                node.marked = e.target.checked;
            });
        } else {
                this.listsCetsStores.forEach(node => {
                    node.marked = e.target.checked;
                    node.selectedMark = e.target.checked;
                    node.isSelected = false;

                });
        }
    }
    orderByField() {
        this.orderByAscend = !this.orderByAscend;
        this._orderByField();
    }
    markNode(e, list: IListCertStotes) {
        if (!e) {
            list.marked = e;
            list.selectedMark = e;
            this.checkMarkNode();
        } else {
            list.marked = e;
            this.isMarkNode = true;
        }
    }
    addStores() {
        if (this.isCarmaServer) {
            // console.log('open add stores');
        } else {
            this.msgSrv.addNewMessage(PARM_NOT_CARMA_SERVER);
        }
    }
    showListCertNode() {
        if (this.isCarmaServer) {
            return this.carmaService.EnumCertificates(
                this.currentSelectedNode.Location,
                this.currentSelectedNode.Address,
                this.currentSelectedNode.Name
            );
        } else {
            this.msgSrv.addNewMessage(PARM_NOT_CARMA_SERVER);
        }
    }
    showListStores(location, address) {
        return this.carmaService.EnumStores(location, address);
    }
    deleteStores(): string {
        for (let i = 0; i < this.listsCetsStores.length; i++) {
            const node = this.listsCetsStores[i];
            if (node.marked || node.selectedMark) {
                const k = this.listStoresDb.findIndex((str) => {
                    const arr = str.split(':');
                    if (arr[0] === node.Location && arr[1] === node.Name) {
                        return true;
                    }
                });
                this.listStoresDb.splice(k, 1);

                this.listsCetsStores.splice(i, 1);
                i --;
            }
        }
        this.checkMarkNode();
        return this.listStoresDb.join('\t');
    }
    private createInitCarmaStores() {
        const list = [];
        this.listStoresDb.forEach((str: string) => {
            const arr = str.split(':');
            list.push({
                Location: arr[0],
                Address: '',
                Name: arr[1]
            });
        });
        this.initCarmaStores = list;
    }

    private createListCetsStores(): IListCertStotes[] {
        const a = [];
        this.initCarmaStores.forEach(elem => {
            a.push(Object.assign({
                marked: false,
                isSelected: false,
                selectedMark: false,
            }, elem));
        });
        return a;
    }
    private _orderByField() {
        this.listsCetsStores.sort((a: IListCertStotes, b: IListCertStotes) => {
            const _a = a.Name.toUpperCase();
            const _b = b.Name.toUpperCase();
            if (_a > _b) {
                return this.orderByAscend ? 1 : -1;
            }
            if (_a < _b) {
                return this.orderByAscend ? -1 : 1;
            }
            if (_a === _b) {
                return 0;
            }
        });
    }
    private initCarmaServer() {
        return this.carmaService.init(null, this.initCarmaStores)
        .subscribe(
            (data: boolean) => {
                this.isCarmaServer = data;
            },
            (err) => {
                this.isCarmaServer = false;
            }
        );
    }
    private checkMarkNode() {
        let check = false;
        this.listsCetsStores.forEach(node => {
            if (node.marked || node.selectedMark) {
                check = true;
            }
        });
        this.isMarkNode = check;
    }
}
