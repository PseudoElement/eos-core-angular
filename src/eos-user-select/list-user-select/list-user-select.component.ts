import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { UserPaginationService } from 'eos-user-params/shared/services/users-pagination.service';
import { USER_CL } from 'eos-rest';
import { UserSelectNode } from './user-node-select';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { CreateUserComponent } from './createUser/createUser.component';
import {RtUserSelectService} from '../shered/services/rt-user-select.service';
import { EosSandwichService } from 'eos-dictionaries/services/eos-sandwich.service';

@Component({
    selector: 'eos-list-user-select',
    templateUrl: 'list-user-select.component.html'
})
export class ListUserSelectComponent implements OnDestroy {
    currentState: boolean[];
    createUserModal: BsModalRef;
    listUsers: UserSelectNode[];
    selectedUser: UserSelectNode;
    isLoading: boolean;
    isMarkNode: Boolean;
    titleCurrentDue: string = '';
    private ngUnsubscribe: Subject<any> = new Subject();
    constructor (
        private _modalSrv: BsModalService,
        private _apiSrv: UserParamApiSrv,
        private _pagSrv: UserPaginationService,
        private _route: ActivatedRoute,
        private _router: Router,
        private rtUserService: RtUserSelectService,
        private _sandwichSrv: EosSandwichService,
    ) {
        this._route.params
            .takeUntil(this.ngUnsubscribe)
            .subscribe(param => {
                this.isLoading = true;
                this._apiSrv.getUsers(param['nodeId'])
                .then((data: USER_CL[]) => {
                    this._apiSrv.updatePageList(data,  this._apiSrv.configList.shooseTab).then(upDate => {
                        this.listUsers = this._getListUsers(upDate);
                        if (this.listUsers && this.listUsers.length) {
                            this.selectedNode(this.listUsers[0]);
                        }
                        this.isLoading = false;
                    });
                });
            });
        this._pagSrv.NodeList$
        .takeUntil(this.ngUnsubscribe)
        .subscribe(data => {
           this._apiSrv.updatePageList(data, this._apiSrv.configList.shooseTab ).then(upDate => {
           this.listUsers  = this._getListUsers(upDate);
           });
        });
        this._sandwichSrv.currentDictState$
        .takeUntil(this.ngUnsubscribe)
        .subscribe((state: boolean[]) => {
                this.currentState = state;
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
        this.rtUserService.changeSelectedUser(user);
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
    showDeep() {
        this._apiSrv.flagAllUser = !this._apiSrv.flagAllUser;
        this._apiSrv.devideUsers();
        this._pagSrv._initPaginationConfig(true);
        this._pagSrv.changePagination(this._pagSrv.paginationConfig);
    }

    private _getListUsers (data): UserSelectNode[] {
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
