import { Component, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';
import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';
import { CONFIRM_DELETE_ROLE } from 'eos-dictionaries/consts/confirm.consts';
@Component({
    selector: 'eos-cb-user-role',
    templateUrl: 'cb-user-role.component.html',
    styleUrls: ['cb-user-role.component.scss'],
})
export class CbUserRoleComponent implements OnInit, OnDestroy {
    @Output() closeModal: EventEmitter<any> = new EventEmitter();
    basicFields: string[] = ['Председатель', 'Заместитель Председателя', 'Директор департамента и заместитель директора департамента', 'Помощник Председателя',
    'Помощник заместителя предстедателя и директоров', 'Исполнитель'];
    currentFields: string[] = [];
    fixedFields: string[] = [];
    selectedBasicRole: string;
    selectedCurrRole: string;
    selectedFixedItem: string;
    private _subscriptionDrop: Subscription;
    private _subscriptionDrag: Subscription;
    constructor(private _dragulaService: DragulaService, private _confirmSrv: ConfirmWindowService) {
    }

    ngOnInit() {
        this._subscriptionDrop = this._dragulaService.drop.subscribe((value) => {
            if (value[2].id !== value[3].id) {
                if (value[3].id === 'current') {
                    this.removeFromCurrent(value[1].innerText);
                } else {
                    this._addRole(value[1].innerText);
                }
            }
        });
        this._subscriptionDrag = this._dragulaService.drag.subscribe(() => {
            this.selectedBasicRole = null;
            this.selectedCurrRole = null;
            this.selectedFixedItem = null;
        });
    }

    ngOnDestroy() {
        if (!!this._dragulaService.find('bag-one')) {
            this._dragulaService.destroy('bag-one');
        }
        if (!!this._dragulaService.find('fixed-bag')) {
            this._dragulaService.destroy('fixed-bag');
        }
        this._subscriptionDrop.unsubscribe();
        this._subscriptionDrag.unsubscribe();
    }

    select(item, type: number) {
        switch (type) {
            case 1:
                this.selectedBasicRole = item;
                this.selectedCurrRole = null;
                this.selectedFixedItem = null;
                break;
            case 2:
                this.selectedBasicRole = null;
                this.selectedCurrRole = item;
                this.selectedFixedItem = null;
                break;
            case 3:
                this.selectedBasicRole = null;
                this.selectedCurrRole = null;
                this.selectedFixedItem = item;
                break;
        }
    }

    addToCurrent() {
        if (this.selectedBasicRole) {
            this.currentFields.push(this.selectedBasicRole);
            if (this.selectedBasicRole !== 'Помощник заместителя предстедателя и директоров' && this.selectedBasicRole !== 'Помощник Председателя') {
                this.basicFields.splice(this.basicFields.indexOf(this.selectedBasicRole), 1);
            }
            this._fixedRoles(this.selectedBasicRole, 'add');
            this.selectedBasicRole = null;
        }
    }

    removeFromCurrent(item?: string) {
        if (this.selectedCurrRole || item) {
            return this._confirmSrv.confirm(CONFIRM_DELETE_ROLE).then(res => {
                if (res) {
                    if (this.selectedCurrRole) {
                        if (this.selectedCurrRole !== 'Помощник заместителя предстедателя и директоров' && this.selectedCurrRole !== 'Помощник Председателя') {
                            this.basicFields.push(this.selectedCurrRole);
                        }
                        this.currentFields.splice(this.currentFields.indexOf(this.selectedCurrRole), 1);
                        this._fixedRoles(this.selectedCurrRole, 'del');
                        this.selectedCurrRole = null;
                    } else {
                        if (item === 'Помощник заместителя предстедателя и директоров' || item === 'Помощник Председателя') {
                            this.basicFields.splice(this.basicFields.lastIndexOf(item), 1);
                        }
                        this._fixedRoles(item, 'del');
                    }
                } else {
                    if (item) {
                        this.currentFields.push(item);
                        if (item !== 'Помощник заместителя предстедателя и директоров' && item !== 'Помощник Председателя') {
                            this.basicFields.splice(this.basicFields.indexOf(item), 1);
                        } else {
                            this.basicFields.splice(this.basicFields.lastIndexOf(item), 1);
                        }
                    }
                }
            });
        }
    }

    private _addRole(role: string) {
        this._fixedRoles(role, 'add');
        if (role === 'Помощник Председателя' || role === 'Помощник заместителя предстедателя и директоров') {
            setTimeout(() => {
                this.basicFields.push(role);
            }, 0);
        }
    }

    private _fixedRoles(role: string, typeMove: string): void {
        if (typeMove === 'add') {
            switch (role) {
                case 'Председатель':
                    this.fixedFields = this.basicFields;
                    this.basicFields = [];
                    break;
                case 'Заместитель Председателя':
                    this.fixedFields = this.basicFields;
                    this.basicFields = [];
                    break;
                case 'Директор департамента и заместитель директора департамента':
                    if (!this.fixedFields.length) {
                        this.fixedFields = this.basicFields.filter(field => field !== 'Помощник заместителя предстедателя и директоров' && field !== 'Помощник Председателя');
                        this.basicFields = this.basicFields.filter(field => field === 'Помощник заместителя предстедателя и директоров' || field === 'Помощник Председателя');
                    } else {
                        this.basicFields.splice(this.basicFields.indexOf('Исполнитель'), 1);
                        this.fixedFields.push('Исполнитель');
                    }
                    break;
                case 'Исполнитель':
                    if (!this.fixedFields.length) {
                        this.fixedFields = this.basicFields.filter(field => field !== 'Помощник заместителя предстедателя и директоров' && field !== 'Помощник Председателя');
                        this.basicFields = this.basicFields.filter(field => field === 'Помощник заместителя предстедателя и директоров' || field === 'Помощник Председателя');
                    } else {
                        this.basicFields.splice(this.basicFields.indexOf('Директор департамента и заместитель директора департамента'), 1);
                        this.fixedFields.push('Директор департамента и заместитель директора департамента');
                    }
                    break;
                case 'Помощник Председателя':
                    if (this.currentFields.indexOf('Исполнитель') === -1 && this.currentFields.indexOf('Директор департамента и заместитель директора департамента') === -1) {
                        this.fixedFields = !this.fixedFields.length ? this.basicFields.filter(field => field === 'Председатель' || field === 'Заместитель Председателя') : this.fixedFields;
                        this.basicFields = this.basicFields.filter(field => field !== 'Председатель' && field !== 'Заместитель Председателя');
                    }
                    break;
                case 'Помощник заместителя предстедателя и директоров':
                    if (this.currentFields.indexOf('Исполнитель') === -1 && this.currentFields.indexOf('Директор департамента и заместитель директора департамента') === -1) {
                        this.fixedFields = !this.fixedFields.length ? this.basicFields.filter(field => field === 'Председатель' || field === 'Заместитель Председателя') : this.fixedFields;
                        this.basicFields = this.basicFields.filter(field => field !== 'Председатель' && field !== 'Заместитель Председателя');
                    }
                    break;
            }
        } else {
            switch (role) {
                case 'Председатель':
                    this.basicFields = this.fixedFields.concat(role);
                    this.fixedFields = [];
                    break;
                case 'Заместитель Председателя':
                    this.basicFields = this.fixedFields.concat(role);
                    this.fixedFields = [];
                    break;
                case 'Директор департамента и заместитель директора департамента':
                    this.basicFields.splice(this.basicFields.indexOf('Исполнитель'), 1);
                    this.basicFields.push(role);
                    if (!this.currentFields.length) {
                        this.basicFields = this.fixedFields.concat(this.basicFields);
                        this.fixedFields = [];
                    } else {
                        this.fixedFields.splice(this.fixedFields.indexOf('Исполнитель'), 1);
                        this.basicFields.push('Исполнитель');
                    }
                    break;
                case 'Исполнитель':
                    this.basicFields.splice(this.basicFields.indexOf('Директор департамента и заместитель директора департамента'), 1);
                    this.basicFields.push(role);
                    if (!this.currentFields.length) {
                        this.basicFields = this.fixedFields.concat(this.basicFields);
                        this.fixedFields = [];
                    } else {
                        this.fixedFields.splice(this.fixedFields.indexOf('Директор департамента и заместитель директора департамента'), 1);
                        this.basicFields.push('Директор департамента и заместитель директора департамента');
                    }
                    break;
                case 'Помощник Председателя':
                    if (!this.currentFields.length) {
                        this.basicFields = this.fixedFields.concat(this.basicFields);
                        this.fixedFields = [];
                    }
                    break;
                case 'Помощник заместителя предстедателя и директоров':
                    if (!this.currentFields.length) {
                        this.basicFields = this.fixedFields.concat(this.basicFields);
                        this.fixedFields = [];
                    }
                    break;
            }
        }
    }
}
