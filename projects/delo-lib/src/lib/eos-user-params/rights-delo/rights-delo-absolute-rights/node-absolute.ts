import { IInputParamControl, IParamUserCl } from '../../../eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { AbstractControl } from '@angular/forms';
import { E_RIGHT_DELO_ACCESS_CONTENT, IChengeItemAbsolute } from './right-delo.intefaces';
import { NodeDocsTree } from '../../../eos-user-params/shared/list-docs-tree/node-docs-tree';
import { EosStorageService } from '../../../app/services/eos-storage.service';

export class NodeAbsoluteRight {
    isSelected: boolean;
    isCreate: boolean = false;
    touched: boolean = false;
    control: AbstractControl;
    ischeckedAll: boolean = false;
    get viewToAuthorized(): boolean {
        return this._constData.viewToAuthorized;
    }
    get contentProp(): E_RIGHT_DELO_ACCESS_CONTENT {
        return this._constData.data['rightContent'];
    }
    get key() {
        return this._constData.key;
    }
    get label() {
        return this._constData.label;
    }
    get change(): IChengeItemAbsolute[] {
        return this._change;
    }
    get value(): number {
        return this._value;
    }

    set value(v: number) {
        if (v === this._valueDb) {
            this.touched = false;
        } else {
            this.touched = true;
        }
        if (!this._value && v) {
            this.isCreate = true;
        }
        if (v && this.isCreate && this.contentProp === E_RIGHT_DELO_ACCESS_CONTENT.all) {
            v = 2; // для параметров с радио "всех и не заполненных", значение по умолчанию "не заполненных"
            this.isCreate = false;
        }
        this._value = v;
        this.control.patchValue(!!v);
    }
    private _constData: IInputParamControl;
    private _value: number;
    private _valueDb: number;
    private _change: IChengeItemAbsolute[] = [];
    private _curentUser: IParamUserCl;
    private _weightChanges: IChengeItemAbsolute[] = [];
    private __weightChangesOrg = [];
    constructor(node: IInputParamControl, v: number, con: AbstractControl, user: IParamUserCl) {
        this._constData = node;
        this._value = v;
        this._valueDb = v;
        this.control = con;
        this._curentUser = user;
    }
    pushChange(node: IChengeItemAbsolute) {
        if (this._change.length && (this.contentProp === E_RIGHT_DELO_ACCESS_CONTENT.department ||
            this.contentProp === E_RIGHT_DELO_ACCESS_CONTENT.departmentCardAuthor ||
            this.contentProp === E_RIGHT_DELO_ACCESS_CONTENT.departOrganiz ||
            this.contentProp === E_RIGHT_DELO_ACCESS_CONTENT.departmentCardAuthorSentProject ||
            this.contentProp === E_RIGHT_DELO_ACCESS_CONTENT.organiz ||
            this.contentProp === E_RIGHT_DELO_ACCESS_CONTENT.srchGroup
        )) {
            const index = this._change.findIndex((item: IChengeItemAbsolute) => item.due === node.due);
            if (index >= 0) {
                if (node.user_cl) {
                    this._transformChenge(node, index);
                    return;
                } else {
                    // start repair bug 139748
                    if (node.hasOwnProperty('user_cl')) {
                        this._change.splice(index, 1);
                        this._checkTouched();
                        return;
                    }
                    this._transformChenge(node, index);
                    // end repair bug 139748
                    return;

                }
            }
        }
        if (this._change.length && (this.contentProp === E_RIGHT_DELO_ACCESS_CONTENT.docGroup)) {
            const index = this._change.findIndex((item: IChengeItemAbsolute) => item.due === node.due);
            if (index >= 0) {
                this._transformChenge(node, index);
                return;
            }
        }
        if (this._change.length && (this.contentProp === E_RIGHT_DELO_ACCESS_CONTENT.classif)) {
            if (node.user_cl) {
                const i = this._change.findIndex((item: IChengeItemAbsolute) => item.user_cl);
                if (i >= 0) {
                    if (this._curentUser._orig['TECH_RIGHTS'] === node.data['TECH_RIGHTS']) {
                        this._change.splice(i, 1);
                        this._checkTouched();
                    } else {
                        this._change.splice(i, 1, node);
                    }
                    return;
                }
            }
            const index = this._change.findIndex((item: IChengeItemAbsolute) => item.due === node.due && item.funcNum === node.funcNum);
            if (index >= 0) {
                this._transformChenge(node, index);
                return;
            }
        }

        if (this._change.length && (this.contentProp === E_RIGHT_DELO_ACCESS_CONTENT.editOrganiz)) {
            const index = this._change.findIndex((item: IChengeItemAbsolute) => item.isn_org === node.isn_org);
            if (index >= 0) {
                this._transformChenge(node, index);
                return;
            }
        }

        this.touched = true;
        this._change.push(node);
    }
    submitWeightChanges() {
        if (this._weightChanges && this._weightChanges.length) {
            this._change.push(...this._weightChanges);
        }
    }
    sendWeightChange(query) {
        this._weightChanges.push(query);
    }
    sendWeightchangeOrg(query) {
        this.__weightChangesOrg.push(query);
    }
    addWeightChanges(node: NodeDocsTree) {
        this.touched = true;
        const nodeChange = this._weightChanges.find(ch => ch.due === node.DUE);
        if (nodeChange) {
            nodeChange.data['WEIGHT'] = node.weight;
        } else {
            this._weightChanges.push({
                method: 'MERGE',
                due: node.DUE,
                data: {
                    'WEIGHT': node.weight,
                    'FUNC_NUM': node.data.userDep['FUNC_NUM'],
                    'DEEP': node.data.userDep['DEEP'],
                },
            });
        }
    }
    checkUpdDeepWeightChanges(node: NodeDocsTree) {
        const nodeChange = this._weightChanges.find(ch => ch.due === node.DUE);
        if (nodeChange) {
            nodeChange.data['DEEP'] = node.data.userDep['DEEP'];
        }
    }
    checkWeightChanges(node: NodeDocsTree) {
        this._weightChanges = this._weightChanges.filter(ch => ch.due !== node.DUE);
        if (!this._weightChanges.length) {
            this._checkTouched();
        }
    }

