import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { USER_CL } from 'eos-rest';
import { UserSelectNode } from './user-node-select';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { CreateUserComponent } from './createUser/createUser.component';

@Component({
    selector: 'eos-list-user-select',
    templateUrl: 'list-user-select.component.html'
})
export class ListUserSelectComponent implements OnDestroy {
    createUserModal: BsModalRef;
    listUsers: UserSelectNode[];
    selectedUser: UserSelectNode;
    isLoading: boolean;
    isMarkNode: Boolean;
    private ngUnsubscribe: Subject<any> = new Subject();
    constructor (
        private _modalSrv: BsModalService,
        private _apiSrv: UserParamApiSrv,
        private _route: ActivatedRoute,
        private _router: Router,
    ) {
        this._route.params
            .takeUntil(this.ngUnsubscribe)
            .subscribe(param => {
                this.isLoading = true;
                this._apiSrv.getUsers(param['nodeId'])
                .then((data: USER_CL[]) => {
                    this.listUsers = this._getListUsers(data);
                    this.isLoading = false;
                });
            });
    }
    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    selectedNode(user: UserSelectNode) {
        if (this.selectedUser) {
            this.selectedUser.isSelected = false;
        }
        this.selectedUser = user;
        this.selectedUser.isSelected = true;
    }

    editUser() {
        if (this.selectedUser) {
            this._router.navigate(['user-params-set'], {
                queryParams: {isn_cl: this.selectedUser.id}
            });
        }
    }

    checkboxClick(e: Event) {
        e.stopPropagation();
    }

    markNode(e, user) {
        if (!e) {
            this._checkMarkNode();
        }
        console.log('markNode($event, user)');
    }

    createUser() {
        this.createUserModal = this._modalSrv.show(CreateUserComponent, {
            class: 'param-create-user',
            ignoreBackdropClick: true
        });
        this.createUserModal.content.closedModal.subscribe(() => {
            this.createUserModal.hide();
        });
    }
    private _getListUsers (data: USER_CL[]): UserSelectNode[] {
        const list: UserSelectNode[] = [];
        data.forEach(user => list.push(new UserSelectNode(user)));
        return list;
    }
    private _checkMarkNode() {
        let check = false;
        this.listUsers.forEach(node => {
            if (node.marked || node.selectedMark) {
                check = true;
            }
        });
        this.isMarkNode = check;
    }
}