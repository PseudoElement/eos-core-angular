import { Injectable } from '@angular/core';
import { CarmaHttpService, Istore } from 'app/services/carmaHttp.service';
import { Subject } from 'rxjs/Subject';

export interface IListCertStotes extends Istore {
    marked: boolean;
    isSelected: boolean;
    selectedMark: boolean;
}

@Injectable()
export class CertStoresService {
    private _currentSelectedNode$: Subject<IListCertStotes>;
    private initCarmaStores: Istore[];
    private listsCetsStores: IListCertStotes[];
    private orderByAscend: boolean = true;
    constructor(
        private carmaService: CarmaHttpService
    ) {
        this._currentSelectedNode$ = new Subject();
    }
    get getListCetsStores() {
        return this.listsCetsStores;
    }
    get getCurrentSelectedNode$() {
        return this._currentSelectedNode$.asObservable();
    }
    initCarma(listCertStores: string[]) {
        this.initCarmaStores = this.createInitCarmaStores(listCertStores);
        this.listsCetsStores = this.createListCetsStores();
        this.carmaService.init(null, this.initCarmaStores);
        this._orderByField();
    }
    selectedNode(list: IListCertStotes) {
        this.listsCetsStores.forEach(node => {
            if (node === list) {
                node.isSelected = true;
                node.selectedMark = true;
            } else {
                node.isSelected = false;
                node.selectedMark = false;
            }
        });
        this._currentSelectedNode$.next(list);
    }
    toggleAllMarks(e) {
        this.listsCetsStores.forEach(node => {
            node.marked = e.target.checked;
        });
    }
    orderByField() {
        this.orderByAscend = !this.orderByAscend;
        this._orderByField();
    }
    markNode(e, list: IListCertStotes) {
        if (!e) {
            list.marked = e;
            list.selectedMark = e;
        } else {
            list.marked = e;
        }
    }

    private createInitCarmaStores(listStore: string[]) {
        const list = [];
        listStore.forEach((str: string) => {
            const arr = str.split(':');
            list.push({
                Location: arr[0],
                Address: '',
                Name: arr[1]
            });
        });
        return list;
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
}