    filterWeightChanges(due: string) {
        this._weightChanges = this._weightChanges.filter((_w) => _w.due !== due);
    }

    deleteChange() {
        this.touched = false;
        this._change = [];
        this._valueDb = this._value;
    }

    deleteChangesWeigth() {
        this._weightChanges = [];
    }
    saveChangesWeight(_storageSrv: EosStorageService) {
        if (this._weightChanges.length) {
            _storageSrv.setItem('ch_weight', this._weightChanges);
        }
    }

    restoreChangesWeight(_storageSrv: EosStorageService) {
        if (_storageSrv.getItem('ch_weight')) {
            this._weightChanges = _storageSrv.getItem('ch_weight');
        }
    }

    private _checkTouched() {
        if (!this._change.length) {
            this.touched = false;
        } else {
            this.touched = true;
        }
    }
    private _transformChenge(node: IChengeItemAbsolute, index: number) {
        if ((this._change[index].method === 'POST') && (node.method === 'MERGE')) {
            node.method = 'POST';
            this._change.splice(index, 1, node);
            return;
        }
        if ((this._change[index].method === 'POST') && (node.method === 'DELETE')) {
            this._change.splice(index, 1);
            this._checkTouched();
            return;
        }
        if (this._change[index].method === 'DELETE' && node.method === 'DELETE' && this.contentProp === E_RIGHT_DELO_ACCESS_CONTENT.srchGroup) {

            return;

        }
        if (this._change[index].method === 'DELETE' && node.method === 'POST' && this.contentProp === E_RIGHT_DELO_ACCESS_CONTENT.srchGroup) {
            this._change.splice(index, 1);
            this._checkTouched();
            return;
        }
        if (this._change[index].method === 'DELETE') {
            if (this.contentProp === E_RIGHT_DELO_ACCESS_CONTENT.editOrganiz) {
                this._change.splice(index, 1);
                this._checkTouched();
                return;
            } else {
                node.method = 'MERGE';
                this._change.splice(index, 1, node);
            }
            return;
        }

        if (this._change[index].method === 'MERGE' && (node.method === 'DELETE')) {
            this._change.splice(index, 1, node);
            return;
        }
        if (this._change[index].method === 'MERGE' && (node.method === 'MERGE')) {
            this._change.splice(index, 1);
            this._checkTouched();
            return;
        }
    }
}
