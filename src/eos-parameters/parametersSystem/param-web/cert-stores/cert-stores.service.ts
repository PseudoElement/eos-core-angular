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
    public _currentSelectedNode$: Subject<IListCertStotes>;
    private initCarmaStores: Istore[];
    private listsCetsStores: IListCertStotes[];
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
}
