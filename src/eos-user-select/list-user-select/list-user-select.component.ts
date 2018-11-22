import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { USER_CL } from 'eos-rest';
import { UserSelectNode } from './user-node-select';

@Component({
    selector: 'eos-list-user-select',
    templateUrl: 'list-user-select.component.html'
})
export class ListUserSelectComponent implements OnDestroy {
    listUsers: UserSelectNode[];
    selectedUser: UserSelectNode;
    isLoading: boolean;
    isMarkNode: Boolean;
    private ngUnsubscribe: Subject<any> = new Subject();
    constructor (
        private _apiSrv: UserParamApiSrv,
        private _route: ActivatedRoute,
        private _router: Router,
    ) {
        this._route.params
            .takeUntil(this.ngUnsubscribe)
            .subscribe(param => {
                this.isLoading = true;
                console.log(param['nodeId']);
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
        this.selectedUser = user;
    }

    editUser() {
        console.log('editUser()');
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
        this._router.navigate(['user-params-set'], {
            queryParams: {createNewUser: true}
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
