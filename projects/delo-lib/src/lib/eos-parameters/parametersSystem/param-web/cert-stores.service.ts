import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Subject } from 'rxjs';
/* import { catchError } from 'rxjs/operators'; */

import { Istore } from '../../../app/services/carmaHttp.service';
import { EosMessageService } from '../../../eos-common/services/eos-message.service';
import { /* PARM_NOT_CARMA_SERVER, */ /* PARM_ERR_OPEN_CERT_STORES, */ CARMA_UNIC_VALUE } from '../shared/consts/eos-parameters.const';
import { IListStores } from '../shared/consts/web.consts';
import { CarmaHttp2Service } from '../../../app/services/camaHttp2.service';
import { AppContext } from '../../../eos-rest';

export interface IListCertStotes extends Istore {
    marked: boolean;
    isSelected: boolean;
    selectedMark: boolean;
}

@Injectable()
export class CertStoresService {
    isMarkNode: boolean = false;
    carmaLoader: boolean = true;
    private currentSelectedNode: IListCertStotes;
    private _currentSelectedNode$: Subject<IListCertStotes>;
    private updateFormControl$: Subject<string>;
    //  private isCarmaServer: boolean = false;
    private initCarmaStores: Istore[];
    private listsCetsStores: IListCertStotes[];
    private orderByAscend: boolean = true;
    private formControlStore: AbstractControl;
    private formControlInitString: AbstractControl;
    private unicStoreName: Set<string> = new Set();
    constructor(
        //    private carmaService: CarmaHttpService,
        private carmaHttp2Srv: CarmaHttp2Service,
        private msgSrv: EosMessageService,
        private _appContext: AppContext
    ) {
        this._currentSelectedNode$ = new Subject();
        this.updateFormControl$ = new Subject();
    }
    get getListCetsStores() {
        return this.listsCetsStores;
    }
    get getCurrentSelectedNode$() {
        return this._currentSelectedNode$.asObservable();
    }
    get updateFormControlStore$() {
        return this.updateFormControl$.asObservable();
    }
    get formControl() {
        return this.formControlStore;
    }
    set formControl(formControl: AbstractControl) {
        this.formControlStore = formControl;
    }
    set formControlInit(formControl: AbstractControl) {
        this.formControlInitString = formControl;
    }
    get formControlInit() {
        return this.formControlInitString;
    }
    initCarma(listCertStores: string[]) {
        this.createInitCarmaStores(listCertStores);
        this.listsCetsStores = this.createListCetsStores();
        this._orderByField();
        this.initCarmaServer().then((result) => {
            this.carmaLoader = false;
        });
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
            });
        }
        this.checkMarkNode();
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
    addStores(node: IListStores) {
        if (this.unicStoreName.has(this.parseName(node))) {
            this.msgSrv.addNewMessage(CARMA_UNIC_VALUE);
        } else {
            this.unicStoreName.add(this.parseName(node));
            this.listsCetsStores.push(this.createListCertStotes(node));
            this.updateFormControl$.next(this.createStringForUpdate());
        }
    }
    updateStores(update: IListStores, editElem) {
        if (this.unicStoreName.has(this.parseName(update))) {
            this.msgSrv.addNewMessage(CARMA_UNIC_VALUE);
        } else {
            this.unicStoreName.forEach((item) => {
                if (item === this.parseName(editElem)) {
                    item = this.parseName(update);
                }
            })
            this.listsCetsStores.forEach((item) => {
                if (this.parseName(item) === this.parseName(editElem)) {
                    item['Address'] = update['Address'];
                    item['Location'] = update['Location'];
                    item['Name'] = update['Name'];
                }
            });
            this.updateFormControl$.next(this.createStringForUpdate());
        }
    }
    showListCertNode(): Promise<any> {
        const curName = this.currentSelectedNode && this.currentSelectedNode.Name;
        let name;
        if (curName.indexOf('\\') !== -1) {
            name = curName.split('\\')[1];
        } else {
            name = curName;
        }
        return this.carmaHttp2Srv.EnumCertificates(
            this.currentSelectedNode.Location,
            this.currentSelectedNode.Address,
            name
        );
    }
    public showListStores(location, address): Promise<any> {
        return this.carmaHttp2Srv.EnumStores(location, address).then(data => {
            if (data && data.stores) {
                return data.stores;
            }
        });
    }
    deleteStores(): string {
        const actuallyStores: string[] = [];
        for (let i = 0; i < this.listsCetsStores.length; i++) {
            const node = this.listsCetsStores[i];
            if (node.marked || node.selectedMark) {
                if (node === this.currentSelectedNode) {
                    this.currentSelectedNode = null;
                    this._currentSelectedNode$.next(null);
                }
                if (this.unicStoreName.has(this.parseName(node))) {
                    this.unicStoreName.delete(this.parseName(node));
                }
                this.listsCetsStores.splice(i, 1);
                i--;
            } else {
                actuallyStores.push(this.createDbList(node));
            }
        }
        this.checkMarkNode();
        if (actuallyStores.length) {
            return actuallyStores.join('\t');
        }
        return '';
    }

    public showCert(certId: string): void {
        this.carmaHttp2Srv.showCertInfo(certId);
    }
    public parseName(elem): string {
        if (elem.Location === 'sslm') {
            const address = String(elem.Address).trim();
            if (address.length) {
                return `${elem.Location}:${address}\\${elem.Name}`;
            }
            return `${elem.Location}:${elem.Name}`;
        } else {
            return `${elem.Location}:${elem.Name}`;
        }
    }
    private createInitCarmaStores(listCertStores: string[]) {
        const list = [];
        listCertStores.forEach((str: string) => {
            // let address = '';
            const arr = str.split(':');
            // if (arr[1].indexOf('\\') !== -1) {
            //     address = arr[1].split('\\')[0];
            // }
            list.push({
                Location: arr[0],
                Address: this.getAddress(arr),
                Name: this.getTitle(arr)
            });
        });
        this.initCarmaStores = list;
    }

    private getTitle(arr: string[]): string {
        const location = arr[0];
        const AddressWithName = arr[1];
        if (location === 'sslm') {
            const parse = AddressWithName.split('\\');
            if (parse.length > 1) {
                return parse[1];
            }
            return parse[0];
        } else {
            return arr[1];
        }
    }
    private getAddress(arr: string[]): string {
        const location = arr[0];
        const AddressWithName = arr[1];
        if (location === 'sslm') {
            const parse = AddressWithName.split('\\');
            if (parse.length > 1) {
                return String(parse[0]).trim();
            }
            return '';
        } else {
            return '';
        }
    }

    private createListCetsStores(): IListCertStotes[] {
        this.unicStoreName.clear();
        const a = [];
        this.initCarmaStores.forEach(elem => {
            this.unicStoreName.add(this.parseName(elem));
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
    private async initCarmaServer() {
        let addr;
        /* if (this.formControlInitString) {
            addr = this.formControlInitString.value ? this.formControlInitString.value : 'http://localhost:8080//';
        } else { */
            let cryptoStr;
            this._appContext.CurrentUser['USER_PARMS_List'].forEach((params) => {
                if (params['PARM_NAME'] === 'CRYPTO_INITSTR') {
                    cryptoStr = params['PARM_VALUE'];
                }
            });
            if (!cryptoStr) {
                const crypto = await this._appContext.get99UserParms('CRYPTO_INITSTR');
                cryptoStr = crypto['PARM_VALUE'];
            }
            addr = cryptoStr ? cryptoStr : 'http://localhost:8080//';
        /* } */
        return this.carmaHttp2Srv.connect(addr, this.initCarmaStores);
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
    private createListCertStotes(node: IListStores): IListCertStotes {
        return {
            Location: node.Location,
            Address: node.Address,
            Name: node.Name,
            marked: false,
            isSelected: false,
            selectedMark: false
        };
    }
    private createStringForUpdate() {
        if (this.listsCetsStores.length) {
            const stores: string[] = [];
            this.listsCetsStores.forEach(node => {
                stores.push(this.createDbList(node));
            });
            return stores.join('\t');
        } else {
            return '';
        }
    }
    private createDbList(node: any): string {
        const standartName = `${node.Location}:${node.Name}`;
        if (node.Location === 'sslm') {
            return node.Address ? `${node.Location}:${node.Address}\\${node.Name}` : standartName;
        } else {
            return standartName;
        }
    }
}
