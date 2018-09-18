import { Injectable } from '@angular/core';
import { CarmaHttpService, Istore } from 'app/services/carmaHttp.service';
import { Subject } from 'rxjs/Subject';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { PARM_NOT_CARMA_SERVER, PARM_ERR_OPEN_CERT_STORES } from '../shared/consts/eos-parameters.const';
import { AbstractControl } from '@angular/forms';
import { IListStores } from '../shared/consts/web.consts';
import { Observable } from 'rxjs/Observable';

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
    private updateFormControl$: Subject<string>;
    private isCarmaServer: boolean = false;
    private initCarmaStores: Istore[];
    private listsCetsStores: IListCertStotes[];
    private orderByAscend: boolean = true;
    private formControlStore: AbstractControl;
    private formControlInitString: AbstractControl;
    constructor(
        private carmaService: CarmaHttpService,
        private msgSrv: EosMessageService
    ) {
        this._currentSelectedNode$ = new Subject();
        this._isCarmaServer$ = new Subject();
        this.updateFormControl$ = new Subject();
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
    initCarma(listCertStores: string[]) {
        this.createInitCarmaStores(listCertStores);
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
        this.listsCetsStores.push(this.createListCertStotes(node));
        this.updateFormControl$.next(this.createStringForUpdate());
        this.carmaService.SetCurrentStores(this.listsCetsStores);
    }
    showListCertNode() {
        if (this.isCarmaServer) {
            const curName = this.currentSelectedNode.Name;
            let name;
            if (curName.indexOf('\\') !== -1) {
                name = curName.split('\\')[1];
            } else {
                name = curName;
            }
            return this.carmaService.EnumCertificates(
                this.currentSelectedNode.Location,
                this.currentSelectedNode.Address,
                name
            );
        } else {
            this.msgSrv.addNewMessage(PARM_NOT_CARMA_SERVER);
        }
    }
    showListStores(location, address) {
        return this.carmaService.EnumStores(location, address);
    }
    deleteStores(): string {
        const actuallyStores: string[] = [];
        for (let i = 0; i < this.listsCetsStores.length; i++) {
            const node = this.listsCetsStores[i];
            if (node.marked || node.selectedMark) {
                if (node === this.currentSelectedNode) {
                    this.currentSelectedNode = null;
                }
                this.listsCetsStores.splice(i, 1);
                i --;
            } else {
                actuallyStores.push(`${node.Location}:${node.Name}`);
            }
        }
        this.checkMarkNode();
        if (actuallyStores.length) {
            return actuallyStores.join('\t');
        }
        return '';
    }
    showCert(certId: string) {
        this.carmaService.ShowCert(certId)
            .catch(e => {
                this.msgSrv.addNewMessage(PARM_ERR_OPEN_CERT_STORES);
                return Observable.of(null);
            })
            .subscribe(() => {});
    }
    private createInitCarmaStores(listCertStores: string[]) {
        const list = [];
        listCertStores.forEach((str: string) => {
            let address = '';
            const arr = str.split(':');
            if (arr[1].indexOf('\\') !== -1) {
                address = arr[1].split('\\')[0];
            }
            list.push({
                Location: arr[0],
                Address: address,
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
        return this.carmaService.init(this.formControlInitString.value, this.initCarmaStores)
        .subscribe(
            (data: boolean) => {
                this.isCarmaServer = data;
                this._isCarmaServer$.next(data);
            },
            () => {
                this.isCarmaServer = false;
                this._isCarmaServer$.next(false);
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
    private createListCertStotes(node: IListStores): IListCertStotes {
        return {
            Location: node.location,
            Address: node.address,
            Name: node.name,
            marked: false,
            isSelected: false,
            selectedMark: false
        };
    }
    private createStringForUpdate() {
        if (this.listsCetsStores.length) {
            const stores: string[] = [];
            this.listsCetsStores.forEach(node => {
                stores.push(`${node.Location}:${node.Name}`);
            });
            return stores.join('\t');
        } else {
            return '';
        }
    }
}
